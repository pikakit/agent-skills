/**
 * @fileoverview Autopilot Metrics Collector
 * Collects, calculates, and stores metrics for /autopilot workflow
 * Based on autopilot-metrics-schema.yaml
 */

const fs = require("fs");
const path = require("path");

class MetricsCollector {
    constructor(options = {}) {
        this.taskId = null;
        this.startTime = null;
        this.events = [];
        this.phases = [];
        this.errors = [];
        this.interventions = [];
        this.isActive = false;

        // Configuration
        this.metricsDir = options.metricsDir || path.join(process.cwd(), ".agent", "metrics");
        this.runsDir = path.join(this.metricsDir, "runs");
        this.baselinePath = path.join(this.metricsDir, "baseline.json");
        this.maxRuns = options.maxRuns || 30; // Keep last 30 runs

        // Ensure directories exist
        this._ensureDirectories();
    }

    /**
     * Start metrics collection for a task
     * @param {string} taskId - Task identifier
     * @returns {MetricsCollector} - this for chaining
     */
    start(taskId) {
        if (this.isActive) {
            console.warn("MetricsCollector: Already active, resetting...");
        }

        this.taskId = taskId || `task-${Date.now()}`;
        this.startTime = Date.now();
        this.events = [];
        this.phases = [];
        this.errors = [];
        this.interventions = [];
        this.isActive = true;

        this._recordEvent("autopilot_start", {
            task_id: this.taskId,
            timestamp: new Date().toISOString()
        });

        return this;
    }

    /**
     * Record phase completion
     * @param {string} phaseName - Name of the phase
     * @param {number} durationMs - Duration in milliseconds
     * @param {string} status - "success" | "failed" | "skipped"
     * @returns {MetricsCollector}
     */
    recordPhaseComplete(phaseName, durationMs, status = "success") {
        if (!this.isActive) {
            console.warn("MetricsCollector: Not active, call start() first");
            return this;
        }

        const phase = {
            name: phaseName,
            duration_ms: durationMs,
            status: status,
            timestamp: new Date().toISOString()
        };

        this.phases.push(phase);
        this._recordEvent("phase_complete", phase);

        return this;
    }

    /**
     * Record an error occurrence
     * @param {string} errorType - Type of error
     * @param {boolean} wasAutoFixed - Whether the error was automatically fixed
     * @param {string} details - Additional details
     * @returns {MetricsCollector}
     */
    recordError(errorType, wasAutoFixed = false, details = "") {
        if (!this.isActive) return this;

        const error = {
            type: errorType,
            was_auto_fixed: wasAutoFixed,
            details: details,
            timestamp: new Date().toISOString()
        };

        this.errors.push(error);
        this._recordEvent("error", error);

        return this;
    }

    /**
     * Record a human intervention
     * @param {string} reason - Reason for intervention
     * @returns {MetricsCollector}
     */
    recordIntervention(reason) {
        if (!this.isActive) return this;

        const intervention = {
            reason: reason,
            timestamp: new Date().toISOString()
        };

        this.interventions.push(intervention);
        this._recordEvent("intervention", intervention);

        return this;
    }

    /**
     * Complete metrics collection and save results
     * @returns {Object} - Final metrics object
     */
    complete() {
        if (!this.isActive) {
            console.warn("MetricsCollector: Not active");
            return null;
        }

        const endTime = Date.now();
        const totalDuration = endTime - this.startTime;

        this._recordEvent("autopilot_complete", {
            total_duration_ms: totalDuration,
            timestamp: new Date().toISOString()
        });

        const metrics = this._calculateMetrics(totalDuration);
        const baseline = this._loadBaseline();
        const comparison = baseline ? this._compareToBaseline(metrics, baseline) : null;

        const result = {
            task_id: this.taskId,
            timestamp: new Date().toISOString(),
            duration_ms: totalDuration,
            metrics: metrics,
            comparison: comparison,
            events: this.events,
            phases: this.phases,
            errors: this.errors,
            interventions: this.interventions
        };

        // Save to file
        this._saveRun(result);

        // Cleanup old runs
        this._cleanupOldRuns();

        this.isActive = false;

        return result;
    }

    /**
     * Get current metrics (without completing)
     * @returns {Object}
     */
    getMetrics() {
        if (!this.isActive) return null;

        const currentDuration = Date.now() - this.startTime;
        return this._calculateMetrics(currentDuration);
    }

    /**
     * Set current run as baseline
     * @param {Object} metrics - Metrics to use as baseline
     * @returns {boolean}
     */
    setBaseline(metrics = null) {
        try {
            const baseline = metrics || this.getMetrics();
            if (!baseline) {
                console.error("MetricsCollector: No metrics to set as baseline");
                return false;
            }

            fs.writeFileSync(
                this.baselinePath,
                JSON.stringify(baseline, null, 2),
                "utf8"
            );
            return true;
        } catch (err) {
            console.error("MetricsCollector: Failed to set baseline", err.message);
            return false;
        }
    }

    /**
     * List all saved runs
     * @returns {Array}
     */
    listRuns() {
        try {
            if (!fs.existsSync(this.runsDir)) return [];

            return fs.readdirSync(this.runsDir)
                .filter(f => f.endsWith(".json"))
                .sort()
                .reverse()
                .map(f => {
                    const filePath = path.join(this.runsDir, f);
                    try {
                        const content = JSON.parse(fs.readFileSync(filePath, "utf8"));
                        return {
                            id: f.replace(".json", ""),
                            task_id: content.task_id,
                            timestamp: content.timestamp,
                            duration_ms: content.duration_ms,
                            metrics_summary: {
                                time_to_completion: content.metrics?.speed?.time_to_completion,
                                human_interventions: content.metrics?.intervention?.human_interventions,
                                first_time_success_rate: content.metrics?.quality?.first_time_success_rate
                            }
                        };
                    } catch {
                        return { id: f.replace(".json", ""), error: "parse_failed" };
                    }
                });
        } catch (err) {
            console.error("MetricsCollector: Failed to list runs", err.message);
            return [];
        }
    }

    /**
     * Load a specific run
     * @param {string} runId - Run ID (filename without .json)
     * @returns {Object|null}
     */
    loadRun(runId) {
        try {
            const filePath = path.join(this.runsDir, `${runId}.json`);
            if (!fs.existsSync(filePath)) return null;
            return JSON.parse(fs.readFileSync(filePath, "utf8"));
        } catch (err) {
            console.error("MetricsCollector: Failed to load run", err.message);
            return null;
        }
    }

    // === PRIVATE METHODS ===

    _ensureDirectories() {
        try {
            if (!fs.existsSync(this.metricsDir)) {
                fs.mkdirSync(this.metricsDir, { recursive: true });
            }
            if (!fs.existsSync(this.runsDir)) {
                fs.mkdirSync(this.runsDir, { recursive: true });
            }
        } catch (err) {
            console.error("MetricsCollector: Failed to create directories", err.message);
        }
    }

    _recordEvent(type, data) {
        this.events.push({
            type: type,
            data: data,
            timestamp: new Date().toISOString()
        });
    }

    _calculateMetrics(totalDurationMs) {
        const totalPhases = this.phases.length;
        const successPhases = this.phases.filter(p => p.status === "success").length;
        const totalErrors = this.errors.length;
        const autoFixedErrors = this.errors.filter(e => e.was_auto_fixed).length;

        return {
            speed: {
                time_to_completion: Math.round(totalDurationMs / 1000), // seconds
                phase_transition_time: this._avgPhaseTransition(),
                total_phases: totalPhases
            },
            intervention: {
                human_interventions: this.interventions.length,
                intervention_reasons: this.interventions.map(i => i.reason)
            },
            autonomy: {
                autonomous_completion_rate: totalPhases > 0
                    ? Math.round((successPhases / totalPhases) * 100)
                    : 100,
                auto_fix_coverage: totalErrors > 0
                    ? Math.round((autoFixedErrors / totalErrors) * 100)
                    : 100
            },
            quality: {
                first_time_success_rate: this._calculateFirstTimeSuccess(),
                error_count: totalErrors,
                retry_count: this.phases.filter(p => p.status === "retry").length,
                ide_problems_at_completion: 0 // Will be set externally
            }
        };
    }

    _avgPhaseTransition() {
        if (this.phases.length < 2) return 0;

        let totalGap = 0;
        for (let i = 1; i < this.phases.length; i++) {
            const prevEnd = new Date(this.phases[i - 1].timestamp).getTime();
            const currStart = prevEnd + this.phases[i - 1].duration_ms;
            const gap = new Date(this.phases[i].timestamp).getTime() - currStart;
            totalGap += Math.max(0, gap);
        }

        return Math.round(totalGap / (this.phases.length - 1));
    }

    _calculateFirstTimeSuccess() {
        // Success if completed without retries or errors
        const hasRetries = this.phases.some(p => p.status === "retry");
        const hasUnfixedErrors = this.errors.some(e => !e.was_auto_fixed);

        if (!hasRetries && !hasUnfixedErrors && this.interventions.length === 0) {
            return 100;
        }

        // Partial success calculation
        const penalty = (hasRetries ? 20 : 0) +
            (hasUnfixedErrors ? 30 : 0) +
            (this.interventions.length * 10);
        return Math.max(0, 100 - penalty);
    }

    _loadBaseline() {
        try {
            if (!fs.existsSync(this.baselinePath)) return null;
            return JSON.parse(fs.readFileSync(this.baselinePath, "utf8"));
        } catch {
            return null;
        }
    }

    _compareToBaseline(current, baseline) {
        const compare = (curr, base, lower_is_better = true) => {
            if (base === 0 || base === undefined) return { value: curr, change: null };
            const diff = ((curr - base) / base) * 100;
            const improved = lower_is_better ? diff < 0 : diff > 0;
            return {
                value: curr,
                baseline: base,
                change_percent: Math.round(diff),
                improved: improved
            };
        };

        return {
            speed: {
                time_to_completion: compare(
                    current.speed.time_to_completion,
                    baseline.speed?.time_to_completion,
                    true // lower is better
                )
            },
            intervention: {
                human_interventions: compare(
                    current.intervention.human_interventions,
                    baseline.intervention?.human_interventions,
                    true
                )
            },
            autonomy: {
                autonomous_completion_rate: compare(
                    current.autonomy.autonomous_completion_rate,
                    baseline.autonomy?.autonomous_completion_rate,
                    false // higher is better
                )
            },
            quality: {
                first_time_success_rate: compare(
                    current.quality.first_time_success_rate,
                    baseline.quality?.first_time_success_rate,
                    false
                )
            }
        };
    }

    _saveRun(result) {
        try {
            const timestamp = new Date().toISOString().replace(/[:.]/g, "-").slice(0, 19);
            const filename = `${timestamp}-${this.taskId.replace(/[^a-z0-9]/gi, "-")}.json`;
            const filePath = path.join(this.runsDir, filename);

            fs.writeFileSync(filePath, JSON.stringify(result, null, 2), "utf8");
            console.log(`MetricsCollector: Saved run to ${filename}`);

            return filename;
        } catch (err) {
            console.error("MetricsCollector: Failed to save run", err.message);
            return null;
        }
    }

    _cleanupOldRuns() {
        try {
            const files = fs.readdirSync(this.runsDir)
                .filter(f => f.endsWith(".json"))
                .sort()
                .reverse();

            if (files.length > this.maxRuns) {
                const toDelete = files.slice(this.maxRuns);
                for (const file of toDelete) {
                    fs.unlinkSync(path.join(this.runsDir, file));
                }
                console.log(`MetricsCollector: Cleaned up ${toDelete.length} old runs`);
            }
        } catch (err) {
            // Non-fatal
        }
    }
}

// === CLI INTERFACE ===
// Can be run as: node metrics-collector.js <command> [args]

if (require.main === module) {
    const args = process.argv.slice(2);
    const command = args[0];
    const collector = new MetricsCollector();

    switch (command) {
        case "start":
            const taskId = args[1] || `cli-${Date.now()}`;
            collector.start(taskId);
            console.log(JSON.stringify({ status: "started", task_id: taskId }));
            break;

        case "list":
            const runs = collector.listRuns();
            console.log(JSON.stringify(runs, null, 2));
            break;

        case "view":
            const runId = args[1];
            if (!runId) {
                console.error("Usage: node metrics-collector.js view <runId>");
                process.exit(1);
            }
            const run = collector.loadRun(runId);
            console.log(JSON.stringify(run, null, 2));
            break;

        case "baseline":
            const latestRuns = collector.listRuns();
            if (latestRuns.length === 0) {
                console.error("No runs to set as baseline");
                process.exit(1);
            }
            const latestRun = collector.loadRun(latestRuns[0].id);
            if (latestRun && collector.setBaseline(latestRun.metrics)) {
                console.log("Baseline set from latest run");
            }
            break;

        default:
            console.log(`
Autopilot Metrics Collector

Usage:
  node metrics-collector.js start [taskId]  - Start collecting metrics
  node metrics-collector.js list            - List all runs
  node metrics-collector.js view <runId>    - View a specific run
  node metrics-collector.js baseline        - Set latest run as baseline
            `);
    }
}

module.exports = { MetricsCollector };
