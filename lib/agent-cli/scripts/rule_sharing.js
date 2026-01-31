#!/usr/bin/env node
/**
 * Rule Sharing - Export/Import rules for collaborative learning
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 4
 * 
 * Features:
 * - Export rules to YAML format
 * - Import rules from file
 * - Global storage (~/.agent-skills/)
 * - Cross-project learning
 * 
 * Usage:
 *   node rule_sharing.js --export
 *   node rule_sharing.js --import <file>
 *   node rule_sharing.js --sync
 */

import fs from 'fs';
import path from 'path';
import os from 'os';
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

// Paths
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
const globalPath = path.join(os.homedir(), '.agent-skills');
const globalRulesPath = path.join(globalPath, 'shared-rules.yaml');

// Ensure directories exist
function ensureDirectories() {
    if (!fs.existsSync(knowledgePath)) {
        fs.mkdirSync(knowledgePath, { recursive: true });
    }
    if (!fs.existsSync(globalPath)) {
        fs.mkdirSync(globalPath, { recursive: true });
    }
}

// Load JSON file
function loadJson(filename) {
    const filePath = path.join(knowledgePath, filename);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch { }
    return null;
}

// ==================== EXPORT FUNCTIONS ====================

/**
 * Export lessons and rules to YAML format
 */
function exportRules(outputPath) {
    ensureDirectories();

    const lessons = loadJson('lessons-learned.json');
    const patterns = loadJson('patterns.json');
    const autoRules = [];

    // Load auto-rules if exists
    const autoRulesPath = path.join(knowledgePath, 'auto-rules.yaml');
    if (fs.existsSync(autoRulesPath)) {
        const content = fs.readFileSync(autoRulesPath, 'utf8');
        // Parse existing auto-rules (simplified)
        const matches = content.matchAll(/id:\s*(\S+)[\s\S]*?pattern:\s*"([^"]+)"[\s\S]*?severity:\s*(\S+)/g);
        for (const match of matches) {
            autoRules.push({
                id: match[1],
                pattern: match[2],
                severity: match[3]
            });
        }
    }

    // Build YAML content
    let yaml = `# Auto-Learn Shared Rules
# Exported from: ${projectRoot}
# Date: ${new Date().toISOString()}
# Version: 1.0.0

metadata:
  project: ${path.basename(projectRoot)}
  exportedAt: "${new Date().toISOString()}"
  totalRules: ${(lessons?.lessons?.length || 0) + autoRules.length}

`;

    // Export lessons
    if (lessons?.lessons?.length > 0) {
        yaml += `# Lessons Learned\nlessons:\n`;
        for (const lesson of lessons.lessons) {
            yaml += `  - id: ${lesson.id}
    pattern: "${lesson.pattern || ''}"
    severity: ${lesson.severity || 'MEDIUM'}
    message: "${(lesson.message || '').replace(/"/g, '\\"')}"
    category: ${lesson.id?.split('-')[0] || 'GENERAL'}
    hitCount: ${lesson.hitCount || 1}
    confidence: ${lesson.confidence || 0.8}
`;
        }
        yaml += '\n';
    }

    // Export auto-rules
    if (autoRules.length > 0) {
        yaml += `# Auto-Generated Rules\nautoRules:\n`;
        for (const rule of autoRules) {
            yaml += `  - id: ${rule.id}
    pattern: "${rule.pattern}"
    severity: ${rule.severity}
    status: approved
`;
        }
        yaml += '\n';
    }

    // Export high-frequency patterns
    if (patterns?.highFrequency?.length > 0) {
        yaml += `# High-Frequency Patterns\nhighFrequency:\n`;
        for (const hf of patterns.highFrequency.slice(0, 10)) {
            yaml += `  - pattern: "${hf.pattern}"
    count: ${hf.count}
    type: ${hf.type}
`;
        }
    }

    // Write to file
    const targetPath = outputPath || path.join(knowledgePath, 'exported-rules.yaml');
    fs.writeFileSync(targetPath, yaml);

    console.log(`${c.green}✓ Exported rules to: ${targetPath}${c.reset}`);
    console.log(`  Lessons: ${lessons?.lessons?.length || 0}`);
    console.log(`  Auto-rules: ${autoRules.length}`);
    console.log(`  High-frequency: ${patterns?.highFrequency?.length || 0}`);

    return targetPath;
}

/**
 * Export rules to global storage
 */
function exportToGlobal() {
    ensureDirectories();
    return exportRules(globalRulesPath);
}

// ==================== IMPORT FUNCTIONS ====================

/**
 * Parse YAML content (simplified parser)
 */
function parseYaml(content) {
    const result = { lessons: [], autoRules: [], highFrequency: [] };

    // Parse lessons
    const lessonsMatch = content.match(/lessons:\s*([\s\S]*?)(?=\n[a-zA-Z]|\n#|$)/);
    if (lessonsMatch) {
        const lessonsBlock = lessonsMatch[1];
        const lessonMatches = lessonsBlock.matchAll(/- id:\s*(\S+)[\s\S]*?pattern:\s*"([^"]*)"[\s\S]*?severity:\s*(\S+)[\s\S]*?message:\s*"([^"]*)"/g);
        for (const match of lessonMatches) {
            result.lessons.push({
                id: match[1],
                pattern: match[2],
                severity: match[3],
                message: match[4]
            });
        }
    }

    // Parse auto-rules
    const rulesMatch = content.match(/autoRules:\s*([\s\S]*?)(?=\n[a-zA-Z]|\n#|$)/);
    if (rulesMatch) {
        const rulesBlock = rulesMatch[1];
        const ruleMatches = rulesBlock.matchAll(/- id:\s*(\S+)[\s\S]*?pattern:\s*"([^"]*)"[\s\S]*?severity:\s*(\S+)/g);
        for (const match of ruleMatches) {
            result.autoRules.push({
                id: match[1],
                pattern: match[2],
                severity: match[3]
            });
        }
    }

    return result;
}

/**
 * Import rules from file
 */
function importRules(inputPath, options = { merge: true }) {
    ensureDirectories();

    if (!fs.existsSync(inputPath)) {
        console.log(`${c.red}Error: File not found: ${inputPath}${c.reset}`);
        return false;
    }

    const content = fs.readFileSync(inputPath, 'utf8');
    const imported = parseYaml(content);

    console.log(`${c.cyan}📥 Importing rules from: ${inputPath}${c.reset}`);
    console.log(`  Found: ${imported.lessons.length} lessons, ${imported.autoRules.length} auto-rules`);

    // Merge with existing lessons
    const lessonsPath = path.join(knowledgePath, 'lessons-learned.json');
    let existingLessons = { lessons: [] };
    if (fs.existsSync(lessonsPath)) {
        existingLessons = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
    }

    let addedCount = 0;
    for (const lesson of imported.lessons) {
        const exists = existingLessons.lessons.some(l => l.pattern === lesson.pattern);
        if (!exists) {
            lesson.importedAt = new Date().toISOString();
            lesson.source = 'imported';
            existingLessons.lessons.push(lesson);
            addedCount++;
        }
    }

    if (addedCount > 0) {
        fs.writeFileSync(lessonsPath, JSON.stringify(existingLessons, null, 2));
        console.log(`${c.green}  Added ${addedCount} new lessons${c.reset}`);
    } else {
        console.log(`${c.gray}  No new lessons to add (all duplicates)${c.reset}`);
    }

    return true;
}

/**
 * Import from global storage
 */
function importFromGlobal() {
    ensureDirectories();

    if (!fs.existsSync(globalRulesPath)) {
        console.log(`${c.yellow}No global rules found at: ${globalRulesPath}${c.reset}`);
        console.log(`${c.gray}Run --export-global first to create shared rules${c.reset}`);
        return false;
    }

    return importRules(globalRulesPath);
}

// ==================== SYNC FUNCTIONS ====================

/**
 * Sync rules between local and global storage
 */
function syncRules() {
    console.log(`${c.cyan}🔄 Syncing rules...${c.reset}\n`);

    // Export to global
    console.log(`${c.bold}Step 1: Export to global storage${c.reset}`);
    exportToGlobal();

    console.log('');

    // Import from global (will merge with any rules from other projects)
    console.log(`${c.bold}Step 2: Import from global storage${c.reset}`);
    importFromGlobal();

    console.log(`\n${c.green}✓ Sync complete!${c.reset}`);
}

/**
 * List global rules
 */
function listGlobalRules() {
    ensureDirectories();

    console.log(`${c.cyan}📂 Global Rules Storage: ${globalPath}${c.reset}\n`);

    if (!fs.existsSync(globalRulesPath)) {
        console.log(`${c.gray}No shared rules yet.${c.reset}`);
        console.log(`${c.gray}Run: node rule_sharing.js --export-global${c.reset}`);
        return;
    }

    const content = fs.readFileSync(globalRulesPath, 'utf8');
    const parsed = parseYaml(content);

    console.log(`${c.bold}Shared Lessons: ${parsed.lessons.length}${c.reset}`);
    for (const lesson of parsed.lessons.slice(0, 5)) {
        console.log(`  ${c.blue}${lesson.id}${c.reset}: ${lesson.pattern}`);
    }
    if (parsed.lessons.length > 5) {
        console.log(`  ${c.gray}... and ${parsed.lessons.length - 5} more${c.reset}`);
    }

    console.log(`\n${c.bold}Shared Auto-Rules: ${parsed.autoRules.length}${c.reset}`);
    for (const rule of parsed.autoRules.slice(0, 5)) {
        console.log(`  ${c.green}${rule.id}${c.reset}: ${rule.pattern}`);
    }
}

// ==================== MAIN ====================

const args = process.argv.slice(2);

if (args.includes('--export') || args.includes('-e')) {
    const idx = args.indexOf('--export') !== -1 ? args.indexOf('--export') : args.indexOf('-e');
    const outputPath = args[idx + 1];
    exportRules(outputPath && !outputPath.startsWith('-') ? outputPath : undefined);
} else if (args.includes('--export-global')) {
    exportToGlobal();
} else if (args.includes('--import') || args.includes('-i')) {
    const idx = args.indexOf('--import') !== -1 ? args.indexOf('--import') : args.indexOf('-i');
    const inputPath = args[idx + 1];
    if (!inputPath || inputPath.startsWith('-')) {
        console.log(`${c.red}Error: --import requires a file path${c.reset}`);
    } else {
        importRules(inputPath);
    }
} else if (args.includes('--import-global')) {
    importFromGlobal();
} else if (args.includes('--sync')) {
    syncRules();
} else if (args.includes('--list-global')) {
    listGlobalRules();
} else {
    console.log(`${c.cyan}rule_sharing - Export/Import rules for collaborative learning${c.reset}

${c.bold}Usage:${c.reset}
  node rule_sharing.js --export [file]    Export rules to YAML
  node rule_sharing.js --export-global    Export to global storage
  node rule_sharing.js --import <file>    Import rules from file
  node rule_sharing.js --import-global    Import from global storage
  node rule_sharing.js --sync             Sync local <-> global
  node rule_sharing.js --list-global      List global rules

${c.bold}Global Storage:${c.reset}
  ${globalPath}

${c.bold}Examples:${c.reset}
  node rule_sharing.js --export           Export to local file
  node rule_sharing.js --sync             Sync with global storage
  node rule_sharing.js --list-global      View shared rules
`);
}

export { exportRules, exportToGlobal, importRules, importFromGlobal, syncRules };
