/**
 * Golden Test - End-to-End Skill Generation Validation
 * 
 * Tests the complete flow: pattern → generate → validate → promote → registry
 * 
 * @version 1.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Import modules to test
import patternAnalyzer from '../lib/pattern-analyzer.js';
import skillValidator from '../lib/skill-validator.js';
import skillTemplate from '../lib/skill-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// TEST DATA
// ============================================================================

const SAMPLE_PATTERN = {
    id: 'PATTERN-TEST-001',
    pattern: 'async-await-missing-try-catch',
    message: 'Always wrap async/await in try-catch for error handling',
    context: {
        workflow: '/build',
        step: 'code-generation',
        trigger: 'eslint-error',
        outcome: 'success'
    },
    occurrences: 5,
    successCount: 4,
    failureCount: 1,
    createdAt: new Date().toISOString(),
    source: 'detection'
};

// ============================================================================
// TEST HELPERS
// ============================================================================

function log(msg, type = 'info') {
    const icons = {
        info: 'ℹ️',
        pass: '✅',
        fail: '❌',
        warn: '⚠️',
        step: '📍'
    };
    console.log(`${icons[type]} ${msg}`);
}

function assert(condition, message) {
    if (!condition) {
        throw new Error(`Assertion failed: ${message}`);
    }
}

// ============================================================================
// TESTS
// ============================================================================

async function runGoldenTest() {
    console.log('\n' + '═'.repeat(60));
    console.log('  GOLDEN TEST - Skill Generator End-to-End');
    console.log('═'.repeat(60) + '\n');

    const results = {
        passed: 0,
        failed: 0,
        tests: []
    };

    try {
        // ────────────────────────────────────────────────────────────────────
        // Step 1: Anti-Pattern Detection
        // ────────────────────────────────────────────────────────────────────
        log('Step 1: Test Anti-Pattern Detection', 'step');

        // Test good pattern (should pass)
        const goodPatternCheck = patternAnalyzer.isAntiPattern(SAMPLE_PATTERN);
        assert(!goodPatternCheck.isAntiPattern, 'Good pattern should not be anti-pattern');
        log('Good pattern correctly identified', 'pass');
        results.passed++;

        // Test bad pattern (should fail)
        const badPattern = { ...SAMPLE_PATTERN, occurrences: 1, successCount: 0, failureCount: 1 };
        const badPatternCheck = patternAnalyzer.isAntiPattern(badPattern);
        assert(badPatternCheck.isAntiPattern, 'Bad pattern should be identified as anti-pattern');
        log('Anti-pattern correctly rejected', 'pass');
        results.passed++;

        // ────────────────────────────────────────────────────────────────────
        // Step 2: Skill Generation
        // ────────────────────────────────────────────────────────────────────
        log('Step 2: Test Skill Generation', 'step');

        const skill = skillTemplate.generateSkillFromPattern(SAMPLE_PATTERN);
        assert(skill.id, 'Generated skill must have ID');
        assert(skill.name, 'Generated skill must have name');
        assert(skill.description, 'Generated skill must have description');
        log(`Generated skill: ${skill.name}`, 'pass');
        results.passed++;

        // ────────────────────────────────────────────────────────────────────
        // Step 3: Skill Validation
        // ────────────────────────────────────────────────────────────────────
        log('Step 3: Test Skill Validation', 'step');

        // Create temp skill for validation
        const tempDir = path.join(__dirname, '..', '..', 'temp-test-skill');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }

        // Create skill files
        const createResult = skillTemplate.createSkillFiles(skill, path.dirname(tempDir));
        assert(createResult.success, 'Skill files should be created');
        log('Skill files created successfully', 'pass');
        results.passed++;

        // Validate the created skill
        const skillPath = createResult.path;
        const validation = skillValidator.validateSkillFromPath(skillPath);

        log(`Validation score: ${validation.score}%`, validation.score >= 80 ? 'pass' : 'warn');

        // Log validation details
        for (const check of validation.checks || []) {
            log(`  ${check.name}: ${check.passed ? 'PASS' : 'FAIL'}`, check.passed ? 'pass' : 'fail');
        }

        // Per implementation plan: ≥80% generated skills pass validation tests
        if (validation.score >= 80) {
            results.passed++;
            log('Validation meets ≥80% threshold', 'pass');
        } else {
            results.failed++;
            log(`Validation below 80% threshold: ${validation.score}%`, 'fail');
        }

        // ────────────────────────────────────────────────────────────────────
        // Step 4: Registry Entry
        // ────────────────────────────────────────────────────────────────────
        log('Step 4: Test Registry Entry Creation', 'step');

        const registryEntry = skillTemplate.createRegistryEntry(skill);
        assert(registryEntry.id === skill.id, 'Registry entry should have correct ID');
        assert(registryEntry.status === 'candidate', 'New skills should be candidates');
        assert(registryEntry.owner === 'skill-generator', 'Owner should be skill-generator');
        log('Registry entry created correctly', 'pass');
        results.passed++;

        // ────────────────────────────────────────────────────────────────────
        // Step 5: Clean up
        // ────────────────────────────────────────────────────────────────────
        log('Step 5: Cleanup', 'step');

        // Remove temp skill
        if (fs.existsSync(skillPath)) {
            fs.rmSync(skillPath, { recursive: true, force: true });
        }
        log('Temp files cleaned up', 'pass');
        results.passed++;

    } catch (error) {
        log(`Test error: ${error.message}`, 'fail');
        results.failed++;
        results.tests.push({ name: 'Test execution', error: error.message });
    }

    // ────────────────────────────────────────────────────────────────────────
    // Summary
    // ────────────────────────────────────────────────────────────────────────
    console.log('\n' + '─'.repeat(60));
    console.log(`  Results: ${results.passed} passed, ${results.failed} failed`);
    console.log('─'.repeat(60));

    if (results.failed === 0) {
        console.log('\n✅ GOLDEN TEST PASSED\n');
        process.exit(0);
    } else {
        console.log('\n❌ GOLDEN TEST FAILED\n');
        process.exit(1);
    }
}

// ============================================================================
// RUN
// ============================================================================

runGoldenTest().catch(err => {
    console.error('Fatal error:', err);
    process.exit(1);
});
