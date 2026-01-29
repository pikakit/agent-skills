/**
 * Settings UI - Minimal Interactive settings configuration
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
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
 * Interactive settings menu - Minimal version
 */
export async function runSettingsUI() {
    while (true) {
        const settings = loadSettings();

        const action = await p.select({
            message: "⚙️  Settings",
            options: [
                {
                    value: "autoLearn",
                    label: `🤖 Auto-Learning: ${settings.autoLearning ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Learn from mistakes"
                },
                {
                    value: "autoUpdate",
                    label: `🔄 Auto-Updating: ${settings.autoUpdating ? pc.green("[ON]") : pc.dim("[OFF]")}`,
                    hint: "Auto-escalate patterns"
                },
                {
                    value: "threshold",
                    label: `📈 Update Threshold: ${pc.cyan(settings.updateThreshold)}`,
                    hint: "Hits before escalation"
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
                break;
            }
            case "autoUpdate": {
                const newValue = toggleAutoUpdating();
                if (newValue) {
                    p.note(
                        `Auto-Updating is now ${pc.green("ON")}\n\n` +
                        `Patterns will auto-escalate WARNING → ERROR\n` +
                        `when violations exceed threshold.`,
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
                    message: "Set new threshold (1-50):",
                    placeholder: "10",
                    initialValue: String(settings.updateThreshold),
                    validate: (value) => {
                        const num = parseInt(value);
                        if (isNaN(num) || num < 1 || num > 50) {
                            return "Please enter a number between 1 and 50";
                        }
                    }
                });

                if (!p.isCancel(newThreshold)) {
                    settings.updateThreshold = parseInt(newThreshold);
                    saveSettings(settings);
                    p.note(
                        `Update threshold set to ${pc.cyan(settings.updateThreshold)}`,
                        "Setting Updated"
                    );
                }
                break;
            }
        }
    }
}

export default runSettingsUI;
