/**
 * Reinforcement Loop v7.0 - Reward/Penalty Tracking
 * 
 * Implements reinforcement learning loop for pattern confidence.
 * Tracks rewards (correct fixes) and penalties (wrong fixes).
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
const REINFORCEMENT_FILE = path.join(METRICS_DIR, 'reinforcement.json');

// ============================================================================
// DATA STRUCTURES
// ============================================================================

/**
 * Reinforcement data structure:
 * {
 *   rewards: number,
 *   penalties: number,
 *   history: [{
 *     timestamp: string,
 *     patternId: string,
 *     action: 'reward' | 'penalty',
 *     amount: number,
 *     reason: string,
 *     confidenceBefore: number,
 *     confidenceAfter: number
 *   }],
 *   lastUpdated: string
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
 * Load reinforcement data
 */
function loadReinforcementData() {
    if (fs.existsSync(REINFORCEMENT_FILE)) {
        try {
            return JSON.parse(fs.readFileSync(REINFORCEMENT_FILE, 'utf8'));
        } catch (e) {
            return getDefaultData();
        }
    }
    return getDefaultData();
}

/**
 * Save reinforcement data
 */
function saveReinforcementData(data) {
    ensureMetricsDir();
    data.lastUpdated = new Date().toISOString();
    fs.writeFileSync(REINFORCEMENT_FILE, JSON.stringify(data, null, 2));
}

/**
 * Get default data structure
 */
function getDefaultData() {
    return {
        rewards: 0,
        penalties: 0,
        history: [],
        patterns: {},  // patternId -> { rewards, penalties, confidence }
        lastUpdated: new Date().toISOString()
    };
}

// ============================================================================
// REINFORCEMENT OPERATIONS
// ============================================================================

/**
 * Apply reward to a pattern (correct fix)
 */
export function applyReward(patternId, amount = 1, reason = 'Correct fix applied') {
    const data = loadReinforcementData();

    // Update global rewards
    data.rewards = (data.rewards || 0) + amount;

    // Update pattern-specific data
    if (!data.patterns[patternId]) {
        data.patterns[patternId] = { rewards: 0, penalties: 0, confidence: 0.5 };
    }

    const pattern = data.patterns[patternId];
    const confidenceBefore = pattern.confidence;

    pattern.rewards += amount;

    // Increase confidence (max 1.0)
    pattern.confidence = Math.min(pattern.confidence + 0.05 * amount, 1.0);

    // Add to history
    data.history.push({
        timestamp: new Date().toISOString(),
        patternId,
        action: 'reward',
        amount,
        reason,
        confidenceBefore,
        confidenceAfter: pattern.confidence
    });

    // Keep history manageable (last 1000 entries)
    if (data.history.length > 1000) {
        data.history = data.history.slice(-1000);
    }

    saveReinforcementData(data);

    return {
        success: true,
        newConfidence: pattern.confidence,
        totalRewards: data.rewards
    };
}

/**
 * Apply penalty to a pattern (wrong fix)
 */
export function applyPenalty(patternId, amount = 1, reason = 'Fix did not work') {
    const data = loadReinforcementData();

    // Update global penalties
    data.penalties = (data.penalties || 0) + amount;

    // Update pattern-specific data
    if (!data.patterns[patternId]) {
        data.patterns[patternId] = { rewards: 0, penalties: 0, confidence: 0.5 };
    }

    const pattern = data.patterns[patternId];
    const confidenceBefore = pattern.confidence;

    pattern.penalties += amount;

    // Decrease confidence (min 0.1)
    pattern.confidence = Math.max(pattern.confidence - 0.1 * amount, 0.1);

    // Add to history
    data.history.push({
        timestamp: new Date().toISOString(),
        patternId,
        action: 'penalty',
        amount,
        reason,
        confidenceBefore,
        confidenceAfter: pattern.confidence
    });

    // Keep history manageable
    if (data.history.length > 1000) {
        data.history = data.history.slice(-1000);
    }

    saveReinforcementData(data);

    return {
        success: true,
        newConfidence: pattern.confidence,
        totalPenalties: data.penalties
    };
}

// ============================================================================
// STATS AND QUERIES
// ============================================================================

/**
 * Get reinforcement statistics
 */
export function getStats() {
    const data = loadReinforcementData();

    // Calculate average confidence
    const patternIds = Object.keys(data.patterns || {});
    let avgConfidence = 0;

    if (patternIds.length > 0) {
        const total = patternIds.reduce((sum, id) => sum + (data.patterns[id].confidence || 0.5), 0);
        avgConfidence = total / patternIds.length;
    }

    return {
        rewards: data.rewards || 0,
        penalties: data.penalties || 0,
        avgConfidence: Math.round(avgConfidence * 100),
        totalPatterns: patternIds.length,
        recentActions: (data.history || []).slice(-10)
    };
}

/**
 * Get reinforcement stats (alias)
 */
export function getReinforcementStats() {
    return getStats();
}

/**
 * Get pattern confidence
 */
export function getPatternConfidence(patternId) {
    const data = loadReinforcementData();
    return data.patterns?.[patternId]?.confidence ?? 0.5;
}

/**
 * Get all pattern confidences
 */
export function getAllPatternConfidences() {
    const data = loadReinforcementData();
    return data.patterns || {};
}

/**
 * Get history for a specific pattern
 */
export function getPatternHistory(patternId, limit = 20) {
    const data = loadReinforcementData();
    return (data.history || [])
        .filter(h => h.patternId === patternId)
        .slice(-limit);
}

/**
 * Get recent history
 */
export function getRecentHistory(limit = 50) {
    const data = loadReinforcementData();
    return (data.history || []).slice(-limit);
}

/**
 * Reset pattern confidence (for testing)
 */
export function resetPattern(patternId) {
    const data = loadReinforcementData();

    if (data.patterns?.[patternId]) {
        data.patterns[patternId] = { rewards: 0, penalties: 0, confidence: 0.5 };
        saveReinforcementData(data);
    }

    return { success: true };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    applyReward,
    applyPenalty,
    getStats,
    getReinforcementStats,
    getPatternConfidence,
    getAllPatternConfidences,
    getPatternHistory,
    getRecentHistory,
    resetPattern
};
