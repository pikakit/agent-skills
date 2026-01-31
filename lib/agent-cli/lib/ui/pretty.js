/**
 * @fileoverview Pretty output formatting for PikaKit
 * Creates branded, friendly CLI messages
 */

import pc from "picocolors";
import boxen from "boxen";
import { VERSION } from "../config.js";

// ============================================================================
// BRANDING
// ============================================================================

/** Brand colors using picocolors */
const brand = {
    primary: pc.cyan,
    success: pc.green,
    warning: pc.yellow,
    error: pc.red,
    dim: pc.dim,
    bold: pc.bold
};

/** Simple ASCII logo */
const LOGO = `
  ╭─────────────────────────╮
  │  🧠 PikaKit     │
  │     v${VERSION}             │
  ╰─────────────────────────╯
`;

// ============================================================================
// MESSAGE FORMATTERS
// ============================================================================

/**
 * Show branded header
 */
export function showBrandHeader() {
    console.log(brand.primary(LOGO));
}

/**
 * Create a nice box message
 * @param {string} message - Message content
 * @param {object} options - Box options
 */
export function box(message, options = {}) {
    return "\n" + boxen(message, {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        margin: { top: 0, bottom: 1, left: 0, right: 0 },
        borderStyle: "round",
        borderColor: "cyan",
        ...options
    });
}

/**
 * Format success message
 * @param {string} message
 */
export function success(message) {
    console.log(`${brand.success("✓")} ${message}`);
}

/**
 * Format error message
 * @param {string} message
 */
export function error(message) {
    console.log(`${brand.error("✗")} ${message}`);
}

/**
 * Format warning message
 * @param {string} message
 */
export function warning(message) {
    console.log(`${brand.warning("!")} ${message}`);
}

/**
 * Format info message
 * @param {string} message
 */
export function info(message) {
    console.log(`${brand.dim("›")} ${message}`);
}

/**
 * Show scan summary in a nice format
 * @param {object} stats - { filesScanned, ignored, violations, errors, warnings }
 */
export function showScanSummary(stats) {
    const lines = [];

    if (stats.filesScanned !== undefined) {
        lines.push(`  ${brand.success("✓")} ${stats.filesScanned} file(s) scanned`);
    }

    if (stats.ignored > 0) {
        lines.push(`  ${brand.dim("›")} ${stats.ignored} paths ignored`);
    }

    if (stats.violations === 0) {
        lines.push(`  ${brand.success("✓")} No violations found`);
    } else {
        lines.push(`  ${brand.error("✗")} ${stats.violations} violation(s)`);
        if (stats.errors > 0) {
            lines.push(`    ${brand.error(`${stats.errors} error(s)`)}`);
        }
        if (stats.warnings > 0) {
            lines.push(`    ${brand.warning(`${stats.warnings} warning(s)`)}`);
        }
    }

    console.log(lines.join("\n"));

    // Final message with spacing
    if (stats.violations === 0) {
        console.log(`\n  ${brand.success(brand.bold("All clear!"))} Your code looks great. 🎉\n`);
    } else {
        console.log(`\n  ${brand.warning("Review the issues above before committing.")}\n`);
    }
}

/**
 * Show a friendly completion message
 * @param {string} action - What was completed
 */
export function done(action) {
    console.log(`\n${brand.success("Done!")} ${action}\n`);
}

export default {
    showBrandHeader,
    box,
    success,
    error,
    warning,
    info,
    showScanSummary,
    done,
    brand
};
