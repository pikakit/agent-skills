/**
 * CSV Loader Utility - Studio Scripts
 * ====================================
 * CSV parsing with UTF-8 encoding support
 * JavaScript port of Python's csv.DictReader
 */

import { readFile } from 'fs/promises';
import { parse } from 'csv-parse/sync';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Data directory path (relative to scripts-js/)
export const DATA_DIR = join(__dirname, '..', '..', 'data');

/**
 * Load CSV file and return array of objects
 * @param {string} filepath - Relative path from DATA_DIR
 * @returns {Promise<Array<Object>>} Array of row objects
 */
export async function loadCSV(filepath) {
    try {
        const fullPath = join(DATA_DIR, filepath);
        const content = await readFile(fullPath, 'utf-8');

        const records = parse(content, {
            columns: true,        // First row as headers
            skip_empty_lines: true,
            trim: true,
            encoding: 'utf-8'
        });

        return records;
    } catch (error) {
        console.error(`Error loading CSV: ${filepath}`, error.message);
        return [];
    }
}

/**
 * Load CSV and check if file exists
 * @param {string} filepath - Relative path from DATA_DIR
 * @returns {Promise<{exists: boolean, data: Array}>}
 */
export async function loadCSVSafe(filepath) {
    try {
        const data = await loadCSV(filepath);
        return { exists: true, data };
    } catch (error) {
        return { exists: false, data: [] };
    }
}
