/**
 * Knowledge UI - Unified Lessons + Signals Manager
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { runLessonsUI } from "./lessons-ui.js";
import { runEvolutionSignalsUI } from "./evolution-signals-ui.js";

/**
 * Show unified Knowledge management interface
 */
export async function runKnowledgeUI() {
    // Clear terminal và reset cursor
    process.stdout.write('\x1Bc');

    p.intro(pc.cyan("📚 Knowledge Manager"));

    while (true) {
        const action = await p.select({
            message: "What would you like to do?",
            options: [
                {
                    value: "lessons",
                    label: "📖 Learned Patterns",
                    hint: "View & manage lessons"
                },
                {
                    value: "signals",
                    label: "📡 Pending Review",
                    hint: "Evolution signals queue"
                },
                {
                    value: "back",
                    label: "← Back",
                    hint: "Return to main menu"
                }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "lessons":
                await runLessonsUI();
                break;
            case "signals":
                await runEvolutionSignalsUI();
                break;
        }
    }
}

export default runKnowledgeUI;
