#!/usr/bin/env node
/**
 * Autopilot Runner with Full Integration
 * 
 * Central runner for /autopilot that integrates:
 * - Pre-flight assessment (risk evaluation)
 * - State management (checkpoints)
 * - Adaptive workflow (optimization)
 * - Metrics collection (tracking)
 * - Learning (lessons)
 * 
 * Usage:
 *   node autopilot-runner.js --task "build todo app" --domains frontend,backend
 *   node autopilot-runner.js --status
 *   node autopilot-runner.js --last
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import integrated modules
import { AutopilotMetrics } from './autopilot-metrics.js';
import { PreFlightAssessment, quickRiskCheck } from './preflight-assessment.js';
import { AdaptiveWorkflow } from './adaptive-workflow.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const RUN_LOG = path.join(__dirname, '..', 'knowledge', 'autopilot-runs.json');

/**
 * Autopilot Runner Class
 */
export class AutopilotRunner {
    constructor(config = {}) {
        this.task = config.task || '';
        this.domains = config.domains || [];
        this.files = config.files || [];
        this.agents = config.agents || [];
        this.complexity = config.complexity || 'standard';

        this.metrics = null;
        this.assessment = null;
        this.optimization = null;
        this.checkpointId = null;
    }

    /**
     * Run full pre-flight checks
     */
    async preFlight() {
        console.log('🛫 Running pre-flight checks...\n');

        // 1. Risk Assessment
        this.assessment = new PreFlightAssessment({
            task: this.task,
            domains: this.domains,
            files: this.files,
            agents: this.agents
        }).evaluate();

        console.log(`Risk Level: ${this.getRiskIcon(this.assessment.riskLevel)} ${this.assessment.riskLevel}`);
        console.log(`Action: ${this.assessment.action}`);

        // 2. Workflow Optimization
        const workflow = new AdaptiveWorkflow({
            steps: this.getDefaultSteps()
        });

        this.optimization = await workflow.optimize({
            complexity: this.complexity,
            domains: this.domains,
            type: this.detectTaskType(),
            files: this.files
        });

        console.log(`\nOptimization: ${this.optimization.original} → ${this.optimization.optimized} steps`);
        console.log(`Time saved: ${this.optimization.estimatedTimeSaving.formatted}`);

        // 3. Initialize Metrics
        this.metrics = new AutopilotMetrics(null, {
            task: this.task,
            domains: this.domains,
            complexity: this.complexity,
            riskLevel: this.assessment.riskLevel
        });

        return {
            assessment: this.assessment,
            optimization: this.optimization,
            requiresApproval: this.assessment.userApprovalRequired,
            requiresCheckpoint: this.assessment.checkpointsRequired
        };
    }

    /**
     * Start execution with metrics tracking
     */
    startExecution() {
        if (!this.metrics) {
            throw new Error('Run preFlight() first');
        }

        this.metrics.start();
        console.log(`\n🚀 Execution started: ${this.metrics.taskId}`);

        return this.metrics.taskId;
    }

    /**
     * Record phase completion
     */
    recordPhase(phaseName, durationMs, status, details = {}) {
        if (!this.metrics) {
            throw new Error('Execution not started');
        }

        this.metrics.recordPhase(phaseName, durationMs, status, details);

        const icon = status === 'success' ? '✅' : status === 'error' ? '❌' : '⏳';
        console.log(`${icon} Phase: ${phaseName} (${(durationMs / 1000).toFixed(1)}s)`);
    }

    /**
     * Record error
     */
    recordError(error, wasAutoFixed = false) {
        if (!this.metrics) return;

        this.metrics.recordError(error, wasAutoFixed);

        const icon = wasAutoFixed ? '🔧' : '❌';
        console.log(`${icon} Error: ${error.message || error}`);
    }

    /**
     * Record human intervention
     */
    recordIntervention(reason) {
        if (!this.metrics) return;

        this.metrics.recordIntervention(reason);
        console.log(`👤 Intervention: ${reason}`);
    }

    /**
     * Set checkpoint ID
     */
    setCheckpoint(checkpointId) {
        this.checkpointId = checkpointId;
        if (this.metrics) {
            this.metrics.recordCheckpoint(checkpointId, this.files);
        }
        console.log(`📸 Checkpoint: ${checkpointId}`);
    }

    /**
     * Finalize and get report
     */
    finalize() {
        if (!this.metrics) {
            throw new Error('Execution not started');
        }

        const report = this.metrics.finalize();

        // Save run to log
        this.saveRunLog(report);

        // Generate formatted report
        const formattedReport = this.formatReport(report);

        return {
            raw: report,
            formatted: formattedReport
        };
    }

    /**
     * Get default workflow steps
     */
    getDefaultSteps() {
        return [
            'explorer-agent',
            'design-system-generation',
            'database-architect',
            'security-auditor',
            'backend-specialist',
            'frontend-specialist',
            'test-engineer',
            'documentation-writer',
            'security-audit',
            'e2e-tests',
            'staging-deploy'
        ];
    }

    /**
     * Detect task type from description
     */
    detectTaskType() {
        const task = this.task.toLowerCase();
        if (task.includes('refactor')) return 'refactor';
        if (task.includes('fix') || task.includes('bug')) return 'fix';
        if (task.includes('add') || task.includes('create') || task.includes('build')) return 'feature';
        return 'feature';
    }

    /**
     * Get risk level icon
     */
    getRiskIcon(level) {
        return {
            LOW: '✅',
            MEDIUM: '⚠️',
            HIGH: '🔶',
            CRITICAL: '🔴'
        }[level] || '❓';
    }

    /**
     * Save run to log
     */
    saveRunLog(report) {
        try {
            let runs = [];
            if (fs.existsSync(RUN_LOG)) {
                runs = JSON.parse(fs.readFileSync(RUN_LOG, 'utf-8'));
            }

            runs.unshift({
                taskId: report.taskId,
                task: this.task,
                timestamp: report.timestamp,
                riskLevel: this.assessment?.riskLevel,
                duration: report.metrics.totalDuration,
                success: report.metrics.firstTimeSuccess,
                interventions: report.metrics.humanInterventions
            });

            // Keep last 50 runs
            if (runs.length > 50) {
                runs = runs.slice(0, 50);
            }

            const dir = path.dirname(RUN_LOG);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }

            fs.writeFileSync(RUN_LOG, JSON.stringify(runs, null, 2));
        } catch (error) {
            console.error('Failed to save run log:', error.message);
        }
    }

    /**
     * Format final report
     */
    formatReport(report) {
        const m = report.metrics;

        return `
## 🎼 Autopilot Execution Report

**Task ID:** ${report.taskId}  
**Task:** ${this.task}  
**Duration:** ${(m.totalDuration / 1000).toFixed(1)}s

### Pre-Flight Assessment

| Dimension | Value |
|-----------|-------|
| Risk Level | ${this.assessment?.riskLevel || 'N/A'} |
| Checkpoints | ${report.checkpoints.length} |
| Optimization | ${this.optimization?.original || 0} → ${this.optimization?.optimized || 0} steps |

### Execution Metrics

| Metric | Value | Target | Status |
|--------|-------|--------|--------|
| Duration | ${(m.totalDuration / 1000).toFixed(1)}s | <300s | ${m.totalDuration < 300000 ? '✅' : '⚠️'} |
| Interventions | ${m.humanInterventions} | 0 | ${m.humanInterventions === 0 ? '✅' : '⚠️'} |
| First-Time Success | ${m.firstTimeSuccess ? 'Yes' : 'No'} | Yes | ${m.firstTimeSuccess ? '✅' : '❌'} |
| Auto-Fix Rate | ${m.autoFixRate.toFixed(0)}% | >85% | ${m.autoFixRate >= 85 ? '✅' : '⚠️'} |
| Phases | ${m.successfulPhases}/${m.totalPhases} | 100% | ${m.failedPhases === 0 ? '✅' : '❌'} |

### Phase Breakdown

| Phase | Duration | Status |
|-------|----------|--------|
${report.phases.map(p => `| ${p.name} | ${(p.duration / 1000).toFixed(1)}s | ${p.status === 'success' ? '✅' : '❌'} |`).join('\n')}

${report.comparison?.hasBaseline ? `
### Comparison to Baseline

${this.formatComparison(report.comparison)}` : ''}
`.trim();
    }

    /**
     * Format comparison section
     */
    formatComparison(comparison) {
        if (!comparison.hasBaseline) return '';

        const c = comparison.changes;
        const lines = [];

        if (c.duration) {
            const icon = c.duration.improved ? '🎉' : '';
            lines.push(`- Duration: ${c.duration.baseline}ms → ${c.duration.current}ms (${c.duration.change}%) ${icon}`);
        }

        if (c.interventions) {
            const icon = c.interventions.improved ? '🎉' : '';
            lines.push(`- Interventions: ${c.interventions.baseline} → ${c.interventions.current} ${icon}`);
        }

        return lines.join('\n');
    }
}

/**
 * Show last run
 */
function showLastRun() {
    if (!fs.existsSync(RUN_LOG)) {
        console.log('No runs recorded yet.');
        return;
    }

    const runs = JSON.parse(fs.readFileSync(RUN_LOG, 'utf-8'));
    if (runs.length === 0) {
        console.log('No runs recorded yet.');
        return;
    }

    const last = runs[0];
    console.log(`
Last Autopilot Run
==================
Task ID: ${last.taskId}
Task: ${last.task}
Timestamp: ${last.timestamp}
Risk Level: ${last.riskLevel}
Duration: ${(last.duration / 1000).toFixed(1)}s
Success: ${last.success ? 'Yes' : 'No'}
Interventions: ${last.interventions}
`);
}

/**
 * Show run status
 */
function showStatus() {
    if (!fs.existsSync(RUN_LOG)) {
        console.log('No runs recorded yet.');
        return;
    }

    const runs = JSON.parse(fs.readFileSync(RUN_LOG, 'utf-8'));

    console.log(`
Autopilot Status
================
Total Runs: ${runs.length}
Successful: ${runs.filter(r => r.success).length}
Failed: ${runs.filter(r => !r.success).length}
Avg Duration: ${(runs.reduce((s, r) => s + r.duration, 0) / runs.length / 1000).toFixed(1)}s
Avg Interventions: ${(runs.reduce((s, r) => s + r.interventions, 0) / runs.length).toFixed(1)}
`);
}

/**
 * CLI
 */
async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--status')) {
        showStatus();
        return;
    }

    if (args.includes('--last')) {
        showLastRun();
        return;
    }

    if (args.includes('--task')) {
        const taskIdx = args.indexOf('--task');
        const task = args[taskIdx + 1];

        const domainsIdx = args.indexOf('--domains');
        const domains = domainsIdx >= 0 ? args[domainsIdx + 1].split(',') : ['frontend'];

        // Demo execution
        const runner = new AutopilotRunner({
            task,
            domains,
            complexity: 'standard'
        });

        // Pre-flight
        const preflight = await runner.preFlight();

        if (preflight.requiresApproval) {
            console.log('\n🔴 CRITICAL risk - would require explicit approval');
            return;
        }

        // Start
        runner.startExecution();

        // Simulate phases
        const phases = ['planning', 'setup', 'execution', 'verification'];
        for (const phase of phases) {
            await new Promise(r => setTimeout(r, 100));
            runner.recordPhase(phase, 100 + Math.random() * 200, 'success');
        }

        // Finalize
        const result = runner.finalize();
        console.log('\n' + result.formatted);
        return;
    }

    console.log(`
Autopilot Runner with Full Integration

Usage:
  node autopilot-runner.js --task "your task" --domains frontend,backend
  node autopilot-runner.js --status
  node autopilot-runner.js --last

Programmatic usage:
  import { AutopilotRunner } from './autopilot-runner.js';
  
  const runner = new AutopilotRunner({ task, domains, complexity });
  await runner.preFlight();
  runner.startExecution();
  runner.recordPhase('phase-name', durationMs, 'success');
  const report = runner.finalize();
`);
}

// Run if executed directly
if (process.argv[1] === __filename) {
    main().catch(console.error);
}
