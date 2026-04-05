#!/usr/bin/env node
// @ts-nocheck
/**
 * Feature Flag Manager v2.0.0
 * Skill: cicd-pipeline
 * Referenced by: /flags workflow
 *
 * Commands:
 *   init    - Initialize feature flags config
 *   list    - List all flags
 *   enable  - Enable a flag
 *   disable - Disable a flag
 *   set     - Set rollout percentage
 *
 * Flags:
 *   --json     Output as JSON
 *   --help     Show help
 *   --version  Show version
 */

import { readFile, writeFile, access } from 'node:fs/promises';
import { constants } from 'node:fs';

const VERSION = '2.0.0';
const FLAGS_FILE = '.feature-flags.json';

// --- CLI Parsing ---

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const filteredArgs = args.filter(a => a !== '--json');
const [command, ...commandArgs] = filteredArgs;

function output(data) {
    if (jsonMode) {
        console.log(JSON.stringify(data, null, 2));
    } else if (typeof data === 'string') {
        console.log(data);
    } else {
        console.log(JSON.stringify(data, null, 2));
    }
}

function outputError(code, message) {
    if (jsonMode) {
        console.error(JSON.stringify({ status: 'error', code, message }));
    } else {
        console.error(`[X] ${code}: ${message}`);
    }
    process.exit(1);
}

// --- File I/O ---

async function fileExists(path) {
    try {
        await access(path, constants.F_OK);
        return true;
    } catch {
        return false;
    }
}

async function loadFlags() {
    if (await fileExists(FLAGS_FILE)) {
        try {
            const raw = await readFile(FLAGS_FILE, 'utf8');
            return JSON.parse(raw);
        } catch (err) {
            outputError('ERR_CORRUPTED_FILE', `Failed to parse ${FLAGS_FILE}: ${err.message}`);
        }
    }
    return { version: VERSION, flags: {} };
}

async function saveFlags(config) {
    try {
        await writeFile(FLAGS_FILE, JSON.stringify(config, null, 2), 'utf8');
    } catch (err) {
        outputError('ERR_WRITE_FAILED', `Failed to write ${FLAGS_FILE}: ${err.message}`);
    }
}

// --- Commands ---

async function init() {
    if (await fileExists(FLAGS_FILE)) {
        output({ status: 'skipped', message: `${FLAGS_FILE} already exists` });
        return;
    }

    const config = {
        version: VERSION,
        flags: {
            'example-feature': {
                enabled: false,
                percentage: 0,
                description: 'Example feature flag',
                createdAt: new Date().toISOString(),
            },
        },
    };

    await saveFlags(config);
    output({ status: 'success', message: `Created ${FLAGS_FILE}`, flags: Object.keys(config.flags) });
}

async function list() {
    const config = await loadFlags();
    const entries = Object.entries(config.flags);

    if (entries.length === 0) {
        output({ status: 'success', flags: [], message: 'No flags configured. Run: node flag-manager.js init' });
        return;
    }

    if (jsonMode) {
        output({ status: 'success', count: entries.length, flags: config.flags });
        return;
    }

    console.log('\n🚩 Feature Flags:\n');
    console.log('| Flag | Status | % | Description |');
    console.log('|------|--------|---|-------------|');

    for (const [name, flag] of entries) {
        const status = flag.enabled ? '✅ ON' : '❌ OFF';
        const pct = flag.percentage ?? 100;
        const desc = flag.description || '';
        console.log(`| ${name} | ${status} | ${pct}% | ${desc} |`);
    }
    console.log();
}

async function enable(flagName) {
    if (!flagName) {
        outputError('ERR_MISSING_ARG', 'Usage: node flag-manager.js enable <flag-name>');
    }

    const config = await loadFlags();
    const isNew = !config.flags[flagName];

    if (isNew) {
        config.flags[flagName] = { enabled: true, percentage: 100, createdAt: new Date().toISOString() };
    } else {
        config.flags[flagName].enabled = true;
    }

    await saveFlags(config);
    output({ status: 'success', flag: flagName, enabled: true, created: isNew });
}

async function disable(flagName) {
    if (!flagName) {
        outputError('ERR_MISSING_ARG', 'Usage: node flag-manager.js disable <flag-name>');
    }

    const config = await loadFlags();

    if (!config.flags[flagName]) {
        outputError('ERR_FLAG_NOT_FOUND', `Flag "${flagName}" does not exist`);
    }

    config.flags[flagName].enabled = false;
    await saveFlags(config);
    output({ status: 'success', flag: flagName, enabled: false });
}

async function setPercentage(flagName, percentage) {
    if (!flagName || percentage === undefined) {
        outputError('ERR_MISSING_ARG', 'Usage: node flag-manager.js set <flag-name> --percentage <0-100>');
    }

    const pct = parseInt(percentage, 10);

    if (isNaN(pct) || pct < 0 || pct > 100) {
        outputError('ERR_INVALID_PERCENTAGE', 'Percentage must be an integer between 0 and 100');
    }

    const config = await loadFlags();

    if (!config.flags[flagName]) {
        config.flags[flagName] = { enabled: true, percentage: pct, createdAt: new Date().toISOString() };
    } else {
        config.flags[flagName].percentage = pct;
    }

    await saveFlags(config);
    output({ status: 'success', flag: flagName, percentage: pct });
}

function showHelp() {
    const help = `Feature Flag Manager v${VERSION}

Usage: node flag-manager.js <command> [options]

Commands:
  init                              Initialize flags config
  list                              List all flags
  enable <name>                     Enable a flag
  disable <name>                    Disable a flag
  set <name> --percentage <0-100>   Set rollout percentage

Options:
  --json       Output as JSON
  --help       Show this help
  --version    Show version`;

    console.log(help);
}

// --- Main ---

async function main() {
    if (args.includes('--version')) {
        console.log(VERSION);
        return;
    }

    if (args.includes('--help') || !command) {
        showHelp();
        return;
    }

    switch (command) {
        case 'init':
            await init();
            break;
        case 'list':
            await list();
            break;
        case 'enable':
            await enable(commandArgs[0]);
            break;
        case 'disable':
            await disable(commandArgs[0]);
            break;
        case 'set': {
            const pctIdx = commandArgs.indexOf('--percentage');
            if (pctIdx === -1) {
                outputError('ERR_MISSING_ARG', 'Usage: node flag-manager.js set <flag-name> --percentage <0-100>');
            }
            await setPercentage(commandArgs[0], commandArgs[pctIdx + 1]);
            break;
        }
        default:
            outputError('ERR_UNKNOWN_COMMAND', `Unknown command: "${command}". Run with --help for usage.`);
    }
}

main().catch(err => {
    outputError('ERR_UNEXPECTED', err.message);
});
