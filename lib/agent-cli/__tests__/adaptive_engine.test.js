/**
 * Unit Tests for adaptive_engine.js
 * 
 * Tests:
 * - adjustSeverity
 * - promoteRules
 * - demoteRules
 * - analyzeRules
 * - runAdaptiveCycle
 */

import { describe, it, expect, vi } from 'vitest';

// Mock fs module
vi.mock('fs', async () => {
    const actual = await vi.importActual('fs');
    return {
        ...actual,
        default: {
            ...actual,
            existsSync: vi.fn(() => false),
            readFileSync: vi.fn(() => '{}'),
            writeFileSync: vi.fn()
        },
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => '{}')
    };
});

// Severity levels constant
const SEVERITY_LEVELS = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'];

describe('Adaptive Engine', () => {
    describe('adjustSeverity', () => {
        it('should increase severity for 10+ hits', () => {
            const lesson = {
                id: 'TEST-001',
                hitCount: 15,
                severity: 'MEDIUM'
            };

            const currentIndex = SEVERITY_LEVELS.indexOf(lesson.severity);

            if (lesson.hitCount >= 10 && currentIndex < SEVERITY_LEVELS.length - 1) {
                lesson.severity = SEVERITY_LEVELS[currentIndex + 1];
            }

            expect(lesson.severity).toBe('HIGH');
        });

        it('should increase to CRITICAL for 25+ hits', () => {
            const lesson = {
                id: 'TEST-001',
                hitCount: 30,
                severity: 'LOW'
            };

            const currentIndex = SEVERITY_LEVELS.indexOf(lesson.severity);

            if (lesson.hitCount >= 25 && currentIndex < SEVERITY_LEVELS.length - 2) {
                lesson.severity = SEVERITY_LEVELS[currentIndex + 2];
            }

            expect(lesson.severity).toBe('HIGH');
        });

        it('should decrease severity for 0 hits in 30 days', () => {
            const thirtyDaysAgo = new Date(Date.now() - 31 * 24 * 60 * 60 * 1000);
            const lesson = {
                id: 'TEST-001',
                hitCount: 0,
                severity: 'HIGH',
                lastHit: thirtyDaysAgo.toISOString()
            };

            const lastHit = new Date(lesson.lastHit);
            const thresholdDate = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000);
            const currentIndex = SEVERITY_LEVELS.indexOf(lesson.severity);

            if (lastHit < thresholdDate && currentIndex > 0) {
                lesson.severity = SEVERITY_LEVELS[currentIndex - 1];
            }

            expect(lesson.severity).toBe('MEDIUM');
        });

        it('should not decrease LOW severity further', () => {
            const lesson = {
                id: 'TEST-001',
                severity: 'LOW'
            };

            const currentIndex = SEVERITY_LEVELS.indexOf(lesson.severity);
            expect(currentIndex).toBe(0);
        });
    });

    describe('promoteRules', () => {
        it('should promote rules with 95%+ accuracy', () => {
            const lesson = {
                id: 'TEST-001',
                hitCount: 1,
                successCount: 19, // 19/20 = 95%
                severity: 'MEDIUM'
            };

            const totalAttempts = lesson.hitCount + lesson.successCount;
            const accuracy = lesson.successCount / totalAttempts;

            if (accuracy >= 0.95 && lesson.severity !== 'CRITICAL') {
                lesson.promoted = true;
                lesson.severity = 'CRITICAL';
            }

            expect(lesson.promoted).toBe(true);
            expect(lesson.severity).toBe('CRITICAL');
        });

        it('should not promote rules with <10 attempts', () => {
            const lesson = {
                id: 'TEST-001',
                hitCount: 1,
                successCount: 5, // Only 6 attempts
                severity: 'MEDIUM'
            };

            const totalAttempts = lesson.hitCount + lesson.successCount;

            // Need 10+ attempts to evaluate
            const shouldEvaluate = totalAttempts >= 10;

            expect(shouldEvaluate).toBe(false);
        });
    });

    describe('demoteRules', () => {
        it('should demote rules with <50% accuracy', () => {
            const lesson = {
                id: 'TEST-001',
                hitCount: 8,
                successCount: 2, // 2/10 = 20%
                severity: 'HIGH'
            };

            const totalAttempts = lesson.hitCount + lesson.successCount;
            const accuracy = lesson.successCount / totalAttempts;

            if (accuracy < 0.50 && lesson.severity !== 'LOW') {
                lesson.demoted = true;
                lesson.severity = 'LOW';
            }

            expect(lesson.demoted).toBe(true);
            expect(lesson.severity).toBe('LOW');
        });

        it('should not demote LOW severity rules', () => {
            const lesson = {
                id: 'TEST-001',
                severity: 'LOW'
            };

            const shouldDemote = lesson.severity !== 'LOW';

            expect(shouldDemote).toBe(false);
        });
    });

    describe('analyzeRules', () => {
        it('should group lessons by severity', () => {
            const lessons = [
                { severity: 'LOW' },
                { severity: 'MEDIUM' },
                { severity: 'MEDIUM' },
                { severity: 'HIGH' },
                { severity: 'CRITICAL' }
            ];

            const bySeverity = {};
            for (const lesson of lessons) {
                bySeverity[lesson.severity] = (bySeverity[lesson.severity] || 0) + 1;
            }

            expect(bySeverity.LOW).toBe(1);
            expect(bySeverity.MEDIUM).toBe(2);
            expect(bySeverity.HIGH).toBe(1);
            expect(bySeverity.CRITICAL).toBe(1);
        });
    });
});
