/**
 * Export/Import UI - Share settings between projects
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import path from "path";
import { cwd } from "../config.js";
import { exportData, importData } from "../export.js";

/**
 * Interactive export/import menu
 */
export async function runExportUI() {
    p.intro("Export & Import (Press ESC to exit)");

    while (true) {

        const action = await p.select({
            message: "What would you like to do?",
            options: [
                { value: "export", label: "Export", hint: "Save lessons & settings to JSON" },
                { value: "import", label: "Import", hint: "Load from JSON file" },
                { value: "back", label: "Back", hint: "Return to main menu" }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "export": {
                const filename = await p.text({
                    message: "Export filename:",
                    placeholder: "agent-skills-export.json",
                    initialValue: "agent-skills-export.json"
                });

                if (p.isCancel(filename)) break;

                const outputPath = path.join(cwd, filename);
                const success = exportData(outputPath);

                if (success) {
                    p.note(
                        `Exported to:\n${pc.dim(outputPath)}`,
                        pc.green("Success")
                    );
                } else {
                    p.note("Failed to export", pc.red("Error"));
                }
                break;
            }

            case "import": {
                const filename = await p.text({
                    message: "Import filename:",
                    placeholder: "agent-skills-export.json",
                    validate: (v) => {
                        if (!v) return "Filename required";
                    }
                });

                if (p.isCancel(filename)) break;

                const mode = await p.select({
                    message: "Import mode:",
                    options: [
                        { value: "merge", label: "Merge", hint: "Add new, keep existing" },
                        { value: "replace", label: "Replace", hint: "Overwrite all data" }
                    ]
                });

                if (p.isCancel(mode)) break;

                const inputPath = path.join(cwd, filename);
                const result = importData(inputPath, mode);

                if (result.success) {
                    p.note(
                        `Imported ${result.lessonsCount} lesson(s)\n` +
                        `Settings: ${result.hasSettings ? "Yes" : "No"}`,
                        pc.green("Success")
                    );
                } else {
                    p.note("Failed to import. Check file exists and is valid JSON.", pc.red("Error"));
                }
                break;
            }
        }
    }
}

export default runExportUI;
