#!/usr/bin/env node
/**
 * Auto-Learn v4.0 - Integrated Learning Pipeline
 * 
 * FEATURES:
 * - Smart categorization (mistake vs improvement)
 * - Dual storage (mistakes.yaml + improvements.yaml)
 * - Event tracking with self-improve trigger
 * - Smart API key resolution
 * - AI-powered extraction (optional)
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

import { detectMistakeTrigger } from './detect_triggers.js';
import { extractLessonWithAI } from './extract_lesson.js';
import { findProjectRoot, getMistakesFile, getImprovementsFile, ensureV4Structure } from './project_utils.js';
import { categorizeLearning, validateCategorization } from './categorize_learning.js';
import { incrementEvent, checkThreshold } from './event_tracker.js';
import { getConfiguredGenai } from './api_key_resolver.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Format lesson for storage
 */
function formatLessonMessage(lesson) {
    const mistake = lesson.mistake || '';
    const correction = lesson.correction || '';

    if (mistake && correction) {
        return `${mistake} → ${correction}`;
    } else if (mistake) {
        return mistake;
    } else if (correction) {
        return correction;
    }
    return 'Lesson learned from conversation';
}

/**
 * Determine severity from lesson
 */
function determineSeverity(lesson) {
    const impact = (lesson.impact || '').toLowerCase();

    if (['critical', 'severe', 'nghiêm trọng', 'data loss'].some(w => impact.includes(w))) {
        return 'CRITICAL';
    } else if (['high', 'important', 'quan trọng'].some(w => impact.includes(w))) {
        return 'ERROR';
    }
    return 'WARNING';
}

/**
 * Main auto-learn function (v4.0)
 */
export async function autoLearnV4(userMessage, aiContext = '', useAI = false) {
    // Ensure v4.0 structure exists
    ensureV4Structure();

    // Step 1: Detect mistake trigger
    const trigger = detectMistakeTrigger(userMessage);

    if (!trigger.detected) {
        return {
            success: false,
            error: 'No mistake/improvement trigger detected',
            confidence: trigger.confidence || 0
        };
    }

    // Step 2: Extract lesson
    let lesson;
    let lessonText;

    if (useAI) {
        try {
            const genai = await getConfiguredGenai(false);

            if (genai) {
                const lessonData = await extractLessonWithAI(userMessage, aiContext, trigger);

                if (!lessonData) {
                    return { success: false, error: 'AI extraction failed' };
                }

                lesson = {
                    mistake: lessonData.mistake || '',
                    correction: lessonData.correction || '',
                    impact: lessonData.impact || 'Medium'
                };

                lessonText = `${lesson.mistake} → ${lesson.correction}`;
            } else {
                return { success: false, error: 'AI not available. Set GEMINI_API_KEY or run without --ai' };
            }
        } catch (e) {
            return { success: false, error: `AI extraction error: ${e.message}` };
        }
    } else {
        // Manual extraction
        lesson = {
            mistake: userMessage,
            correction: 'See context',
            impact: 'Medium'
        };
        lessonText = userMessage;
    }

    // Step 3: Categorize (mistake or improvement)
    const category = categorizeLearning(userMessage, aiContext, lessonText);
    const validation = validateCategorization(category, userMessage, lessonText);

    // Step 4: Save to appropriate v4.0 file
    const projectRoot = findProjectRoot();
    if (!projectRoot) {
        return { success: false, error: 'Not in a project directory' };
    }

    // Get target file
    let targetFile, fileKey, idPrefix;
    if (category === 'mistake') {
        targetFile = getMistakesFile();
        fileKey = 'mistakes';
        idPrefix = 'MISTAKE';
    } else {
        targetFile = getImprovementsFile();
        fileKey = 'improvements';
        idPrefix = 'IMPROVE';
    }

    // Load existing
    let data;
    if (fs.existsSync(targetFile)) {
        data = yaml.load(fs.readFileSync(targetFile, 'utf-8')) || {};
    } else {
        data = { [fileKey]: [], version: 1, last_improved: new Date().toISOString() };
    }

    // Get next ID
    const existingIds = (data[fileKey] || []).map(l => l.id || '');
    const existingNums = existingIds
        .filter(id => id.includes('-'))
        .map(id => parseInt(id.split('-')[1], 10))
        .filter(n => !isNaN(n));
    const nextNum = existingNums.length > 0 ? Math.max(...existingNums) + 1 : 1;
    const nextId = `${idPrefix}-${String(nextNum).padStart(3, '0')}`;

    // Create entry
    let entry;
    if (category === 'mistake') {
        entry = {
            id: nextId,
            version: 1,
            problem: lesson.mistake || '',
            lesson: formatLessonMessage(lesson),
            severity: determineSeverity(lesson),
            impact: lesson.impact || 'Medium',
            anti_pattern: lesson.mistake || '',
            correct_pattern: lesson.correction || '',
            category: 'auto-detected',
            source: 'auto-conversation',
            addedAt: new Date().toISOString(),
            hitCount: 0,
            appliedCount: 0,
            status: 'active',
            changelog: []
        };
    } else {
        entry = {
            id: nextId,
            version: 1,
            improvement: formatLessonMessage(lesson),
            benefit: lesson.impact || 'Better code quality',
            pattern: lesson.correction || '',
            when_to_use: 'General development',
            category: 'auto-detected',
            source: 'auto-conversation',
            addedAt: new Date().toISOString(),
            hitCount: 0,
            appliedCount: 0,
            status: 'active',
            changelog: []
        };
    }

    // Add to data
    if (!data[fileKey]) data[fileKey] = [];
    data[fileKey].push(entry);

    // Save
    fs.mkdirSync(path.dirname(targetFile), { recursive: true });
    fs.writeFileSync(targetFile, yaml.dump(data, { noRefs: true }), 'utf-8');

    // Step 5: Track event and check threshold
    incrementEvent(category);
    const thresholdReached = checkThreshold();

    let thresholdMsg = '';
    if (thresholdReached) {
        thresholdMsg = '\n⚡ Self-improve threshold reached! Run: node self_improve.js';
    }

    return {
        success: true,
        lesson_id: nextId,
        category,
        confidence: validation.confidence,
        message: entry.lesson || entry.improvement || '',
        file: targetFile,
        trigger: trigger.keyword || 'unknown',
        threshold_reached: thresholdReached,
        threshold_message: thresholdMsg
    };
}

async function main() {
    const args = process.argv.slice(2);

    // Parse arguments
    const msgIdx = args.indexOf('--message');
    const ctxIdx = args.indexOf('--context');
    const useAI = args.includes('--ai');

    if (msgIdx === -1 || args[msgIdx + 1] === undefined) {
        console.log('Auto-Learn v4.0 - Integrated Learning Pipeline');
        console.log('\nUsage: node auto_learn_v4.js --message "text" [--context "context"] [--ai]');
        console.log('\nOptions:');
        console.log('  --message, -m  User message with mistake/improvement');
        console.log('  --context, -c  AI context (optional)');
        console.log('  --ai           Use AI extraction (requires GEMINI_API_KEY)');
        return;
    }

    const message = args[msgIdx + 1] || args[args.indexOf('-m') + 1];
    const context = ctxIdx !== -1 ? args[ctxIdx + 1] || '' : '';

    // Run auto-learn
    const result = await autoLearnV4(message, context, useAI);

    if (result.success) {
        console.log(`\n✅ Learned: ${result.lesson_id} (${result.category.toUpperCase()})`);
        console.log(`   Message: ${result.message}`);
        console.log(`   Confidence: ${Math.round(result.confidence * 100)}%`);
        console.log(`   File: ${result.file}`);
        console.log(`   Trigger: ${result.trigger}`);

        if (result.threshold_message) {
            console.log(result.threshold_message);
        }
    } else {
        console.log(`\n❌ Failed: ${result.error || 'Unknown error'}`);
        if (result.confidence !== undefined) {
            console.log(`   Confidence: ${result.confidence}%`);
        }
    }
}

if (process.argv[1] === __filename) {
    main();
}
