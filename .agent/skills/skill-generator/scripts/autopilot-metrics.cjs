/**
 * @fileoverview Autopilot Metrics Wrapper
 * Easy-to-use wrapper for MetricsCollector in autopilot workflows
 * 
 * Usage in workflows:
 *   // turbo
 *   node .agent/skills/skill-generator/scripts/autopilot-metrics.js start "task-name"
 *   
 *   // ... execute phases ...
 *   node .agent/skills/skill-generator/scripts/autopilot-metrics.js phase "planning" 1200 success
 *   
 *   // At end:
 *   node .agent/skills/skill-generator/scripts/autopilot-metrics.js complete
 */

const fs = require("fs");
const path = require("path");

// Import MetricsCollector
const { MetricsCollector } = require("../lib/metrics-collector.cjs");

// State file for persisting collector state between calls
const STATE_FILE = path.join(process.cwd(), ".agent", "metrics", ".current-run.json");

/**
 * Load or create collector with saved state
 */
function getCollector() {
    const collector = new MetricsCollector();

    if (fs.existsSync(STATE_FILE)) {
        try {
            const state = JSON.parse(fs.readFileSync(STATE_FILE, "utf8"));
            collector.taskId = state.taskId;
            collector.startTime = state.startTime;
            collector.events = state.events || [];
            collector.phases = state.phases || [];
            collector.errors = state.errors || [];
            collector.interventions = state.interventions || [];
            collector.isActive = state.isActive;
        } catch (err) {
            console.error("Failed to load state:", err.message);
        }
    }

    return collector;
}

/**
 * Save collector state for next call
 */
function saveState(collector) {
    try {
        const state = {
            taskId: collector.taskId,
            startTime: collector.startTime,
            events: collector.events,
            phases: collector.phases,
            errors: collector.errors,
            interventions: collector.interventions,
            isActive: collector.isActive
        };

        // Ensure directory exists
        const dir = path.dirname(STATE_FILE);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(STATE_FILE, JSON.stringify(state, null, 2), "utf8");
    } catch (err) {
        console.error("Failed to save state:", err.message);
    }
}

/**
 * Clear state file
 */
function clearState() {
    try {
        if (fs.existsSync(STATE_FILE)) {
            fs.unlinkSync(STATE_FILE);
        }
    } catch (err) {
        // Ignore
    }
}

// === CLI COMMANDS ===

const [, , command, ...args] = process.argv;

switch (command) {
    case "start": {
        const taskId = args[0] || `autopilot-${Date.now()}`;
        const collector = new MetricsCollector();
        collector.start(taskId);
        saveState(collector);
        console.log(JSON.stringify({
            action: "started",
            task_id: taskId,
            timestamp: new Date().toISOString()
        }));
        break;
    }

    case "phase": {
        const [phaseName, durationMs, status = "success"] = args;
        if (!phaseName) {
            console.error("Usage: node autopilot-metrics.js phase <name> <duration_ms> [status]");
            process.exit(1);
        }

        const collector = getCollector();
        if (!collector.isActive) {
            console.error("No active run. Call 'start' first.");
            process.exit(1);
        }

        collector.recordPhaseComplete(phaseName, parseInt(durationMs) || 0, status);
        saveState(collector);
        console.log(JSON.stringify({
            action: "phase_recorded",
            phase: phaseName,
            duration_ms: parseInt(durationMs) || 0,
            status: status,
            total_phases: collector.phases.length
        }));
        break;
    }

    case "error": {
        const [errorType, wasAutoFixed = "false", details = ""] = args;
        if (!errorType) {
            console.error("Usage: node autopilot-metrics.js error <type> [wasAutoFixed] [details]");
            process.exit(1);
        }

        const collector = getCollector();
        if (!collector.isActive) {
            console.error("No active run. Call 'start' first.");
            process.exit(1);
        }

        collector.recordError(errorType, wasAutoFixed === "true", details);
        saveState(collector);
        console.log(JSON.stringify({
            action: "error_recorded",
            type: errorType,
            was_auto_fixed: wasAutoFixed === "true",
            total_errors: collector.errors.length
        }));
        break;
    }

    case "intervention": {
        const reason = args.join(" ") || "User intervention";

        const collector = getCollector();
        if (!collector.isActive) {
            console.error("No active run. Call 'start' first.");
            process.exit(1);
        }

        collector.recordIntervention(reason);
        saveState(collector);
        console.log(JSON.stringify({
            action: "intervention_recorded",
            reason: reason,
            total_interventions: collector.interventions.length
        }));
        break;
    }

    case "complete": {
        const collector = getCollector();
        if (!collector.isActive) {
            console.error("No active run to complete.");
            process.exit(1);
        }

        const result = collector.complete();
        clearState();

        // Print summary
        console.log("\n📊 AUTOPILOT METRICS SUMMARY");
        console.log("═══════════════════════════════════════");
        console.log(`Task: ${result.task_id}`);
        console.log(`Duration: ${result.metrics.speed.time_to_completion}s`);
        console.log(`Phases: ${result.metrics.speed.total_phases}`);
        console.log(`Interventions: ${result.metrics.intervention.human_interventions}`);
        console.log(`Autonomy Rate: ${result.metrics.autonomy.autonomous_completion_rate}%`);
        console.log(`Success Rate: ${result.metrics.quality.first_time_success_rate}%`);

        if (result.comparison) {
            console.log("\n📈 VS BASELINE:");
            const tc = result.comparison.speed?.time_to_completion;
            if (tc && tc.change_percent !== null) {
                const arrow = tc.improved ? "↓" : "↑";
                console.log(`  Time: ${arrow} ${Math.abs(tc.change_percent)}% vs baseline`);
            }
        }

        console.log("═══════════════════════════════════════\n");
        console.log(JSON.stringify(result, null, 2));
        break;
    }

    case "status": {
        const collector = getCollector();
        if (!collector.isActive) {
            console.log(JSON.stringify({ active: false }));
        } else {
            const metrics = collector.getMetrics();
            console.log(JSON.stringify({
                active: true,
                task_id: collector.taskId,
                elapsed_ms: Date.now() - collector.startTime,
                phases_completed: collector.phases.length,
                errors: collector.errors.length,
                interventions: collector.interventions.length,
                current_metrics: metrics
            }, null, 2));
        }
        break;
    }

    case "list": {
        const collector = new MetricsCollector();
        const runs = collector.listRuns();

        console.log("\n📋 SAVED RUNS");
        console.log("═══════════════════════════════════════");

        if (runs.length === 0) {
            console.log("No runs saved yet.");
        } else {
            for (const run of runs.slice(0, 10)) {
                const summary = run.metrics_summary || {};
                console.log(`\n${run.timestamp}`);
                console.log(`  Task: ${run.task_id}`);
                console.log(`  Duration: ${summary.time_to_completion || "?"}s`);
                console.log(`  Interventions: ${summary.human_interventions || 0}`);
            }
        }

        console.log("═══════════════════════════════════════\n");
        break;
    }

    case "baseline": {
        const collector = new MetricsCollector();
        const runs = collector.listRuns();

        if (runs.length === 0) {
            console.error("No runs to set as baseline.");
            process.exit(1);
        }

        const latestRun = collector.loadRun(runs[0].id);
        if (latestRun && collector.setBaseline(latestRun.metrics)) {
            console.log("✅ Baseline set from latest run:");
            console.log(`   Task: ${latestRun.task_id}`);
            console.log(`   Time: ${latestRun.metrics.speed.time_to_completion}s`);
        }
        break;
    }

    default:
        console.log(`
╔═══════════════════════════════════════════════════════════════╗
║           AUTOPILOT METRICS - Command Reference               ║
╠═══════════════════════════════════════════════════════════════╣
║                                                               ║
║  START A RUN:                                                 ║
║    node autopilot-metrics.js start <task-name>                ║
║                                                               ║
║  RECORD PHASE:                                                ║
║    node autopilot-metrics.js phase <name> <duration_ms> [status]║
║    status: success | failed | skipped                         ║
║                                                               ║
║  RECORD ERROR:                                                ║
║    node autopilot-metrics.js error <type> [wasAutoFixed] [details]║
║                                                               ║
║  RECORD INTERVENTION:                                         ║
║    node autopilot-metrics.js intervention <reason>            ║
║                                                               ║
║  COMPLETE RUN:                                                ║
║    node autopilot-metrics.js complete                         ║
║                                                               ║
║  VIEW STATUS:                                                 ║
║    node autopilot-metrics.js status                           ║
║                                                               ║
║  LIST RUNS:                                                   ║
║    node autopilot-metrics.js list                             ║
║                                                               ║
║  SET BASELINE:                                                ║
║    node autopilot-metrics.js baseline                         ║
║                                                               ║
╚═══════════════════════════════════════════════════════════════╝
        `);
}
