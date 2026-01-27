/**
 * Settings UI - Toggle Auto-Learning and Auto-Updating
 * Uses Clack-style icons for consistency
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { customSelect } from "./custom-select.js";
import {
    loadSettings,
    saveSettings,
    toggleAutoLearning,
    toggleAutoUpdating
} from "../settings.js";

// ============================================================================
// SETTINGS MENU
// ============================================================================

/**
 * Interactive settings menu with Clack icons
 */
export async function runSettingsUI() {
    p.intro("Settings (Press ESC to return)");

    while (true) {
        const settings = loadSettings();

        const action = await p.select({
            message: "Configure Agent behavior:",
            options: [
                {
                    value: "autoLearn",
                    label: `Auto-Learning: ${settings.autoLearning ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Learn from mistakes"
                },
                {
                    value: "autoUpdate",
                    label: `Auto-Updating: ${settings.autoUpdating ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Update threshold hits"
                },
                {
                    value: "threshold",
                    label: `Update Threshold: ${settings.updateThreshold}`,
                    hint: "Hits before update"
                },
                { value: "back", label: "← Back", hint: "Return to main menu" }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "autoLearn": {
                const newValue = toggleAutoLearning();
                p.note(
                    `Auto-Learning is now ${newValue ? pc.green("ON") : pc.red("OFF")}`,
                    "Setting Updated"
                );
                break; // Continue loop to show menu again
            }
            case "autoUpdate": {
                const newValue = toggleAutoUpdating();
                if (newValue) {
                    p.note(
                        `Auto-Updating is now ${pc.green("ON")}\n\n` +
                        `When patterns become valuable, Agent will:\n` +
                        `• Analyze learned lessons\n` +
                        `• Generate update proposals\n` +
                        `• Notify you for approval`,
                        "Setting Updated"
                    );
                } else {
                    p.note(
                        `Auto-Updating is now ${pc.red("OFF")}`,
                        "Setting Updated"
                    );
                }
                break; // Continue loop
            }
            case "threshold": {
                const newThreshold = await p.text({
                    message: "Set new threshold (1-20):",
                    placeholder: "5",
                    initialValue: String(settings.updateThreshold),
                    validate: (value) => {
                        const num = parseInt(value);
                        if (isNaN(num) || num < 1 || num > 20) {
                            return "Please enter a number between 1 and 20";
                        }
                    }
                });

                if (!p.isCancel(newThreshold)) {
                    settings.updateThreshold = parseInt(newThreshold);
                    saveSettings(settings);
                    p.note(
                        `Update threshold set to ${settings.updateThreshold}`,
                        "Setting Updated"
                    );
                }
                break; // Continue loop
            }
        }
    }
}

export default runSettingsUI;
