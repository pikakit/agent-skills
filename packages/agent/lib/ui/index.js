/**
 * Main Menu UI - Interactive CLI interface
 */
import { showIntro, showActionMenu, theme } from "./clack-helpers.js";
import { loadSettings } from "../settings.js";

import { fileURLToPath } from "url";
import { dirname, join } from "path";

// Import UI modules
import { runLearnUI } from "./learn-ui.js";
import { runStatsUI } from "./stats-ui.js";
import { runRecallUI } from "./recall-ui.js";
import { runFixAllUI } from "./fix-all-ui.js";
import { runSettingsUI } from "./settings-ui.js";
import { runBackupUI } from "./backup-ui.js";
import { runExportUI } from "./export-ui.js";
import { runProposalsUI } from "./proposals-ui.js";
import { runCompletionUI } from "./completion-ui.js";
import { runInitUI } from "./init-ui.js";
// Removed: audit-ui and watch-ui (audit redundant with recall, watch kept as CLI-only)
import { runLessonsUI } from "./lessons-ui.js";
import { runEvolutionSignalsUI } from "./evolution-signals-ui.js";
import { runKnowledgeUI } from "./knowledge-ui.js";
import { runHelpUI } from "./help-ui.js";
import { runDashboardUI } from "./dashboard-ui.js";
import routingUI from "./routing-ui.js";
import * as p from "@clack/prompts";
import { VERSION } from "../config.js";
import gradient from 'gradient-string';

// ============================================================================
// ASCII BANNER
// ============================================================================

const AGENT_BANNER = `
    _                    _   
   / \\   __ _  ___ _ __ | |_ 
  / _ \\ / _\` |/ _ \\ '_ \\| __|
 / ___ \\ (_| |  __/ | | | |_ 
/_/   \\_\\__, |\\___|_| |_|\\__|
        |___/                
`;

// Custom gradient: white → gray (like PikaKit style)
const agentGradient = gradient(['#ffffff', '#bbbbbb', '#888888', '#555555']);

function showAgentBanner() {
    // Extra clear to remove Clack prompt residuals
    process.stdout.write('\x1B[2J\x1B[0f');
    console.clear();
    console.log(''); // Extra space at top
    const lines = AGENT_BANNER.split('\n').filter(l => l.trim() !== '');

    // Print all lines except last with gradient
    for (let i = 0; i < lines.length - 1; i++) {
        console.log(agentGradient(lines[i]));
    }

    // Last line + version (aligned like PikaKit)
    console.log(agentGradient(lines[lines.length - 1]) + theme.dim(`  v${VERSION}`));
    console.log(''); // Empty line to break vertical connector
}

// ============================================================================
// MAIN MENU
// ============================================================================

/**
 * Show main interactive menu
 */
export async function showMainMenu() {
    while (true) {
        showAgentBanner();

        // Load settings to check auto-learning status
        const settings = loadSettings();
        const autoLearningEnabled = settings.autoLearn !== false; // Default to true

        // Build menu options dynamically
        const menuOptions = [
            // ═════════════════════════════════════════════
            // 🔍 SCANNING & ACTIONS
            // ═════════════════════════════════════════════
            { value: "scanall", label: "🔎 Scan All", hint: "Check & fix violations" },

            // ═════════════════════════════════════════════
            // 📚 LEARNING & KNOWLEDGE
            // ═════════════════════════════════════════════
        ];

        // Only show Learn if auto-learning is OFF
        if (!autoLearningEnabled) {
            menuOptions.push({ value: "learn", label: "📝 Learn", hint: "Teach new pattern" });
        }

        menuOptions.push(
            { value: "lessons", label: "📚 Lessons", hint: "View & manage" },

            // ═════════════════════════════════════════════
            // 📊 ANALYTICS
            // ═════════════════════════════════════════════
            { value: "stats", label: "💡 Insights", hint: "Stats & signals" },

            // ═════════════════════════════════════════════
            // ⚙️  SETTINGS & MANAGEMENT
            // ═════════════════════════════════════════════
            { value: "settings", label: "⚙️  Settings", hint: "Configure behavior" },
            { value: "backup", label: "💾 Backup", hint: "Data management" },

            // ═════════════════════════════════════════════
            // 📊 DASHBOARD
            // ═════════════════════════════════════════════
            { value: "dashboard", label: "📊 Dashboard", hint: "Web UI & Help" },

            { value: "exit", label: "👋 Exit" }
        );

        const action = await p.select({
            message: "What would you like to do?",
            options: menuOptions
        });

        if (p.isCancel(action) || action === "exit") {
            p.outro("Goodbye! 👋");
            process.exit(0);
        }

        // Execute action directly (no submenus)
        switch (action) {
            case "learn":
                await runLearnUI();
                break;
            case "lessons":
                await runLessonsUI();
                break;
            case "scanall":
                await runRecallUI(true); // Auto-scan mode with fix option
                break;
            case "stats":
                await runStatsUI(); // Now includes signals
                break;
            case "settings":
                await runSettingsUI();
                break;
            case "backup":
                await runBackupUI();
                break;
            case "dashboard":
                await runDashboardUI();
                break;
        }

        // After action completes, loop back to main menu
    }
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
