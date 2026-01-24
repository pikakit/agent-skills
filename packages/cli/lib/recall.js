#!/usr/bin/env node
/**
 * Smart Recall Script
 * 
 * The "Memory" script. Checks code against learned lessons.
 * Usage: node recall.js <file_path>
 */

const fs = require('fs');
const path = require('path');
const yaml = require('js-yaml');

const KNOWLEDGE_PATH = path.join(process.cwd(), '.agent', 'knowledge', 'lessons-learned.yaml');

function loadKnowledge() {
    try {
        if (!fs.existsSync(KNOWLEDGE_PATH)) {
            return { lessons: [] };
        }
        const content = fs.readFileSync(KNOWLEDGE_PATH, 'utf8');
        return yaml.load(content) || { lessons: [] };
    } catch (error) {
        return { lessons: [] };
    }
}

function checkFile(filePath) {
    if (!fs.existsSync(filePath)) {
        console.error(`File not found: ${filePath}`);
        process.exit(1);
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) return;

    let issuesFound = 0;

    console.log(`\n🧠 Checking memory for: ${path.basename(filePath)}...`);

    db.lessons.forEach(lesson => {
        try {
            const regex = new RegExp(lesson.pattern, 'g');
            const matches = content.match(regex);

            if (matches) {
                issuesFound++;
                console.log(`\n❌ Violation of Lesson [${lesson.id}]:`);
                console.log(`   Recall: "${lesson.message}"`);
                console.log(`   Severity: ${lesson.severity}`);
                console.log(`   Found ${matches.length} occurence(s) matching /${lesson.pattern}/`);
            }
        } catch (e) {
            // Ignore invalid regex in db
        }
    });

    if (issuesFound === 0) {
        console.log("✅ No learned anti-patterns detected.");
        process.exit(0);
    } else {
        console.log(`\n⚠️  Found ${issuesFound} potential issues from past lessons.`);
        // We generally don't exit 1 here unless we want to block strict builds
        process.exit(1);
    }
}

const args = process.argv.slice(2);
if (args.length === 0) {
    console.log("Usage: node recall.js <file_path>");
    process.exit(1);
}

checkFile(args[0]);
