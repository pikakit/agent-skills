/**
 * Init UI - Project initialization wizard
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { detectProjectType, initProject, getDefaultIgnorePatterns } from "../init.js";

/**
 * Interactive init wizard
 */
export async function runInitUI() {
    const projectType = detectProjectType();

    p.intro(`Project Initialization`);
    p.note(`Detected project type: ${pc.cyan(projectType)}`, "Detection");

    const confirm = await p.confirm({
        message: `Initialize PikaKit for this ${projectType} project?`
    });

    if (p.isCancel(confirm) || !confirm) {
        p.cancel("Initialization cancelled.");
        return;
    }

    const s = p.spinner();
    s.start("Initializing...");

    try {
        const result = initProject();
        s.stop("Done!");

        if (result.success) {
            const patterns = getDefaultIgnorePatterns(projectType);

            p.note(
                `Created files:\n` +
                `• ${pc.cyan(".agent/knowledge/lessons-learned.yaml")}\n` +
                `• ${pc.cyan(".agentignore")} (${patterns.length} patterns)\n\n` +
                `Next steps:\n` +
                `1. Run ${pc.green("agent learn")} to teach patterns\n` +
                `2. Run ${pc.green("agent recall .")} to scan code\n` +
                `3. Add ${pc.yellow("agent-hook")} to pre-commit (optional)`,
                pc.green(result.message)
            );
        } else {
            p.note(result.message, pc.yellow("Skipped"));
        }

    } catch (e) {
        s.stop("Failed!");
        p.note(`Error: ${e.message}`, pc.red("Error"));
    }
}

export default runInitUI;
