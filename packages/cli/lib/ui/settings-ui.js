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
    while (true) {
        const settings = loadSettings();

        p.intro("Settings (Press ESC to exit)");

        const action = await customSelect({
            message: "Configure Agent behavior:",
            items: [
                {
                    value: "autoLearning",
                    label: `Auto-Learning: ${settings.autoLearning ? pc.green("[ON]") : pc.red("[OFF]")}`,
                    hint: "Learn from mistakes"
                },
                {
                    value: "autoUpdating",
                    label: `Auto-Updating: ${settings.autoUpdating ? pc.green("[ON]") : pc.red("[OFF]")}`,
                    hint: "Propose skill updates"
                },
                {
                    value: "threshold",
                    label: `Update Threshold: ${settings.updateThreshold}`,
                    hint: "Hits before update"
                },
                {
                    value: "back",
                    label: "Back to main menu",
                    hint: "Return"
                }
            ]
        });

        if (action === undefined || action === null || action === "back") {
            return;
        }

        switch (action) {
            case "autoLearning": {
                const newValue = toggleAutoLearning();
                p.note(
                    `Auto-Learning is now ${newValue ? pc.green("ON") : pc.red("OFF")}`,
                    "Setting Updated"
                );
                break;
            }
            case "autoUpdating": {
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
                break;
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
                break;
            }
        }
    }
}

export default runSettingsUI;
