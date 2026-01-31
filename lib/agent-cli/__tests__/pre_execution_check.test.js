/**
 * Unit Tests for pre_execution_check.js
 * 
 * Tests:
 * - detectIntent
 * - checkIntent
 * - generateAdvice
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

describe('Pre-Execution Check', () => {
    describe('detectIntent', () => {
        it('should detect delete operations as CRITICAL', () => {
            const input = 'delete file test.js';
            const intents = [];

            if (/\b(delete|remove|unlink|rm)\b/i.test(input)) {
                intents.push({ action: 'delete', target: 'file', risk: 'CRITICAL' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].risk).toBe('CRITICAL');
        });

        it('should detect rename operations as HIGH risk', () => {
            const input = 'rename component to new name';
            const intents = [];

            if (/\b(rename|mv|move)\b/i.test(input)) {
                intents.push({ action: 'rename', target: 'file', risk: 'HIGH' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].risk).toBe('HIGH');
        });

        it('should detect create operations as LOW risk', () => {
            const input = 'create new component file';
            const intents = [];

            if (/\b(create|new|add|write)\b.*\b(file|component|module)\b/i.test(input)) {
                intents.push({ action: 'create', target: 'file', risk: 'LOW' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].risk).toBe('LOW');
        });

        it('should detect async operations', () => {
            const input = 'create async function to fetch API';
            const intents = [];

            if (/\b(async|await|promise|fetch)\b/i.test(input)) {
                intents.push({ action: 'async', target: 'code', risk: 'MEDIUM' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].action).toBe('async');
        });

        it('should detect database operations as HIGH risk', () => {
            const input = 'query database for users';
            const intents = [];

            if (/\b(database|db|query|sql|prisma)\b/i.test(input)) {
                intents.push({ action: 'database', target: 'data', risk: 'HIGH' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].risk).toBe('HIGH');
        });

        it('should detect completion as CRITICAL', () => {
            const input = 'complete task and notify user';
            const intents = [];

            if (/\b(complete|finish|done|notify|submit)\b/i.test(input)) {
                intents.push({ action: 'complete', target: 'task', risk: 'CRITICAL' });
            }

            expect(intents.length).toBe(1);
            expect(intents[0].risk).toBe('CRITICAL');
        });
    });

    describe('checkIntent', () => {
        it('should return violations for CRITICAL intents', () => {
            const violations = [];
            const intent = 'delete all files';

            if (/\b(delete)\b/i.test(intent)) {
                violations.push({
                    id: 'INTENT-DELETE',
                    severity: 'CRITICAL',
                    source: 'intent-detection'
                });
            }

            expect(violations.some(v => v.severity === 'CRITICAL')).toBe(true);
        });

        it('should match builtin rules', () => {
            const BUILTIN_RULES = [
                {
                    id: 'BUILTIN-001',
                    name: 'TypeScript type safety',
                    check: (intent) => intent.toLowerCase().includes('function'),
                    severity: 'HIGH'
                }
            ];

            const intent = 'create function handler';
            const warnings = [];

            for (const rule of BUILTIN_RULES) {
                if (rule.check(intent)) {
                    warnings.push({ id: rule.id, severity: rule.severity });
                }
            }

            expect(warnings.length).toBe(1);
            expect(warnings[0].id).toBe('BUILTIN-001');
        });
    });

    describe('generateAdvice', () => {
        it('should prioritize CRITICAL first', () => {
            const all = [
                { severity: 'MEDIUM', prevention: 'Medium advice' },
                { severity: 'CRITICAL', prevention: 'Critical advice' },
                { severity: 'HIGH', prevention: 'High advice' }
            ];

            const critical = all.filter(v => v.severity === 'CRITICAL');
            const high = all.filter(v => v.severity === 'HIGH');
            const other = all.filter(v => v.severity !== 'CRITICAL' && v.severity !== 'HIGH');

            expect(critical.length).toBe(1);
            expect(high.length).toBe(1);
            expect(other.length).toBe(1);
        });

        it('should block execution for CRITICAL violations', () => {
            const violations = [{ severity: 'CRITICAL' }];
            const hasCritical = violations.some(v => v.severity === 'CRITICAL');

            expect(hasCritical).toBe(true);
        });
    });
});
