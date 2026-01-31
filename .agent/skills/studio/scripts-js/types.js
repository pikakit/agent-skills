/**
 * Studio Design System - Type Definitions (JSDoc)
 * ===================================================
 * Type definitions for the Studio JavaScript library
 * Provides IDE intellisense without requiring TypeScript
 */

// ============ Core Types ============

/**
 * @typedef {Object} CSVConfig
 * @property {string} file
 * @property {string[]} search_cols
 * @property {string[]} output_cols
 */

/**
 * @typedef {Object} SearchResult
 * @property {string} domain
 * @property {string} query
 * @property {string} file
 * @property {number} count
 * @property {Object[]} results
 * @property {boolean} [cached]
 */

/**
 * @typedef {Object} StackSearchResult
 * @property {string} domain
 * @property {string} query
 * @property {string} file
 * @property {number} count
 * @property {Object[]} results
 * @property {string} stack
 */

/**
 * @typedef {Object} SearchOptions
 * @property {boolean} [useCache]
 */

// ============ Design System Types ============

/**
 * @typedef {Object} ColorPalette
 * @property {string} [primary]
 * @property {string} [secondary]
 * @property {string} [cta]
 * @property {string} [background]
 * @property {string} [text]
 * @property {string} [border]
 */

/**
 * @typedef {Object} Typography
 * @property {string} ['Font Family']
 * @property {string} ['Body Size']
 * @property {string} ['Heading Sizes']
 */

/**
 * @typedef {Object} DesignSystem
 * @property {string} project_name
 * @property {Object} [style]
 * @property {ColorPalette} [colors]
 * @property {Typography} [typography]
 * @property {Object} [pattern]
 * @property {string} [key_effects]
 * @property {string} [anti_patterns]
 */

/**
 * @typedef {Object} PageOverrides
 * @property {{type: string, recommendation: string}} [layout]
 * @property {{approach: string}} [spacing]
 * @property {Object} [typography]
 * @property {Object} [colors]
 * @property {Object} [components]
 */

// ============ Cache Types ============

/**
 * @typedef {Object} CacheEntry
 * @property {*} value
 * @property {number} expiresAt
 * @property {number} createdAt
 */

/**
 * @typedef {Object} CacheStats
 * @property {number} hits
 * @property {number} misses
 * @property {string} hitRate
 * @property {number} cacheSize
 */

/**
 * @typedef {Object} LRUCacheConfig
 * @property {number} maxSize
 * @property {number} ttlMs
 */

// ============ Config Types ============

/**
 * @typedef {Object} CustomPattern
 * @property {string[]} keywords
 * @property {string} type
 */

/**
 * @typedef {Object} StudioConfig
 * @property {string} [$schema]
 * @property {CustomPattern[]} [customPatterns]
 */

// ============ CSS Validation Types ============

/**
 * @typedef {Object} CSSValidationError
 * @property {string} message
 * @property {number} line
 * @property {number} column
 */

/**
 * @typedef {Object} CSSValidationResult
 * @property {boolean} valid
 * @property {CSSValidationError[]} errors
 */

/**
 * @typedef {Object} CSSValidationOptions
 * @property {boolean} [strict]
 */

/**
 * @typedef {Object} MarkdownCSSValidation
 * @property {boolean} valid
 * @property {string[]} warnings
 */

// ============ Page Type Detection ============

/**
 * @typedef {Object} PagePattern
 * @property {string[]} keywords
 * @property {string} type
 */

/**
 * Page type enumeration
 * @typedef {'Dashboard / Data View' | 'Checkout / Payment' | 'Settings / Profile' | 
 *           'Landing / Marketing' | 'Authentication' | 'Pricing / Plans' | 
 *           'Blog / Article' | 'Product Detail' | 'Search Results' | 
 *           'Empty State' | 'General' | string} PageType
 */

// ============ LRU Cache Class ============

/**
 * LRU Cache implementation
 */
class LRUCache {
    /**
     * @param {number} [maxSize=100]
     * @param {number} [ttlMs=300000]
     */
    constructor(maxSize = 100, ttlMs = 300000) {
        this.maxSize = maxSize;
        this.ttlMs = ttlMs;
        this.cache = new Map();
    }

    /**
     * Generate cache key
     * @param {string} query
     * @param {string} domain
     * @param {number} maxResults
     * @returns {string}
     */
    static generateKey(query, domain, maxResults) {
        return `${domain}:${query}:${maxResults}`;
    }

    /**
     * Get value from cache
     * @param {string} key
     * @returns {*}
     */
    get(key) {
        const entry = this.cache.get(key);
        if (!entry) return undefined;
        if (Date.now() > entry.expiresAt) {
            this.cache.delete(key);
            return undefined;
        }
        return entry.value;
    }

    /**
     * Set value in cache
     * @param {string} key
     * @param {*} value
     */
    set(key, value) {
        if (this.cache.size >= this.maxSize) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, {
            value,
            expiresAt: Date.now() + this.ttlMs,
            createdAt: Date.now()
        });
    }

    /**
     * Check if key exists
     * @param {string} key
     * @returns {boolean}
     */
    has(key) {
        return this.get(key) !== undefined;
    }

    /** Clear cache */
    clear() {
        this.cache.clear();
    }

    /** @returns {number} */
    get size() {
        return this.cache.size;
    }

    /**
     * Get cache stats
     * @returns {{size: number, maxSize: number, ttlMs: number}}
     */
    getStats() {
        return { size: this.cache.size, maxSize: this.maxSize, ttlMs: this.ttlMs };
    }
}

export { LRUCache };
