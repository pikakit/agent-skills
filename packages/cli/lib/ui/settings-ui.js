/**
 * Settings UI - Toggle Auto-Learning and Auto-Updating
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import { ICONS } from "./common.js";
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
 * Interactive settings menu
 */
export async function runSettingsUI() {
    while (true) {
        const settings = loadSettings();

        p.intro(`${ICONS.settings || "⚙️"} Settings`);

        const action = await p.select({
            message: "Configure Agent behavior:",
            options: [
                {
                    value: "autoLearning",
                    label: `🎓 Auto-Learning: ${settings.autoLearning ? pc.green("[ON]") : pc.red("[OFF]")}`,
                    hint: "Agent learns from your mistakes automatically"
                },
                {
                    value: "autoUpdating",
                    label: `🔄 Auto-Updating: ${settings.autoUpdating ? pc.green("[ON]") : pc.red("[OFF]")}`,
                    hint: "Agent proposes skill updates when patterns are valuable"
                },
                {
                    value: "threshold",
                    label: `📊 Update Threshold: ${settings.updateThreshold}`,
                    hint: "Hits needed before proposing update"
                },
                {
                    value: "back",
                    label: "← Back to main menu",
                    hint: "Return to main menu"
                }
            ]
        });

        if (p.isCancel(action) || action === "back") {
            return;
        }

        switch (action) {
            case "autoLearning": {
                const newValue = toggleAutoLearning();
                p.note(
                    `Auto-Learning is now ${newValue ? pc.green("ON") : pc.red("OFF")}`,
                    "🎓 Setting Updated"
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
                        "🔄 Setting Updated"
                    );
                } else {
                    p.note(
                        `Auto-Updating is now ${pc.red("OFF")}`,
                        "🔄 Setting Updated"
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
                        "📊 Setting Updated"
                    );
                }
                break;
            }
        }
    }
}

export default runSettingsUI;
