/**
 * CSV Loader Utility - Studio Scripts
 * ====================================
 * CSV parsing with UTF-8 encoding support
 */

import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { StudioError, type CSVRow } from '../types.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory path (relative to scripts/)
export const DATA_DIR = join(__dirname, '..', '..', 'data');

export type { CSVRow } from '../types.ts';

/**
 * Load CSV file and return array of objects
 */
export async function loadCSV(filepath: string): Promise<CSVRow[]> {
    try {
        const fullPath = join(DATA_DIR, filepath);
        const content = await readFile(fullPath, 'utf-8');

        const records: CSVRow[] = parse(content, {
            columns: true,
            skip_empty_lines: true,
            trim: true,
            encoding: 'utf-8'
        });

        return records;
    } catch (error: unknown) {
        const cause = error instanceof Error ? error.message : String(error);
        throw new StudioError(
            'ERR_DATABASE_LOAD',
            `Unable to load Studio database: ${filepath}`,
            true,
            { source: filepath, operation: 'load_csv', cause }
        );
    }
}

/**
 * Load CSV and check if file exists
 */
export type SafeCSVResult =
    | { ok: true; data: CSVRow[] }
    | { ok: false; error: StudioError };

export async function loadCSVSafe(filepath: string): Promise<SafeCSVResult> {
    try {
        const data = await loadCSV(filepath);
        return { ok: true, data };
    } catch (error: unknown) {
        const studioError = error instanceof StudioError
            ? error
            : new StudioError('ERR_DATABASE_LOAD', `Unable to load Studio database: ${filepath}`, true);
        return { ok: false, error: studioError };
    }
}
