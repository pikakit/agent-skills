#!/usr/bin/env node
/**
 * Autopilot Metrics Collector
 * 
 * Tracks execution metrics for /autopilot and multi-phase workflows.
 * Implements the metrics schema defined in autopilot-metrics-schema.yaml.
 * 
 * Usage:
 *   import { AutopilotMetrics } from './autopilot-metrics.js';
 *   const metrics = new AutopilotMetrics(taskId);
 *   metrics.start();
 *   // ... execution ...
 *   metrics.recordPhase('phase-name', durationMs, 'success');
 *   // ... on completion ...
 *   const report = metrics.finalize();
 * 
 * @version 1.0.0
 * @author Agent Skill Kit Team
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const METRICS_DIR = path.join(__dirname, '..', 'metrics');
const METRICS_STORE = path.join(__dirname, '..', 'knowledge', 'autopilot-metrics.json');
const MAX_HISTORY = 100;  // Keep last 100 executions

/**
 * Autopilot Metrics Collector Class
 * Tracks all metrics for a single autopilot execution session
 */
export class AutopilotMetrics {
    constructor(taskId, metadata = {}) {
        this.taskId = taskId || this.generateTaskId();
        this.metadata = metadata;
        this.startTime = null;
        this.endTime = null;
        this.phases = [];
        this.errors = [];
        this.interventions = [];
        this.autoFixes = { fixed: 0, attempted: 0 };
        this.agentInvocations = [];
        this.skillInvocations = [];
        this.retryCount = 0;
        this.checkpoints = [];
    }

    /**
     * Generate unique task ID
     */
    generateTaskId() {
        const timestamp = Date.now().toString(36);
        const random = Math.random().toString(36).substring(2, 8);
        return `AP-${timestamp}-${random}`;
    }

    /**
     * Start tracking execution
     */
    start() {
        this.startTime = Date.now();
        this.log('Metrics collection started', { taskId: this.taskId });
        return this;
    }

    /**
     * Record phase completion
     */
    recordPhase(phaseName, durationMs, status, details = {}) {
        const phase = {
            name: phaseName,
            duration: durationMs,
            status,
            timestamp: Date.now(),
            ...details
        };
        this.phases.push(phase);

        // Check phase transition time
        if (this.phases.length > 1) {
            const prevPhase = this.phases[this.phases.length - 2];
            const transitionTime = phase.timestamp - (prevPhase.timestamp + prevPhase.duration);
            if (transitionTime > 2000) {
                this.log('SLO Warning: Phase transition >2s', { transitionTime });
            }
        }

        return this;
    }

    /**
     * Record error occurrence
     */
    recordError(error, wasAutoFixed = false) {
        this.errors.push({
            message: error.message || String(error),
            type: error.name || 'UnknownError',
            wasAutoFixed,
            timestamp: Date.now()
        });

        if (wasAutoFixed) {
            this.autoFixes.fixed++;
        }
        this.autoFixes.attempted++;

        return this;
    }

    /**
     * Record human intervention
     */
    recordIntervention(reason, type = 'approval') {
        this.interventions.push({
            reason,
            type,
            timestamp: Date.now()
        });
        return this;
    }

    /**
     * Record agent invocation
     */
    recordAgentInvocation(agentName, taskDescription, durationMs, status) {
        this.agentInvocations.push({
            agent: agentName,
            task: taskDescription,
            duration: durationMs,
            status,
            timestamp: Date.now()
        });
        return this;
    }

    /**
     * Record skill invocation
     */
    recordSkillInvocation(skillName, wasReused = false) {
        this.skillInvocations.push({
            skill: skillName,
            wasReused,
            timestamp: Date.now()
        });
        return this;
    }

    /**
     * Record retry attempt
     */
    recordRetry(reason) {
        this.retryCount++;
        this.log('Retry recorded', { count: this.retryCount, reason });
        return this;
    }

    /**
     * Record checkpoint
     */
    recordCheckpoint(checkpointId, files) {
        this.checkpoints.push({
            id: checkpointId,
            files,
            timestamp: Date.now()
        });
        return this;
    }

    /**
     * Internal logging
     */
    log(message, data = {}) {
        const entry = {
            timestamp: new Date().toISOString(),
            taskId: this.taskId,
            message,
            ...data
        };
        // Console log for debugging (can be disabled in production)
        if (process.env.DEBUG_METRICS) {
            console.log('[METRICS]', JSON.stringify(entry));
        }
    }

    /**
     * Calculate all derived metrics
     */
    calculateMetrics() {
        const totalDuration = this.endTime - this.startTime;

        // Phase metrics
        const successfulPhases = this.phases.filter(p => p.status === 'success').length;
        const failedPhases = this.phases.filter(p => p.status === 'error').length;

        // Error metrics
        const totalErrors = this.errors.length;
        const autoFixedErrors = this.errors.filter(e => e.wasAutoFixed).length;
        const autoFixRate = this.autoFixes.attempted > 0
            ? (this.autoFixes.fixed / this.autoFixes.attempted) * 100
            : 100;

        // Intervention metrics
        const humanInterventions = this.interventions.length;
        const approvalPrompts = this.interventions.filter(i => i.type === 'approval').length;

        // Skill metrics
        const uniqueSkills = new Set(this.skillInvocations.map(s => s.skill)).size;
        const reusedSkills = this.skillInvocations.filter(s => s.wasReused).length;
        const skillReuseRatio = this.skillInvocations.length > 0
            ? (reusedSkills / this.skillInvocations.length) * 100
            : 0;

        // Quality metrics
        const firstTimeSuccess = failedPhases === 0 && this.retryCount === 0;
        const errorRate = this.phases.length > 0
            ? (failedPhases / this.phases.length) * 100
            : 0;

        // Agent decision depth
        const agentDecisionDepth = this.calculateAgentDepth();

        return {
            // Speed
            totalDuration,
            averagePhaseTime: this.phases.length > 0
                ? totalDuration / this.phases.length
                : 0,

            // Intervention
            humanInterventions,
            approvalPrompts,

            // Autonomy
            autonomousCompletionRate: humanInterventions === 0 ? 100 : 0,
            autoFixRate,

            // Quality
            firstTimeSuccess,
            errorRate,
            retryCount: this.retryCount,

            // Learning
            agentDecisionDepth,
            skillReuseRatio,

            // Raw counts
            totalPhases: this.phases.length,
            successfulPhases,
            failedPhases,
            totalErrors,
            autoFixedErrors,
            uniqueSkillsUsed: uniqueSkills,
            totalSkillInvocations: this.skillInvocations.length,
            checkpointsCreated: this.checkpoints.length
        };
    }

    /**
     * Calculate agent decision depth (max chain length)
     */
    calculateAgentDepth() {
        // Simplified: count unique agents invoked
        // In real implementation, would trace agent → agent delegation
        const agents = new Set(this.agentInvocations.map(a => a.agent));
        return agents.size;
    }

    /**
     * Finalize and save metrics
     */
    finalize() {
        this.endTime = Date.now();
        const calculatedMetrics = this.calculateMetrics();

        const report = {
            taskId: this.taskId,
            metadata: this.metadata,
            timestamp: new Date().toISOString(),
            startTime: new Date(this.startTime).toISOString(),
            endTime: new Date(this.endTime).toISOString(),
            metrics: calculatedMetrics,
            phases: this.phases,
            errors: this.errors,
            interventions: this.interventions,
            agentInvocations: this.agentInvocations,
            skillInvocations: this.skillInvocations,
            checkpoints: this.checkpoints
        };

        // Save to store
        this.saveToStore(report);

        // Generate comparison if baseline exists
        report.comparison = this.compareToBaseline(calculatedMetrics);

        return report;
    }

    /**
     * Save metrics to persistent store
     */
    saveToStore(report) {
        try {
            let store = { executions: [], baseline: null };

            if (fs.existsSync(METRICS_STORE)) {
                store = JSON.parse(fs.readFileSync(METRICS_STORE, 'utf-8'));
            }

            // Add new execution
            store.executions.unshift(report);

            // Trim to max history
            if (store.executions.length > MAX_HISTORY) {
                store.executions = store.executions.slice(0, MAX_HISTORY);
            }

            // Update baseline if first execution or significantly better
            if (!store.baseline || this.isBetterThanBaseline(report.metrics, store.baseline)) {
                store.baseline = report.metrics;
                store.baselineTimestamp = report.timestamp;
            }

            // Ensure directory exists
            const dir = path.dirname(METRICS_STORE);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(METRICS_STORE, JSON.stringify(store, null, 2));
            this.log('Metrics saved', { taskId: this.taskId });

        } catch (error) {
            this.log('Failed to save metrics', { error: error.message });
        }
    }

    /**
     * Check if current metrics are better than baseline
     */
    isBetterThanBaseline(current, baseline) {
        if (!baseline) return true;

        // Better means: lower duration, higher success rate, fewer interventions
        const durationBetter = current.totalDuration < baseline.totalDuration * 0.9;
        const successBetter = current.firstTimeSuccess && !baseline.firstTimeSuccess;
        const interventionsBetter = current.humanInterventions < baseline.humanInterventions;

        return (durationBetter && successBetter) || (successBetter && interventionsBetter);
    }

    /**
     * Compare current metrics to baseline
     */
    compareToBaseline(current) {
        try {
            if (!fs.existsSync(METRICS_STORE)) {
                return { hasBaseline: false };
            }

            const store = JSON.parse(fs.readFileSync(METRICS_STORE, 'utf-8'));
            if (!store.baseline) {
                return { hasBaseline: false };
            }

            const baseline = store.baseline;

            return {
                hasBaseline: true,
                baselineTimestamp: store.baselineTimestamp,
                changes: {
                    duration: {
                        baseline: baseline.totalDuration,
                        current: current.totalDuration,
                        change: ((current.totalDuration - baseline.totalDuration) / baseline.totalDuration * 100).toFixed(1),
                        improved: current.totalDuration < baseline.totalDuration
                    },
                    interventions: {
                        baseline: baseline.humanInterventions,
                        current: current.humanInterventions,
                        change: current.humanInterventions - baseline.humanInterventions,
                        improved: current.humanInterventions < baseline.humanInterventions
                    },
                    autoFixRate: {
                        baseline: baseline.autoFixRate,
                        current: current.autoFixRate,
                        change: (current.autoFixRate - baseline.autoFixRate).toFixed(1),
                        improved: current.autoFixRate > baseline.autoFixRate
                    },
                    firstTimeSuccess: {
                        baseline: baseline.firstTimeSuccess,
                        current: current.firstTimeSuccess,
                        improved: current.firstTimeSuccess && !baseline.firstTimeSuccess
                    }
                }
            };
        } catch (error) {
            return { hasBaseline: false, error: error.message };
        }
    }

    /**
     * Generate formatted report for output
     */
    generateReport() {
        const report = this.finalize();
        const m = report.metrics;

        let output = `
## 📊 Autopilot Execution Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| **Duration** | ${(m.totalDuration / 1000).toFixed(1)}s | <300s | ${m.totalDuration < 300000 ? '✅' : '⚠️'} |
| **Interventions** | ${m.humanInterventions} | 0 | ${m.humanInterventions === 0 ? '✅' : '⚠️'} |
| **First-Time Success** | ${m.firstTimeSuccess ? 'Yes' : 'No'} | Yes | ${m.firstTimeSuccess ? '✅' : '❌'} |
| **Auto-Fix Rate** | ${m.autoFixRate.toFixed(0)}% | >85% | ${m.autoFixRate > 85 ? '✅' : '⚠️'} |
| **Phases** | ${m.successfulPhases}/${m.totalPhases} success | 100% | ${m.failedPhases === 0 ? '✅' : '❌'} |
| **Retries** | ${m.retryCount} | <2 | ${m.retryCount < 2 ? '✅' : '⚠️'} |
`;

        if (report.comparison.hasBaseline) {
            const c = report.comparison.changes;
            output += `
### Comparison to Baseline

| Metric | Before | After | Change |
|--------|--------|-------|--------|
| Duration | ${(c.duration.baseline / 1000).toFixed(1)}s | ${(c.duration.current / 1000).toFixed(1)}s | ${c.duration.improved ? '🎉 ' : ''}${c.duration.change}% |
| Interventions | ${c.interventions.baseline} | ${c.interventions.current} | ${c.interventions.improved ? '🎉 ' : ''}${c.interventions.change > 0 ? '+' : ''}${c.interventions.change} |
| Auto-Fix Rate | ${c.autoFixRate.baseline?.toFixed(0) || 'N/A'}% | ${c.autoFixRate.current?.toFixed(0)}% | ${c.autoFixRate.improved ? '🎉 ' : ''}${c.autoFixRate.change}% |
`;
        }

        return output.trim();
    }
}

/**
 * CLI interface for metrics collector
 */
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';

    switch (command) {
        case 'show':
            showMetrics();
            break;
        case 'trends':
            showTrends();
            break;
        case 'reset':
            resetMetrics();
            break;
        case 'help':
        default:
            console.log(`
Autopilot Metrics Collector

Commands:
  show    - Show current metrics summary
  trends  - Show metrics trends over time
  reset   - Reset metrics store (careful!)
  help    - Show this help

Programmatic usage:
  import { AutopilotMetrics } from './autopilot-metrics.js';
  const metrics = new AutopilotMetrics('task-id');
  metrics.start();
  // ... execution ...
  metrics.finalize();
`);
    }
}

function showMetrics() {
    if (!fs.existsSync(METRICS_STORE)) {
        console.log('No metrics data found. Run autopilot to collect metrics.');
        return;
    }

    const store = JSON.parse(fs.readFileSync(METRICS_STORE, 'utf-8'));

    console.log('\n📊 Autopilot Metrics Summary\n');
    console.log(`Total Executions: ${store.executions.length}`);

    if (store.baseline) {
        console.log('\n📈 Current Baseline:');
        console.log(`  Duration: ${(store.baseline.totalDuration / 1000).toFixed(1)}s`);
        console.log(`  First-Time Success: ${store.baseline.firstTimeSuccess}`);
        console.log(`  Human Interventions: ${store.baseline.humanInterventions}`);
        console.log(`  Auto-Fix Rate: ${store.baseline.autoFixRate?.toFixed(0)}%`);
    }

    if (store.executions.length > 0) {
        const latest = store.executions[0];
        console.log('\n🕐 Latest Execution:');
        console.log(`  Task ID: ${latest.taskId}`);
        console.log(`  Timestamp: ${latest.timestamp}`);
        console.log(`  Duration: ${(latest.metrics.totalDuration / 1000).toFixed(1)}s`);
        console.log(`  Status: ${latest.metrics.firstTimeSuccess ? '✅ Success' : '⚠️ Had issues'}`);
    }
}

function showTrends() {
    if (!fs.existsSync(METRICS_STORE)) {
        console.log('No metrics data found.');
        return;
    }

    const store = JSON.parse(fs.readFileSync(METRICS_STORE, 'utf-8'));
    const executions = store.executions.slice(0, 10);  // Last 10

    console.log('\n📈 Metrics Trends (Last 10 Executions)\n');

    // Duration trend
    console.log('Duration (s):');
    const durations = executions.map(e => e.metrics.totalDuration / 1000);
    console.log(generateSparkline(durations));

    // Success trend
    console.log('\nFirst-Time Success:');
    const successes = executions.map(e => e.metrics.firstTimeSuccess ? 1 : 0);
    console.log(generateSparkline(successes));

    // Intervention trend
    console.log('\nInterventions:');
    const interventions = executions.map(e => e.metrics.humanInterventions);
    console.log(generateSparkline(interventions));
}

function generateSparkline(values) {
    const chars = '▁▂▃▄▅▆▇█';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;

    return values.map(v => {
        const index = Math.floor(((v - min) / range) * (chars.length - 1));
        return chars[index];
    }).join('') + ` (${values[0]?.toFixed(1)} → ${values[values.length - 1]?.toFixed(1)})`;
}

function resetMetrics() {
    if (fs.existsSync(METRICS_STORE)) {
        const backup = METRICS_STORE + '.backup.' + Date.now();
        fs.copyFileSync(METRICS_STORE, backup);
        fs.writeFileSync(METRICS_STORE, JSON.stringify({ executions: [], baseline: null }, null, 2));
        console.log(`Metrics reset. Backup saved to: ${backup}`);
    } else {
        console.log('No metrics to reset.');
    }
}

// Export for programmatic use
export { showMetrics, showTrends, resetMetrics };

// Run CLI if executed directly
if (process.argv[1] === __filename) {
    main().catch(console.error);
}
