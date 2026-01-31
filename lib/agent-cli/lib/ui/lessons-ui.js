/**
 * Lessons UI - View and manage learned lessons
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { loadKnowledge, saveKnowledge } from "../recall.js";

/**
 * Format relative time (e.g., "2 days ago")
 */
function formatRelativeTime(date) {
    const now = new Date();
    const diffMs = now - date;
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return 'today';
    if (diffDays === 1) return 'yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
    return `${Math.floor(diffDays / 365)} years ago`;
}

/**
 * Interactive lessons viewer
 */
export async function runLessonsUI() {
    p.intro("Lessons Manager (Press ESC to exit)");

    while (true) {
        const db = loadKnowledge();

        if (!db.lessons || db.lessons.length === 0) {
            p.note("No lessons learned yet.\n\nUse Learn to add patterns.", "Lessons");
            return;
        }

        // Build menu items from lessons with readable titles
        const items = db.lessons.map(lesson => {
            // Use message as title (human-readable)
            const title = lesson.message.substring(0, 60);

            // Visual differentiation: mistakes vs improvements
            let icon, colorFn;
            if (lesson.type === 'mistake') {
                // Mistakes: red circle
                icon = "🔴";
                colorFn = pc.red;
            } else if (lesson.type === 'improvement') {
                // Improvements: green circle
                icon = "🟢";
                colorFn = pc.green;
            } else {
                // Fallback: severity-based
                icon = lesson.severity === "ERROR" ? "🔴" : "⚠️";
                colorFn = lesson.severity === "ERROR" ? pc.red : pc.yellow;
            }

            return {
                value: lesson.id,
                label: `${icon}  ${title}${lesson.message.length > 60 ? '...' : ''}`, // Added double space
                hint: `${lesson.hitCount || 0} hits`
            };
        });

        items.push({ value: "back", label: "← Back", hint: "Return to main menu" });

        const selected = await p.select({
            message: `${db.lessons.length} lesson(s) available:`,
            options: items
        });

        if (p.isCancel(selected) || selected === "back") {
            return;
        }

        // Find and display the selected lesson
        const lesson = db.lessons.find(l => l.id === selected);
        if (!lesson) continue;

        // Determine lesson type and icon
        const isMistake = lesson.severity && (lesson.severity === "ERROR" || lesson.severity === "WARNING");
        const typeIcon = isMistake ? "❌" : "📝";
        const typeLabel = isMistake ? "Mistake" : "Improvement";
        const typeColor = isMistake ? pc.red : pc.green;

        // Build user-friendly display
        console.log(`\n${'─'.repeat(60)}`);
        console.log(`${typeIcon} ${pc.bold(lesson.id)} ${pc.dim('│')} ${typeColor(typeLabel)}`);
        console.log(`${'─'.repeat(60)}\n`);

        // Main message (plain English)
        console.log(pc.bold(lesson.message || 'No description'));
        console.log('');

        // Example code (if pattern suggests code)
        if (lesson.pattern && !lesson.pattern.includes('TODO')) {
            console.log(pc.dim('Pattern:'));
            console.log(pc.yellow(`  ${lesson.pattern}`));
            console.log('');
        }

        // Recommendation
        if (lesson.recommendation) {
            console.log(pc.dim('Recommendation:'));
            console.log(pc.cyan(`  ${lesson.recommendation}`));
            console.log('');
        }

        // Metrics in single line
        const hits = lesson.hitCount || lesson.appliedCount || 0;
        const dateStr = lesson.addedAt
            ? formatRelativeTime(new Date(lesson.addedAt))
            : 'Unknown';

        console.log(
            `${pc.green('✓')} Applied ${pc.bold(hits)} times  ${pc.dim('│')}  ` +
            `Added ${pc.dim(dateStr)}  ${pc.dim('│')}  ` +
            `${pc.dim(lesson.category || 'general')}`
        );
        console.log(`\n${'─'.repeat(60)}\n`);

        // Actions
        const action = await p.select({
            message: "What would you like to do?",
            options: [
                { value: "back", label: "← Back", hint: "Return to list" },
                { value: "delete", label: "Delete lesson", hint: "Remove this lesson" }
            ]
        });

        if (p.isCancel(action) || action === "back") continue;

        if (action === "delete") {
            const confirm = await p.confirm({
                message: `Delete lesson ${lesson.id}?`
            });

            if (confirm) {
                db.lessons = db.lessons.filter(l => l.id !== lesson.id);
                saveKnowledge(db);
                p.log.success(`Deleted ${lesson.id}`);
            }
        }
    }
}

export default runLessonsUI;
