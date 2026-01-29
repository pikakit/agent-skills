#!/usr/bin/env node
/**
 * Autopilot Metrics Dashboard
 * 
 * Display and compare autopilot execution metrics.
 * Shows trends, before/after comparisons, and SLO status.
 * 
 * Usage:
 *   node metrics-dashboard.js              Show current summary
 *   node metrics-dashboard.js trends       Show trends over last 10 executions
 *   node metrics-dashboard.js compare      Compare current to baseline
 *   node metrics-dashboard.js slo          Show SLO status
 *   node metrics-dashboard.js export       Export metrics to CSV
 * 
 * @version 1.0.0
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Paths
const METRICS_STORE = path.join(__dirname, '..', 'knowledge', 'autopilot-metrics.json');

// Colors for terminal output
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// SLO definitions
const SLOS = {
    phaseTranitionTime: { target: 2000, unit: 'ms', direction: 'lower' },
    firstTimeSuccessRate: { target: 95, unit: '%', direction: 'higher' },
    humanInterventions: { target: 0, unit: 'count', direction: 'lower' },
    autoFixRate: { target: 85, unit: '%', direction: 'higher' },
    totalDuration: { target: 300000, unit: 'ms', direction: 'lower' }  // 5 min
};

/**
 * Load metrics store
 */
function loadMetrics() {
    if (!fs.existsSync(METRICS_STORE)) {
        return { executions: [], baseline: null };
    }
    return JSON.parse(fs.readFileSync(METRICS_STORE, 'utf-8'));
}

/**
 * Format duration for display
 */
function formatDuration(ms) {
    if (ms < 1000) return `${ms}ms`;
    if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;
    return `${(ms / 60000).toFixed(1)}m`;
}

/**
 * Generate ASCII bar
 */
function bar(value, max, width = 20) {
    const filled = Math.round((value / max) * width);
    return '█'.repeat(Math.min(filled, width)) + '░'.repeat(Math.max(0, width - filled));
}

/**
 * Generate sparkline
 */
function sparkline(values) {
    const chars = '▁▂▃▄▅▆▇█';
    if (values.length === 0) return '';
    const max = Math.max(...values);
    const min = Math.min(...values);
    const range = max - min || 1;
    return values.map(v => chars[Math.floor(((v - min) / range) * (chars.length - 1))]).join('');
}

/**
 * Show summary dashboard
 */
function showSummary() {
    const store = loadMetrics();

    console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}  ${c.bold}📊 Autopilot Metrics Dashboard${c.reset}                                ${c.cyan}║${c.reset}
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);

    console.log(`${c.gray}Total Executions: ${store.executions.length}${c.reset}`);
    console.log(`${c.gray}Baseline Exists: ${store.baseline ? 'Yes' : 'No'}${c.reset}\n`);

    if (store.executions.length === 0) {
        console.log(`${c.yellow}No executions recorded yet.${c.reset}`);
        console.log(`${c.gray}Run /autopilot to start collecting metrics.${c.reset}`);
        return;
    }

    // Latest execution
    const latest = store.executions[0];
    const m = latest.metrics;

    console.log(`${c.bold}📈 Latest Execution: ${latest.taskId}${c.reset}`);
    console.log(`${c.gray}   ${latest.timestamp}${c.reset}\n`);

    // Metrics table
    console.log(`${c.cyan}┌─────────────────────────────┬──────────────┬─────────────┐${c.reset}`);
    console.log(`${c.cyan}│${c.reset} ${c.bold}Metric${c.reset}                      ${c.cyan}│${c.reset} ${c.bold}Value${c.reset}        ${c.cyan}│${c.reset} ${c.bold}Target${c.reset}      ${c.cyan}│${c.reset}`);
    console.log(`${c.cyan}├─────────────────────────────┼──────────────┼─────────────┤${c.reset}`);

    printMetricRow('Duration', formatDuration(m.totalDuration), '<5m', m.totalDuration < 300000);
    printMetricRow('Interventions', m.humanInterventions, '0', m.humanInterventions === 0);
    printMetricRow('First-Time Success', m.firstTimeSuccess ? 'Yes' : 'No', 'Yes', m.firstTimeSuccess);
    printMetricRow('Auto-Fix Rate', `${m.autoFixRate.toFixed(0)}%`, '>85%', m.autoFixRate >= 85);
    printMetricRow('Phases', `${m.successfulPhases}/${m.totalPhases}`, '100%', m.failedPhases === 0);
    printMetricRow('Retries', m.retryCount, '<2', m.retryCount < 2);

    console.log(`${c.cyan}└─────────────────────────────┴──────────────┴─────────────┘${c.reset}`);
}

function printMetricRow(name, value, target, passing) {
    const padName = name.padEnd(25);
    const padValue = String(value).padEnd(12);
    const padTarget = target.padEnd(11);
    const status = passing ? `${c.green}✓${c.reset}` : `${c.red}✗${c.reset}`;
    console.log(`${c.cyan}│${c.reset} ${padName} ${c.cyan}│${c.reset} ${padValue} ${c.cyan}│${c.reset} ${padTarget} ${status} ${c.cyan}│${c.reset}`);
}

/**
 * Show trends
 */
function showTrends() {
    const store = loadMetrics();
    const executions = store.executions.slice(0, 10);

    console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}  ${c.bold}📈 Execution Trends (Last ${executions.length})${c.reset}                              ${c.cyan}║${c.reset}
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);

    if (executions.length === 0) {
        console.log(`${c.yellow}No data yet.${c.reset}`);
        return;
    }

    // Duration trend
    const durations = executions.map(e => e.metrics.totalDuration);
    console.log(`${c.bold}Duration (ms):${c.reset}`);
    console.log(`  ${sparkline(durations.reverse())}`);
    console.log(`  ${c.gray}${formatDuration(durations[durations.length - 1])} → ${formatDuration(durations[0])}${c.reset}\n`);

    // Success rate trend
    const successes = executions.map(e => e.metrics.firstTimeSuccess ? 1 : 0);
    const successRate = (successes.filter(s => s === 1).length / successes.length * 100).toFixed(0);
    console.log(`${c.bold}First-Time Success Rate:${c.reset} ${successRate}%`);
    console.log(`  ${sparkline(successes.reverse())}\n`);

    // Interventions trend
    const interventions = executions.map(e => e.metrics.humanInterventions);
    const avgInterventions = (interventions.reduce((a, b) => a + b, 0) / interventions.length).toFixed(1);
    console.log(`${c.bold}Avg Interventions:${c.reset} ${avgInterventions}`);
    console.log(`  ${sparkline(interventions.reverse())}\n`);

    // Auto-fix rate trend
    const autoFixRates = executions.map(e => e.metrics.autoFixRate || 0);
    const avgAutoFix = (autoFixRates.reduce((a, b) => a + b, 0) / autoFixRates.length).toFixed(0);
    console.log(`${c.bold}Avg Auto-Fix Rate:${c.reset} ${avgAutoFix}%`);
    console.log(`  ${sparkline(autoFixRates.reverse())}\n`);
}

/**
 * Show comparison to baseline
 */
function showComparison() {
    const store = loadMetrics();

    console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}  ${c.bold}⚖️  Before/After Comparison${c.reset}                                   ${c.cyan}║${c.reset}
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);

    if (!store.baseline) {
        console.log(`${c.yellow}No baseline set yet.${c.reset}`);
        console.log(`${c.gray}Complete first autopilot execution to establish baseline.${c.reset}`);
        return;
    }

    if (store.executions.length === 0) {
        console.log(`${c.yellow}No current metrics to compare.${c.reset}`);
        return;
    }

    const baseline = store.baseline;
    const current = store.executions[0].metrics;

    console.log(`${c.gray}Baseline: ${store.baselineTimestamp || 'Unknown'}${c.reset}\n`);

    // Comparison table
    const metrics = [
        { name: 'Duration', baseline: baseline.totalDuration, current: current.totalDuration, format: formatDuration, lower: true },
        { name: 'Interventions', baseline: baseline.humanInterventions, current: current.humanInterventions, lower: true },
        { name: 'Auto-Fix Rate', baseline: baseline.autoFixRate, current: current.autoFixRate, suffix: '%' },
        { name: 'Retry Count', baseline: baseline.retryCount, current: current.retryCount, lower: true },
        { name: 'Phases Success', baseline: baseline.successfulPhases, current: current.successfulPhases }
    ];

    for (const metric of metrics) {
        const baseVal = metric.format ? metric.format(metric.baseline) : `${metric.baseline}${metric.suffix || ''}`;
        const currVal = metric.format ? metric.format(metric.current) : `${metric.current}${metric.suffix || ''}`;

        let change;
        let improved;
        if (metric.lower) {
            improved = metric.current < metric.baseline;
            change = ((metric.baseline - metric.current) / metric.baseline * 100).toFixed(0);
        } else {
            improved = metric.current > metric.baseline;
            change = ((metric.current - metric.baseline) / metric.baseline * 100).toFixed(0);
        }

        const icon = improved ? `${c.green}🎉${c.reset}` : `${c.yellow}⚠️${c.reset}`;
        const changeSign = improved ? '-' : '+';
        const changeColor = improved ? c.green : c.yellow;

        console.log(`${c.bold}${metric.name}:${c.reset}`);
        console.log(`  Before: ${baseVal}`);
        console.log(`  After:  ${currVal} ${icon} ${changeColor}${changeSign}${Math.abs(change)}%${c.reset}\n`);
    }
}

/**
 * Show SLO status
 */
function showSLOStatus() {
    const store = loadMetrics();

    console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}  ${c.bold}🎯 SLO Status${c.reset}                                                 ${c.cyan}║${c.reset}
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);

    if (store.executions.length === 0) {
        console.log(`${c.yellow}No data for SLO evaluation.${c.reset}`);
        return;
    }

    // Calculate averages from recent executions
    const recent = store.executions.slice(0, 10);
    const avgDuration = recent.reduce((sum, e) => sum + e.metrics.totalDuration, 0) / recent.length;
    const avgInterventions = recent.reduce((sum, e) => sum + e.metrics.humanInterventions, 0) / recent.length;
    const successRate = (recent.filter(e => e.metrics.firstTimeSuccess).length / recent.length) * 100;
    const avgAutoFix = recent.reduce((sum, e) => sum + (e.metrics.autoFixRate || 0), 0) / recent.length;

    const sloChecks = [
        { name: 'Duration < 5min', value: avgDuration, target: 300000, passing: avgDuration < 300000, format: formatDuration },
        { name: 'Interventions = 0', value: avgInterventions, target: 0, passing: avgInterventions === 0 },
        { name: 'First-Time Success > 95%', value: successRate, target: 95, passing: successRate >= 95, suffix: '%' },
        { name: 'Auto-Fix Rate > 85%', value: avgAutoFix, target: 85, passing: avgAutoFix >= 85, suffix: '%' }
    ];

    for (const slo of sloChecks) {
        const status = slo.passing ? `${c.green}✅ PASS${c.reset}` : `${c.red}❌ FAIL${c.reset}`;
        const valueStr = slo.format ? slo.format(slo.value) : `${slo.value.toFixed(1)}${slo.suffix || ''}`;
        console.log(`${status} ${c.bold}${slo.name}${c.reset}`);
        console.log(`   Current: ${valueStr}\n`);
    }

    // Overall status
    const passing = sloChecks.filter(s => s.passing).length;
    const total = sloChecks.length;
    const overallStatus = passing === total ? `${c.green}ALL SLOs MET${c.reset}` : `${c.yellow}${total - passing} SLOs VIOLATED${c.reset}`;
    console.log(`\n${c.bold}Overall:${c.reset} ${passing}/${total} SLOs passing - ${overallStatus}`);
}

/**
 * Export to CSV
 */
function exportCSV() {
    const store = loadMetrics();

    if (store.executions.length === 0) {
        console.log(`${c.yellow}No data to export.${c.reset}`);
        return;
    }

    const headers = ['taskId', 'timestamp', 'duration_ms', 'interventions', 'first_time_success', 'auto_fix_rate', 'phases_success', 'phases_total', 'retry_count'];
    const rows = store.executions.map(e => [
        e.taskId,
        e.timestamp,
        e.metrics.totalDuration,
        e.metrics.humanInterventions,
        e.metrics.firstTimeSuccess,
        e.metrics.autoFixRate?.toFixed(1) || 0,
        e.metrics.successfulPhases,
        e.metrics.totalPhases,
        e.metrics.retryCount
    ]);

    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');
    const exportPath = path.join(__dirname, '..', 'metrics', 'autopilot-metrics-export.csv');

    // Ensure directory exists
    const dir = path.dirname(exportPath);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(exportPath, csv);
    console.log(`${c.green}✅ Exported ${store.executions.length} records to:${c.reset}`);
    console.log(`   ${exportPath}`);
}

/**
 * Main CLI
 */
function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'summary';

    switch (command) {
        case 'summary':
        case 'show':
            showSummary();
            break;
        case 'trends':
            showTrends();
            break;
        case 'compare':
        case 'comparison':
            showComparison();
            break;
        case 'slo':
        case 'slos':
            showSLOStatus();
            break;
        case 'export':
            exportCSV();
            break;
        case 'help':
        default:
            console.log(`
${c.cyan}Autopilot Metrics Dashboard${c.reset}

${c.bold}Commands:${c.reset}
  summary   Show current metrics summary (default)
  trends    Show trends over last 10 executions
  compare   Compare current to baseline (before/after)
  slo       Show SLO status
  export    Export metrics to CSV

${c.bold}Examples:${c.reset}
  node metrics-dashboard.js
  node metrics-dashboard.js trends
  node metrics-dashboard.js compare
`);
    }
}

main();
