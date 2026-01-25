/**
 * Stats UI - Knowledge base statistics display
 */
import { p, ICONS, getKnowledge, line, VERSION } from "./common.js";

// ============================================================================
// STATS DISPLAY
// ============================================================================

/**
 * Display formatted statistics
 */
export async function runStatsUI() {
    const db = getKnowledge();

    // Build stats content
    let content = "";

    if (!db.lessons || db.lessons.length === 0) {
        content = `${ICONS.info} No lessons learned yet.\n\nUse the Learn command to add patterns.`;
    } else {
        // Summary
        const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);
        const errorCount = db.lessons.filter(l => l.severity === "ERROR").length;
        const warningCount = db.lessons.filter(l => l.severity === "WARNING").length;

        content += `📚 Total Lessons: ${db.lessons.length}\n`;
        content += `🎯 Total Hits: ${totalHits}\n`;
        content += `${ICONS.error} ERROR: ${errorCount}  ${ICONS.warning} WARNING: ${warningCount}\n`;
        content += `\n${line(40)}\n\n`;

        // Lessons table
        content += "Lessons:\n";
        db.lessons.forEach(l => {
            const icon = l.severity === "ERROR" ? ICONS.error : ICONS.warning;
            const hits = l.hitCount || 0;
            const escalated = l.autoEscalated ? " ⚡" : "";
            content += `  ${icon} [${l.id}] ${l.pattern}\n`;
            content += `     ${l.message} (${hits} hits)${escalated}\n`;
        });

        // Most triggered
        const sorted = [...db.lessons]
            .filter(l => l.hitCount > 0)
            .sort((a, b) => (b.hitCount || 0) - (a.hitCount || 0))
            .slice(0, 3);

        if (sorted.length > 0) {
            content += `\n${line(40)}\n\n`;
            content += "🔥 Most Triggered:\n";
            sorted.forEach((l, i) => {
                const bar = "█".repeat(Math.min(15, Math.ceil((l.hitCount / (sorted[0].hitCount || 1)) * 15)));
                content += `  ${i + 1}. [${l.id}] ${l.hitCount} hits\n`;
                content += `     ${bar}\n`;
            });
        }
    }

    p.note(content, `${ICONS.stats} Knowledge Base Statistics`);

    // Wait for user
    await p.text({
        message: "Press Enter to return to menu...",
        initialValue: "",
        validate: () => undefined
    });
}

export default runStatsUI;
