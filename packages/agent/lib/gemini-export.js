#!/usr/bin/env node
/**
 * Export Skills to Gemini - CLI Tool
 * 
 * Gemini-specific export functionality
 */

import { LessonRepository } from '../src/data/repositories/lesson-repository.js';
import { YamlStorage } from '../src/data/storage/yaml-storage.js';
import { LearningService } from '../src/services/learning-service.js';
import { SkillFormatter } from '../src/presentation/formatters/skill-formatter.js';
import { ExportService } from '../src/services/export-service.js';
import { KNOWLEDGE_DIR } from './config.js';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../../..');
const SKILLS_DIR = path.join(PROJECT_ROOT, '.agent/skills');

/**
 * Export all mature skills
 */
export async function exportGeminiSkills() {
    console.log('🚀 Exporting Mature Skills to Gemini\n');

    const storage = new YamlStorage(KNOWLEDGE_DIR);
    const repository = new LessonRepository(storage);
    const learningService = new LearningService(repository);
    const skillFormatter = new SkillFormatter();
    const exportService = new ExportService(learningService, skillFormatter);

    const stats = await exportService.getExportStats();

    console.log('📊 Export Statistics:');
    console.log(`  Total lessons: ${stats.total}`);
    console.log(`  Exportable (MATURE/IDEAL, ≥80%): ${stats.exportable}\n`);

    if (stats.exportable === 0) {
        console.log('ℹ️  No skills ready for export.\n');
        return { skills: [], count: 0 };
    }

    const exported = await exportService.exportMatureSkills(SKILLS_DIR, 0.8);

    console.log(`✅ Successfully exported ${exported.length} skill(s) to Gemini:\n`);
    exported.forEach(skill => {
        console.log(`  ✓ ${skill.filename}`);
    });

    console.log('\n🎉 Export Complete!');
    console.log('💡 Gemini AI will now use these skills when coding.\n');

    return { skills: exported, count: exported.length };
}

/**
 * Preview exportable skills
 */
export async function previewGeminiSkills() {
    const storage = new YamlStorage(KNOWLEDGE_DIR);
    const repository = new LessonRepository(storage);
    const learningService = new LearningService(repository);
    const skillFormatter = new SkillFormatter();
    const exportService = new ExportService(learningService, skillFormatter);

    const preview = await exportService.previewMatureSkills(0.8);

    if (preview.length === 0) {
        console.log('ℹ️  No skills ready for export.\n');
        return [];
    }

    console.log(`\n✅ ${preview.length} skill(s) ready for Gemini:\n`);

    preview.forEach(skill => {
        console.log(`📄 ${skill.id}: ${skill.title}`);
        console.log(`   ${skill.state} (${(skill.confidence * 100).toFixed(0)}%)`);
        console.log(`   → ${skill.filename}\n`);
    });

    return preview;
}
