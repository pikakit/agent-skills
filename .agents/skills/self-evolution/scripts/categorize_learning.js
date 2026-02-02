#!/usr/bin/env node
/**
 * Learning Categorization Algorithm for SelfEvolution v4.0
 * 
 * PURPOSE: Precisely determine if a learning is a MISTAKE or an IMPROVEMENT
 * 
 * PHILOSOPHY:
 * - MISTAKE = Something went WRONG (anti-pattern, error, bug)
 * - IMPROVEMENT = Something can be done BETTER (best practice, optimization)
 */

import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);

/**
 * Categorize a learning as MISTAKE or IMPROVEMENT
 */
export function categorizeLearning(userMessage, aiContext = '', lesson = '') {
    const msgLower = userMessage.toLowerCase();
    const lessonLower = lesson.toLowerCase();
    const combined = `${msgLower} ${lessonLower}`;

    // RULE 1: EXPLICIT MISTAKE INDICATORS
    const mistakeKeywords = [
        // Vietnamese - Error indicators
        'lỗi', 'sai', 'hỏng', 'lỗi nghiêm trọng', 'bug',
        'không đúng', 'sai lầm', 'nhầm', 'vỡ', 'crash',
        // Vietnamese - Fix requests
        'sửa lại', 'fix', 'repair', 'khắc phục',
        // Vietnamese - Negative outcomes
        'bị mất', 'bị xóa', 'bị hư', 'không work', 'không hoạt động',
        'fail', 'failed', 'thất bại', 'không thành công',
        // English - Error indicators
        'error', 'wrong', 'incorrect', 'broken', 'bug',
        'mistake', 'issue', 'problem', 'critical',
        // English - Negative outcomes
        "doesn't work", 'not working', 'failed', 'crash',
        'deleted by accident', 'lost data', 'broke',
        // Anti-patterns
        'never do', "don't use", 'avoid', 'bad practice',
        'anti-pattern', 'code smell', 'tránh', 'đừng bao giờ'
    ];

    for (const keyword of mistakeKeywords) {
        if (combined.includes(keyword)) {
            return 'mistake';
        }
    }

    // RULE 2: EXPLICIT IMPROVEMENT INDICATORS
    const improvementKeywords = [
        // Vietnamese - Better practices
        'tốt hơn', 'nên dùng', 'best practice', 'cải thiện',
        'tối ưu', 'hiệu quả hơn', 'chuẩn hơn', 'professional',
        // Vietnamese - Suggestions
        'khuyên nên', 'đề xuất', 'gợi ý', 'recommendation',
        // English - Better practices
        'better', 'best practice', 'recommended', 'improve',
        'optimize', 'efficient', 'cleaner', 'preferred',
        // English - Positive patterns
        'should use', "it's better to", 'consider using',
        'best to', 'ideal', 'optimal', 'enhancement'
    ];

    for (const keyword of improvementKeywords) {
        if (combined.includes(keyword)) {
            return 'improvement';
        }
    }

    // RULE 3: SEVERITY-BASED CLASSIFICATION
    const highSeverityIndicators = [
        'critical', 'nghiêm trọng', 'severe', 'blocking',
        'data loss', 'mất dữ liệu', 'security', 'vulnerability'
    ];

    for (const indicator of highSeverityIndicators) {
        if (combined.includes(indicator)) {
            return 'mistake';
        }
    }

    // RULE 4: LESSON CONTENT ANALYSIS
    if (lesson) {
        const negativePatterns = [
            /never\s+\w+/,
            /don't\s+\w+/,
            /avoid\s+\w+/,
            /missing\s+\w+/,
            /forgot\s+to/,
            /failed\s+to/
        ];

        for (const pattern of negativePatterns) {
            if (pattern.test(lessonLower)) {
                return 'mistake';
            }
        }

        const positivePatterns = [
            /use\s+\w+\s+instead/,
            /better\s+to\s+\w+/,
            /prefer\s+\w+/,
            /optimize\s+by/,
            /enhance\s+\w+/
        ];

        for (const pattern of positivePatterns) {
            if (pattern.test(lessonLower)) {
                return 'improvement';
            }
        }
    }

    // RULE 5: CONTEXT-BASED HEURISTICS
    const pastTenseIndicators = ['vừa', 'đã', 'bị', 'did', 'was', 'were', 'happened', 'occurred', 'caused'];
    for (const indicator of pastTenseIndicators) {
        if (` ${msgLower} `.includes(` ${indicator} `)) {
            return 'mistake';
        }
    }

    const futureIndicators = ['should', 'could', 'nên', 'có thể', 'would be better', 'sẽ tốt hơn'];
    for (const indicator of futureIndicators) {
        if (` ${msgLower} `.includes(` ${indicator} `)) {
            return 'improvement';
        }
    }

    // DEFAULT: CONSERVATIVE APPROACH
    return 'mistake';
}

/**
 * Validate and explain the categorization
 */
export function validateCategorization(category, userMessage, lesson) {
    const reasons = [];
    let confidence = 0.5;

    const msgLower = userMessage.toLowerCase();
    const lessonLower = lesson ? lesson.toLowerCase() : '';

    if (category === 'mistake') {
        if (['lỗi', 'sai', 'error', 'wrong', 'bug'].some(kw => msgLower.includes(kw))) {
            reasons.push('Explicit error keywords detected');
            confidence = 0.9;
        } else if (['fix', 'sửa', 'repair'].some(kw => msgLower.includes(kw))) {
            reasons.push('Fix request detected');
            confidence = 0.8;
        } else if (['never', "don't", 'avoid'].some(kw => lessonLower.includes(kw))) {
            reasons.push('Anti-pattern language in lesson');
            confidence = 0.85;
        } else {
            reasons.push('Default classification (conservative)');
            confidence = 0.6;
        }
    } else {
        if (['tốt hơn', 'better', 'best practice'].some(kw => msgLower.includes(kw))) {
            reasons.push('Better practice keywords detected');
            confidence = 0.9;
        } else if (['should', 'nên', 'recommend'].some(kw => msgLower.includes(kw))) {
            reasons.push('Recommendation language detected');
            confidence = 0.85;
        } else if (['optimize', 'enhance', 'improve'].some(kw => lessonLower.includes(kw))) {
            reasons.push('Positive improvement language in lesson');
            confidence = 0.8;
        } else {
            reasons.push('Improvement indicators found');
            confidence = 0.7;
        }
    }

    return { category, confidence, reasons };
}

function testCategorization() {
    const testCases = [
        { message: 'Lỗi nghiêm trọng: bạn đã xóa file quan trọng', lesson: 'Never delete files without confirmation', expected: 'mistake' },
        { message: 'This is wrong, you broke the code', lesson: "Don't modify production directly", expected: 'mistake' },
        { message: 'Nên dùng async/await thay vì callbacks', lesson: 'Use async/await for better readability', expected: 'improvement' },
        { message: 'Best practice: use TypeScript instead of JavaScript', lesson: 'TypeScript provides better type safety', expected: 'improvement' },
        { message: 'ESC key không work trong submenu', lesson: 'Missing p.isCancel() check after select', expected: 'mistake' },
        { message: 'Should refactor this for better performance', lesson: 'Use Map instead of Object for lookups', expected: 'improvement' }
    ];

    console.log('🧪 Testing Categorization Algorithm\n');
    console.log('='.repeat(60));

    let passed = 0;
    let failed = 0;

    for (let i = 0; i < testCases.length; i++) {
        const test = testCases[i];
        const result = categorizeLearning(test.message, '', test.lesson);
        const validation = validateCategorization(result, test.message, test.lesson);

        const isCorrect = result === test.expected;
        const status = isCorrect ? '✅' : '❌';

        console.log(`\n${status} Test ${i + 1}:`);
        console.log(`   Message: ${test.message.slice(0, 50)}...`);
        console.log(`   Expected: ${test.expected}`);
        console.log(`   Got: ${result} (confidence: ${Math.round(validation.confidence * 100)}%)`);
        console.log(`   Reasons: ${validation.reasons.join(', ')}`);

        if (isCorrect) passed++;
        else failed++;
    }

    console.log('\n' + '='.repeat(60));
    console.log(`Results: ${passed}/${testCases.length} passed`);

    if (passed === testCases.length) {
        console.log('🎉 All tests passed!');
        return 0;
    } else {
        console.log(`⚠️  ${failed} test(s) failed`);
        return 1;
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--test')) {
        process.exit(testCategorization());
    }

    const msgIdx = args.indexOf('--message');
    const lessonIdx = args.indexOf('--lesson');

    if (msgIdx !== -1 && args[msgIdx + 1]) {
        const message = args[msgIdx + 1];
        const lesson = lessonIdx !== -1 ? args[lessonIdx + 1] || '' : '';

        const category = categorizeLearning(message, '', lesson);
        const validation = validateCategorization(category, message, lesson);

        console.log('\n📊 Categorization Result:');
        console.log(`   Category: ${category.toUpperCase()}`);
        console.log(`   Confidence: ${Math.round(validation.confidence * 100)}%`);
        console.log('   Reasons:');
        for (const reason of validation.reasons) {
            console.log(`     • ${reason}`);
        }
    } else {
        console.log('Usage: node categorize_learning.js --message "text" [--lesson "lesson"]');
        console.log('       node categorize_learning.js --test');
    }
}

if (process.argv[1] === __filename) {
    main();
}
