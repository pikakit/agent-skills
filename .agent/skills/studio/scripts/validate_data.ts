#!/usr/bin/env node
import { readdir, readFile } from 'fs/promises';
import { dirname, relative, resolve, sep } from 'path';
import { fileURLToPath } from 'url';
import { parse } from 'csv-parse/sync';
import { CSV_CONFIG, STACK_COLS, STACK_CONFIG } from './core.ts';
import { DATA_DIR } from './utils/csv-loader.ts';
import { StudioError } from './types.ts';

const EXPECTED_ROW_COUNTS: Readonly<Record<string, number>> = {
    'charts.csv': 25,
    'colors.csv': 96,
    'icons.csv': 100,
    'landing.csv': 30,
    'products.csv': 96,
    'prompts.csv': 23,
    'react-performance.csv': 44,
    'stacks/flutter.csv': 51,
    'stacks/html-tailwind.csv': 55,
    'stacks/jetpack-compose.csv': 52,
    'stacks/nextjs.csv': 52,
    'stacks/nuxt-ui.csv': 50,
    'stacks/nuxtjs.csv': 58,
    'stacks/react-native.csv': 51,
    'stacks/react.csv': 53,
    'stacks/shadcn.csv': 60,
    'stacks/svelte.csv': 53,
    'stacks/swiftui.csv': 50,
    'stacks/vue.csv': 49,
    'styles.csv': 58,
    'typography.csv': 57,
    'ui-reasoning.csv': 100,
    'ux-guidelines.csv': 99,
    'web-interface.csv': 30
};

export interface StudioDataValidationReport {
    files: number;
    rows: number;
    sources: Array<{ file: string; rows: number; columns: number }>;
}

async function findCsvFiles(directory: string): Promise<string[]> {
    const entries = await readdir(directory, { withFileTypes: true });
    const nested = await Promise.all(entries.map(async entry => {
        const path = resolve(directory, entry.name);
        if (entry.isDirectory()) return findCsvFiles(path);
        return entry.isFile() && entry.name.endsWith('.csv') ? [path] : [];
    }));
    return nested.flat().sort();
}

function normalizedRelativePath(path: string): string {
    return relative(DATA_DIR, path).split(sep).join('/');
}

function assertRequiredColumns(
    file: string,
    headers: readonly string[],
    requiredColumns: readonly string[]
): void {
    const headerSet = new Set(headers);
    const missing = requiredColumns.filter(column => !headerSet.has(column));
    if (missing.length > 0) {
        throw new StudioError(
            'ERR_DATABASE_LOAD',
            `Studio database ${file} is missing required columns: ${missing.join(', ')}`,
            true,
            { source: file, missingColumns: missing }
        );
    }
}

export async function validateStudioData(): Promise<StudioDataValidationReport> {
    const paths = await findCsvFiles(DATA_DIR);
    const expectedFiles = Object.keys(EXPECTED_ROW_COUNTS).sort();
    const actualFiles = paths.map(normalizedRelativePath);
    if (JSON.stringify(actualFiles) !== JSON.stringify(expectedFiles)) {
        throw new StudioError(
            'ERR_DATABASE_LOAD',
            'Studio CSV inventory does not match the validated manifest',
            true,
            { expectedFiles, actualFiles }
        );
    }

    const sources: StudioDataValidationReport['sources'] = [];
    const headersByFile = new Map<string, string[]>();
    for (const path of paths) {
        const file = normalizedRelativePath(path);
        const content = await readFile(path, 'utf8');
        let records: string[][];
        try {
            records = parse(content, { columns: false, skip_empty_lines: true, trim: true });
        } catch (error: unknown) {
            const cause = error instanceof Error ? error.message : String(error);
            throw new StudioError(
                'ERR_DATABASE_LOAD',
                `Invalid CSV syntax in ${file}`,
                true,
                { source: file, cause }
            );
        }

        if (records.length === 0 || records[0].length === 0) {
            throw new StudioError('ERR_DATABASE_LOAD', `Studio database ${file} is empty`, true, {
                source: file
            });
        }
        const headers = records[0];
        if (new Set(headers).size !== headers.length || headers.some(header => !header)) {
            throw new StudioError('ERR_DATABASE_LOAD', `Studio database ${file} has invalid headers`, true, {
                source: file,
                headers
            });
        }
        const invalidRow = records.slice(1).findIndex(record => record.length !== headers.length);
        if (invalidRow >= 0) {
            throw new StudioError(
                'ERR_DATABASE_LOAD',
                `Studio database ${file} has ${records[invalidRow + 1].length} columns on row ${invalidRow + 2}; expected ${headers.length}`,
                true,
                { source: file, row: invalidRow + 2 }
            );
        }

        const rowCount = records.length - 1;
        if (rowCount !== EXPECTED_ROW_COUNTS[file]) {
            throw new StudioError(
                'ERR_DATABASE_LOAD',
                `Studio database ${file} has ${rowCount} rows; expected ${EXPECTED_ROW_COUNTS[file]}`,
                true,
                { source: file, rowCount, expectedRows: EXPECTED_ROW_COUNTS[file] }
            );
        }
        headersByFile.set(file, headers);
        sources.push({ file, rows: rowCount, columns: headers.length });
    }

    for (const config of Object.values(CSV_CONFIG)) {
        const headers = headersByFile.get(config.file);
        if (!headers) {
            throw new StudioError('ERR_DATABASE_LOAD', `Configured Studio database is missing: ${config.file}`, true);
        }
        assertRequiredColumns(config.file, headers, [...config.search_cols, ...config.output_cols]);
    }
    for (const config of Object.values(STACK_CONFIG)) {
        const headers = headersByFile.get(config.file);
        if (!headers) {
            throw new StudioError('ERR_DATABASE_LOAD', `Configured Studio database is missing: ${config.file}`, true);
        }
        assertRequiredColumns(config.file, headers, [...STACK_COLS.search_cols, ...STACK_COLS.output_cols]);
    }

    return {
        files: sources.length,
        rows: sources.reduce((total, source) => total + source.rows, 0),
        sources
    };
}

const isMain = process.argv[1]
    ? resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url))
    : false;

if (isMain) {
    validateStudioData()
        .then(report => {
            console.log(`Studio data valid: ${report.files} files, ${report.rows} rows`);
        })
        .catch((error: unknown) => {
            const message = error instanceof Error ? error.message : String(error);
            console.error(message);
            process.exitCode = 1;
        });
}
