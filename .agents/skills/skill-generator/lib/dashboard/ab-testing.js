/**
 * A/B Testing v7.0 - Pattern Experiment Framework
 * 
 * Manages A/B tests for comparing pattern effectiveness.
 * Tracks experiment results and determines winners.
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
const AB_TESTS_FILE = path.join(METRICS_DIR, 'ab-tests.json');

// ============================================================================
// DATA STRUCTURES
// ============================================================================

/**
 * A/B Test structure:
 * {
 *   id: string,
 *   name: string,
 *   description: string,
 *   variantA: { id: string, patternId: string, description: string },
 *   variantB: { id: string, patternId: string, description: string },
 *   status: 'running' | 'completed' | 'paused',
 *   startDate: string,
 *   endDate: string | null,
 *   results: {
 *     variantA: { impressions: number, successes: number },
 *     variantB: { impressions: number, successes: number }
 *   },
 *   winner: 'A' | 'B' | null,
 *   confidence: number
 * }
 */

// ============================================================================
// DATA LOADERS
// ============================================================================

/**
 * Ensure metrics directory exists
 */
function ensureMetricsDir() {
    if (!fs.existsSync(METRICS_DIR)) {
        fs.mkdirSync(METRICS_DIR, { recursive: true });
    }
}

/**
 * Load A/B tests data
 */
function loadABTestsData() {
    if (fs.existsSync(AB_TESTS_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(AB_TESTS_FILE, 'utf8'));
        } catch (e) {
            return getDefaultData();
        }
    }
    return getDefaultData();
}

/**
 * Save A/B tests data
 */
function saveABTestsData(data) {
    ensureMetricsDir();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(AB_TESTS_FILE, JSON.stringify(data, null, 2));
}

/**
 * Get default data structure
 */
function getDefaultData() {
    return {
        tests: [],
        lastUpdated: new Date().toISOString(),
        totalCompleted: 0
    };
}

// ============================================================================
// TEST MANAGEMENT
// ============================================================================

/**
 * Create a new A/B test
 */
export function createTest(name, description, variantA, variantB) {
    const data = loadABTestsData();

    const test = {
        id: `test-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        name,
        description,
        variantA: {
            id: 'A',
            ...variantA
        },
        variantB: {
            id: 'B',
            ...variantB
        },
        status: 'running',
        startDate: new Date().toISOString(),
        endDate: null,
        results: {
            variantA: { impressions: 0, successes: 0 },
            variantB: { impressions: 0, successes: 0 }
        },
        winner: null,
        confidence: 0
    };

    data.tests.push(test);
    saveABTestsData(data);

    return test;
}

/**
 * Record an impression for a variant
 */
export function recordImpression(testId, variant, success = false) {
    const data = loadABTestsData();
    const test = data.tests.find(t => t.id === testId);

    if (!test || test.status !== 'running') {
        return { success: false, error: 'Test not found or not running' };
    }

    const variantKey = variant.toUpperCase() === 'A' ? 'variantA' : 'variantB';
    test.results[variantKey].impressions += 1;

    if (success) {
        test.results[variantKey].successes += 1;
    }

    // Recalculate confidence
    updateTestConfidence(test);

    // Auto-complete if enough data
    const minImpressions = 30;
    if (test.results.variantA.impressions >= minImpressions &&
        test.results.variantB.impressions >= minImpressions &&
        test.confidence >= 0.95) {
        completeTest(testId);
    }

    saveABTestsData(data);

    return { success: true, test };
}

/**
 * Update test confidence using simple statistical calculation
 */
function updateTestConfidence(test) {
    const rA = test.results.variantA;
    const rB = test.results.variantB;

    if (rA.impressions === 0 || rB.impressions === 0) {
        test.confidence = 0;
        return;
    }

    const successRateA = rA.successes / rA.impressions;
    const successRateB = rB.successes / rB.impressions;

    // Simple confidence calculation based on sample size and difference
    const n = Math.min(rA.impressions, rB.impressions);
    const diff = Math.abs(successRateA - successRateB);

    // Higher sample size and larger difference = higher confidence
    test.confidence = Math.min(
        (n / 50) * (diff / 0.2), // Scale by sample size and effect size
        0.99
    );

    // Determine preliminary winner
    if (test.confidence >= 0.8) {
        test.winner = successRateA > successRateB ? 'A' : 'B';
    }
}

/**
 * Complete a test
 */
export function completeTest(testId) {
    const data = loadABTestsData();
    const test = data.tests.find(t => t.id === testId);

    if (!test) {
        return { success: false, error: 'Test not found' };
    }

    test.status = 'completed';
    test.endDate = new Date().toISOString();

    // Determine final winner
    const rA = test.results.variantA;
    const rB = test.results.variantB;

    if (rA.impressions > 0 && rB.impressions > 0) {
        const successRateA = rA.successes / rA.impressions;
        const successRateB = rB.successes / rB.impressions;
        test.winner = successRateA >= successRateB ? 'A' : 'B';
    }

    data.totalCompleted = (data.totalCompleted || 0) + 1;
    saveABTestsData(data);

    return { success: true, test };
}

/**
 * Pause a test
 */
export function pauseTest(testId) {
    const data = loadABTestsData();
    const test = data.tests.find(t => t.id === testId);

    if (!test) {
        return { success: false, error: 'Test not found' };
    }

    test.status = 'paused';
    saveABTestsData(data);

    return { success: true, test };
}

/**
 * Resume a test
 */
export function resumeTest(testId) {
    const data = loadABTestsData();
    const test = data.tests.find(t => t.id === testId);

    if (!test || test.status === 'completed') {
        return { success: false, error: 'Test not found or already completed' };
    }

    test.status = 'running';
    saveABTestsData(data);

    return { success: true, test };
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all active tests
 */
export function getActiveTests() {
    const data = loadABTestsData();
    return data.tests.filter(t => t.status === 'running');
}

/**
 * Get completed tests
 */
export function getCompletedTests() {
    const data = loadABTestsData();
    return data.tests.filter(t => t.status === 'completed');
}

/**
 * Get all tests
 */
export function getAllTests() {
    const data = loadABTestsData();
    return data.tests;
}

/**
 * Get test by ID
 */
export function getTest(testId) {
    const data = loadABTestsData();
    return data.tests.find(t => t.id === testId);
}

/**
 * Get A/B testing statistics
 */
export function getABTestStats() {
    const data = loadABTestsData();
    const active = data.tests.filter(t => t.status === 'running');
    const completed = data.tests.filter(t => t.status === 'completed');

    // Calculate win rate for variant A vs B
    let aWins = 0;
    let bWins = 0;

    for (const test of completed) {
        if (test.winner === 'A') aWins++;
        else if (test.winner === 'B') bWins++;
    }

    return {
        running: active.length,
        completed: completed.length,
        total: data.tests.length,
        variantAWinRate: completed.length > 0 ? Math.round((aWins / completed.length) * 100) : 0,
        variantBWinRate: completed.length > 0 ? Math.round((bWins / completed.length) * 100) : 0
    };
}

/**
 * Select variant for a test (randomized)
 */
export function selectVariant(testId) {
    const test = getTest(testId);

    if (!test || test.status !== 'running') {
        return null;
    }

    // Simple 50/50 split
    return Math.random() < 0.5 ? 'A' : 'B';
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createTest,
    recordImpression,
    completeTest,
    pauseTest,
    resumeTest,
    getActiveTests,
    getCompletedTests,
    getAllTests,
    getTest,
    getABTestStats,
    selectVariant
};
