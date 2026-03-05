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
};

/**
 * Print header with bold cyan styling
 */
export function printHeader(text) {
    const width = 70;
    const separator = '='.repeat(width);
    console.log(`\n${colors.bold}${colors.cyan}${separator}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${text.padStart((width + text.length) / 2).padEnd(width)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${separator}${colors.reset}\n`);
}

/**
 * Print step indicator (in progress)
 */
export function printStep(text) {
    console.log(`${colors.bold}${colors.blue}🔄 ${text}${colors.reset}`);
}

/**
 * Print success message
 */
export function printSuccess(text) {
    console.log(`${colors.green}✅ ${text}${colors.reset}`);
}

/**
 * Print warning message
 */
export function printWarning(text) {
    console.log(`${colors.yellow}⚠️  ${text}${colors.reset}`);
}

/**
 * Print error message
 */
export function printError(text) {
    console.log(`${colors.red}❌ ${text}${colors.reset}`);
}
