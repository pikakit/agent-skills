#!/usr/bin/env node
/**
 * State Manager Script (ES Module)
 * 
 * Save and restore file states for safe code modifications.
 * Part of the state-rollback skill.
 * 
 * Usage:
 *   node state_manager.js save --files "file1,file2" [--desc "description"]
 *   node state_manager.js restore --id state-001
 *   node state_manager.js restore --latest
 *   node state_manager.js list
 *   node state_manager.js clean --keep 10
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// Find project root
function findProjectRoot() {
    let current = process.cwd();
    while (current !== path.dirname(current)) {
        if (fs.existsSync(path.join(current, '.agent'))) {
            return current;
        }
        current = path.dirname(current);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const stateDir = path.join(projectRoot, '.agent', 'state');
const statesDir = path.join(stateDir, 'states');
const historyPath = path.join(stateDir, 'history.json');

// Ensure directories exist
function ensureDirs() {
    if (!fs.existsSync(statesDir)) {
        fs.mkdirSync(statesDir, { recursive: true });
    }
}

// Generate state ID
function generateId() {
    const num = Date.now() % 100000;
    return `state-${String(num).padStart(5, '0')}`;
}

// Calculate file hash
function hashContent(content) {
    return crypto.createHash('sha256').update(content).digest('hex').slice(0, 16);
}

// Load history
function loadHistory() {
    if (!fs.existsSync(historyPath)) {
        return [];
    }
    return JSON.parse(fs.readFileSync(historyPath, 'utf8'));
}

// Save history
function saveHistory(history) {
    fs.writeFileSync(historyPath, JSON.stringify(history, null, 2));
}

// Save state
function saveState(files, description = '') {
    ensureDirs();

    const state = {
        id: generateId(),
        timestamp: new Date().toISOString(),
        description,
        files: []
    };

    for (const filePath of files) {
        const absPath = path.resolve(projectRoot, filePath);
        if (!fs.existsSync(absPath)) {
            console.log(`${colors.yellow}⚠️  File not found: ${filePath}${colors.reset}`);
            continue;
        }

        const content = fs.readFileSync(absPath, 'utf8');
        state.files.push({
            path: absPath,
            relativePath: path.relative(projectRoot, absPath),
            content,
            hash: hashContent(content)
        });
    }

    if (state.files.length === 0) {
        console.log(`${colors.red}❌ No valid files to save${colors.reset}`);
        return null;
    }

    // Save state file
    const statePath = path.join(statesDir, `${state.id}.json`);
    fs.writeFileSync(statePath, JSON.stringify(state, null, 2));

    // Update history
    const history = loadHistory();
    history.push({
        id: state.id,
        timestamp: state.timestamp,
        description,
        fileCount: state.files.length
    });
    saveHistory(history);

    console.log(`${colors.green}💾 State saved: ${state.id}${colors.reset}`);
    console.log(`${colors.gray}   Files: ${state.files.length}${colors.reset}`);
    console.log(`${colors.gray}   Description: ${description || '(none)'}${colors.reset}`);

    return state.id;
}

// Restore state
function restoreState(stateId) {
    const statePath = path.join(statesDir, `${stateId}.json`);

    if (!fs.existsSync(statePath)) {
        console.log(`${colors.red}❌ State not found: ${stateId}${colors.reset}`);
        return false;
    }

    const state = JSON.parse(fs.readFileSync(statePath, 'utf8'));

    console.log(`${colors.blue}⏪ Restoring state: ${stateId}${colors.reset}`);

    for (const file of state.files) {
        const dir = path.dirname(file.path);
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }

        fs.writeFileSync(file.path, file.content, 'utf8');
        console.log(`${colors.green}   ✓${colors.reset} ${file.relativePath}`);
    }

    console.log(`${colors.green}✅ Restored ${state.files.length} files${colors.reset}`);
    return true;
}

// Restore latest state
function restoreLatest() {
    const history = loadHistory();
    if (history.length === 0) {
        console.log(`${colors.yellow}No saved states found${colors.reset}`);
        return false;
    }

    const latest = history[history.length - 1];
    return restoreState(latest.id);
}

// List states
function listStates() {
    const history = loadHistory();

    console.log(`${colors.cyan}╔════════════════════════════════════════╗${colors.reset}`);
    console.log(`${colors.cyan}║${colors.reset}  💾 Saved States                        ${colors.cyan}║${colors.reset}`);
    console.log(`${colors.cyan}╚════════════════════════════════════════╝${colors.reset}`);
    console.log(`${colors.gray}Total: ${history.length} states${colors.reset}\n`);

    if (history.length === 0) {
        console.log(`${colors.yellow}No saved states.${colors.reset}`);
        return;
    }

    for (const state of history.slice(-10).reverse()) {
        console.log(`${colors.bold}${state.id}${colors.reset} [${state.fileCount} files]`);
        console.log(`  ${colors.gray}${state.timestamp}${colors.reset}`);
        if (state.description) {
            console.log(`  ${colors.gray}${state.description}${colors.reset}`);
        }
        console.log('');
    }
}

// Clean old states
function cleanStates(keep = 10) {
    const history = loadHistory();

    if (history.length <= keep) {
        console.log(`${colors.yellow}Nothing to clean (${history.length} states, keeping ${keep})${colors.reset}`);
        return;
    }

    const toRemove = history.slice(0, -keep);
    const toKeep = history.slice(-keep);

    for (const state of toRemove) {
        const statePath = path.join(statesDir, `${state.id}.json`);
        if (fs.existsSync(statePath)) {
            fs.unlinkSync(statePath);
        }
    }

    saveHistory(toKeep);

    console.log(`${colors.green}🧹 Cleaned ${toRemove.length} old states${colors.reset}`);
    console.log(`${colors.gray}   Keeping ${toKeep.length} most recent${colors.reset}`);
}

// Parse arguments
const args = process.argv.slice(2);
const command = args[0];

if (command === 'save') {
    const filesIdx = args.findIndex(a => a === '--files' || a === '-f');
    const descIdx = args.findIndex(a => a === '--desc' || a === '-d');

    const filesArg = filesIdx >= 0 ? args[filesIdx + 1] : null;
    const desc = descIdx >= 0 ? args[descIdx + 1] : '';

    if (!filesArg) {
        console.log(`${colors.red}Error: --files is required${colors.reset}`);
        process.exit(1);
    }

    const files = filesArg.split(',').map(f => f.trim());
    saveState(files, desc);

} else if (command === 'restore') {
    if (args.includes('--latest')) {
        restoreLatest();
    } else {
        const idIdx = args.findIndex(a => a === '--id');
        const id = idIdx >= 0 ? args[idIdx + 1] : null;

        if (!id) {
            console.log(`${colors.red}Error: --id or --latest is required${colors.reset}`);
            process.exit(1);
        }

        restoreState(id);
    }

} else if (command === 'list') {
    listStates();

} else if (command === 'clean') {
    const keepIdx = args.findIndex(a => a === '--keep');
    const keep = keepIdx >= 0 ? parseInt(args[keepIdx + 1]) : 10;
    cleanStates(keep);

} else {
    console.log(`${colors.cyan}state-rollback - State Manager${colors.reset}

${colors.bold}Usage:${colors.reset}
  node state_manager.js save --files "file1,file2" [--desc "description"]
  node state_manager.js restore --id state-001
  node state_manager.js restore --latest
  node state_manager.js list
  node state_manager.js clean --keep 10

${colors.bold}Commands:${colors.reset}
  save      Save current state of files
  restore   Restore files to saved state
  list      List saved states
  clean     Remove old states
`);
}
