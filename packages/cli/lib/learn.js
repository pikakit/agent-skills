#!/usr/bin/env node
/**
 * Smart Learning Script - ESM Version (Production-Ready)
 * 
 * The "Teacher" script. Adds new lessons to the system memory.
 * 
 * Features:
 * - Manual lesson addition
 * - Category tagging
 * - Source tracking (manual, eslint, test-failure)
 * 
 * Usage:
 *   agent learn --add --pattern "regex" --message "why bad"
 *   agent learn --list
 *   agent learn --remove <id>
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { KNOWLEDGE_DIR, LESSONS_PATH, DEBUG, VERSION } from "./config.js";

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Load knowledge base from YAML file
 * @returns {{ lessons: Array, version?: number }}
 */
function loadKnowledge() {
    try {
        if (!fs.existsSync(LESSONS_PATH)) {
            const initial = { lessons: [], version: 1 };
            fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
            fs.writeFileSync(LESSONS_PATH, yaml.dump(initial), "utf8");
            return initial;
        }
        const content = fs.readFileSync(LESSONS_PATH, "utf8");
        return yaml.load(content) || { lessons: [], version: 1 };
    } catch (error) {
        console.error("❌ Failed to load knowledge base:", error.message);
        if (DEBUG) console.error(error.stack);
        process.exit(1);
    }
}

/**
 * Save knowledge base to YAML file
 * @param {{ lessons: Array, version?: number }} data
 */
function saveKnowledge(data) {
    try {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        const str = yaml.dump(data, { lineWidth: -1, quotingType: '"' });
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
 * @param {string} severity - WARNING or ERROR
 * @param {string} category - Category tag
 */
function addLesson(pattern, message, severity = "WARNING", category = "general") {
    const db = loadKnowledge();

    // Validate Regex
    try {
        new RegExp(pattern);
    } catch (e) {
        console.error("❌ Invalid Regex pattern:", e.message);
        process.exit(1);
    }

    // Validate severity
    if (!["WARNING", "ERROR"].includes(severity.toUpperCase())) {
        console.error("❌ Invalid severity. Must be WARNING or ERROR");
        process.exit(1);
    }

    // Check for duplicates
    const exists = db.lessons.some(l => l.pattern === pattern);
    if (exists) {
        console.log("⚠️  Pattern already exists in knowledge base.");
        process.exit(0);
    }

    const id = `LEARN-${String(db.lessons.length + 1).padStart(3, "0")}`;

    const lesson = {
        id,
        pattern,
        message,
        severity: severity.toUpperCase(),
        category,
        source: "manual",
        hitCount: 0,
        lastHit: null,
        autoEscalated: false,
        addedAt: new Date().toISOString()
    };

    db.lessons.push(lesson);
    saveKnowledge(db);

    console.log(`\n🎓 Lesson Learned: [${id}]`);
    console.log(`   Pattern:  /${pattern}/`);
    console.log(`   Message:  ${message}`);
    console.log(`   Severity: ${severity.toUpperCase()}`);
    console.log(`   Category: ${category}\n`);
}

/**
 * Remove a lesson by ID
 * @param {string} lessonId 
 */
function removeLesson(lessonId) {
    const db = loadKnowledge();
    const idx = db.lessons.findIndex(l => l.id === lessonId.toUpperCase());

    if (idx === -1) {
        console.log(`❌ Lesson not found: ${lessonId}`);
        process.exit(1);
    }

    const removed = db.lessons.splice(idx, 1)[0];
    saveKnowledge(db);

    console.log(`\n🗑️  Removed lesson: [${removed.id}]`);
    console.log(`   Pattern: /${removed.pattern}/\n`);
}

/**
 * List all learned lessons
 * @param {string} category - Filter by category
 */
function listLessons(category = null) {
    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        console.log("\nℹ️  No lessons learned yet.");
        console.log("   Use: agent learn --add --pattern \"pat\" --message \"msg\"\n");
        return;
    }

    let lessons = db.lessons;
    if (category) {
        lessons = lessons.filter(l => l.category === category);
    }

    console.log(`\n🧠 PikaKit Knowledge Base (${lessons.length} lesson(s))\n`);
    console.log("─".repeat(60));

    lessons.forEach(l => {
        const icon = l.severity === "ERROR" ? "❌" : "⚠️";
        const hits = l.hitCount ? ` (${l.hitCount} hits)` : "";
        const escalated = l.autoEscalated ? " ⚡" : "";

        console.log(`${icon} [${l.id}] ${l.message}${hits}${escalated}`);
        console.log(`   Pattern: /${l.pattern}/`);
        console.log(`   Category: ${l.category || "general"} | Source: ${l.source || "manual"}`);
        console.log("");
    });
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
🎓 Smart Learning Tool v${VERSION}

USAGE:
  agent learn --add --pattern "..." --message "..."
  agent learn --list [--category <cat>]
  agent learn --remove <ID>

OPTIONS:
  --add         Add a new lesson
  --pattern     Regex pattern to flag
  --message     Explanation message
  --severity    WARNING (default) or ERROR
  --category    Category tag (default: general)
  --list        List all lessons
  --remove      Remove lesson by ID
  --help        Show this help

EXAMPLES:
  agent learn --add --pattern "console\\.log" --message "No console.log in production" --severity ERROR
  agent learn --list
  agent learn --remove LEARN-001
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes("--help") || args.length === 0) {
        printHelp();
        process.exit(0);
    }

    if (args.includes("--list")) {
        const catIdx = args.indexOf("--category");
        const category = catIdx !== -1 ? args[catIdx + 1] : null;
        listLessons(category);
        process.exit(0);
    }

    if (args.includes("--remove")) {
        const removeIdx = args.indexOf("--remove");
        const lessonId = args[removeIdx + 1];
        if (!lessonId) {
            console.error("❌ Missing lesson ID for --remove");
            process.exit(1);
        }
        removeLesson(lessonId);
        process.exit(0);
    }

    if (args.includes("--add")) {
        const pIdx = args.indexOf("--pattern");
        const mIdx = args.indexOf("--message");
        const sIdx = args.indexOf("--severity");
        const cIdx = args.indexOf("--category");

        if (pIdx === -1 || mIdx === -1) {
            console.error("❌ --pattern and --message are required for --add");
            process.exit(1);
        }

        const pattern = args[pIdx + 1];
        const message = args[mIdx + 1];
        const severity = sIdx !== -1 ? args[sIdx + 1] : "WARNING";
        const category = cIdx !== -1 ? args[cIdx + 1] : "general";

        if (!pattern || !message) {
            console.error("❌ Missing values for pattern/message");
            process.exit(1);
        }

        addLesson(pattern, message, severity, category);
    }
}

main();
