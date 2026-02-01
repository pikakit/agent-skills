/**
 * Causality Engine v7.0 - Pattern Analysis
 * 
 * Analyzes cause-effect patterns from lessons and errors.
 * Provides root cause analysis and pattern detection.
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
const PATTERNS_FILE = path.join(KNOWLEDGE_DIR, 'causal-patterns.json');

// ============================================================================
// PATTERN DATA STRUCTURES
// ============================================================================

/**
 * Pattern structure:
 * {
 *   id: string,
 *   cause: string,           // What triggered the error
 *   effect: string,          // What was the result
 *   resolution: string,      // How it was fixed
 *   confidence: number,      // 0-1 confidence score
 *   occurrences: number,     // How many times seen
 *   lastSeen: string,        // ISO timestamp
 *   category: string,        // Category of pattern
 *   tags: string[]           // Related tags
 * }
 */

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
                    const data = JSON.parse(content);
                    return data.lessons || [];
                }
            } catch (e) {
                // Continue to next path
            }
        }
    }
    return [];
}

/**
 * Load causal patterns from file
 */
export function loadCausalPatterns() {
    if (fs.existsSync(PATTERNS_FILE)) {
        try {
            const data = JSON.parse(fs.readFileSync(PATTERNS_FILE, 'utf8'));
            return data.patterns || [];
        } catch (e) {
            return [];
        }
    }

    // Generate patterns from lessons if no patterns file
    return generatePatternsFromLessons();
}

/**
 * Save causal patterns
 */
function saveCausalPatterns(patterns) {
    const dir = path.dirname(PATTERNS_FILE);
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }

    fs.writeFileSync(PATTERNS_FILE, JSON.stringify({
        patterns,
        lastUpdated: new Date().toISOString(),
        version: '7.0.0'
    }, null, 2));
}

/**
 * Generate patterns from existing lessons
 */
function generatePatternsFromLessons() {
    const lessons = loadLessons();
    const patterns = [];

    for (const lesson of lessons) {
        const pattern = {
            id: lesson.id || `pattern-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
            cause: lesson.trigger || lesson.pattern || lesson.cause || 'Unknown cause',
            effect: lesson.effect || lesson.message || 'Error occurred',
            resolution: lesson.resolution || lesson.fix || lesson.solution || 'Apply learned fix',
            confidence: parseFloat(lesson.confidence) || 0.7,
            occurrences: parseInt(lesson.occurrences) || 1,
            lastSeen: lesson.lastSeen || lesson.created || new Date().toISOString(),
            category: lesson.category || categorizePattern(lesson),
            tags: lesson.tags || extractTags(lesson)
        };

        patterns.push(pattern);
    }

    // Save generated patterns
    if (patterns.length > 0) {
        saveCausalPatterns(patterns);
    }

    return patterns;
}

/**
 * Categorize a pattern based on its content
 */
function categorizePattern(lesson) {
    const content = JSON.stringify(lesson).toLowerCase();

    if (content.includes('import') || content.includes('module')) return 'import-error';
    if (content.includes('type') || content.includes('typescript')) return 'type-error';
    if (content.includes('syntax')) return 'syntax-error';
    if (content.includes('null') || content.includes('undefined')) return 'null-reference';
    if (content.includes('async') || content.includes('await') || content.includes('promise')) return 'async-error';
    if (content.includes('api') || content.includes('fetch') || content.includes('request')) return 'api-error';
    if (content.includes('file') || content.includes('path')) return 'file-error';
    if (content.includes('config') || content.includes('env')) return 'config-error';

    return 'general';
}

/**
 * Extract tags from lesson content
 */
function extractTags(lesson) {
    const tags = [];
    const content = JSON.stringify(lesson).toLowerCase();

    const tagPatterns = [
        'javascript', 'typescript', 'react', 'node', 'npm',
        'import', 'export', 'async', 'await', 'promise',
        'error', 'warning', 'critical', 'fix', 'workaround'
    ];

    for (const tag of tagPatterns) {
        if (content.includes(tag)) {
            tags.push(tag);
        }
    }

    return tags.slice(0, 5); // Limit to 5 tags
}

// ============================================================================
// PATTERN ANALYSIS
// ============================================================================

/**
 * Get pattern count
 */
export function getPatternCount() {
    const patterns = loadCausalPatterns();
    return patterns.length;
}

/**
 * Analyze an error and find matching patterns
 */
export function analyzeError(errorMessage, context = {}) {
    const patterns = loadCausalPatterns();
    const matches = [];

    const errorLower = errorMessage.toLowerCase();

    for (const pattern of patterns) {
        let score = 0;

        // Check cause match
        if (pattern.cause && errorLower.includes(pattern.cause.toLowerCase())) {
            score += 0.4;
        }

        // Check category match
        if (pattern.category && errorLower.includes(pattern.category.replace('-', ' '))) {
            score += 0.2;
        }

        // Check tags match
        for (const tag of pattern.tags || []) {
            if (errorLower.includes(tag)) {
                score += 0.1;
            }
        }

        // Boost by confidence and occurrences
        score *= pattern.confidence || 0.5;
        score *= Math.min(pattern.occurrences || 1, 5) / 5;

        if (score > 0.1) {
            matches.push({
                pattern,
                score,
                suggestedResolution: pattern.resolution
            });
        }
    }

    // Sort by score descending
    matches.sort((a, b) => b.score - a.score);

    return {
        matches: matches.slice(0, 5),
        analyzed: true,
        timestamp: new Date().toISOString()
    };
}

/**
 * Add a new causal pattern
 */
export function addPattern(cause, effect, resolution, metadata = {}) {
    const patterns = loadCausalPatterns();

    // Check for existing similar pattern
    const existing = patterns.find(p =>
        p.cause.toLowerCase() === cause.toLowerCase()
    );

    if (existing) {
        // Update existing pattern
        existing.occurrences = (existing.occurrences || 1) + 1;
        existing.lastSeen = new Date().toISOString();
        existing.confidence = Math.min((existing.confidence || 0.7) + 0.05, 1);
        saveCausalPatterns(patterns);
        return existing;
    }

    // Create new pattern
    const newPattern = {
        id: `pattern-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
        cause,
        effect,
        resolution,
        confidence: metadata.confidence || 0.7,
        occurrences: 1,
        lastSeen: new Date().toISOString(),
        category: metadata.category || 'general',
        tags: metadata.tags || []
    };

    patterns.push(newPattern);
    saveCausalPatterns(patterns);

    return newPattern;
}

/**
 * Get patterns by category
 */
export function getPatternsByCategory(category) {
    const patterns = loadCausalPatterns();
    return patterns.filter(p => p.category === category);
}

/**
 * Get pattern statistics
 */
export function getPatternStats() {
    const patterns = loadCausalPatterns();

    const categories = {};
    let totalOccurrences = 0;
    let avgConfidence = 0;

    for (const pattern of patterns) {
        categories[pattern.category] = (categories[pattern.category] || 0) + 1;
        totalOccurrences += pattern.occurrences || 1;
        avgConfidence += pattern.confidence || 0.5;
    }

    return {
        totalPatterns: patterns.length,
        byCategory: categories,
        totalOccurrences,
        avgConfidence: patterns.length > 0 ? avgConfidence / patterns.length : 0
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    loadCausalPatterns,
    getPatternCount,
    analyzeError,
    addPattern,
    getPatternsByCategory,
    getPatternStats
};
