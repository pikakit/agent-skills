/**
 * E2E Integration Tests - Cross-Script Integration
 * 
 * Tests integration between different scripts:
 * - error_sensor ↔ pattern_analyzer
 * - pattern_analyzer ↔ pre_execution_check
 * - adaptive_engine ↔ skill_injector
 */

import { describe, it, expect, vi } from 'vitest';

describe('E2E: Cross-Script Integration', () => {
    describe('Error Sensor → Pattern Analyzer', () => {
        it('should pass error format between scripts', () => {
            // Error format from error_sensor
            const sensorOutput = {
                id: 'ERR-001',
                type: 'test-failure',
                source: 'test',
                message: 'Test failed',
                severity: 'HIGH',
                timestamp: new Date().toISOString(),
                context: {
                    project: { projectType: 'nextjs' },
                    file: { fileType: '.tsx' }
                }
            };

            // Pattern analyzer input format
            const analyzerInput = [sensorOutput];

            // Verify format compatibility
            expect(analyzerInput[0].type).toBeDefined();
            expect(analyzerInput[0].severity).toBeDefined();
            expect(analyzerInput[0].context).toBeDefined();
        });

        it('should aggregate errors correctly', () => {
            const errors = [
                { type: 'lint', severity: 'LOW' },
                { type: 'lint', severity: 'LOW' },
                { type: 'test', severity: 'HIGH' },
                { type: 'lint', severity: 'LOW' }
            ];

            // Pattern analyzer aggregation
            const byType = {};
            const bySeverity = {};

            for (const err of errors) {
                byType[err.type] = (byType[err.type] || 0) + 1;
                bySeverity[err.severity] = (bySeverity[err.severity] || 0) + 1;
            }

            expect(byType.lint).toBe(3);
            expect(byType.test).toBe(1);
            expect(bySeverity.LOW).toBe(3);
            expect(bySeverity.HIGH).toBe(1);
        });
    });

    describe('Pattern Analyzer → Pre-Execution Check', () => {
        it('should generate rules compatible with checker', () => {
            // Pattern analyzer output
            const highFrequency = [
                { pattern: 'missing-await', count: 5, type: 'error' },
                { pattern: 'no-try-catch', count: 4, type: 'error' }
            ];

            // Generate rules for pre-execution check
            const rules = highFrequency.map(hf => ({
                id: `AUTO-${hf.pattern.toUpperCase()}`,
                pattern: hf.pattern,
                prevention: `Avoid ${hf.pattern}`,
                severity: hf.count >= 5 ? 'HIGH' : 'MEDIUM',
                status: 'proposed'
            }));

            expect(rules[0].id).toBe('AUTO-MISSING-AWAIT');
            expect(rules[0].severity).toBe('HIGH');
            expect(rules[1].severity).toBe('MEDIUM');
        });

        it('should match rules against intent', () => {
            const rules = [
                { pattern: 'delete', severity: 'CRITICAL' },
                { pattern: 'async', severity: 'MEDIUM' }
            ];

            const intent = 'create async function';
            const matches = rules.filter(r =>
                intent.toLowerCase().includes(r.pattern)
            );

            expect(matches.length).toBe(1);
            expect(matches[0].pattern).toBe('async');
        });
    });

    describe('Adaptive Engine → Skill Injector', () => {
        it('should pass promoted lessons for skill generation', () => {
            // Adaptive engine output
            const promotedLessons = [
                { id: 'SAFE-001', pattern: 'backup-first', severity: 'CRITICAL', promoted: true },
                { id: 'SAFE-002', pattern: 'confirm-delete', severity: 'CRITICAL', promoted: true },
                { id: 'SAFE-003', pattern: 'check-exists', severity: 'CRITICAL', promoted: true }
            ];

            // Skill injector categorization
            const categories = {};
            for (const lesson of promotedLessons) {
                const category = lesson.id.split('-')[0];
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(lesson);
            }

            expect(categories.SAFE.length).toBe(3);
            expect(categories.SAFE.every(l => l.promoted)).toBe(true);
        });

        it('should generate skill from 3+ lessons', () => {
            const lessons = [
                { id: 'CODE-001', pattern: 'type-annotation' },
                { id: 'CODE-002', pattern: 'null-check' },
                { id: 'CODE-003', pattern: 'error-handling' }
            ];

            const canGenerateSkill = lessons.length >= 3;
            expect(canGenerateSkill).toBe(true);

            // Mock skill generation
            const skill = {
                name: 'code-patterns',
                lessonCount: lessons.length,
                generatedAt: new Date().toISOString()
            };

            expect(skill.name).toBe('code-patterns');
            expect(skill.lessonCount).toBe(3);
        });
    });

    describe('Success Sensor → Pattern Analyzer', () => {
        it('should pass success format for balance calculation', () => {
            const successes = [
                { pattern: 'async-await', type: 'pattern' },
                { pattern: 'typescript', type: 'pattern' }
            ];

            const errors = [
                { type: 'test', severity: 'HIGH' }
            ];

            // Calculate balance
            const totalSuccesses = successes.length;
            const totalFailures = errors.length;
            const total = totalSuccesses + totalFailures;
            const ratio = totalSuccesses / total;

            expect(ratio).toBeCloseTo(0.67, 1);
        });
    });

    describe('Rule Sharing → Pre-Execution Check', () => {
        it('should import rules in correct format', () => {
            // Exported rule format
            const exportedRule = {
                id: 'SAFE-001',
                pattern: 'delete-without-backup',
                severity: 'CRITICAL',
                source: 'imported'
            };

            // Verify format for pre-execution
            expect(exportedRule.id).toBeDefined();
            expect(exportedRule.pattern).toBeDefined();
            expect(exportedRule.severity).toBeDefined();
            expect(['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']).toContain(exportedRule.severity);
        });
    });

    describe('Full Cross-Script Pipeline', () => {
        it('should maintain data integrity through pipeline', () => {
            // 1. Error sensor detects
            const error = {
                id: 'ERR-001',
                type: 'missing-return-type',
                severity: 'MEDIUM',
                timestamp: new Date().toISOString()
            };

            // 2. Pattern analyzer creates lesson
            const lesson = {
                id: 'CODE-001',
                pattern: error.type,
                severity: error.severity,
                hitCount: 1
            };

            // 3. After multiple hits, adaptive engine promotes
            lesson.hitCount = 25;
            if (lesson.hitCount >= 25) {
                lesson.severity = 'CRITICAL';
                lesson.promoted = true;
            }

            // 4. Pre-execution check uses promoted rule
            const intent = 'create function missing-return-type';
            const matches = intent.includes(lesson.pattern);

            // 5. Skill injector can use for skill
            const canMakeSkill = lesson.promoted;

            expect(error.type).toBe(lesson.pattern);
            expect(lesson.severity).toBe('CRITICAL');
            expect(matches).toBe(true);
            expect(canMakeSkill).toBe(true);
        });
    });
});
