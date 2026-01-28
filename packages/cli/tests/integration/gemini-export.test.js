// Test Gemini Integration - Export Skills
import { LessonRepository } from './packages/cli/src/data/repositories/lesson-repository.js';
import { YamlStorage } from './packages/cli/src/data/storage/yaml-storage.js';
import { LearningService } from './packages/cli/src/services/learning-service.js';
import { SkillFormatter } from './packages/cli/src/presentation/formatters/skill-formatter.js';
import { ExportService } from './packages/cli/src/services/export-service.js';
import { KNOWLEDGE_DIR } from './packages/cli/lib/config.js';
import path from 'path';

console.log('🚀 Testing Gemini Skills Export\n');

// Create instances
const storage = new YamlStorage(KNOWLEDGE_DIR);
const repository = new LessonRepository(storage);
const learningService = new LearningService(repository);
const skillFormatter = new SkillFormatter();
const exportService = new ExportService(learningService, skillFormatter);

// 1. Get stats
console.log('Getting export stats...');
const stats = await exportService.getExportStats();

console.log('\n📊 Export Statistics:');
console.log(`  Total lessons: ${stats.total}`);
console.log(`  Mature/Ideal: ${stats.mature}`);
console.log(`  Learning: ${stats.learning}`);
console.log(`  Raw: ${stats.raw}`);
console.log(`  Exportable: ${stats.exportable}\n`);

// 2. Preview mature skills
console.log('Previewing mature skills...');
const preview = await exportService.previewMatureSkills(0.8);

console.log(`\n✅ Found ${preview.length} exportable skills:\n`);
preview.forEach(skill => {
    console.log(`📄 ${skill.id}: ${skill.title}`);
    console.log(`   State: ${skill.state} (${(skill.confidence * 100).toFixed(0)}%)`);
    console.log(`   File: ${skill.filename}\n`);
});

// 3. Export to test directory
const outputDir = path.join(process.cwd(), '.agent/skills-test');
console.log(`Exporting to: ${outputDir}\n`);

const exported = await exportService.exportMatureSkills(outputDir, 0.8);

console.log(`✅ Exported ${exported.length} skills:\n`);
exported.forEach(skill => {
    console.log(`  ✓ ${skill.filename}`);
});

console.log('\n🎉 Export Complete!');
console.log(`\nCheck files in: ${outputDir}`);
