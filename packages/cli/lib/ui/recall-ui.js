/**
 * Recall UI - Interactive code scanning
 */
import { p, ICONS, getKnowledge, showSuccess, handleCancel, line } from "./common.js";
import { scanDirectory, printResults, saveKnowledge } from "../recall.js";
import path from "path";

// ============================================================================
// RECALL FLOW
// ============================================================================

/**
 * Interactive recall/scan flow
 */
export async function runRecallUI() {
    const db = getKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        p.note(
            `${ICONS.info} No lessons learned yet.\n\nUse the Learn command first to add patterns.`,
            `${ICONS.recall} Recall`
        );
        return;
    }

    p.intro(`${ICONS.recall} Recall - Scan for Violations`);

    // Step 1: Path input
    const targetPath = await p.text({
        message: "Path to scan:",
        placeholder: ".",
        initialValue: ".",
        validate: (value) => {
            if (!value) return "Path is required";
        }
    });
    handleCancel(targetPath);

    // Step 2: Show spinner during scan
    const s = p.spinner();
    s.start(`Scanning ${targetPath} against ${db.lessons.length} pattern(s)...`);

    try {
        const resolvedPath = path.resolve(targetPath);
        const { results } = scanDirectory(resolvedPath, db);

        s.stop("Scan complete");

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
            p.note(
                `${ICONS.success} No violations found!\n\nYour code is clean.`,
                "Results"
            );
        } else {
            let content = `Found ${totalViolations} violation(s)\n`;
            content += `${ICONS.error} ${errorCount} error(s)  ${ICONS.warning} ${warningCount} warning(s)\n`;
            content += `\n${line(40)}\n\n`;

            // Show first 5 results
            const shownResults = results.slice(0, 5);
            shownResults.forEach(result => {
                if (result.violations.length === 0) return;

                content += `${path.relative(process.cwd(), result.file)}\n`;
                result.violations.forEach(({ lesson, matches }) => {
                    const icon = lesson.severity === "ERROR" ? ICONS.error : ICONS.warning;
                    content += `   ${icon} [${lesson.id}] ${lesson.message}\n`;
                    matches.slice(0, 2).forEach(m => {
                        content += `      L${m.line}: ${m.content}\n`;
                    });
                    if (matches.length > 2) {
                        content += `      ... and ${matches.length - 2} more\n`;
                    }
                });
                content += "\n";
            });

            if (results.length > 5) {
                content += `... and ${results.length - 5} more file(s)\n`;
            }

            p.note(content, "Violations Found");

            // Save updated hit counts
            saveKnowledge(db);
        }

    } catch (e) {
        s.stop("Scan failed");
        p.cancel(`${ICONS.error} Error: ${e.message}`);
    }

    // Show completion
    p.outro("Scan complete");
}

export default runRecallUI;
