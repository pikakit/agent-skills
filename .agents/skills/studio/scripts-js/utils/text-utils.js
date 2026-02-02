/**
 * Text Utilities - Studio Scripts
 * ================================
 * Tokenization helpers for BM25 search
 * JavaScript port of Python's BM25.tokenize() method
 */

/**
 * Tokenize text for BM25 search
 * Equivalent to Python: re.sub(r'[^\w\s]', ' ', str(text).lower()).split()
 * @param {string} text - Input text to tokenize
 * @returns {string[]} Array of tokens (words > 2 chars)
 */
export function tokenize(text) {
    if (!text) return [];

    // Convert to string, lowercase, remove punctuation
    const cleaned = String(text)
        .toLowerCase()
        .replace(/[^\w\s]/g, ' ');  // Remove non-word, non-space chars

    // Split and filter words > 2 characters
    return cleaned
        .split(/\s+/)
        .filter(word => word.length > 2);
}

/**
 * Join multiple column values into single searchable document
 * @param {Object} row - CSV row object
 * @param {string[]} columns - Columns to join
 * @returns {string} Joined text
 */
export function buildDocument(row, columns) {
    return columns
        .map(col => row[col] || '')
        .join(' ');
}

/**
 * Extract subset of columns from row object
 * @param {Object} row - Source row object
 * @param {string[]} columns - Columns to extract
 * @returns {Object} Filtered object with only specified columns
 */
export function extractColumns(row, columns) {
    const result = {};
    for (const col of columns) {
        if (col in row) {
            result[col] = row[col];
        }
    }
    return result;
}
