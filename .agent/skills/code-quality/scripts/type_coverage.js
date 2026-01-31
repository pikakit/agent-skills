#!/usr/bin/env node
/**
 * Type Coverage Checker - Measures TypeScript/Python type coverage.
 * Identifies untyped functions, any usage, and type safety issues.
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', 'venv']);

function walkFiles(dir, extensions, callback) {
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue;
            const fullPath = resolve(dir, entry.name);

            if (entry.isDirectory()) {
                walkFiles(fullPath, extensions, callback);
            } else {
                const ext = extname(entry.name).toLowerCase();
                if (extensions.includes(ext) && !entry.name.endsWith('.d.ts')) {
                    callback(fullPath);
                }
            }
        }
    } catch { /* ignore */ }
}

function checkTypescriptCoverage(projectPath) {
    const issues = [];
    const passed = [];
    const stats = { any_count: 0, untyped_functions: 0, total_functions: 0 };

    let fileCount = 0;

    walkFiles(projectPath, ['.ts', '.tsx'], (filePath) => {
        if (fileCount >= 30) return;
        fileCount++;

        try {
            const content = readFileSync(filePath, 'utf-8');

            // Count 'any' usage
            const anyMatches = content.match(/:\s*any\b/g) || [];
            stats.any_count += anyMatches.length;

            // Find functions without return types
            const untypedFuncs = (content.match(/function\s+\w+\s*\([^)]*\)\s*{/g) || []);
            const untypedArrows = (content.match(/=\s*\([^:)]*\)\s*=>/g) || []);
            stats.untyped_functions += untypedFuncs.length + untypedArrows.length;

            // Count typed functions
            const typedFuncs = (content.match(/function\s+\w+\s*\([^)]*\)\s*:\s*\w+/g) || []);
            const typedArrows = (content.match(/:\s*\([^)]*\)\s*=>\s*\w+/g) || []);
            stats.total_functions += typedFuncs.length + typedArrows.length + untypedFuncs.length + untypedArrows.length;

        } catch { /* ignore */ }
    });

    if (fileCount === 0) {
        return { type: 'typescript', files: 0, passed: [], issues: ['[!] No TypeScript files found'], stats };
    }

    // Analyze results
    if (stats.any_count === 0) {
        passed.push("[OK] No 'any' types found");
    } else if (stats.any_count <= 5) {
        issues.push(`[!] ${stats.any_count} 'any' types found (acceptable)`);
    } else {
        issues.push(`[X] ${stats.any_count} 'any' types found (too many)`);
    }

    if (stats.total_functions > 0) {
        const typedRatio = ((stats.total_functions - stats.untyped_functions) / stats.total_functions) * 100;
        if (typedRatio >= 80) {
            passed.push(`[OK] Type coverage: ${typedRatio.toFixed(0)}%`);
        } else if (typedRatio >= 50) {
            issues.push(`[!] Type coverage: ${typedRatio.toFixed(0)}% (improve)`);
        } else {
            issues.push(`[X] Type coverage: ${typedRatio.toFixed(0)}% (too low)`);
        }
    }

    passed.push(`[OK] Analyzed ${fileCount} TypeScript files`);

    return { type: 'typescript', files: fileCount, passed, issues, stats };
}

function checkPythonCoverage(projectPath) {
    const issues = [];
    const passed = [];
    const stats = { untyped_functions: 0, typed_functions: 0, any_count: 0 };

    let fileCount = 0;

    walkFiles(projectPath, ['.py'], (filePath) => {
        if (fileCount >= 30) return;
        fileCount++;

        try {
            const content = readFileSync(filePath, 'utf-8');

            // Count Any usage
            const anyMatches = content.match(/:\s*Any\b/g) || [];
            stats.any_count += anyMatches.length;

            // Find functions with type hints
            const typedFuncs = (content.match(/def\s+\w+\s*\([^)]*:[^)]+\)/g) || []);
            const typedReturns = (content.match(/def\s+\w+\s*\([^)]*\)\s*->/g) || []);
            stats.typed_functions += typedFuncs.length + typedReturns.length;

            // Find all functions
            const allFuncs = (content.match(/def\s+\w+\s*\(/g) || []);
            stats.untyped_functions += allFuncs.length - typedFuncs.length;

        } catch { /* ignore */ }
    });

    if (fileCount === 0) {
        return { type: 'python', files: 0, passed: [], issues: ['[!] No Python files found'], stats };
    }

    const total = stats.typed_functions + stats.untyped_functions;

    if (total > 0) {
        const typedRatio = (stats.typed_functions / total) * 100;
        if (typedRatio >= 70) {
            passed.push(`[OK] Type hints coverage: ${typedRatio.toFixed(0)}%`);
        } else if (typedRatio >= 40) {
            issues.push(`[!] Type hints coverage: ${typedRatio.toFixed(0)}%`);
        } else {
            issues.push(`[X] Type hints coverage: ${typedRatio.toFixed(0)}% (add type hints)`);
        }
    }

    if (stats.any_count === 0) {
        passed.push("[OK] No 'Any' types found");
    } else if (stats.any_count <= 3) {
        issues.push(`[!] ${stats.any_count} 'Any' types found`);
    } else {
        issues.push(`[X] ${stats.any_count} 'Any' types found`);
    }

    passed.push(`[OK] Analyzed ${fileCount} Python files`);

    return { type: 'python', files: fileCount, passed, issues, stats };
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  TYPE COVERAGE CHECKER');
    console.log('='.repeat(60) + '\n');

    const results = [];

    // Check TypeScript
    const tsResult = checkTypescriptCoverage(projectPath);
    if (tsResult.files > 0) {
        results.push(tsResult);
    }

    // Check Python
    const pyResult = checkPythonCoverage(projectPath);
    if (pyResult.files > 0) {
        results.push(pyResult);
    }

    if (results.length === 0) {
        console.log('[!] No TypeScript or Python files found.');
        process.exit(0);
    }

    // Print results
    let criticalIssues = 0;
    for (const result of results) {
        console.log(`\n[${result.type.toUpperCase()}]`);
        console.log('-'.repeat(40));
        for (const item of result.passed) {
            console.log(`  ${item}`);
        }
        for (const item of result.issues) {
            console.log(`  ${item}`);
            if (item.startsWith('[X]')) criticalIssues++;
        }
    }

    console.log('\n' + '='.repeat(60));
    if (criticalIssues === 0) {
        console.log('[OK] TYPE COVERAGE: ACCEPTABLE');
        process.exit(0);
    } else {
        console.log(`[X] TYPE COVERAGE: ${criticalIssues} critical issues`);
        process.exit(1);
    }
}

main();
