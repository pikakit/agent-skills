/**
 * Lessons UI - View and manage learned lessons
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { customSelect } from "./custom-select.js";
import { loadKnowledge, saveKnowledge } from "../recall.js";

/**
 * Interactive lessons viewer
 */
export async function runLessonsUI() {
    p.intro("Lessons Manager");

    while (true) {
        const db = loadKnowledge();

        if (!db.lessons || db.lessons.length === 0) {
            p.note("No lessons learned yet.\n\nUse Learn to add patterns.", "Lessons");
            return;
        }

        // Build menu items from lessons
        const items = db.lessons.map(lesson => ({
            value: lesson.id,
            label: `[${lesson.id}] ${lesson.pattern.substring(0, 30)}`,
            hint: `${lesson.severity} · ${lesson.hitCount || 0} hits`
        }));

        items.push({ value: "back", label: "Back to main menu", hint: "Return" });

        const selected = await customSelect({
            message: `${db.lessons.length} lesson(s) available:`,
            items
        });

        if (p.isCancel(selected) || selected === "back") {
            return;
        }

        // Find and display the selected lesson
        const lesson = db.lessons.find(l => l.id === selected);
        if (!lesson) continue;

        // Show lesson details
        const details = [
            `${pc.dim("ID:")}       ${lesson.id}`,
            `${pc.dim("Pattern:")}  ${lesson.pattern}`,
            `${pc.dim("Message:")}  ${lesson.message}`,
            `${pc.dim("Severity:")} ${lesson.severity === "ERROR" ? pc.red(lesson.severity) : pc.yellow(lesson.severity)}`,
            `${pc.dim("Category:")} ${lesson.category || "general"}`,
            `${pc.dim("Hits:")}     ${lesson.hitCount || 0}`,
            `${pc.dim("Added:")}    ${lesson.addedAt ? new Date(lesson.addedAt).toLocaleDateString() : "Unknown"}`
        ];

        if (lesson.autoEscalated) {
            details.push(`${pc.dim("Status:")}   ${pc.magenta("Auto-escalated")}`);
        }

        p.note(details.join("\n"), `Lesson ${lesson.id}`);

        while (true) {
            const action = await p.select({
                message: "What would you like to do?",
                options: [
                    // Assuming menuOptions is defined elsewhere or meant to be added.
                    // For now, I'll use the original options and add the new back option.
                    { value: "delete", label: "Delete lesson", hint: "Remove this lesson" },
                    { value: "back", label: "← Back", hint: "Return to main menu" }
                ]
            });

            if (p.isCancel(action) || action === "back") {
                return;
            }

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
