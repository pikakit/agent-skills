/**
 * Stats UI - Knowledge base statistics display
 */
import { p, ICONS, getKnowledge, line, VERSION } from "./common.js";
import { showIntro, showInfoNote, showSuccessNote, createSpinner, theme } from "./clack-helpers.js";
import { getLearnedPatterns } from "../learn.js";
import * as p from "@clack/prompts";

// ============================================================================
// STATS DISPLAY
// ============================================================================

/**
 * Stats UI - Show knowledge base statistics
 */
export async function runStatsUI() {
    showIntro("📊 Knowledge Base Stats");

    const spinner = createSpinner("Loading statistics...");

    try {
        const patterns = getLearnedPatterns();
        const totalPatterns = patterns.length;

        // Calculate stats
        const severityCount = {};
        const typeCount = {};

        patterns.forEach(pattern => {
            severityCount[pattern.severity] = (severityCount[pattern.severity] || 0) + 1;

            // Categorize by type
            const type = pattern.id.split('-')[0];
            typeCount[type] = (typeCount[type] || 0) + 1;
        });

        spinner.stopSuccess("Stats loaded");

        // Display stats
        const statsContent = [
            `${theme.primary('Total Patterns:')} ${theme.bold(totalPatterns)}`,
            '',
            theme.dim('By Severity:'),
            ...Object.entries(severityCount).map(([severity, count]) =>
                `  ${severity}: ${theme.primary(count)}`
            ),
            '',
            theme.dim('By Category:'),
            ...Object.entries(typeCount).map(([type, count]) =>
                `  ${type}: ${theme.primary(count)}`
            )
        ].join('\n');

        showInfoNote(statsContent, "📊 Statistics");

        if (totalPatterns > 0) {
            // Show sample patterns
            const samples = patterns.slice(0, 3);
            const samplesContent = samples.map(p =>
                `${theme.primary(p.id)}: ${p.message}`
            ).join('\n');

            showSuccessNote(
                `${samplesContent}\n${theme.dim('...')}`,
                `Recent Patterns (${Math.min(3, totalPatterns)}/${totalPatterns})`
            );
        }

    } catch (error) {
        spinner.stopError("Failed to load stats");
        p.note(theme.error(error.message), theme.error('✗ Error'));
    }

    p.note(content, `${ICONS.stats} Knowledge Base Statistics`);

    // Show completion
    p.outro("Stats loaded");
}

export default runStatsUI;
