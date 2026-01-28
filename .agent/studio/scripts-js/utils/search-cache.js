/**
 * Search Results Cache - Studio Design System
 * =============================================
 * LRU cache for search results to reduce CSV parsing overhead
 * Provides 10x faster repeated searches
 */

/**
 * Simple LRU (Least Recently Used) Cache implementation
 * @class
 */
class LRUCache {
    /**
     * @param {number} maxSize - Maximum number of entries to cache
     * @param {number} ttlMs - Time to live in milliseconds (default: 5 minutes)
     */
    constructor(maxSize = 50, ttlMs = 5 * 60 * 1000) {
        this.maxSize = maxSize;
        this.ttlMs = ttlMs;
        this.cache = new Map();
    }

    /**
     * Generate cache key from search parameters
     * @param {string} query - Search query
     * @param {string} domain - Search domain (style, ux, landing, etc.)
     * @param {number} maxResults - Maximum results to return
     * @returns {string} Cache key
     */
    static generateKey(query, domain, maxResults) {
        const normalizedQuery = (query || '').toLowerCase().trim();
        return `${normalizedQuery}:${domain}:${maxResults}`;
    }

    /**
     * Get value from cache
     * @param {string} key - Cache key
     * @returns {*} Cached value or undefined if not found/expired
     */
    get(key) {
        const entry = this.cache.get(key);
        
        if (!entry) {
            return undefined;
        }

        // Check if entry has expired
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
     * @param {string} key - Cache key
     * @param {*} value - Value to cache
     */
    set(key, value) {
        // Delete if exists (to update position)
        if (this.cache.has(key)) {
            this.cache.delete(key);
        }

        // Evict oldest entry if at capacity
        if (this.cache.size >= this.maxSize) {
            const oldestKey = this.cache.keys().next().value;
            this.cache.delete(oldestKey);
        }

        // Add new entry
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
            createdAt: Date.now()
        });
    }

    /**
     * Check if key exists and is not expired
     * @param {string} key - Cache key
     * @returns {boolean}
     */
    has(key) {
        const entry = this.cache.get(key);
        if (!entry) return false;
        
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return false;
        }
        
        return true;
    }

    /**
     * Clear all cache entries
     */
    clear() {
        this.cache.clear();
    }

    /**
     * Get current cache size
     * @returns {number}
     */
    get size() {
        return this.cache.size;
    }

    /**
     * Get cache statistics
     * @returns {{ size: number, maxSize: number, ttlMs: number }}
     */
    getStats() {
        return {
            size: this.cache.size,
            maxSize: this.maxSize,
            ttlMs: this.ttlMs
        };
    }
}

// Global cache instance for search results
const searchCache = new LRUCache(50, 5 * 60 * 1000); // 50 entries, 5 min TTL

// Cache hit/miss statistics
let cacheStats = {
    hits: 0,
    misses: 0
};

/**
 * Wrap a search function with caching
 * @param {Function} searchFn - Original search function
 * @param {string} domain - Search domain for cache key
 * @returns {Function} Cached search function
 */
export function withCache(searchFn, domain) {
    return async function cachedSearch(query, maxResults = 5) {
        const key = LRUCache.generateKey(query, domain, maxResults);
        
        // Check cache first
        const cachedResult = searchCache.get(key);
        if (cachedResult !== undefined) {
            cacheStats.hits++;
            return cachedResult;
        }
        
        // Cache miss - execute search
        cacheStats.misses++;
        const result = await searchFn(query, domain, maxResults);
        
        // Store in cache
        searchCache.set(key, result);
        
        return result;
    };
}

/**
 * Clear the search cache
 */
export function clearSearchCache() {
    searchCache.clear();
    cacheStats = { hits: 0, misses: 0 };
}

/**
 * Get cache statistics
 * @returns {{ hits: number, misses: number, hitRate: number, cacheSize: number }}
 */
export function getCacheStats() {
    const total = cacheStats.hits + cacheStats.misses;
    return {
        hits: cacheStats.hits,
        misses: cacheStats.misses,
        hitRate: total > 0 ? (cacheStats.hits / total * 100).toFixed(1) + '%' : '0%',
        cacheSize: searchCache.size
    };
}

// Export for testing
export { LRUCache, searchCache };
