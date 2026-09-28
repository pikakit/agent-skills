import { loadCSV } from './utils/csv-loader.ts';
import { tokenize, buildDocument, extractColumns } from './utils/text-utils.ts';
import { LRUCache } from './utils/search-cache.ts';
import {
    StudioError,
    type CSVConfig,
    type CSVRow,
    type SearchOptions,
    type SearchResult,
    type StackSearchResult
} from './types.ts';

export const MAX_RESULTS = 3;

export const CSV_CONFIG = {
    style: {
        file: 'styles.csv',
        search_cols: ['Style Category', 'Keywords', 'Best For', 'Type'],
        output_cols: ['Style Category', 'Type', 'Keywords', 'Primary Colors', 'Effects & Animation', 'Best For', 'Performance', 'Accessibility', 'Framework Compatibility', 'Complexity']
    },
    prompt: {
        file: 'prompts.csv',
        search_cols: ['Style Category', 'AI Prompt Keywords (Copy-Paste Ready)', 'CSS/Technical Keywords'],
        output_cols: ['Style Category', 'AI Prompt Keywords (Copy-Paste Ready)', 'CSS/Technical Keywords', 'Implementation Checklist']
    },
    color: {
        file: 'colors.csv',
        search_cols: ['Product Type', 'Keywords', 'Notes'],
        output_cols: ['Product Type', 'Keywords', 'Primary (Hex)', 'Secondary (Hex)', 'CTA (Hex)', 'Background (Hex)', 'Text (Hex)', 'Border (Hex)', 'Notes']
    },
    chart: {
        file: 'charts.csv',
        search_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'Accessibility Notes'],
        output_cols: ['Data Type', 'Keywords', 'Best Chart Type', 'Secondary Options', 'Color Guidance', 'Accessibility Notes', 'Library Recommendation', 'Interactive Level']
    },
    landing: {
        file: 'landing.csv',
        search_cols: ['Pattern Name', 'Keywords', 'Conversion Optimization', 'Section Order'],
        output_cols: ['Pattern Name', 'Keywords', 'Section Order', 'Primary CTA Placement', 'Color Strategy', 'Conversion Optimization']
    },
    product: {
        file: 'products.csv',
        search_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Key Considerations'],
        output_cols: ['Product Type', 'Keywords', 'Primary Style Recommendation', 'Secondary Styles', 'Landing Page Pattern', 'Dashboard Style (if applicable)', 'Color Palette Focus']
    },
    ux: {
        file: 'ux-guidelines.csv',
        search_cols: ['Category', 'Issue', 'Description', 'Platform'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    },
    typography: {
        file: 'typography.csv',
        search_cols: ['Font Pairing Name', 'Category', 'Mood/Style Keywords', 'Best For', 'Heading Font', 'Body Font'],
        output_cols: ['Font Pairing Name', 'Category', 'Heading Font', 'Body Font', 'Mood/Style Keywords', 'Best For', 'Google Fonts URL', 'CSS Import', 'Tailwind Config', 'Notes']
    },
    icons: {
        file: 'icons.csv',
        search_cols: ['Category', 'Icon Name', 'Keywords', 'Best For'],
        output_cols: ['Category', 'Icon Name', 'Keywords', 'Library', 'Import Code', 'Usage', 'Best For', 'Style']
    },
    react: {
        file: 'react-performance.csv',
        search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    },
    web: {
        file: 'web-interface.csv',
        search_cols: ['Category', 'Issue', 'Keywords', 'Description'],
        output_cols: ['Category', 'Issue', 'Platform', 'Description', 'Do', "Don't", 'Code Example Good', 'Code Example Bad', 'Severity']
    }
} as const satisfies Record<string, CSVConfig>;

export type SearchDomain = keyof typeof CSV_CONFIG;

export const STACK_CONFIG = {
    'html-tailwind': { file: 'stacks/html-tailwind.csv' },
    react: { file: 'stacks/react.csv' },
    nextjs: { file: 'stacks/nextjs.csv' },
    vue: { file: 'stacks/vue.csv' },
    nuxtjs: { file: 'stacks/nuxtjs.csv' },
    'nuxt-ui': { file: 'stacks/nuxt-ui.csv' },
    svelte: { file: 'stacks/svelte.csv' },
    swiftui: { file: 'stacks/swiftui.csv' },
    'react-native': { file: 'stacks/react-native.csv' },
    flutter: { file: 'stacks/flutter.csv' },
    shadcn: { file: 'stacks/shadcn.csv' },
    'jetpack-compose': { file: 'stacks/jetpack-compose.csv' }
} as const;

export type StackName = keyof typeof STACK_CONFIG;

export const STACK_COLS = {
    search_cols: ['Category', 'Guideline', 'Description', 'Do', "Don't"],
    output_cols: ['Category', 'Guideline', 'Description', 'Do', "Don't", 'Code Good', 'Code Bad', 'Severity', 'Docs URL']
} as const satisfies Omit<CSVConfig, 'file'>;

export const AVAILABLE_STACKS = Object.keys(STACK_CONFIG) as StackName[];

export class BM25 {
    private readonly k1: number;
    private readonly b: number;
    private corpus: string[][] = [];
    private docLengths: number[] = [];
    private avgdl = 0;
    private idf: Record<string, number> = {};
    private readonly docFreqs = new Map<string, number>();

    constructor(k1 = 1.5, b = 0.75) {
        this.k1 = k1;
        this.b = b;
    }

    fit(documents: string[]): void {
        this.corpus = documents.map(document => tokenize(document));
        this.docLengths = this.corpus.map(document => document.length);
        this.avgdl = this.docLengths.length === 0
            ? 0
            : this.docLengths.reduce((sum, length) => sum + length, 0) / this.docLengths.length;
        this.docFreqs.clear();

        for (const document of this.corpus) {
            for (const word of new Set(document)) {
                this.docFreqs.set(word, (this.docFreqs.get(word) ?? 0) + 1);
            }
        }

        this.idf = {};
        const documentCount = this.corpus.length;
        for (const [word, frequency] of this.docFreqs) {
            this.idf[word] = Math.log((documentCount - frequency + 0.5) / (frequency + 0.5) + 1);
        }
    }

    score(query: string): Array<[number, number]> {
        const queryTokens = tokenize(query);
        const scores: Array<[number, number]> = [];

        for (let index = 0; index < this.corpus.length; index++) {
            const document = this.corpus[index];
            const documentLength = this.docLengths[index];
            const termFrequencies = new Map<string, number>();
            for (const word of document) {
                termFrequencies.set(word, (termFrequencies.get(word) ?? 0) + 1);
            }

            let score = 0;
            for (const token of queryTokens) {
                const idf = this.idf[token];
                if (idf === undefined) continue;
                const frequency = termFrequencies.get(token) ?? 0;
                const lengthRatio = this.avgdl === 0 ? 0 : documentLength / this.avgdl;
                const denominator = frequency + this.k1 * (1 - this.b + this.b * lengthRatio);
                if (denominator > 0) {
                    score += idf * (frequency * (this.k1 + 1)) / denominator;
                }
            }
            scores.push([index, score]);
        }

        return scores.sort((left, right) => right[1] - left[1]);
    }
}

const searchCache = new LRUCache<SearchResult>(50, 5 * 60 * 1000);
let cacheHits = 0;
let cacheMisses = 0;

export function clearSearchCache(): void {
    searchCache.clear();
    cacheHits = 0;
    cacheMisses = 0;
}

export function getCacheStats(): { hits: number; misses: number; hitRate: string; cacheSize: number } {
    const total = cacheHits + cacheMisses;
    return {
        hits: cacheHits,
        misses: cacheMisses,
        hitRate: total === 0 ? '0%' : `${(cacheHits / total * 100).toFixed(1)}%`,
        cacheSize: searchCache.size
    };
}

function validateQuery(query: string): string {
    const normalized = query.trim();
    if (!normalized) {
        throw new StudioError('ERR_EMPTY_QUERY', 'Search query must not be empty', true);
    }
    return normalized;
}

function validateMaxResults(maxResults: number): number {
    if (!Number.isInteger(maxResults) || maxResults <= 0) {
        throw new StudioError(
            'ERR_INVALID_ARGUMENT',
            'maxResults must be a positive integer',
            true,
            { maxResults }
        );
    }
    return maxResults;
}

export function isSearchDomain(value: string): value is SearchDomain {
    return Object.prototype.hasOwnProperty.call(CSV_CONFIG, value);
}

export function isStackName(value: string): value is StackName {
    return Object.prototype.hasOwnProperty.call(STACK_CONFIG, value);
}

function assertColumns(data: CSVRow[], config: CSVConfig): void {
    if (data.length === 0) return;
    const headers = new Set(Object.keys(data[0]));
    const missing = [...config.search_cols, ...config.output_cols].filter(column => !headers.has(column));
    if (missing.length > 0) {
        throw new StudioError(
            'ERR_DATABASE_LOAD',
            `Studio database ${config.file} is missing required columns`,
            true,
            { source: config.file, missingColumns: [...new Set(missing)] }
        );
    }
}

async function searchCSV(
    config: CSVConfig,
    query: string,
    maxResults: number
): Promise<CSVRow[]> {
    const data = await loadCSV(config.file);
    assertColumns(data, config);
    if (data.length === 0) return [];

    const search = new BM25();
    search.fit(data.map(row => buildDocument(row, [...config.search_cols])));
    const results: CSVRow[] = [];

    for (const [index, score] of search.score(query)) {
        if (score <= 0 || results.length >= maxResults) continue;
        results.push(extractColumns(data[index], [...config.output_cols]));
    }
    return results;
}

export function detectDomain(query: string): SearchDomain {
    const queryLower = query.toLowerCase();
    const keywords: Record<SearchDomain, readonly string[]> = {
        color: ['color', 'palette', 'hex', '#', 'rgb'],
        chart: ['chart', 'graph', 'visualization', 'trend', 'bar', 'pie', 'scatter', 'heatmap', 'funnel'],
        landing: ['landing', 'page', 'cta', 'conversion', 'hero', 'testimonial', 'pricing', 'section'],
        product: ['saas', 'ecommerce', 'e-commerce', 'fintech', 'healthcare', 'gaming', 'portfolio', 'crypto', 'dashboard'],
        prompt: ['prompt', 'css', 'implementation', 'variable', 'checklist', 'tailwind'],
        style: ['style', 'design', 'ui', 'minimalism', 'glassmorphism', 'neumorphism', 'brutalism', 'dark mode', 'flat', 'aurora'],
        ux: ['ux', 'usability', 'accessibility', 'wcag', 'touch', 'scroll', 'animation', 'keyboard', 'navigation', 'mobile'],
        typography: ['font', 'typography', 'heading', 'serif', 'sans'],
        icons: ['icon', 'icons', 'lucide', 'heroicons', 'symbol', 'glyph', 'pictogram', 'svg icon'],
        react: ['react', 'next.js', 'nextjs', 'suspense', 'memo', 'usecallback', 'useeffect', 'rerender', 'bundle', 'waterfall', 'barrel', 'dynamic import', 'rsc', 'server component'],
        web: ['aria', 'focus', 'outline', 'semantic', 'virtualize', 'autocomplete', 'form', 'input type', 'preconnect']
    };

    let bestDomain: SearchDomain = 'style';
    let bestScore = 0;
    for (const [domain, domainKeywords] of Object.entries(keywords) as Array<[SearchDomain, readonly string[]]>) {
        const score = domainKeywords.filter(keyword => queryLower.includes(keyword)).length;
        if (score > bestScore) {
            bestDomain = domain;
            bestScore = score;
        }
    }
    return bestDomain;
}

export async function search(
    query: string,
    domain: string | null = null,
    maxResults = MAX_RESULTS,
    options: SearchOptions = {}
): Promise<SearchResult> {
    const normalizedQuery = validateQuery(query);
    const resultLimit = validateMaxResults(maxResults);
    const selectedDomain = domain ?? detectDomain(normalizedQuery);
    if (!isSearchDomain(selectedDomain)) {
        throw new StudioError(
            'ERR_UNKNOWN_CATEGORY',
            `Unknown domain: ${selectedDomain}. Available: ${Object.keys(CSV_CONFIG).join(', ')}`,
            true,
            { category: selectedDomain }
        );
    }

    const useCache = options.useCache ?? true;
    const cacheKey = LRUCache.generateKey(normalizedQuery, selectedDomain, resultLimit);
    if (useCache) {
        const cached = searchCache.get(cacheKey);
        if (cached) {
            cacheHits++;
            return { ...cached, cached: true };
        }
        cacheMisses++;
    }

    const config = CSV_CONFIG[selectedDomain];
    const results = await searchCSV(config, normalizedQuery, resultLimit);
    const result: SearchResult = {
        domain: selectedDomain,
        query: normalizedQuery,
        file: config.file,
        count: results.length,
        results,
        cached: false
    };
    if (useCache) searchCache.set(cacheKey, result);
    return result;
}

export async function searchStack(
    query: string,
    stack: string,
    maxResults = MAX_RESULTS
): Promise<StackSearchResult> {
    const normalizedQuery = validateQuery(query);
    const resultLimit = validateMaxResults(maxResults);
    if (!isStackName(stack)) {
        throw new StudioError(
            'ERR_UNKNOWN_CATEGORY',
            `Unknown stack: ${stack}. Available: ${AVAILABLE_STACKS.join(', ')}`,
            true,
            { category: stack }
        );
    }

    const file = STACK_CONFIG[stack].file;
    const results = await searchCSV({ file, ...STACK_COLS }, normalizedQuery, resultLimit);
    return {
        domain: 'stack',
        stack,
        query: normalizedQuery,
        file,
        count: results.length,
        results,
        cached: false
    };
}
