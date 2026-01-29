#!/usr/bin/env node
/**
 * Smart Stats - Knowledge Base Statistics
 * 
 * Display statistics about the knowledge base:
 * - Total lessons learned
 * - Most triggered patterns
 * - Violation trends
 * 
 * Usage: ag-smart stats
 */

import { loadKnowledge } from "./recall.js";
import { VERSION } from "./config.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// STATS DISPLAY
// ============================================================================

function displayStats() {
    const db = loadKnowledge();

    p.intro(pc.cyan(`📊 Agent Skill Kit Knowledge Base v${VERSION}`));

    if (!db.lessons || db.lessons.length === 0) {
        p.note("No lessons learned yet.\nUse 'ag-smart learn' to add patterns.", pc.dim("Empty"));
        return;
    }

    // Summary
    const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);
    const errorCount = db.lessons.filter(l => l.severity === "ERROR").length;
    const warningCount = db.lessons.filter(l => l.severity === "WARNING").length;

    const summaryLines = [
        `📚 Total Lessons: ${pc.bold(db.lessons.length)}`,
        `🎯 Total Violations: ${pc.bold(totalHits)}`,
        `${pc.red("❌")} ERROR patterns: ${errorCount}`,
        `${pc.yellow("⚠️")} WARNING patterns: ${warningCount}`
    ];
    p.note(summaryLines.join("\n"), pc.dim("Summary"));

    // Most triggered
    const sorted = [...db.lessons]
        .filter(l => l.hitCount > 0)
        .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0))
        .slice(0, 5);

    if (sorted.length > 0) {
        const triggeredLines = sorted.map((lesson, idx) => {
            const bar = "█".repeat(Math.min(15, Math.ceil((lesson.hitCount / (sorted[0].hitCount || 1)) * 15)));
            return `${idx + 1}. [${lesson.id}] ${lesson.hitCount} hits\n   ${pc.green(bar)}\n   ${pc.dim(lesson.message)}`;
        });
        p.note(triggeredLines.join("\n\n"), pc.dim("🔥 Most Triggered"));
    }

    // Auto-escalated
    const escalated = db.lessons.filter(l => l.autoEscalated);
    if (escalated.length > 0) {
        const escalatedLines = escalated.map(l =>
            `[${l.id}] → Escalated after ${l.hitCount} violations`
        );
        p.note(escalatedLines.join("\n"), pc.dim("⚡ Auto-Escalated"));
    }

    // Recent activity
    const withHits = db.lessons.filter(l => l.lastHit);
    if (withHits.length > 0) {
        const recent = [...withHits]
            .sort((a, b) => new Date(b.lastHit) - new Date(a.lastHit))
            .slice(0, 3);

        const recentLines = recent.map(l => {
            const timeAgo = getTimeAgo(new Date(l.lastHit));
            return `[${l.id}] Last hit: ${timeAgo}`;
        });
        p.note(recentLines.join("\n"), pc.dim("🕐 Recent Activity"));
    }

    // Sources breakdown
    const sources = {};
    db.lessons.forEach(l => {
        const src = l.source || "manual";
        sources[src] = (sources[src] || 0) + 1;
    });

    const sourceLines = Object.entries(sources).map(([src, count]) => {
        const icon = src === "manual" ? "✍️" : src === "eslint" ? "🔧" : "🧪";
        return `${icon} ${src}: ${count}`;
    });
    p.note(sourceLines.join("\n"), pc.dim("📥 Lesson Sources"));

    p.outro(pc.green("Stats complete"));
}

/**
 * Get human-readable time ago string
 */
function getTimeAgo(date) {
    const seconds = Math.floor((Date.now() - date) / 1000);

    if (seconds < 60) return "just now";
    if (seconds < 3600) return `${Math.floor(seconds / 60)} minutes ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)} hours ago`;
    return `${Math.floor(seconds / 86400)} days ago`;
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);

if (args.includes("--help")) {
    console.log(`
📊 Smart Stats - Knowledge Base Statistics

Usage:
  ag-smart stats

Shows:
  - Total lessons and violations
  - Most triggered patterns
  - Auto-escalated patterns
  - Recent activity
`);
    process.exit(0);
}

displayStats();
