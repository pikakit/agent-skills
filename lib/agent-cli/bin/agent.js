#!/usr/bin/env node
/**
 * Smart Agent CLI - ESM Version (Production-Ready)
 * 
 * The main interface for humans to interact with the Smart Agent Skills system.
 * 
 * Commands:
 *   learn          Add new lessons to memory
 *   recall         Check files against memory
 *   audit          Full compliance audit
 *   watch          Real-time file monitoring
 *   stats          Knowledge base statistics
 *   install-hooks  Install git pre-commit hook
 *   lint-learn     Auto-learn from ESLint output
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { VERSION } from "../lib/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const COMMAND = ARGS[0];
const SCRIPTS_DIR = path.join(__dirname, "..", "lib");
const HOOKS_DIR = path.join(SCRIPTS_DIR, "hooks");
const DASHBOARD_DIR = path.join(__dirname, "..", "dashboard");
const AUTO_LEARN_DIR = path.join(__dirname, "..", "scripts");

/**
 * Run a script with given arguments
 * @param {string} script - Script filename (relative to lib/)
 * @param {string[]} args - Arguments to pass
 * @param {string} baseDir - Base directory for script
 */
function run(script, args = [], baseDir = SCRIPTS_DIR) {
    const scriptPath = path.join(baseDir, script);
    const child = spawn("node", [scriptPath, ...args], {
        stdio: "inherit",
        shell: true
    });

    child.on("close", (code) => {
        process.exit(code || 0);
    });

    child.on("error", (err) => {
        console.error(`❌ Failed to run ${script}:`, err.message);
        process.exit(1);
    });
}

function printHelp() {
    console.log(`
🤖 PikaKit CLI v${VERSION}

Usage: agent <command> [options]

${"─".repeat(50)}

📚 CORE COMMANDS:

  learn          Teach a new lesson to the memory
                 agent learn --add --pattern "var " --message "Use let/const"
                 agent learn --list
                 agent learn --remove LEARN-001

  recall         Check file(s) against learned patterns
                 agent recall src/app.js
                 agent recall ./src

  audit          Run full compliance audit
                 agent audit [directory]

${"─".repeat(50)}

🚀 PRODUCTION FEATURES:

  watch          Real-time file monitoring
                 agent watch [directory]

  stats          Knowledge base statistics
                 agent stats

  install-hooks  Install git pre-commit hook
                 agent install-hooks
                 agent install-hooks --remove

  lint-learn     Auto-learn from ESLint JSON output
                 npx eslint . --format json | agent lint-learn

  fix            🆕 Auto-fix violations
                 agent fix <file|dir> [--mode safe|aggressive]

  sync-skills    🆕 Sync hot patterns to SKILL.md
                 agent sync-skills

  dashboard      🆕 Start Auto-Learn dashboard
                 agent dashboard

  auto-learn     🆕 Run auto-learn scripts
                 agent auto-learn --scan
                 agent auto-learn --analyze
                 agent auto-learn --check "intent"

${"─".repeat(50)}

📖 HELP:

  help, --help   Show this help message
  --version      Show version number

💡 Docs: https://github.com/pikakit/agent-skills
`);
}

// Command routing
switch (COMMAND) {
    // Core commands (v2 versions)
    case "learn":
        run("learn.js", ARGS.slice(1));
        break;
    case "recall":
        run("recall.js", ARGS.slice(1));
        break;
    case "audit":
        run("audit.js", ARGS.slice(1));
        break;

    // Production features
    case "watch":
        run("watcher.js", ARGS.slice(1));
        break;
    case "stats":
        run("stats.js", ARGS.slice(1));
        break;
    case "install-hooks":
        run("install-hooks.js", ARGS.slice(1), HOOKS_DIR);
        break;
    case "lint-learn":
        run("lint-learn.js", ARGS.slice(1), HOOKS_DIR);
        break;
    case "fix":
        run("fix.js", ARGS.slice(1));
        break;
    case "sync-skills":
        run("skill-learn.js", ARGS.slice(1));
        break;

    // Auto-Learn features
    case "dashboard":
        run("dashboard_server.js", ARGS.slice(1), DASHBOARD_DIR);
        break;
    case "auto-learn":
        const subCmd = ARGS[1];
        if (subCmd === "--scan" || subCmd === "-s") {
            run("error_sensor.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else if (subCmd === "--success") {
            run("success_sensor.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else if (subCmd === "--analyze" || subCmd === "-a") {
            run("pattern_analyzer.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else if (subCmd === "--check" || subCmd === "-c") {
            run("pre_execution_check.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else if (subCmd === "--adapt") {
            run("adaptive_engine.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else if (subCmd === "--inject") {
            run("skill_injector.js", ARGS.slice(2), AUTO_LEARN_DIR);
        } else {
            console.log("Usage: agent auto-learn [--scan|--success|--analyze|--check|--adapt|--inject]");
        }
        break;

    // Meta
    case "--version":
    case "-v":
        console.log(VERSION);
        break;
    case "help":
    case "--help":
    case "-h":
        printHelp();
        break;
    case undefined:
        // No command = show interactive Clack menu
        import("../lib/ui/index.js").then(m => m.showMainMenu()).catch(console.error);
        break;
    default:
        console.log(`❌ Unknown command: ${COMMAND}`);
        console.log("   Run 'agent help' for available commands.\n");
        process.exit(1);
}
