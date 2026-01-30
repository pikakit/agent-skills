#!/usr/bin/env node
/**
 * Lesson Query Engine
 * Query relevant lessons BEFORE coding to prevent mistakes
 */

import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import { getMistakesFile, getImprovementsFile } from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Load all lessons (mistakes + improvements)
 */
function loadAllLessons() {
    const lessons = [];

    try {
        const mistakesFile = getMistakesFile();
        if (fs.existsSync(mistakesFile)) {
            const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
            for (const m of data.mistakes || []) {
                lessons.push({ ...m, type: 'mistake' });
            }
        }
    } catch (e) { /* ignore */ }

    try {
        const improvementsFile = getImprovementsFile();
        if (fs.existsSync(improvementsFile)) {
            const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
            for (const i of data.improvements || []) {
                lessons.push({ ...i, type: 'improvement' });
            }
        }
    } catch (e) { /* ignore */ }

    return lessons;
}

/**
 * Calculate relevance score for a lesson given context
 */
export function calculateRelevance(lesson, context, scope = null) {
    let score = 0.0;
    const contextLower = context.toLowerCase();

    // Check scope match (highest priority)
    if (scope && lesson.scope === scope) {
        score += 0.4;
    }

    // Check tags match
    const tags = lesson.tags || [];
    for (const tag of tags) {
        if (contextLower.includes(tag.toLowerCase())) {
            score += 0.2;
        }
    }

    // Check category match
    const category = lesson.category || '';
    if (category && contextLower.includes(category)) {
        score += 0.15;
    }

    // Check message/lesson keywords
    const message = (lesson.message || lesson.lesson || lesson.improvement || '').toLowerCase();
    const messageWords = new Set(message.split(/\s+/));
    const contextWords = new Set(contextLower.split(/\s+/));

    // Word overlap
    let overlap = 0;
    for (const word of messageWords) {
        if (contextWords.has(word) && word.length > 3) {
            overlap++;
        }
    }
    score += Math.min(overlap * 0.05, 0.25);

    return Math.min(score, 1.0);
}

/**
 * Query relevant lessons for current coding task
 */
export function queryLessons(context, options = {}) {
    const { scope = null, severity = null, limit = 10, minRelevance = 0.1 } = options;

    const lessons = loadAllLessons();

    if (lessons.length === 0) {
        return [];
    }

    const scoredLessons = [];

    for (const lesson of lessons) {
        // Skip deprecated lessons
        if (lesson.status === 'deprecated') continue;

        // Apply severity filter
        if (severity && lesson.severity !== severity) continue;

        // Calculate relevance
        const relevance = calculateRelevance(lesson, context, scope);

        if (relevance >= minRelevance) {
            scoredLessons.push({ ...lesson, relevance });
        }
    }

    // Sort by relevance (highest first)
    scoredLessons.sort((a, b) => b.relevance - a.relevance);

    return scoredLessons.slice(0, limit);
}

/**
 * Format lessons for inclusion in AI generation prompt
 */
export function formatLessonsForPrompt(lessons) {
    if (lessons.length === 0) return '';

    let promptSection = '\n📚 **Learned Lessons to Apply** (from past mistakes):\n\n';

    for (const lesson of lessons) {
        const relevancePct = Math.round(lesson.relevance * 100);
        const message = lesson.message || lesson.lesson || lesson.improvement || '';
        promptSection += `- [${lesson.id}] (${relevancePct}% relevant, ${lesson.severity || 'medium'})\n`;
        promptSection += `  ${message}\n\n`;
    }

    return promptSection;
}

/**
 * Mark a lesson as applied (for analytics)
 */
export function markLessonApplied(lessonId) {
    // Update in mistakes file
    try {
        const mistakesFile = getMistakesFile();
        if (fs.existsSync(mistakesFile)) {
            const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
            for (const lesson of data.mistakes || []) {
                if (lesson.id === lessonId) {
                    lesson.appliedCount = (lesson.appliedCount || 0) + 1;
                    lesson.lastApplied = new Date().toISOString();
                    fs.writeFileSync(mistakesFile, yaml.dump(data, { noRefs: true }), 'utf-8');
                    return;
                }
            }
        }
    } catch (e) { /* ignore */ }

    // Update in improvements file
    try {
        const improvementsFile = getImprovementsFile();
        if (fs.existsSync(improvementsFile)) {
            const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
            for (const lesson of data.improvements || []) {
                if (lesson.id === lessonId) {
                    lesson.appliedCount = (lesson.appliedCount || 0) + 1;
                    lesson.lastApplied = new Date().toISOString();
                    fs.writeFileSync(improvementsFile, yaml.dump(data, { noRefs: true }), 'utf-8');
                    return;
                }
            }
        }
    } catch (e) { /* ignore */ }
}

function main() {
    const args = process.argv.slice(2);

    // Check for help
    if (args.includes('--help') || args.includes('-h') || args.length === 0) {
        console.log('Lesson Query Engine');
        console.log('\nUsage: node query_lessons.js <context> [options]');
        console.log('\nOptions:');
        console.log('  --scope, -s <scope>     Filter by scope');
        console.log('  --severity <level>      Filter by ERROR or WARNING');
        console.log('  --limit, -l <n>         Max results (default: 5)');
        console.log('  --json                  Output as JSON');
        console.log('  --for-prompt            Format for AI prompt');
        return;
    }

    // Parse arguments
    const context = args[0];
    const scopeIdx = args.indexOf('--scope');
    const severityIdx = args.indexOf('--severity');
    const limitIdx = args.indexOf('--limit');

    const scope = scopeIdx !== -1 ? args[scopeIdx + 1] : null;
    const severity = severityIdx !== -1 ? args[severityIdx + 1] : null;
    const limit = limitIdx !== -1 ? parseInt(args[limitIdx + 1], 10) : 5;
    const asJson = args.includes('--json');
    const forPrompt = args.includes('--for-prompt');

    // Query lessons
    const lessons = queryLessons(context, { scope, severity, limit });

    if (lessons.length === 0) {
        console.log('📭 No relevant lessons found.');
        return;
    }

    // Output format
    if (asJson) {
        console.log(JSON.stringify(lessons, null, 2));
    } else if (forPrompt) {
        console.log(formatLessonsForPrompt(lessons));
    } else {
        console.log(`\n📚 ${lessons.length} relevant lesson(s) found:\n`);

        for (const lesson of lessons) {
            const relevancePct = Math.round(lesson.relevance * 100);
            const message = lesson.message || lesson.lesson || lesson.improvement || '';
            console.log(`  [${lesson.id}] ${relevancePct}% relevant | ${lesson.severity || 'medium'}`);
            console.log(`  ${message}`);

            if (lesson.scope) {
                console.log(`  Scope: ${lesson.scope}`);
            }
            if (lesson.tags && lesson.tags.length > 0) {
                console.log(`  Tags: ${lesson.tags.join(', ')}`);
            }
            console.log();
        }

        console.log('💡 Use these lessons to avoid repeating past mistakes!');
    }
}

if (process.argv[1] === __filename) {
    main();
}
