#!/usr/bin/env node
// @ts-nocheck
/**
 * PikaKit Governance Learning Script
 *
 * Adds new lessons to the governance knowledge base.
 * Usage:
 *   node learn.js --add --pattern "regex" --message "why bad"
 *   node learn.js --list
 *
 * @version 3.9.169
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_PATH = path.join(__dirname, '..', 'knowledge', 'lessons-learned.yaml');

// ============================================================================
// YAML HELPERS (no external dependency)
// ============================================================================

function parseYaml(content) {
    const result = { version: '1.0.0', last_updated: '', lessons: [] };
    const lines = content.split('\n');
    let currentLesson = null;

    for (const line of lines) {
        const trimmed = line.trim();
        if (trimmed.startsWith('version:')) result.version = trimmed.split(':')[1].trim().replace(/"/g, '');
        if (trimmed.startsWith('last_updated:')) result.last_updated = trimmed.split(':', 2)[1].trim().replace(/"/g, '');
        if (trimmed.startsWith('- id:')) {
            if (currentLesson) result.lessons.push(currentLesson);
            currentLesson = { id: trimmed.replace('- id:', '').trim() };
        }
        if (currentLesson && trimmed.startsWith('pattern:')) currentLesson.pattern = trimmed.replace('pattern:', '').trim().replace(/"/g, '');
        if (currentLesson && trimmed.startsWith('message:')) currentLesson.message = trimmed.replace('message:', '').trim().replace(/"/g, '');
        if (currentLesson && trimmed.startsWith('severity:')) currentLesson.severity = trimmed.replace('severity:', '').trim();
        if (currentLesson && trimmed.startsWith('addedAt:')) currentLesson.addedAt = trimmed.replace('addedAt:', '').trim().replace(/"/g, '');
    }
    if (currentLesson) result.lessons.push(currentLesson);
    return result;
}

function toYaml(data) {
    let out = `version: "${data.version}"\n`;
    out += `last_updated: "${data.last_updated}"\n`;

    if (!data.lessons || data.lessons.length === 0) {
        out += 'lessons: []\n';
        return out;
    }

    out += 'lessons:\n';
    for (const l of data.lessons) {
        out += `  - id: ${l.id}\n`;
        out += `    pattern: "${l.pattern}"\n`;
        out += `    message: "${l.message}"\n`;
        out += `    severity: ${l.severity}\n`;
        out += `    addedAt: "${l.addedAt}"\n`;
    }
    return out;
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

function loadKnowledge() {
    try {
        if (!fs.existsSync(KNOWLEDGE_PATH)) {
            const initial = { version: '1.0.0', last_updated: '', lessons: [] };
            fs.mkdirSync(path.dirname(KNOWLEDGE_PATH), { recursive: true });
            fs.writeFileSync(KNOWLEDGE_PATH, toYaml(initial), 'utf8');
            return initial;
        }
        const content = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
        return parseYaml(content);
    } catch (error) {
        console.error('❌ Failed to load knowledge base:', error.message);
        process.exit(1);
    }
}

function saveKnowledge(data) {
    try {
        data.last_updated = new Date().toISOString();
        fs.writeFileSync(KNOWLEDGE_PATH, toYaml(data), 'utf8');
        console.log('✅ Knowledge base updated successfully.');
    } catch (error) {
        console.error('❌ Failed to save knowledge base:', error.message);
        process.exit(1);
    }
}

function addLesson(pattern, message, severity = 'WARNING') {
    const db = loadKnowledge();

    // Validate Regex
    try {
        new RegExp(pattern);
    } catch (e) {
        console.error('❌ Invalid Regex pattern:', e.message);
        process.exit(1);
    }

    const id = `LEARN-${String(db.lessons.length + 1).padStart(3, '0')}`;

    db.lessons.push({
        id,
        pattern,
        message,
        severity,
        addedAt: new Date().toISOString(),
    });

    saveKnowledge(db);

    console.log(`\n🎓 Lesson Learned: [${id}]`);
    console.log(`   Pattern: /${pattern}/`);
    console.log(`   Message: ${message}`);
    console.log('\n⚡ PikaKit Governance Learning Engine v2.0.0');
}

function listLessons() {
    const db = loadKnowledge();
    if (db.lessons.length === 0) {
        console.log('ℹ️  No lessons learned yet.');
        return;
    }

    console.log('\n🧠 PikaKit Governance Knowledge Base:\n');
    for (const l of db.lessons) {
        console.log(`  [${l.id}] /${l.pattern}/ -> ${l.message} (${l.severity})`);
    }
    console.log('');
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
PikaKit Governance Learning Tool v2.0.0

USAGE:
  node learn.js --add --pattern "..." --message "..."
  node learn.js --list
  node learn.js --help

OPTIONS:
  --add       Add a new lesson
  --pattern   Regex pattern to flag
  --message   Explanation message
  --severity  Severity (WARNING/ERROR), default WARNING
  --list      List all learned lessons
`);
}

// Main
const args = process.argv.slice(2);

if (args.includes('--help') || args.length === 0) {
    printHelp();
    process.exit(0);
}

if (args.includes('--list')) {
    listLessons();
    process.exit(0);
}

if (args.includes('--add')) {
    const pIdx = args.indexOf('--pattern');
    const mIdx = args.indexOf('--message');
    const sIdx = args.indexOf('--severity');

    if (pIdx === -1 || mIdx === -1) {
        console.error('❌ --pattern and --message are required for --add');
        process.exit(1);
    }

    const pattern = args[pIdx + 1];
    const message = args[mIdx + 1];
    const severity = sIdx !== -1 ? args[sIdx + 1] : 'WARNING';

    if (!pattern || !message) {
        console.error('❌ Missing values for pattern/message');
        process.exit(1);
    }

    addLesson(pattern, message, severity);
}
