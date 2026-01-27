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
    theme
} from "./clack-helpers.js";
import { getKnowledge, saveKnowledge } from "./common.js";
import * as p from "@clack/prompts";

export async function runLearnUI() {
    showIntro("📚 Learn New Pattern");

    // Action menu
    const action = await showActionMenu({
        message: "What would you like to do?",
        items: [
            { value: "add", label: "Add Pattern", hint: "Teach a new lesson" },
            { value: "list", label: "List Patterns", hint: "View all learned patterns" },
            { value: "remove", label: "Remove Pattern", hint: "Delete a pattern" },
        ],
        includeExit: true
    });

    switch (action) {
        case "add":
            await addPatternFlow();
            break;
        case "list":
            await listPatternsFlow();
            break;
        case "remove":
            await removePatternFlow();
            break;
    }
}

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
        `Add pattern "${theme.cyan(pattern)}" with message "${message}"?`,
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
        `Remove pattern ${theme.cyan(patternId)}?`,
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

export default runLearnUI;
