/**
 * Dashboard Data v7.0 - PikaKit Data Aggregation
 * 
 * Aggregates data from all engines for Dashboard display.
 * Provides real-time metrics, trends, and alerts.
 * 
 * @version 7.0.0
 * @author PikaKit
 */

import { getKPIs, getMetricValue, getMetricHistory } from './metrics-collector.js';
import { loadKnowledge, getCommandLessons } from './knowledge.js';
import { getPatternCount } from './command-failure-learner.js';

// ============================================================================
// DASHBOARD DATA AGGREGATION
// ============================================================================

/**
 * Get complete dashboard data
 * @returns {Object} - Full dashboard data
 */
export function getFullDashboardData() {
    try {
        const kpis = getKPIs();
        const knowledge = loadKnowledge();
        const lessons = knowledge.lessons || [];
        const commandLessons = getCommandLessons();
        const commandPatternCount = getPatternCount();

        return {
            version: '7.1.0',
            timestamp: new Date().toISOString(),
            kpis,
            summary: {
                totalTasks: getMetricValue('total_tasks') || 0,
                patternsLearned: lessons.length,
                lessonsCount: lessons.length,
                commandPatterns: commandPatternCount,
                commandLessonsLearned: commandLessons.length,
                skillsGenerated: 0,
                abTestsActive: 0
            },
            lessons: lessons.slice(0, 10)
        };
    } catch (e) {
        return {
            version: '7.0.0',
            error: e.message,
            kpis: { kpis: {} },
            summary: {}
        };
    }
}

/**
 * Get pattern statistics
 * @returns {Object} - Pattern stats
 */
export function getPatternStats() {
    const knowledge = loadKnowledge();
    const lessons = knowledge.lessons || [];
    return {
        total: lessons.length,
        byCategory: lessons.reduce((acc, p) => {
            const cat = p.tags?.[0] || 'other';
            acc[cat] = (acc[cat] || 0) + 1;
            return acc;
        }, {}),
        avgConfidence: lessons.length > 0
            ? lessons.reduce((sum, p) => sum + (p.confidence || 0), 0) / lessons.length
            : 0
    };
}

// ============================================================================
// ALERTS
// ============================================================================

const ALERT_RULES = [
    {
        id: 'low_success_rate',
        check: (kpis) => kpis.task_success_rate && parseFloat(kpis.task_success_rate.value) < 80,
        severity: 'warning',
        message: 'Task success rate below 80%'
    },
    {
        id: 'high_error_repeat',
        check: (kpis) => kpis.error_repeat_rate && parseFloat(kpis.error_repeat_rate.value) > 10,
        severity: 'warning',
        message: 'Error repeat rate above 10%'
    },
    {
        id: 'low_skill_effectiveness',
        check: (kpis) => kpis.skill_effectiveness && parseFloat(kpis.skill_effectiveness.value) < 50,
        severity: 'info',
        message: 'Skill effectiveness below 50%'
    }
];

/**
 * Generate alerts based on current KPIs
 * @returns {Array} - Active alerts
 */
export function generateAlerts() {
    try {
        const kpis = getKPIs().kpis || {};
        const alerts = [];

        for (const rule of ALERT_RULES) {
            if (rule.check(kpis)) {
                alerts.push({
                    id: rule.id,
                    severity: rule.severity,
                    message: rule.message,
                    timestamp: new Date().toISOString()
                });
            }
        }

        return alerts;
    } catch (e) {
        return [];
    }
}

// ============================================================================
// WIDGET DATA
// ============================================================================

/**
 * Get data for gauge widgets
 * @returns {Array} - Gauge data
 */
export function getGaugeWidgets() {
    const kpis = getKPIs().kpis || {};
    return [
        { id: 'success_rate', label: 'Task Success', value: parseFloat(kpis.task_success_rate?.value) || 0, target: 85 },
        { id: 'error_repeat', label: 'Error Repeat', value: parseFloat(kpis.error_repeat_rate?.value) || 0, target: 5, inverse: true },
        { id: 'first_time', label: 'First-Time Success', value: parseFloat(kpis.first_time_success?.value) || 0, target: 80 },
        { id: 'skill_eff', label: 'Skill Effectiveness', value: parseFloat(kpis.skill_effectiveness?.value) || 0, target: 70 }
    ];
}

/**
 * Get data for counter widgets
 * @returns {Array} - Counter data
 */
export function getCounterWidgets() {
    const knowledge = loadKnowledge();
    const lessons = knowledge.lessons || [];
    return [
        { id: 'tasks', label: 'Total Tasks', value: getMetricValue('total_tasks') || 0 },
        { id: 'patterns', label: 'Patterns', value: lessons.length },
        { id: 'skills', label: 'Skills', value: 0 },
        { id: 'tests', label: 'A/B Tests', value: 0 }
    ];
}

/**
 * Get learning velocity chart data
 * @returns {Object} - Chart data
 */
export function getLearningVelocityChart() {
    const history = getMetricHistory('patterns_learned', 7);
    return {
        labels: history.map(h => h.date),
        values: history.map(h => h.value),
        type: 'bar'
    };
}

// ============================================================================
// CLI FORMAT
// ============================================================================

/**
 * Format dashboard for CLI display
 * @returns {string} - Formatted string
 */
export function formatDashboardForCLI() {
    const data = getFullDashboardData();
    const kpis = data.kpis?.kpis || {};

    const formatValue = (kpi) => kpi?.value ? `${parseFloat(kpi.value).toFixed(1)}%` : '--';

    return `
╔══════════════════════════════════════════════════════════════╗
║                    🧠 PikaKit Dashboard v7.0                  ║
╠══════════════════════════════════════════════════════════════╣
║  Task Success:    ${formatValue(kpis.task_success_rate).padEnd(8)}  │  Error Repeat:  ${formatValue(kpis.error_repeat_rate).padEnd(8)}  ║
║  First-Time:      ${formatValue(kpis.first_time_success).padEnd(8)}  │  Skill Effect:  ${formatValue(kpis.skill_effectiveness).padEnd(8)}  ║
╠══════════════════════════════════════════════════════════════╣
║  Tasks: ${String(data.summary?.totalTasks || 0).padEnd(6)}  Patterns: ${String(data.summary?.patternsLearned || 0).padEnd(6)}  Skills: ${String(data.summary?.skillsGenerated || 0).padEnd(6)}  ║
╚══════════════════════════════════════════════════════════════╝
`;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    getFullDashboardData,
    getPatternStats,
    generateAlerts,
    getGaugeWidgets,
    getCounterWidgets,
    getLearningVelocityChart,
    formatDashboardForCLI
};
