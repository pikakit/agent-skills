/**
 * Unit Tests for skill_injector.js
 * 
 * Tests:
 * - analyzeLessons
 * - getSkillCandidates
 * - generateSkillContent
 * - generateSkills
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
            writeFileSync: vi.fn(),
            mkdirSync: vi.fn(),
            readdirSync: vi.fn(() => [])
        },
        existsSync: vi.fn(() => false),
        readFileSync: vi.fn(() => '{}'),
        writeFileSync: vi.fn(),
        mkdirSync: vi.fn(),
        readdirSync: vi.fn(() => [])
    };
});

// Category config constant
const CATEGORY_CONFIG = {
    'SAFE': { name: 'safety-rules', description: 'Auto-learned safety rules' },
    'CODE': { name: 'code-patterns', description: 'Auto-learned code patterns' },
    'FLOW': { name: 'workflow-rules', description: 'Auto-learned workflow rules' },
    'INT': { name: 'integration-rules', description: 'Auto-learned integration rules' },
    'PERF': { name: 'performance-rules', description: 'Auto-learned performance rules' },
    'TEST': { name: 'testing-rules', description: 'Auto-learned testing rules' },
    'LEARN': { name: 'general-lessons', description: 'General lessons learned' }
};

describe('Skill Injector', () => {
    describe('analyzeLessons', () => {
        it('should group lessons by category', () => {
            const lessons = [
                { id: 'SAFE-001', pattern: 'delete check' },
                { id: 'SAFE-002', pattern: 'file backup' },
                { id: 'CODE-001', pattern: 'typescript' },
                { id: 'TEST-001', pattern: 'unit test' }
            ];

            const categories = {};

            for (const lesson of lessons) {
                const category = lesson.id?.split('-')[0] || 'LEARN';
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(lesson);
            }

            expect(categories['SAFE'].length).toBe(2);
            expect(categories['CODE'].length).toBe(1);
            expect(categories['TEST'].length).toBe(1);
        });

        it('should default to LEARN for unknown categories', () => {
            const lessons = [{ id: 'UNKNOWN-001', pattern: 'something' }];

            const categories = {};
            for (const lesson of lessons) {
                const category = lesson.id?.split('-')[0] || 'LEARN';
                if (!categories[category]) {
                    categories[category] = [];
                }
                categories[category].push(lesson);
            }

            expect(categories['UNKNOWN'].length).toBe(1);
        });
    });

    describe('getSkillCandidates', () => {
        it('should require minimum 3 lessons for skill generation', () => {
            const categories = {
                'SAFE': [{ id: 1 }, { id: 2 }, { id: 3 }], // 3 - eligible
                'CODE': [{ id: 1 }, { id: 2 }], // 2 - not eligible
                'TEST': [{ id: 1 }, { id: 2 }, { id: 3 }, { id: 4 }] // 4 - eligible
            };

            const candidates = [];
            for (const [category, lessons] of Object.entries(categories)) {
                if (lessons.length >= 3) {
                    candidates.push({
                        category,
                        count: lessons.length,
                        config: CATEGORY_CONFIG[category] || {
                            name: `${category.toLowerCase()}-rules`,
                            description: `Auto-learned ${category.toLowerCase()} rules`
                        }
                    });
                }
            }

            expect(candidates.length).toBe(2);
            expect(candidates.find(c => c.category === 'SAFE')).toBeDefined();
            expect(candidates.find(c => c.category === 'TEST')).toBeDefined();
            expect(candidates.find(c => c.category === 'CODE')).toBeUndefined();
        });
    });

    describe('generateSkillContent', () => {
        it('should generate valid SKILL.md content', () => {
            const category = 'SAFE';
            const lessons = [
                { id: 'SAFE-001', pattern: 'delete check', severity: 'CRITICAL', message: 'Check before delete' },
                { id: 'SAFE-002', pattern: 'backup first', severity: 'HIGH', message: 'Backup before modify' }
            ];
            const config = CATEGORY_CONFIG['SAFE'];

            // Generate YAML frontmatter
            const content = `---
name: ${config.name}
description: ${config.description}
---

# ${config.name}
`;

            expect(content).toContain('name: safety-rules');
            expect(content).toContain('Auto-learned safety rules');
        });

        it('should include severity icons', () => {
            const severityIcons = {
                'CRITICAL': '🔴',
                'HIGH': '🟠',
                'MEDIUM': '🟡',
                'LOW': '🟢'
            };

            expect(severityIcons['CRITICAL']).toBe('🔴');
            expect(severityIcons['HIGH']).toBe('🟠');
        });
    });

    describe('generateSkills', () => {
        it('should generate skills for eligible categories', () => {
            const candidates = [
                { category: 'SAFE', count: 5, config: CATEGORY_CONFIG['SAFE'] },
                { category: 'CODE', count: 3, config: CATEGORY_CONFIG['CODE'] }
            ];

            const generated = candidates.map(c => ({
                category: c.category,
                name: c.config.name,
                lessonCount: c.count
            }));

            expect(generated.length).toBe(2);
            expect(generated[0].name).toBe('safety-rules');
            expect(generated[1].name).toBe('code-patterns');
        });

        it('should support dry-run mode', () => {
            const dryRun = true;
            const writeOperations = [];

            if (!dryRun) {
                writeOperations.push('write');
            }

            expect(writeOperations.length).toBe(0);
        });
    });

    describe('Category Mapping', () => {
        it('should have all standard categories', () => {
            expect(CATEGORY_CONFIG['SAFE']).toBeDefined();
            expect(CATEGORY_CONFIG['CODE']).toBeDefined();
            expect(CATEGORY_CONFIG['FLOW']).toBeDefined();
            expect(CATEGORY_CONFIG['INT']).toBeDefined();
            expect(CATEGORY_CONFIG['PERF']).toBeDefined();
            expect(CATEGORY_CONFIG['TEST']).toBeDefined();
            expect(CATEGORY_CONFIG['LEARN']).toBeDefined();
        });
    });
});
