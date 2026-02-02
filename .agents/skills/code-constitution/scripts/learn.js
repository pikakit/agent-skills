#!/usr/bin/env node
/**
 * My Agent Skill Learning Script
 * 
 * The "Teacher" script. Adds new lessons to the system memory.
 * Usage: node learn.js --add --pattern "regex" --message "why bad"
 * 
 * @version 1.0.0
 * @author MyAgentSkill
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

// ============================================================================
// CONFIGURATION
// ============================================================================

// Prioritize user's project root for persistence, fallback to local skill folder for defaults
const USER_KNOWLEDGE_PATH = path.join(process.cwd(), '.myagentskill', 'knowledge', 'lessons-learned.yaml');
const INTERNAL_KNOWLEDGE_PATH = path.join(__dirname, '..', 'knowledge', 'lessons-learned.yaml');

// We always write to the USER path to ensure persistence
const KNOWLEDGE_PATH = USER_KNOWLEDGE_PATH;

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

function loadKnowledge() {
    try {
        if (!fs.existsSync(KNOWLEDGE_PATH)) {
            // Create if missing
            const initial = { lessons: [] };
            fs.mkdirSync(path.dirname(KNOWLEDGE_PATH), { recursive: true });
            fs.writeFileSync(KNOWLEDGE_PATH, yaml.dump(initial), 'utf8');
            return initial;
        }
        const content = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
        return yaml.load(content) || { lessons: [] };
    } catch (error) {
        console.error('❌ Failed to load knowledge base:', error.message);
        process.exit(1);
    }
}

function saveKnowledge(data) {
    try {
        const str = yaml.dump(data, { lineWidth: -1 });
        fs.writeFileSync(KNOWLEDGE_PATH, str, 'utf8');
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

    const lesson = {
        id,
        pattern,
        message,
        severity,
        addedAt: new Date().toISOString()
    };

    db.lessons.push(lesson);
    saveKnowledge(db);

    console.log(`\n🎓 Lesson Learned: [${id}]`);
    console.log(`   Pattern: /${pattern}/`);
    console.log(`   Message: ${message}`);
    console.log('\nP.S. ⚡ Knowledge captured by My Agent Skill Learning Engine');
}

function listLessons() {
    const db = loadKnowledge();
    if (db.lessons.length === 0) {
        console.log('ℹ️  No lessons learned yet.');
        return;
    }

    console.log('\n🧠 My Agent Skill Knowledge Base:\n');
    db.lessons.forEach(l => {
        console.log(`  [${l.id}] /${l.pattern}/ -> ${l.message} (${l.severity})`);
    });
    console.log('');
}

// ============================================================================
// CLI
// ============================================================================

function printHelp() {
    console.log(`
My Agent Skill Learning Tool v1.0.0

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

function main() {
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
}

main();
