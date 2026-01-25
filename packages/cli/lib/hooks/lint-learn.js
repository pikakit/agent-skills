#!/usr/bin/env node
/**
 * Lint Learn - Auto-Learn from ESLint Output
 * 
 * Parses ESLint JSON output and creates lessons automatically.
 * 
 * Usage:
 *   npx eslint . --format json | ag-smart lint-learn
 *   npx eslint . --format json > output.json && ag-smart lint-learn output.json
 */

import fs from "fs";
import { loadKnowledge, saveKnowledge } from "../recall.js";

// ============================================================================
// ESLINT PARSER
// ============================================================================

/**
 * Parse ESLint JSON output and extract rules
 * @param {string} jsonContent 
 * @returns {Array<{ rule: string, count: number, message: string }>}
 */
function parseEslintOutput(jsonContent) {
    const ruleStats = {};

    try {
        const results = JSON.parse(jsonContent);

        results.forEach(file => {
            if (!file.messages) return;

            file.messages.forEach(msg => {
                if (!msg.ruleId) return;

                if (!ruleStats[msg.ruleId]) {
                    ruleStats[msg.ruleId] = {
                        rule: msg.ruleId,
                        count: 0,
                        message: msg.message,
                        severity: msg.severity === 2 ? "ERROR" : "WARNING"
                    };
                }
                ruleStats[msg.ruleId].count++;
            });
        });
    } catch (e) {
        console.error("❌ Failed to parse ESLint JSON output:", e.message);
        process.exit(1);
    }

    return Object.values(ruleStats).sort((a, b) => b.count - a.count);
}

/**
 * Convert ESLint rule to regex pattern
 * @param {string} rule - ESLint rule ID
 * @returns {string}
 */
function ruleToPattern(rule) {
    // Map common ESLint rules to regex patterns
    const patterns = {
        "no-console": "console\\.(log|warn|error|info|debug)",
        "no-debugger": "\\bdebugger\\b",
        "no-var": "\\bvar\\s+",
        "no-unused-vars": null, // Can't easily detect with regex
        "no-undef": null,
        "eqeqeq": "[^!=]==[^=]",
        "no-eval": "\\beval\\s*\\(",
        "no-alert": "\\balert\\s*\\("
    };

    return patterns[rule] || null;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    const args = process.argv.slice(2);
    let jsonContent = "";

    if (args.includes("--help")) {
        console.log(`
🔧 Lint Learn - Auto-Learn from ESLint

Usage:
  npx eslint . --format json | ag-smart lint-learn
  ag-smart lint-learn eslint-output.json

Creates lessons from ESLint violations automatically.
`);
        process.exit(0);
    }

    // Read from file or stdin
    if (args[0] && !args[0].startsWith("-")) {
        if (fs.existsSync(args[0])) {
            jsonContent = fs.readFileSync(args[0], "utf8");
        } else {
            console.error(`❌ File not found: ${args[0]}`);
            process.exit(1);
        }
    } else {
        // Read from stdin
        const chunks = [];
        process.stdin.setEncoding("utf8");

        for await (const chunk of process.stdin) {
            chunks.push(chunk);
        }
        jsonContent = chunks.join("");
    }

    if (!jsonContent.trim()) {
        console.log("ℹ️  No input received. Pipe ESLint JSON output or provide a file.");
        process.exit(0);
    }

    const rules = parseEslintOutput(jsonContent);

    if (rules.length === 0) {
        console.log("✅ No ESLint violations found.");
        process.exit(0);
    }

    console.log(`\n🔧 Lint Learn - Found ${rules.length} unique ESLint rule(s)\n`);

    const db = loadKnowledge();
    let added = 0;

    rules.forEach(r => {
        const pattern = ruleToPattern(r.rule);

        if (!pattern) {
            console.log(`⏭️  Skipped: ${r.rule} (no regex pattern available)`);
            return;
        }

        // Check if already exists
        const exists = db.lessons.some(l => l.pattern === pattern);
        if (exists) {
            console.log(`⏭️  Skipped: ${r.rule} (already in memory)`);
            return;
        }

        const id = `LEARN-${String(db.lessons.length + 1).padStart(3, "0")}`;

        db.lessons.push({
            id,
            pattern,
            message: `ESLint: ${r.rule} - ${r.message}`,
            severity: r.severity,
            source: "eslint",
            hitCount: r.count,
            addedAt: new Date().toISOString()
        });

        added++;
        console.log(`✅ Added: [${id}] ${r.rule} (${r.count} occurrences)`);
    });

    if (added > 0) {
        saveKnowledge(db);
        console.log(`\n🎓 Learned ${added} new lesson(s) from ESLint output.\n`);
    } else {
        console.log("\nℹ️  No new lessons to add.\n");
    }
}

main();
