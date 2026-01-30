/**
 * @fileoverview Tests for Gemini Export functionality
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { LessonRepository } from '../../src/data/repositories/lesson-repository.js';
import { YamlStorage } from '../../src/data/storage/yaml-storage.js';
import { LearningService } from '../../src/services/learning-service.js';
import { SkillFormatter } from '../../src/presentation/formatters/skill-formatter.js';
import { ExportService } from '../../src/services/export-service.js';
import { KNOWLEDGE_DIR } from '../../lib/config.js';
import path from 'path';

describe('Gemini Export - Export Service', () => {
    let storage;
    let repository;
    let learningService;
    let skillFormatter;
    let exportService;

    beforeAll(() => {
        storage = new YamlStorage(KNOWLEDGE_DIR);
        repository = new LessonRepository(storage);
        learningService = new LearningService(repository);
        skillFormatter = new SkillFormatter();
        exportService = new ExportService(learningService, skillFormatter);
    });

    it('should get export stats', async () => {
        const stats = await exportService.getExportStats();
        
        expect(stats).toBeDefined();
        expect(typeof stats.total).toBe('number');
        expect(typeof stats.mature).toBe('number');
        expect(typeof stats.learning).toBe('number');
        expect(typeof stats.raw).toBe('number');
        expect(typeof stats.exportable).toBe('number');
    });

    it('should preview mature skills', async () => {
        const preview = await exportService.previewMatureSkills(0.8);
        
        expect(Array.isArray(preview)).toBe(true);
        preview.forEach(skill => {
            expect(skill.id).toBeDefined();
            expect(skill.title).toBeDefined();
            expect(skill.state).toBeDefined();
            expect(typeof skill.confidence).toBe('number');
            expect(skill.filename).toBeDefined();
        });
    });

    it('should export mature skills to directory', async () => {
        const outputDir = path.join(process.cwd(), '.agent/skills-test');
        const exported = await exportService.exportMatureSkills(outputDir, 0.8);
        
        expect(Array.isArray(exported)).toBe(true);
        exported.forEach(skill => {
            expect(skill.filename).toBeDefined();
        });
    });
});
