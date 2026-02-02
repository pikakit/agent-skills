/**
 * Dashboard Data v7.0 - Data Aggregation
 * 
 * Aggregates data from all modules for dashboard widgets.
 * Provides trends, alerts, and widget data.
 * 
 * @version 7.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find project root
function findProjectRoot() {
    let dir = process.cwd();
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, '.agent'))) return dir;
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
        dir = path.dirname(dir);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const METRICS_DIR = path.join(projectRoot, '.agent', 'metrics');

// Try to import other modules dynamically
let metricsCollector = null;
let causalityEngine = null;
let reinforcement = null;
let abTesting = null;
let skillGenerator = null;

async function loadModules() {
    try {
        metricsCollector = await import('./metrics-collector.js');
    } catch (e) { /* optional */ }

    try {
        causalityEngine = await import('./causality-engine.js');
    } catch (e) { /* optional */ }

    try {
        reinforcement = await import('./reinforcement.js');
    } catch (e) { /* optional */ }

    try {
        abTesting = await import('./ab-testing.js');
    } catch (e) { /* optional */ }

    try {
        skillGenerator = await import('./skill-generator.js');
    } catch (e) { /* optional */ }
}

// Initialize modules
loadModules();

// ============================================================================
// FULL DASHBOARD DATA
// ============================================================================

/**
 * Get full dashboard data aggregated from all sources
 */
export function getFullDashboardData() {
    const kpis = metricsCollector?.getKPIs?.() || { kpis: {}, summary: {} };
    const patterns = causalityEngine?.loadCausalPatterns?.() || [];
    const reinforcementStats = reinforcement?.getStats?.() || { rewards: 0, penalties: 0, avgConfidence: 0 };
    const abStats = abTesting?.getActiveTests?.() || [];
    const skills = skillGenerator?.getAllSkills?.() || [];

    return {
        kpis: kpis.kpis,
        summary: {
            ...kpis.summary,
            patternsLearned: patterns.length,
            skillsGenerated: skills.length,
            activeTests: abStats.length
        },
        reinforcement: reinforcementStats,
        abTesting: {
            active: abStats,
            count: abStats.length
        },
        patterns: {
            total: patterns.length,
            recent: patterns.slice(-5)
        },
        skills: {
            total: skills.length,
            recent: skills.slice(-5)
        },
        version: '7.0.0',
        timestamp: new Date().toISOString()
    };
}

// ============================================================================
// TRENDS
// ============================================================================

/**
 * Get key trends (week-over-week comparison)
 */
export function getKeyTrends() {
    const historyPath = path.join(METRICS_DIR, 'history.json');

    if (!fs.existsSync(historyPath)) {
        return {
            task_success_rate: { current: 0, previous: 0, change: 0 },
            error_repeat_rate: { current: 0, previous: 0, change: 0 },
            patterns_learned: { current: 0, previous: 0, change: 0 },
            learning_velocity: generateVelocityData()
        };
    }

    try {
        const history = JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        const entries = history.entries || [];

        // Get last 7 days and previous 7 days
        const now = new Date();
        const weekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
        const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

        const currentWeek = entries.filter(e => new Date(e.timestamp) >= weekAgo);
        const previousWeek = entries.filter(e => {
            const d = new Date(e.timestamp);
            return d >= twoWeeksAgo && d < weekAgo;
        });

        const avgCurrent = calculateAverage(currentWeek, 'task_success_rate');
        const avgPrevious = calculateAverage(previousWeek, 'task_success_rate');

        const errorCurrent = calculateAverage(currentWeek, 'error_repeat_rate');
        const errorPrevious = calculateAverage(previousWeek, 'error_repeat_rate');

        const patternsCurrent = currentWeek.length > 0 ? currentWeek[currentWeek.length - 1].patterns_learned || 0 : 0;
        const patternsPrevious = previousWeek.length > 0 ? previousWeek[previousWeek.length - 1].patterns_learned || 0 : 0;

        return {
            task_success_rate: {
                current: avgCurrent,
                previous: avgPrevious,
                change: avgCurrent - avgPrevious
            },
            error_repeat_rate: {
                current: errorCurrent,
                previous: errorPrevious,
                change: errorCurrent - errorPrevious
            },
            patterns_learned: {
                current: patternsCurrent,
                previous: patternsPrevious,
                change: patternsCurrent - patternsPrevious
            },
            learning_velocity: generateVelocityData(entries)
        };
    } catch (e) {
        return {
            task_success_rate: { current: 0, previous: 0, change: 0 },
            error_repeat_rate: { current: 0, previous: 0, change: 0 },
            patterns_learned: { current: 0, previous: 0, change: 0 },
            learning_velocity: generateVelocityData()
        };
    }
}

/**
 * Calculate average of a metric from entries
 */
function calculateAverage(entries, metric) {
    if (entries.length === 0) return 0;
    const sum = entries.reduce((acc, e) => acc + (e[metric] || 0), 0);
    return Math.round(sum / entries.length);
}

/**
 * Generate learning velocity data for chart
 */
function generateVelocityData(entries = []) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    const now = new Date();
    const dayOfWeek = now.getDay();

    // Reorder days to start from current day - 6
    const orderedDays = [];
    for (let i = 6; i >= 0; i--) {
        const idx = (dayOfWeek - i + 7) % 7;
        orderedDays.push(days[idx === 0 ? 6 : idx - 1]);
    }

    // Generate velocity values
    const velocity = orderedDays.map((day, idx) => {
        // Try to get actual data from entries
        const targetDate = new Date(now - (6 - idx) * 24 * 60 * 60 * 1000);
        const dayEntries = entries.filter(e => {
            const d = new Date(e.timestamp);
            return d.toDateString() === targetDate.toDateString();
        });

        if (dayEntries.length > 0) {
            return {
                day,
                value: dayEntries.reduce((acc, e) => acc + (e.patterns_learned || 0), 0) / dayEntries.length
            };
        }

        // Default random-ish value for demo
        return {
            day,
            value: Math.floor(Math.random() * 50) + 20
        };
    });

    return velocity;
}

// ============================================================================
// ALERTS
// ============================================================================

/**
 * Generate alerts based on metrics thresholds
 */
export function generateAlerts() {
    const alerts = [];
    const kpis = metricsCollector?.getKPIs?.()?.kpis || {};

    // Check task success rate
    if (kpis.task_success_rate) {
        const rate = parseInt(kpis.task_success_rate.value) || 0;
        if (rate < 50) {
            alerts.push({
                id: 'low-success-critical',
                severity: 'critical',
                message: 'Task success rate critically low',
                value: `${rate}%`,
                threshold: '50%'
            });
        } else if (rate < 80) {
            alerts.push({
                id: 'low-success-warning',
                severity: 'warning',
                message: 'Task success rate below target',
                value: `${rate}%`,
                threshold: '80%'
            });
        }
    }

    // Check error repeat rate
    if (kpis.error_repeat_rate) {
        const rate = parseInt(kpis.error_repeat_rate.value) || 0;
        if (rate > 30) {
            alerts.push({
                id: 'high-error-repeat',
                severity: 'warning',
                message: 'High error repeat rate detected',
                value: `${rate}%`,
                threshold: '30%'
            });
        }
    }

    // Check for stale patterns
    const patterns = causalityEngine?.loadCausalPatterns?.() || [];
    if (patterns.length === 0) {
        alerts.push({
            id: 'no-patterns',
            severity: 'info',
            message: 'No patterns learned yet',
            suggestion: 'Start using the agent to learn patterns'
        });
    }

    return alerts;
}

// ============================================================================
// WIDGETS
// ============================================================================

/**
 * Get gauge widget data
 */
export function getGaugeWidgets() {
    const kpis = metricsCollector?.getKPIs?.()?.kpis || {};

    return [
        {
            id: 'task-success',
            label: 'Task Success Rate',
            value: parseInt(kpis.task_success_rate?.value) || 0,
            max: 100,
            unit: '%',
            color: getGaugeColor(parseInt(kpis.task_success_rate?.value) || 0, 80, 50)
        },
        {
            id: 'first-time-success',
            label: 'First-Time Success',
            value: parseInt(kpis.first_time_success?.value) || 0,
            max: 100,
            unit: '%',
            color: getGaugeColor(parseInt(kpis.first_time_success?.value) || 0, 70, 40)
        },
        {
            id: 'skill-effectiveness',
            label: 'Skill Effectiveness',
            value: parseInt(kpis.skill_effectiveness?.value) || 0,
            max: 100,
            unit: '%',
            color: getGaugeColor(parseInt(kpis.skill_effectiveness?.value) || 0, 60, 30)
        }
    ];
}

/**
 * Get counter widget data
 */
export function getCounterWidgets() {
    const kpis = metricsCollector?.getKPIs?.()?.kpis || {};
    const patterns = causalityEngine?.loadCausalPatterns?.() || [];
    const skills = skillGenerator?.getAllSkills?.() || [];
    const abTests = abTesting?.getActiveTests?.() || [];

    return [
        {
            id: 'total-tasks',
            label: 'Total Tasks',
            value: kpis.total_tasks?.value || 0,
            icon: '📊'
        },
        {
            id: 'patterns-learned',
            label: 'Patterns Learned',
            value: patterns.length,
            icon: '🧩'
        },
        {
            id: 'skills-generated',
            label: 'Skills Generated',
            value: skills.length,
            icon: '⚙️'
        },
        {
            id: 'ab-tests-active',
            label: 'A/B Tests Active',
            value: abTests.length,
            icon: '🧪'
        }
    ];
}

/**
 * Get gauge color based on value and thresholds
 */
function getGaugeColor(value, goodThreshold, warningThreshold) {
    if (value >= goodThreshold) return '#00ff88';
    if (value >= warningThreshold) return '#ffbb00';
    return '#ff4444';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    getFullDashboardData,
    getKeyTrends,
    generateAlerts,
    getGaugeWidgets,
    getCounterWidgets
};
