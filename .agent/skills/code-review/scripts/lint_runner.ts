#!/usr/bin/env node
// @ts-nocheck
/**
 * Lint Runner - Code Quality Script
 * Referenced by: /launch, /autopilot workflows, checklist.js
 *
 * Runs linting tools for JavaScript/TypeScript and Python projects.
 * Matches code-review SKILL.md Quick Reference commands.
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

function runESLint(targetPath) {
    const result = { tool: "eslint", status: "skipped", errors: 0, warnings: 0 };

    // ESLint v9 flat config + legacy configs
    const configs = [
        "eslint.config.js", "eslint.config.mjs", "eslint.config.cjs",
        ".eslintrc", ".eslintrc.js", ".eslintrc.json", ".eslintrc.cjs", ".eslintrc.yml"
    ];
    const hasConfig = configs.some(c => fs.existsSync(path.join(targetPath, c)));
    const hasPkg = fs.existsSync(path.join(targetPath, 'package.json'));

    if (!hasConfig && !hasPkg) {
        result.status = "no-config";
        return result;
    }

    try {
        const cmd = 'npx eslint . --ext .js,.jsx,.ts,.tsx --format json';
        const output = execSync(cmd, { cwd: targetPath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore'] });

        try {
            const jsonResults = JSON.parse(output);
            jsonResults.forEach(r => {
                result.errors += r.errorCount;
                result.warnings += r.warningCount;
            });
            result.status = "success";
        } catch (e) {
            result.status = "success";
        }
    } catch (e) {
        if (e.stdout) {
            try {
                const jsonResults = JSON.parse(e.stdout);
                jsonResults.forEach(r => {
                    result.errors += r.errorCount;
                    result.warnings += r.warningCount;
                });
                result.status = result.errors > 0 ? "errors" : "success";
            } catch (jsone) {
                result.status = "errors";
            }
        } else {
            result.status = "not-installed";
        }
    }
    return result;
}

function runTSC(targetPath) {
    const result = { tool: "tsc", status: "skipped", errors: 0 };

    if (!fs.existsSync(path.join(targetPath, 'tsconfig.json'))) {
        result.status = "no-config";
        return result;
    }

    try {
        execSync('npx tsc --noEmit', { cwd: targetPath, stdio: 'ignore' });
        result.status = "success";
    } catch (e) {
        result.status = "errors";
        result.errors = 1;
    }
    return result;
}

function runNpmAudit(targetPath) {
    const result = { tool: "npm-audit", status: "skipped", errors: 0 };

    if (!fs.existsSync(path.join(targetPath, 'package.json'))) {
        result.status = "no-config";
        return result;
    }

    try {
        execSync('npm audit --audit-level=high', { cwd: targetPath, stdio: 'ignore' });
        result.status = "success";
    } catch (e) {
        result.status = "errors";
        result.errors = 1;
    }
    return result;
}

function runRuff(targetPath) {
    const result = { tool: "ruff", status: "skipped", errors: 0 };

    const pyIndicators = ["requirements.txt", "pyproject.toml", "setup.py", "Pipfile"];
    const isPython = pyIndicators.some(f => fs.existsSync(path.join(targetPath, f)));

    if (!isPython) {
        result.status = "no-config";
        return result;
    }

    try {
        const output = execSync('ruff check . --output-format json', {
            cwd: targetPath, encoding: 'utf8', stdio: ['ignore', 'pipe', 'ignore']
        });
        try {
            const issues = JSON.parse(output);
            result.errors = issues.length;
            result.status = issues.length > 0 ? "errors" : "success";
        } catch (e) {
            result.status = "success";
        }
    } catch (e) {
        if (e.stdout) {
            try {
                const issues = JSON.parse(e.stdout);
                result.errors = issues.length;
                result.status = issues.length > 0 ? "errors" : "success";
            } catch (jsone) {
                result.status = "errors";
            }
        } else {
            result.status = "not-installed";
        }
    }
    return result;
}

function runBandit(targetPath) {
    const result = { tool: "bandit", status: "skipped", errors: 0 };

    const pyIndicators = ["requirements.txt", "pyproject.toml", "setup.py", "Pipfile"];
    const isPython = pyIndicators.some(f => fs.existsSync(path.join(targetPath, f)));

    if (!isPython) {
        result.status = "no-config";
        return result;
    }

    try {
        execSync('bandit -r . -ll -q', { cwd: targetPath, stdio: 'ignore' });
        result.status = "success";
    } catch (e) {
        if (e.status === 1) {
            result.status = "errors";
            result.errors = 1;
        } else {
            result.status = "not-installed";
        }
    }
    return result;
}

function printResults(results, targetPath) {
    console.log("\n" + "=".repeat(50));
    console.log("🔍 LINT CHECK RESULTS");
    console.log("=".repeat(50));
    console.log(`Path: ${targetPath}\n`);

    let totalErrors = 0;
    let totalWarnings = 0;

    results.forEach(r => {
        totalErrors += r.errors || 0;
        totalWarnings += r.warnings || 0;

        if (r.status === 'skipped' || r.status === 'no-config') {
            console.log(`⏭️  ${r.tool}: skipped (no config)`);
        } else if (r.status === 'not-installed') {
            console.log(`⚠️  ${r.tool}: not installed`);
        } else if (r.status === 'success' && !r.errors) {
            console.log(`✅ ${r.tool}: passed ${r.warnings ? `(${r.warnings} warnings)` : ''}`);
        } else {
            console.log(`❌ ${r.tool}: ${r.errors} error(s)`);
        }
    });

    console.log();
    if (totalErrors > 0) {
        console.log(`❌ LINT FAILED: ${totalErrors} error(s)`);
        process.exit(1);
    } else {
        console.log("✅ ALL LINT CHECKS PASSED");
        process.exit(0);
    }
}

// --- Main ---
const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: node lint_runner.js <path>");
    process.exit(1);
}

const targetPath = args[0];
const results = [
    runESLint(targetPath),
    runTSC(targetPath),
    runNpmAudit(targetPath),
    runRuff(targetPath),
    runBandit(targetPath),
];

printResults(results, targetPath);
