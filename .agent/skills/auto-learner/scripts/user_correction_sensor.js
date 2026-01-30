#!/usr/bin/env node
/**
 * User Correction Sensor - Detect when user corrects AI-generated code
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 1
 * 
 * Monitors git diff to detect:
 * - Files modified shortly after AI generation
 * - Common correction patterns
 * - Import/path fixes
 * 
 * Usage:
 *   node user_correction_sensor.js --scan
 *   node user_correction_sensor.js --recent 1h
 *   node user_correction_sensor.js --stats
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
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
const knowledgePath = path.join(projectRoot, '.agent', 'knowledge');
const correctionsPath = path.join(knowledgePath, 'user-corrections.json');

// Ensure files exist
function ensureFiles() {
    if (!fs.existsSync(knowledgePath)) {
        fs.mkdirSync(knowledgePath, { recursive: true });
    }
    if (!fs.existsSync(correctionsPath)) {
        fs.writeFileSync(correctionsPath, JSON.stringify({
            _comment: "User corrections detected by correction_sensor",
            corrections: [],
            lastScan: null
        }, null, 2));
    }
}

// Load corrections
function loadCorrections() {
    ensureFiles();
    try {
        const data = JSON.parse(fs.readFileSync(correctionsPath, 'utf8'));
        return data.corrections || [];
    } catch {
        return [];
    }
}

// Save corrections
function saveCorrections(corrections) {
    ensureFiles();
    const data = {
        _comment: "User corrections detected by correction_sensor",
        lastScan: new Date().toISOString(),
        totalCorrections: corrections.length,
        corrections
    };
    fs.writeFileSync(correctionsPath, JSON.stringify(data, null, 2));
}

// Add correction
function addCorrection(correction) {
    const corrections = loadCorrections();

    // Check for duplicates
    const isDuplicate = corrections.some(c =>
        c.file === correction.file &&
        c.pattern === correction.pattern
    );

    if (!isDuplicate) {
        corrections.push({
            id: `COR-${Date.now()}`,
            ...correction,
            timestamp: new Date().toISOString()
        });
        saveCorrections(corrections);
        return true;
    }
    return false;
}

// Common correction patterns to detect
const CORRECTION_PATTERNS = [
    {
        name: 'import_path_fix',
        regex: /^[-+].*import.*from\s+['"](\.+\/|@)/,
        description: 'Import path correction',
        severity: 'HIGH'
    },
    {
        name: 'type_annotation_fix',
        regex: /^[-+].*:\s*(string|number|boolean|any|unknown|void)\b/,
        description: 'Type annotation correction',
        severity: 'MEDIUM'
    },
    {
        name: 'null_check_added',
        regex: /^\+.*(\?\.|!= null|!== null|\?\?)/,
        description: 'Null check added',
        severity: 'HIGH'
    },
    {
        name: 'async_await_fix',
        regex: /^[-+].*(async|await)\b/,
        description: 'Async/await correction',
        severity: 'HIGH'
    },
    {
        name: 'variable_rename',
        regex: /^-.*const\s+(\w+).*\n^\+.*const\s+(\w+)/m,
        description: 'Variable renamed',
        severity: 'MEDIUM'
    },
    {
        name: 'error_handling_added',
        regex: /^\+.*(try\s*{|catch\s*\(|\.catch\()/,
        description: 'Error handling added',
        severity: 'HIGH'
    },
    {
        name: 'dependency_added',
        regex: /^\+.*"[^"]+"\s*:\s*"[~^]?\d/,
        description: 'Dependency added',
        severity: 'MEDIUM'
    },
    {
        name: 'condition_fix',
        regex: /^[-+].*if\s*\(/,
        description: 'Condition logic correction',
        severity: 'HIGH'
    },
    {
        name: 'return_value_fix',
        regex: /^[-+].*return\s+/,
        description: 'Return value correction',
        severity: 'HIGH'
    },
    {
        name: 'spelling_fix',
        regex: /^-.*(\w+).*\n^\+.*\1[a-z]/i,
        description: 'Spelling/typo fix',
        severity: 'LOW'
    }
];

/**
 * Get git diff from recent changes
 */
function getRecentDiff(since = '1 hour ago') {
    try {
        // Get diff of uncommitted changes
        const staged = execSync('git diff --cached', {
            cwd: projectRoot,
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024
        });

        const unstaged = execSync('git diff', {
            cwd: projectRoot,
            encoding: 'utf8',
            maxBuffer: 10 * 1024 * 1024
        });

        return staged + '\n' + unstaged;
    } catch {
        return '';
    }
}

/**
 * Parse diff and detect correction patterns
 */
function detectCorrections(diffOutput) {
    const corrections = [];
    const files = diffOutput.split(/^diff --git/m).slice(1);

    for (const fileDiff of files) {
        // Extract file name
        const fileMatch = fileDiff.match(/a\/(.+)\s+b\//);
        if (!fileMatch) continue;

        const fileName = fileMatch[1];

        // Skip non-code files
        if (!/\.(js|ts|jsx|tsx|json|py|rb|go)$/.test(fileName)) continue;

        // Get the actual diff content
        const diffContent = fileDiff.split('\n').filter(l => l.startsWith('+') || l.startsWith('-'));

        // Check each pattern
        for (const pattern of CORRECTION_PATTERNS) {
            for (const line of diffContent) {
                if (pattern.regex.test(line)) {
                    corrections.push({
                        file: fileName,
                        pattern: pattern.name,
                        description: pattern.description,
                        severity: pattern.severity,
                        line: line.substring(0, 100), // Truncate for storage
                        category: categorizeCorrection(pattern.name)
                    });
                    break; // One match per pattern per file
                }
            }
        }
    }

    return corrections;
}

/**
 * Categorize correction for pattern analysis
 */
function categorizeCorrection(patternName) {
    const categories = {
        import_path_fix: 'imports',
        type_annotation_fix: 'types',
        null_check_added: 'null-safety',
        async_await_fix: 'async',
        variable_rename: 'naming',
        error_handling_added: 'error-handling',
        dependency_added: 'dependencies',
        condition_fix: 'logic',
        return_value_fix: 'logic',
        spelling_fix: 'typo'
    };
    return categories[patternName] || 'other';
}

/**
 * Analyze corrections to find patterns
 */
function analyzePatterns(corrections) {
    const byCategory = {};
    const byFile = {};

    for (const corr of corrections) {
        // By category
        byCategory[corr.category] = (byCategory[corr.category] || 0) + 1;

        // By file
        const dir = path.dirname(corr.file);
        byFile[dir] = (byFile[dir] || 0) + 1;
    }

    return {
        byCategory,
        byFile,
        total: corrections.length,
        topCategory: Object.entries(byCategory).sort((a, b) => b[1] - a[1])[0],
        topDirectory: Object.entries(byFile).sort((a, b) => b[1] - a[1])[0]
    };
}

// ==================== MAIN ====================

function runScan() {
    console.log(`${c.cyan}🔍 User Correction Sensor${c.reset}\n`);
    console.log(`${c.gray}Scanning git diff for correction patterns...${c.reset}\n`);

    const diff = getRecentDiff();

    if (!diff.trim()) {
        console.log(`${c.yellow}No uncommitted changes found.${c.reset}`);
        console.log(`${c.gray}Tip: Make changes and run again before committing.${c.reset}`);
        return [];
    }

    const detected = detectCorrections(diff);

    // Save new corrections
    let newCount = 0;
    for (const corr of detected) {
        if (addCorrection(corr)) {
            newCount++;
        }
    }

    // Display results
    console.log(`${c.cyan}════════════════════════════════════════${c.reset}`);
    console.log(`${c.bold}Scan Complete${c.reset}`);
    console.log(`  Patterns detected: ${detected.length}`);
    console.log(`  New corrections: ${c.yellow}${newCount}${c.reset}`);
    console.log(`${c.cyan}════════════════════════════════════════${c.reset}\n`);

    if (detected.length > 0) {
        console.log(`${c.bold}Detected Corrections:${c.reset}`);
        for (const corr of detected) {
            const sevColor = { HIGH: c.yellow, MEDIUM: c.blue, LOW: c.gray }[corr.severity] || c.gray;
            console.log(`  ${sevColor}●${c.reset} ${corr.file}`);
            console.log(`    ${c.gray}${corr.description} (${corr.category})${c.reset}`);
        }
    }

    return detected;
}

function showStats() {
    const corrections = loadCorrections();
    const analysis = analyzePatterns(corrections);

    console.log(`${c.cyan}╔════════════════════════════════════════╗${c.reset}`);
    console.log(`${c.cyan}║${c.reset}  📊 Correction Statistics               ${c.cyan}║${c.reset}`);
    console.log(`${c.cyan}╚════════════════════════════════════════╝${c.reset}\n`);

    console.log(`${c.bold}By Category:${c.reset}`);
    for (const [cat, count] of Object.entries(analysis.byCategory).sort((a, b) => b[1] - a[1])) {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(`  ${cat.padEnd(15)} ${c.cyan}${bar}${c.reset} ${count}`);
    }

    console.log(`\n${c.bold}Hot Directories (most corrections):${c.reset}`);
    for (const [dir, count] of Object.entries(analysis.byFile).sort((a, b) => b[1] - a[1]).slice(0, 5)) {
        console.log(`  ${dir}: ${count}`);
    }

    if (analysis.topCategory) {
        console.log(`\n${c.yellow}⚠️  Most common issue: ${analysis.topCategory[0]} (${analysis.topCategory[1]} times)${c.reset}`);
        console.log(`${c.gray}   Consider creating a rule to prevent this pattern.${c.reset}`);
    }

    console.log(`\n${c.gray}Total corrections tracked: ${corrections.length}${c.reset}`);
}

function suggestLessons() {
    const corrections = loadCorrections();
    const analysis = analyzePatterns(corrections);

    console.log(`${c.cyan}💡 Suggested Lessons${c.reset}\n`);

    // Find patterns that occur 3+ times
    const frequent = Object.entries(analysis.byCategory)
        .filter(([_, count]) => count >= 3)
        .sort((a, b) => b[1] - a[1]);

    if (frequent.length === 0) {
        console.log(`${c.gray}Not enough data yet. Keep coding and run again.${c.reset}`);
        return;
    }

    for (const [category, count] of frequent) {
        console.log(`${c.bold}Pattern: ${category}${c.reset} (${count} occurrences)`);

        const suggestions = {
            'imports': 'Always use relative imports from project root. Check tsconfig paths.',
            'types': 'Add explicit type annotations to function parameters and return types.',
            'null-safety': 'Use optional chaining (?.) and nullish coalescing (??) operators.',
            'async': 'Always use async/await pattern. Never mix callbacks and promises.',
            'error-handling': 'Wrap async operations in try/catch. Never use empty catch blocks.',
            'logic': 'Review conditional logic carefully. Add edge case tests.',
            'naming': 'Follow naming conventions: camelCase for variables, PascalCase for types.'
        };

        console.log(`  ${c.gray}Suggested rule: ${suggestions[category] || 'Review and document this pattern.'}${c.reset}\n`);
    }
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--scan') || args.includes('-s')) {
    runScan();
} else if (args.includes('--stats')) {
    showStats();
} else if (args.includes('--suggest')) {
    suggestLessons();
} else if (args.includes('--clear')) {
    saveCorrections([]);
    console.log(`${c.green}✓ Cleared all corrections${c.reset}`);
} else {
    console.log(`${c.cyan}user_correction_sensor - Detect AI code corrections${c.reset}

${c.bold}Usage:${c.reset}
  node user_correction_sensor.js --scan      Scan uncommitted changes
  node user_correction_sensor.js --stats     Show correction statistics
  node user_correction_sensor.js --suggest   Suggest lessons from patterns
  node user_correction_sensor.js --clear     Clear recorded corrections

${c.bold}What it detects:${c.reset}
  • Import path corrections
  • Type annotation fixes
  • Added null checks
  • Async/await corrections
  • Error handling additions
  • Logic/condition fixes

${c.bold}Example workflow:${c.reset}
  1. AI generates code
  2. User fixes issues
  3. Run: node user_correction_sensor.js --scan
  4. Patterns are recorded for analysis
`);
}

export { runScan, detectCorrections, loadCorrections, analyzePatterns };
