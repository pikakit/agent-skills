#!/usr/bin/env node
/**
 * ANSI Color Utilities - PikaKit
 * ======================================
 * Provides terminal color formatting for output.
 */

export const colors = {
    header: '\x1b[95m',
    blue: '\x1b[94m',
    cyan: '\x1b[96m',
    green: '\x1b[92m',
    yellow: '\x1b[93m',
    red: '\x1b[91m',
    reset: '\x1b[0m',
    bold: '\x1b[1m'
} as const;

export type ColorKey = keyof typeof colors;

/**
 * Print header with bold cyan styling
 */
export function printHeader(text: string): void {
    const width = 70;
    const separator = '='.repeat(width);
    console.log(`\n${colors.bold}${colors.cyan}${separator}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${text.padStart((width + text.length) / 2).padEnd(width)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${separator}${colors.reset}\n`);
}

/**
 * Print step indicator (in progress)
 */
export function printStep(text: string): void {
    console.log(`${colors.bold}${colors.blue}🔄 ${text}${colors.reset}`);
}

/**
 * Print success message
 */
export function printSuccess(text: string): void {
    console.log(`${colors.green}✅ ${text}${colors.reset}`);
}

/**
 * Print warning message
 */
export function printWarning(text: string): void {
    console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`);
}

/**
 * Print error message
 */
export function printError(text: string): void {
    console.log(`${colors.red}❌ ${text}${colors.reset}`);
}
