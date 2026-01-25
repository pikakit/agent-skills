/**
 * Main Menu UI - Interactive CLI interface with custom icons
 */
import { customSelect, pc } from "./custom-select.js";
import { ICONS, showHeader, handleCancel } from "./common.js";

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
import routingUI from "./routing-ui.js";
import { countPendingProposals } from "../proposals.js";
import * as p from "@clack/prompts";

// ============================================================================
// MAIN MENU
// ============================================================================

/**
 * Show main interactive menu
 */
export async function showMainMenu() {
    showHeader();

    const action = await customSelect({
        message: "What would you like to do?",
        items: [
            { value: "routing", label: "🤖 Routing", hint: "Test agent routing" },
            { value: "learn", label: "Learn", hint: "Teach a new pattern" },
            { value: "recall", label: "Recall", hint: "Scan for violations" },
            { value: "stats", label: "Stats", hint: "View statistics" },
            { value: "audit", label: "Audit", hint: "Run compliance check" },
            { value: "watch", label: "Watch", hint: "Real-time monitoring" },
            { value: "settings", label: "Settings", hint: "Configure agent behavior" },
            { value: "backup", label: "Backup", hint: "Backup & restore data" },
            { value: "export", label: "Export", hint: "Export & import data" },
            { value: "proposals", label: "Proposals", hint: "AI agent skill updates" },
            { value: "completion", label: "Completion", hint: "Shell autocomplete setup" },
            { value: "init", label: "Init", hint: "Initialize project config" },
            { value: "exit", label: "Exit", hint: "Close the CLI" }
        ]
    });

    // Handle CTRL+C
    if (action === undefined || action === null) {
        p.cancel("Operation cancelled.");
        process.exit(0);
    }

    switch (action) {
        case "routing":
            await runRoutingUI();
            break;
        case "learn":
            await runLearnUI();
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
        case "exit":
            p.outro("Goodbye! 👋");
            process.exit(0);
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
// PLACEHOLDER UIs (to be implemented)
// ============================================================================

async function runAuditUI() {
    p.note("Running audit...", `${ICONS.audit} Audit`);

    // Import and run audit
    const { spawn } = await import("child_process");
    const audit = spawn("node", ["lib/audit.js", "."], {
        cwd: process.cwd(),
        stdio: "inherit"
    });

    await new Promise(resolve => audit.on("close", resolve));
}

async function runWatchUI() {
    p.note("Starting watcher... (Press CTRL+C to stop)", `${ICONS.watch} Watch`);

    const { spawn } = await import("child_process");
    const watcher = spawn("node", ["lib/watcher.js", "."], {
        cwd: process.cwd(),
        stdio: "inherit"
    });

    await new Promise(resolve => watcher.on("close", resolve));
}

// ============================================================================
// CLI ENTRY
// ============================================================================

// Run if executed directly
if (process.argv[1].includes("index.js") || process.argv[1].includes("ui")) {
    showMainMenu().catch(console.error);
}

export default showMainMenu;
