#!/usr/bin/env node
/**
 * Problem Checker Script (ES Module version)
 * 
 * Runs TypeScript check and parses output to detect IDE problems.
 * Part of the problem-checker skill.
 * 
 * Usage:
 *   node check_problems.js [directory]
 *   node check_problems.js --fix [directory]
 * 
 * Exit codes:
 *   0 - No errors
 *   1 - Errors found
 *   2 - Script error
 */

import { execSync } from 'child_process';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ANSI colors
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// Parse arguments
const args = process.argv.slice(2);
const shouldFix = args.includes('--fix');
const directory = path.resolve(args.find(a => !a.startsWith('--')) || process.cwd());

console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
console.log(`${colors.cyan}║${colors.reset}  🔍 Problem Checker                     ${colors.cyan}║${colors.reset}`);
console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}`);
console.log(`${colors.gray}Directory: ${directory}${colors.reset}\n`);

// Check if directory exists and has tsconfig
const tsconfigPath = path.join(directory, 'tsconfig.json');
if (!fs.existsSync(tsconfigPath)) {
    console.log(`${colors.yellow}⚠️  No tsconfig.json found. Skipping TypeScript check.${colors.reset}`);
    process.exit(0);
}

// Run TypeScript check
function runTypeCheck() {
    console.log(`${colors.blue}Running TypeScript check...${colors.reset}\n`);

    try {
        execSync('npx tsc --noEmit', {
            cwd: directory,
            encoding: 'utf8',
            stdio: ['pipe', 'pipe', 'pipe']
        });

        // No output = no errors
        console.log(`${colors.green}✅ No TypeScript errors found!${colors.reset}`);
        return { errors: [], warnings: [] };

    } catch (error) {
        // Parse TypeScript errors
        const output = error.stdout || error.stderr || error.message || '';
        return parseTypeScriptOutput(output);
    }
}

// Parse TypeScript output
function parseTypeScriptOutput(output) {
    const errors = [];
    const warnings = [];

    const lines = output.split('\n');
    // Match patterns like: file.tsx(10,5): error TS2304: Cannot find name 'X'
    const errorPattern = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/;

    for (const line of lines) {
        const match = line.match(errorPattern);
        if (match) {
            const [, file, lineNum, col, severity, code, message] = match;
            const problem = {
                file: path.resolve(directory, file),
                line: parseInt(lineNum),
                column: parseInt(col),
                severity: severity === 'error' ? 'error' : 'warning',
                code,
                message: message.trim()
            };

            if (severity === 'error') {
                errors.push(problem);
            } else {
                warnings.push(problem);
            }
        }
    }

    return { errors, warnings };
}

// Auto-fix common issues
function autoFix(problems) {
    const fixed = [];
    const unfixed = [];

    for (const problem of problems) {
        const fixApplied = tryFix(problem);
        if (fixApplied) {
            fixed.push({ ...problem, fix: fixApplied });
        } else {
            unfixed.push(problem);
        }
    }

    return { fixed, unfixed };
}

// Try to apply a fix for a specific problem
function tryFix(problem) {
    const { file, message } = problem;

    // Check if file exists
    if (!fs.existsSync(file)) {
        return null;
    }

    const content = fs.readFileSync(file, 'utf8');
    let newContent = content;
    let fixDescription = null;

    // Fix: Cannot find namespace 'JSX'
    if (message.includes("Cannot find namespace 'JSX'")) {
        if (!content.includes("import { ReactNode }") && !content.includes("import React")) {
            // Add ReactNode import
            if (content.includes("from 'react'")) {
                newContent = content.replace(
                    /import\s*{([^}]+)}\s*from\s*['"]react['"]/,
                    (match, imports) => {
                        if (!imports.includes('ReactNode')) {
                            return `import {${imports}, ReactNode } from 'react'`;
                        }
                        return match;
                    }
                );
            } else {
                // Add new import at top
                newContent = `import { ReactNode } from 'react';\n${content}`;
            }

            // Replace JSX.Element with ReactNode
            newContent = newContent.replace(/JSX\.Element/g, 'ReactNode');
            fixDescription = "Added ReactNode import, replaced JSX.Element";
        }
    }

    // Fix: Unused variable (add underscore prefix)
    if (message.includes("is declared but") && message.includes("never used")) {
        const varMatch = message.match(/'([^']+)'/);
        if (varMatch) {
            const varName = varMatch[1];
            // Only prefix if not already prefixed
            if (!varName.startsWith('_')) {
                const regex = new RegExp(`\\b(const|let|var)\\s+${varName}\\b`, 'g');
                newContent = content.replace(regex, `$1 _${varName}`);
                fixDescription = `Prefixed unused variable: _${varName}`;
            }
        }
    }

    // Apply fix if content changed
    if (newContent !== content) {
        fs.writeFileSync(file, newContent, 'utf8');
        return fixDescription;
    }

    return null;
}

// Print problems
function printProblems(problems, type) {
    const icon = type === 'error' ? '❌' : '⚠️';
    const color = type === 'error' ? colors.red : colors.yellow;

    for (const p of problems) {
        const relativePath = path.relative(directory, p.file);
        console.log(`${color}${icon} ${relativePath}:${p.line}:${p.column}${colors.reset}`);
        console.log(`   ${colors.gray}${p.code}: ${p.message}${colors.reset}`);
    }
}

// Main execution
async function main() {
    const { errors, warnings } = runTypeCheck();

    if (errors.length === 0 && warnings.length === 0) {
        process.exit(0);
    }

    console.log(`\n${colors.red}Found ${errors.length} errors${colors.reset}`);
    if (warnings.length > 0) {
        console.log(`${colors.yellow}Found ${warnings.length} warnings${colors.reset}`);
    }

    console.log('\n--- Errors ---');
    printProblems(errors, 'error');

    if (warnings.length > 0) {
        console.log('\n--- Warnings ---');
        printProblems(warnings, 'warning');
    }

    if (shouldFix) {
        console.log(`\n${colors.blue}Attempting auto-fix...${colors.reset}\n`);

        const allProblems = [...errors, ...warnings];
        const { fixed, unfixed } = autoFix(allProblems);

        if (fixed.length > 0) {
            console.log(`${colors.green}✅ Fixed ${fixed.length} issues:${colors.reset}`);
            for (const f of fixed) {
                const relativePath = path.relative(directory, f.file);
                console.log(`   ${colors.green}✓${colors.reset} ${relativePath}: ${f.fix}`);
            }
        }

        if (unfixed.length > 0) {
            console.log(`\n${colors.yellow}⚠️  ${unfixed.length} issues require manual fix:${colors.reset}`);
            printProblems(unfixed, 'warning');
        }

        // Re-run check to verify fixes
        if (fixed.length > 0) {
            console.log(`\n${colors.blue}Re-checking after fixes...${colors.reset}\n`);
            const recheck = runTypeCheck();

            if (recheck.errors.length === 0) {
                console.log(`${colors.green}✅ All errors resolved!${colors.reset}`);
                process.exit(0);
            } else {
                console.log(`${colors.red}❌ ${recheck.errors.length} errors remain${colors.reset}`);
                process.exit(1);
            }
        }
    }

    // Exit with error code if errors found
    process.exit(errors.length > 0 ? 1 : 0);
}

main().catch(err => {
    console.error(`${colors.red}Script error: ${err.message}${colors.reset}`);
    process.exit(2);
});
