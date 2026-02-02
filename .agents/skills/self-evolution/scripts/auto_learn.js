#!/usr/bin/env node
/**
 * Auto-Learn Main Orchestrator (Legacy Wrapper)
 * 
 * This is a compatibility layer that redirects to the v4.0 auto_learn_v4.js
 * For new code, use auto_learn_v4.js directly.
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

import { detectMistakeTrigger } from './detect_triggers.js';
import { extractLesson, extractLessonWithAI } from './extract_lesson.js';
import {
    findProjectRoot,
    getProjectLessonsDir,
    ensureLessonsDir,
    getGlobalLessonsFile
} from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Get project lessons file (legacy v3 format)
 */
function getProjectLessonsFile() {
    const lessonsDir = getProjectLessonsDir();
    return path.join(lessonsDir, 'project.yaml');
}

/**
 * Load project-scoped lessons with fallback to global
 */
export function loadKnowledge() {
    try {
        const lessonsFile = getProjectLessonsFile();

        if (fs.existsSync(lessonsFile)) {
            const data = yaml.load(fs.readFileSync(lessonsFile, 'utf-8')) || { version: 1, lessons: [], scope: 'project' };
            return data;
        }

        // First time: migrate from global
        const globalFile = getGlobalLessonsFile();
        if (fs.existsSync(globalFile)) {
            console.log('📦 Migrating lessons from global to project-scoped storage...');
            const globalData = yaml.load(fs.readFileSync(globalFile, 'utf-8')) || { version: 1, lessons: [] };

            globalData.scope = 'project';
            globalData.migrated_from = 'global';
            globalData.migrated_at = new Date().toISOString();

            ensureLessonsDir();
            fs.writeFileSync(lessonsFile, yaml.dump(globalData, { noRefs: true }), 'utf-8');

            console.log(`✅ Migrated ${(globalData.lessons || []).length} lessons to ${lessonsFile}`);
            return globalData;
        }

        return { version: 1, lessons: [], scope: 'project' };
    } catch (e) {
        console.log(`⚠️  Warning: ${e.message}`);
        console.log('   Using global lessons instead.');

        const globalFile = getGlobalLessonsFile();
        if (fs.existsSync(globalFile)) {
            return yaml.load(fs.readFileSync(globalFile, 'utf-8')) || { version: 1, lessons: [] };
        }
        return { version: 1, lessons: [], scope: 'global' };
    }
}

/**
 * Save lessons to project-scoped storage
 */
export function saveKnowledge(data) {
    try {
        const lessonsFile = getProjectLessonsFile();
        ensureLessonsDir();

        if (!data.scope) {
            data.scope = 'project';
        }
        data.updated_at = new Date().toISOString();

        fs.writeFileSync(lessonsFile, yaml.dump(data, { noRefs: true }), 'utf-8');
    } catch (e) {
        console.log(`⚠️  Warning: ${e.message}`);
        console.log('   Saving to global lessons instead.');

        const globalFile = getGlobalLessonsFile();
        fs.mkdirSync(path.dirname(globalFile), { recursive: true });
        fs.writeFileSync(globalFile, yaml.dump(data, { noRefs: true }), 'utf-8');
    }
}

/**
 * Generate next LEARN-XXX ID
 */
function getNextLessonId(lessons) {
    if (!lessons || lessons.length === 0) {
        return 'LEARN-001';
    }

    let maxNum = 0;
    for (const lesson of lessons) {
        const lessonId = lesson.id || '';
        if (lessonId.startsWith('LEARN-')) {
            try {
                const num = parseInt(lessonId.split('-')[1], 10);
                maxNum = Math.max(maxNum, num);
            } catch (e) { /* ignore */ }
        }
    }

    return `LEARN-${String(maxNum + 1).padStart(3, '0')}`;
}

/**
 * Check if lesson already exists
 */
function isDuplicate(newLesson, existingLessons) {
    const newPattern = (newLesson.pattern || '').toLowerCase();
    const newMessage = (newLesson.message || '').toLowerCase();

    for (const lesson of existingLessons) {
        if ((lesson.pattern || '').toLowerCase() === newPattern) {
            return { duplicate: true, existingId: lesson.id };
        }

        const existingMsg = (lesson.message || '').toLowerCase();
        const newWords = new Set(newMessage.split(/\s+/));
        const existingWords = new Set(existingMsg.split(/\s+/));

        const intersection = new Set([...newWords].filter(x => existingWords.has(x)));
        const union = new Set([...newWords, ...existingWords]);

        if (intersection.size / union.size > 0.7) {
            return { duplicate: true, existingId: lesson.id };
        }
    }

    return { duplicate: false, existingId: null };
}

/**
 * Enhanced auto-learning pipeline
 */
export async function autoLearn(userMessage, aiContext = '', force = false, useAI = true) {
    // Step 1: Detect mistake
    const detection = detectMistakeTrigger(userMessage, aiContext);

    if (!detection.detected && !force) {
        return {
            success: false,
            message: 'No mistake trigger detected',
            confidence: detection.confidence
        };
    }

    if (detection.confidence < 50 && !force) {
        return {
            success: false,
            message: `Low confidence (${detection.confidence}%). Use --force to override.`,
            confidence: detection.confidence
        };
    }

    // Step 2: Try AI extraction if enabled
    if (useAI && detection.confidence >= 50) {
        try {
            const extracted = await extractLesson(userMessage, aiContext);

            const knowledge = loadKnowledge();
            const lessons = knowledge.lessons || [];

            // Check duplicates
            const { duplicate, existingId } = isDuplicate(extracted, lessons);
            if (duplicate) {
                return {
                    success: false,
                    message: `Duplicate lesson (similar to ${existingId})`,
                    method: 'AI',
                    lesson_id: existingId
                };
            }

            // Generate ID and add
            const lessonId = getNextLessonId(lessons);
            extracted.id = lessonId;
            lessons.push(extracted);
            knowledge.lessons = lessons;
            saveKnowledge(knowledge);

            return {
                success: true,
                method: 'AI',
                message: `Lesson ${lessonId} created using AI extraction`,
                lesson_id: lessonId,
                lesson: extracted,
                confidence: detection.confidence
            };
        } catch (e) {
            return {
                success: false,
                message: `AI extraction failed: ${e.message}`,
                fallback: 'manual',
                confidence: detection.confidence
            };
        }
    }

    // Fallback: Manual extraction mode
    return {
        success: true,
        message: 'Mistake detected. Use manual extraction or add --ai flag.',
        method: 'manual',
        confidence: detection.confidence,
        triggers: detection.triggers,
        context: detection.context
    };
}

/**
 * Add a lesson to knowledge base
 */
export function addLesson(contextDict) {
    const knowledge = loadKnowledge();
    const lessons = knowledge.lessons || [];

    const lesson = {
        pattern: contextDict.mistake || '',
        message: contextDict.correction || '',
        impact: contextDict.impact || '',
        category: contextDict.mistake_type || 'code-quality',
        severity: 'medium',
        addedAt: new Date().toISOString()
    };

    const { duplicate, existingId } = isDuplicate(lesson, lessons);
    if (duplicate) {
        return {
            success: false,
            message: `Duplicate lesson detected (similar to ${existingId})`,
            lesson_id: existingId
        };
    }

    const lessonId = getNextLessonId(lessons);
    lesson.id = lessonId;

    lessons.push(lesson);
    knowledge.lessons = lessons;

    saveKnowledge(knowledge);

    return {
        success: true,
        message: `Lesson ${lessonId} added successfully`,
        lesson_id: lessonId,
        lesson: lesson
    };
}

async function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'detect': {
            const msgIdx = args.indexOf('--message');
            const ctxIdx = args.indexOf('--context');
            const force = args.includes('--force');
            const useAI = args.includes('--ai');

            const message = msgIdx !== -1 ? args[msgIdx + 1] : '';
            const context = ctxIdx !== -1 ? args[ctxIdx + 1] : '';

            const result = await autoLearn(message, context, force, useAI);
            console.log(JSON.stringify(result, null, 2));
            break;
        }

        case 'add': {
            const ctxIdx = args.indexOf('--context');
            if (ctxIdx !== -1) {
                const context = JSON.parse(args[ctxIdx + 1]);
                const result = addLesson(context);
                console.log(JSON.stringify(result, null, 2));

                if (result.success) {
                    console.log(`\n📚 Đã học: [${result.lesson_id}] - ${result.lesson.message}`);
                }
            }
            break;
        }

        case 'test': {
            console.log('🧪 Running auto-learn test suite...\n');

            console.log('Test 1: Mistake Detection');
            const testMsg = 'Đây là lỗi nghiêm trọng, bạn tạo file sai';
            const result = await autoLearn(testMsg);
            console.log(`Message: ${testMsg}`);
            console.log(`Result: ${JSON.stringify(result, null, 2)}\n`);

            console.log('✅ Test suite completed');
            break;
        }

        default:
            console.log('Auto-Learn Main Orchestrator (Legacy)');
            console.log('\nCommands:');
            console.log('  detect --message <msg>  Detect mistake in message');
            console.log('  add --context <json>    Add lesson from context');
            console.log('  test                    Run test suite');
            console.log('\nNote: For v4.0 features, use auto_learn_v4.js directly.');
    }
}

if (process.argv[1] === __filename) {
    main();
}
