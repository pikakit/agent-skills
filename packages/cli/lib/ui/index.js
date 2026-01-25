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
            { value: "learn", label: "Learn", hint: "Teach a new pattern" },
            { value: "recall", label: "Recall", hint: "Scan for violations" },
            { value: "stats", label: "Stats", hint: "View statistics" },
            { value: "audit", label: "Audit", hint: "Run compliance check" },
            { value: "watch", label: "Watch", hint: "Real-time monitoring" },
            { value: "settings", label: "Settings", hint: "Configure agent behavior" },
            { value: "exit", label: "Exit", hint: "Close the CLI" }
        ]
    });

    // Handle CTRL+C
    if (action === undefined || action === null) {
        p.cancel("Operation cancelled.");
        process.exit(0);
    }

    switch (action) {
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
        case "exit":
            p.outro("Goodbye! 👋");
            process.exit(0);
    }

    // Return to menu after action
    await showMainMenu();
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
