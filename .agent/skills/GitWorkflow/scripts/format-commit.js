#!/usr/bin/env node
/**
 * CoinPika Commit Message Formatter
 * 
 * Interactive CLI to format commit messages following Conventional Commits
 * with CoinPika doctrine tags.
 * 
 * Usage: node format-commit.js [--quick "message"]
 * 
 * @version 1.2.0
 * @author DataGuruIn
 */

const readline = require('readline');
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SKILL_ROOT = path.resolve(__dirname, '..');
const CONFIG_PATH = path.join(SKILL_ROOT, 'metadata', 'commit-config.yaml');

function loadConfiguration() {
    try {
        if (!fs.existsSync(CONFIG_PATH)) {
            console.warn('⚠️  Configuration file not found, using internal defaults.');
            return null;
        }
        const fileContents = fs.readFileSync(CONFIG_PATH, 'utf8');
        return yaml.load(fileContents);
    } catch (e) {
        console.error('❌ Failed to load configuration:', e);
        return null;
    }
}

// Fallback defaults in case config is missing
const DEFAULT_CONFIG = {
    commitTypes: [
        { value: 'feat', description: 'New feature or capability' },
        { value: 'fix', description: 'Bug fix' },
        { value: 'refactor', description: 'Code refactor without behavior change' },
        { value: 'perf', description: 'Performance improvement' },
        { value: 'style', description: 'Code style/formatting (no logic change)' },
        { value: 'docs', description: 'Documentation only' },
        { value: 'test', description: 'Adding or updating tests' },
        { value: 'chore', description: 'Build process, dependencies, tooling' },
        { value: 'doctrine', description: 'Constitutional/doctrinal enforcement' },
    ],
    scopes: [
        { value: 'api', description: 'Backend API' },
        { value: 'data', description: 'Data pipeline or persistence' },
        { value: 'chart', description: 'Chart components' },
        { value: 'mobile', description: 'Mobile UI/gestures' },
        { value: 'worker', description: 'Background jobs/workers' },
        { value: 'cache', description: 'Caching layer' },
        { value: 'auth', description: 'Authentication' },
        { value: 'ui', description: 'General UI components' },
    ],
    doctrines: [
        { value: 'Law-1', description: 'Truth Ownership - Backend owns truth' },
        { value: 'Law-2', description: 'Historical Integrity - Data is immutable' },
        { value: 'Law-3', description: 'Realtime Ephemerality - Separate realtime/historical' },
        { value: 'Law-4', description: 'Chart Truthfulness - Charts from backend only' },
        { value: 'Architecture', description: 'System boundaries' },
        { value: 'Performance', description: 'Caching & optimization' },
        { value: 'Frontend-Mobile', description: 'Mobile UX standards' },
        { value: 'Commercial', description: 'Commercial guardrails' },
    ],
    scopeMapping: {
        'api': ['Law-1', 'Architecture', 'Performance'],
        'data': ['Law-1', 'Law-2', 'Architecture'],
        'chart': ['Law-3', 'Law-4'],
        'mobile': ['Frontend-Mobile'],
        'worker': ['Performance', 'Architecture'],
        'cache': ['Performance'],
    }
};

const config = loadConfiguration() || DEFAULT_CONFIG;

const COMMIT_TYPES = config.commitTypes || DEFAULT_CONFIG.commitTypes;
const SCOPES = config.scopes || DEFAULT_CONFIG.scopes;
const DOCTRINES = config.doctrines || DEFAULT_CONFIG.doctrines;
const SCOPE_DOCTRINE_MAP = config.scopeMapping || DEFAULT_CONFIG.scopeMapping;


// ============================================================================
// UTILITIES
// ============================================================================

function getChangedFiles() {
    try {
        const output = execSync('git diff --cached --name-only', { encoding: 'utf8' });
        return output.trim().split('\n').filter(Boolean);
    } catch {
        return [];
    }
}

function suggestScope(files) {
    // Naive suggestion logic - could also be moved to config (regex mapping) but keeping simple for now
    for (const file of files) {
        const lower = file.toLowerCase();
        // Check against known scopes if they match file path parts
        for (const scope of SCOPES) {
            if (lower.includes(scope.value)) return scope.value;
        }

        // Manual fallbacks from original script if not covered by scope names
        if (lower.includes('server')) return 'api';
        if (lower.includes('graph')) return 'chart';
        if (lower.includes('gesture')) return 'mobile';
        if (lower.includes('db')) return 'data';
    }
    return null;
}

function suggestDoctrines(scope) {
    return SCOPE_DOCTRINE_MAP[scope] || [];
}

// ============================================================================
// INTERACTIVE MODE
// ============================================================================

async function prompt(question) {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    return new Promise(resolve => {
        rl.question(question, answer => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

async function selectFromList(title, items, defaultValue = null) {
    console.log(`\n${title}`);
    items.forEach((item, i) => {
        const marker = defaultValue === item.value ? ' (suggested)' : '';
        console.log(`  ${i + 1}. ${item.value} - ${item.description}${marker}`);
    });
    console.log(`  0. Skip/None`);

    const answer = await prompt('\nSelect (number): ');
    const idx = parseInt(answer, 10);

    if (idx === 0 || isNaN(idx)) return null;
    return items[idx - 1]?.value || null;
}

async function multiSelectFromList(title, items, suggested = []) {
    console.log(`\n${title}`);
    items.forEach((item, i) => {
        const marker = suggested.includes(item.value) ? ' ★' : '';
        console.log(`  ${i + 1}. ${item.value} - ${item.description}${marker}`);
    });
    console.log(`  (Enter comma-separated numbers, e.g., 1,3,4)`);
    console.log(`  (Press Enter to skip)`);

    const answer = await prompt('\nSelect: ');
    if (!answer) return [];

    const indices = answer.split(',').map(s => parseInt(s.trim(), 10));
    return indices
        .filter(i => !isNaN(i) && i > 0 && i <= items.length)
        .map(i => items[i - 1].value);
}

async function interactiveMode() {
    console.log('\n🔧 CoinPika Commit Message Formatter\n');
    console.log('─'.repeat(50));

    // Detect context
    const changedFiles = getChangedFiles();
    if (changedFiles.length > 0) {
        console.log(`\n📁 Staged files:`);
        changedFiles.slice(0, 5).forEach(f => console.log(`   - ${f}`));
        if (changedFiles.length > 5) {
            console.log(`   ... and ${changedFiles.length - 5} more`);
        }
    }

    const suggestedScope = suggestScope(changedFiles);

    // Step 1: Type
    const type = await selectFromList('Select commit type:', COMMIT_TYPES);
    if (!type) {
        console.log('❌ Type is required');
        process.exit(1);
    }

    // Step 2: Scope
    const scope = await selectFromList('Select scope (optional):', SCOPES, suggestedScope);

    // Step 3: Description
    const description = await prompt('\nEnter description (imperative mood, lowercase, no period):\n> ');
    if (!description) {
        console.log('❌ Description is required');
        process.exit(1);
    }

    // Step 4: Breaking change
    const breaking = await prompt('\nIs this a breaking change? (y/N): ');
    const isBreaking = breaking.toLowerCase() === 'y';

    // Step 5: Doctrine tags
    const suggestedDoctrines = scope ? suggestDoctrines(scope) : [];
    const doctrines = await multiSelectFromList(
        'Select applicable doctrines:',
        DOCTRINES,
        suggestedDoctrines
    );

    // Step 6: Body (optional)
    console.log('\nEnter body (optional, press Enter twice to finish):');
    let body = '';
    const bodyRl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });

    let emptyLines = 0;
    for await (const line of bodyRl) {
        if (line === '') {
            emptyLines++;
            if (emptyLines >= 2) break;
        } else {
            emptyLines = 0;
            body += line + '\n';
        }
    }
    bodyRl.close();
    body = body.trim();

    // Build message
    let message = type;
    if (scope) message += `(${scope})`;
    if (isBreaking) message += '!';
    message += `: ${description}`;

    if (doctrines.length > 0) {
        message += ` [doctrine: ${doctrines.join(', ')}]`;
    }

    if (body) {
        message += `\n\n${body}`;
    }

    if (isBreaking) {
        message += `\n\nBREAKING CHANGE: ${description}`;
    }

    // Output
    console.log('\n' + '═'.repeat(50));
    console.log('📝 Generated Commit Message:');
    console.log('═'.repeat(50));
    console.log(`\n${message}\n`);
    console.log('═'.repeat(50));

    // Copy option
    const copy = await prompt('\nCopy to clipboard? (Y/n): ');
    if (copy.toLowerCase() !== 'n') {
        try {
            if (process.platform === 'win32') {
                execSync(`echo ${message.replace(/\n/g, '& echo.')} | clip`);
            } else if (process.platform === 'darwin') {
                execSync(`echo "${message}" | pbcopy`);
            } else {
                execSync(`echo "${message}" | xclip -selection clipboard`);
            }
            console.log('✅ Copied to clipboard!');
        } catch {
            console.log('⚠️  Could not copy to clipboard');
        }
    }

    // Commit option
    const commit = await prompt('Run git commit with this message? (y/N): ');
    if (commit.toLowerCase() === 'y') {
        try {
            execSync(`git commit -m "${message.replace(/"/g, '\\"')}"`, { stdio: 'inherit' });
        } catch {
            console.log('⚠️  Git commit failed');
        }
    }

    console.log('\n' + '─'.repeat(50));
    console.log('P.S. ⚡ Formatted by CoinPika Commit Engine');
}

// ============================================================================
// QUICK MODE
// ============================================================================

function quickFormat(input) {
    // Parse input: "type(scope): message"
    const match = input.match(/^(\w+)(?:\((\w+)\))?(!)?:\s*(.+)$/);

    if (!match) {
        console.log('❌ Invalid format. Expected: type(scope): description');
        console.log('   Example: feat(api): add caching layer');
        process.exit(1);
    }

    const [, type, scope, breaking, description] = match;

    // Validate type
    if (!COMMIT_TYPES.find(t => t.value === type)) {
        console.log(`❌ Invalid type: ${type}`);
        console.log(`   Valid types: ${COMMIT_TYPES.map(t => t.value).join(', ')}`);
        process.exit(1);
    }

    // Suggest doctrines
    const suggestedDoctrines = scope ? suggestDoctrines(scope) : [];

    let message = input;
    if (suggestedDoctrines.length > 0) {
        message += ` [doctrine: ${suggestedDoctrines.join(', ')}]`;
    }

    console.log('\n📝 Formatted Message:');
    console.log(`\n${message}\n`);

    if (suggestedDoctrines.length > 0) {
        console.log(`💡 Suggested doctrines based on scope "${scope}":`);
        suggestedDoctrines.forEach(d => {
            const doc = DOCTRINES.find(x => x.value === d);
            console.log(`   - ${d}: ${doc?.description || ''}`);
        });
    }
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
CoinPika Commit Message Formatter v1.2.0

USAGE:
  node format-commit.js              Interactive mode
  node format-commit.js --quick "..."  Quick format
  node format-commit.js --help       Show help

OPTIONS:
  --quick   Format a quick message with doctrine suggestions
  --help    Show this help

EXAMPLES:
  node format-commit.js
  node format-commit.js --quick "feat(api): add caching layer"

COMMIT TYPES:
  ${COMMIT_TYPES.map(t => t.value).join(', ')}

SCOPES:
  ${SCOPES.map(s => s.value).join(', ')}
`);
}

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help')) {
        printHelp();
        process.exit(0);
    }

    if (args.includes('--quick')) {
        const idx = args.indexOf('--quick');
        const message = args[idx + 1];
        if (!message) {
            console.log('❌ --quick requires a message');
            process.exit(1);
        }
        quickFormat(message);
    } else {
        await interactiveMode();
    }
}

main().catch(console.error);
