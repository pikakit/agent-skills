/**
 * Cognitive Lesson Engine - Intelligence Layers
 * 
 * This module implements the cognitive intelligence that transforms
 * raw data (mistakes.yaml + improvements.yaml) into Cognitive Lesson Units
 * 
 * Levels:
 * 1. Intent Inference - detect purpose
 * 2. Pattern Intelligence - context matching
 * 3. Maturity Calculation - confidence & state
 * 4. Evolution Analysis - gap detection
 * 5. Feedback Loop - self-evolution
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../../..');
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, '.agent/knowledge');

// ============================================================================
// LEVEL 0: Data Loading
// ============================================================================

/**
 * Load mistakes from YAML
 */
export function loadMistakes() {
    const filepath = path.join(KNOWLEDGE_DIR, 'mistakes.yaml');
    if (!fs.existsSync(filepath)) {
        return { version: 4.0, mistakes: [] };
    }
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        return yaml.load(content) || { version: 4.0, mistakes: [] };
    } catch (error) {
        console.error('Error loading mistakes:', error.message);
        return { version: 4.0, mistakes: [] };
    }
}

/**
 * Load improvements from YAML
 */
export function loadImprovements() {
    const filepath = path.join(KNOWLEDGE_DIR, 'improvements.yaml');
    if (!fs.existsSync(filepath)) {
        return { version: 4.0, improvements: [] };
    }
    try {
        const content = fs.readFileSync(filepath, 'utf8');
        return yaml.load(content) || { version: 4.0, improvements: [] };
    } catch (error) {
        console.error('Error loading improvements:', error.message);
        return { version: 4.0, improvements: [] };
    }
}

// ============================================================================
// LEVEL 1: Intent Inference
// ============================================================================

/**
 * Intent vocabulary - maps tag patterns to intents
 */
const INTENT_PATTERNS = {
    'safe-rebranding': {
        keywords: ['rebrand', 'rename', 'file-safety'],
        goal: 'Rename files/entities without data loss or breaking changes',
        category: 'file-operations',
    },
    'cli-ux-consistency': {
        keywords: ['cli', 'ux', 'menu', 'navigation', 'clack'],
        goal: 'Provide consistent, intuitive CLI user experience',
        category: 'user-experience',
    },
    'error-prevention': {
        keywords: ['validation', 'error', 'check', 'verify'],
        goal: 'Prevent runtime errors through proactive validation',
        category: 'reliability',
    },
    'code-quality': {
        keywords: ['import', 'architecture', 'quality'],
        goal: 'Maintain clean, maintainable code structure',
        category: 'maintainability',
    },
};

/**
 * Infer lesson intent from tags
 * NO NEW FILE - computed runtime
 */
export function inferIntent(tags) {
    if (!tags || tags.length === 0) {
        return {
            id: 'unknown',
            goal: 'General code quality improvement',
            strength: 0.3,
            category: 'general',
        };
    }

    let bestMatch = null;
    let bestScore = 0;

    for (const [intentId, pattern] of Object.entries(INTENT_PATTERNS)) {
        const matchCount = tags.filter(tag =>
            pattern.keywords.some(kw => tag.toLowerCase().includes(kw.toLowerCase()))
        ).length;

        const score = matchCount / tags.length; // 0-1 confidence

        if (score > bestScore) {
            bestScore = score;
            bestMatch = {
                id: intentId,
                goal: pattern.goal,
                strength: score,
                category: pattern.category,
            };
        }
    }

    return bestMatch || {
        id: 'unknown',
        goal: 'General code quality improvement',
        strength: 0.3,
        category: 'general',
    };
}

// ============================================================================
// LEVEL 2: Pattern Intelligence
// ============================================================================

/**
 * Build execution context from code
 * Used for contextual pattern matching
 */
export function buildContext(filePath, code) {
    const context = {
        framework: null,
        intents: [],
        environment: 'development',
        fileType: path.extname(filePath),
    };

    // Detect framework from imports
    if (code.includes('@clack/prompts')) context.framework = 'clack';
    if (code.includes('inquirer')) context.framework = 'inquirer';
    if (code.includes('react')) context.framework = 'react';

    // Detect intent from code patterns
    if (code.includes('p.select') || code.includes('showActionMenu')) {
        context.intents.push('select-menu');
    }
    if (code.includes('rename') || code.includes('move')) {
        context.intents.push('file-operation');
    }
    if (code.includes('import')) {
        context.intents.push('module-usage');
    }

    return context;
}

/**
 * Contextual pattern matching
 * Smarter than text-only regex
 */
export function matchPattern(code, mistake, context) {
    // Basic pattern match
    const regex = new RegExp(mistake.pattern);
    const patternMatch = regex.test(code);

    if (!patternMatch) return false;

    // Context filtering - skip if not applicable
    if (mistake.when) {
        // Check framework requirement
        if (mistake.when.framework && context.framework !== mistake.when.framework) {
            return false; // Wrong framework, not applicable
        }

        // Check intent requirement
        if (mistake.when.intent && !context.intents.includes(mistake.when.intent)) {
            return false; // Intent mismatch
        }
    }

    return true; // Pattern + context match
}

// ============================================================================
// LEVEL 3: Maturity Calculation
// ============================================================================

/**
 * Calculate evidence score based on hit counts
 */
function calculateEvidenceScore(mistakes, improvements) {
    const totalMistakeHits = mistakes.reduce((sum, m) => sum + (m.hitCount || 0), 0);
    const totalImprovementHits = improvements.reduce((sum, i) => sum + (i.appliedCount || 0), 0);

    const totalHits = totalMistakeHits + totalImprovementHits;

    if (totalHits === 0) return 0.1; // No evidence
    if (totalHits < 5) return 0.3;   // Weak
    if (totalHits < 20) return 0.6;  // Moderate
    return 0.9;                       // Strong
}

/**
 * Calculate recency score
 */
function calculateRecencyScore(mistakes, improvements) {
    const now = Date.now();

    const allDates = [
        ...mistakes.map(m => new Date(m.lastHit || m.added).getTime()),
        ...improvements.map(i => new Date(i.lastApplied || i.added).getTime()),
    ];

    if (allDates.length === 0) return 0.5;

    const lastUpdate = Math.max(...allDates);
    const daysSinceUpdate = (now - lastUpdate) / (1000 * 60 * 60 * 24);

    if (daysSinceUpdate < 7) return 1.0;    // This week
    if (daysSinceUpdate < 30) return 0.8;   // This month
    if (daysSinceUpdate < 90) return 0.5;   // This quarter
    return 0.3;                              // Stale
}

/**
 * Get recommendation based on state and confidence
 */
function getRecommendation(state, confidence) {
    if (state === 'RAW') {
        return 'URGENT: Discover best practices for this area';
    }
    if (state === 'LEARNING' && confidence < 0.5) {
        return 'Needs more improvements to balance anti-patterns';
    }
    if (state === 'MATURE' && confidence > 0.8) {
        return 'Stable - can be trusted for skill injection';
    }
    if (state === 'IDEAL') {
        return 'Perfect - all best practices, no anti-patterns';
    }
    return 'Continue learning';
}

/**
 * Calculate lesson maturity metrics
 */
export function calculateMaturity(mistakes, improvements) {
    const m = mistakes.length;
    const i = improvements.length;

    // State determination
    let state;
    if (i === 0 && m > 0) state = 'RAW';          // 🟥 Only mistakes
    else if (i > 0 && m === 0) state = 'IDEAL';   // 🟦 Only improvements (rare)
    else if (i >= m) state = 'MATURE';            // 🟩 Balanced or improvement-heavy
    else state = 'LEARNING';                       // 🟨 More mistakes than solutions

    // Multi-factor confidence
    const balanceScore = i / (m + i);                                // 0-1: improvement ratio
    const evidenceScore = calculateEvidenceScore(mistakes, improvements); // 0-1: hit validation
    const recencyScore = calculateRecencyScore(mistakes, improvements);   // 0-1: freshness

    const confidence = (
        balanceScore * 0.5 +      // Balance is most important
        evidenceScore * 0.3 +      // Evidence validates
        recencyScore * 0.2         // Fresh is better
    );

    return {
        state,
        confidence: Math.round(confidence * 100) / 100,
        indicators: {
            balance: Math.round(balanceScore * 100) / 100,
            evidence: Math.round(evidenceScore * 100) / 100,
            recency: Math.round(recencyScore * 100) / 100,
        },
        coverage: `${m} mistakes / ${i} improvements`,
        recommendation: getRecommendation(state, confidence),
    };
}

// ============================================================================
// LEVEL 4: Evolution Analysis
// ============================================================================

/**
 * Check if mistake has related improvement
 */
function hasRelatedImprovement(mistake, improvements) {
    return improvements.some(i =>
        i.tags && mistake.tags && i.tags.some(tag => mistake.tags.includes(tag))
    );
}

/**
 * Determine next action from signals
 */
function determineNextAction(signals) {
    if (signals.some(s => s.priority === 'CRITICAL')) {
        return 'Document solution for high-frequency violations immediately';
    }
    if (signals.some(s => s.type === 'SUGGEST_IMPROVEMENT_DISCOVERY')) {
        return 'Research and document best practices in underserved areas';
    }
    return 'Continue normal learning';
}

/**
 * Analyze evolution needs and gaps
 */
export function analyzeEvolution(mistakes, improvements, intent) {
    const signals = [];
    const missingAreas = [];

    // Signal 1: Many mistakes, few solutions
    if (mistakes.length > improvements.length * 2) {
        signals.push({
            type: 'SUGGEST_IMPROVEMENT_DISCOVERY',
            priority: 'HIGH',
            reason: `${mistakes.length} anti-patterns but only ${improvements.length} solution(s)`,
        });
    }

    // Signal 2: Uncovered tags
    const mistakeTags = new Set(mistakes.flatMap(m => m.tags || []));
    const improvementTags = new Set(improvements.flatMap(i => i.tags || []));

    const uncoveredTags = [...mistakeTags].filter(tag => !improvementTags.has(tag));

    uncoveredTags.forEach(tag => {
        missingAreas.push({
            area: tag,
            reason: 'Anti-patterns detected but no best practice documented',
            mistakeCount: mistakes.filter(m => m.tags && m.tags.includes(tag)).length,
        });
    });

    // Signal 3: High-hit mistakes without solution
    mistakes.forEach(m => {
        if ((m.hitCount || 0) > 10 && !hasRelatedImprovement(m, improvements)) {
            signals.push({
                type: 'HOT_MISTAKE_NEEDS_SOLUTION',
                priority: 'CRITICAL',
                mistake: m.id,
                reason: `${m.title} hit ${m.hitCount} times but no solution documented`,
            });

            missingAreas.push({
                area: `solution-for-${m.id}`,
                reason: 'Frequently violated anti-pattern needs best practice',
                hitCount: m.hitCount,
            });
        }
    });

    // Signal 4: Intent under-served
    if (intent && intent.strength > 0.7) {
        const coverageScore = improvements.length / (mistakes.length + improvements.length);
        if (coverageScore < 0.5) {
            signals.push({
                type: 'INTENT_UNDER_SERVED',
                priority: 'MEDIUM',
                reason: `Intent "${intent.goal}" is clear but solutions are scarce`,
            });
        }
    }

    return {
        signals,
        missingAreas,
        nextAction: determineNextAction(signals),
    };
}

// ============================================================================
// SYNTHESIS: Build Cognitive Lessons
// ============================================================================

/**
 * Format tag as title
 */
function formatTagAsTitle(tag) {
    return tag
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');
}

/**
 * Synthesize Cognitive Lesson Units from mistakes + improvements
 * THIS IS THE MAIN FUNCTION
 */
export function synthesizeLessons() {
    const mistakesDb = loadMistakes();
    const improvementsDb = loadImprovements();

    // Group by tag
    const groups = new Map();

    // Add mistakes to groups
    mistakesDb.mistakes.forEach(m => {
        const tags = m.tags || ['uncategorized'];
        tags.forEach(tag => {
            if (!groups.has(tag)) {
                groups.set(tag, { mistakes: [], improvements: [] });
            }
            groups.get(tag).mistakes.push(m);
        });
    });

    // Add improvements to groups
    improvementsDb.improvements.forEach(i => {
        const tags = i.tags || ['uncategorized'];
        tags.forEach(tag => {
            if (!groups.has(tag)) {
                groups.set(tag, { mistakes: [], improvements: [] });
            }
            groups.get(tag).improvements.push(i);
        });
    });

    // Build Cognitive Lessons
    const lessons = [];
    let lessonId = 1;

    groups.forEach((group, tag) => {
        const intent = inferIntent([tag, ...group.mistakes.flatMap(m => m.tags || [])]);
        const maturity = calculateMaturity(group.mistakes, group.improvements);
        const evolution = analyzeEvolution(group.mistakes, group.improvements, intent);

        lessons.push({
            id: `LESSON-${String(lessonId++).padStart(3, '0')}`,
            title: formatTagAsTitle(tag),
            tag,
            intent,
            mistakes: group.mistakes,
            improvements: group.improvements,
            maturity,
            evolution,
        });
    });

    // Sort by maturity (MATURE first, RAW last)
    const stateOrder = { 'IDEAL': 0, 'MATURE': 1, 'LEARNING': 2, 'RAW': 3 };
    lessons.sort((a, b) => {
        const stateCompare = stateOrder[a.maturity.state] - stateOrder[b.maturity.state];
        if (stateCompare !== 0) return stateCompare;
        return b.maturity.confidence - a.maturity.confidence; // Higher confidence first
    });

    return lessons;
}

export default {
    loadMistakes,
    loadImprovements,
    inferIntent,
    buildContext,
    matchPattern,
    calculateMaturity,
    analyzeEvolution,
    synthesizeLessons,
};
