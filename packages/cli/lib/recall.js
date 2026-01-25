#!/usr/bin/env node
/**
 * Smart Recall Script - ESM Version (Production-Ready)
 * 
 * The "Memory" script. Checks code against learned lessons.
 * Features:
 * - Streaming file scanner (multiple files)
 * - Context-aware pattern matching (shows line numbers)
 * - Hit tracking for frequency analysis
 * 
 * Usage: 
 *   node recall.js <file_path>
 *   node recall.js <directory> --recursive
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import ora from "ora";
import { KNOWLEDGE_DIR, LESSONS_PATH, DEBUG, cwd, VERSION } from "./config.js";
import { loadIgnorePatterns, isIgnored } from "./ignore.js";
import pretty from "./ui/pretty.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

/**
 * Load knowledge base from YAML file
 * @returns {{ lessons: Array<{ id: string, pattern: string, message: string, severity: string, hitCount?: number, lastHit?: string }>, version?: number }}
 */
export function loadKnowledge() {
    try {
        if (!fs.existsSync(LESSONS_PATH)) {
            return { lessons: [], version: 1 };
        }
        const content = fs.readFileSync(LESSONS_PATH, "utf8");
        return yaml.load(content) || { lessons: [], version: 1 };
    } catch (error) {
        if (DEBUG) console.error("Error loading knowledge:", error.message);
        return { lessons: [], version: 1 };
    }
}

/**
 * Save knowledge base to YAML file
 * @param {{ lessons: Array, version?: number }} data
 */
export function saveKnowledge(data) {
    try {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        const str = yaml.dump(data, { lineWidth: -1 });
        fs.writeFileSync(LESSONS_PATH, str, "utf8");
    } catch (error) {
        console.error("❌ Failed to save knowledge base:", error.message);
    }
}

// ============================================================================
// FILE SCANNING
// ============================================================================

/**
 * Scan a single file against learned patterns
 * @param {string} filePath - Path to file to scan
 * @param {{ lessons: Array }} db - Knowledge base
 * @param {boolean} updateHits - Whether to update hit counts
 * @returns {{ file: string, violations: Array<{ lesson: object, matches: Array<{ line: number, content: string }> }> }}
 */
export function scanFile(filePath, db, updateHits = false) {
    const violations = [];

    if (!fs.existsSync(filePath)) {
        return { file: filePath, violations: [], error: "File not found" };
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    if (!db.lessons || db.lessons.length === 0) {
        return { file: filePath, violations: [] };
    }

    db.lessons.forEach(lesson => {
        // Skip if no valid pattern
        if (!lesson.pattern) return;

        // Check excludePaths - skip this lesson for excluded paths
        if (lesson.excludePaths && Array.isArray(lesson.excludePaths)) {
            const shouldExclude = lesson.excludePaths.some(excludePattern => {
                if (excludePattern.startsWith("*.")) {
                    // Extension pattern like "*.test.js"
                    return filePath.endsWith(excludePattern.slice(1));
                }
                // Path pattern like "packages/cli/"
                return filePath.includes(excludePattern.replace(/\\/g, "/"));
            });
            if (shouldExclude) return;
        }

        try {
            const regex = new RegExp(lesson.pattern, "g");
            const matches = [];

            lines.forEach((line, idx) => {
                if (regex.test(line)) {
                    matches.push({
                        line: idx + 1,
                        content: line.trim().substring(0, 80)
                    });
                    regex.lastIndex = 0; // Reset for next test
                }
            });

            if (matches.length > 0) {
                violations.push({ lesson, matches });

                // Track hit count
                if (updateHits) {
                    lesson.hitCount = (lesson.hitCount || 0) + matches.length;
                    lesson.lastHit = new Date().toISOString();

                    // Auto-escalation: WARNING → ERROR after 5 violations
                    if (lesson.severity === "WARNING" && lesson.hitCount >= 5 && !lesson.autoEscalated) {
                        lesson.severity = "ERROR";
                        lesson.autoEscalated = true;
                        console.log(`⚡ Auto-escalated [${lesson.id}] to ERROR (${lesson.hitCount} violations)`);
                    }
                }
            }
        } catch (e) {
            if (DEBUG) console.error(`Invalid regex in lesson ${lesson.id}:`, e.message);
        }
    });

    return { file: filePath, violations };
}

/**
 * Scan multiple files in a directory recursively
 * @param {string} dirPath - Directory to scan
 * @param {{ lessons: Array }} db - Knowledge base
 * @param {string[]} extensions - File extensions to scan
 * @returns {{ results: Array<{ file: string, violations: Array }>, ignoredCount: number }}
 */
export function scanDirectory(dirPath, db, extensions = [".js", ".ts", ".tsx", ".jsx"]) {
    const results = [];
    const ignorePatterns = loadIgnorePatterns(dirPath);
    let ignoredCount = 0;

    function walk(dir) {
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch (e) {
            return; // Skip unreadable directories
        }

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(dirPath, fullPath);

            // Check .agentignore patterns
            if (isIgnored(relativePath, ignorePatterns)) {
                ignoredCount++;
                continue;
            }

            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (extensions.includes(ext)) {
                    const result = scanFile(fullPath, db, true);
                    if (result.violations.length > 0) {
                        results.push(result);
                    }
                }
            }
        }
    }

    if (fs.statSync(dirPath).isDirectory()) {
        walk(dirPath);
    } else {
        results.push(scanFile(dirPath, db, true));
    }

    return { results, ignoredCount };
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Print scan results in a readable format
 * @param {Array} results - Scan results
 */
export function printResults(results) {
    let totalViolations = 0;
    let errorCount = 0;
    let warningCount = 0;

    results.forEach(result => {
        if (result.violations.length === 0) return;

        console.log(`\n📄 ${path.relative(process.cwd(), result.file)}`);

        result.violations.forEach(({ lesson, matches }) => {
            totalViolations += matches.length;
            if (lesson.severity === "ERROR") errorCount += matches.length;
            else warningCount += matches.length;

            const icon = lesson.severity === "ERROR" ? "❌" : "⚠️";
            console.log(`  ${icon} [${lesson.id}] ${lesson.message}`);

            matches.forEach(m => {
                console.log(`     L${m.line}: ${m.content}`);
            });
        });
    });

    // Return stats only - summary is handled by pretty.showScanSummary
    return { total: totalViolations, errors: errorCount, warnings: warningCount };
}

// ============================================================================
// CLI
// ============================================================================

function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || args.includes("--help")) {
        console.log(`
🧠 Smart Recall - Memory Check Tool

Usage:
  recall <file>           Check single file
  recall <directory>      Check all files in directory
  recall --staged         Check git staged files only

Options:
  --help                  Show this help
`);
        process.exit(0);
    }

    const target = args[0];
    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        console.log("ℹ️  No lessons learned yet. Use 'ag-smart learn' to add patterns.");
        process.exit(0);
    }

    // Scan first
    const { results, ignoredCount } = scanDirectory(target, db);
    const stats = printResults(results);

    // Show Clack-based summary (consistent with CLI)
    p.intro(pc.cyan(`🧠 Agent Skill Kit v${VERSION}`));

    // Save updated hit counts
    saveKnowledge(db);

    // Summary using Clack
    const summaryLines = [
        `${pc.green("✓")} ${results.length} file(s) scanned`,
        `${pc.dim("›")} ${ignoredCount} paths ignored`,
        stats.total > 0
            ? `${pc.red("✗")} ${stats.total} violation(s) found`
            : `${pc.green("✓")} No violations found`
    ];

    if (stats.total === 0) {
        summaryLines.push("");
        summaryLines.push(pc.green("All clear! Your code looks great. 🎉"));
    }

    p.note(summaryLines.join("\n"), pc.dim("Memory check completed ✓"));

    if (stats.errors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

// Run if executed directly
if (process.argv[1].includes("recall")) {
    main();
}
