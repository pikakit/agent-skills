/**
 * Clack UI Helpers - Agent Skill Kit
 * Reusable UI patterns for consistent CLI experience
 */

import * as p from '@clack/prompts';
import color from 'picocolors';

// ============================================================================
// COLOR SCHEME
// ============================================================================

export const theme = {
    // Primary colors
    primary: color.cyan,
    success: color.green,
    error: color.red,
    warning: color.yellow,
    info: color.blue,

    // Text styles
    dim: color.dim,
    bold: color.bold,

    // Brand color
    brand: (text) => color.bgCyan(color.black(text)),
};

// ============================================================================
// INTRO & OUTRO
// ============================================================================

/**
 * Show branded intro banner
 * @param {string} title - Title text to display
 */
export function showIntro(title) {
    console.clear();
    p.intro(theme.brand(` ${title} `));
}

/**
 * Show success outro
 * @param {string} message - Success message
 */
export function showSuccess(message) {
    p.outro(theme.success(`✓ ${message}`));
}

/**
 * Show error outro
 * @param {string} message - Error message
 */
export function showError(message) {
    p.outro(theme.error(`✗ ${message}`));
}

/**
 * Show info outro
 * @param {string} message - Info message
 */
export function showInfo(message) {
    p.outro(theme.info(message));
}

// ============================================================================
// MENUS
// ============================================================================

/**
 * Show main action menu with Exit option
 * @param {Object} options
 * @param {string} options.message - Menu message
 * @param {Array} options.items - Menu items {value, label, hint?}
 * @param {boolean} options.includeExit - Include Exit option (default: true)
 * @returns {Promise<string|null>} Selected value or null if cancelled
 */
export async function showActionMenu({ message, items, includeExit = true }) {
    const menuItems = [...items];

    if (includeExit) {
        menuItems.push({ value: 'exit', label: 'Exit', hint: 'Close CLI' });
    }

    const selected = await p.select({
        message,
        options: menuItems,
    });

    if (p.isCancel(selected) || selected === 'exit') {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }

    return selected;
}

/**
 * Show confirmation prompt
 * @param {string} message - Confirmation message
 * @param {boolean} initialValue - Default value
 * @returns {Promise<boolean>}
 */
export async function confirm(message, initialValue = false) {
    const result = await p.confirm({
        message,
        initialValue,
    });

    if (p.isCancel(result)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }

    return result;
}

// ============================================================================
// INPUTS
// ============================================================================

/**
 * Get text input with validation
 * @param {Object} options
 * @param {string} options.message - Input message
 * @param {string} options.placeholder - Placeholder text
 * @param {Function} options.validate - Validation function
 * @returns {Promise<string>}
 */
export async function textInput({ message, placeholder = '', validate }) {
    const result = await p.text({
        message,
        placeholder,
        validate,
    });

    if (p.isCancel(result)) {
        p.cancel('Operation cancelled.');
        process.exit(0);
    }

    return result;
}

// ============================================================================
// PROGRESS
// ============================================================================

/**
 * Create and manage a spinner
 * @param {string} message - Initial message
 * @returns {Object} Spinner instance with update/stop methods
 */
export function createSpinner(message) {
    const spinner = p.spinner();
    spinner.start(message);

    return {
        update: (msg) => {
            spinner.message(msg);
        },
        stop: (msg) => {
            spinner.stop(msg);
        },
        stopSuccess: (msg) => {
            spinner.stop(theme.success(`✓ ${msg}`));
        },
        stopError: (msg) => {
            spinner.stop(theme.error(`✗ ${msg}`));
        },
    };
}

// ============================================================================
// NOTES & INFO BOXES
// ============================================================================

/**
 * Show info note box
 * @param {string} content - Note content
 * @param {string} title - Note title (optional)
 */
export function showNote(content, title = '') {
    p.note(content, title);
}

/**
 * Show success note
 * @param {string} content - Note content
 * @param {string} title - Note title
 */
export function showSuccessNote(content, title = '✓ Success') {
    p.note(content, theme.success(title));
}

/**
 * Show error note
 * @param {string} content - Note content
 * @param {string} title - Note title
 */
export function showErrorNote(content, title = '✗ Error') {
    p.note(content, theme.error(title));
}

/**
 * Show info note with cyan title
 * @param {string} content - Note content
 * @param {string} title - Note title
 */
export function showInfoNote(content, title) {
    p.note(content, theme.primary(title));
}

// ============================================================================
// RESULTS
// ============================================================================

/**
 * Format results for display
 * @param {Object} results - Results object
 * @returns {string} Formatted string
 */
export function formatResults(results) {
    const lines = [];

    if (results.success !== undefined) {
        const icon = results.success ? theme.success('✓') : theme.error('✗');
        lines.push(`${icon} ${results.message || ''}`);
    }

    if (results.details) {
        lines.push('');
        lines.push(theme.dim('Details:'));
        Object.entries(results.details).forEach(([key, value]) => {
            lines.push(`  ${key}: ${theme.primary(value)}`);
        });
    }

    if (results.errors && results.errors.length > 0) {
        lines.push('');
        lines.push(theme.error('Errors:'));
        results.errors.forEach(err => {
            lines.push(`  ${theme.error('•')} ${err}`);
        });
    }

    return lines.join('\n');
}

// ============================================================================
// NEXT STEPS
// ============================================================================

/**
 * Show next steps guide
 * @param {Array<string>} steps - Array of step descriptions
 */
export function showNextSteps(steps) {
    const content = steps
        .map((step, i) => `${theme.primary(`${i + 1}.`)} ${step}`)
        .join('\n');

    showInfoNote(content, 'Next Steps');
}

// ============================================================================
// UTILITIES
// ============================================================================

/**
 * Check if value is cancelled
 * @param {*} value - Value to check
 * @returns {boolean}
 */
export function isCancelled(value) {
    return p.isCancel(value);
}

/**
 * Handle cancellation
 */
export function handleCancel() {
    p.cancel('Operation cancelled.');
    process.exit(0);
}

export default {
    theme,
    showIntro,
    showSuccess,
    showError,
    showInfo,
    showActionMenu,
    confirm,
    textInput,
    createSpinner,
    showNote,
    showSuccessNote,
    showErrorNote,
    showInfoNote,
    formatResults,
    showNextSteps,
    isCancelled,
    handleCancel,
};
