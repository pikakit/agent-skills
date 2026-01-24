#!/usr/bin/env node
/**
 * Smart Learning Script - ESM Version
 * 
 * The "Teacher" script. Adds new lessons to the system memory.
 * Usage: node learn.js --add --pattern "regex" --message "why bad"
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { KNOWLEDGE_DIR, LESSONS_PATH, DEBUG } from "./config.js";

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Load knowledge base from YAML file
 * @returns {import('./types.js').KnowledgeBase}
 */
function loadKnowledge() {
    try {
        if (!fs.existsSync(LESSONS_PATH)) {
            // Create if missing
            const initial = { lessons: [] };
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
            fs.writeFileSync(LESSONS_PATH, yaml.dump(initial), "utf8");
            return initial;
        }
        const content = fs.readFileSync(LESSONS_PATH, "utf8");
        return yaml.load(content) || { lessons: [] };
    } catch (error) {
        console.error("❌ Failed to load knowledge base:", error.message);
        if (DEBUG) console.error(error.stack);
        process.exit(1);
    }
}

/**
 * Save knowledge base to YAML file
 * @param {import('./types.js').KnowledgeBase} data
 */
function saveKnowledge(data) {
    try {
        const str = yaml.dump(data, { lineWidth: -1 });
        fs.writeFileSync(LESSONS_PATH, str, "utf8");
        console.log("✅ Knowledge base updated successfully.");
    } catch (error) {
        console.error("❌ Failed to save knowledge base:", error.message);
        if (DEBUG) console.error(error.stack);
        process.exit(1);
    }
}

/**
 * Add a new lesson to the knowledge base
 * @param {string} pattern - Regex pattern
 * @param {string} message - Explanation message
 * @param {'WARNING'|'ERROR'} severity - Severity level
 */
function addLesson(pattern, message, severity = "WARNING") {
    const db = loadKnowledge();

    // Validate Regex
    try {
        new RegExp(pattern);
    } catch (e) {
        console.error("❌ Invalid Regex pattern:", e.message);
        process.exit(1);
    }

    // Validate severity
    if (!["WARNING", "ERROR"].includes(severity)) {
        console.error("❌ Invalid severity. Must be WARNING or ERROR");
        process.exit(1);
    }

    const id = `LEARN-${String(db.lessons.length + 1).padStart(3, "0")}`;

    /** @type {import('./types.js').Lesson} */
    const lesson = {
        id,
        pattern,
        message,
        severity,
        addedAt: new Date().toISOString()
    };

    db.lessons.push(lesson);
    saveKnowledge(db);

    console.log(`\n🎓 Lesson Learned: [${id}]`);
    console.log(`   Pattern: /${pattern}/`);
    console.log(`   Message: ${message}`);
}

/**
 * List all learned lessons
 */
function listLessons() {
    const db = loadKnowledge();
    if (!db.lessons || db.lessons.length === 0) {
        console.log("ℹ️  No lessons learned yet.");
        return;
    }

    console.log("\n🧠 Smart Agent Knowledge Base:\n");
    db.lessons.forEach(l => {
        console.log(`  [${l.id}] /${l.pattern}/ -> ${l.message} (${l.severity})`);
    });
    console.log("");
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
Smart Learning Tool

USAGE:
  node learn.js --add --pattern "..." --message "..."
  node learn.js --list
  node learn.js --help

OPTIONS:
  --add       Add a new lesson
  --pattern   Regex pattern to flag
  --message   Explanation message
  --severity  Severity (WARNING/ERROR), default WARNING
  --list      List all learned lessons
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes("--help") || args.length === 0) {
        printHelp();
        process.exit(0);
    }

    if (args.includes("--list")) {
        listLessons();
        process.exit(0);
    }

    if (args.includes("--add")) {
        const pIdx = args.indexOf("--pattern");
        const mIdx = args.indexOf("--message");
        const sIdx = args.indexOf("--severity");

        if (pIdx === -1 || mIdx === -1) {
            console.error("❌ --pattern and --message are required for --add");
            process.exit(1);
        }

        const pattern = args[pIdx + 1];
        const message = args[mIdx + 1];
        const severity = sIdx !== -1 ? args[sIdx + 1] : "WARNING";

        if (!pattern || !message) {
            console.error("❌ Missing values for pattern/message");
            process.exit(1);
        }

        addLesson(pattern, message, severity);
    }
}

main();
