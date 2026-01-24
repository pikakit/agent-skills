#!/usr/bin/env node
/**
 * Smart Agent CLI - ESM Version
 * 
 * The main interface for humans to interact with the Smart Agent Skills system.
 * Usage:
 *   npx ag-smart learn --pattern "foo" --message "bar"
 *   npx ag-smart audit
 *   npx ag-smart recall <file>
 */

import { spawn } from "child_process";
import path from "path";
import { fileURLToPath } from "url";
import { VERSION } from "../lib/config.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ARGS = process.argv.slice(2);
const COMMAND = ARGS[0];
const SCRIPTS_DIR = path.join(__dirname, "..", "lib");

/**
 * Run a script with given arguments
 * @param {string} script - Script filename
 * @param {string[]} args - Arguments to pass
 */
function run(script, args = []) {
    const scriptPath = path.join(SCRIPTS_DIR, script);
    const child = spawn("node", [scriptPath, ...args], { stdio: "inherit" });

    child.on("close", (code) => {
        process.exit(code);
    });
}

function printHelp() {
    console.log(`
🤖 Agent Skills Kit CLI v${VERSION}

Usage:
  ag-smart <command> [options]

Commands:
  learn   Teach Agent Skills Kit a new lesson
          Ex: ag-smart learn --add --pattern "var " --message "Use let/const"

  recall  Check a file against memory
          Ex: ag-smart recall src/app.js

  audit   Run Agent Skills Kit compliance audit (Law + Memory + Rules)
          Ex: ag-smart audit

  help    Show this help message
  --version  Show version number
`);
}

switch (COMMAND) {
    case "learn":
        run("learn.js", ARGS.slice(1));
        break;
    case "recall":
        run("recall.js", ARGS.slice(1));
        break;
    case "audit":
        run("audit.js", ARGS.slice(1));
        break;
    case "--version":
    case "-v":
        console.log(VERSION);
        break;
    case "help":
    case "--help":
    case "-h":
    default:
        printHelp();
        break;
}
