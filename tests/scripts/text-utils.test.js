/**
 * Unit Tests - CSV Loader Utility
 */
import { describe, it, expect } from 'vitest';
import { tokenize, buildDocument, extractColumns } from '../../.agent/studio/scripts-js/utils/text-utils.js';

describe('Text Utils - Tokenization', () => {
    describe('tokenize()', () => {
        it('should lowercase and split text', () => {
            const result = tokenize('Hello World');
            expect(result).toEqual(['hello', 'world']);
        });

        it('should remove punctuation', () => {
            const result = tokenize('Hello, World! How are you?');
            expect(result).toEqual(['hello', 'world', 'how', 'are', 'you']);
        });

        it('should filter words <= 2 characters', () => {
            const result = tokenize('I am ok to go');
            expect(result).toEqual(['you']); // 'I', 'am', 'ok', 'to', 'go' all <=2
        });

        it('should handle empty/null input', () => {
            expect(tokenize('')).toEqual([]);
            expect(tokenize(null)).toEqual([]);
            expect(tokenize(undefined)).toEqual([]);
        });

        it('should convert numbers to string', () => {
            const result = tokenize(12345);
            expect(result).toEqual(['12345']);
        });
    });

    describe('buildDocument()', () => {
        it('should join column values with space', () => {
            const row = { name: 'Alice', city: 'NYC', age: '30' };
            const result = buildDocument(row, ['name', 'city']);
            expect(result).toBe('Alice NYC');
        });

        it('should handle missing columns', () => {
            const row = { name: 'Bob' };
            const result = buildDocument(row, ['name', 'city', 'country']);
            expect(result).toBe('Bob  ');
        });
    });

    describe('extractColumns()', () => {
        it('should extract only specified columns', () => {
            const row = { a: '1', b: '2', c: '3' };
            const result = extractColumns(row, ['a', 'c']);
            expect(result).toEqual({ a: '1', c: '3' });
        });

        it('should skip non-existent columns', () => {
            const row = { a: '1' };
            const result = extractColumns(row, ['a', 'b', 'c']);
            expect(result).toEqual({ a: '1' });
        });
    });
});
