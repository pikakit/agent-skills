/**
 * @fileoverview Tests for Learning Service functionality
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { LessonRepository } from '../../src/data/repositories/lesson-repository.js';
import { YamlStorage } from '../../src/data/storage/yaml-storage.js';
import { LearningService } from '../../src/services/learning-service.js';
import { KNOWLEDGE_DIR } from '../../lib/config.js';

describe('Learning Service - New Architecture', () => {
    let storage;
    let repository;
    let learningService;

    beforeAll(() => {
        storage = new YamlStorage(KNOWLEDGE_DIR);
        repository = new LessonRepository(storage);
        learningService = new LearningService(repository);
    });

    it('should load cognitive lessons', async () => {
        const lessons = await learningService.getCognitiveLessons();
        
        expect(Array.isArray(lessons)).toBe(true);
        lessons.forEach(lesson => {
            expect(lesson.id).toBeDefined();
            expect(lesson.title).toBeDefined();
            if (lesson.maturity) {
                expect(lesson.maturity.state).toBeDefined();
                expect(typeof lesson.maturity.confidence).toBe('number');
            }
        });
    });

    it('should list legacy lessons', async () => {
        const legacy = await learningService.listLessons();
        
        expect(Array.isArray(legacy)).toBe(true);
    });
});
