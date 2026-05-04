/**
 * Ambient module declarations for external packages
 * These scripts reference optional external dependencies
 * that are only installed in target projects, not in the skill kit itself.
 *
 * @version 3.9.167
 */

declare module 'playwright' {
    export const chromium: {
        connect(wsEndpoint: string): Promise<Browser>;
        launch(options?: { headless?: boolean }): Promise<Browser>;
        launchServer(options?: { headless?: boolean }): Promise<BrowserServer>;
    };

    export interface BrowserServer {
        wsEndpoint(): string;
        close(): Promise<void>;
    }

    export interface Browser {
        wsEndpoint(): string;
        contexts(): BrowserContext[];
        newContext(): Promise<BrowserContext>;
        close(): Promise<void>;
        disconnect(): Promise<void>;
        pages(): Page[];
        killed?: boolean;
    }

    export interface BrowserContext {
        pages(): Page[];
        newPage(): Promise<Page>;
        close(): Promise<void>;
    }

    export interface Page {
        goto(url: string, options?: { waitUntil?: string; timeout?: number }): Promise<void>;
        url(): string;
        title(): Promise<string>;
        screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer>;
        evaluate<T>(fn: (...args: unknown[]) => T, ...args: unknown[]): Promise<T>;
        locator(selector: string): Locator;
        content(): Promise<string>;
    }

    export interface Locator {
        click(options?: { timeout?: number }): Promise<void>;
        fill(text: string, options?: { timeout?: number }): Promise<void>;
        count(): Promise<number>;
    }
}

declare module 'puppeteer' {
    export interface Browser {
        wsEndpoint(): string;
        pages(): Promise<Page[]>;
        newPage(): Promise<Page>;
        close(): Promise<void>;
        killed?: boolean;
    }

    export interface Page {
        goto(url: string, options?: { waitUntil?: string }): Promise<void>;
        screenshot(options?: { path?: string; fullPage?: boolean }): Promise<Buffer>;
    }

    const puppeteer: {
        connect(options: { browserWSEndpoint: string }): Promise<Browser>;
        launch(options?: { headless?: boolean }): Promise<Browser>;
    };
    export default puppeteer;
}

declare module 'csv-parse/sync' {
    export function parse(content: string, options?: {
        columns?: boolean;
        skip_empty_lines?: boolean;
        trim?: boolean;
        encoding?: string;
    }): Record<string, string>[];
}
