#!/usr/bin/env node
/**
 * Feature Flag Manager - Stub Script
 * Referenced by: /flags workflow
 * 
 * Commands:
 *   init    - Initialize feature flags config
 *   list    - List all flags
 *   enable  - Enable a flag
 *   disable - Disable a flag
 *   set     - Set rollout percentage
 */

const fs = require('fs');
const path = require('path');

const FLAGS_FILE = '.feature-flags.json';

function loadFlags() {
    if (fs.existsSync(FLAGS_FILE)) {
        return JSON.parse(fs.readFileSync(FLAGS_FILE, 'utf8'));
    }
    return { flags: {} };
}

function saveFlags(config) {
    fs.writeFileSync(FLAGS_FILE, JSON.stringify(config, null, 2));
}

function init() {
    if (fs.existsSync(FLAGS_FILE)) {
        console.log(`⚠️  ${FLAGS_FILE} already exists`);
        return;
    }

    const config = {
        version: "1.0.0",
        flags: {
            "example-feature": {
                enabled: false,
                percentage: 0,
                description: "Example feature flag"
            }
        }
    };

    saveFlags(config);
    console.log(`✅ Created ${FLAGS_FILE}`);
    console.log('📝 Example flag "example-feature" added');
}

function list() {
    const config = loadFlags();
    const flags = Object.entries(config.flags);

    if (flags.length === 0) {
        console.log('No flags configured. Run: node flag-manager.js init');
        return;
    }

    console.log('\n🚩 Feature Flags:\n');
    console.log('| Flag | Status | % | Description |');
    console.log('|------|--------|---|-------------|');

    for (const [name, flag] of flags) {
        const status = flag.enabled ? '✅ ON' : '❌ OFF';
        const pct = flag.percentage || 100;
        const desc = flag.description || '';
        console.log(`| ${name} | ${status} | ${pct}% | ${desc} |`);
    }
    console.log();
}

function enable(flagName) {
    const config = loadFlags();

    if (!config.flags[flagName]) {
        config.flags[flagName] = { enabled: true, percentage: 100 };
        console.log(`✅ Created and enabled flag: ${flagName}`);
    } else {
        config.flags[flagName].enabled = true;
        console.log(`✅ Enabled flag: ${flagName}`);
    }

    saveFlags(config);
}

function disable(flagName) {
    const config = loadFlags();

    if (!config.flags[flagName]) {
        console.log(`⚠️  Flag "${flagName}" does not exist`);
        return;
    }

    config.flags[flagName].enabled = false;
    saveFlags(config);
    console.log(`❌ Disabled flag: ${flagName}`);
}

function setPercentage(flagName, percentage) {
    const config = loadFlags();

    if (!config.flags[flagName]) {
        config.flags[flagName] = { enabled: true, percentage: parseInt(percentage) };
    } else {
        config.flags[flagName].percentage = parseInt(percentage);
    }

    saveFlags(config);
    console.log(`📊 Set ${flagName} to ${percentage}% rollout`);
}

// Main
const [, , command, ...args] = process.argv;

switch (command) {
    case 'init':
        init();
        break;
    case 'list':
        list();
        break;
    case 'enable':
        if (!args[0]) {
            console.log('Usage: node flag-manager.js enable <flag-name>');
            process.exit(1);
        }
        enable(args[0]);
        break;
    case 'disable':
        if (!args[0]) {
            console.log('Usage: node flag-manager.js disable <flag-name>');
            process.exit(1);
        }
        disable(args[0]);
        break;
    case 'set':
        if (!args[0] || !args.includes('--percentage')) {
            console.log('Usage: node flag-manager.js set <flag-name> --percentage <0-100>');
            process.exit(1);
        }
        const pctIndex = args.indexOf('--percentage');
        setPercentage(args[0], args[pctIndex + 1]);
        break;
    default:
        console.log('Feature Flag Manager\n');
        console.log('Commands:');
        console.log('  init                    Initialize flags config');
        console.log('  list                    List all flags');
        console.log('  enable <name>           Enable a flag');
        console.log('  disable <name>          Disable a flag');
        console.log('  set <name> --percentage <N>  Set rollout %');
        process.exit(0);
}
