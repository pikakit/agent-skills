/**
 * Knowledge Storage v6.0 - Unified Schema
 * 
 * Single source of truth for all lessons in PikaKit AutoLearn system.
 * Consolidates legacy lessons-learned.yaml, mistakes.yaml, and improvements.yaml
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const KNOWLEDGE_FILE = path.join(KNOWLEDGE_DIR, 'knowledge.yaml');

// Legacy files (for backward compatibility)
const LEGACY_FILES = {
    lessonsLearned: path.join(KNOWLEDGE_DIR, 'lessons-learned.yaml'),
    mistakes: path.join(KNOWLEDGE_DIR, 'mistakes.yaml'),
    improvements: path.join(KNOWLEDGE_DIR, 'improvements.yaml')
};

// ============================================================================
// SCHEMA DEFINITION
// ============================================================================

/**
 * @typedef {Object} Lesson
 * @property {string} id - Unique identifier (LESSON-XXX or CMD-XXX)
 * @property {string} type - Type: 'mistake' | 'improvement' | 'pattern' | 'command'
 * @property {string} [shell] - Shell type for command lessons: 'powershell' | 'bash' | 'all'
 * @property {string} pattern - Regex pattern to match
 * @property {string} message - Human-readable explanation
 * @property {string} severity - 'ERROR' | 'WARNING' | 'INFO'
 * @property {string} intent - 'prevent' | 'optimize' | 'inform'
 * @property {number} confidence - 0.0 to 1.0
 * @property {string} maturity - 'learning' | 'stable'
 * @property {number} hitCount - Number of times pattern was matched
 * @property {string|null} lastHit - ISO8601 timestamp of last match
 * @property {string[]} excludePaths - Glob patterns for excluded paths
 * @property {string[]} tags - Category tags
 * @property {Object|null} autoFix - Auto-fix configuration
 */

/**
 * @typedef {Object} KnowledgeBase
 * @property {number} version - Schema version (6.0)
 * @property {string} createdAt - ISO8601 creation timestamp
 * @property {string} updatedAt - ISO8601 last update timestamp
 * @property {Lesson[]} lessons - Array of lessons
 */

/**
 * Create empty knowledge base with v6 schema
 * @returns {KnowledgeBase}
 */
export function createEmptyKnowledge() {
    return {
        version: 6.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons: []
    };
}

// ============================================================================
// LOADING
// ============================================================================

/**
 * Load knowledge base (v6 unified format only)
 * Legacy formats (v3/v4) should be migrated using migrate-to-v6.js
 * 
 * @returns {KnowledgeBase}
 */
export function loadKnowledge() {
    try {
        if (fs.existsSync(KNOWLEDGE_FILE)) {
            const content = fs.readFileSync(KNOWLEDGE_FILE, 'utf8');
            const data = yaml.load(content) || createEmptyKnowledge();
            return data;
        }

        // No v6 file - return empty (legacy files should be migrated)
        return createEmptyKnowledge();

    } catch (error) {
        console.error('[knowledge] Error loading:', error.message);
        return createEmptyKnowledge();
    }
}

/**
 * Load from v4 legacy files (mistakes.yaml + improvements.yaml)
 * @returns {KnowledgeBase}
 */
function loadV4Legacy() {
    const knowledge = createEmptyKnowledge();

    // Load mistakes
    if (fs.existsSync(LEGACY_FILES.mistakes)) {
        try {
            const data = yaml.load(fs.readFileSync(LEGACY_FILES.mistakes, 'utf8'));
            const mistakes = (data.mistakes || []).map(m => ({
                id: m.id,
                type: 'mistake',
                pattern: m.pattern,
                message: m.message,
                severity: m.severity || 'WARNING',
                intent: 'prevent',
                confidence: m.cognitive?.confidence || 0.5,
                maturity: m.cognitive?.maturity || 'learning',
                hitCount: m.hitCount || 0,
                lastHit: m.lastHit || null,
                excludePaths: m.excludePaths || [],
                tags: m.tags || [],
                autoFix: m.autoFix || null
            }));
            knowledge.lessons.push(...mistakes);
        } catch (e) {
            console.error('[knowledge] Error loading mistakes.yaml:', e.message);
        }
    }

    // Load improvements
    if (fs.existsSync(LEGACY_FILES.improvements)) {
        try {
            const data = yaml.load(fs.readFileSync(LEGACY_FILES.improvements, 'utf8'));
            const improvements = (data.improvements || []).map(i => ({
                id: i.id,
                type: 'improvement',
                pattern: i.pattern,
                message: i.message,
                severity: 'INFO',
                intent: 'optimize',
                confidence: i.cognitive?.confidence || 0.5,
                maturity: i.cognitive?.maturity || 'learning',
                hitCount: i.hitCount || i.appliedCount || 0,
                lastHit: i.lastHit || i.lastApplied || null,
                excludePaths: i.excludePaths || [],
                tags: i.tags || [],
                autoFix: null
            }));
            knowledge.lessons.push(...improvements);
        } catch (e) {
            console.error('[knowledge] Error loading improvements.yaml:', e.message);
        }
    }

    return knowledge;
}

/**
 * Load from v3 legacy file (lessons-learned.yaml)
 * @returns {KnowledgeBase}
 */
function loadV3Legacy() {
    const knowledge = createEmptyKnowledge();

    try {
        const data = yaml.load(fs.readFileSync(LEGACY_FILES.lessonsLearned, 'utf8'));
        const lessons = (data.lessons || []).map(l => ({
            id: l.id,
            type: l.severity === 'ERROR' ? 'mistake' : 'pattern',
            pattern: l.pattern,
            message: l.message,
            severity: l.severity || 'WARNING',
            intent: l.severity === 'ERROR' ? 'prevent' : 'inform',
            confidence: l.hitCount > 10 ? 0.9 : 0.5,
            maturity: l.hitCount > 10 ? 'stable' : 'learning',
            hitCount: l.hitCount || 0,
            lastHit: l.lastHit || null,
            excludePaths: [],
            tags: [l.category || 'general'],
            autoFix: null
        }));
        knowledge.lessons.push(...lessons);
    } catch (e) {
        console.error('[knowledge] Error loading lessons-learned.yaml:', e.message);
    }

    return knowledge;
}

// ============================================================================
// SAVING
// ============================================================================

/**
 * Save knowledge base to unified format
 * @param {KnowledgeBase} knowledge
 */
export function saveKnowledge(knowledge) {
    try {
        // Ensure directory exists
        if (!fs.existsSync(KNOWLEDGE_DIR)) {
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        }

        // Update timestamp
        knowledge.updatedAt = new Date().toISOString();
        knowledge.version = 6.0;

        // Write to file
        const yamlContent = yaml.dump(knowledge, {
            lineWidth: -1,
            quotingType: '"',
            forceQuotes: false
        });

        fs.writeFileSync(KNOWLEDGE_FILE, yamlContent, 'utf8');

        return true;
    } catch (error) {
        console.error('[knowledge] Error saving:', error.message);
        return false;
    }
}

// ============================================================================
// OPERATIONS
// ============================================================================

/**
 * Add a new lesson
 * @param {Lesson} lesson
 * @returns {boolean}
 */
export function addLesson(lesson) {
    const knowledge = loadKnowledge();

    // Check for duplicate ID
    if (knowledge.lessons.some(l => l.id === lesson.id)) {
        console.warn(`[knowledge] Lesson ${lesson.id} already exists`);
        return false;
    }

    knowledge.lessons.push(lesson);
    return saveKnowledge(knowledge);
}

/**
 * Update an existing lesson
 * @param {string} id
 * @param {Partial<Lesson>} updates
 * @returns {boolean}
 */
export function updateLesson(id, updates) {
    const knowledge = loadKnowledge();
    const index = knowledge.lessons.findIndex(l => l.id === id);

    if (index === -1) {
        console.warn(`[knowledge] Lesson ${id} not found`);
        return false;
    }

    knowledge.lessons[index] = { ...knowledge.lessons[index], ...updates };
    return saveKnowledge(knowledge);
}

/**
 * Remove a lesson
 * @param {string} id
 * @returns {boolean}
 */
export function removeLesson(id) {
    const knowledge = loadKnowledge();
    const initialLength = knowledge.lessons.length;
    knowledge.lessons = knowledge.lessons.filter(l => l.id !== id);

    if (knowledge.lessons.length === initialLength) {
        console.warn(`[knowledge] Lesson ${id} not found`);
        return false;
    }

    return saveKnowledge(knowledge);
}

/**
 * Get lessons by type
 * @param {'mistake' | 'improvement' | 'pattern' | 'command'} type
 * @returns {Lesson[]}
 */
export function getLessonsByType(type) {
    const knowledge = loadKnowledge();
    return knowledge.lessons.filter(l => l.type === type);
}

/**
 * Get command-type lessons (for Command Failure Learner)
 * @param {string} [shell] - Optional filter by shell type
 * @returns {Lesson[]}
 */
export function getCommandLessons(shell = null) {
    const knowledge = loadKnowledge();
    return knowledge.lessons.filter(l => {
        if (l.type !== 'command') return false;
        if (shell && l.shell !== shell && l.shell !== 'all') return false;
        return true;
    });
}

/**
 * Get total lesson count
 * @returns {number}
 */
export function getLessonCount() {
    const knowledge = loadKnowledge();
    return knowledge.lessons.length;
}

/**
 * Record a hit on a lesson
 * @param {string} id
 * @returns {boolean}
 */
export function recordHit(id) {
    const knowledge = loadKnowledge();
    const lesson = knowledge.lessons.find(l => l.id === id);

    if (!lesson) {
        return false;
    }

    lesson.hitCount = (lesson.hitCount || 0) + 1;
    lesson.lastHit = new Date().toISOString();

    // Auto-update maturity based on hits
    if (lesson.hitCount >= 10) {
        lesson.maturity = 'stable';
        lesson.confidence = Math.min(0.95, lesson.confidence + 0.05);
    }

    return saveKnowledge(knowledge);
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    loadKnowledge,
    saveKnowledge,
    addLesson,
    updateLesson,
    removeLesson,
    getLessonsByType,
    getCommandLessons,
    getLessonCount,
    recordHit,
    createEmptyKnowledge,
    KNOWLEDGE_FILE,
    LEGACY_FILES
};
