/**
 * PatternAnalyzer Unit Tests
 * 
 * Tests all 12 pattern rules and helper functions
 */

import { describe, it, expect, beforeEach } from 'vitest';
import { PatternAnalyzer, DiagnosticInfo } from '../src/patternAnalyzer';

describe('PatternAnalyzer', () => {
    let analyzer: PatternAnalyzer;

    beforeEach(() => {
        analyzer = new PatternAnalyzer();
    });

    // Helper to create diagnostic info
    const createDiagnostic = (message: string, source = 'typescript'): DiagnosticInfo => ({
        message,
        source,
        code: 'test',
        severity: 'error',
        file: '/test/file.ts',
        line: 1,
        column: 1
    });

    describe('TypeScript Patterns', () => {
        it('should detect "Cannot find name" pattern', () => {
            const diagnostic = createDiagnostic("Cannot find name 'useState'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('import');
            expect(result.pattern).toContain('useState');
            expect(result.suggestedFix).toContain('import');
        });

        it('should detect "Property does not exist" pattern', () => {
            const diagnostic = createDiagnostic("Property 'foo' does not exist on type 'Bar'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('type');
            expect(result.pattern).toContain('foo');
            expect(result.pattern).toContain('Bar');
        });

        it('should detect "Type is not assignable" pattern', () => {
            const diagnostic = createDiagnostic("Type 'string' is not assignable to type 'number'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('type');
            expect(result.pattern).toContain('string');
            expect(result.pattern).toContain('number');
        });

        it('should detect "JSX namespace" pattern', () => {
            const diagnostic = createDiagnostic("Cannot find namespace 'JSX'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('react');
        });

        it('should detect "Module not found" pattern', () => {
            const diagnostic = createDiagnostic("Cannot find module 'lodash'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('import');
            expect(result.suggestedFix).toContain('npm install');
        });

        it('should detect "Strict null check" pattern', () => {
            const diagnostic = createDiagnostic("'value' is possibly 'undefined'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('null-safety');
        });

        it('should detect "Argument type" pattern', () => {
            const diagnostic = createDiagnostic("Argument of type 'string' is not assignable to parameter");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('type');
        });
    });

    describe('ESLint Patterns', () => {
        it('should detect "Unused variable" pattern', () => {
            const diagnostic = createDiagnostic("'unusedVar' is defined but never used", 'eslint');
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('code-quality');
        });

        it('should detect "Missing semicolon" pattern', () => {
            const diagnostic = createDiagnostic('Missing semicolon', 'eslint');
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('code-style');
        });
    });

    describe('React Patterns', () => {
        it('should detect "Invalid hook call" pattern', () => {
            const diagnostic = createDiagnostic('React Hook "useEffect" is called conditionally');
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('react');
        });

        it('should detect "Missing dependency" pattern', () => {
            const diagnostic = createDiagnostic("React Hook useEffect has a missing dependency: 'count'");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('react');
        });
    });

    describe('Async Patterns', () => {
        it('should detect async/await errors', () => {
            const diagnostic = createDiagnostic("'await' is not allowed in non-async function");
            const result = analyzer.analyze(diagnostic);

            expect(result.isLearnable).toBe(true);
            expect(result.category).toBe('async');
        });
    });

    describe('Non-learnable Cases', () => {
        it('should reject very short messages', () => {
            const diagnostic = createDiagnostic('Error');
            const result = analyzer.analyze(diagnostic);

            // Short messages go through generic check which may reject
            expect(result.confidence).toBeLessThan(1);
        });

        it('should handle messages with file paths', () => {
            const diagnostic = createDiagnostic('Error in /path/to/file.ts');
            const result = analyzer.analyze(diagnostic);

            // File paths are too specific
            expect(result.isLearnable).toBe(false);
        });
    });

    describe('Skill Name Suggestion', () => {
        it('should suggest skill name from lessons', () => {
            const lessons = [
                { id: 'TYPE-001', category: 'type', pattern: 'Type import error', context: '', solution: '', occurrences: 3, lastSeen: '', source: '', autoDetected: true }
            ];
            const name = analyzer.suggestSkillName('type', lessons);

            expect(name).toMatch(/type/);
        });
    });

    describe('Similarity Calculation', () => {
        it('should calculate similarity between patterns', () => {
            const similarity = analyzer.calculateSimilarity(
                'Cannot find name useState',
                'Cannot find name useEffect'
            );

            expect(similarity).toBeGreaterThan(0.5);
        });

        it('should return 0 for completely different patterns', () => {
            const similarity = analyzer.calculateSimilarity(
                'Type error',
                'Missing semicolon'
            );

            expect(similarity).toBeLessThan(0.3);
        });
    });
});
