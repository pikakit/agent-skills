#!/usr/bin/env node
/**
 * Knowledge Index Generator
 * 
 * Builds inverted index for O(1) pattern lookup in knowledge base.
 * Regenerates on-demand when knowledge files change.
 * 
 * Usage:
 *   ag-smart index --rebuild    # Force rebuild index
 *   ag-smart index --status     # Check index freshness
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { KNOWLEDGE_DIR } from './config.js';

const INDEX_PATH = path.join(KNOWLEDGE_DIR, 'index.json');
const INDEX_VERSION = 1;

/**
 * Load all lessons from knowledge base
 * @returns {{ mistakes: Array, improvements: Array }}
 */
function loadAllLessons() {
    const mistakes = [];
    const improvements = [];
    
    // Load mistakes.yaml
    const mistakesPath = path.join(KNOWLEDGE_DIR, 'mistakes.yaml');
    if (fs.existsSync(mistakesPath)) {
        const data = yaml.load(fs.readFileSync(mistakesPath, 'utf8'));
        if (data?.mistakes) {
            mistakes.push(...data.mistakes.map(m => ({ ...m, type: 'mistake' })));
        }
    }
    
    // Load improvements.yaml
    const improvementsPath = path.join(KNOWLEDGE_DIR, 'improvements.yaml');
    if (fs.existsSync(improvementsPath)) {
        const data = yaml.load(fs.readFileSync(improvementsPath, 'utf8'));
        if (data?.improvements) {
            improvements.push(...data.improvements.map(i => ({ ...i, type: 'improvement' })));
        }
    }
    
    return { mistakes, improvements };
}

/**
 * Build inverted index from lessons
 * @param {Array} lessons - All lessons combined
 * @returns {Object} Index structure
 */
function buildIndex(lessons) {
    const patternIndex = {};  // pattern word -> lesson IDs
    const tagIndex = {};      // tag -> lesson IDs
    const idIndex = {};       // id -> lesson (for direct lookup)
    const severityIndex = {   // severity -> lesson IDs
        ERROR: [],
        WARNING: [],
        INFO: []
    };
    
    for (const lesson of lessons) {
        const id = lesson.id;
        
        // ID index (direct lookup)
        idIndex[id] = {
            pattern: lesson.pattern,
            message: lesson.message,
            severity: lesson.severity || 'WARNING',
            type: lesson.type,
            hitCount: lesson.hitCount || 0,
            confidence: lesson.cognitive?.confidence || 0.3
        };
        
        // Pattern index (tokenize pattern for partial matching)
        if (lesson.pattern) {
            const tokens = tokenizePattern(lesson.pattern);
            for (const token of tokens) {
                if (!patternIndex[token]) {
                    patternIndex[token] = [];
                }
                if (!patternIndex[token].includes(id)) {
                    patternIndex[token].push(id);
                }
            }
        }
        
        // Tag index
        if (lesson.tags && Array.isArray(lesson.tags)) {
            for (const tag of lesson.tags) {
                if (!tagIndex[tag]) {
                    tagIndex[tag] = [];
                }
                if (!tagIndex[tag].includes(id)) {
                    tagIndex[tag].push(id);
                }
            }
        }
        
        // Severity index
        const severity = lesson.severity || 'WARNING';
        if (severityIndex[severity]) {
            severityIndex[severity].push(id);
        }
    }
    
    return {
        version: INDEX_VERSION,
        generatedAt: new Date().toISOString(),
        stats: {
            totalLessons: lessons.length,
            totalMistakes: lessons.filter(l => l.type === 'mistake').length,
            totalImprovements: lessons.filter(l => l.type === 'improvement').length,
            totalPatterns: Object.keys(patternIndex).length,
            totalTags: Object.keys(tagIndex).length
        },
        patternIndex,
        tagIndex,
        severityIndex,
        idIndex
    };
}

/**
 * Tokenize a regex pattern into searchable words
 * @param {string} pattern - Regex pattern
 * @returns {string[]} Tokens
 */
function tokenizePattern(pattern) {
    // Extract alphanumeric words, ignoring regex special chars
    const words = pattern
        .replace(/[\[\]\(\)\{\}\.\*\+\?\^\$\\|]/g, ' ')
        .split(/\s+/)
        .map(w => w.toLowerCase().trim())
        .filter(w => w.length >= 2);
    
    return [...new Set(words)];
}

/**
 * Get modification time of knowledge files
 * @returns {number} Most recent mtime
 */
function getKnowledgeMtime() {
    const files = ['mistakes.yaml', 'improvements.yaml', 'lessons-learned.yaml'];
    let maxMtime = 0;
    
    for (const file of files) {
        const filepath = path.join(KNOWLEDGE_DIR, file);
        if (fs.existsSync(filepath)) {
            const stat = fs.statSync(filepath);
            if (stat.mtime.getTime() > maxMtime) {
                maxMtime = stat.mtime.getTime();
            }
        }
    }
    
    return maxMtime;
}

/**
 * Check if index is stale
 * @returns {{ stale: boolean, reason?: string }}
 */
export function checkIndexFreshness() {
    if (!fs.existsSync(INDEX_PATH)) {
        return { stale: true, reason: 'Index does not exist' };
    }
    
    try {
        const index = JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
        const indexTime = new Date(index.generatedAt).getTime();
        const knowledgeTime = getKnowledgeMtime();
        
        if (knowledgeTime > indexTime) {
            return { stale: true, reason: 'Knowledge files modified after index' };
        }
        
        if (index.version !== INDEX_VERSION) {
            return { stale: true, reason: `Index version mismatch (${index.version} vs ${INDEX_VERSION})` };
        }
        
        return { stale: false };
    } catch (e) {
        return { stale: true, reason: `Index corrupted: ${e.message}` };
    }
}

/**
 * Load or rebuild index
 * @param {boolean} forceRebuild - Force rebuild even if fresh
 * @returns {Object} Index
 */
export function loadIndex(forceRebuild = false) {
    const freshness = checkIndexFreshness();
    
    if (!forceRebuild && !freshness.stale) {
        // Load existing index
        return JSON.parse(fs.readFileSync(INDEX_PATH, 'utf8'));
    }
    
    // Rebuild index
    return rebuildIndex();
}

/**
 * Force rebuild index
 * @returns {Object} New index
 */
export function rebuildIndex() {
    const { mistakes, improvements } = loadAllLessons();
    const allLessons = [...mistakes, ...improvements];
    
    const index = buildIndex(allLessons);
    
    // Save index
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
    fs.writeFileSync(INDEX_PATH, JSON.stringify(index, null, 2), 'utf8');
    
    return index;
}

/**
 * Search index by pattern
 * @param {string} query - Search query
 * @param {Object} index - Loaded index
 * @returns {string[]} Matching lesson IDs
 */
export function searchByPattern(query, index) {
    const tokens = tokenizePattern(query);
    const matchingIds = new Set();
    
    for (const token of tokens) {
        if (index.patternIndex[token]) {
            for (const id of index.patternIndex[token]) {
                matchingIds.add(id);
            }
        }
    }
    
    return [...matchingIds];
}

/**
 * Search index by tag
 * @param {string} tag - Tag to search
 * @param {Object} index - Loaded index
 * @returns {string[]} Matching lesson IDs
 */
export function searchByTag(tag, index) {
    return index.tagIndex[tag] || [];
}

/**
 * Get lesson by ID
 * @param {string} id - Lesson ID
 * @param {Object} index - Loaded index
 * @returns {Object|null} Lesson info
 */
export function getById(id, index) {
    return index.idIndex[id] || null;
}

/**
 * CLI entry point
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--status')) {
        const freshness = checkIndexFreshness();
        if (freshness.stale) {
            console.log(`⚠️  Index is STALE: ${freshness.reason}`);
            process.exit(1);
        } else {
            const index = loadIndex();
            console.log(`✅ Index is FRESH`);
            console.log(`   Generated: ${index.generatedAt}`);
            console.log(`   Lessons: ${index.stats.totalLessons}`);
            console.log(`   Patterns: ${index.stats.totalPatterns}`);
            console.log(`   Tags: ${index.stats.totalTags}`);
        }
        return;
    }
    
    if (args.includes('--rebuild')) {
        console.log('🔄 Rebuilding knowledge index...');
        const index = rebuildIndex();
        console.log(`✅ Index rebuilt successfully`);
        console.log(`   Lessons: ${index.stats.totalLessons}`);
        console.log(`   Patterns: ${index.stats.totalPatterns}`);
        console.log(`   Tags: ${index.stats.totalTags}`);
        return;
    }
    
    console.log(`
📇 Knowledge Index Manager

Usage:
  ag-smart index --rebuild    Rebuild index from knowledge files
  ag-smart index --status     Check if index is fresh or stale

The index provides O(1) lookup for:
  - Pattern matching (by keyword)
  - Tag filtering
  - Severity grouping
  - Direct ID lookup
`);
}

// Run if called directly
if (process.argv[1]?.includes('knowledge-index')) {
    main();
}

export default {
    loadIndex,
    rebuildIndex,
    checkIndexFreshness,
    searchByPattern,
    searchByTag,
    getById
};
