/**
 * AutoLearn v6.0 - Metrics Collector
 * 
 * Collects, stores, and retrieves metrics for Dashboard.
 * All metrics are measurable and tracked over time.
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { METRICS_SCHEMA, getAllMetricIds, validateMetric } from './metrics-schema.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const METRICS_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const METRICS_FILE = path.join(METRICS_DIR, 'autolearn-metrics.json');
const HISTORY_FILE = path.join(METRICS_DIR, 'metrics-history.json');

// Maximum history entries per metric (30 days of hourly data)
const MAX_HISTORY_ENTRIES = 720;

// ============================================================================
// DATA STRUCTURES
// ============================================================================

/**
 * Initial metrics state
 */
function createInitialMetrics() {
    const metrics = {
        version: '6.0.0',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),

        // Raw counters (used to calculate rates)
        counters: {
            total_tasks: 0,
            successful_tasks: 0,
            failed_tasks: 0,
            total_errors: 0,
            repeated_errors: 0,
            no_retry_tasks: 0,
            manual_fixes: 0,
            true_positives: 0,
            false_positives: 0,
            false_negatives: 0,
            total_alerts: 0,
            tasks_with_skill: 0,
            tasks_helped_by_skill: 0,
            tasks_where_skill_applied: 0,
            auto_skills_created: 0,
            skills_pruned: 0,
            total_ab_tests: 0,
            ab_tests_with_winner: 0,
            new_patterns_this_week: 0,
            baseline_errors: 0,
            current_errors: 0,
            total_time_saved_seconds: 0,
            total_skill_creation_time_seconds: 0
        },

        // Aggregated values
        aggregates: {
            total_task_duration_seconds: 0,
            pattern_confidence_sum: 0,
            pattern_count: 0
        },

        // Calculated KPIs (updated after each event)
        kpis: {},

        // Weekly snapshots for trend analysis
        weekly: {
            current_week_start: getWeekStart().toISOString(),
            last_week_success_rate: null,
            this_week_success_rate: null
        }
    };

    // Initialize all KPIs to 0
    getAllMetricIds().forEach(id => {
        metrics.kpis[id] = 0;
    });

    return metrics;
}

/**
 * Get start of current week (Monday)
 */
function getWeekStart() {
    const now = new Date();
    const day = now.getDay();
    const diff = now.getDate() - day + (day === 0 ? -6 : 1);
    const weekStart = new Date(now.setDate(diff));
    weekStart.setHours(0, 0, 0, 0);
    return weekStart;
}

// ============================================================================
// STORAGE OPERATIONS
// ============================================================================

/**
 * Load metrics from disk
 * @returns {Object} - Metrics object
 */
export function loadMetrics() {
    try {
        if (!fs.existsSync(METRICS_FILE)) {
            const initial = createInitialMetrics();
            saveMetrics(initial);
            return initial;
        }

        const content = fs.readFileSync(METRICS_FILE, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error loading metrics:', error.message);
        return createInitialMetrics();
    }
}

/**
 * Save metrics to disk
 * @param {Object} metrics - Metrics object
 */
export function saveMetrics(metrics) {
    try {
        if (!fs.existsSync(METRICS_DIR)) {
            fs.mkdirSync(METRICS_DIR, { recursive: true });
        }

        metrics.updatedAt = new Date().toISOString();
        fs.writeFileSync(METRICS_FILE, JSON.stringify(metrics, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving metrics:', error.message);
    }
}

/**
 * Append to metrics history
 * @param {Object} snapshot - Current KPI snapshot
 */
function appendHistory(snapshot) {
    try {
        let history = [];

        if (fs.existsSync(HISTORY_FILE)) {
            history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));
        }

        history.push({
            timestamp: new Date().toISOString(),
            ...snapshot
        });

        // Keep only recent entries
        if (history.length > MAX_HISTORY_ENTRIES) {
            history = history.slice(-MAX_HISTORY_ENTRIES);
        }

        fs.writeFileSync(HISTORY_FILE, JSON.stringify(history, null, 2), 'utf8');
    } catch (error) {
        console.error('Error appending history:', error.message);
    }
}

// ============================================================================
// KPI CALCULATION
// ============================================================================

/**
 * Recalculate all KPIs from counters
 * @param {Object} metrics - Metrics object
 * @returns {Object} - Updated metrics with KPIs
 */
export function recalculateKPIs(metrics) {
    const c = metrics.counters;
    const a = metrics.aggregates;
    const kpis = {};

    // Core Metrics (1-5)
    kpis.task_success_rate = c.total_tasks > 0
        ? (c.successful_tasks / c.total_tasks * 100).toFixed(2)
        : 0;

    kpis.error_repeat_rate = c.total_errors > 0
        ? (c.repeated_errors / c.total_errors * 100).toFixed(2)
        : 0;

    kpis.first_time_success = c.total_tasks > 0
        ? (c.no_retry_tasks / c.total_tasks * 100).toFixed(2)
        : 0;

    kpis.time_to_completion = c.total_tasks > 0
        ? (a.total_task_duration_seconds / c.total_tasks).toFixed(2)
        : 0;

    kpis.human_intervention_rate = c.total_tasks > 0
        ? (c.manual_fixes / c.total_tasks * 100).toFixed(2)
        : 0;

    // Learning Metrics (6-10)
    const totalDetections = c.true_positives + c.false_positives;
    kpis.pattern_precision = totalDetections > 0
        ? (c.true_positives / totalDetections * 100).toFixed(2)
        : 0;

    const totalActual = c.true_positives + c.false_negatives;
    kpis.pattern_recall = totalActual > 0
        ? (c.true_positives / totalActual * 100).toFixed(2)
        : 0;

    kpis.skill_effectiveness = c.tasks_where_skill_applied > 0
        ? (c.tasks_helped_by_skill / c.tasks_where_skill_applied * 100).toFixed(2)
        : 0;

    kpis.skill_coverage = c.total_tasks > 0
        ? (c.tasks_with_skill / c.total_tasks * 100).toFixed(2)
        : 0;

    kpis.false_positive_rate = c.total_alerts > 0
        ? (c.false_positives / c.total_alerts * 100).toFixed(2)
        : 0;

    // Evolution Metrics (11-15)
    kpis.skills_auto_generated = c.auto_skills_created;
    kpis.skills_pruned = c.skills_pruned;

    kpis.pattern_confidence_avg = a.pattern_count > 0
        ? (a.pattern_confidence_sum / a.pattern_count).toFixed(3)
        : 0;

    kpis.ab_test_win_rate = c.total_ab_tests > 0
        ? (c.ab_tests_with_winner / c.total_ab_tests * 100).toFixed(2)
        : 0;

    kpis.learning_velocity = c.new_patterns_this_week;

    // Improvement Metrics (16-18)
    const lastWeek = metrics.weekly.last_week_success_rate;
    const thisWeek = parseFloat(kpis.task_success_rate);
    kpis.week_over_week_improvement = lastWeek && lastWeek > 0
        ? ((thisWeek - lastWeek) / lastWeek * 100).toFixed(2)
        : 0;

    kpis.error_reduction_rate = c.baseline_errors > 0
        ? ((1 - c.current_errors / c.baseline_errors) * 100).toFixed(2)
        : 0;

    kpis.skill_roi = c.total_skill_creation_time_seconds > 0
        ? (c.total_time_saved_seconds / c.total_skill_creation_time_seconds).toFixed(2)
        : 0;

    metrics.kpis = kpis;
    return metrics;
}

// ============================================================================
// EVENT RECORDING
// ============================================================================

/**
 * Record a task event
 * @param {Object} event - Task event details
 */
export function recordTaskEvent(event) {
    const metrics = loadMetrics();
    const c = metrics.counters;
    const a = metrics.aggregates;

    c.total_tasks++;

    if (event.success) {
        c.successful_tasks++;
    } else {
        c.failed_tasks++;
        c.total_errors++;

        // Check if this error is a repeat
        if (event.errorId && event.isRepeat) {
            c.repeated_errors++;
        }
    }

    if (event.firstAttempt) {
        c.no_retry_tasks++;
    }

    if (event.manualFix) {
        c.manual_fixes++;
    }

    if (event.duration) {
        a.total_task_duration_seconds += event.duration;
    }

    if (event.skillApplied) {
        c.tasks_with_skill++;
        c.tasks_where_skill_applied++;

        if (event.skillHelped) {
            c.tasks_helped_by_skill++;
        }
    }

    recalculateKPIs(metrics);
    saveMetrics(metrics);

    return metrics;
}

/**
 * Record a pattern event
 * @param {Object} event - Pattern event details
 */
export function recordPatternEvent(event) {
    const metrics = loadMetrics();
    const c = metrics.counters;
    const a = metrics.aggregates;

    c.total_alerts++;

    if (event.type === 'true_positive') {
        c.true_positives++;
    } else if (event.type === 'false_positive') {
        c.false_positives++;
    } else if (event.type === 'false_negative') {
        c.false_negatives++;
    }

    if (event.confidence !== undefined) {
        a.pattern_confidence_sum += event.confidence;
        a.pattern_count++;
    }

    if (event.newPattern) {
        c.new_patterns_this_week++;
    }

    recalculateKPIs(metrics);
    saveMetrics(metrics);

    return metrics;
}

/**
 * Record a skill event
 * @param {Object} event - Skill event details
 */
export function recordSkillEvent(event) {
    const metrics = loadMetrics();
    const c = metrics.counters;

    if (event.type === 'created') {
        c.auto_skills_created++;
        if (event.creationTime) {
            c.total_skill_creation_time_seconds += event.creationTime;
        }
    } else if (event.type === 'pruned') {
        c.skills_pruned++;
    }

    if (event.timeSaved) {
        c.total_time_saved_seconds += event.timeSaved;
    }

    recalculateKPIs(metrics);
    saveMetrics(metrics);

    return metrics;
}

/**
 * Record an A/B test result
 * @param {Object} event - A/B test event details
 */
export function recordABTestEvent(event) {
    const metrics = loadMetrics();
    const c = metrics.counters;

    c.total_ab_tests++;

    if (event.hasWinner) {
        c.ab_tests_with_winner++;
    }

    recalculateKPIs(metrics);
    saveMetrics(metrics);

    return metrics;
}

/**
 * Set baseline for error reduction tracking
 */
export function setErrorBaseline() {
    const metrics = loadMetrics();
    metrics.counters.baseline_errors = metrics.counters.total_errors;
    metrics.counters.current_errors = 0;
    saveMetrics(metrics);
}

/**
 * Rotate weekly metrics (call at week start)
 */
export function rotateWeeklyMetrics() {
    const metrics = loadMetrics();
    const weekStart = getWeekStart();

    // Save last week's success rate
    metrics.weekly.last_week_success_rate = parseFloat(metrics.kpis.task_success_rate) || null;

    // Reset weekly counters
    metrics.counters.new_patterns_this_week = 0;
    metrics.weekly.current_week_start = weekStart.toISOString();

    recalculateKPIs(metrics);
    saveMetrics(metrics);

    // Take snapshot for history
    appendHistory(metrics.kpis);

    return metrics;
}

// ============================================================================
// DASHBOARD API
// ============================================================================

/**
 * Get all current KPIs for Dashboard
 * @returns {Object} - KPIs with validation status
 */
export function getDashboardData() {
    const metrics = loadMetrics();
    const dashboard = {
        updatedAt: metrics.updatedAt,
        kpis: {}
    };

    Object.entries(metrics.kpis).forEach(([id, value]) => {
        const validation = validateMetric(id, parseFloat(value));
        const schema = Object.values(METRICS_SCHEMA).find(m => m.id === id);

        dashboard.kpis[id] = {
            value: parseFloat(value),
            status: validation.status,
            message: validation.message,
            widget: schema?.dashboard?.widget || 'number',
            color: schema?.dashboard?.color || 'gray',
            name: schema?.name || id,
            unit: schema?.unit || ''
        };
    });

    return dashboard;
}

/**
 * Get metrics history for trend charts
 * @param {string} metricId - Metric ID to get history for
 * @param {number} limit - Number of entries to return
 * @returns {Array} - Array of { timestamp, value } objects
 */
export function getMetricHistory(metricId, limit = 30) {
    try {
        if (!fs.existsSync(HISTORY_FILE)) {
            return [];
        }

        const history = JSON.parse(fs.readFileSync(HISTORY_FILE, 'utf8'));

        return history
            .slice(-limit)
            .map(entry => ({
                timestamp: entry.timestamp,
                value: entry[metricId] || 0
            }));
    } catch (error) {
        return [];
    }
}

/**
 * Get summary statistics
 * @returns {Object} - Summary object
 */
export function getSummary() {
    const metrics = loadMetrics();

    return {
        totalTasks: metrics.counters.total_tasks,
        successRate: metrics.kpis.task_success_rate,
        skillsGenerated: metrics.counters.auto_skills_created,
        patternsLearned: metrics.aggregates.pattern_count,
        lastUpdated: metrics.updatedAt
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    loadMetrics,
    saveMetrics,
    recalculateKPIs,
    recordTaskEvent,
    recordPatternEvent,
    recordSkillEvent,
    recordABTestEvent,
    setErrorBaseline,
    rotateWeeklyMetrics,
    getDashboardData,
    getMetricHistory,
    getSummary
};
