export type CSVRow = Record<string, string>;

export const STUDIO_ERROR_CODES = [
    'ERR_EMPTY_QUERY',
    'ERR_UNKNOWN_CATEGORY',
    'ERR_INVALID_ARGUMENT',
    'ERR_DATABASE_LOAD',
    'ERR_INVALID_REQUEST_TYPE'
] as const;

export type StudioErrorCode = typeof STUDIO_ERROR_CODES[number];

export interface StudioErrorDetails {
    source?: string;
    operation?: string;
    cause?: string;
    [key: string]: unknown;
}

export class StudioError extends Error {
    readonly code: StudioErrorCode;
    readonly recoverable: boolean;
    readonly details?: StudioErrorDetails;

    constructor(
        code: StudioErrorCode,
        message: string,
        recoverable: boolean,
        details?: StudioErrorDetails
    ) {
        super(message);
        this.name = 'StudioError';
        this.code = code;
        this.recoverable = recoverable;
        this.details = details;
    }

    toJSON(): Record<string, unknown> {
        return {
            code: this.code,
            message: this.message,
            recoverable: this.recoverable,
            ...(this.details ? { details: this.details } : {})
        };
    }
}

export function toStudioError(error: unknown): StudioError {
    if (error instanceof StudioError) return error;
    const message = error instanceof Error ? error.message : String(error);
    return new StudioError('ERR_INVALID_REQUEST_TYPE', message, false, { cause: message });
}

export interface CSVConfig {
    file: string;
    search_cols: readonly string[];
    output_cols: readonly string[];
}

export interface SearchResult {
    domain: string;
    query: string;
    file: string;
    count: number;
    results: CSVRow[];
    cached: boolean;
}

export interface StackSearchResult extends SearchResult {
    domain: 'stack';
    stack: string;
}

export interface SearchOptions {
    useCache?: boolean;
}

export interface ColorPalette {
    primary: string;
    secondary: string;
    cta: string;
    background: string;
    text: string;
    notes: string;
    border?: string;
}

export interface Typography {
    heading: string;
    body: string;
    mood: string;
    best_for: string;
    google_fonts_url: string;
    css_import: string;
}

export interface DesignPattern {
    name: string;
    sections: string;
    cta_placement: string;
    color_strategy: string;
    conversion: string;
}

export interface DesignStyle {
    name: string;
    type: string;
    effects: string;
    keywords: string;
    best_for: string;
    performance: string;
    accessibility: string;
}

export interface DesignSystem {
    project_name: string;
    category: string;
    pattern: DesignPattern;
    style: DesignStyle;
    colors: ColorPalette;
    typography: Typography;
    key_effects: string;
    anti_patterns: string;
    decision_rules: Record<string, unknown>;
    severity: string;
}

export interface ReasoningRow extends CSVRow {
    UI_Category: string;
    Recommended_Pattern: string;
    Style_Priority: string;
    Color_Mood: string;
    Typography_Mood: string;
    Key_Effects: string;
    Decision_Rules: string;
    Anti_Patterns: string;
    Severity: string;
}

export interface AppliedReasoning {
    pattern: string;
    style_priority: string[];
    color_mood: string;
    typography_mood: string;
    key_effects: string;
    anti_patterns: string;
    decision_rules: Record<string, unknown>;
    severity: string;
}

export interface PageOverrides {
    page_type?: string;
    layout: Record<string, string>;
    spacing: Record<string, string>;
    typography: Record<string, string>;
    colors: Record<string, string>;
    components: string[];
    unique_components: string[];
    recommendations: string[];
}

export interface CustomPattern {
    keywords: string[];
    type: string;
}

export interface StudioConfig {
    $schema?: string;
    customPatterns?: CustomPattern[];
}

export interface CSSValidationError {
    message: string;
    line: number;
    column: number;
}

export interface CSSValidationResult {
    valid: boolean;
    errors: CSSValidationError[];
}

export interface CSSValidationOptions {
    strict?: boolean;
}

export interface MarkdownCSSValidation {
    valid: boolean;
    warnings: string[];
}

export interface PagePattern {
    keywords: string[];
    type: string;
}

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
    | string;
