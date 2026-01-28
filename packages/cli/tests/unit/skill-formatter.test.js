// Unit Tests for SkillFormatter
import { SkillFormatter } from '../../src/presentation/formatters/skill-formatter.js';

console.log('🧪 Testing SkillFormatter\n');

// Mock lesson
const mockLesson = {
    id: 'LESSON-TEST',
    title: 'Test Lesson',
    tag: 'test-tag',
    intent: {
        goal: 'Test coding practices',
        category: 'quality',
        strength: 0.9
    },
    maturity: {
        state: 'MATURE',
        confidence: 0.85,
        coverage: '1 mistakes / 2 improvements',
        recommendation: 'Keep improving',
        indicators: {
            balance: 0.67,
            evidence: 0.8,
            recency: 0.9
        }
    },
    mistakes: [{
        id: 'MISTAKE-TEST',
        pattern: 'bad-code',
        message: 'Avoid bad code',
        severity: 'ERROR',
        hitCount: 5,
        tags: ['quality']
    }],
    improvements: [{
        id: 'IMPROVE-TEST',
        pattern: 'good-code',
        message: 'Write good code',
        appliedCount: 10,
        tags: ['quality']
    }],
    evolution: {
        signals: [],
        missingAreas: [],
        nextAction: 'Continue learning'
    }
};

const formatter = new SkillFormatter();

// Test 1: format() returns correct structure
console.log('Test 1: Format Output Structure');
const skill = formatter.format(mockLesson);

console.assert(skill.name, 'Should have name');
console.assert(skill.filename, 'Should have filename');
console.assert(skill.content, 'Should have content');
console.assert(skill.filename.endsWith('.md'), 'Filename should end with .md');
console.log(`✅ Structure: ${skill.filename}\n`);

// Test 2: Frontmatter format
console.log('Test 2: Frontmatter Format');
const lines = skill.content.split('\n');
console.assert(lines[0] === '---', 'Should start with ---');
console.assert(lines.some(l => l.includes('name:')), 'Should have name field');
console.assert(lines.some(l => l.includes('confidence:')), 'Should have confidence field');
console.assert(lines.some(l => l.includes('maturity:')), 'Should have maturity field');
console.log(`✅ Frontmatter valid\n`);

// Test 3: Content sections
console.log('Test 3: Content Sections');
console.assert(skill.content.includes('# Test Lesson'), 'Should have title');
console.assert(skill.content.includes('## 🚫 Anti-Patterns'), 'Should have anti-patterns section');
console.assert(skill.content.includes('## ✅ Best Practices'), 'Should have best practices section');
console.assert(skill.content.includes('## 📊 Evolution Status'), 'Should have evolution section');
console.assert(skill.content.includes('## 🎯 When to Apply'), 'Should have application guide');
console.assert(skill.content.includes('## 📈 Confidence Metrics'), 'Should have metrics');
console.log(`✅ All sections present\n`);

// Test 4: Mistake formatting
console.log('Test 4: Mistake Formatting');
console.assert(skill.content.includes('MISTAKE-TEST'), 'Should include mistake ID');
console.assert(skill.content.includes('Avoid bad code'), 'Should include mistake message');
console.assert(skill.content.includes('Hit Count: 5'), 'Should include hit count');
console.log(`✅ Mistakes formatted correctly\n`);

// Test 5: Improvement formatting
console.log('Test 5: Improvement Formatting');
console.assert(skill.content.includes('IMPROVE-TEST'), 'Should include improvement ID');
console.assert(skill.content.includes('Write good code'), 'Should include improvement message');
console.assert(skill.content.includes('Applied Count: 10'), 'Should include applied count');
console.log(`✅ Improvements formatted correctly\n`);

// Test 6: sanitizeName()
console.log('Test 6: Name Sanitization');
const sanitized = formatter.sanitizeName('Test Tag-With_Special!Chars');
console.assert(sanitized === 'test-tag-with-special-chars', 'Should sanitize name');
console.log(`✅ Name sanitization works\n`);

// Test 7: calculateTotalHits()
console.log('Test 7: Total Hits Calculation');
const totalHits = formatter.calculateTotalHits(mockLesson);
console.assert(totalHits === 15, 'Should calculate total hits (5 + 10)');
console.log(`✅ Total hits: ${totalHits}\n`);

console.log('🎉 All SkillFormatter tests passed!');
