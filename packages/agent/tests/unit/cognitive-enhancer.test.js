/**
 * @fileoverview Tests for CognitiveEnhancer functionality
 */
import { describe, it, expect } from 'vitest';
import { CognitiveEnhancer } from '../../src/core/learning/cognitive-enhancer.js';

describe('CognitiveEnhancer - Intent Inference', () => {
    it('should infer intent from tags', () => {
        const tags = ['code-quality', 'imports'];
        const intent = CognitiveEnhancer.inferIntent(tags);
        
        expect(intent.goal).toBeDefined();
        expect(intent.category).toBeDefined();
        expect(intent.strength).toBeGreaterThanOrEqual(0);
        expect(intent.strength).toBeLessThanOrEqual(1);
    });

    it('should handle empty tags', () => {
        const emptyIntent = CognitiveEnhancer.inferIntent([]);
        expect(emptyIntent.category).toBe('general');
    });
});

describe('CognitiveEnhancer - Maturity Calculation', () => {
    it('should calculate maturity for improvements only', () => {
        const improvements = [{ hitCount: 100, appliedCount: 100 }];
        const mistakes = [];
        const intent = { goal: 'test', category: 'quality', strength: 0.9 };
        const maturity = CognitiveEnhancer.calculateMaturity(mistakes, improvements, intent);
        
        expect(maturity.state).toBeDefined();
        expect(maturity.confidence).toBeGreaterThanOrEqual(0);
        expect(maturity.confidence).toBeLessThanOrEqual(1);
        expect(maturity.recommendation).toBeDefined();
    });

    it('should return RAW state for high mistake count', () => {
        const highMistakes = Array(50).fill({ hitCount: 10 });
        const intent = { goal: 'test', category: 'quality', strength: 0.9 };
        const highMaturity = CognitiveEnhancer.calculateMaturity(highMistakes, [], intent);
        expect(highMaturity.state).toBe('RAW');
    });

    it('should return IDEAL state for only improvements', () => {
        const perfectImprovements = [{ hitCount: 1000, appliedCount: 1000 }];
        const intent = { goal: 'test', category: 'quality', strength: 0.9 };
        const perfectMaturity = CognitiveEnhancer.calculateMaturity([], perfectImprovements, intent);
        expect(perfectMaturity.state).toBe('IDEAL');
    });
});

describe('CognitiveEnhancer - Evolution Analysis', () => {
    it('should analyze evolution', () => {
        const improvements = [{ hitCount: 100, appliedCount: 100 }];
        const mistakes = [];
        const intent = { goal: 'test', category: 'quality', strength: 0.9 };
        const evolution = CognitiveEnhancer.analyzeEvolution(mistakes, improvements, intent);
        
        expect(Array.isArray(evolution.signals)).toBe(true);
        expect(Array.isArray(evolution.missingAreas)).toBe(true);
        expect(evolution.nextAction).toBeDefined();
    });
});
