#!/usr/bin/env node
/**
 * ESLint Fix Integration
 * 
 * Wrapper around ESLint --fix to combine with pattern-based fix.
 * Auto-detects ESLint config and runs fixes.
 * 
 * Usage: ag-smart fix --eslint <path>
 */

import { execSync, spawnSync } from "child_process";
import fs from "fs";
import path from "path";
import { VERSION } from "./config.js";

// ============================================================================
// ESLINT DETECTION
// ============================================================================

/**
 * Find ESLint config file in project
 * @param {string} dir 
 * @returns {string|null}
 */
function findEslintConfig(dir) {
    const configFiles = [
        ".eslintrc.js",
        ".eslintrc.cjs",
        ".eslintrc.json",
        ".eslintrc.yaml",
        ".eslintrc.yml",
        ".eslintrc",
        "eslint.config.js",
        "eslint.config.mjs"
    ];

    let current = dir;
    while (current !== path.dirname(current)) {
        for (const config of configFiles) {
            const configPath = path.join(current, config);
            if (fs.existsSync(configPath)) {
                return configPath;
            }
        }
        // Check package.json for eslintConfig
        const pkgPath = path.join(current, "package.json");
        if (fs.existsSync(pkgPath)) {
            try {
                const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
                if (pkg.eslintConfig) {
                    return pkgPath; // ESLint config in package.json
                }
            } catch (e) { }
        }
        current = path.dirname(current);
    }
    return null;
}

/**
 * Check if ESLint is available
 * @returns {boolean}
 */
function isEslintAvailable() {
    try {
        execSync("npx eslint --version", { stdio: "ignore" });
        return true;
    } catch (e) {
        return false;
    }
}

// ============================================================================
// ESLINT FIX
// ============================================================================

/**
 * Run ESLint --fix on a path
 * @param {string} targetPath 
 * @param {object} options
 * @returns {{ success: boolean, fixed: number, errors: number }}
 */
export function runEslintFix(targetPath, options = {}) {
    const result = {
        success: false,
        fixed: 0,
        errors: 0,
        output: ""
    };

    if (!isEslintAvailable()) {
        console.log("⚠️  ESLint not found. Install with: npm install eslint -D");
        return result;
    }

    const configPath = findEslintConfig(process.cwd());
    if (!configPath && !options.noConfig) {
        console.log("⚠️  No ESLint config found. Run: npx eslint --init");
        return result;
    }

    console.log(`\n🔧 Running ESLint --fix...`);
    if (configPath) {
        console.log(`   Config: ${path.relative(process.cwd(), configPath)}`);
    }

    try {
        // Run ESLint with --fix
        const args = [
            "eslint",
            targetPath,
            "--fix",
            "--format", "json"
        ];

        const proc = spawnSync("npx", args, {
            encoding: "utf8",
            shell: true,
            maxBuffer: 10 * 1024 * 1024
        });

        // Parse output
        if (proc.stdout) {
            try {
                const results = JSON.parse(proc.stdout);
                let totalFixed = 0;
                let totalErrors = 0;

                results.forEach(file => {
                    if (file.output) {
                        // File was fixed (output contains fixed content)
                        totalFixed++;
                    }
                    totalErrors += file.errorCount || 0;
                });

                result.fixed = totalFixed;
                result.errors = totalErrors;
                result.success = true;
                result.output = proc.stdout;

                console.log(`   ✅ Fixed: ${totalFixed} file(s)`);
                if (totalErrors > 0) {
                    console.log(`   ⚠️  Remaining errors: ${totalErrors}`);
                }
            } catch (e) {
                // JSON parse failed, but fix might still have worked
                result.success = proc.status === 0;
            }
        }

        if (proc.status === 0) {
            result.success = true;
            console.log("   ✅ ESLint fix completed");
        }

    } catch (error) {
        console.error(`   ❌ ESLint error: ${error.message}`);
    }

    return result;
}

// ============================================================================
// COMBINED FIX
// ============================================================================

/**
 * Run combined fix (ESLint + pattern-based)
 * @param {string} targetPath 
 * @param {object} options 
 */
export async function runCombinedFix(targetPath, options = {}) {
    console.log(`\n🔧 Combined Fix v${VERSION}`);
    console.log(`📂 Target: ${targetPath}`);
    console.log("─".repeat(50));

    // Step 1: ESLint fix
    if (options.eslint !== false) {
        runEslintFix(targetPath, options);
    }

    // Step 2: Pattern-based fix (import dynamically)
    console.log("\n🧠 Running pattern-based fix...");
    try {
        const { fixDirectory } = await import("./fix.js");
        const { loadKnowledge } = await import("./recall.v2.js");

        const db = loadKnowledge();
        const results = fixDirectory(targetPath, db, options.mode || "safe");

        if (results.length > 0) {
            let total = 0;
            results.forEach(r => total += r.fixes);
            console.log(`   ✅ Pattern fixes: ${total}`);
        } else {
            console.log("   ✅ No pattern violations to fix");
        }
    } catch (e) {
        console.log(`   ⚠️  Pattern fix skipped: ${e.message}`);
    }

    console.log("\n" + "─".repeat(50));
    console.log("🎉 Combined fix completed!");
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);

if (args.includes("--help") || args.length === 0) {
    console.log(`
🔧 ESLint Fix Integration v${VERSION}

Usage:
  node eslint-fix.js <path> [options]

Options:
  --no-eslint    Skip ESLint fix
  --no-pattern   Skip pattern-based fix
  --mode <mode>  Pattern fix mode (safe|aggressive)
  --help         Show this help

This combines ESLint --fix with pattern-based fixes.
`);
    process.exit(0);
}

const target = args[0];
const options = {
    eslint: !args.includes("--no-eslint"),
    pattern: !args.includes("--no-pattern"),
    mode: args.includes("--mode") ? args[args.indexOf("--mode") + 1] : "safe"
};

runCombinedFix(target, options);
