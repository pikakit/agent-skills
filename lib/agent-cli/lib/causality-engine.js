/**
 * AutoLearn v6.0 - Causality Engine
 * 
 * Analyzes WHY something succeeded or failed, not just WHAT happened.
 * Uses semantic diff and impact scoring to extract causal patterns.
 * 
 * Key concepts:
 * - Root Cause Analysis: What caused the outcome?
 * - Semantic Diff: What actually changed (not just line diff)?
 * - Impact Scoring: How significant was this change?
 * - Causal Pattern: IF [context] AND [action] THEN [outcome] BECAUSE [cause]
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { recordPatternEvent } from './metrics-collector.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const CAUSAL_PATTERNS_FILE = path.join(KNOWLEDGE_DIR, 'causal-patterns.json');

// Impact thresholds
const IMPACT_THRESHOLDS = {
    LOW: 0.3,
    MEDIUM: 0.6,
    HIGH: 0.8,
    CRITICAL: 0.95
};

// ============================================================================
// CAUSAL PATTERN DATA STRUCTURE
// ============================================================================

/**
 * @typedef {Object} CausalPattern
 * @property {string} id - Unique pattern ID
 * @property {string} pattern - Regex pattern to detect
 * @property {Object} context - When this pattern applies
 * @property {string} cause - Root cause explanation
 * @property {string} effect - What happens if violated
 * @property {number} confidence - 0.0 to 1.0
 * @property {Array} evidence - Task IDs that support this pattern
 * @property {string} firstDetected - ISO date
 * @property {string} lastUpdated - ISO date
 * @property {Object} fix - How to fix if detected
 */

// ============================================================================
// ROOT CAUSE ANALYZER
// ============================================================================

/**
 * Known error patterns for root cause matching
 */
const ROOT_CAUSE_PATTERNS = {
    // ESC key issues
    'esc_key_conflict': {
        triggers: ['ESC', 'escape', 'key handling', 'Clack', 'customSelect'],
        cause: 'Keyboard event handler conflict',
        category: 'ui'
    },

    // Import issues
    'missing_import': {
        triggers: ['is not defined', 'cannot find', 'ReferenceError', 'import'],
        cause: 'Missing or incorrect import statement',
        category: 'dependency'
    },

    // Type issues
    'type_mismatch': {
        triggers: ['TypeError', 'undefined is not', 'null is not', 'cannot read property'],
        cause: 'Type mismatch or null/undefined access',
        category: 'type_safety'
    },

    // Async issues
    'async_timing': {
        triggers: ['Promise', 'async', 'await', 'timeout', 'race condition'],
        cause: 'Asynchronous timing or race condition',
        category: 'async'
    },

    // State issues
    'state_corruption': {
        triggers: ['state', 'setState', 'useState', 'undefined state', 'stale'],
        cause: 'State management issue or stale state',
        category: 'state'
    },

    // File system
    'file_not_found': {
        triggers: ['ENOENT', 'no such file', 'file not found', 'cannot find module'],
        cause: 'File or module not found',
        category: 'filesystem'
    },

    // Permission
    'permission_denied': {
        triggers: ['EACCES', 'permission denied', 'access denied', 'unauthorized'],
        cause: 'Insufficient permissions',
        category: 'security'
    },

    // Syntax
    'syntax_error': {
        triggers: ['SyntaxError', 'Unexpected token', 'parsing error'],
        cause: 'Invalid syntax',
        category: 'syntax'
    }
};

/**
 * Analyze error message to find root cause
 * @param {string} errorMessage - Error message or context
 * @param {Object} context - Additional context
 * @returns {Object} - Root cause analysis
 */
export function analyzeRootCause(errorMessage, context = {}) {
    const message = errorMessage.toLowerCase();
    const results = [];

    // Check against known patterns
    for (const [causeId, pattern] of Object.entries(ROOT_CAUSE_PATTERNS)) {
        const matchCount = pattern.triggers.filter(t =>
            message.includes(t.toLowerCase())
        ).length;

        if (matchCount > 0) {
            const confidence = Math.min(0.5 + (matchCount * 0.15), 0.95);
            results.push({
                causeId,
                cause: pattern.cause,
                category: pattern.category,
                confidence,
                matchedTriggers: matchCount
            });
        }
    }

    // Sort by confidence
    results.sort((a, b) => b.confidence - a.confidence);

    return {
        primaryCause: results[0] || { causeId: 'unknown', cause: 'Unknown root cause', confidence: 0.3 },
        allCauses: results,
        context,
        analyzedAt: new Date().toISOString()
    };
}

// ============================================================================
// SEMANTIC DIFF ANALYZER
// ============================================================================

/**
 * Semantic diff types
 */
const DIFF_TYPES = {
    ADD_IMPORT: 'add_import',
    REMOVE_IMPORT: 'remove_import',
    CHANGE_FUNCTION: 'change_function',
    ADD_ERROR_HANDLING: 'add_error_handling',
    FIX_TYPE: 'fix_type',
    REPLACE_API: 'replace_api',
    ADD_VALIDATION: 'add_validation',
    REFACTOR: 'refactor',
    OTHER: 'other'
};

/**
 * Analyze what semantically changed between two versions
 * @param {string} before - Content before change
 * @param {string} after - Content after change
 * @param {Object} context - File context
 * @returns {Object} - Semantic diff analysis
 */
export function analyzeSemanticDiff(before, after, context = {}) {
    const changes = [];
    const beforeLines = before.split('\n');
    const afterLines = after.split('\n');

    // Detect import changes
    const beforeImports = extractImports(before);
    const afterImports = extractImports(after);

    const addedImports = afterImports.filter(i => !beforeImports.includes(i));
    const removedImports = beforeImports.filter(i => !afterImports.includes(i));

    if (addedImports.length > 0) {
        changes.push({
            type: DIFF_TYPES.ADD_IMPORT,
            details: addedImports,
            impact: calculateImpact(DIFF_TYPES.ADD_IMPORT, addedImports.length)
        });
    }

    if (removedImports.length > 0) {
        changes.push({
            type: DIFF_TYPES.REMOVE_IMPORT,
            details: removedImports,
            impact: calculateImpact(DIFF_TYPES.REMOVE_IMPORT, removedImports.length)
        });
    }

    // Detect error handling added
    const beforeTryCatch = (before.match(/try\s*\{/g) || []).length;
    const afterTryCatch = (after.match(/try\s*\{/g) || []).length;

    if (afterTryCatch > beforeTryCatch) {
        changes.push({
            type: DIFF_TYPES.ADD_ERROR_HANDLING,
            details: { added: afterTryCatch - beforeTryCatch },
            impact: calculateImpact(DIFF_TYPES.ADD_ERROR_HANDLING, 1)
        });
    }

    // Detect API replacements (e.g., customSelect → p.select)
    const apiReplacements = detectAPIReplacements(before, after);
    if (apiReplacements.length > 0) {
        changes.push({
            type: DIFF_TYPES.REPLACE_API,
            details: apiReplacements,
            impact: calculateImpact(DIFF_TYPES.REPLACE_API, apiReplacements.length)
        });
    }

    // Detect type annotations added
    const beforeTypes = (before.match(/:\s*\w+(\[\])?(\s*\||\s*=|\s*[,;)])/g) || []).length;
    const afterTypes = (after.match(/:\s*\w+(\[\])?(\s*\||\s*=|\s*[,;)])/g) || []).length;

    if (afterTypes > beforeTypes) {
        changes.push({
            type: DIFF_TYPES.FIX_TYPE,
            details: { added: afterTypes - beforeTypes },
            impact: calculateImpact(DIFF_TYPES.FIX_TYPE, afterTypes - beforeTypes)
        });
    }

    // Calculate overall significance
    const totalImpact = changes.reduce((sum, c) => sum + c.impact, 0) / Math.max(changes.length, 1);

    return {
        changes,
        totalChanges: changes.length,
        overallImpact: Math.min(totalImpact, 1.0),
        linesDiff: Math.abs(afterLines.length - beforeLines.length),
        context,
        analyzedAt: new Date().toISOString()
    };
}

/**
 * Extract import statements from code
 * @param {string} code - Source code
 * @returns {Array<string>} - Import statements
 */
function extractImports(code) {
    const imports = [];

    // ES6 imports
    const es6Matches = code.match(/import\s+.*?\s+from\s+['"]([^'"]+)['"]/g) || [];
    imports.push(...es6Matches);

    // CommonJS requires
    const cjsMatches = code.match(/require\s*\(['"]([^'"]+)['"]\)/g) || [];
    imports.push(...cjsMatches);

    return imports;
}

/**
 * Detect API replacements between versions
 * @param {string} before - Code before
 * @param {string} after - Code after
 * @returns {Array} - Detected replacements
 */
function detectAPIReplacements(before, after) {
    const replacements = [];

    // Known replacements to check
    const knownReplacements = [
        { old: 'customSelect', new: 'p.select' },
        { old: 'console.log', new: 'logger.debug' },
        { old: 'var ', new: 'const ' },
        { old: 'let ', new: 'const ' },
        { old: 'function ', new: '=>' },
        { old: '.then(', new: 'await ' }
    ];

    for (const rep of knownReplacements) {
        const oldCount = (before.match(new RegExp(escapeRegex(rep.old), 'g')) || []).length;
        const newCount = (after.match(new RegExp(escapeRegex(rep.old), 'g')) || []).length;
        const newApiCount = (after.match(new RegExp(escapeRegex(rep.new), 'g')) || []).length;

        if (oldCount > newCount && newApiCount > 0) {
            replacements.push({
                from: rep.old,
                to: rep.new,
                count: oldCount - newCount
            });
        }
    }

    return replacements;
}

/**
 * Escape regex special characters
 */
function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// ============================================================================
// IMPACT SCORER
// ============================================================================

/**
 * Calculate impact score for a change type
 * @param {string} changeType - Type of change
 * @param {number} count - Number of occurrences
 * @returns {number} - Impact score 0.0 to 1.0
 */
function calculateImpact(changeType, count) {
    const baseImpacts = {
        [DIFF_TYPES.ADD_IMPORT]: 0.2,
        [DIFF_TYPES.REMOVE_IMPORT]: 0.3,
        [DIFF_TYPES.CHANGE_FUNCTION]: 0.5,
        [DIFF_TYPES.ADD_ERROR_HANDLING]: 0.6,
        [DIFF_TYPES.FIX_TYPE]: 0.4,
        [DIFF_TYPES.REPLACE_API]: 0.7,
        [DIFF_TYPES.ADD_VALIDATION]: 0.5,
        [DIFF_TYPES.REFACTOR]: 0.4,
        [DIFF_TYPES.OTHER]: 0.2
    };

    const base = baseImpacts[changeType] || 0.2;
    const multiplier = Math.log10(count + 1) + 1; // Logarithmic scaling

    return Math.min(base * multiplier, 1.0);
}

/**
 * Score overall impact of a task outcome
 * @param {Object} outcome - Task outcome details
 * @returns {Object} - Impact score with breakdown
 */
export function scoreImpact(outcome) {
    let score = 0;
    const factors = [];

    // Factor 1: Task success/failure
    if (outcome.success) {
        score += 0.3;
        factors.push({ factor: 'task_success', contribution: 0.3 });
    } else {
        score += 0.1;
        factors.push({ factor: 'task_failure', contribution: 0.1 });
    }

    // Factor 2: First-time success
    if (outcome.firstAttempt && outcome.success) {
        score += 0.2;
        factors.push({ factor: 'first_time_success', contribution: 0.2 });
    }

    // Factor 3: Skill involvement
    if (outcome.skillApplied) {
        const skillImpact = outcome.skillHelped ? 0.3 : -0.1;
        score += skillImpact;
        factors.push({ factor: 'skill_effectiveness', contribution: skillImpact });
    }

    // Factor 4: Error prevention
    if (outcome.errorPrevented) {
        score += 0.3;
        factors.push({ factor: 'error_prevented', contribution: 0.3 });
    }

    // Factor 5: Time efficiency
    if (outcome.fasterThanAverage) {
        score += 0.1;
        factors.push({ factor: 'time_efficiency', contribution: 0.1 });
    }

    // Normalize to 0-1
    score = Math.max(0, Math.min(score, 1.0));

    // Classify impact level
    let level;
    if (score >= IMPACT_THRESHOLDS.CRITICAL) level = 'critical';
    else if (score >= IMPACT_THRESHOLDS.HIGH) level = 'high';
    else if (score >= IMPACT_THRESHOLDS.MEDIUM) level = 'medium';
    else level = 'low';

    return {
        score,
        level,
        factors,
        analyzedAt: new Date().toISOString()
    };
}

// ============================================================================
// CAUSAL PATTERN EXTRACTION
// ============================================================================

/**
 * Extract a causal pattern from task outcome
 * @param {Object} taskData - Full task data with context, actions, outcome
 * @returns {CausalPattern|null} - Extracted pattern or null
 */
export function extractCausalPattern(taskData) {
    const { context, actions, outcome, error } = taskData;

    // Analyze root cause if failed
    let rootCause = null;
    if (!outcome.success && error) {
        rootCause = analyzeRootCause(error, context);
    }

    // Analyze what changed if we have before/after
    let semanticDiff = null;
    if (taskData.before && taskData.after) {
        semanticDiff = analyzeSemanticDiff(taskData.before, taskData.after, context);
    }

    // Score impact
    const impact = scoreImpact(outcome);

    // Only create pattern if significant enough
    if (impact.score < IMPACT_THRESHOLDS.MEDIUM) {
        return null;
    }

    // Generate pattern
    const pattern = {
        id: `CP-${Date.now()}`,

        // What to detect
        pattern: rootCause?.primaryCause?.causeId || semanticDiff?.changes?.[0]?.type || 'unknown',

        // When this applies
        context: {
            fileTypes: context.fileTypes || [],
            framework: context.framework || null,
            domain: context.domain || null
        },

        // Root cause (WHY)
        cause: rootCause?.primaryCause?.cause || 'Pattern derived from successful task',
        effect: rootCause ? 'Task failure' : 'Task success',

        // Confidence
        confidence: calculatePatternConfidence(rootCause, semanticDiff, impact),

        // Evidence
        evidence: [{
            taskId: taskData.taskId,
            outcome: outcome.success ? 'success' : 'failure',
            timestamp: new Date().toISOString()
        }],

        // Dates
        firstDetected: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),

        // Fix (if we know what fixed it)
        fix: semanticDiff?.changes?.[0]
            ? { type: semanticDiff.changes[0].type, details: semanticDiff.changes[0].details }
            : null,

        // Analytics
        impact: impact.score,
        impactLevel: impact.level
    };

    // Record pattern event for metrics
    recordPatternEvent({
        type: outcome.success ? 'true_positive' : 'false_negative',
        confidence: pattern.confidence,
        newPattern: true
    });

    return pattern;
}

/**
 * Calculate confidence for a causal pattern
 */
function calculatePatternConfidence(rootCause, semanticDiff, impact) {
    let confidence = 0.5; // Base

    // Root cause adds confidence
    if (rootCause?.primaryCause?.confidence) {
        confidence += rootCause.primaryCause.confidence * 0.3;
    }

    // Clear semantic diff adds confidence
    if (semanticDiff?.changes?.length > 0) {
        confidence += 0.2;
    }

    // High impact adds confidence
    confidence += impact.score * 0.2;

    return Math.min(confidence, 0.95);
}

// ============================================================================
// CAUSAL PATTERNS STORAGE
// ============================================================================

/**
 * Load causal patterns from disk
 * @returns {Array<CausalPattern>} - Array of causal patterns
 */
export function loadCausalPatterns() {
    try {
        if (!fs.existsSync(CAUSAL_PATTERNS_FILE)) {
            return [];
        }

        const content = fs.readFileSync(CAUSAL_PATTERNS_FILE, 'utf8');
        const data = JSON.parse(content);
        return data.patterns || [];
    } catch (error) {
        console.error('Error loading causal patterns:', error.message);
        return [];
    }
}

/**
 * Save causal pattern to disk
 * @param {CausalPattern} pattern - Pattern to save
 */
export function saveCausalPattern(pattern) {
    try {
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        const patterns = loadCausalPatterns();

        // Check for duplicate
        const existingIndex = patterns.findIndex(p => p.id === pattern.id);
        if (existingIndex >= 0) {
            patterns[existingIndex] = pattern;
        } else {
            patterns.push(pattern);
        }

        const data = {
            version: '6.0.0',
            updatedAt: new Date().toISOString(),
            patterns
        };

        fs.writeFileSync(CAUSAL_PATTERNS_FILE, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.error('Error saving causal pattern:', error.message);
    }
}

/**
 * Update confidence of existing pattern based on new evidence
 * @param {string} patternId - Pattern ID
 * @param {Object} evidence - New evidence
 * @param {boolean} positive - Whether evidence supports pattern
 */
export function reinforcePattern(patternId, evidence, positive) {
    const patterns = loadCausalPatterns();
    const pattern = patterns.find(p => p.id === patternId);

    if (!pattern) return null;

    // Add evidence
    pattern.evidence.push({
        ...evidence,
        positive,
        timestamp: new Date().toISOString()
    });

    // Adjust confidence
    const delta = positive ? 0.05 : -0.1;
    pattern.confidence = Math.max(0.1, Math.min(pattern.confidence + delta, 0.99));
    pattern.lastUpdated = new Date().toISOString();

    // Save
    saveCausalPattern(pattern);

    // Record for metrics
    recordPatternEvent({
        type: positive ? 'true_positive' : 'false_positive',
        confidence: pattern.confidence,
        newPattern: false
    });

    return pattern;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    analyzeRootCause,
    analyzeSemanticDiff,
    scoreImpact,
    extractCausalPattern,
    loadCausalPatterns,
    saveCausalPattern,
    reinforcePattern,
    DIFF_TYPES,
    IMPACT_THRESHOLDS
};
