/**
 * Studio Design System - TypeScript Type Definitions
 * ===================================================
 * Type definitions for the Studio JavaScript library
 * Provides IDE intellisense without requiring TypeScript compilation
 */

// ============ Core Types ============

/** CSV column configuration */
export interface CSVConfig {
    file: string;
    search_cols: string[];
    output_cols: string[];
}

/** Search result from BM25 query */
export interface SearchResult {
    domain: string;
    query: string;
    file: string;
    count: number;
    results: Record<string, any>[];
    cached?: boolean;
}

/** Stack search result */
export interface StackSearchResult extends SearchResult {
    stack: string;
}

/** Search options */
export interface SearchOptions {
    useCache?: boolean;
}

// ============ Design System Types ============

/** Color palette definition */
export interface ColorPalette {
    primary?: string;
    secondary?: string;
    cta?: string;
    background?: string;
    text?: string;
    border?: string;
}

/** Typography settings */
export interface Typography {
    'Font Family'?: string;
    'Body Size'?: string;
    'Heading Sizes'?: string;
}

/** Complete design system */
export interface DesignSystem {
    project_name: string;
    style?: Record<string, any>;
    colors?: ColorPalette;
    typography?: Typography;
    pattern?: Record<string, any>;
    key_effects?: string;
    anti_patterns?: string;
}

/** Page override settings */
export interface PageOverrides {
    layout?: { type: string; recommendation: string };
    spacing?: { approach: string };
    typography?: Record<string, any>;
    colors?: Record<string, any>;
    components?: Record<string, any>;
}

// ============ Cache Types ============

/** Cache entry with TTL */
export interface CacheEntry<T> {
    value: T;
    expiresAt: number;
    createdAt: number;
}

/** Cache statistics */
export interface CacheStats {
    hits: number;
    misses: number;
    hitRate: string;
    cacheSize: number;
}

/** LRU Cache configuration */
export interface LRUCacheConfig {
    maxSize: number;
    ttlMs: number;
}

// ============ Config Types ============

/** Custom page pattern */
export interface CustomPattern {
    keywords: string[];
    type: string;
}

/** Studio configuration file */
export interface StudioConfig {
    $schema?: string;
    customPatterns?: CustomPattern[];
}

// ============ CSS Validation Types ============

/** CSS validation error */
export interface CSSValidationError {
    message: string;
    line: number;
    column: number;
}

/** CSS validation result */
export interface CSSValidationResult {
    valid: boolean;
    errors: CSSValidationError[];
}

/** CSS validation options */
export interface CSSValidationOptions {
    strict?: boolean;
}

/** Markdown CSS validation */
export interface MarkdownCSSValidation {
    valid: boolean;
    warnings: string[];
}

// ============ Page Type Detection ============

/** Page type pattern */
export interface PagePattern {
    keywords: string[];
    type: string;
}

/** Page type enum */
export type PageType = 
    | 'Dashboard / Data View'
    | 'Checkout / Payment'
    | 'Settings / Profile'
    | 'Landing / Marketing'
    | 'Authentication'
    | 'Pricing / Plans'
    | 'Blog / Article'
    | 'Product Detail'
    | 'Search Results'
    | 'Empty State'
    | 'General'
    | string; // Custom types from config

// ============ Function Signatures ============

/** Core search function */
export function search(
    query: string,
    domain?: string | null,
    maxResults?: number,
    options?: SearchOptions
): Promise<SearchResult>;

/** Domain detection */
export function detectDomain(query: string): string;

/** Stack search */
export function searchStack(
    query: string,
    stack?: string,
    maxResults?: number
): Promise<StackSearchResult>;

/** Design system generation */
export function generateDesignSystem(
    query: string,
    projectName: string,
    format?: 'json' | 'yaml' | 'markdown'
): Promise<string>;

/** Master file formatting */
export function formatMasterMd(designSystem: DesignSystem): string;

/** Page override formatting */
export function formatPageOverrideMd(
    designSystem: DesignSystem,
    pageName: string,
    pageQuery?: string | null
): Promise<string>;

/** Design system persistence */
export function persistDesignSystem(
    designSystem: DesignSystem,
    outputDir: string,
    page?: string | null,
    pageQuery?: string | null
): Promise<string[]>;

/** Page type detection */
export function detectPageType(
    context: string,
    styleResults?: Record<string, any>[]
): PageType;

/** Config-aware page detection */
export function detectPageTypeWithConfig(
    context: string,
    styleResults?: Record<string, any>[],
    projectDir?: string
): Promise<PageType>;

/** Config loading */
export function loadConfig(
    configPath?: string | null,
    projectDir?: string
): Promise<StudioConfig | null>;

/** Config validation */
export function validateConfig(config: unknown): StudioConfig;

/** Pattern merging */
export function mergePatterns(
    defaultPatterns: PagePattern[],
    customPatterns: CustomPattern[]
): PagePattern[];

/** CSS validation */
export function validateCss(
    css: string,
    options?: CSSValidationOptions
): CSSValidationResult;

/** CSS validation with context */
export function validateCssWithContext(
    css: string,
    context?: string
): string | null;

/** Markdown CSS validation */
export function validateMarkdownCss(markdown: string): MarkdownCSSValidation;

/** Cache wrapper */
export function withCache<T>(
    searchFn: (query: string, domain: string, maxResults: number) => Promise<T>,
    domain: string
): (query: string, maxResults?: number) => Promise<T>;

/** Clear search cache */
export function clearSearchCache(): void;

/** Get cache statistics */
export function getCacheStats(): CacheStats;

// ============ LRU Cache Class ============

export declare class LRUCache<T = any> {
    constructor(maxSize?: number, ttlMs?: number);
    
    static generateKey(query: string, domain: string, maxResults: number): string;
    
    get(key: string): T | undefined;
    set(key: string, value: T): void;
    has(key: string): boolean;
    clear(): void;
    
    readonly size: number;
    getStats(): { size: number; maxSize: number; ttlMs: number };
}
