// Unit Tests for LessonSynthesizer
import { LessonSynthesizer } from '../../src/core/learning/lesson-synthesizer.js';

console.log('🧪 Testing LessonSynthesizer\n');

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

const mockLegacy = [
    {
        id: 'LEGACY-001',
        pattern: 'old',
        message: 'Old lesson',
        category: 'general'
    }
];

// Test 1: synthesizeLessons()
console.log('Test 1: synthesizeLessons()');
const lessons = LessonSynthesizer.synthesizeLessons(mockMistakes, mockImprovements, mockLegacy);

console.assert(Array.isArray(lessons), 'Should return array');
console.assert(lessons.length > 0, 'Should have lessons');
console.log(`✅ Generated ${lessons.length} lesson(s)\n`);

// Test 2: Lesson structure
console.log('Test 2: Lesson Structure');
const lesson = lessons[0];

console.assert(lesson.id, 'Should have ID');
console.assert(lesson.title, 'Should have title');
console.assert(lesson.tag, 'Should have tag');
console.assert(lesson.intent, 'Should have intent');
console.assert(lesson.maturity, 'Should have maturity');
console.assert(Array.isArray(lesson.mistakes), 'Should have mistakes array');
console.assert(Array.isArray(lesson.improvements), 'Should have improvements array');
console.log(`✅ Lesson structure valid\n`);

// Test 3: Grouping by tags
console.log('Test 3: Tag Grouping');
const testingLesson = lessons.find(l => l.tag === 'testing');
console.assert(testingLesson, 'Should group by testing tag');
console.assert(testingLesson.mistakes.length > 0 || testingLesson.improvements.length > 0, 'Should have content');
console.log(`✅ Grouped by tags correctly\n`);

// Test 4: Enhanced with cognitive data
console.log('Test 4: Cognitive Enhancement');
console.assert(lesson.maturity.state, 'Should have maturity state');
console.assert(lesson.maturity.confidence >= 0, 'Should have confidence score');
console.assert(lesson.intent.goal, 'Should have intent goal');
console.log(`✅ Enhanced with cognitive data\n`);

// Test 5: Edge cases
console.log('Test 5: Edge Cases');

// Empty inputs
const emptyLessons = LessonSynthesizer.synthesizeLessons([], [], []);
console.assert(Array.isArray(emptyLessons), 'Empty inputs should return array');
console.log(`✅ Empty inputs handled\n`);

// Only legacy
const legacyOnly = LessonSynthesizer.synthesizeLessons([], [], mockLegacy);
console.assert(legacyOnly.length > 0, 'Should include legacy lessons');
console.log(`✅ Legacy lessons included\n`);

console.log('🎉 All LessonSynthesizer tests passed!');
