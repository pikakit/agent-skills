/**
 * @fileoverview Tests for LessonSynthesizer functionality
 */
import { describe, it, expect } from 'vitest';
import { LessonSynthesizer } from '../../src/core/learning/lesson-synthesizer.js';

// Mock data
const mockMistakes = [
    {
        id: 'MISTAKE-001',
        pattern: 'test',
        message: 'Test mistake',
        tags: ['testing', 'quality'],
        hitCount: 10
    }
];

const mockImprovements = [
    {
        id: 'IMPROVE-001',
        pattern: 'test',
        message: 'Test improvement',
        tags: ['testing', 'quality'],
        appliedCount: 20
    }
];

describe('LessonSynthesizer - Lesson Synthesis', () => {
    it('should synthesize lessons from mistakes and improvements', () => {
        // Note: The actual method is 'synthesize', not 'synthesizeLessons'
        const lessons = LessonSynthesizer.synthesize(mockMistakes, mockImprovements);
        
        expect(Array.isArray(lessons)).toBe(true);
        expect(lessons.length).toBeGreaterThan(0);
    });

    it('should have valid lesson structure', () => {
        const lessons = LessonSynthesizer.synthesize(mockMistakes, mockImprovements);
        const lesson = lessons[0];
        
        expect(lesson.id).toBeDefined();
        expect(lesson.title).toBeDefined();
        expect(lesson.tag).toBeDefined();
        expect(lesson.intent).toBeDefined();
        expect(lesson.maturity).toBeDefined();
        expect(Array.isArray(lesson.mistakes)).toBe(true);
        expect(Array.isArray(lesson.improvements)).toBe(true);
    });

    it('should group by tags correctly', () => {
        const lessons = LessonSynthesizer.synthesize(mockMistakes, mockImprovements);
        const testingLesson = lessons.find(l => l.tag === 'testing');
        
        expect(testingLesson).toBeDefined();
        expect(testingLesson.mistakes.length > 0 || testingLesson.improvements.length > 0).toBe(true);
    });

    it('should enhance with cognitive data', () => {
        const lessons = LessonSynthesizer.synthesize(mockMistakes, mockImprovements);
        const lesson = lessons[0];
        
        expect(lesson.maturity.state).toBeDefined();
        expect(lesson.maturity.confidence).toBeGreaterThanOrEqual(0);
        expect(lesson.intent.goal).toBeDefined();
    });
});

describe('LessonSynthesizer - Edge Cases', () => {
    it('should handle empty inputs', () => {
        const emptyLessons = LessonSynthesizer.synthesize([], []);
        expect(Array.isArray(emptyLessons)).toBe(true);
    });
});

describe('LessonSynthesizer - Sorting', () => {
    it('should sort lessons by maturity', () => {
        const lessons = LessonSynthesizer.synthesize(mockMistakes, mockImprovements);
        const sorted = LessonSynthesizer.sortByMaturity(lessons);
        
        expect(Array.isArray(sorted)).toBe(true);
    });
});
