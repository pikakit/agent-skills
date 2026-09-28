/**
 * Search Results Cache - Studio Design System
 * =============================================
 * LRU cache for search results to reduce CSV parsing overhead
 */

interface CacheEntry<T> {
    value: T;
    expiresAt: number;
    createdAt: number;
}

/**
 * Simple LRU (Least Recently Used) Cache implementation
 */
export class LRUCache<T = unknown> {
    private maxSize: number;
    private ttlMs: number;
    private cache: Map<string, CacheEntry<T>>;

    constructor(maxSize: number = 50, ttlMs: number = 5 * 60 * 1000) {
        this.maxSize = maxSize;
        this.ttlMs = ttlMs;
        this.cache = new Map();
    }

    /**
     * Generate cache key from search parameters
     */
    static generateKey(query: string, domain: string, maxResults: number): string {
        const normalizedQuery = (query || '').toLowerCase().trim();
        return `${normalizedQuery}:${domain}:${maxResults}`;
    }

    /**
     * Get value from cache
     */
    get(key: string): T | undefined {
        const entry = this.cache.get(key);

        if (!entry) {
            return undefined;
        }

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }

        // Move to end (most recently used)
        this.cache.delete(key);
        this.cache.set(key, entry);

        return entry.value;
    }

    /**
     * Set value in cache
     */
    set(key: string, value: T): void {
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            if (oldestKey) this.cache.delete(oldestKey);
        }

        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
            createdAt: Date.now()
        });
    }

    /**
     * Check if key exists and is not expired
     */
    has(key: string): boolean {
        const entry = this.cache.get(key);
        if (!entry) return false;

        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }

        return true;
    }

    /** Clear all cache entries */
    clear(): void {
        this.cache.clear();
    }

    /** Get current cache size */
    get size(): number {
        return this.cache.size;
    }

    /** Get cache statistics */
    getStats(): { size: number; maxSize: number; ttlMs: number } {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttlMs: this.ttlMs
        };
    }
}

