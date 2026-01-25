/**
 * Learn UI - Interactive lesson creation
 */
import { p, ICONS, showSuccess, handleCancel, getKnowledge, line } from "./common.js";
import yaml from "js-yaml";
import fs from "fs";
import { LESSONS_PATH, KNOWLEDGE_DIR } from "../config.js";

// ============================================================================
// LEARN FLOW
// ============================================================================

/**
 * Interactive learn flow
 */
export async function runLearnUI() {
    p.intro(`${ICONS.learn} Learn a New Pattern (Press ESC to exit)`);

    // Step 1: Pattern input
    const pattern = await p.text({
        message: "Pattern to detect (regex):",
        placeholder: "console\\.log",
        validate: (value) => {
            if (!value) return "Pattern is required";
            try {
                new RegExp(value);
            } catch (e) {
                return "Invalid regex pattern";
            }
        }
    });
    handleCancel(pattern);

    // Step 2: Message input
    const message = await p.text({
        message: "Message when detected:",
        placeholder: "No console.log in production",
        validate: (value) => {
            if (!value) return "Message is required";
        }
    });
    handleCancel(message);

    // Step 3: Severity selection
    const severity = await p.select({
        message: "Severity level:",
        options: [
            { value: "WARNING", label: `${ICONS.warning} WARNING`, hint: "Non-blocking" },
            { value: "ERROR", label: `${ICONS.error} ERROR`, hint: "Blocks commit" }
        ]
    });
    handleCancel(severity);

    // Step 4: Category (optional)
    const category = await p.text({
        message: "Category (optional):",
        placeholder: "general",
        initialValue: "general"
    });
    handleCancel(category);

    // Step 5: Confirmation
    p.note(
        `Pattern:  /${pattern}/\nMessage:  ${message}\nSeverity: ${severity}\nCategory: ${category}`,
        "Summary"
    );

    const confirm = await p.confirm({
        message: "Add this lesson?"
    });
    handleCancel(confirm);

    if (!confirm) {
        p.cancel("Lesson not added.");
        return;
    }

    // Save lesson
    try {
        const db = getKnowledge();
        const id = `LEARN-${String(db.lessons.length + 1).padStart(3, "0")}`;

        const lesson = {
            id,
            pattern,
            message,
            severity,
            category,
            source: "manual",
            hitCount: 0,
            lastHit: null,
            autoEscalated: false,
            addedAt: new Date().toISOString()
        };

        db.lessons.push(lesson);

        // Save to file
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        fs.writeFileSync(LESSONS_PATH, yaml.dump(db), "utf8");

        showSuccess(`Added: [${id}] ${pattern}`);
    } catch (e) {
        p.cancel(`${ICONS.error} Failed to save lesson: ${e.message}`);
    }
}

export default runLearnUI;
