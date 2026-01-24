#!/usr/bin/env node
/**
 * Smart Agent CLI
 * 
 * The main interface for humans to interact with the Smart Agent Skills system.
 * Usage:
 *   npx ag-smart learn --pattern "foo" --message "bar"
 *   npx ag-smart audit
 *   npx ag-smart recall <file>
 */

const { spawn } = require('child_process');
const path = require('path');

const ARGS = process.argv.slice(2);
const COMMAND = ARGS[0];

const SCRIPTS_DIR = path.join(__dirname, '..', 'lib');

function run(script, args = []) {
    const scriptPath = path.join(SCRIPTS_DIR, script);
    const child = spawn('node', [scriptPath, ...args], { stdio: 'inherit' });

    child.on('close', (code) => {
        process.exit(code);
    });
}

function printHelp() {
    console.log(`
🤖 My Agent Skills CLI (ag-smart)

Usage:
  ag-smart <command> [options]

Commands:
  learn   Teach My Agent Skills a new lesson
          Ex: ag-smart learn --add --pattern "var " --message "Use let/const"

  recall  Check a file against memory
          Ex: ag-smart recall src/app.js

  audit   Run My Agent Skills compliance audit (Law + Memory + Rules)
          Ex: ag-smart audit

  help    Show this help message
`);
}

switch (COMMAND) {
    case 'learn':
        run('learn.js', ARGS.slice(1));
        break;
    case 'recall':
        run('recall.js', ARGS.slice(1));
        break;
    case 'audit':
        run('audit.js', ARGS.slice(1));
        break;
    case 'help':
    case '--help':
    case '-h':
    default:
        printHelp();
        break;
}
