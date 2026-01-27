/**
 * Recall UI - Scan files for violations
 */
import {
    showIntro,
    textInput,
    createSpinner,
    showSuccessNote,
    showErrorNote,
    theme,
} from "./clack-helpers.js";
import { scanDirectory, loadKnowledge, saveKnowledge } from "../recall.js";
import * as p from "@clack/prompts";
import path from "path";

export async function runRecallUI() {
    showIntro("🔍 Recall - Scan Violations");

    // Get file/directory path
    const targetPath = await textInput({
        message: "File or directory to scan:",
        placeholder: "e.g., src/ or .",
        validate: (value) => {
            if (!value) return "Please enter a path";
        },
    });

    // Run scan
    const spinner = createSpinner(`Scanning ${targetPath}...`);

    try {
        const db = loadKnowledge();

        if (!db.lessons || db.lessons.length === 0) {
            spinner.stop("No patterns");
            showErrorNote("No lessons learned yet. Use the Learn command first.", "No Patterns");
            return;
        }

        const resolvedPath = path.resolve(targetPath);
        const { results } = scanDirectory(resolvedPath, db);
        spinner.stopSuccess("Scan complete");

        // Calculate stats
        let totalViolations = 0;
        let errorCount = 0;
        let warningCount = 0;

        results.forEach(result => {
            result.violations.forEach(({ lesson, matches }) => {
                totalViolations += matches.length;
                if (lesson.severity === "ERROR") {
                    errorCount += matches.length;
                } else {
                    warningCount += matches.length;
                }
            });
        });

        // Display results
        if (totalViolations === 0) {
            showSuccessNote(
                `Scanned ${theme.primary(results.length)} files\n` +
                `No violations found! 🎉`,
                "✓ All Clear"
            );
        } else {
            // Build content
            let content = `Found ${theme.error(totalViolations)} violation(s)\n`;
            content += `${theme.error('●')} ${errorCount} error(s)  ${theme.warning('●')} ${warningCount} warning(s)\n\n`;

            // Show first 5 results
            const shownResults = results.slice(0, 5);
            shownResults.forEach(result => {
                if (result.violations.length === 0) return;

                content += `${theme.primary(path.relative(process.cwd(), result.file))}\n`;
                result.violations.forEach(({ lesson, matches }) => {
                    const severity = lesson.severity === "ERROR" ? theme.error('[ERROR]') : theme.warning('[WARNING]');
                    content += `   ${severity} ${lesson.message}\n`;
                    matches.slice(0, 2).forEach(m => {
                        content += `      ${theme.dim(`L${m.line}:`)} ${m.content}\n`;
                    });
                    if (matches.length > 2) {
                        content += `      ${theme.dim(`... and ${matches.length - 2} more`)}\n`;
                    }
                });
                content += "\n";
            });

            if (results.length > 5) {
                content += `${theme.dim(`... and ${results.length - 5} more file(s)`)}`;
            }

            showErrorNote(content, `✗ Found ${totalViolations} Violations`);

            // Save updated hit counts
            saveKnowledge(db);
        }

    } catch (error) {
        spinner.stopError("Scan failed");
        showErrorNote(error.message, "✗ Error");
    }

    // Wait to continue
    await p.text({
        message: "Press Enter to continue...",
        placeholder: "",
        initialValue: "",
    });
}

export default runRecallUI;
