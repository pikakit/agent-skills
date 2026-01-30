#!/usr/bin/env node
/**
 * Mistake Trigger Detection Engine
 * Detects when user indicates a mistake in conversation
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

// Vietnamese trigger words
const VIETNAMESE_TRIGGERS = [
    /\blỗi\b/i,
    /\bsai\b/i,
    /\bhỏng\b/i,
    /\bkhông đúng\b/i,
    /\bsửa lại\b/i,
    /\blỗi nghiêm trọng\b/i,
    /\bbạn làm sai\b/i,
    /\bđây là lỗi\b/i,
    /\bkhông phải vậy\b/i,
    /\brevert\b/i,
    /\brollback\b/i
];

// English trigger words
const ENGLISH_TRIGGERS = [
    /\bmistake\b/i,
    /\bwrong\b/i,
    /\bincorrect\b/i,
    /\bfix this\b/i,
    /\byou broke\b/i,
    /\bthat's wrong\b/i,
    /\bnot right\b/i,
    /\bbroke\b/i,
    /\bbroken\b/i
];

// Negative sentiment patterns
const NEGATIVE_PATTERNS = [
    /why did you/i,
    /should not have/i,
    /don't do that/i,
    /never do/i,
    /stop doing/i
];

/**
 * Calculate confidence score (0-100) that this is a mistake indication
 */
function calculateConfidence(message, triggersFound) {
    let confidence = 0;

    // Base score from trigger count
    confidence += Math.min(triggersFound.length * 25, 50);

    // High confidence triggers
    const highConf = ['lỗi nghiêm trọng', 'you broke', "that's wrong", 'mistake'];
    if (highConf.some(t => message.toLowerCase().includes(t))) {
        confidence += 30;
    }

    // Negative sentiment
    if (NEGATIVE_PATTERNS.some(p => p.test(message))) {
        confidence += 15;
    }

    // Exclamation marks (frustration indicator)
    if ((message.match(/!/g) || []).length >= 2) {
        confidence += 5;
    }

    return Math.min(confidence, 100);
}

/**
 * Detect if user is indicating a mistake
 */
export function detectMistakeTrigger(userMessage, aiContext = '') {
    const msgLower = userMessage.toLowerCase();
    const triggersFound = [];

    // Check Vietnamese triggers
    for (const trigger of VIETNAMESE_TRIGGERS) {
        if (trigger.test(msgLower)) {
            triggersFound.push(trigger.source);
        }
    }

    // Check English triggers
    for (const trigger of ENGLISH_TRIGGERS) {
        if (trigger.test(msgLower)) {
            triggersFound.push(trigger.source);
        }
    }

    const detected = triggersFound.length > 0;
    const confidence = detected ? calculateConfidence(userMessage, triggersFound) : 0;

    // Determine mistake type
    let mistakeType = 'unknown';
    if (/\bfile\b|\bxóa\b|\bdelete\b/i.test(msgLower)) {
        mistakeType = 'file-safety';
    } else if (/\bcode\b|\bfunction\b|\bimport\b/i.test(msgLower)) {
        mistakeType = 'code-quality';
    } else if (/\bESC\b|\bmenu\b|\bnavigation\b/i.test(msgLower)) {
        mistakeType = 'user-experience';
    }

    return {
        detected,
        confidence,
        triggers: triggersFound,
        keyword: triggersFound[0] || null,
        context: {
            mistake_type: mistakeType,
            user_msg: userMessage.slice(0, 200),
            ai_context: aiContext ? aiContext.slice(0, 200) : ''
        }
    };
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--test')) {
        const testCases = [
            'Đây là lỗi nghiêm trọng',
            'This is a mistake',
            'Why did you delete the file?',
            'The menu is broken',
            'Everything works fine'
        ];

        console.log('Running test cases...');
        for (const msg of testCases) {
            const result = detectMistakeTrigger(msg);
            console.log(`\nMessage: ${msg}`);
            console.log(`Result: ${JSON.stringify(result, null, 2)}`);
        }
    } else {
        const msgIdx = args.indexOf('--message');
        const ctxIdx = args.indexOf('--context');

        if (msgIdx !== -1 && args[msgIdx + 1]) {
            const message = args[msgIdx + 1];
            const context = ctxIdx !== -1 ? args[ctxIdx + 1] || '' : '';
            const result = detectMistakeTrigger(message, context);
            console.log(JSON.stringify(result, null, 2));
        } else {
            console.log('Usage: node detect_triggers.js --message "text" [--context "context"]');
            console.log('       node detect_triggers.js --test');
        }
    }
}

if (process.argv[1] === __filename) {
    main();
}
