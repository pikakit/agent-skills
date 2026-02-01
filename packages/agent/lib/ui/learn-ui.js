/**
 * Learn UI - Teach new patterns
 */
import {
    showIntro,
    showActionMenu,
    textInput,
    confirm,
    createSpinner,
    showSuccessNote,
    showErrorNote,
    showNote,
    theme
} from "./clack-helpers.js";
import { getKnowledge } from "./common.js";
import { saveKnowledge } from "../recall.js";
import * as p from "@clack/prompts";
import { spawnSync } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';

export async function runLearnUI() {
    showIntro("📚 Learn New Pattern");

    // Action menu - Simplified to core functions
    const action = await showActionMenu({
        message: "What would you like to do?",
        items: [
            { value: "view", label: "📚 View Lessons", hint: "Browse all learned patterns" },
            { value: "add", label: "➕ Add Lesson", hint: "Teach a new pattern manually" },
            { value: "remove", label: "🗑️  Remove Lesson", hint: "Delete a pattern" },
            // REMOVED: Query Lessons (niche, AI auto-recalls)
            // REMOVED: Auto-Learn (redundant with Add)
            // REMOVED: Status/Versions/History (broken execCommand, low value)
        ],
        includeExit: true
    });

    // ESC returns to main menu (don't execute action)
    if (p.isCancel(action)) {
        return;
    }

    switch (action) {
        case "view":
            await viewLessonsFlow();
            break;
        case "add":
            await addLessonFlow();
            break;
        case "remove":
            await removeLessonFlow();
            break;
        // REMOVED CASES (commented out for rollback):
        // case "status": await statusFlow(); break;
        // case "query": await queryLessonsFlow(); break;
        // case "auto": await autoLearnFlow(); break;
        // case "versions": await versionsFlow(); break;
        // case "history": await historyFlow(); break;
    }
}

// ============================================================================
// CORE FLOWS - Simplified Menu
// ============================================================================

/**
 * View all learned lessons (Cognitive Engine v4.x)
 * Displays synthesis of mistakes + improvements
 */
async function viewLessonsFlow() {
    // Import cognitive engine
    const { synthesizeLessons } = await import('../cognitive-lesson.js');

    const lessons = synthesizeLessons();

    if (lessons.length === 0) {
        showErrorNote("No lessons learned yet. Use 'Add Lesson' to teach your first pattern!", "No Lessons");
        return;
    }

    // Build enhanced cognitive view
    const content = lessons.map((lesson, i) => {
        // State icon
        const stateIcons = {
            'RAW': '🟥',
            'LEARNING': '🟨',
            'MATURE': '🟩',
            'IDEAL': '🟦',
        };
        const stateIcon = stateIcons[lesson.maturity.state] || '⚪';

        const mistakeCount = lesson.mistakes.length;
        const improveCount = lesson.improvements.length;

        // Build lesson display
        const parts = [
            `${theme.primary(`${i + 1}.`)} ${stateIcon} ${theme.bold(lesson.id)}: ${lesson.title}`,
            `   ${theme.dim(`Intent: ${lesson.intent.goal} (${Math.round(lesson.intent.strength * 100)}%)`)}`,
            `   ${theme.dim(`Confidence: ${Math.round(lesson.maturity.confidence * 100)}% | ${lesson.maturity.recommendation}`)}`,
            '',
            `   🔴 Mistakes (${mistakeCount})`,
        ];

        // Show first 2 mistakes
        if (mistakeCount > 0) {
            lesson.mistakes.slice(0, 2).forEach(m => {
                parts.push(`      • ${theme.dim(m.title || m.message.substring(0, 60))}`);
            });
            if (mistakeCount > 2) {
                parts.push(`      ${theme.dim(`... and ${mistakeCount - 2} more`)}`);
            }
        } else {
            parts.push(`      ${theme.dim('None')}`);
        }

        parts.push('');
        parts.push(`   🟢 Improvements (${improveCount})`);

        // Show first 2 improvements
        if (improveCount > 0) {
            lesson.improvements.slice(0, 2).forEach(imp => {
                parts.push(`      • ${theme.dim(imp.title || imp.message.substring(0, 60))}`);
            });
            if (improveCount > 2) {
                parts.push(`      ${theme.dim(`... and ${improveCount - 2} more`)}`);
            }
        } else {
            parts.push(`      ${theme.warning('⚠️  No best practices learned yet')}`);
        }

        // Show evolution signals if any
        if (lesson.evolution.signals.length > 0) {
            parts.push('');
            parts.push(`   💡 Evolution Signals:`);
            lesson.evolution.signals.slice(0, 1).forEach(signal => {
                parts.push(`      ${signal.type}: ${signal.reason}`);
            });
        }

        return parts.join('\n');
    }).join('\n\n');

    showSuccessNote(content, `🧠 Cognitive Lessons (${lessons.length})`);

    // Wait for user to read
    await p.text({
        message: "Press Enter to continue...",
        placeholder: "",
        initialValue: "",
    });
}

/**
 * Add a new lesson manually
 * Renamed from addPatternFlow for consistency
 */
async function addLessonFlow() {
    const pattern = await textInput({
        message: "Pattern to detect:",
        placeholder: "e.g., console.log",
        validate: (value) => {
            if (!value) return "Please enter a pattern";
        }
    });

    if (p.isCancel(pattern)) {
        p.cancel("Cancelled.");
        return;
    }

    const message = await textInput({
        message: "Error message:",
        placeholder: "e.g., Remove console.log in production",
        validate: (value) => {
            if (!value) return "Please enter a message";
        }
    });

    if (p.isCancel(message)) {
        p.cancel("Cancelled.");
        return;
    }

    const severity = await p.select({
        message: "Severity level:",
        options: [
            { value: "ERROR", label: "Error", hint: "Critical issue" },
            { value: "WARNING", label: "Warning", hint: "Should be fixed" },
        ]
    });

    if (p.isCancel(severity)) {
        p.cancel("Operation cancelled.");
        return;
    }

    const confirmed = await confirm(
        `Add pattern "${theme.primary(pattern)}" with message "${message}"?`,
        true
    );

    if (!confirmed) {
        p.cancel("Cancelled.");
        return;
    }

    const spinner = createSpinner("Adding lesson...");

    try {
        const db = getKnowledge();
        const id = `LEARN-${String(db.lessons.length + 1).padStart(3, '0')}`;

        const lesson = {
            id,
            pattern,
            message,
            severity,
            hitCount: 0,
            added: new Date().toISOString()
        };

        db.lessons.push(lesson);
        saveKnowledge(db);

        spinner.stopSuccess("Lesson added");

        showSuccessNote(
            `${theme.primary('Pattern:')} ${pattern}\n` +
            `${theme.primary('Message:')} ${message}\n` +
            `${theme.primary('Severity:')} ${severity}`,
            `✓ Lesson ${id} Added`
        );
    } catch (error) {
        spinner.stopError("Failed to add lesson");
        showErrorNote(error.message, "✗ Error");
    }

    // Wait to continue
    await p.text({
        message: "Press Enter to continue...",
        placeholder: "",
        initialValue: "",
    });
}

/**
 * Remove a lesson by ID
 * Renamed from removePatternFlow for consistency
 */
async function removeLessonFlow() {
    const db = getKnowledge();
    const patterns = db.lessons || [];

    if (patterns.length === 0) {
        showErrorNote("No patterns to remove.", "No Patterns");
        return;
    }

    // Show list first
    const listContent = patterns.map((p, i) =>
        `${theme.primary(p.id)}: ${p.message}`
    ).join('\n');

    showNote(listContent, "Available Patterns");

    const patternId = await textInput({
        message: "Pattern ID to remove:",
        placeholder: "e.g., LEARN-001",
        validate: (value) => {
            if (!value) return "Please enter a pattern ID";
            if (!patterns.find(p => p.id === value)) {
                return `Pattern ${value} not found`;
            }
        }
    });

    if (p.isCancel(patternId)) {
        p.cancel("Cancelled.");
        return;
    }

    const confirmed = await confirm(
        `Remove pattern ${theme.primary(patternId)}?`,
        false
    );

    if (!confirmed) {
        p.cancel("Cancelled.");
        return;
    }

    db.lessons = db.lessons.filter(l => l.id !== patternId);
    saveKnowledge(db);

    showSuccessNote(`Pattern ${patternId} removed`, "✓ Removed");

    // Wait to continue
    await p.text({
        message: "Press Enter to continue...",
        placeholder: "",
        initialValue: "",
    });
}

// ============================================================================
// DEPRECATED FUNCTIONS (Kept for rollback safety)
// ============================================================================

// DEPRECATED: Query Lessons - Low usage, AI auto-recalls
/*
async function queryLessonsFlow() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, '../../../../.agent/skills/SelfEvolution/scripts/query_lessons.py');

    p.note("Query learns what you learned before to avoid repeating mistakes.\nDescribe what you're about to code.", theme.primary("🔍 Query Lessons"));

    // Get coding context
    const context = await textInput({
        message: "What are you about to code?",
        placeholder: "e.g., menu navigation with ESC handling",
        validate: (value) => {
            if (!value || value.length < 5) return "Please describe what you're coding (min 5 chars)";
        }
    });

    if (p.isCancel(context)) {
        p.cancel("Cancelled.");
        return;
    }

    // Optional scope filter
    const wantScope = await confirm("Filter by scope?", false);

    let scope = null;
    if (wantScope) {
        const scopeOptions = [
            { value: "cli-navigation", label: "CLI Navigation" },
            { value: "api-design", label: "API Design" },
            { value: "code-quality", label: "Code Quality" },
            { value: "file-safety", label: "File Safety" },
            { value: "user-experience", label: "User Experience" },
        ];

        scope = await p.select({
            message: "Select scope:",
            options: scopeOptions
        });

        if (p.isCancel(scope)) {
            p.cancel("Cancelled.");
            return;
        }
    }

    const spinner = createSpinner("Querying lessons...");

    try {
        // Call Python script
        const args = [scriptPath, context];
        if (scope) {
            args.push('--scope', scope);
        }
        args.push('--json');

        const result = spawnSync('python', args, {
            encoding: 'utf-8',
            cwd: path.join(__dirname, '../../../..')
        });

        spinner.stop("Query complete");

        if (result.error) {
            throw new Error(`Failed to run query_lessons.py: ${result.error.message}`);
        }

        if (result.status !== 0) {
            throw new Error(`query_lessons.py failed: ${result.stderr || result.stdout}`);
        }

        const lessons = JSON.parse(result.stdout);

        if (lessons.length === 0) {
            showNote("No relevant lessons found for this context.", "📭 No Matches");
            return;
        }

        // Display lessons
        let output = `Found ${theme.primary(lessons.length)} relevant lesson(s):\n\n`;

        for (const lesson of lessons) {
            const relevance = Math.round(lesson.relevance * 100);
            output += `${theme.primary('[' + lesson.id + ']')} ${relevance}% relevant | ${lesson.severity}\n`;
            output += `${lesson.message}\n`;
            if (lesson.scope) {
                output += `${theme.dim('Scope: ' + lesson.scope)}\n`;
            }
            output += '\n';
        }

        output += theme.dim("💡 Use these lessons to avoid repeating past mistakes!");

        showSuccessNote(output, `📚 ${lessons.length} Lesson(s) Found`);

    } catch (error) {
        spinner.stop("Failed");
        showErrorNote(`Error: ${error.message}`, "❌ Query Failed");
    }
}
*/

// DEPRECATED: Auto-Learn - Redundant with Add Lesson
/*
async function autoLearnFlow() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, '../../../../.agent/skills/SelfEvolution/scripts/auto_learn.py');

    p.note("Auto-learn helps you capture mistakes automatically.\nDescribe what went wrong and what should be done instead.", theme.primary("📚 Auto-Learn"));

    // Get mistake description
    const mistake = await textInput({
        message: "What went wrong?",
        placeholder: "e.g., Used customSelect instead of p.select",
        validate: (value) => {
            if (!value || value.length < 10) return "Please describe the mistake (min 10 chars)";
        }
    });

    if (p.isCancel(mistake)) {
        p.cancel("Cancelled.");
        return;
    }

    // Get correction
    const correction = await textInput({
        message: "What should be done instead?",
        placeholder: "e.g., Always use p.select() + p.isCancel()",
        validate: (value) => {
            if (!value || value.length < 10) return "Please describe the correction (min 10 chars)";
        }
    });

    if (p.isCancel(correction)) {
        p.cancel("Cancelled.");
        return;
    }

    // Get impact
    const impact = await textInput({
        message: "What was the impact?",
        placeholder: "e.g., Menu navigation broken, ESC key stuck",
        validate: (value) => {
            if (!value) return "Please describe the impact";
        }
    });

    if (p.isCancel(impact)) {
        p.cancel("Cancelled.");
        return;
    }

    const spinner = createSpinner("Extracting lesson...");

    try {
        // Call Python script to add lesson
        const context = JSON.stringify({
            mistake,
            correction,
            impact,
            mistake_type: "auto-detected"
        });

        const result = spawnSync('python', [scriptPath, 'add', '--context', context], {
            encoding: 'utf-8',
            cwd: path.join(__dirname, '../../../..')
        });

        spinner.stop("Lesson extracted");

        if (result.error) {
            throw new Error(`Failed to run auto_learn.py: ${result.error.message}`);
        }

        if (result.status !== 0) {
            throw new Error(`auto_learn.py failed: ${result.stderr || result.stdout}`);
        }

        const output = JSON.parse(result.stdout);

        if (!output.success) {
            showErrorNote(output.message, "❌ Failed");
            return;
        }

        showSuccessNote(
            `Lesson ID: ${theme.primary(output.lesson_id)}\n` +
            `Pattern: ${theme.dim(output.lesson.pattern)}\n` +
            `Message: ${output.lesson.message}`,
            `📚 Đã học: ${output.lesson_id}`
        );

    } catch (error) {
        spinner.stop("Failed");
        showErrorNote(`Error: ${error.message}`, "❌ Auto-Learn Failed");
    }
}
*/

// DEPRECATED: Old addPatternFlow - Replaced by addLessonFlow
/*
async function addPatternFlow() {
    const pattern = await textInput({
        message: "Pattern to detect:",
        placeholder: "e.g., console.log",
        validate: (value) => {
            if (!value) return "Please enter a pattern";
        }
    });

    const message = await textInput({
        message: "Error message:",
        placeholder: "e.g., Remove console.log in production",
        validate: (value) => {
            if (!value) return "Please enter a message";
        }
    });

    const severity = await p.select({
        message: "Severity level:",
        options: [
            { value: "ERROR", label: "Error", hint: "Critical issue" },
            { value: "WARNING", label: "Warning", hint: "Should be fixed" },
        ]
    });

    if (p.isCancel(severity)) {
        p.cancel("Operation cancelled.");
        return;
    }

    const confirmed = await confirm(
        `Add pattern "${theme.primary(pattern)}" with message "${message}"?`,
        true
    );

    if (!confirmed) {
        p.cancel("Cancelled.");
        return;
    }

    const spinner = createSpinner("Adding lesson...");

    try {
        const db = getKnowledge();
        const id = `LEARN-${String(db.lessons.length + 1).padStart(3, '0')}`;

        const lesson = {
            id,
            pattern,
            message,
            severity,
            hitCount: 0,
            added: new Date().toISOString()
        };

        db.lessons.push(lesson);
        saveKnowledge(db);

        spinner.stopSuccess("Lesson added");

        showSuccessNote(
            `${theme.primary('Pattern:')} ${pattern}\n` +
            `${theme.primary('Message:')} ${message}\n` +
            `${theme.primary('Severity:')} ${severity}`,
            `✓ Lesson ${id} Added`
        );
    } catch (error) {
        spinner.stopError("Failed to add lesson");
        showErrorNote(error.message, "✗ Error");
    }
}
*/

// DEPRECATED: Old listPatternsFlow - Replaced by viewLessonsFlow
/*
async function listPatternsFlow() {
    const db = getKnowledge();
    const patterns = db.lessons || [];

    if (patterns.length === 0) {
        showErrorNote("No patterns learned yet.", "No Patterns");
        return;
    }

    const content = patterns.map((p, i) =>
        `${theme.primary(`${i + 1}.`)} ${theme.bold(p.id)}: ${p.pattern}\n` +
        `   ${theme.dim(p.message)} ${theme.cyan(`[${p.severity}]`)}`
    ).join('\n\n');

    showSuccessNote(content, `📚 Learned Patterns (${patterns.length})`);
}
*/

// DEPRECATED: Old removePatternFlow - Replaced by removeLessonFlow
/*
async function removePatternFlow() {
    const db = getKnowledge();
    const patterns = db.lessons || [];

    if (patterns.length === 0) {
        showErrorNote("No patterns to remove.", "No Patterns");
        return;
    }

    const patternId = await textInput({
        message: "Pattern ID to remove:",
        placeholder: "e.g., LEARN-001",
        validate: (value) => {
            if (!value) return "Please enter a pattern ID";
            if (!patterns.find(p => p.id === value)) {
                return `Pattern ${value} not found`;
            }
        }
    });

    const confirmed = await confirm(
        `Remove pattern ${theme.primary(patternId)}?`,
        false
    );

    if (!confirmed) {
        p.cancel("Cancelled.");
        return;
    }

    db.lessons = db.lessons.filter(l => l.id !== patternId);
    saveKnowledge(db);

    showSuccessNote(`Pattern ${patternId} removed`, "✓ Removed");
}
*/

// ============================================================================
// DEPRECATED: v4.0 Flows (execCommand undefined, broken)
// ============================================================================

/*
async function statusFlow() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, '../../../../.agent/skills/SelfEvolution/scripts/learning_status.py');

    p.note("View active mistakes and improvements for this project", theme.primary("📊 Learning Status"));

    try {
        const result = await execCommand('python', [scriptPath, 'status'], '.');

        if (result.code === 0) {
            showInfoNote(`${result.output}`, "📊 Learning Status");
        } else {
            showErrorNote(`Failed to get status:\n${result.error}`, "Error");
        }
    } catch (error) {
        showErrorNote(`Python script failed: ${error.message}`, "Error");
    }
}

async function versionsFlow() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, '../../../../.agent/skills/SelfEvolution/scripts/learning_status.py');

    p.note("View version history of your learnings", theme.primary("📚 Version History"));

    try {
        const result = await execCommand('python', [scriptPath, 'versions'], '.');

        if (result.code === 0) {
            showInfoNote(`${result.output}`, "📚 Versions");
        } else {
            showErrorNote(`Failed to get versions:\n${result.error}`, "Error");
        }
    } catch (error) {
        showErrorNote(`Python script failed: ${error.message}`, "Error");
    }
}

async function historyFlow() {
    const __dirname = path.dirname(fileURLToPath(import.meta.url));
    const scriptPath = path.join(__dirname, '../../../../.agent/skills/SelfEvolution/scripts/learning_status.py');

    p.note("View self-improve cycle history", theme.primary("🔄 Self-Improve History"));

    try {
        const result = await execCommand('python', [scriptPath, 'history'], '.');

        if (result.code === 0) {
            showInfoNote(`${result.output}`, "🔄 History");
        } else {
            showErrorNote(`Failed to get history:\n${result.error}`, "Error");
        }
    } catch (error) {
        showErrorNote(`Python script failed: ${error.message}`, "Error");
    }
}
*/

export default runLearnUI;
