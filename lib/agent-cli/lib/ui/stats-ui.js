/**
 * Stats UI - Knowledge base statistics display
 */
import { ICONS, getKnowledge, line, VERSION } from "./common.js";
import { showIntro, showInfoNote, showSuccessNote, createSpinner, theme } from "./clack-helpers.js";
import { signalQueue, getEvolutionStats } from "../evolution-signal.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// STATS DISPLAY
// ============================================================================

/**
 * Stats UI - Show knowledge base statistics with cognitive insights
 */
export async function runStatsUI() {
    // Clear terminal và reset cursor về top-left
    process.stdout.write('\x1Bc'); // Full terminal reset

    showIntro("📊 Knowledge Base Stats");

    const spinner = createSpinner("Loading statistics...");

    try {
        const db = getKnowledge();
        const lessons = db.lessons || [];

        // Calculate statistics with cognitive awareness
        const totalLessons = lessons.length;
        const mistakes = lessons.filter(l => l.type === 'mistake');
        const improvements = lessons.filter(l => l.type === 'improvement');

        // Cognitive grouping - Intent
        const byIntent = lessons.reduce((acc, l) => {
            const intent = l.intent || 'unknown';
            acc[intent] = (acc[intent] || 0) + 1;
            return acc;
        }, {});

        // Cognitive grouping - Pattern Type
        const byPatternType = lessons.reduce((acc, l) => {
            const type = l.patternType || 'general';
            acc[type] = (acc[type] || 0) + 1;
            return acc;
        }, {});

        // Cognitive grouping - Maturity
        const byMaturity = lessons.reduce((acc, l) => {
            const maturity = l.cognitive?.maturity || 'learning';
            acc[maturity] = (acc[maturity] || 0) + 1;
            return acc;
        }, {});

        // Top 5 by hit count
        const topHits = lessons
            .filter(p => p.hitCount && p.hitCount > 0)
            .sort((a, b) => b.hitCount - a.hitCount)
            .slice(0, 5);

        spinner.stopSuccess("Stats loaded");

        // Compact single-line display
        console.log(`\n${pc.bold('📊 Knowledge Stats')} ${pc.dim(`(${totalLessons} lessons)`)}\n`);

        console.log(
            `${pc.red('●')} ${mistakes.length} Mistakes  ` +
            `${pc.green('●')} ${improvements.length} Improvements  ` +
            `${pc.dim('│')}  ` +
            `${pc.red('🛡️')} ${byIntent.prevent || 0} Prevent  ` +
            `${pc.yellow('⚠️')} ${byIntent.warn || 0} Warn  ` +
            `${pc.green('⚡')} ${byIntent.optimize || 0} Optimize\n`
        );

        console.log(
            `${pc.dim('Types:')} ` +
            `${byPatternType.security ? `🔒${byPatternType.security} ` : ''}` +
            `${byPatternType.dependency ? `📦${byPatternType.dependency} ` : ''}` +
            `${byPatternType.structure ? `🏗️${byPatternType.structure} ` : ''}` +
            `${byPatternType.quality ? `✨${byPatternType.quality} ` : ''}` +
            `${byPatternType.performance ? `⚡${byPatternType.performance} ` : ''}` +
            `${byPatternType.general ? pc.dim(`📝${byPatternType.general}`) : ''}\n`
        );

        console.log(
            `${pc.dim('Maturity:')} ` +
            `${pc.green('✓')} ${byMaturity.stable || 0} Stable  ` +
            `${pc.cyan('📚')} ${byMaturity.learning || 0} Learning\n`
        );

        // Show top 3 hits in compact format
        if (topHits.length > 0) {
            console.log(`${pc.bold('🔥 Top Patterns')}`);
            topHits.slice(0, 3).forEach((p, i) => {
                console.log(`  ${i + 1}. ${pc.dim(p.id)} ${pc.bold(p.hitCount)}×`);
            });
            console.log('');
        }

        // Show signal queue summary
        const signalStats = getEvolutionStats();
        const pending = signalQueue.getPending();

        console.log(`${pc.bold('📡 Signal Queue')}`);
        console.log(
            `  ${pc.yellow('⏳')} ${signalStats.pending} Pending  ` +
            `${pc.green('✓')} ${signalStats.approved} Approved  ` +
            `${pc.red('✗')} ${signalStats.rejected} Rejected\n`
        );

        // User can choose next action
        await p.select({
            message: "What's next?",
            options: [
                { value: "back", label: "← Back to Main Menu" }
            ]
        });

    } catch (error) {
        spinner.stopError("Failed to load stats");
        console.error(error);
    }
}
