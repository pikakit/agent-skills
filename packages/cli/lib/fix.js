#!/usr/bin/env node
/**
 * Smart Fix - Auto-fix Detected Violations
 * 
 * Automatically fixes code violations based on learned patterns.
 * 
 * Features:
 * - Comment out violations (safe mode)
 * - Remove violations (aggressive mode)
 * - Replace patterns (custom fix rules)
 * 
 * Usage: agent fix <file|directory> [--mode safe|aggressive]
 */

import fs from "fs";
import path from "path";
import { loadKnowledge, saveKnowledge, scanFile, scanDirectory } from "./recall.js";
import { VERSION } from "./config.js";

// ============================================================================
// FIX RULES
// ============================================================================

/**
 * Built-in fix rules for common patterns
 */
const FIX_RULES = {
    // Console statements → comment out
    "console.log": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },
    "console.warn": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },
    "console.error": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },
    "console.debug": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },
    "console.info": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },

    // var → const
    "\\bvar\\s+": {
        type: "replace",
        replacement: (line) => line.replace(/\bvar\s+/, "const ")
    },

    // == → === (loose equality)
    "[^!=]==[^=]": {
        type: "replace",
        replacement: (line) => line.replace(/([^!=])==([^=])/g, "$1===$2")
    },

    // != → !== (loose inequality)
    "[^!]=!=[^=]": {
        type: "replace",
        replacement: (line) => line.replace(/([^!])!=([^=])/g, "$1!==$2")
    },

    // debugger → remove
    "\\bdebugger\\b": {
        type: "remove",
        replacement: () => ""
    },

    // alert → comment out
    "\\balert\\(": {
        type: "comment",
        replacement: (line) => `// REMOVED: ${line.trim()}`
    },

    // TODO/FIXME in production → warn only
    "TODO|FIXME": {
        type: "comment",
        replacement: (line) => line // Leave as is, just flag
    },

    // Empty catch blocks → add comment
    "catch\\s*\\([^)]*\\)\\s*\\{\\s*\\}": {
        type: "replace",
        replacement: (line) => line.replace(/\{\s*\}/, "{ /* Intentionally empty */ }")
    },

    // Promise without catch → add comment
    "\\.then\\([^)]*\\)(?!.*\\.catch)": {
        type: "comment",
        replacement: (line) => `${line} // TODO: Add .catch()`
    },

    // Hardcoded localhost → flag
    "localhost:\\d+": {
        type: "comment",
        replacement: (line) => `// REVIEW: ${line.trim()} // Hardcoded URL`
    },

    // @ts-ignore → flag for review
    "@ts-ignore": {
        type: "comment",
        replacement: (line) => `${line} // TODO: Fix instead of ignoring`
    },

    // any type in TypeScript → flag
    ": any": {
        type: "comment",
        replacement: (line) => `${line} // TODO: Replace 'any' with proper type`
    }
};

// ============================================================================
// FIX ENGINE
// ============================================================================

/**
 * Fix a single file
 * @param {string} filePath 
 * @param {object} db - Knowledge base
 * @param {string} mode - 'safe' or 'aggressive'
 * @returns {{ file: string, fixes: number, backup: string }}
 */
function fixFile(filePath, db, mode = "safe") {
    if (!fs.existsSync(filePath)) {
        return { file: filePath, fixes: 0, error: "File not found" };
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");
    let fixCount = 0;
    let modified = false;

    // Scan for violations
    const result = scanFile(filePath, db, false);

    if (result.violations.length === 0) {
        return { file: filePath, fixes: 0 };
    }

    // Create backup
    const backupPath = filePath + ".backup";
    fs.writeFileSync(backupPath, content, "utf8");

    // Apply fixes
    result.violations.forEach(({ lesson, matches }) => {
        const rule = FIX_RULES[lesson.pattern] || {
            type: mode === "aggressive" ? "remove" : "comment",
            replacement: (line) => mode === "aggressive" ? "" : `// FLAGGED: ${line.trim()}`
        };

        matches.forEach(match => {
            const lineIdx = match.line - 1;
            if (lineIdx >= 0 && lineIdx < lines.length) {
                const originalLine = lines[lineIdx];

                if (rule.type === "remove") {
                    lines[lineIdx] = "";
                    fixCount++;
                    modified = true;
                } else if (rule.type === "comment") {
                    if (!originalLine.trim().startsWith("//")) {
                        lines[lineIdx] = rule.replacement(originalLine);
                        fixCount++;
                        modified = true;
                    }
                } else if (rule.type === "replace") {
                    const newLine = rule.replacement(originalLine);
                    if (newLine !== originalLine) {
                        lines[lineIdx] = newLine;
                        fixCount++;
                        modified = true;
                    }
                }
            }
        });
    });

    // Write fixed content
    if (modified) {
        const newContent = lines.filter(l => l !== "" || mode !== "aggressive").join("\n");
        fs.writeFileSync(filePath, newContent, "utf8");
    } else {
        // Remove backup if no changes
        fs.unlinkSync(backupPath);
    }

    return {
        file: filePath,
        fixes: fixCount,
        backup: modified ? backupPath : null
    };
}

/**
 * Fix all files in directory
 */
function fixDirectory(dirPath, db, mode = "safe") {
    const results = [];
    const extensions = [".js", ".ts", ".tsx", ".jsx", ".mjs"];

    function walk(dir) {
        const entries = fs.readdirSync(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            if (entry.isDirectory()) {
                if (!["node_modules", ".git", "dist", "build"].includes(entry.name)) {
                    walk(fullPath);
                }
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (extensions.includes(ext)) {
                    const result = fixFile(fullPath, db, mode);
                    if (result.fixes > 0) {
                        results.push(result);
                    }
                }
            }
        }
    }

    if (fs.statSync(dirPath).isDirectory()) {
        walk(dirPath);
    } else {
        const result = fixFile(dirPath, db, mode);
        if (result.fixes > 0) {
            results.push(result);
        }
    }

    return results;
}

// ============================================================================
// CLI
// ============================================================================

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes("--help")) {
        console.log(`
🔧 Smart Fix v${VERSION} - Auto-fix Violations

Usage:
  agent fix <file|directory> [options]

Options:
  --mode safe        Comment out violations (default)
  --mode aggressive  Remove violations entirely
  --eslint           Also run ESLint --fix
  --dry-run          Show what would be fixed without changing files
  --help             Show this help

Examples:
  agent fix src/
  agent fix app.js --mode aggressive
  agent fix src/ --eslint
`);
        process.exit(0);
    }

    const target = args[0];
    const mode = args.includes("--mode")
        ? args[args.indexOf("--mode") + 1]
        : "safe";
    const dryRun = args.includes("--dry-run");
    const useEslint = args.includes("--eslint");

    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        console.log("ℹ️  No lessons learned yet. Nothing to fix.");
        process.exit(0);
    }

    console.log(`\n🔧 Smart Fix v${VERSION}`);
    console.log(`📂 Target: ${target}`);
    console.log(`🎯 Mode: ${mode}`);
    if (useEslint) console.log(`🔧 ESLint: enabled`);
    console.log(`${"─".repeat(50)}\n`);

    // Run ESLint fix first if enabled
    if (useEslint && !dryRun) {
        try {
            const { runEslintFix } = await import("./eslint-fix.js");
            runEslintFix(target);
        } catch (e) {
            console.log(`⚠️  ESLint fix skipped: ${e.message}`);
        }
    }

    if (dryRun) {
        console.log("🔍 DRY RUN - showing what would be fixed:\n");
        const scanResults = scanDirectory(target, db);
        scanResults.forEach(r => {
            console.log(`📄 ${path.relative(process.cwd(), r.file)}`);
            r.violations.forEach(v => {
                console.log(`   Would fix ${v.matches.length} violation(s) of [${v.lesson.id}]`);
            });
        });
        process.exit(0);
    }

    const results = fixDirectory(target, db, mode);

    if (results.length === 0) {
        console.log("✅ No pattern violations to fix.");
        process.exit(0);
    }

    let totalFixes = 0;
    results.forEach(r => {
        totalFixes += r.fixes;
        console.log(`✅ ${path.relative(process.cwd(), r.file)}: ${r.fixes} fix(es)`);
        if (r.backup) {
            console.log(`   📦 Backup: ${path.basename(r.backup)}`);
        }
    });

    console.log(`\n${"─".repeat(50)}`);
    console.log(`🎉 Fixed ${totalFixes} violation(s) in ${results.length} file(s)`);
    console.log(`💡 Backups created with .backup extension`);
}

// Run if executed directly (as async)
if (process.argv[1].includes("fix")) {
    main().catch(console.error);
}

export { fixFile, fixDirectory, FIX_RULES };
