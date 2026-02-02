/**
 * @fileoverview Unit tests for MetricsCollector
 */

import { describe, it, expect, beforeEach, afterEach } from "vitest";
import { createRequire } from "module";
const require = createRequire(import.meta.url);

const { MetricsCollector } = require("../lib/metrics-collector.cjs");
const fs = require("fs");
const path = require("path");
const os = require("os");

describe("MetricsCollector", () => {
    let collector;
    let testDir;

    beforeEach(() => {
        // Create temp directory for tests
        testDir = path.join(os.tmpdir(), `metrics-test-${Date.now()}`);
        fs.mkdirSync(testDir, { recursive: true });

        collector = new MetricsCollector({
            metricsDir: testDir
        });
    });

    afterEach(() => {
        // Cleanup
        try {
            fs.rmSync(testDir, { recursive: true, force: true });
        } catch { }
    });

    describe("start()", () => {
        it("should start metrics collection", () => {
            collector.start("test-task");
            expect(collector.isActive).toBe(true);
            expect(collector.taskId).toBe("test-task");
        });

        it("should generate taskId if not provided", () => {
            collector.start();
            expect(collector.isActive).toBe(true);
            expect(collector.taskId).toMatch(/^task-\d+$/);
        });

        it("should reset state on restart", () => {
            collector.start("task-1");
            collector.recordPhaseComplete("phase-1", 1000);
            collector.start("task-2");
            expect(collector.phases.length).toBe(0);
            expect(collector.taskId).toBe("task-2");
        });
    });

    describe("recordPhaseComplete()", () => {
        it("should record phase completion", () => {
            collector.start("test");
            collector.recordPhaseComplete("planning", 500, "success");

            expect(collector.phases.length).toBe(1);
            expect(collector.phases[0].name).toBe("planning");
            expect(collector.phases[0].duration_ms).toBe(500);
            expect(collector.phases[0].status).toBe("success");
        });

        it("should default to success status", () => {
            collector.start("test");
            collector.recordPhaseComplete("phase", 100);
            expect(collector.phases[0].status).toBe("success");
        });

        it("should not record if not active", () => {
            collector.recordPhaseComplete("phase", 100);
            expect(collector.phases.length).toBe(0);
        });
    });

    describe("recordError()", () => {
        it("should record errors", () => {
            collector.start("test");
            collector.recordError("TypeScript", true, "Missing import");

            expect(collector.errors.length).toBe(1);
            expect(collector.errors[0].type).toBe("TypeScript");
            expect(collector.errors[0].was_auto_fixed).toBe(true);
        });

        it("should default wasAutoFixed to false", () => {
            collector.start("test");
            collector.recordError("Lint");
            expect(collector.errors[0].was_auto_fixed).toBe(false);
        });
    });

    describe("recordIntervention()", () => {
        it("should record interventions", () => {
            collector.start("test");
            collector.recordIntervention("User requested change");

            expect(collector.interventions.length).toBe(1);
            expect(collector.interventions[0].reason).toBe("User requested change");
        });
    });

    describe("complete()", () => {
        it("should calculate and return metrics", () => {
            collector.start("test");
            collector.recordPhaseComplete("phase-1", 1000, "success");
            collector.recordPhaseComplete("phase-2", 500, "success");

            const result = collector.complete();

            expect(result.task_id).toBe("test");
            expect(result.metrics).toBeDefined();
            expect(result.metrics.speed.total_phases).toBe(2);
            expect(result.metrics.intervention.human_interventions).toBe(0);
            expect(collector.isActive).toBe(false);
        });

        it("should save run to file", () => {
            collector.start("save-test");
            collector.recordPhaseComplete("phase", 100);
            collector.complete();

            const runsDir = path.join(testDir, "runs");
            const files = fs.readdirSync(runsDir);
            expect(files.length).toBe(1);
            expect(files[0]).toMatch(/save-test\.json$/);
        });

        it("should calculate autonomy rate correctly", () => {
            collector.start("test");
            collector.recordPhaseComplete("phase-1", 100, "success");
            collector.recordPhaseComplete("phase-2", 100, "success");
            collector.recordPhaseComplete("phase-3", 100, "failed");

            const result = collector.complete();
            expect(result.metrics.autonomy.autonomous_completion_rate).toBe(67); // 2/3
        });
    });

    describe("getMetrics()", () => {
        it("should return current metrics without completing", () => {
            collector.start("test");
            collector.recordPhaseComplete("phase", 100);

            const metrics = collector.getMetrics();
            expect(metrics).toBeDefined();
            expect(collector.isActive).toBe(true); // Still active
        });

        it("should return null if not active", () => {
            expect(collector.getMetrics()).toBeNull();
        });
    });

    describe("setBaseline()", () => {
        it("should save baseline to file", () => {
            collector.start("test");
            collector.recordPhaseComplete("phase", 100);

            const result = collector.setBaseline(collector.getMetrics());
            expect(result).toBe(true);

            const baselinePath = path.join(testDir, "baseline.json");
            expect(fs.existsSync(baselinePath)).toBe(true);
        });
    });

    describe("listRuns()", () => {
        it("should list saved runs", () => {
            collector.start("run-1");
            collector.recordPhaseComplete("phase", 100);
            collector.complete();

            collector.start("run-2");
            collector.recordPhaseComplete("phase", 200);
            collector.complete();

            const runs = collector.listRuns();
            expect(runs.length).toBe(2);
        });

        it("should return empty array if no runs", () => {
            const runs = collector.listRuns();
            expect(runs).toEqual([]);
        });
    });

    describe("loadRun()", () => {
        it("should load a saved run", () => {
            collector.start("loadable");
            collector.recordPhaseComplete("phase", 100);
            collector.complete();

            const runs = collector.listRuns();
            const loaded = collector.loadRun(runs[0].id);

            expect(loaded).toBeDefined();
            expect(loaded.task_id).toBe("loadable");
        });

        it("should return null for non-existent run", () => {
            expect(collector.loadRun("non-existent")).toBeNull();
        });
    });

    describe("baseline comparison", () => {
        it("should compare against baseline", () => {
            // Set baseline with specific metrics
            collector.start("baseline-run");
            collector.recordPhaseComplete("phase", 1000);
            const baselineResult = collector.complete();
            collector.setBaseline(baselineResult.metrics);

            // Run with improvement
            collector.start("improved-run");
            collector.recordPhaseComplete("phase", 500); // Faster phase
            const result = collector.complete();

            // Verify comparison exists (baseline was set and comparison calculated)
            expect(result.comparison).not.toBeNull();
            expect(result.comparison.speed).toBeDefined();
        });
    });

    describe("cleanup old runs", () => {
        it("should cleanup runs exceeding maxRuns", () => {
            const smallCollector = new MetricsCollector({
                metricsDir: testDir,
                maxRuns: 3
            });

            // Create 5 runs
            for (let i = 0; i < 5; i++) {
                smallCollector.start(`run-${i}`);
                smallCollector.recordPhaseComplete("phase", 100);
                smallCollector.complete();
            }

            const runs = smallCollector.listRuns();
            expect(runs.length).toBe(3);
        });
    });
});
