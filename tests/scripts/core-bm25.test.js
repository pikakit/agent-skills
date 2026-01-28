/**
 * Unit Tests - BM25 Search Engine
 * Compare JavaScript implementation with Python behavior
 */
import { describe, it, expect } from 'vitest';
import { BM25, detectDomain, CSV_CONFIG, STACK_CONFIG, AVAILABLE_STACKS } from '../../.agent/studio/scripts-js/core.js';

describe('BM25 Search Engine', () => {
    describe('BM25 Class', () => {
        it('should initialize with default parameters', () => {
            const bm25 = new BM25();
            expect(bm25.k1).toBe(1.5);
            expect(bm25.b).toBe(0.75);
            expect(bm25.N).toBe(0);
        });

        it('should tokenize and fit documents', () => {
            const bm25 = new BM25();
            const docs = ['Hello world', 'Testing BM25 search', 'Another document here'];
            bm25.fit(docs);

            expect(bm25.N).toBe(3);
            expect(bm25.corpus.length).toBe(3);
            expect(bm25.avgdl).toBeGreaterThan(0);
        });

        it('should calculate BM25 scores', () => {
            const bm25 = new BM25();
            const docs = [
                'This is a test document about search',
                'BM25 is a ranking function',
                'Search engines use BM25 for ranking'
            ];
            bm25.fit(docs);

            const scores = bm25.score('search ranking');
            expect(scores.length).toBe(3);
            expect(scores[0][1]).toBeGreaterThanOrEqual(scores[1][1]); // Sorted descending
            expect(scores[1][1]).toBeGreaterThanOrEqual(scores[2][1]);
        });

        it('should return zero scores for non-matching query', () => {
            const bm25 = new BM25();
            const docs = ['Apple orange banana', 'Cat dog bird'];
            bm25.fit(docs);

            const scores = bm25.score('car truck vehicle');
            expect(scores.every(([_, score]) => score === 0)).toBe(true);
        });

        it('should handle empty corpus', () => {
            const bm25 = new BM25();
            bm25.fit([]);

            const scores = bm25.score('test');
            expect(scores).toEqual([]);
        });
    });

    describe('Domain Detection', () => {
        it('should detect color domain', () => {
            expect(detectDomain('blue color palette')).toBe('color');
            expect(detectDomain('#FF0000 hex colors')).toBe('color');
        });

        it('should detect chart domain', () => {
            expect(detectDomain('bar chart visualization')).toBe('chart');
            expect(detectDomain('pie graph data')).toBe('chart');
        });

        it('should detect product domain', () => {
            expect(detectDomain('SaaS dashboard design')).toBe('product');
            expect(detectDomain('ecommerce website')).toBe('product');
        });

        it('should detect style domain', () => {
            expect(detectDomain('glassmorphism modern')).toBe('style');
            expect(detectDomain('brutalism design')).toBe('style');
        });

        it('should default to style for unknown queries', () => {
            expect(detectDomain('random query')).toBe('style');
            expect(detectDomain('xyz abc')).toBe('style');
        });
    });

    describe('Configuration', () => {
        it('should have all CSV configs defined', () => {
            const expectedDomains = ['style', 'prompt', 'color', 'chart', 'landing', 'product', 'ux', 'typography', 'icons', 'react', 'web'];
            for (const domain of expectedDomains) {
                expect(CSV_CONFIG[domain]).toBeDefined();
                expect(CSV_CONFIG[domain].file).toBeDefined();
                expect(CSV_CONFIG[domain].search_cols).toBeDefined();
                expect(CSV_CONFIG[domain].output_cols).toBeDefined();
            }
        });

        it('should have all stack configs defined', () => {
            const expectedStacks = ['html-tailwind', 'react', 'nextjs', 'vue', 'nuxtjs', 'nuxt-ui', 'svelte', 'swiftui', 'react-native', 'flutter', 'shadcn', 'jetpack-compose'];
            for (const stack of expectedStacks) {
                expect(STACK_CONFIG[stack]).toBeDefined();
                expect(STACK_CONFIG[stack].file).toBeDefined();
            }
        });

        it('should export available stacks correctly', () => {
            expect(AVAILABLE_STACKS.length).toBe(12);
            expect(AVAILABLE_STACKS).toContain('html-tailwind');
            expect(AVAILABLE_STACKS).toContain('react');
        });
    });
});
