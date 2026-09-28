declare module 'css-tree' {
    export interface CssTreeParseError extends Error {
        line?: number;
        column?: number;
    }

    export interface ParseOptions {
        onParseError?: (error: CssTreeParseError) => void;
    }

    export function parse(css: string, options?: ParseOptions): unknown;
}
