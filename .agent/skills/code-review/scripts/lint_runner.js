#!/usr/bin/env node
/**
 * Lint Runner - Code Quality Script
 * Referenced by: /launch, /autopilot workflows
 * 
 * Runs linting tools for JavaScript/TypeScript projects
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

function runESLint(targetPath) {
    const result = { tool: "eslint", status: "skipped", errors: 0, warnings: 0 };

    // Check config
    const configs = [".eslintrc", ".eslintrc.js", ".eslintrc.json", "eslint.config.js"];
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
            result.status = "success"; // Output not JSON but command succeeded
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
        result.errors = 1; // Generic error count
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
            console.log(`❌ ${r.tool}: ${r.errors} errors`);
        }
    });

    console.log();
    if (totalErrors > 0) {
        console.log(`❌ LINT FAILED: ${totalErrors} errors`);
        process.exit(1);
    } else {
        console.log("✅ ALL LINT CHECKS PASSED");
        process.exit(0);
    }
}

const args = process.argv.slice(2);
if (args.length < 1) {
    console.log("Usage: node lint_runner.js <path>");
    process.exit(1);
}

const results = [
    runESLint(args[0]),
    runTSC(args[0])
];

printResults(results, args[0]);
