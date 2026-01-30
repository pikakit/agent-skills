/**
 * @fileoverview Tests for SkillFormatter functionality
 */
import { describe, it, expect } from 'vitest';
import { SkillFormatter } from '../../src/presentation/formatters/skill-formatter.js';

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

describe('SkillFormatter - Output Structure', () => {
    const formatter = new SkillFormatter();

    it('should format lesson to skill with correct structure', () => {
        const skill = formatter.format(mockLesson);
        
        expect(skill.name).toBeDefined();
        expect(skill.filename).toBeDefined();
        expect(skill.content).toBeDefined();
        expect(skill.filename.endsWith('.md')).toBe(true);
    });
});

describe('SkillFormatter - Frontmatter', () => {
    const formatter = new SkillFormatter();

    it('should have valid frontmatter format', () => {
        const skill = formatter.format(mockLesson);
        const lines = skill.content.split('\n');
        
        expect(lines[0]).toBe('---');
        expect(lines.some(l => l.includes('name:'))).toBe(true);
        expect(lines.some(l => l.includes('confidence:'))).toBe(true);
        expect(lines.some(l => l.includes('maturity:'))).toBe(true);
    });
});

describe('SkillFormatter - Content Sections', () => {
    const formatter = new SkillFormatter();

    it('should include all required sections', () => {
        const skill = formatter.format(mockLesson);
        
        expect(skill.content.includes('# Test Lesson')).toBe(true);
        expect(skill.content.includes('## 🚫 Anti-Patterns')).toBe(true);
        expect(skill.content.includes('## ✅ Best Practices')).toBe(true);
        expect(skill.content.includes('## 📊 Evolution Status')).toBe(true);
        expect(skill.content.includes('## 🎯 When to Apply')).toBe(true);
        expect(skill.content.includes('## 📈 Confidence Metrics')).toBe(true);
    });
});

describe('SkillFormatter - Mistake Formatting', () => {
    const formatter = new SkillFormatter();

    it('should format mistakes correctly', () => {
        const skill = formatter.format(mockLesson);
        
        expect(skill.content.includes('MISTAKE-TEST')).toBe(true);
        expect(skill.content.includes('Avoid bad code')).toBe(true);
        expect(skill.content.includes('Hit Count:')).toBe(true);
    });
});

describe('SkillFormatter - Improvement Formatting', () => {
    const formatter = new SkillFormatter();

    it('should format improvements correctly', () => {
        const skill = formatter.format(mockLesson);
        
        expect(skill.content.includes('IMPROVE-TEST')).toBe(true);
        expect(skill.content.includes('Write good code')).toBe(true);
        expect(skill.content.includes('Applied Count:')).toBe(true);
    });
});

describe('SkillFormatter - Utilities', () => {
    const formatter = new SkillFormatter();

    it('should sanitize name correctly', () => {
        const sanitized = formatter.sanitizeName('Test Tag-With_Special!Chars');
        expect(sanitized).toBe('test-tag-with-special-chars');
    });

    it('should calculate total hits correctly', () => {
        const totalHits = formatter.calculateTotalHits(mockLesson);
        expect(totalHits).toBe(15); // 5 + 10
    });
});
