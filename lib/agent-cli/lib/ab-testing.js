/**
 * AutoLearn v6.0 - A/B Testing Engine
 * 
 * Compares patterns to determine which is more effective.
 * Uses statistical significance to select winners.
 * 
 * Key concepts:
 * - Split Traffic: 50/50 allocation between patterns
 * - Track Outcomes: Success rate per pattern
 * - Statistical Significance: Chi-square test
 * - Winner Selection: Auto-select when significant
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { recordABTestEvent } from './metrics-collector.js';
import { applyReinforcement, REINFORCEMENT_RULES } from './reinforcement.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const AB_TESTS_FILE = path.join(KNOWLEDGE_DIR, 'ab-tests.json');

// Minimum samples before we can determine winner
const MIN_SAMPLES_PER_VARIANT = 10;

// Confidence level for statistical significance (95%)
const SIGNIFICANCE_LEVEL = 0.95;

// Default test duration (7 days)
const DEFAULT_TEST_DURATION_MS = 7 * 24 * 60 * 60 * 1000;

// ============================================================================
// A/B TEST DATA STRUCTURE
// ============================================================================

/**
 * @typedef {Object} ABTest
 * @property {string} id - Test ID
 * @property {string} status - 'pending' | 'running' | 'completed' | 'cancelled'
 * @property {Object} patternA - Pattern A details
 * @property {Object} patternB - Pattern B details (or baseline)
 * @property {number} allocation - Traffic split (0.5 = 50/50)
 * @property {Object} metrics - Success metrics per variant
 * @property {Object} result - Test result when completed
 */

// ============================================================================
// TEST MANAGEMENT
// ============================================================================

/**
 * Create a new A/B test
 * @param {Object} patternA - First pattern
 * @param {Object} patternB - Second pattern (or null for baseline)
 * @param {Object} options - Test options
 * @returns {Object} - Created test
 */
export function createABTest(patternA, patternB = null, options = {}) {
    const test = {
        id: `AB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        startedAt: null,
        endedAt: null,
        status: 'pending',

        // Patterns
        patternA: {
            id: patternA.id,
            confidence: patternA.confidence,
            name: patternA.name || patternA.id
        },
        patternB: patternB ? {
            id: patternB.id,
            confidence: patternB.confidence,
            name: patternB.name || patternB.id
        } : {
            id: 'baseline',
            confidence: null,
            name: 'No pattern (baseline)'
        },

        // Configuration
        allocation: options.allocation || 0.5,
        minSamples: options.minSamples || MIN_SAMPLES_PER_VARIANT,
        maxDuration: options.maxDuration || DEFAULT_TEST_DURATION_MS,

        // Metrics
        metrics: {
            patternA: { applied: 0, success: 0, failure: 0, totalTime: 0 },
            patternB: { applied: 0, success: 0, failure: 0, totalTime: 0 }
        },

        // Result (filled when completed)
        result: null
    };

    saveABTest(test);
    return test;
}

/**
 * Start an A/B test
 * @param {string} testId - Test ID
 * @returns {Object} - Updated test
 */
export function startABTest(testId) {
    const test = loadABTest(testId);
    if (!test) return null;

    test.status = 'running';
    test.startedAt = new Date().toISOString();

    saveABTest(test);
    return test;
}

/**
 * Get which variant to use for a task
 * @param {string} testId - Test ID
 * @returns {string} - 'patternA' | 'patternB'
 */
export function getVariantForTask(testId) {
    const test = loadABTest(testId);
    if (!test || test.status !== 'running') {
        return null;
    }

    // Simple random allocation
    return Math.random() < test.allocation ? 'patternA' : 'patternB';
}

/**
 * Record outcome for an A/B test
 * @param {string} testId - Test ID
 * @param {string} variant - 'patternA' | 'patternB'
 * @param {Object} outcome - Task outcome
 */
export function recordABOutcome(testId, variant, outcome) {
    const test = loadABTest(testId);
    if (!test || test.status !== 'running') return null;

    const metrics = test.metrics[variant];
    if (!metrics) return null;

    metrics.applied++;

    if (outcome.success) {
        metrics.success++;
    } else {
        metrics.failure++;
    }

    if (outcome.duration) {
        metrics.totalTime += outcome.duration;
    }

    // Check if test should complete
    const shouldComplete = checkTestCompletion(test);
    if (shouldComplete.complete) {
        completeABTest(testId, shouldComplete.reason);
    } else {
        saveABTest(test);
    }

    return test;
}

// ============================================================================
// STATISTICAL ANALYSIS
// ============================================================================

/**
 * Calculate success rate for a variant
 * @param {Object} metrics - Variant metrics
 * @returns {number} - Success rate 0.0 to 1.0
 */
function calculateSuccessRate(metrics) {
    if (metrics.applied === 0) return 0;
    return metrics.success / metrics.applied;
}

/**
 * Calculate chi-square statistic for A/B comparison
 * @param {Object} metricsA - Pattern A metrics
 * @param {Object} metricsB - Pattern B metrics
 * @returns {Object} - Chi-square result
 */
function calculateChiSquare(metricsA, metricsB) {
    const totalA = metricsA.success + metricsA.failure;
    const totalB = metricsB.success + metricsB.failure;
    const total = totalA + totalB;

    if (total === 0) return { chiSquare: 0, significant: false };

    const successTotal = metricsA.success + metricsB.success;
    const failureTotal = metricsA.failure + metricsB.failure;

    // Expected values
    const expectedASuccess = (totalA * successTotal) / total;
    const expectedAFailure = (totalA * failureTotal) / total;
    const expectedBSuccess = (totalB * successTotal) / total;
    const expectedBFailure = (totalB * failureTotal) / total;

    // Chi-square calculation
    let chiSquare = 0;

    if (expectedASuccess > 0) {
        chiSquare += Math.pow(metricsA.success - expectedASuccess, 2) / expectedASuccess;
    }
    if (expectedAFailure > 0) {
        chiSquare += Math.pow(metricsA.failure - expectedAFailure, 2) / expectedAFailure;
    }
    if (expectedBSuccess > 0) {
        chiSquare += Math.pow(metricsB.success - expectedBSuccess, 2) / expectedBSuccess;
    }
    if (expectedBFailure > 0) {
        chiSquare += Math.pow(metricsB.failure - expectedBFailure, 2) / expectedBFailure;
    }

    // Critical value for 95% confidence, 1 degree of freedom
    const criticalValue = 3.841;
    const significant = chiSquare > criticalValue;

    return {
        chiSquare,
        criticalValue,
        significant,
        confidence: significant ? 0.95 : chiSquare / criticalValue * 0.95
    };
}

/**
 * Analyze A/B test results
 * @param {Object} test - A/B test object
 * @returns {Object} - Analysis result
 */
export function analyzeABTest(test) {
    const metricsA = test.metrics.patternA;
    const metricsB = test.metrics.patternB;

    const rateA = calculateSuccessRate(metricsA);
    const rateB = calculateSuccessRate(metricsB);

    const chiSquareResult = calculateChiSquare(metricsA, metricsB);

    const avgTimeA = metricsA.applied > 0 ? metricsA.totalTime / metricsA.applied : 0;
    const avgTimeB = metricsB.applied > 0 ? metricsB.totalTime / metricsB.applied : 0;

    // Determine winner
    let winner = null;
    let winnerReason = '';
    let margin = 0;

    if (chiSquareResult.significant) {
        if (rateA > rateB) {
            winner = 'patternA';
            margin = rateA - rateB;
            winnerReason = `Higher success rate by ${(margin * 100).toFixed(1)}%`;
        } else if (rateB > rateA) {
            winner = 'patternB';
            margin = rateB - rateA;
            winnerReason = `Higher success rate by ${(margin * 100).toFixed(1)}%`;
        }
    } else {
        winnerReason = 'No statistically significant difference';
    }

    return {
        patternA: {
            id: test.patternA.id,
            samples: metricsA.applied,
            successRate: rateA,
            avgTime: avgTimeA
        },
        patternB: {
            id: test.patternB.id,
            samples: metricsB.applied,
            successRate: rateB,
            avgTime: avgTimeB
        },
        statistics: chiSquareResult,
        winner,
        winnerReason,
        margin,
        analyzedAt: new Date().toISOString()
    };
}

// ============================================================================
// TEST COMPLETION
// ============================================================================

/**
 * Check if test should be completed
 * @param {Object} test - A/B test
 * @returns {Object} - { complete: boolean, reason: string }
 */
function checkTestCompletion(test) {
    const metricsA = test.metrics.patternA;
    const metricsB = test.metrics.patternB;

    // Check minimum samples
    if (metricsA.applied >= test.minSamples && metricsB.applied >= test.minSamples) {
        const analysis = analyzeABTest(test);

        if (analysis.statistics.significant) {
            return {
                complete: true,
                reason: 'Statistical significance reached'
            };
        }
    }

    // Check max duration
    if (test.startedAt) {
        const duration = Date.now() - new Date(test.startedAt).getTime();
        if (duration > test.maxDuration) {
            return {
                complete: true,
                reason: 'Max duration reached'
            };
        }
    }

    // Check if one variant is clearly better (early stopping)
    const totalSamples = metricsA.applied + metricsB.applied;
    if (totalSamples >= 20) {
        const rateA = calculateSuccessRate(metricsA);
        const rateB = calculateSuccessRate(metricsB);
        const diff = Math.abs(rateA - rateB);

        // Early stop if difference > 30%
        if (diff > 0.3) {
            return {
                complete: true,
                reason: 'Clear winner detected (early stopping)'
            };
        }
    }

    return { complete: false };
}

/**
 * Complete an A/B test and apply results
 * @param {string} testId - Test ID
 * @param {string} reason - Completion reason
 * @returns {Object} - Completed test with results
 */
export function completeABTest(testId, reason) {
    const test = loadABTest(testId);
    if (!test) return null;

    const analysis = analyzeABTest(test);

    test.status = 'completed';
    test.endedAt = new Date().toISOString();
    test.result = {
        ...analysis,
        completionReason: reason
    };

    saveABTest(test);

    // Record for metrics
    recordABTestEvent({
        hasWinner: !!analysis.winner
    });

    // Apply reinforcement to winner/loser
    if (analysis.winner) {
        applyABTestReinforcement(test, analysis);
    }

    return test;
}

/**
 * Apply reinforcement based on A/B test results
 * @param {Object} test - Completed test
 * @param {Object} analysis - Test analysis
 */
function applyABTestReinforcement(test, analysis) {
    // Winner gets reward proportional to margin
    const winnerReward = Math.min(0.15, analysis.margin * 0.5);

    // Loser gets penalty
    const loserPenalty = -Math.min(0.10, analysis.margin * 0.3);

    console.log(`A/B Test ${test.id} completed:`);
    console.log(`  Winner: ${analysis.winner} (+${winnerReward.toFixed(2)} confidence)`);
    console.log(`  Reason: ${analysis.winnerReason}`);

    // Note: Actual pattern updates would be done by caller
    // This just logs the recommended adjustments
    return {
        winnerId: analysis.winner === 'patternA' ? test.patternA.id : test.patternB.id,
        loserId: analysis.winner === 'patternA' ? test.patternB.id : test.patternA.id,
        winnerReward,
        loserPenalty
    };
}

// ============================================================================
// STORAGE
// ============================================================================

/**
 * Load A/B test from disk
 * @param {string} testId - Test ID
 * @returns {Object|null} - Test or null
 */
export function loadABTest(testId) {
    const tests = loadAllABTests();
    return tests.find(t => t.id === testId) || null;
}

/**
 * Load all A/B tests
 * @returns {Array} - All tests
 */
export function loadAllABTests() {
    try {
        if (!fs.existsSync(AB_TESTS_FILE)) return [];
        return JSON.parse(fs.readFileSync(AB_TESTS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

/**
 * Save A/B test
 * @param {Object} test - Test to save
 */
export function saveABTest(test) {
    try {
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        const tests = loadAllABTests();
        const existingIndex = tests.findIndex(t => t.id === test.id);

        if (existingIndex >= 0) {
            tests[existingIndex] = test;
        } else {
            tests.push(test);
        }

        fs.writeFileSync(AB_TESTS_FILE, JSON.stringify(tests, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving A/B test:', error.message);
    }
}

/**
 * Get active A/B tests
 * @returns {Array} - Running tests
 */
export function getActiveTests() {
    return loadAllABTests().filter(t => t.status === 'running');
}

/**
 * Get A/B test statistics
 * @returns {Object} - Statistics
 */
export function getABTestStats() {
    const tests = loadAllABTests();

    const completed = tests.filter(t => t.status === 'completed');
    const withWinner = completed.filter(t => t.result?.winner);

    return {
        total: tests.length,
        running: tests.filter(t => t.status === 'running').length,
        completed: completed.length,
        withWinner: withWinner.length,
        winRate: completed.length > 0 ? withWinner.length / completed.length : 0,
        pending: tests.filter(t => t.status === 'pending').length
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createABTest,
    startABTest,
    getVariantForTask,
    recordABOutcome,
    analyzeABTest,
    completeABTest,
    loadABTest,
    loadAllABTests,
    saveABTest,
    getActiveTests,
    getABTestStats,
    MIN_SAMPLES_PER_VARIANT,
    SIGNIFICANCE_LEVEL
};
