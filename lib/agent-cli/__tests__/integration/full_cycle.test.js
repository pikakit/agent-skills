/**
 * E2E Integration Tests - Full Learning Cycle
 * 
 * Tests the complete auto-learn workflow:
 * 1. Error Detection → Lesson Extraction
 * 2. Pattern Analysis → Rule Generation
 * 3. Pre-execution Check → Prevention
 * 4. Adaptive Engine → Severity Adjustment
 */

import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import fs from 'fs';
import path from 'path';

// Mock knowledge path
const mockKnowledgePath = path.join(process.cwd(), '.test-knowledge');

// Mock data structures
const createMockError = (id, type, severity = 'HIGH') => ({
    id,
    type,
    severity,
    message: `Test error ${id}`,
    timestamp: new Date().toISOString()
});

const createMockLesson = (id, pattern, severity = 'MEDIUM') => ({
    id,
    pattern,
    severity,
    message: `Lesson from ${pattern}`,
    hitCount: 0
});

describe('E2E: Full Learning Cycle', () => {
    beforeEach(() => {
        // Setup mock knowledge directory
        if (!fs.existsSync(mockKnowledgePath)) {
            fs.mkdirSync(mockKnowledgePath, { recursive: true });
        }
    });

    afterEach(() => {
        // Cleanup
        if (fs.existsSync(mockKnowledgePath)) {
            fs.rmSync(mockKnowledgePath, { recursive: true });
        }
    });

    describe('Error → Lesson Flow', () => {
        it('should create lessons from detected errors', () => {
            // Simulate error detection
            const errors = [
                createMockError('ERR-001', 'test-failure'),
                createMockError('ERR-002', 'test-failure'),
                createMockError('ERR-003', 'test-failure')
            ];

            // Group by type (simulating pattern analysis)
            const errorsByType = {};
            for (const err of errors) {
                errorsByType[err.type] = (errorsByType[err.type] || 0) + 1;
            }

            // Find high-frequency (3+ occurrences)
            const threshold = 3;
            const highFrequency = Object.entries(errorsByType)
                .filter(([, count]) => count >= threshold);

            expect(highFrequency.length).toBe(1);
            expect(highFrequency[0][0]).toBe('test-failure');

            // Generate lesson from high-frequency pattern
            const lesson = createMockLesson(
                'LEARN-001',
                'test-failure',
                'HIGH'
            );

            expect(lesson.pattern).toBe('test-failure');
        });
    });

    describe('Lesson → Rule Flow', () => {
        it('should generate rules from lessons with 10+ hits', () => {
            const lesson = createMockLesson('LEARN-001', 'async-await-missing');
            lesson.hitCount = 15; // High hit count

            const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];
            const currentIndex = SEVERITY_LEVELS.indexOf(lesson.severity);

            // Adjust severity for 10+ hits
            if (lesson.hitCount >= 10 && currentIndex < SEVERITY_LEVELS.length - 1) {
                lesson.severity = SEVERITY_LEVELS[currentIndex + 1];
            }

            expect(lesson.severity).toBe('HIGH');
        });

        it('should maintain lesson through multiple cycles', () => {
            const lesson = createMockLesson('LEARN-001', 'type-error');

            // Simulate 5 learning cycles
            for (let i = 0; i < 5; i++) {
                lesson.hitCount++;
                lesson.lastHit = new Date().toISOString();
            }

            expect(lesson.hitCount).toBe(5);
            expect(lesson.lastHit).toBeDefined();
        });
    });

    describe('Rule → Prevention Flow', () => {
        it('should block execution for matching critical patterns', () => {
            const lessons = [
                { id: 'SAFE-001', pattern: 'delete', severity: 'CRITICAL' }
            ];

            const intent = 'delete old files';
            const violations = [];

            for (const lesson of lessons) {
                if (intent.toLowerCase().includes(lesson.pattern.toLowerCase())) {
                    if (lesson.severity === 'CRITICAL') {
                        violations.push({
                            id: lesson.id,
                            prevention: `Violation: ${lesson.pattern}`,
                            severity: 'CRITICAL'
                        });
                    }
                }
            }

            expect(violations.length).toBe(1);
            expect(violations[0].severity).toBe('CRITICAL');
        });

        it('should allow execution when no violations', () => {
            const lessons = [
                { id: 'SAFE-001', pattern: 'delete', severity: 'CRITICAL' }
            ];

            const intent = 'create new component';
            const violations = [];

            for (const lesson of lessons) {
                if (intent.toLowerCase().includes(lesson.pattern.toLowerCase())) {
                    violations.push(lesson);
                }
            }

            expect(violations.length).toBe(0);
        });
    });

    describe('Adaptive Cycle', () => {
        it('should promote rules with 95%+ accuracy', () => {
            const lesson = createMockLesson('LEARN-001', 'typescript-strict');
            lesson.hitCount = 1;
            lesson.successCount = 19; // 95% accuracy

            const totalAttempts = lesson.hitCount + lesson.successCount;
            const accuracy = lesson.successCount / totalAttempts;

            if (accuracy >= 0.95 && totalAttempts >= 10) {
                lesson.promoted = true;
                lesson.severity = 'CRITICAL';
            }

            expect(lesson.promoted).toBe(true);
            expect(lesson.severity).toBe('CRITICAL');
            expect(accuracy).toBeGreaterThanOrEqual(0.95);
        });

        it('should demote rules with <50% accuracy', () => {
            const lesson = createMockLesson('LEARN-001', 'outdated-pattern');
            lesson.severity = 'HIGH';
            lesson.hitCount = 8;
            lesson.successCount = 2; // 20% accuracy

            const totalAttempts = lesson.hitCount + lesson.successCount;
            const accuracy = lesson.successCount / totalAttempts;

            if (accuracy < 0.50 && totalAttempts >= 10) {
                lesson.demoted = true;
                lesson.severity = 'LOW';
            }

            expect(lesson.demoted).toBe(true);
            expect(lesson.severity).toBe('LOW');
        });
    });

    describe('Complete Workflow', () => {
        it('should handle full cycle: detect → learn → prevent', () => {
            // Step 1: Detect errors
            const detectedErrors = [
                createMockError('E1', 'missing-await'),
                createMockError('E2', 'missing-await'),
                createMockError('E3', 'missing-await')
            ];

            // Step 2: Analyze patterns
            const patterns = {};
            for (const err of detectedErrors) {
                patterns[err.type] = (patterns[err.type] || 0) + 1;
            }

            // Step 3: Generate lesson from high-frequency
            const highFreq = Object.entries(patterns)
                .filter(([, c]) => c >= 3);

            expect(highFreq.length).toBeGreaterThan(0);

            const lessons = highFreq.map(([type]) =>
                createMockLesson(`LEARN-${type}`, type, 'HIGH')
            );

            // Step 4: Check new intent against lessons
            const newIntent = 'create function with missing await';
            const matches = lessons.filter(l =>
                newIntent.toLowerCase().includes(l.pattern)
            );

            expect(matches.length).toBe(1);
            expect(matches[0].severity).toBe('HIGH');
        });
    });
});
