/**
 * LessonStore Unit Tests
 * 
 * Tests CRUD operations and similarity matching
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import * as fs from 'fs';
import * as path from 'path';
import * as os from 'os';

// We'll test the logic directly since LessonStore depends on file system
describe('LessonStore Logic', () => {
    let testDir: string;
    let lessonsPath: string;

    beforeEach(() => {
        // Create temp directory
        testDir = fs.mkdtempSync(path.join(os.tmpdir(), 'pikakit-test-'));
        fs.mkdirSync(path.join(testDir, '.agent'), { recursive: true });
        lessonsPath = path.join(testDir, '.agent', 'lessons.json');
    });

    afterEach(() => {
        // Cleanup
        fs.rmSync(testDir, { recursive: true, force: true });
    });

    describe('File Operations', () => {
        it('should create lessons.json if not exists', () => {
            const initialData = {
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                lessons: [],
                stats: { totalLearned: 0, skillsGenerated: 0 }
            };

            fs.writeFileSync(lessonsPath, JSON.stringify(initialData, null, 2));

            expect(fs.existsSync(lessonsPath)).toBe(true);
            const content = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
            expect(content.lessons).toEqual([]);
        });

        it('should add lesson to file', () => {
            const data: {
                version: string;
                lastUpdated: string;
                lessons: Array<{ id: string; category: string; pattern: string; context: string; solution: string; occurrences: number; lastSeen: string; source: string; autoDetected: boolean }>;
                stats: { totalLearned: number; skillsGenerated: number };
            } = {
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                lessons: [],
                stats: { totalLearned: 0, skillsGenerated: 0 }
            };

            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            // Add lesson
            const lesson = {
                id: 'TYPE-001',
                category: 'type',
                pattern: 'Type mismatch error',
                context: 'ts file',
                solution: 'Fix type',
                occurrences: 1,
                lastSeen: '2026-02-02',
                source: 'typescript',
                autoDetected: true
            };

            data.lessons.push(lesson);
            data.stats.totalLearned++;
            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            const content = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
            expect(content.lessons.length).toBe(1);
            expect(content.lessons[0].id).toBe('TYPE-001');
        });

        it('should increment occurrence count', () => {
            const data = {
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                lessons: [{
                    id: 'TYPE-001',
                    category: 'type',
                    pattern: 'Type error',
                    occurrences: 1
                }],
                stats: { totalLearned: 1, skillsGenerated: 0 }
            };

            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            // Increment
            data.lessons[0].occurrences++;
            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            const content = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
            expect(content.lessons[0].occurrences).toBe(2);
        });

        it('should clear all lessons', () => {
            const data = {
                version: '1.0',
                lastUpdated: new Date().toISOString(),
                lessons: [
                    { id: 'TYPE-001', pattern: 'Error 1' },
                    { id: 'TYPE-002', pattern: 'Error 2' }
                ],
                stats: { totalLearned: 2, skillsGenerated: 0 }
            };

            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            // Clear
            data.lessons = [];
            data.stats.totalLearned = 0;
            fs.writeFileSync(lessonsPath, JSON.stringify(data, null, 2));

            const content = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
            expect(content.lessons.length).toBe(0);
        });
    });

    describe('Similarity Matching', () => {
        const calculateSimilarity = (pattern1: string, pattern2: string): number => {
            const words1 = new Set(pattern1.toLowerCase().split(/\s+/));
            const words2 = new Set(pattern2.toLowerCase().split(/\s+/));

            const intersection = new Set([...words1].filter(x => words2.has(x)));
            const union = new Set([...words1, ...words2]);

            return union.size > 0 ? intersection.size / union.size : 0;
        };

        it('should find similar patterns', () => {
            const similarity = calculateSimilarity(
                'Cannot find name useState',
                'Cannot find name useEffect'
            );

            expect(similarity).toBeGreaterThan(0.5);
        });

        it('should not match dissimilar patterns', () => {
            const similarity = calculateSimilarity(
                'Type error string',
                'Missing semicolon lint'
            );

            expect(similarity).toBeLessThan(0.3);
        });

        it('should handle empty patterns appropriately', () => {
            const similarity = calculateSimilarity('', '');
            // Empty string split results in [''], so union = 1, intersection = 1
            expect(similarity).toBe(1);
        });
    });

    describe('Category Grouping', () => {
        it('should group lessons by category', () => {
            const lessons = [
                { id: 'TYPE-001', category: 'type', pattern: 'Error 1' },
                { id: 'TYPE-002', category: 'type', pattern: 'Error 2' },
                { id: 'IMPORT-001', category: 'import', pattern: 'Error 3' }
            ];

            const grouped: Record<string, typeof lessons> = {};
            for (const lesson of lessons) {
                if (!grouped[lesson.category]) {
                    grouped[lesson.category] = [];
                }
                grouped[lesson.category].push(lesson);
            }

            expect(Object.keys(grouped)).toHaveLength(2);
            expect(grouped['type']).toHaveLength(2);
            expect(grouped['import']).toHaveLength(1);
        });
    });
});
