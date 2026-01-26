/**
 * Main Menu UI - Interactive CLI interface with custom icons
 */
import { customSelect, pc } from "./custom-select.js";
import { ICONS, showHeader, handleCancel } from "./common.js";
import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Import UI modules
import { runLearnUI } from "./learn-ui.js";
import { runStatsUI } from "./stats-ui.js";
import { runRecallUI } from "./recall-ui.js";
import { runSettingsUI } from "./settings-ui.js";
import { runBackupUI } from "./backup-ui.js";
import { runExportUI } from "./export-ui.js";
import { runProposalsUI } from "./proposals-ui.js";
import { runCompletionUI } from "./completion-ui.js";
import { runInitUI } from "./init-ui.js";
import { runWatchUI } from "./watch-ui.js";
import { runAuditUI } from "./audit-ui.js";
import { runLessonsUI } from "./lessons-ui.js";
import routingUI from "./routing-ui.js";
import { countPendingProposals } from "../proposals.js";
import * as p from "@clack/prompts";

// ============================================================================
// MAIN MENU - TWO LEVEL
// ============================================================================

/**
 * Show main interactive menu (Level 1: Categories)
 */
export async function showMainMenu() {
    showHeader();

    const category = await customSelect({
        message: "What would you like to do?",
        items: [
            { value: "core", label: "Core Features", hint: "Routing, Learn, Recall, Lessons" },
            { value: "analysis", label: "Analysis & Monitor", hint: "Stats, Audit, Watch" },
            { value: "data", label: "Data Management", hint: "Backup, Export, Proposals" },
            { value: "config", label: "Configuration", hint: "Settings, Completion, Init" },
            { value: "exit", label: "Exit", hint: "Close CLI" }
        ]
    });

    if (p.isCancel(category) || category === "exit") {
        p.outro("Goodbye! 👋");
        process.exit(0);
    }

    let action;

    // Level 2: Specific actions
    switch (category) {
        case "core":
            action = await customSelect({
                message: "Core Features",
                items: [
                    { value: "routing", label: "Routing", hint: "Test agent routing" },
                    { value: "learn", label: "Learn", hint: "Teach pattern" },
                    { value: "lessons", label: "Lessons", hint: "View & manage lessons" },
                    { value: "recall", label: "Recall", hint: "Scan violations" },
                    { value: "back", label: "← Back", hint: "Return to categories" }
                ]
            });
            break;
        case "analysis":
            action = await customSelect({
                message: "Analysis & Monitor",
                items: [
                    { value: "stats", label: "Stats", hint: "View statistics" },
                    { value: "audit", label: "Audit", hint: "Compliance check" },
                    { value: "watch", label: "Watch", hint: "Real-time monitor" },
                    { value: "back", label: "← Back", hint: "Return to categories" }
                ]
            });
            break;
        case "data":
            action = await customSelect({
                message: "Data Management",
                items: [
                    { value: "backup", label: "Backup", hint: "Backup & restore" },
                    { value: "export", label: "Export", hint: "Export & import" },
                    { value: "proposals", label: "Proposals", hint: "Skill updates" },
                    { value: "back", label: "← Back", hint: "Return to categories" }
                ]
            });
            break;
        case "config":
            action = await customSelect({
                message: "Configuration",
                items: [
                    { value: "settings", label: "Settings", hint: "Configure behavior" },
                    { value: "completion", label: "Completion", hint: "Shell autocomplete" },
                    { value: "init", label: "Init", hint: "Initialize project" },
                    { value: "back", label: "← Back", hint: "Return to categories" }
                ]
            });
            break;
    }

    // Handle back or cancel
    if (p.isCancel(action) || action === "back") {
        await showMainMenu();
        return;
    }

    // Execute action
    switch (action) {
        case "routing":
            await runRoutingUI();
            break;
        case "learn":
            await runLearnUI();
            break;
        case "lessons":
            await runLessonsUI();
            break;
        case "recall":
            await runRecallUI();
            break;
        case "stats":
            await runStatsUI();
            break;
        case "audit":
            await runAuditUI();
            break;
        case "watch":
            await runWatchUI();
            break;
        case "settings":
            await runSettingsUI();
            break;
        case "backup":
            await runBackupUI();
            break;
        case "export":
            await runExportUI();
            break;
        case "proposals":
            await runProposalsUI();
            break;
        case "completion":
            await runCompletionUI();
            break;
        case "init":
            await runInitUI();
            break;
    }

    // Return to menu after action
    await showMainMenu();
}

// ============================================================================
// ROUTING UI
// ============================================================================

async function runRoutingUI() {
    const request = await p.text({
        message: "Enter a request to test agent routing:",
        placeholder: "e.g., Fix the login authentication bug",
        validate: (value) => {
            if (!value || value.trim().length === 0) {
                return "Please enter a request";
            }
        }
    });

    if (p.isCancel(request)) {
        p.cancel("Cancelled");
        return;
    }

    // Use routing-ui to analyze and show routing
    routingUI.analyzeAndShowRouting(request);

    // Wait for user to see result
    await p.text({
        message: "Press Enter to continue...",
        placeholder: "",
        initialValue: ""
    });
}


// ============================================================================
// CLI ENTRY
// ============================================================================

// Run if executed directly
if (process.argv[1].includes("index.js") || process.argv[1].includes("ui")) {
    showMainMenu().catch(console.error);
}

export default showMainMenu;
