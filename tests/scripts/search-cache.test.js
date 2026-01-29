/**
 * Search Cache Tests - Studio Design System
 * ==========================================
 * Unit tests for LRU cache and search caching
 */

import { describe, test, expect, beforeEach } from 'vitest';
import {
    LRUCache,
    withCache,
    clearSearchCache,
    getCacheStats,
    searchCache
} from '../../.agent/skills/studio/scripts-js/utils/search-cache.js';

describe('Search Cache', () => {
    beforeEach(() => {
        clearSearchCache();
    });

    describe('LRUCache', () => {
        test('stores and retrieves values', () => {
            const cache = new LRUCache(10);
            
            cache.set('key1', { data: 'value1' });
            
            expect(cache.get('key1')).toEqual({ data: 'value1' });
        });

        test('returns undefined for missing keys', () => {
            const cache = new LRUCache(10);
            
            expect(cache.get('nonexistent')).toBeUndefined();
        });

        test('evicts oldest entry when at capacity', () => {
            const cache = new LRUCache(3);
            
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            cache.set('key4', 'value4'); // Should evict key1
            
            expect(cache.get('key1')).toBeUndefined();
            expect(cache.get('key2')).toBe('value2');
            expect(cache.get('key4')).toBe('value4');
        });

        test('updates LRU order on get', () => {
            const cache = new LRUCache(3);
            
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.set('key3', 'value3');
            
            // Access key1, making it most recently used
            cache.get('key1');
            
            // Add key4, should evict key2 (oldest unused)
            cache.set('key4', 'value4');
            
            expect(cache.get('key1')).toBe('value1');
            expect(cache.get('key2')).toBeUndefined();
        });

        test('expires entries after TTL', async () => {
            const cache = new LRUCache(10, 50); // 50ms TTL
            
            cache.set('key1', 'value1');
            expect(cache.get('key1')).toBe('value1');
            
            // Wait for expiration
            await new Promise(resolve => setTimeout(resolve, 60));
            
            expect(cache.get('key1')).toBeUndefined();
        });

        test('has() returns correct boolean', () => {
            const cache = new LRUCache(10);
            
            cache.set('key1', 'value1');
            
            expect(cache.has('key1')).toBe(true);
            expect(cache.has('key2')).toBe(false);
        });

        test('clear() removes all entries', () => {
            const cache = new LRUCache(10);
            
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            cache.clear();
            
            expect(cache.size).toBe(0);
            expect(cache.get('key1')).toBeUndefined();
        });

        test('getStats() returns cache statistics', () => {
            const cache = new LRUCache(50, 300000);
            
            cache.set('key1', 'value1');
            cache.set('key2', 'value2');
            
            const stats = cache.getStats();
            
            expect(stats.size).toBe(2);
            expect(stats.maxSize).toBe(50);
            expect(stats.ttlMs).toBe(300000);
        });
    });

    describe('LRUCache.generateKey', () => {
        test('generates consistent keys', () => {
            const key1 = LRUCache.generateKey('dashboard', 'style', 5);
            const key2 = LRUCache.generateKey('dashboard', 'style', 5);
            
            expect(key1).toBe(key2);
        });

        test('normalizes query to lowercase', () => {
            const key1 = LRUCache.generateKey('DASHBOARD', 'style', 5);
            const key2 = LRUCache.generateKey('dashboard', 'style', 5);
            
            expect(key1).toBe(key2);
        });

        test('creates different keys for different domains', () => {
            const key1 = LRUCache.generateKey('test', 'style', 5);
            const key2 = LRUCache.generateKey('test', 'ux', 5);
            
            expect(key1).not.toBe(key2);
        });

        test('creates different keys for different maxResults', () => {
            const key1 = LRUCache.generateKey('test', 'style', 5);
            const key2 = LRUCache.generateKey('test', 'style', 10);
            
            expect(key1).not.toBe(key2);
        });

        test('handles null/undefined query', () => {
            const key1 = LRUCache.generateKey(null, 'style', 5);
            const key2 = LRUCache.generateKey(undefined, 'style', 5);
            
            expect(key1).toBe(key2);
            expect(key1).toBe(':style:5');
        });
    });

    describe('withCache wrapper', () => {
        test('caches search results', async () => {
            let callCount = 0;
            const mockSearch = async (query, domain, maxResults) => {
                callCount++;
                return { results: [`result for ${query}`] };
            };
            
            const cachedSearch = withCache(mockSearch, 'style');
            
            // First call - cache miss
            await cachedSearch('test query', 5);
            expect(callCount).toBe(1);
            
            // Second call - cache hit
            await cachedSearch('test query', 5);
            expect(callCount).toBe(1); // Still 1, used cache
        });

        test('tracks hit/miss statistics', async () => {
            clearSearchCache();
            
            const mockSearch = async () => ({ results: [] });
            const cachedSearch = withCache(mockSearch, 'style');
            
            await cachedSearch('query1', 5); // miss
            await cachedSearch('query1', 5); // hit
            await cachedSearch('query2', 5); // miss
            
            const stats = getCacheStats();
            expect(stats.hits).toBe(1);
            expect(stats.misses).toBe(2);
        });
    });

    describe('getCacheStats', () => {
        test('returns cache statistics with hit rate', async () => {
            clearSearchCache();
            
            const mockSearch = async () => ({ results: [] });
            const cachedSearch = withCache(mockSearch, 'style');
            
            await cachedSearch('q1', 5); // miss
            await cachedSearch('q1', 5); // hit
            await cachedSearch('q1', 5); // hit
            await cachedSearch('q1', 5); // hit
            
            const stats = getCacheStats();
            expect(stats.hits).toBe(3);
            expect(stats.misses).toBe(1);
            expect(stats.hitRate).toBe('75.0%');
        });

        test('returns 0% hit rate when no requests', () => {
            clearSearchCache();
            
            const stats = getCacheStats();
            expect(stats.hitRate).toBe('0%');
        });
    });
});
