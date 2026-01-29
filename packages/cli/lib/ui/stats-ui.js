/**
 * Stats UI - Compact single-screen insight using Clack boxes
 */
import { getKnowledge } from "./common.js";
import { showIntro, createSpinner } from "./clack-helpers.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// INSIGHT - SINGLE SCREEN WITH CLACK BOXES
// ============================================================================

export async function runStatsUI() {
    process.stdout.write('\x1Bc');
    showIntro("📊 Insight");

    const spinner = createSpinner("Loading...");

    try {
        const db = getKnowledge();
        const lessons = db.lessons || [];
        const total = lessons.length;

        spinner.stopSuccess("Loaded");

        if (total === 0) {
            p.note(pc.dim("No patterns learned yet."), "Empty");
            await waitBack();
            return;
        }

        // Quick counts
        const mistakes = lessons.filter(l => l.type === 'mistake').length;
        const improvements = lessons.filter(l => l.type === 'improvement').length;
        const errors = lessons.filter(l => l.severity === 'ERROR').length;
        const warnings = lessons.filter(l => l.severity === 'WARNING').length;

        // Top hits
        const topHits = lessons
            .filter(l => l.hitCount && l.hitCount > 0)
            .sort((a, b) => b.hitCount - a.hitCount)
            .slice(0, 3);

        // ========== CLACK NOTE BOX ==========
        const summaryContent = [
            `${pc.red('●')} ${mistakes} Mistakes    ${pc.green('●')} ${improvements} Improvements`,
            `${pc.red('⊘')} ${errors} Errors      ${pc.yellow('⚠')} ${warnings} Warnings`
        ].join('\n');

        p.note(summaryContent, `📈 Summary (${total} patterns)`);

        // Top Patterns box
        if (topHits.length > 0) {
            const topContent = topHits
                .map((l, i) => `${i + 1}. ${pc.dim(l.id?.slice(0, 12) || '?')} → ${pc.bold(l.hitCount)}× hits`)
                .join('\n');
            p.note(topContent, "🔥 Top Patterns");
        }

        await waitBack();

    } catch (error) {
        spinner.stopError("Failed");
        p.note(error.message, "Error");
    }
}

async function waitBack() {
    await p.select({
        message: "",
        options: [{ value: "back", label: "← Back" }]
    });
}
