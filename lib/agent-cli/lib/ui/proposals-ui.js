/**
 * Proposals UI - Review and apply AI agent proposals
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import {
    getQualifyingLessons,
    dismissProposal,
    generateProposalMarkdown,
    countPendingProposals
} from "../proposals.js";

/**
 * Interactive proposals menu
 */
export async function runProposalsUI() {
    p.intro("Skill Proposals (Press ESC to exit)");

    while (true) {
        const qualifying = getQualifyingLessons();

        if (qualifying.length === 0) {
            p.note(
                "No lessons have reached the threshold yet.\nKeep using recall to track patterns!",
                "No Proposals"
            );
            return;
        }

        // Build menu items
        const items = qualifying.map(({ lesson }) => ({
            value: lesson.id,
            label: `[${lesson.id}] ${lesson.message.substring(0, 40)}...`,
            hint: `${lesson.hitCount} hits`
        }));

        items.push({ value: "back", label: "← Back", hint: "Return to main menu" });

        const selected = await p.select({
            message: "Select a proposal to view:",
            options: items
        });

        if (p.isCancel(selected) || selected === "back") {
            return;
        }

        // Find the selected lesson
        const found = qualifying.find(q => q.lesson.id === selected);
        if (!found) continue;

        // Show proposal
        const markdown = generateProposalMarkdown(found.lesson);

        console.log("\n" + pc.cyan("─".repeat(60)));
        console.log(markdown);
        console.log(pc.cyan("─".repeat(60)) + "\n");

        // Actions
        const action = await p.select({
            message: "What would you like to do?",
            options: [
                { value: "copy", label: "Copy to clipboard", hint: "Ready to paste to AI agent" },
                { value: "dismiss", label: "Dismiss", hint: "Don't show this again" },
                { value: "back", label: "← Back", hint: "Return to proposals" }
            ]
        });

        if (p.isCancel(action) || action === "back") continue;

        switch (action) {
            case "copy": {
                // Use clipboardy for cross-platform clipboard
                try {
                    const clipboard = await import("clipboardy");
                    await clipboard.default.write(markdown);
                    p.note("Proposal copied! Paste to your AI agent.", pc.green("Copied"));
                } catch (e) {
                    p.note(`Could not copy automatically.\nPlease copy the text above manually.`, pc.yellow("Manual Copy"));
                }
                break;
            }

            case "dismiss": {
                const confirm = await p.confirm({
                    message: "Dismiss this proposal? It won't appear again."
                });

                if (confirm) {
                    dismissProposal(found.lesson.id);
                    p.note("Proposal dismissed.", pc.dim("✓"));
                }
                break;
            }
        }
    }
}

export default runProposalsUI;
