#!/usr/bin/env node
/**
 * Feature Flags CLI Manager
 * 
 * Commands:
 *   list              - List all feature flags
 *   enable <name>     - Enable a flag
 *   disable <name>    - Disable a flag
 *   set <name>        - Set flag properties
 *   status <name>     - Show flag status
 *   init              - Initialize .featureflags.json
 */

import fs from 'fs';
import path from 'path';

const FLAGS_FILE = '.featureflags.json';

/**
 * Load flags configuration
 */
function loadFlags() {
    const flagsPath = path.join(process.cwd(), FLAGS_FILE);
    
    if (!fs.existsSync(flagsPath)) {
        return null;
    }
    
    try {
        const content = fs.readFileSync(flagsPath, 'utf8');
        return JSON.parse(content);
    } catch (error) {
        console.error('Error reading flags file:', error.message);
        return null;
    }
}

/**
 * Save flags configuration
 */
function saveFlags(config) {
    const flagsPath = path.join(process.cwd(), FLAGS_FILE);
    fs.writeFileSync(flagsPath, JSON.stringify(config, null, 2));
    console.log(`✅ Saved to ${FLAGS_FILE}`);
}

/**
 * Initialize feature flags file
 */
function init() {
    const flagsPath = path.join(process.cwd(), FLAGS_FILE);
    
    if (fs.existsSync(flagsPath)) {
        console.log(`⚠️  ${FLAGS_FILE} already exists`);
        return;
    }
    
    const template = {
        "$schema": "./.agent/skills/feature-flags/schemas/flags.schema.json",
        "flags": {
            "example-feature": {
                "enabled": false,
                "percentage": 100,
                "description": "Example feature flag"
            }
        },
        "defaults": {
            "enabled": false,
            "percentage": 100
        }
    };
    
    fs.writeFileSync(flagsPath, JSON.stringify(template, null, 2));
    console.log(`✅ Created ${FLAGS_FILE}`);
    console.log('\nNext steps:');
    console.log('  1. Edit .featureflags.json to add your flags');
    console.log('  2. Run `npm run flags:list` to view flags');
}

/**
 * List all flags
 */
function list() {
    const config = loadFlags();
    
    if (!config) {
        console.log('No .featureflags.json found. Run `npm run flags:init` first.');
        return;
    }
    
    console.log('\n📊 Feature Flags\n');
    console.log('─'.repeat(60));
    
    const flags = config.flags || {};
    const entries = Object.entries(flags);
    
    if (entries.length === 0) {
        console.log('No flags defined.');
        return;
    }
    
    for (const [name, flag] of entries) {
        const status = flag.enabled ? '✅ ON' : '❌ OFF';
        const percentage = flag.percentage !== undefined ? `${flag.percentage}%` : '100%';
        const groups = flag.groups?.join(', ') || 'all';
        
        console.log(`${status}  ${name}`);
        console.log(`    Rollout: ${percentage} | Groups: ${groups}`);
        if (flag.description) {
            console.log(`    ${flag.description}`);
        }
        console.log('');
    }
}

/**
 * Enable a flag
 */
function enable(name) {
    const config = loadFlags();
    
    if (!config) {
        console.log('No .featureflags.json found.');
        return;
    }
    
    if (!config.flags[name]) {
        console.log(`Flag "${name}" not found.`);
        console.log('Available flags:', Object.keys(config.flags).join(', '));
        return;
    }
    
    config.flags[name].enabled = true;
    config.flags[name].updatedAt = new Date().toISOString();
    saveFlags(config);
    console.log(`✅ Enabled "${name}"`);
}

/**
 * Disable a flag
 */
function disable(name) {
    const config = loadFlags();
    
    if (!config) {
        console.log('No .featureflags.json found.');
        return;
    }
    
    if (!config.flags[name]) {
        console.log(`Flag "${name}" not found.`);
        return;
    }
    
    config.flags[name].enabled = false;
    config.flags[name].updatedAt = new Date().toISOString();
    saveFlags(config);
    console.log(`❌ Disabled "${name}"`);
}

/**
 * Set flag properties
 */
function set(name, options) {
    const config = loadFlags();
    
    if (!config) {
        console.log('No .featureflags.json found.');
        return;
    }
    
    if (!config.flags[name]) {
        // Create new flag
        config.flags[name] = {
            enabled: false,
            percentage: 100,
            createdAt: new Date().toISOString()
        };
    }
    
    if (options.percentage !== undefined) {
        config.flags[name].percentage = parseInt(options.percentage, 10);
    }
    
    if (options.description) {
        config.flags[name].description = options.description;
    }
    
    if (options.groups) {
        config.flags[name].groups = options.groups.split(',').map(g => g.trim());
    }
    
    config.flags[name].updatedAt = new Date().toISOString();
    saveFlags(config);
    console.log(`✅ Updated "${name}"`);
}

/**
 * Show flag status
 */
function status(name) {
    const config = loadFlags();
    
    if (!config || !config.flags[name]) {
        console.log(`Flag "${name}" not found.`);
        return;
    }
    
    const flag = config.flags[name];
    console.log(`\n📊 Flag: ${name}\n`);
    console.log(`Status:     ${flag.enabled ? '✅ ENABLED' : '❌ DISABLED'}`);
    console.log(`Percentage: ${flag.percentage || 100}%`);
    console.log(`Groups:     ${flag.groups?.join(', ') || 'all'}`);
    console.log(`Envs:       ${flag.environments?.join(', ') || 'all'}`);
    if (flag.description) console.log(`Desc:       ${flag.description}`);
    if (flag.createdAt) console.log(`Created:    ${flag.createdAt}`);
    if (flag.updatedAt) console.log(`Updated:    ${flag.updatedAt}`);
    console.log('');
}

/**
 * Parse CLI arguments
 */
function parseArgs(args) {
    const options = {};
    let command = args[0];
    let flagName = args[1];
    
    for (let i = 2; i < args.length; i++) {
        if (args[i].startsWith('--')) {
            const key = args[i].replace('--', '');
            options[key] = args[i + 1];
            i++;
        }
    }
    
    return { command, flagName, options };
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
Feature Flags CLI

Usage: node flag-manager.js <command> [options]

Commands:
  init                  Initialize .featureflags.json
  list                  List all flags
  enable <name>         Enable a flag
  disable <name>        Disable a flag
  set <name> [options]  Set flag properties
  status <name>         Show flag status

Options for 'set':
  --percentage <n>      Set rollout percentage (0-100)
  --description <text>  Set flag description
  --groups <g1,g2>      Set target groups (comma-separated)

Examples:
  node flag-manager.js init
  node flag-manager.js list
  node flag-manager.js enable new-checkout
  node flag-manager.js set new-feature --percentage 25
`);
}

/**
 * Main
 */
function main() {
    const args = process.argv.slice(2);
    
    if (args.length === 0) {
        showHelp();
        return;
    }
    
    const { command, flagName, options } = parseArgs(args);
    
    switch (command) {
        case 'init':
            init();
            break;
        case 'list':
            list();
            break;
        case 'enable':
            if (!flagName) {
                console.log('Usage: enable <flag-name>');
                return;
            }
            enable(flagName);
            break;
        case 'disable':
            if (!flagName) {
                console.log('Usage: disable <flag-name>');
                return;
            }
            disable(flagName);
            break;
        case 'set':
            if (!flagName) {
                console.log('Usage: set <flag-name> [options]');
                return;
            }
            set(flagName, options);
            break;
        case 'status':
            if (!flagName) {
                console.log('Usage: status <flag-name>');
                return;
            }
            status(flagName);
            break;
        default:
            showHelp();
    }
}

main();
