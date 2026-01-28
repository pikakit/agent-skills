// Test Learning module - new architecture
import { LessonRepository } from './packages/cli/src/data/repositories/lesson-repository.js';
import { YamlStorage } from './packages/cli/src/data/storage/yaml-storage.js';
import { LearningService } from './packages/cli/src/services/learning-service.js';
import { KNOWLEDGE_DIR } from './packages/cli/lib/config.js';

console.log('📚 Testing Learning Module (New Architecture)\n');

// Create instances
const storage = new YamlStorage(KNOWLEDGE_DIR);
const repository = new LessonRepository(storage);
const learningService = new LearningService(repository);

// 1. Load cognitive lessons
console.log('Loading cognitive lessons...');
const lessons = await learningService.getCognitiveLessons();

console.log(`\n✅ Found ${lessons.length} cognitive lessons:\n`);

// Show first 3
lessons.slice(0, 3).forEach(lesson => {
    console.log(`📖 ${lesson.id}: ${lesson.title}`);
    console.log(`   State: ${lesson.maturity.state} (confidence: ${(lesson.maturity.confidence * 100).toFixed(0)}%)`);
    console.log(`   Intent: ${lesson.intent.goal}`);
    console.log(`   Coverage: ${lesson.maturity.coverage}`);
    console.log('');
});

// 2. Load legacy lessons
const legacy = await learningService.listLessons();
console.log(`\n📚 Legacy lessons: ${legacy.length}`);

console.log('\n✅ Learning Module Test Complete!');
