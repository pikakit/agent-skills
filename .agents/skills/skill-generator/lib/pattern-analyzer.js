/**
 * Pattern Analyzer v2.0 - Context-Aware Pattern Analysis
 * 
 * Analyzes patterns with context preservation and anti-pattern detection.
 * Only generates skills from high-quality, success-path patterns.
 * 
 * @version 2.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONSTANTS
// ============================================================================

const MIN_OCCURRENCES = 3;  // Minimum times pattern must appear
const MIN_SUCCESS_RATE = 0.7; // 70% success rate required

// ============================================================================
// FIND PROJECT ROOT
// ============================================================================

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
const PATTERNS_FILE = path.join(projectRoot, '.agent', 'knowledge', 'patterns.json');
const LESSONS_FILE = path.join(projectRoot, '.agent', 'knowledge', 'lessons-learned.yaml');

// ============================================================================
// PATTERN CONTEXT
// ============================================================================

/**
 * Create a pattern with full context
 * @param {Object} options - Pattern options
 * @returns {Object} Pattern with context
 */
export function createPattern(options) {
    return {
        id: `PATTERN-${Date.now()}`,
        pattern: options.pattern,
        message: options.message,

        // Context preservation (FAANG requirement)
        context: {
            workflow: options.workflow || 'unknown',
            step: options.step || 'unknown',
            trigger: options.trigger || 'manual',
            outcome: options.outcome || 'unknown' // 'success' | 'failure'
        },

        // Tracking
        occurrences: 1,
        successCount: options.outcome === 'success' ? 1 : 0,
        failureCount: options.outcome === 'failure' ? 1 : 0,

        // Metadata
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        source: options.source || 'detection'
    };
}

// ============================================================================
// PATTERN STORAGE
// ============================================================================

/**
 * Load patterns from storage
 * @returns {Object} Patterns database
 */
export function loadPatterns() {
    try {
        if (fs.existsSync(PATTERNS_FILE)) {
            return JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading patterns:', err.message);
    }

    return { patterns: [], lastUpdated: null };
}

/**
 * Save patterns to storage
 * @param {Object} db - Patterns database
 */
export function savePatterns(db) {
    const dir = path.dirname(PATTERNS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    db.lastUpdated = new Date().toISOString();
    fs.writeFileSync(PATTERNS_FILE, JSON.stringify(db, null, 2));
}

/**
 * Add or update a pattern
 * @param {Object} pattern - Pattern to add
 * @returns {Object} Updated pattern
 */
export function addPattern(pattern) {
    const db = loadPatterns();

    // Check for existing similar pattern
    const existing = db.patterns.find(p =>
        p.pattern === pattern.pattern &&
        p.context?.workflow === pattern.context?.workflow
    );

    if (existing) {
        existing.occurrences++;
        if (pattern.context?.outcome === 'success') existing.successCount++;
        if (pattern.context?.outcome === 'failure') existing.failureCount++;
        existing.updatedAt = new Date().toISOString();
        savePatterns(db);
        return existing;
    }

    db.patterns.push(pattern);
    savePatterns(db);
    return pattern;
}

// ============================================================================
// ANTI-PATTERN DETECTION
// ============================================================================

/**
 * Check if pattern is an anti-pattern (should be rejected)
 * @param {Object} pattern - Pattern to check
 * @returns {Object} Check result
 */
export function isAntiPattern(pattern) {
    const reasons = [];

    // Rule 1: Must have minimum occurrences
    if (pattern.occurrences < MIN_OCCURRENCES) {
        reasons.push(`Insufficient occurrences: ${pattern.occurrences}/${MIN_OCCURRENCES}`);
    }

    // Rule 2: Must have success-path occurrences
    const successRate = pattern.successCount / pattern.occurrences;
    if (successRate < MIN_SUCCESS_RATE) {
        reasons.push(`Low success rate: ${(successRate * 100).toFixed(0)}% (min ${MIN_SUCCESS_RATE * 100}%)`);
    }

    // Rule 3: Check if only from hotfix/correction
    if (pattern.source === 'user_correction' && pattern.occurrences < 5) {
        reasons.push('Pattern only from user corrections (may be hotfix)');
    }

    // Rule 4: Failure-path only patterns
    if (pattern.successCount === 0 && pattern.failureCount > 0) {
        reasons.push('Pattern only appears in failure path');
    }

    return {
        isAntiPattern: reasons.length > 0,
        reasons
    };
}

// ============================================================================
// PATTERN ANALYSIS
// ============================================================================

/**
 * Analyze patterns and return skill candidates
 * @param {Object} options - Analysis options
 * @returns {Object} Analysis result
 */
export function analyzePatterns(options = {}) {
    const db = loadPatterns();
    const candidates = [];
    const rejected = [];

    for (const pattern of db.patterns) {
        const antiCheck = isAntiPattern(pattern);

        if (antiCheck.isAntiPattern) {
            rejected.push({
                pattern: pattern.pattern,
                reasons: antiCheck.reasons
            });
        } else {
            // Calculate confidence
            const successRate = pattern.successCount / pattern.occurrences;
            const confidence = Math.min(
                (pattern.occurrences / 10) * 0.3 +  // Frequency weight
                successRate * 0.5 +                  // Success rate weight
                (pattern.context.workflow !== 'unknown' ? 0.2 : 0) // Context bonus
                , 1);

            candidates.push({
                ...pattern,
                confidence: Math.round(confidence * 100)
            });
        }
    }

    // Sort by confidence
    candidates.sort((a, b) => b.confidence - a.confidence);

    return {
        candidates,
        rejected,
        stats: {
            total: db.patterns.length,
            candidates: candidates.length,
            rejected: rejected.length,
            avgConfidence: candidates.length ?
                Math.round(candidates.reduce((sum, c) => sum + c.confidence, 0) / candidates.length) : 0
        }
    };
}

/**
 * Get high-confidence patterns ready for skill generation
 * @param {number} minConfidence - Minimum confidence (0-100)
 * @returns {Array} Ready patterns
 */
export function getReadyPatterns(minConfidence = 70) {
    const { candidates } = analyzePatterns();
    return candidates.filter(c => c.confidence >= minConfidence);
}

/**
 * Get pattern statistics
 * @returns {Object} Statistics
 */
export function getPatternStats() {
    const db = loadPatterns();
    const analysis = analyzePatterns();

    return {
        totalPatterns: db.patterns.length,
        readyForSkill: analysis.candidates.filter(c => c.confidence >= 70).length,
        avgConfidence: analysis.stats.avgConfidence,
        rejectedCount: analysis.rejected.length,
        byWorkflow: db.patterns.reduce((acc, p) => {
            const wf = p.context?.workflow || 'unknown';
            acc[wf] = (acc[wf] || 0) + 1;
            return acc;
        }, {}),
        lastUpdated: db.lastUpdated
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createPattern,
    loadPatterns,
    savePatterns,
    addPattern,
    isAntiPattern,
    analyzePatterns,
    getReadyPatterns,
    getPatternStats,
    MIN_OCCURRENCES,
    MIN_SUCCESS_RATE
};
