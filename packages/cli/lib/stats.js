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

import { loadKnowledge } from "./recall.v2.js";
import { VERSION } from "./config.js";

// ============================================================================
// STATS DISPLAY
// ============================================================================

function displayStats() {
    const db = loadKnowledge();

    console.log(`\n📊 Smart Agent Knowledge Base v${VERSION}\n`);
    console.log("─".repeat(50));

    if (!db.lessons || db.lessons.length === 0) {
        console.log("\nℹ️  No lessons learned yet.");
        console.log("   Use 'ag-smart learn' to add patterns.\n");
        return;
    }

    // Summary
    console.log(`\n📚 Total Lessons: ${db.lessons.length}`);

    const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);
    console.log(`🎯 Total Violations Detected: ${totalHits}`);

    const errorCount = db.lessons.filter(l => l.severity === "ERROR").length;
    const warningCount = db.lessons.filter(l => l.severity === "WARNING").length;
    console.log(`❌ ERROR patterns: ${errorCount}`);
    console.log(`⚠️  WARNING patterns: ${warningCount}`);

    // Most triggered
    console.log("\n" + "─".repeat(50));
    console.log("🔥 Most Triggered Patterns:\n");

    const sorted = [...db.lessons]
        .filter(l => l.hitCount > 0)
        .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0))
        .slice(0, 5);

    if (sorted.length === 0) {
        console.log("   No violations detected yet.\n");
    } else {
        sorted.forEach((lesson, idx) => {
            const bar = "█".repeat(Math.min(20, Math.ceil((lesson.hitCount / (sorted[0].hitCount || 1)) * 20)));
            console.log(`   ${idx + 1}. [${lesson.id}] ${lesson.hitCount} hits`);
            console.log(`      ${bar}`);
            console.log(`      ${lesson.message}`);
            console.log("");
        });
    }

    // Auto-escalated
    const escalated = db.lessons.filter(l => l.autoEscalated);
    if (escalated.length > 0) {
        console.log("─".repeat(50));
        console.log("⚡ Auto-Escalated Patterns:\n");
        escalated.forEach(l => {
            console.log(`   [${l.id}] ${l.pattern} → Escalated to ERROR after ${l.hitCount} violations`);
        });
        console.log("");
    }

    // Recent activity
    const withHits = db.lessons.filter(l => l.lastHit);
    if (withHits.length > 0) {
        console.log("─".repeat(50));
        console.log("🕐 Recent Activity:\n");

        const recent = [...withHits]
            .sort((a, b) => new Date(b.lastHit) - new Date(a.lastHit))
            .slice(0, 3);

        recent.forEach(l => {
            const date = new Date(l.lastHit);
            const timeAgo = getTimeAgo(date);
            console.log(`   [${l.id}] Last hit: ${timeAgo}`);
        });
        console.log("");
    }

    // Sources breakdown
    const sources = {};
    db.lessons.forEach(l => {
        const src = l.source || "manual";
        sources[src] = (sources[src] || 0) + 1;
    });

    console.log("─".repeat(50));
    console.log("📥 Lesson Sources:\n");
    Object.entries(sources).forEach(([src, count]) => {
        const icon = src === "manual" ? "✍️" : src === "eslint" ? "🔧" : "🧪";
        console.log(`   ${icon} ${src}: ${count}`);
    });
    console.log("");
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
