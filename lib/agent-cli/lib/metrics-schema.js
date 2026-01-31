/**
 * AutoLearn v6.0 - Metrics Schema
 * 
 * Defines all 18 KPIs for the Precision Learning Engine.
 * These metrics are measurable and displayed on Dashboard.
 * 
 * @version 6.0.0
 * @author PikaKit
 */

// ============================================================================
// METRIC CATEGORIES
// ============================================================================

export const METRIC_CATEGORIES = {
    CORE: 'core',           // Task success/failure metrics
    LEARNING: 'learning',   // Pattern learning effectiveness
    EVOLUTION: 'evolution', // Skill evolution tracking
    IMPROVEMENT: 'improvement' // Week-over-week improvements
};

// ============================================================================
// 18 KPIs DEFINITION
// ============================================================================

export const METRICS_SCHEMA = {
    // ─────────────────────────────────────────────────────────────────────────
    // CORE METRICS (1-5)
    // ─────────────────────────────────────────────────────────────────────────

    TASK_SUCCESS_RATE: {
        id: 'task_success_rate',
        name: 'Task Success Rate',
        description: 'Percentage of tasks completed without errors',
        category: METRIC_CATEGORIES.CORE,
        formula: 'successful_tasks / total_tasks * 100',
        unit: '%',
        target: 90,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'green',
            position: { row: 1, col: 1 }
        }
    },

    ERROR_REPEAT_RATE: {
        id: 'error_repeat_rate',
        name: 'Error Repeat Rate',
        description: 'Percentage of errors that occurred more than once',
        category: METRIC_CATEGORIES.CORE,
        formula: 'repeated_errors / total_errors * 100',
        unit: '%',
        target: 5,
        direction: 'lower_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'red',
            position: { row: 1, col: 2 }
        }
    },

    FIRST_TIME_SUCCESS: {
        id: 'first_time_success',
        name: 'First-Time Success',
        description: 'Percentage of tasks completed on first attempt',
        category: METRIC_CATEGORIES.CORE,
        formula: 'no_retry_tasks / total_tasks * 100',
        unit: '%',
        target: 85,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'green',
            position: { row: 1, col: 3 }
        }
    },

    TIME_TO_COMPLETION: {
        id: 'time_to_completion',
        name: 'Time to Completion',
        description: 'Average time to complete a task',
        category: METRIC_CATEGORIES.CORE,
        formula: 'avg(task_end - task_start)',
        unit: 'seconds',
        target: null, // Track trend, no fixed target
        direction: 'lower_is_better',
        dashboard: {
            widget: 'trend_line',
            color: 'blue',
            position: { row: 2, col: 1 }
        }
    },

    HUMAN_INTERVENTION_RATE: {
        id: 'human_intervention_rate',
        name: 'Human Intervention Rate',
        description: 'Percentage of tasks requiring manual user fix',
        category: METRIC_CATEGORIES.CORE,
        formula: 'manual_fixes / total_tasks * 100',
        unit: '%',
        target: 10,
        direction: 'lower_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'orange',
            position: { row: 2, col: 2 }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // LEARNING METRICS (6-10)
    // ─────────────────────────────────────────────────────────────────────────

    PATTERN_PRECISION: {
        id: 'pattern_precision',
        name: 'Pattern Precision',
        description: 'How often detected patterns are true positives',
        category: METRIC_CATEGORIES.LEARNING,
        formula: 'true_positives / (true_positives + false_positives)',
        unit: '%',
        target: 80,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'purple',
            position: { row: 3, col: 1 }
        }
    },

    PATTERN_RECALL: {
        id: 'pattern_recall',
        name: 'Pattern Recall',
        description: 'How many actual issues are caught by patterns',
        category: METRIC_CATEGORIES.LEARNING,
        formula: 'true_positives / (true_positives + false_negatives)',
        unit: '%',
        target: 70,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'purple',
            position: { row: 3, col: 2 }
        }
    },

    SKILL_EFFECTIVENESS: {
        id: 'skill_effectiveness',
        name: 'Skill Effectiveness',
        description: 'Percentage of times a skill actually helped',
        category: METRIC_CATEGORIES.LEARNING,
        formula: 'tasks_helped / tasks_where_skill_applied * 100',
        unit: '%',
        target: 75,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'bar_chart',
            color: 'teal',
            position: { row: 4, col: 1 }
        }
    },

    SKILL_COVERAGE: {
        id: 'skill_coverage',
        name: 'Skill Coverage',
        description: 'Percentage of tasks that had relevant skills loaded',
        category: METRIC_CATEGORIES.LEARNING,
        formula: 'tasks_with_skill / total_tasks * 100',
        unit: '%',
        target: 60,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'pie_chart',
            color: 'cyan',
            position: { row: 4, col: 2 }
        }
    },

    FALSE_POSITIVE_RATE: {
        id: 'false_positive_rate',
        name: 'False Positive Rate',
        description: 'Percentage of alerts that were incorrect',
        category: METRIC_CATEGORIES.LEARNING,
        formula: 'false_positives / total_alerts * 100',
        unit: '%',
        target: 10,
        direction: 'lower_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'red',
            position: { row: 3, col: 3 }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // EVOLUTION METRICS (11-15)
    // ─────────────────────────────────────────────────────────────────────────

    SKILLS_AUTO_GENERATED: {
        id: 'skills_auto_generated',
        name: 'Skills Auto-Generated',
        description: 'Total number of skills created automatically',
        category: METRIC_CATEGORIES.EVOLUTION,
        formula: 'count(auto_skills)',
        unit: 'count',
        target: null, // Track absolute number
        direction: 'higher_is_better',
        dashboard: {
            widget: 'counter',
            color: 'green',
            position: { row: 5, col: 1 }
        }
    },

    SKILLS_PRUNED: {
        id: 'skills_pruned',
        name: 'Skills Pruned',
        description: 'Total number of ineffective skills removed',
        category: METRIC_CATEGORIES.EVOLUTION,
        formula: 'count(pruned_skills)',
        unit: 'count',
        target: null, // Track absolute number
        direction: 'neutral',
        dashboard: {
            widget: 'counter',
            color: 'gray',
            position: { row: 5, col: 2 }
        }
    },

    PATTERN_CONFIDENCE_AVG: {
        id: 'pattern_confidence_avg',
        name: 'Average Pattern Confidence',
        description: 'Mean confidence score across all patterns',
        category: METRIC_CATEGORIES.EVOLUTION,
        formula: 'avg(pattern.confidence)',
        unit: 'score',
        target: 0.7,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'blue',
            position: { row: 5, col: 3 }
        }
    },

    AB_TEST_WIN_RATE: {
        id: 'ab_test_win_rate',
        name: 'A/B Test Win Rate',
        description: 'Percentage of A/B tests that selected a clear winner',
        category: METRIC_CATEGORIES.EVOLUTION,
        formula: 'winner_selected / total_ab_tests * 100',
        unit: '%',
        target: 60,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'pie_chart',
            color: 'indigo',
            position: { row: 6, col: 1 }
        }
    },

    LEARNING_VELOCITY: {
        id: 'learning_velocity',
        name: 'Learning Velocity',
        description: 'Number of new patterns learned per week',
        category: METRIC_CATEGORIES.EVOLUTION,
        formula: 'new_patterns_this_week',
        unit: 'patterns/week',
        target: null, // Track trend
        direction: 'higher_is_better',
        dashboard: {
            widget: 'trend_line',
            color: 'green',
            position: { row: 6, col: 2 }
        }
    },

    // ─────────────────────────────────────────────────────────────────────────
    // IMPROVEMENT METRICS (16-18)
    // ─────────────────────────────────────────────────────────────────────────

    WEEK_OVER_WEEK_IMPROVEMENT: {
        id: 'week_over_week_improvement',
        name: 'Week-over-Week Improvement',
        description: 'Percentage improvement in success rate vs last week',
        category: METRIC_CATEGORIES.IMPROVEMENT,
        formula: '(this_week_success - last_week_success) / last_week_success * 100',
        unit: '%',
        target: 0, // Any positive is good
        direction: 'higher_is_better',
        dashboard: {
            widget: 'trend_line',
            color: 'green',
            position: { row: 7, col: 1 }
        }
    },

    ERROR_REDUCTION_RATE: {
        id: 'error_reduction_rate',
        name: 'Error Reduction Rate',
        description: 'Percentage reduction in errors compared to baseline',
        category: METRIC_CATEGORIES.IMPROVEMENT,
        formula: '1 - (current_errors / baseline_errors) * 100',
        unit: '%',
        target: 50,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'gauge',
            color: 'green',
            position: { row: 7, col: 2 }
        }
    },

    SKILL_ROI: {
        id: 'skill_roi',
        name: 'Skill ROI',
        description: 'Return on investment for skill creation (time saved / time to create)',
        category: METRIC_CATEGORIES.IMPROVEMENT,
        formula: 'total_time_saved / total_time_to_create_skills',
        unit: 'x',
        target: 10,
        direction: 'higher_is_better',
        dashboard: {
            widget: 'number',
            color: 'gold',
            position: { row: 7, col: 3 }
        }
    }
};

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Get all metrics in a category
 * @param {string} category - Category name
 * @returns {Array} - Array of metric definitions
 */
export function getMetricsByCategory(category) {
    return Object.values(METRICS_SCHEMA).filter(m => m.category === category);
}

/**
 * Get metric by ID
 * @param {string} id - Metric ID
 * @returns {Object|null} - Metric definition or null
 */
export function getMetricById(id) {
    return Object.values(METRICS_SCHEMA).find(m => m.id === id) || null;
}

/**
 * Get all metric IDs
 * @returns {Array<string>} - Array of metric IDs
 */
export function getAllMetricIds() {
    return Object.values(METRICS_SCHEMA).map(m => m.id);
}

/**
 * Get metrics for dashboard by position
 * @returns {Array} - Metrics sorted by dashboard position
 */
export function getMetricsForDashboard() {
    return Object.values(METRICS_SCHEMA)
        .sort((a, b) => {
            const rowDiff = a.dashboard.position.row - b.dashboard.position.row;
            if (rowDiff !== 0) return rowDiff;
            return a.dashboard.position.col - b.dashboard.position.col;
        });
}

/**
 * Validate a metric value against its target
 * @param {string} metricId - Metric ID
 * @param {number} value - Current value
 * @returns {{ status: 'good'|'warning'|'critical', message: string }}
 */
export function validateMetric(metricId, value) {
    const metric = getMetricById(metricId);
    if (!metric || metric.target === null) {
        return { status: 'neutral', message: 'No target defined' };
    }

    const isHigherBetter = metric.direction === 'higher_is_better';
    const target = metric.target;
    const threshold = target * 0.2; // 20% tolerance

    if (isHigherBetter) {
        if (value >= target) return { status: 'good', message: `Above target (${target}${metric.unit})` };
        if (value >= target - threshold) return { status: 'warning', message: `Near target (${target}${metric.unit})` };
        return { status: 'critical', message: `Below target (${target}${metric.unit})` };
    } else {
        if (value <= target) return { status: 'good', message: `Below target (${target}${metric.unit})` };
        if (value <= target + threshold) return { status: 'warning', message: `Near target (${target}${metric.unit})` };
        return { status: 'critical', message: `Above target (${target}${metric.unit})` };
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default METRICS_SCHEMA;

// Re-export for CommonJS compatibility
export const VERSION = '6.0.0';
export const TOTAL_METRICS = Object.keys(METRICS_SCHEMA).length;
