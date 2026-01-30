#!/usr/bin/env node
/**
 * Error Sensor - Auto-detect errors from multiple sources
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 1
 * 
 * Sensors:
 * - test: Parse vitest/jest output
 * - build: Parse tsc/webpack errors
 * - lint: Parse eslint warnings
 * - runtime: Capture console.error/exceptions
 * 
 * Usage:
 *   node error_sensor.js --scan test
 *   node error_sensor.js --scan build
 *   node error_sensor.js --scan lint
 *   node error_sensor.js --scan all
 *   node error_sensor.js --watch
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

// Find project root
function findProjectRoot() {
    let current = process.cwd();
    while (current !== path.dirname(current)) {
        if (fs.existsSync(path.join(current, '.agent'))) {
            return current;
        }
        current = path.dirname(current);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const knowledgePath = path.join(projectRoot, '.agent', 'knowledge');
const errorsPath = path.join(knowledgePath, 'detected-errors.json');
const lessonsPath = path.join(knowledgePath, 'lessons-learned.json');

// Ensure files exist
function ensureFiles() {
    if (!fs.existsSync(knowledgePath)) {
        fs.mkdirSync(knowledgePath, { recursive: true });
    }
    if (!fs.existsSync(errorsPath)) {
        fs.writeFileSync(errorsPath, JSON.stringify({
            _comment: "Auto-detected errors by error_sensor",
            errors: [],
            lastScan: null
        }, null, 2));
    }
}

// Load detected errors
function loadErrors() {
    ensureFiles();
    try {
        const data = JSON.parse(fs.readFileSync(errorsPath, 'utf8'));
        return data.errors || [];
    } catch {
        return [];
    }
}

// Save detected errors
function saveErrors(errors) {
    ensureFiles();
    const data = {
        _comment: "Auto-detected errors by error_sensor",
        lastScan: new Date().toISOString(),
        totalErrors: errors.length,
        errors
    };
    fs.writeFileSync(errorsPath, JSON.stringify(data, null, 2));
}

// Add error to collection
function addError(error) {
    const errors = loadErrors();

    // Check for duplicates (same type + message within last hour)
    const oneHourAgo = Date.now() - 3600000;
    const isDuplicate = errors.some(e =>
        e.type === error.type &&
        e.message === error.message &&
        new Date(e.timestamp).getTime() > oneHourAgo
    );

    if (!isDuplicate) {
        errors.push({
            id: `ERR-${Date.now()}`,
            ...error,
            timestamp: new Date().toISOString()
        });
        saveErrors(errors);
        return true;
    }
    return false;
}

// ==================== SENSORS ====================

/**
 * Parse test output (vitest/jest)
 */
function scanTestErrors() {
    const errors = [];

    try {
        // Try to run tests and capture output
        const testOutput = execSync('npm test 2>&1', {
            cwd: projectRoot,
            encoding: 'utf8',
            timeout: 60000
        });

        // Parse vitest output
        const failedTests = testOutput.match(/FAIL\s+(.+)/g) || [];
        const errorMessages = testOutput.match(/Error:\s*(.+)/g) || [];
        const assertionFails = testOutput.match(/expect\(.+\)\.(.+)/g) || [];

        for (const fail of failedTests) {
            errors.push({
                type: 'test',
                source: 'vitest',
                message: fail.trim(),
                severity: 'HIGH',
                raw: fail
            });
        }

        for (const err of errorMessages) {
            errors.push({
                type: 'test',
                source: 'vitest',
                message: err.replace('Error:', '').trim(),
                severity: 'HIGH',
                raw: err
            });
        }

    } catch (e) {
        // Test command failed - parse error output
        const output = e.stdout || e.stderr || '';
        const lines = output.split('\n');

        for (const line of lines) {
            if (line.includes('FAIL') || line.includes('Error') || line.includes('✗')) {
                errors.push({
                    type: 'test',
                    source: 'vitest',
                    message: line.trim(),
                    severity: 'HIGH',
                    raw: line
                });
            }
        }
    }

    return errors;
}

/**
 * Parse build errors (TypeScript)
 */
function scanBuildErrors() {
    const errors = [];

    try {
        execSync('npx tsc --noEmit 2>&1', {
            cwd: projectRoot,
            encoding: 'utf8',
            timeout: 60000
        });
    } catch (e) {
        const output = e.stdout || e.stderr || '';
        // Parse TypeScript errors: file.ts(line,col): error TS1234: message
        const tsErrors = output.match(/(.+\.tsx?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)/g) || [];

        for (const err of tsErrors) {
            const match = err.match(/(.+\.tsx?)\((\d+),(\d+)\):\s*error\s+(TS\d+):\s*(.+)/);
            if (match) {
                errors.push({
                    type: 'build',
                    source: 'typescript',
                    file: match[1],
                    line: parseInt(match[2]),
                    code: match[4],
                    message: match[5],
                    severity: 'HIGH',
                    raw: err
                });
            }
        }
    }

    return errors;
}

/**
 * Parse lint errors (ESLint)
 */
function scanLintErrors() {
    const errors = [];

    try {
        execSync('npm run lint 2>&1', {
            cwd: projectRoot,
            encoding: 'utf8',
            timeout: 60000
        });
    } catch (e) {
        const output = e.stdout || e.stderr || '';
        // Parse ESLint output: file.js:line:col  error/warning  message  rule
        const lintErrors = output.match(/(.+):(\d+):(\d+)\s+(error|warning)\s+(.+?)\s{2,}(.+)/g) || [];

        for (const err of lintErrors) {
            const match = err.match(/(.+):(\d+):(\d+)\s+(error|warning)\s+(.+?)\s{2,}(.+)/);
            if (match) {
                errors.push({
                    type: 'lint',
                    source: 'eslint',
                    file: match[1],
                    line: parseInt(match[2]),
                    level: match[4],
                    message: match[5],
                    rule: match[6],
                    severity: match[4] === 'error' ? 'HIGH' : 'MEDIUM',
                    raw: err
                });
            }
        }
    }

    return errors;
}

/**
 * Scan for common code patterns that indicate errors
 */
function scanCodePatterns() {
    const errors = [];
    const srcDirs = ['src', 'lib', 'app', 'components', 'pages'];

    for (const dir of srcDirs) {
        const fullPath = path.join(projectRoot, dir);
        if (!fs.existsSync(fullPath)) continue;

        // Recursively scan files
        const files = getAllFiles(fullPath, ['.js', '.ts', '.jsx', '.tsx']);

        for (const file of files) {
            const content = fs.readFileSync(file, 'utf8');
            const lines = content.split('\n');

            lines.forEach((line, idx) => {
                // Detect console.error
                if (line.includes('console.error')) {
                    errors.push({
                        type: 'pattern',
                        source: 'code-scan',
                        file: file,
                        line: idx + 1,
                        message: 'console.error detected',
                        severity: 'LOW',
                        raw: line.trim()
                    });
                }

                // Detect TODO/FIXME with error keywords
                if (/\/\/\s*(TODO|FIXME|BUG|HACK).*error/i.test(line)) {
                    errors.push({
                        type: 'pattern',
                        source: 'code-scan',
                        file: file,
                        line: idx + 1,
                        message: 'TODO/FIXME with error keyword',
                        severity: 'MEDIUM',
                        raw: line.trim()
                    });
                }

                // Detect empty catch blocks
                if (/catch\s*\([^)]*\)\s*{\s*}/.test(line)) {
                    errors.push({
                        type: 'pattern',
                        source: 'code-scan',
                        file: file,
                        line: idx + 1,
                        message: 'Empty catch block - errors silently swallowed',
                        severity: 'HIGH',
                        raw: line.trim()
                    });
                }
            });
        }
    }

    return errors;
}

// Helper: Get all files recursively
function getAllFiles(dir, extensions) {
    const files = [];

    try {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory() && !entry.name.startsWith('.') && entry.name !== 'node_modules') {
                files.push(...getAllFiles(fullPath, extensions));
            } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
                files.push(fullPath);
            }
        }
    } catch {
        // Ignore permission errors
    }

    return files;
}

// ==================== MAIN ====================

function runScan(type) {
    console.log(`${c.cyan}🔍 Error Sensor - Scanning ${type}...${c.reset}\n`);

    let allErrors = [];

    if (type === 'all' || type === 'test') {
        console.log(`${c.gray}  Scanning test output...${c.reset}`);
        const testErrors = scanTestErrors();
        allErrors.push(...testErrors);
        console.log(`${c.gray}    Found ${testErrors.length} test errors${c.reset}`);
    }

    if (type === 'all' || type === 'build') {
        console.log(`${c.gray}  Scanning build output...${c.reset}`);
        const buildErrors = scanBuildErrors();
        allErrors.push(...buildErrors);
        console.log(`${c.gray}    Found ${buildErrors.length} build errors${c.reset}`);
    }

    if (type === 'all' || type === 'lint') {
        console.log(`${c.gray}  Scanning lint output...${c.reset}`);
        const lintErrors = scanLintErrors();
        allErrors.push(...lintErrors);
        console.log(`${c.gray}    Found ${lintErrors.length} lint errors${c.reset}`);
    }

    if (type === 'all' || type === 'pattern') {
        console.log(`${c.gray}  Scanning code patterns...${c.reset}`);
        const patternErrors = scanCodePatterns();
        allErrors.push(...patternErrors);
        console.log(`${c.gray}    Found ${patternErrors.length} pattern issues${c.reset}`);
    }

    // Save detected errors
    let newCount = 0;
    for (const error of allErrors) {
        if (addError(error)) {
            newCount++;
        }
    }

    console.log(`\n${c.cyan}════════════════════════════════════════${c.reset}`);
    console.log(`${c.bold}Scan Complete${c.reset}`);
    console.log(`  Total detected: ${allErrors.length}`);
    console.log(`  New errors: ${c.yellow}${newCount}${c.reset}`);
    console.log(`  Saved to: ${c.gray}${errorsPath}${c.reset}`);
    console.log(`${c.cyan}════════════════════════════════════════${c.reset}`);

    return allErrors;
}

function showStats() {
    const errors = loadErrors();

    console.log(`${c.cyan}╔════════════════════════════════════════╗${c.reset}`);
    console.log(`${c.cyan}║${c.reset}  📊 Error Sensor Statistics             ${c.cyan}║${c.reset}`);
    console.log(`${c.cyan}╚════════════════════════════════════════╝${c.reset}\n`);

    // Group by type
    const byType = {};
    const bySeverity = {};

    for (const err of errors) {
        byType[err.type] = (byType[err.type] || 0) + 1;
        bySeverity[err.severity] = (bySeverity[err.severity] || 0) + 1;
    }

    console.log(`${c.bold}By Type:${c.reset}`);
    for (const [type, count] of Object.entries(byType)) {
        console.log(`  ${type}: ${count}`);
    }

    console.log(`\n${c.bold}By Severity:${c.reset}`);
    for (const [sev, count] of Object.entries(bySeverity)) {
        const color = { CRITICAL: c.red, HIGH: c.yellow, MEDIUM: c.blue, LOW: c.gray }[sev] || c.gray;
        console.log(`  ${color}${sev}${c.reset}: ${count}`);
    }

    console.log(`\n${c.gray}Total errors tracked: ${errors.length}${c.reset}`);
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--scan') || args.includes('-s')) {
    const idx = args.findIndex(a => a === '--scan' || a === '-s');
    const type = args[idx + 1] || 'all';
    runScan(type);
} else if (args.includes('--stats')) {
    showStats();
} else if (args.includes('--clear')) {
    saveErrors([]);
    console.log(`${c.green}✓ Cleared all detected errors${c.reset}`);
} else {
    console.log(`${c.cyan}error_sensor - Auto-detect errors from test/build/lint${c.reset}

${c.bold}Usage:${c.reset}
  node error_sensor.js --scan <type>    Scan for errors
  node error_sensor.js --stats          Show error statistics
  node error_sensor.js --clear          Clear recorded errors

${c.bold}Scan types:${c.reset}
  test      Scan test output (vitest/jest)
  build     Scan TypeScript errors
  lint      Scan ESLint errors
  pattern   Scan code for error patterns
  all       Scan all sources (default)

${c.bold}Examples:${c.reset}
  node error_sensor.js --scan all
  node error_sensor.js --scan test
  node error_sensor.js --stats
`);
}

export { runScan, scanTestErrors, scanBuildErrors, scanLintErrors, scanCodePatterns, loadErrors };
