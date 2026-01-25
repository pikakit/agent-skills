#!/usr/bin/env node
/**
 * Skill Learn - Auto-update SKILL.md from Hot Patterns
 * 
 * When patterns reach threshold hits, automatically add them
 * to the relevant SKILL.md file as learned rules.
 * 
 * This makes the Self-Learning Engine truly "self-learning"!
 * 
 * Usage: ag-smart sync-skills
 */

import fs from "fs";
import path from "path";
import { loadKnowledge, saveKnowledge } from "./recall.js";
import { AGENT_DIR, VERSION } from "./config.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const SYNC_THRESHOLD = 10; // Hits required before syncing to SKILL.md
const SKILLS_DIR = path.join(AGENT_DIR, "skills");

// Category to skill folder mapping
const CATEGORY_MAP = {
    "general": "clean-code",
    "security": "vulnerability-scanner",
    "code-quality": "clean-code",
    "performance": "performance-profiling",
    "testing": "testing-patterns",
    "react": "react-patterns",
    "api": "api-patterns",
    "database": "database-design"
};

// ============================================================================
// SKILL UPDATER
// ============================================================================

/**
 * Find the SKILL.md file for a category
 * @param {string} category 
 * @returns {string|null}
 */
function findSkillFile(category) {
    const skillFolder = CATEGORY_MAP[category] || CATEGORY_MAP["general"];
    const skillPath = path.join(SKILLS_DIR, skillFolder, "SKILL.md");

    if (fs.existsSync(skillPath)) {
        return skillPath;
    }

    // Fallback to clean-code
    const fallback = path.join(SKILLS_DIR, "clean-code", "SKILL.md");
    return fs.existsSync(fallback) ? fallback : null;
}

/**
 * Parse SKILL.md structure to find best insertion point
 * @param {string} skillPath 
 * @returns {{ sections: Array<{name: string, start: number, end: number}>, content: string }}
 */
function parseSkillStructure(skillPath) {
    const content = fs.readFileSync(skillPath, "utf8");
    const lines = content.split("\n");
    const sections = [];

    let currentSection = null;

    lines.forEach((line, idx) => {
        // Detect section headers (## or ###)
        const headerMatch = line.match(/^(#{2,3})\s+(.+)/);
        if (headerMatch) {
            if (currentSection) {
                currentSection.end = idx - 1;
                sections.push(currentSection);
            }
            currentSection = {
                name: headerMatch[2].trim(),
                level: headerMatch[1].length,
                start: idx,
                end: lines.length - 1
            };
        }
    });

    if (currentSection) {
        sections.push(currentSection);
    }

    return { sections, content, lines };
}

/**
 * Find best section to insert pattern based on category
 * @param {Array} sections 
 * @param {string} category 
 * @returns {number} - Line number to insert at
 */
function findInsertionPoint(sections, category) {
    // Look for "Auto-learned" section first
    const autoSection = sections.find(s =>
        s.name.toLowerCase().includes("auto-learned") ||
        s.name.toLowerCase().includes("learned patterns")
    );
    if (autoSection) {
        return autoSection.end + 1;
    }

    // Look for relevant category section
    const categoryMap = {
        "security": ["security", "vulnerab"],
        "performance": ["performance", "optim"],
        "code-quality": ["quality", "best practice", "rule"],
        "testing": ["test", "spec"]
    };

    const keywords = categoryMap[category] || ["rule", "pattern"];
    const matchSection = sections.find(s =>
        keywords.some(kw => s.name.toLowerCase().includes(kw))
    );
    if (matchSection) {
        return matchSection.end + 1;
    }

    // Default: append at end
    return -1; // -1 means append
}

/**
 * Generate rule entry for SKILL.md
 * @param {object} lesson 
 * @returns {string}
 */
function generateRuleEntry(lesson) {
    const date = new Date().toISOString().split("T")[0];
    return `
### 🤖 Auto-learned: ${lesson.id}

> **Pattern:** \`${lesson.pattern}\`
> 
> ${lesson.message}

- **Severity:** ${lesson.severity}
- **Detected:** ${lesson.hitCount} times
- **Added:** ${date}

---
`;
}

/**
 * Check if pattern already exists in SKILL.md
 */
function patternExistsInSkill(skillPath, pattern) {
    const content = fs.readFileSync(skillPath, "utf8");
    // Check multiple formats
    return content.includes(`\`${pattern}\``) ||
        content.includes(`Pattern:** \`${pattern}\``) ||
        content.includes(`"${pattern}"`) ||
        content.includes(`'${pattern}'`);
}

/**
 * Insert rule at specific line or append
 * @param {string} skillPath 
 * @param {object} lesson 
 * @param {string} category 
 */
function insertRule(skillPath, lesson, category) {
    const { sections, content, lines } = parseSkillStructure(skillPath);
    const insertPoint = findInsertionPoint(sections, category);
    const entry = generateRuleEntry(lesson);

    if (insertPoint === -1 || insertPoint >= lines.length) {
        // Append at end
        fs.appendFileSync(skillPath, entry, "utf8");
    } else {
        // Insert at specific line
        lines.splice(insertPoint, 0, entry);
        fs.writeFileSync(skillPath, lines.join("\n"), "utf8");
    }
}

/**
 * Sync hot patterns to SKILL.md files
 */
function syncSkills() {
    console.log(`\n🔄 Skill Sync v${VERSION}`);
    console.log(`📊 Threshold: ${SYNC_THRESHOLD} hits\n`);
    console.log("─".repeat(50));

    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        console.log("\nℹ️  No lessons learned yet.");
        return { synced: 0, skipped: 0 };
    }

    // Find hot patterns
    const hotPatterns = db.lessons.filter(l => (l.hitCount || 0) >= SYNC_THRESHOLD && !l.syncedToSkill);

    if (hotPatterns.length === 0) {
        console.log("\nℹ️  No patterns have reached the sync threshold yet.");
        console.log(`   Patterns need ${SYNC_THRESHOLD}+ hits to be synced to SKILL.md\n`);

        // Show progress
        const inProgress = db.lessons.filter(l => l.hitCount > 0 && l.hitCount < SYNC_THRESHOLD);
        if (inProgress.length > 0) {
            console.log("📈 Patterns in progress:\n");
            inProgress.forEach(l => {
                const progress = Math.round((l.hitCount / SYNC_THRESHOLD) * 100);
                const bar = "█".repeat(Math.floor(progress / 10)) + "░".repeat(10 - Math.floor(progress / 10));
                console.log(`   [${l.id}] ${l.hitCount}/${SYNC_THRESHOLD} hits (${progress}%)`);
                console.log(`   ${bar}`);
            });
        }
        return { synced: 0, skipped: 0 };
    }

    console.log(`\n🔥 Found ${hotPatterns.length} hot pattern(s) ready to sync:\n`);

    let synced = 0;
    let skipped = 0;

    hotPatterns.forEach(lesson => {
        const category = lesson.category || "general";
        const skillPath = findSkillFile(category);

        if (!skillPath) {
            console.log(`⚠️  [${lesson.id}] No SKILL.md found for category: ${category}`);
            skipped++;
            return;
        }

        // Check if already synced
        if (patternExistsInSkill(skillPath, lesson.pattern)) {
            console.log(`⏭️  [${lesson.id}] Already in ${path.basename(path.dirname(skillPath))}/SKILL.md`);
            lesson.syncedToSkill = true;
            skipped++;
            return;
        }

        // Append to SKILL.md
        const entry = generateRuleEntry(lesson);
        fs.appendFileSync(skillPath, entry, "utf8");

        // Mark as synced
        lesson.syncedToSkill = true;
        lesson.syncedAt = new Date().toISOString();

        console.log(`✅ [${lesson.id}] → ${path.basename(path.dirname(skillPath))}/SKILL.md`);
        console.log(`   Pattern: /${lesson.pattern}/`);
        console.log(`   Hits: ${lesson.hitCount}`);
        synced++;
    });

    // Save updated knowledge base
    saveKnowledge(db);

    console.log(`\n${"─".repeat(50)}`);
    console.log(`📊 Summary: ${synced} synced, ${skipped} skipped`);

    if (synced > 0) {
        console.log(`\n🎉 SKILL.md files updated! The agent will now remember these patterns.`);
    }

    return { synced, skipped };
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);

if (args.includes("--help")) {
    console.log(`
🔄 Skill Sync - Auto-update SKILL.md

Usage:
  ag-smart sync-skills

When patterns reach ${SYNC_THRESHOLD}+ violations, they are automatically
added to the relevant SKILL.md file as learned rules.

This makes the Self-Learning Engine truly "self-learning"!

Options:
  --help    Show this help
`);
    process.exit(0);
}

syncSkills();
