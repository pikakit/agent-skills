/**
 * AutoLearn v6.0 - Reinforcement Loop
 * 
 * Implements reinforcement learning for pattern confidence adjustment.
 * Rewards effective patterns, penalizes ineffective ones, prunes failures.
 * 
 * Key concepts:
 * - Reward: Increase confidence when pattern helps
 * - Penalty: Decrease confidence when pattern fails
 * - Prune: Remove patterns below MIN_CONFIDENCE
 * - Quarantine: A/B test patterns in danger zone
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { recordPatternEvent, recordSkillEvent } from './metrics-collector.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const REINFORCEMENT_LOG = path.join(KNOWLEDGE_DIR, 'reinforcement-log.json');

// ============================================================================
// REWARD/PENALTY RULES
// ============================================================================

export const REINFORCEMENT_RULES = {
    // ─────────────────────────────────────────────────────────────────────────
    // REWARD SIGNALS (Increase confidence)
    // ─────────────────────────────────────────────────────────────────────────

    TASK_SUCCESS_WITH_SKILL: {
        id: 'task_success_with_skill',
        delta: +0.15,
        reason: 'Skill helped task succeed',
        category: 'reward'
    },

    ERROR_PREVENTED: {
        id: 'error_prevented',
        delta: +0.20,
        reason: 'Pattern prevented known error',
        category: 'reward'
    },

    TIME_SAVED: {
        id: 'time_saved',
        delta: +0.10,
        reason: 'Task completed faster than average',
        category: 'reward'
    },

    USER_CONFIRMED_HELPFUL: {
        id: 'user_confirmed_helpful',
        delta: +0.25,
        reason: 'User explicitly confirmed skill was helpful',
        category: 'reward'
    },

    FIRST_TIME_SUCCESS: {
        id: 'first_time_success',
        delta: +0.12,
        reason: 'Task succeeded on first attempt with skill',
        category: 'reward'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // PENALTY SIGNALS (Decrease confidence)
    // ─────────────────────────────────────────────────────────────────────────

    SKILL_IGNORED: {
        id: 'skill_ignored',
        delta: -0.05,
        reason: 'Skill loaded but not applied',
        category: 'penalty'
    },

    FALSE_POSITIVE: {
        id: 'false_positive',
        delta: -0.15,
        reason: 'Pattern triggered incorrectly',
        category: 'penalty'
    },

    TASK_FAILED_WITH_SKILL: {
        id: 'task_failed_with_skill',
        delta: -0.20,
        reason: 'Skill did not prevent failure',
        category: 'penalty'
    },

    USER_REJECTED: {
        id: 'user_rejected',
        delta: -0.25,
        reason: 'User explicitly rejected suggestion',
        category: 'penalty'
    },

    PATTERN_OUTDATED: {
        id: 'pattern_outdated',
        delta: -0.10,
        reason: 'Pattern has not matched in 30+ days',
        category: 'penalty'
    },

    // ─────────────────────────────────────────────────────────────────────────
    // THRESHOLD ACTIONS
    // ─────────────────────────────────────────────────────────────────────────

    THRESHOLDS: {
        MIN_CONFIDENCE: 0.30,      // Below this = auto-prune
        QUARANTINE: 0.40,          // Below this = A/B test required
        STABLE: 0.70,              // Above this = considered stable
        PROMOTE: 0.85,             // Above this = promote to core skill
        MAX_CONFIDENCE: 0.99       // Cap confidence
    }
};

// ============================================================================
// REINFORCEMENT STATE
// ============================================================================

/**
 * Get reinforcement state for a pattern/skill
 * @param {number} confidence - Current confidence
 * @returns {string} - State: 'prune' | 'quarantine' | 'learning' | 'stable' | 'promote'
 */
export function getReinforcementState(confidence) {
    const T = REINFORCEMENT_RULES.THRESHOLDS;

    if (confidence < T.MIN_CONFIDENCE) return 'prune';
    if (confidence < T.QUARANTINE) return 'quarantine';
    if (confidence < T.STABLE) return 'learning';
    if (confidence < T.PROMOTE) return 'stable';
    return 'promote';
}

/**
 * Get action recommendation based on state
 * @param {string} state - Reinforcement state
 * @returns {Object} - Action recommendation
 */
export function getStateAction(state) {
    const actions = {
        prune: {
            action: 'remove',
            message: 'Pattern confidence too low, should be removed',
            urgent: true
        },
        quarantine: {
            action: 'ab_test',
            message: 'Pattern needs A/B testing to validate effectiveness',
            urgent: false
        },
        learning: {
            action: 'continue',
            message: 'Pattern is learning, gathering more evidence',
            urgent: false
        },
        stable: {
            action: 'maintain',
            message: 'Pattern is stable and effective',
            urgent: false
        },
        promote: {
            action: 'promote_to_skill',
            message: 'Pattern ready to be promoted to core skill',
            urgent: false
        }
    };

    return actions[state] || actions.learning;
}

// ============================================================================
// CONFIDENCE ADJUSTMENT
// ============================================================================

/**
 * Apply reinforcement signal to a pattern
 * @param {Object} pattern - Pattern object with confidence
 * @param {string} signalId - Signal ID from REINFORCEMENT_RULES
 * @param {Object} context - Additional context
 * @returns {Object} - Updated pattern with adjustment details
 */
export function applyReinforcement(pattern, signalId, context = {}) {
    const rule = Object.values(REINFORCEMENT_RULES).find(r => r.id === signalId);

    if (!rule || rule.id === 'THRESHOLDS') {
        return { pattern, applied: false, error: 'Unknown signal' };
    }

    const T = REINFORCEMENT_RULES.THRESHOLDS;
    const oldConfidence = pattern.confidence || 0.5;

    // Apply delta
    let newConfidence = oldConfidence + rule.delta;

    // Clamp to valid range
    newConfidence = Math.max(T.MIN_CONFIDENCE - 0.1, Math.min(newConfidence, T.MAX_CONFIDENCE));

    // Get old and new states
    const oldState = getReinforcementState(oldConfidence);
    const newState = getReinforcementState(newConfidence);
    const stateChanged = oldState !== newState;

    // Create reinforcement event
    const event = {
        patternId: pattern.id,
        signalId: rule.id,
        category: rule.category,
        reason: rule.reason,
        oldConfidence,
        newConfidence,
        delta: rule.delta,
        oldState,
        newState,
        stateChanged,
        context,
        timestamp: new Date().toISOString()
    };

    // Log reinforcement
    logReinforcement(event);

    // Record for metrics
    recordPatternEvent({
        type: rule.category === 'reward' ? 'true_positive' : 'false_positive',
        confidence: newConfidence,
        newPattern: false
    });

    // Update pattern
    pattern.confidence = newConfidence;
    pattern.lastReinforcement = event.timestamp;
    pattern.reinforcementHistory = pattern.reinforcementHistory || [];
    pattern.reinforcementHistory.push({
        signal: rule.id,
        delta: rule.delta,
        timestamp: event.timestamp
    });

    // Keep only last 20 reinforcement events
    if (pattern.reinforcementHistory.length > 20) {
        pattern.reinforcementHistory = pattern.reinforcementHistory.slice(-20);
    }

    return {
        pattern,
        applied: true,
        event,
        action: getStateAction(newState)
    };
}

/**
 * Batch apply rewards for successful task
 * @param {Object} pattern - Pattern object
 * @param {Object} taskOutcome - Task outcome details
 * @returns {Object} - Updated pattern
 */
export function rewardSuccess(pattern, taskOutcome) {
    let result = { pattern, applied: false };

    // Apply all applicable rewards
    if (taskOutcome.success && taskOutcome.skillApplied) {
        result = applyReinforcement(result.pattern, 'task_success_with_skill', taskOutcome);
    }

    if (taskOutcome.errorPrevented) {
        result = applyReinforcement(result.pattern, 'error_prevented', taskOutcome);
    }

    if (taskOutcome.fasterThanAverage) {
        result = applyReinforcement(result.pattern, 'time_saved', taskOutcome);
    }

    if (taskOutcome.firstAttempt && taskOutcome.success) {
        result = applyReinforcement(result.pattern, 'first_time_success', taskOutcome);
    }

    return result;
}

/**
 * Batch apply penalties for failed task
 * @param {Object} pattern - Pattern object
 * @param {Object} taskOutcome - Task outcome details
 * @returns {Object} - Updated pattern
 */
export function penalizeFailure(pattern, taskOutcome) {
    let result = { pattern, applied: false };

    if (!taskOutcome.success && taskOutcome.skillApplied) {
        result = applyReinforcement(result.pattern, 'task_failed_with_skill', taskOutcome);
    }

    if (taskOutcome.falsePositive) {
        result = applyReinforcement(result.pattern, 'false_positive', taskOutcome);
    }

    if (taskOutcome.skillIgnored) {
        result = applyReinforcement(result.pattern, 'skill_ignored', taskOutcome);
    }

    return result;
}

// ============================================================================
// PRUNING
// ============================================================================

/**
 * Check if pattern should be pruned
 * @param {Object} pattern - Pattern to check
 * @returns {Object} - Prune decision
 */
export function shouldPrune(pattern) {
    const state = getReinforcementState(pattern.confidence);

    if (state === 'prune') {
        return {
            shouldPrune: true,
            reason: `Confidence ${pattern.confidence.toFixed(3)} below threshold ${REINFORCEMENT_RULES.THRESHOLDS.MIN_CONFIDENCE}`,
            confidence: pattern.confidence
        };
    }

    // Check for stale patterns (no hits in 30 days)
    if (pattern.lastHit) {
        const lastHitDate = new Date(pattern.lastHit);
        const daysSinceHit = (Date.now() - lastHitDate.getTime()) / (1000 * 60 * 60 * 24);

        if (daysSinceHit > 30 && pattern.confidence < REINFORCEMENT_RULES.THRESHOLDS.STABLE) {
            return {
                shouldPrune: true,
                reason: `Pattern stale (${Math.floor(daysSinceHit)} days since last hit)`,
                confidence: pattern.confidence
            };
        }
    }

    return { shouldPrune: false };
}

/**
 * Prune low-confidence patterns from a collection
 * @param {Array} patterns - Array of patterns
 * @returns {Object} - { kept: Array, pruned: Array }
 */
export function prunePatterns(patterns) {
    const kept = [];
    const pruned = [];

    for (const pattern of patterns) {
        const decision = shouldPrune(pattern);

        if (decision.shouldPrune) {
            pruned.push({
                ...pattern,
                prunedAt: new Date().toISOString(),
                pruneReason: decision.reason
            });

            // Record for metrics
            recordSkillEvent({ type: 'pruned' });
        } else {
            kept.push(pattern);
        }
    }

    return { kept, pruned };
}

// ============================================================================
// PROMOTION
// ============================================================================

/**
 * Check if pattern should be promoted to skill
 * @param {Object} pattern - Pattern to check
 * @returns {Object} - Promotion decision
 */
export function shouldPromote(pattern) {
    const state = getReinforcementState(pattern.confidence);

    if (state !== 'promote') {
        return { shouldPromote: false, reason: `State is ${state}, not promote` };
    }

    // Require minimum evidence
    const evidenceCount = pattern.evidence?.length || pattern.hitCount || 0;
    if (evidenceCount < 5) {
        return {
            shouldPromote: false,
            reason: `Insufficient evidence (${evidenceCount}/5 required)`
        };
    }

    // Require consistent positive reinforcement
    const recentReinforcements = pattern.reinforcementHistory?.slice(-5) || [];
    const positiveCount = recentReinforcements.filter(r => r.delta > 0).length;

    if (positiveCount < 3) {
        return {
            shouldPromote: false,
            reason: `Insufficient positive reinforcement (${positiveCount}/3 required in last 5)`
        };
    }

    return {
        shouldPromote: true,
        reason: 'Pattern meets all promotion criteria',
        confidence: pattern.confidence,
        evidenceCount,
        positiveReinforcements: positiveCount
    };
}

// ============================================================================
// QUARANTINE & A/B TESTING
// ============================================================================

/**
 * Check if pattern should be quarantined for A/B testing
 * @param {Object} pattern - Pattern to check
 * @returns {Object} - Quarantine decision
 */
export function shouldQuarantine(pattern) {
    const state = getReinforcementState(pattern.confidence);

    if (state === 'quarantine') {
        return {
            shouldQuarantine: true,
            reason: `Confidence ${pattern.confidence.toFixed(3)} in quarantine zone`,
            suggestedTest: 'Compare against alternative pattern or baseline'
        };
    }

    return { shouldQuarantine: false };
}

/**
 * Queue pattern for A/B testing
 * @param {Object} pattern - Pattern to test
 * @param {Object} competitor - Alternative pattern (optional)
 * @returns {Object} - A/B test configuration
 */
export function queueForABTest(pattern, competitor = null) {
    const abTest = {
        id: `AB-${Date.now()}`,
        createdAt: new Date().toISOString(),
        status: 'pending',
        patternA: {
            id: pattern.id,
            confidence: pattern.confidence
        },
        patternB: competitor ? {
            id: competitor.id,
            confidence: competitor.confidence
        } : {
            id: 'baseline',
            confidence: null
        },
        allocation: 0.5, // 50% split
        metrics: {
            patternA: { applied: 0, success: 0 },
            patternB: { applied: 0, success: 0 }
        },
        minSamples: 10,
        maxDuration: 7 * 24 * 60 * 60 * 1000 // 7 days
    };

    // Save to A/B test queue
    saveABTest(abTest);

    return abTest;
}

// ============================================================================
// LOGGING
// ============================================================================

/**
 * Log reinforcement event
 * @param {Object} event - Reinforcement event
 */
function logReinforcement(event) {
    try {
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        let log = [];
        if (fs.existsSync(REINFORCEMENT_LOG)) {
            log = JSON.parse(fs.readFileSync(REINFORCEMENT_LOG, 'utf8'));
        }

        log.push(event);

        // Keep only last 1000 events
        if (log.length > 1000) {
            log = log.slice(-1000);
        }

        fs.writeFileSync(REINFORCEMENT_LOG, JSON.stringify(log, null, 2), 'utf8');
    } catch (error) {
        console.error('Error logging reinforcement:', error.message);
    }
}

/**
 * Get reinforcement statistics
 * @returns {Object} - Statistics
 */
export function getReinforcementStats() {
    try {
        if (!fs.existsSync(REINFORCEMENT_LOG)) {
            return { total: 0, rewards: 0, penalties: 0 };
        }

        const log = JSON.parse(fs.readFileSync(REINFORCEMENT_LOG, 'utf8'));

        const rewards = log.filter(e => e.category === 'reward').length;
        const penalties = log.filter(e => e.category === 'penalty').length;

        // Calculate average confidence change
        const deltas = log.map(e => e.delta);
        const avgDelta = deltas.reduce((a, b) => a + b, 0) / deltas.length;

        // State transitions
        const stateChanges = log.filter(e => e.stateChanged).length;

        return {
            total: log.length,
            rewards,
            penalties,
            rewardRatio: rewards / (rewards + penalties) || 0,
            avgDelta,
            stateChanges,
            lastEvent: log[log.length - 1]?.timestamp || null
        };
    } catch (error) {
        return { total: 0, rewards: 0, penalties: 0, error: error.message };
    }
}

// ============================================================================
// A/B TEST STORAGE
// ============================================================================

const AB_TESTS_FILE = path.join(KNOWLEDGE_DIR, 'ab-tests.json');

function saveABTest(test) {
    try {
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        let tests = [];
        if (fs.existsSync(AB_TESTS_FILE)) {
            tests = JSON.parse(fs.readFileSync(AB_TESTS_FILE, 'utf8'));
        }

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

export function loadABTests() {
    try {
        if (!fs.existsSync(AB_TESTS_FILE)) return [];
        return JSON.parse(fs.readFileSync(AB_TESTS_FILE, 'utf8'));
    } catch {
        return [];
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    REINFORCEMENT_RULES,
    getReinforcementState,
    getStateAction,
    applyReinforcement,
    rewardSuccess,
    penalizeFailure,
    shouldPrune,
    prunePatterns,
    shouldPromote,
    shouldQuarantine,
    queueForABTest,
    getReinforcementStats,
    loadABTests
};
