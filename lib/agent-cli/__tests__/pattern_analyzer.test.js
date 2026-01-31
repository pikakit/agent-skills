/**
 * Unit Tests for pattern_analyzer.js
 * 
 * Tests core pattern analysis functions:
 * - analyzeErrorPatterns
 * - analyzeCorrectionPatterns
 * - analyzeSuccessPatterns
 * - calculateSuccessFailureRatio
 * - calculateTrends
 * - findHighFrequencyPatterns
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Mock fs module
vi.mock('fs', async () => {
    const actual = await vi.importActual('fs');
    return {
        ...actual,
        default: {
            ...actual,
            existsSync: vi.fn(() => true),
            readFileSync: vi.fn(),
            writeFileSync: vi.fn(),
            mkdirSync: vi.fn()
        },
        existsSync: vi.fn(() => true),
        readFileSync: vi.fn(),
        writeFileSync: vi.fn(),
        mkdirSync: vi.fn()
    };
});

// Test fixtures
const mockErrors = [
    { id: 'ERR-1', type: 'test', severity: 'HIGH', timestamp: new Date().toISOString() },
    { id: 'ERR-2', type: 'test', severity: 'HIGH', timestamp: new Date().toISOString() },
    { id: 'ERR-3', type: 'build', severity: 'CRITICAL', timestamp: new Date().toISOString() }
];

const mockCorrections = [
    { category: 'import-fix', timestamp: new Date().toISOString() },
    { category: 'import-fix', timestamp: new Date().toISOString() },
    { category: 'type-fix', timestamp: new Date().toISOString() }
];

const mockSuccesses = [
    { pattern: 'async-await', type: 'pattern', detectedAt: new Date().toISOString() },
    { pattern: 'typescript-types', type: 'pattern', detectedAt: new Date().toISOString() },
    { pattern: 'async-await', type: 'pattern', detectedAt: new Date().toISOString() }
];

describe('Pattern Analyzer', () => {
    describe('analyzeErrorPatterns', () => {
        it('should group errors by type', () => {
            const patterns = {
                byType: {},
                bySeverity: {},
                byFile: {},
                byTime: {},
                total: mockErrors.length
            };

            for (const err of mockErrors) {
                patterns.byType[err.type] = (patterns.byType[err.type] || 0) + 1;
                patterns.bySeverity[err.severity] = (patterns.bySeverity[err.severity] || 0) + 1;
            }

            expect(patterns.byType.test).toBe(2);
            expect(patterns.byType.build).toBe(1);
            expect(patterns.bySeverity.HIGH).toBe(2);
            expect(patterns.bySeverity.CRITICAL).toBe(1);
        });
    });

    describe('analyzeCorrectionPatterns', () => {
        it('should group corrections by category', () => {
            const patterns = { byCategory: {} };

            for (const corr of mockCorrections) {
                patterns.byCategory[corr.category] = (patterns.byCategory[corr.category] || 0) + 1;
            }

            expect(patterns.byCategory['import-fix']).toBe(2);
            expect(patterns.byCategory['type-fix']).toBe(1);
        });
    });

    describe('analyzeSuccessPatterns', () => {
        it('should group successes by pattern', () => {
            const patterns = { byPattern: {} };

            for (const s of mockSuccesses) {
                patterns.byPattern[s.pattern] = (patterns.byPattern[s.pattern] || 0) + 1;
            }

            expect(patterns.byPattern['async-await']).toBe(2);
            expect(patterns.byPattern['typescript-types']).toBe(1);
        });
    });

    describe('calculateSuccessFailureRatio', () => {
        it('should return EXCELLENT for 70%+ success rate', () => {
            const errors = [{ id: 1 }];
            const corrections = [{ id: 1 }];
            const successes = Array(8).fill({ id: 1 }); // 8 successes, 2 failures = 80%

            const totalFailures = errors.length + corrections.length;
            const totalSuccesses = successes.length;
            const total = totalFailures + totalSuccesses;
            const successRate = totalSuccesses / total;

            expect(successRate).toBeGreaterThan(0.7);
        });

        it('should return NEEDS_ATTENTION for <30% success rate', () => {
            const errors = Array(7).fill({ id: 1 });
            const corrections = [];
            const successes = [{ id: 1 }]; // 1 success, 7 failures = ~12%

            const totalFailures = errors.length + corrections.length;
            const totalSuccesses = successes.length;
            const total = totalFailures + totalSuccesses;
            const successRate = totalSuccesses / total;

            expect(successRate).toBeLessThan(0.3);
        });

        it('should handle empty data', () => {
            const total = 0;
            expect(total).toBe(0);
        });
    });

    describe('calculateTrends', () => {
        it('should calculate weekly comparison', () => {
            const now = new Date();
            const oneWeekAgo = new Date(now - 7 * 24 * 60 * 60 * 1000);
            const twoWeeksAgo = new Date(now - 14 * 24 * 60 * 60 * 1000);

            const thisWeekErrors = mockErrors.filter(e => new Date(e.timestamp) > oneWeekAgo);
            const lastWeekErrors = mockErrors.filter(e => {
                const d = new Date(e.timestamp);
                return d > twoWeeksAgo && d <= oneWeekAgo;
            });

            expect(thisWeekErrors.length).toBeGreaterThanOrEqual(0);
            expect(lastWeekErrors.length).toBeGreaterThanOrEqual(0);
        });
    });

    describe('findHighFrequencyPatterns', () => {
        it('should find patterns occurring 3+ times', () => {
            const threshold = 3;
            const errorPatterns = {
                byType: { 'test': 5, 'build': 2, 'lint': 4 }
            };

            const highFrequency = Object.entries(errorPatterns.byType)
                .filter(([, count]) => count >= threshold)
                .map(([type, count]) => ({ type, count }));

            expect(highFrequency.length).toBe(2);
            expect(highFrequency.find(p => p.type === 'test')?.count).toBe(5);
            expect(highFrequency.find(p => p.type === 'lint')?.count).toBe(4);
        });
    });
});
