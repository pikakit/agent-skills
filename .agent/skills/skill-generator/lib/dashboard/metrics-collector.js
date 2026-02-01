/**
 * Metrics Collector v7.0 - PikaKit Learning Metrics
 * 
 * Collects and manages 18 KPIs for the Dashboard.
 * Reads data from .agent/knowledge/ and .agent/metrics/
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
const KNOWLEDGE_DIR = path.join(projectRoot, '.agent', 'knowledge');
const METRICS_DIR = path.join(projectRoot, '.agent', 'metrics');

// Ensure metrics directory exists
function ensureMetricsDir() {
    if (!fs.existsSync(METRICS_DIR)) {
        fs.mkdirSync(METRICS_DIR, { recursive: true });
    }
}

// ============================================================================
// DATA LOADERS
// ============================================================================

/**
 * Load lessons from knowledge base
 */
function loadLessons() {
    const paths = [
        path.join(KNOWLEDGE_DIR, 'lessons-learned.json'),
        path.join(KNOWLEDGE_DIR, 'lessons-learned.yaml')
    ];

    for (const filePath of paths) {
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf8');
                if (filePath.endsWith('.json')) {
                    return JSON.parse(content).lessons || [];
                } else {
                    // Simple YAML parsing for lessons array
                    const lessons = [];
                    const lines = content.split('\n');
                    let currentLesson = null;

                    for (const line of lines) {
                        if (line.startsWith('- id:')) {
                            if (currentLesson) lessons.push(currentLesson);
                            currentLesson = { id: line.split(':')[1]?.trim() };
                        } else if (currentLesson && line.includes(':')) {
                            const [key, ...valueParts] = line.trim().split(':');
                            currentLesson[key.trim()] = valueParts.join(':').trim();
                        }
                    }
                    if (currentLesson) lessons.push(currentLesson);
                    return lessons;
                }
            } catch (e) {
                console.error('Error loading lessons:', e.message);
            }
        }
    }
    return [];
}

/**
 * Load metrics history
 */
function loadMetricsHistory() {
    const historyPath = path.join(METRICS_DIR, 'history.json');
    if (fs.existsSync(historyPath)) {
        try {
            return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
        } catch (e) {
            return { entries: [], lastUpdated: null };
        }
    }
    return { entries: [], lastUpdated: null };
}

/**
 * Save metrics history
 */
function saveMetricsHistory(history) {
    ensureMetricsDir();
    const historyPath = path.join(METRICS_DIR, 'history.json');
    history.lastUpdated = new Date().toISOString();
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

/**
 * Load current metrics snapshot
 */
function loadCurrentMetrics() {
    const metricsPath = path.join(METRICS_DIR, 'current.json');
    if (fs.existsSync(metricsPath)) {
        try {
            return JSON.parse(fs.readFileSync(metricsPath, 'utf8'));
        } catch (e) {
            return getDefaultMetrics();
        }
    }
    return getDefaultMetrics();
}

/**
 * Save current metrics
 */
function saveCurrentMetrics(metrics) {
    ensureMetricsDir();
    const metricsPath = path.join(METRICS_DIR, 'current.json');
    metrics.timestamp = new Date().toISOString();
    fs.writeFileSync(metricsPath, JSON.stringify(metrics, null, 2));
}

/**
 * Get default metrics structure
 */
function getDefaultMetrics() {
    return {
        // Task metrics
        total_tasks: 0,
        successful_tasks: 0,
        failed_tasks: 0,

        // Learning metrics
        patterns_learned: 0,
        skills_generated: 0,
        lessons_count: 0,

        // Performance metrics
        task_success_rate: 0,
        error_repeat_rate: 0,
        first_time_success_rate: 0,
        skill_effectiveness: 0,

        // Reinforcement metrics
        total_rewards: 0,
        total_penalties: 0,
        avg_confidence: 0,

        // A/B Testing metrics
        active_tests: 0,
        completed_tests: 0,

        // Timestamps
        timestamp: new Date().toISOString(),
        period_start: new Date().toISOString()
    };
}

// ============================================================================
// KPI CALCULATIONS
// ============================================================================

/**
 * Calculate all KPIs
 */
function calculateKPIs() {
    const lessons = loadLessons();
    const currentMetrics = loadCurrentMetrics();

    // Count patterns from lessons
    const patternsLearned = lessons.length;

    // Calculate rates
    const totalTasks = currentMetrics.total_tasks || 0;
    const successfulTasks = currentMetrics.successful_tasks || 0;
    const failedTasks = currentMetrics.failed_tasks || 0;

    const taskSuccessRate = totalTasks > 0
        ? Math.round((successfulTasks / totalTasks) * 100)
        : 0;

    // Error repeat rate (lessons with severity > 1 occurrence)
    const repeatedErrors = lessons.filter(l =>
        (l.occurrences && parseInt(l.occurrences) > 1) ||
        (l.severity === 'high' || l.severity === 'critical')
    ).length;
    const errorRepeatRate = lessons.length > 0
        ? Math.round((repeatedErrors / lessons.length) * 100)
        : 0;

    // First-time success (tasks without retries)
    const firstTimeSuccess = currentMetrics.first_time_success_rate || 0;

    // Build KPIs object
    return {
        kpis: {
            task_success_rate: {
                value: `${taskSuccessRate}%`,
                trend: taskSuccessRate >= 80 ? 'up' : 'down',
                status: taskSuccessRate >= 80 ? 'good' : taskSuccessRate >= 50 ? 'warning' : 'bad'
            },
            error_repeat_rate: {
                value: `${errorRepeatRate}%`,
                trend: errorRepeatRate <= 10 ? 'down' : 'up',
                status: errorRepeatRate <= 10 ? 'good' : errorRepeatRate <= 30 ? 'warning' : 'bad',
                hint: 'Lower is better'
            },
            first_time_success: {
                value: `${firstTimeSuccess}%`,
                trend: firstTimeSuccess >= 70 ? 'up' : 'down',
                status: firstTimeSuccess >= 70 ? 'good' : 'warning',
                hint: 'No retries needed'
            },
            skill_effectiveness: {
                value: `${currentMetrics.skill_effectiveness || 0}%`,
                trend: 'stable',
                status: 'neutral',
                hint: 'Skills that help'
            },
            total_tasks: {
                value: totalTasks,
                icon: '📊'
            },
            patterns_learned: {
                value: patternsLearned,
                icon: '🧩'
            },
            skills_generated: {
                value: currentMetrics.skills_generated || 0,
                icon: '⚙️'
            },
            ab_tests_active: {
                value: currentMetrics.active_tests || 0,
                icon: '🧪'
            }
        },
        summary: {
            totalTasks,
            patternsLearned,
            skillsGenerated: currentMetrics.skills_generated || 0,
            lessonsCount: lessons.length
        },
        timestamp: new Date().toISOString()
    };
}

/**
 * Get KPIs for dashboard
 */
export function getKPIs() {
    return calculateKPIs();
}

/**
 * Get dashboard data (alias)
 */
export function getDashboardData() {
    return calculateKPIs();
}

/**
 * Get summary stats
 */
export function getSummary() {
    const kpis = calculateKPIs();
    return {
        ...kpis.summary,
        version: '7.0.0',
        status: 'ok'
    };
}

/**
 * Get specific metric value
 */
export function getMetricValue(metricName) {
    const currentMetrics = loadCurrentMetrics();
    return currentMetrics[metricName] ?? null;
}

/**
 * Get metric history for charts
 */
export function getMetricHistory(metricName, limit = 168) {
    const history = loadMetricsHistory();
    const entries = history.entries || [];

    // Filter entries for specific metric
    const metricHistory = entries
        .filter(e => e[metricName] !== undefined)
        .slice(-limit)
        .map(e => ({
            timestamp: e.timestamp,
            value: e[metricName]
        }));

    return metricHistory;
}

// ============================================================================
// METRIC UPDATES
// ============================================================================

/**
 * Record a task completion
 */
export function recordTask(success, firstTime = true) {
    const metrics = loadCurrentMetrics();

    metrics.total_tasks = (metrics.total_tasks || 0) + 1;

    if (success) {
        metrics.successful_tasks = (metrics.successful_tasks || 0) + 1;
        if (firstTime) {
            const total = metrics.total_tasks;
            const firstTimeCount = Math.round((metrics.first_time_success_rate || 0) * (total - 1) / 100) + 1;
            metrics.first_time_success_rate = Math.round((firstTimeCount / total) * 100);
        }
    } else {
        metrics.failed_tasks = (metrics.failed_tasks || 0) + 1;
    }

    // Recalculate success rate
    metrics.task_success_rate = Math.round(
        (metrics.successful_tasks / metrics.total_tasks) * 100
    );

    saveCurrentMetrics(metrics);
    recordHistoryEntry(metrics);

    return metrics;
}

/**
 * Record a pattern learned
 */
export function recordPatternLearned() {
    const metrics = loadCurrentMetrics();
    metrics.patterns_learned = (metrics.patterns_learned || 0) + 1;
    saveCurrentMetrics(metrics);
    return metrics;
}

/**
 * Record a skill generated
 */
export function recordSkillGenerated() {
    const metrics = loadCurrentMetrics();
    metrics.skills_generated = (metrics.skills_generated || 0) + 1;
    saveCurrentMetrics(metrics);
    return metrics;
}

/**
 * Record history entry (hourly snapshot)
 */
function recordHistoryEntry(metrics) {
    const history = loadMetricsHistory();
    const now = new Date();

    // Only record once per hour
    const lastEntry = history.entries[history.entries.length - 1];
    if (lastEntry) {
        const lastTime = new Date(lastEntry.timestamp);
        const hoursDiff = (now - lastTime) / (1000 * 60 * 60);
        if (hoursDiff < 1) return;
    }

    history.entries.push({
        timestamp: now.toISOString(),
        task_success_rate: metrics.task_success_rate || 0,
        error_repeat_rate: metrics.error_repeat_rate || 0,
        patterns_learned: metrics.patterns_learned || 0,
        total_tasks: metrics.total_tasks || 0
    });

    // Keep last 7 days (168 hours)
    if (history.entries.length > 168) {
        history.entries = history.entries.slice(-168);
    }

    saveMetricsHistory(history);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    getKPIs,
    getDashboardData,
    getSummary,
    getMetricValue,
    getMetricHistory,
    recordTask,
    recordPatternLearned,
    recordSkillGenerated
};
