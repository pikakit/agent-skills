#!/usr/bin/env node
/**
 * Lesson Extraction Engine
 * Converts mistake context into structured lesson entries
 */

import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';
import { fileURLToPath } from 'url';
import { getConfiguredGenai } from './api_key_resolver.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(__dirname, '..', '.env') });

/**
 * Use Gemini API to extract mistake/correction/impact from conversation
 */
export async function extractLessonWithAI(userMessage, aiContext = '', mistakeTrigger = null) {
    const genai = await getConfiguredGenai(false);
    if (!genai) {
        throw new Error(
            'No API key found. Options:\n' +
            '1. Agent auto-detects: Set GEMINI_API_KEY in your terminal\n' +
            '2. Project-specific: Create .env file with GEMINI_API_KEY\n' +
            '3. Get free key at: https://aistudio.google.com/app/apikey'
        );
    }

    const model = genai.getGenerativeModel({ model: 'gemini-pro' });

    // Build context info
    let triggerInfo = '';
    if (mistakeTrigger && mistakeTrigger.triggers && mistakeTrigger.triggers.length > 0) {
        triggerInfo = `\nTrigger keywords detected: ${mistakeTrigger.triggers.join(', ')}`;
    }

    const prompt = `Analyze this conversation where a user is indicating a mistake or error:

USER MESSAGE: ${userMessage}
AI CONTEXT (what AI did before): ${aiContext || 'Not provided'}${triggerInfo}

Extract the following information and respond ONLY with valid JSON (no markdown):

1. MISTAKE: What went wrong? What did the AI do incorrectly? (1 concise sentence)
2. CORRECTION: What should be done instead? The correct approach. (1 concise sentence)
3. IMPACT: What was the negative effect or consequence? (1 concise sentence)
4. CATEGORY: Choose ONE: file-safety, code-quality, architecture, user-experience, communication

Format (JSON only, no markdown blocks):
{
    "mistake": "...",
    "correction": "...",
    "impact": "...",
    "category": "..."
}`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let text = response.text().trim();

    // Clean up markdown code blocks if present
    if (text.startsWith('```')) {
        text = text.replace(/^```(?:json)?\s*/, '').replace(/\s*```$/, '').trim();
    }

    // Parse JSON
    let extracted;
    try {
        extracted = JSON.parse(text);
    } catch (e) {
        throw new Error(`Failed to parse Gemini response as JSON: ${e.message}\nResponse: ${text}`);
    }

    // Validate required fields
    const required = ['mistake', 'correction', 'impact'];
    for (const field of required) {
        if (!extracted[field]) {
            throw new Error(`Missing required field: ${field}`);
        }
    }

    return {
        mistake: extracted.mistake,
        correction: extracted.correction,
        impact: extracted.impact,
        mistake_type: extracted.category || 'code-quality',
        confidence: 0.85
    };
}

/**
 * Extract a searchable pattern from mistake description
 */
export function extractPattern(mistakeContext) {
    const mistakeDesc = (mistakeContext.mistake || '').toLowerCase();

    const patterns = {
        'import': /import.*from.*['"](\.\/|\.\.\/)/,
        'customselect': /customSelect/,
        'recursive': /function\s+\w+Menu.*\{[\s\S]*\1\(/,
        'null check': /p\.select.*===\s*(null|undefined)/,
        'delete': /(rm|unlink|delete|fs\.unlink)/,
        'overwrite': /overwrite|replace.*file/
    };

    for (const [keyword, pattern] of Object.entries(patterns)) {
        if (mistakeDesc.includes(keyword)) {
            return pattern.source;
        }
    }

    // Fallback: use first significant word
    const words = mistakeDesc.match(/\b\w{4,}\b/g) || [];
    return words[0] || 'unknown';
}

/**
 * Determine severity level based on impact
 */
export function determineSeverity(impact, mistakeType) {
    const highImpactKeywords = [
        'data loss', 'broke', 'crash', 'không hoạt động',
        'stuck', 'blocked', 'critical', 'nghiêm trọng'
    ];

    const impactLower = impact.toLowerCase();

    if (highImpactKeywords.some(kw => impactLower.includes(kw))) {
        return 'ERROR';
    }

    if (['file-safety', 'security'].includes(mistakeType)) {
        return 'ERROR';
    }

    return 'WARNING';
}

/**
 * Categorize the lesson
 */
export function determineCategory(mistakeType, mistakeDesc) {
    const descLower = mistakeDesc.toLowerCase();

    if (['file', 'delete', 'overwrite'].some(kw => descLower.includes(kw))) {
        return 'file-safety';
    } else if (['import', 'code', 'function'].some(kw => descLower.includes(kw))) {
        return 'code-quality';
    } else if (['recursive', 'loop', 'design'].some(kw => descLower.includes(kw))) {
        return 'architecture';
    } else if (['esc', 'menu', 'navigation'].some(kw => descLower.includes(kw))) {
        return 'user-experience';
    } else if (['brand', 'naming'].some(kw => descLower.includes(kw))) {
        return 'branding';
    }

    return mistakeType !== 'unknown' ? mistakeType : 'code-quality';
}

/**
 * Extract a complete lesson from mistake context
 */
export function extractLesson(context) {
    const mistake = context.mistake || 'Unknown mistake';
    const correction = context.correction || 'Unknown correction';
    const impact = context.impact || 'Minor impact';
    const mistakeType = context.mistake_type || 'unknown';

    const pattern = extractPattern(context);

    let message = `${correction.trim()}. AVOID: ${mistake.trim()}`;
    if (message.length > 150) {
        message = correction.trim().slice(0, 147) + '...';
    }

    const severity = determineSeverity(impact, mistakeType);
    const category = determineCategory(mistakeType, mistake);

    const lesson = {
        pattern,
        message,
        severity,
        category,
        source: 'auto-conversation',
        hitCount: 0,
        lastHit: null,
        autoEscalated: false,
        addedAt: new Date().toISOString()
    };

    if (category === 'code-quality') {
        lesson.excludePaths = ['*.test.js', '*.spec.js'];
    }

    return lesson;
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--test')) {
        const testContexts = [
            {
                mistake: 'Used customSelect instead of p.select',
                correction: 'Always use p.select() + p.isCancel()',
                impact: 'ESC key navigation broken, menu stuck',
                mistake_type: 'code-quality'
            },
            {
                mistake: 'Recursive menu calls',
                correction: 'Use while(true) loop for menu navigation',
                impact: 'State bugs and memory issues',
                mistake_type: 'architecture'
            }
        ];

        console.log('Running test cases...');
        for (const ctx of testContexts) {
            const lesson = extractLesson(ctx);
            console.log(`\nContext: ${ctx.mistake}`);
            console.log(`Lesson: ${JSON.stringify(lesson, null, 2)}`);
        }
    } else {
        const ctxIdx = args.indexOf('--context');
        if (ctxIdx !== -1 && args[ctxIdx + 1]) {
            const context = JSON.parse(args[ctxIdx + 1]);
            const lesson = extractLesson(context);
            console.log(JSON.stringify(lesson, null, 2));
        } else {
            console.log('Usage: node extract_lesson.js --context \'{"mistake":"...","correction":"...","impact":"..."}\'');
            console.log('       node extract_lesson.js --test');
        }
    }
}

if (process.argv[1] === __filename) {
    main();
}
