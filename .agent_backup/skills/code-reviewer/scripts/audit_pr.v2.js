#!/usr/bin/env node
/**
 * CoinPika PR Audit Script v2
 * 
 * Validates pull request changes against CoinPika doctrines.
 * Usage: node audit_pr.v2.js [--current | --branch <name> | --file <path>]
 * 
 * @version 1.3.0
 * @author DataGuruIn
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const yaml = require('js-yaml');

// ============================================================================
// CONFIGURATION
// ============================================================================

const SKILL_ROOT = path.resolve(__dirname, '..');
const DOCTRINE_MAPPING_PATH = path.join(SKILL_ROOT, 'metadata', 'doctrine-mapping.yaml');
const DOCTRINE_PACK_PATH = path.join(SKILL_ROOT, '..', 'coinpika-doctrine-pack');
// Persistence: Check user's root first, then skill default
const USER_KNOWLEDGE_PATH = path.join(process.cwd(), '.coinpika', 'knowledge', 'lessons-learned.yaml');
const INTERNAL_KNOWLEDGE_PATH = path.join(DOCTRINE_PACK_PATH, 'knowledge', 'lessons-learned.yaml');

const DEFAULT_DOCTRINE_DEFINITIONS = {
    'Law-1': {
        name: 'Truth Ownership',
        description: 'Backend owns truth, frontend only displays',
        patterns: [
            "localStorage\\.setItem\\s*\\(\\s*['\"`].*price",
            "sessionStorage\\.setItem\\s*\\(\\s*['\"`].*price",
            "setState\\s*\\(\\s*\\{[^}]*price[^}]*\\}",
        ],
        severity: 'ERROR',
        message: 'Frontend must not manage financial truth. Backend owns all price/market data.'
    },
    'Law-2': {
        name: 'Historical Integrity',
        description: 'Historical data is immutable',
        patterns: [
            "\\.push\\s*\\([^)]*historical",
            "\\.splice\\s*\\([^)]*historical",
            "history\\s*\\[\\s*\\d+\\s*\\]\\s*=",
            "UPDATE\\s+.*history",
            "DELETE\\s+.*FROM.*history",
        ],
        severity: 'ERROR',
        message: 'Historical data must be immutable. Use append-only operations.'
    },
    'Law-3': {
        name: 'Realtime Ephemerality',
        description: 'Realtime data must not persist as historical',
        patterns: [
            "chart.*\\.push\\s*\\(\\s*realtimePrice",
            "historical.*push.*websocket",
            "ws.*message.*history.*push",
        ],
        severity: 'ERROR',
        message: 'Realtime ticks must not be injected into historical charts.'
    },
    'Law-4': {
        name: 'Chart Truthfulness',
        description: 'Charts show backend-aggregated data only',
        patterns: [
            "chart.*data.*=.*fetch\\s*\\(\\s*['\"`]wss?:",
            "candlestick.*websocket",
            "ohlcv.*realtime",
        ],
        severity: 'ERROR',
        message: 'Charts must display pre-aggregated backend data, not realtime feeds.'
    },
    'Architecture': {
        name: 'Architecture Doctrine',
        description: 'System boundaries must be respected',
        patterns: [
            "fetch\\s*\\(\\s*['\"`]https?:\\/\\/api\\.coingecko",
            "fetch\\s*\\(\\s*['\"`]https?:\\/\\/api\\.binance",
            "axios\\s*\\.\\s*get\\s*\\(\\s*['\"`]https?:\\/\\/.*external",
        ],
        severity: 'WARNING',
        message: 'Frontend should not call external APIs directly. Route through backend.'
    },
    'Performance': {
        name: 'Performance Doctrine',
        description: 'Caching and optimization required',
        patterns: [
            "fetch\\s*\\([^)]+\\)\\s*(?!.*cache)",
        ],
        severity: 'INFO',
        message: 'Consider implementing caching for API calls.'
    }
};

function loadConfiguration() {
    let config = {};
    try {
        if (fs.existsSync(DOCTRINE_MAPPING_PATH)) {
            const fileContents = fs.readFileSync(DOCTRINE_MAPPING_PATH, 'utf8');
            config = yaml.load(fileContents) || {};
        }
    } catch (e) {
        console.error('❌ Failed to load configuration:', e);
    }
    return config;
}

function loadLearnedLessons() {
    const lessons = [];
    const paths = [INTERNAL_KNOWLEDGE_PATH, USER_KNOWLEDGE_PATH];

    for (const p of paths) {
        try {
            if (fs.existsSync(p)) {
                const content = fs.readFileSync(p, 'utf8');
                const data = yaml.load(content);
                if (data && data.lessons) {
                    lessons.push(...data.lessons);
                }
            }
        } catch (e) {
            // Silently fail if knowledge base missing (learning optional)
        }
    }
    return lessons;
}

const config = loadConfiguration();
const FILE_MAPPINGS = config.mappings || {};
const DOCTRINE_DEFINITIONS = config.definitions || DEFAULT_DOCTRINE_DEFINITIONS;

// Inject Learned Lessons
const lessons = loadLearnedLessons();
if (lessons.length > 0) {
    DOCTRINE_DEFINITIONS['Learned-Lesson'] = {
        name: 'Self-Improvement Memory',
        description: 'Patterns flagged by the Learning Engine',
        patterns: [],
        severity: 'WARNING',
        message: 'This pattern was flagged by a previous learning cycle.'
    };
}

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

function getChangedFiles(mode, target) {
    try {
        let cmd;
        if (mode === 'current') {
            cmd = 'git diff --name-only HEAD~1';
        } else if (mode === 'branch') {
            cmd = `git diff --name-only main...${target}`;
        } else if (mode === 'staged') {
            cmd = 'git diff --cached --name-only';
        } else {
            return [target]; // Single file mode
        }

        const output = execSync(cmd, { encoding: 'utf8' });
        return output.trim().split('\n').filter(Boolean);
    } catch (error) {
        console.error('❌ Failed to get changed files:', error.message);
        return [];
    }
}

function getApplicableDoctrines(filePath) {
    const doctrines = new Set();

    for (const [pattern, rule] of Object.entries(FILE_MAPPINGS)) {
        const cleanPattern = pattern.replace('**', '').replace('*', '');
        if (filePath.toLowerCase().includes(cleanPattern.toLowerCase())) {
            if (rule.doctrines) {
                rule.doctrines.forEach(d => doctrines.add(d));
            }
        }
    }

    if (lessons.length > 0) {
        doctrines.add('Learned-Lesson');
    }

    return Array.from(doctrines);
}

function validateFile(filePath, content) {
    const violations = [];
    const applicableDoctrines = getApplicableDoctrines(filePath);
    const lines = content.split('\n');

    // 1. Standard Doctrines
    for (const [doctrineId, doctrine] of Object.entries(DOCTRINE_DEFINITIONS)) {
        if (doctrineId === 'Learned-Lesson') continue;

        if (!applicableDoctrines.includes(doctrineId) && applicableDoctrines.length > 0) {
            continue;
        }

        const patterns = doctrine.patterns || [];
        for (const patternStr of patterns) {
            let pattern;
            try {
                pattern = new RegExp(patternStr, 'i');
            } catch (e) {
                continue;
            }

            for (let i = 0; i < lines.length; i++) {
                if (pattern.test(lines[i])) {
                    violations.push({
                        file: filePath,
                        line: i + 1,
                        column: lines[i].search(pattern) + 1,
                        doctrine: doctrineId,
                        doctrineName: doctrine.name,
                        severity: doctrine.severity,
                        message: doctrine.message,
                        code: lines[i].trim().substring(0, 80),
                    });
                }
            }
        }
    }

    // 2. Learned Lessons
    if (applicableDoctrines.includes('Learned-Lesson')) {
        for (const lesson of lessons) {
            try {
                const pattern = new RegExp(lesson.pattern, 'i');
                for (let i = 0; i < lines.length; i++) {
                    if (pattern.test(lines[i])) {
                        violations.push({
                            file: filePath,
                            line: i + 1,
                            column: lines[i].search(pattern) + 1,
                            doctrine: 'Learned-Lesson',
                            doctrineName: `Learned: ${lesson.id}`,
                            severity: lesson.severity || 'WARNING',
                            message: lesson.message,
                            code: lines[i].trim().substring(0, 80),
                        });
                    }
                }
            } catch (e) {
                // Ignore invalid learned patterns
            }
        }
    }

    return violations;
}

function generateReport(violations, files) {
    const timestamp = new Date().toISOString();
    const errors = violations.filter(v => v.severity === 'ERROR');
    const warnings = violations.filter(v => v.severity === 'WARNING');
    const infos = violations.filter(v => v.severity === 'INFO');

    let status = 'APPROVED';
    if (errors.length > 0) status = 'REJECTED';
    else if (warnings.length > 0) status = 'CHANGES_REQUESTED';
    else if (infos.length > 0) status = 'APPROVED_WITH_SUGGESTIONS';

    const report = {
        meta: {
            tool: 'coinpika-pr-reviewer',
            version: '1.3.0',
            timestamp,
            filesChecked: files.length,
        },
        summary: {
            status,
            totalViolations: violations.length,
            errors: errors.length,
            warnings: warnings.length,
            info: infos.length,
        },
        violations: violations.map(v => ({
            ...v,
            doctrineRef: `doctrines/${v.doctrine.toLowerCase()}/`
        })),
        doctrinesChecked: [...new Set(violations.map(v => v.doctrine))],
    };

    return report;
}

function printReport(report) {
    const { meta, summary, violations } = report;

    console.log('\n' + '═'.repeat(60));
    console.log('  🔍 CoinPika Doctrine Review');
    console.log('═'.repeat(60));
    console.log(`  📅 ${meta.timestamp}`);
    console.log(`  📁 Files checked: ${meta.filesChecked}`);
    console.log('');

    const statusEmoji = {
        'APPROVED': '✅',
        'APPROVED_WITH_SUGGESTIONS': '✅',
        'CHANGES_REQUESTED': '⚠️',
        'REJECTED': '🚫'
    };
    console.log(`  ${statusEmoji[summary.status]} Status: ${summary.status}`);
    console.log('');

    if (summary.errors > 0) console.log(`  🔴 Errors: ${summary.errors}`);
    if (summary.warnings > 0) console.log(`  🟡 Warnings: ${summary.warnings}`);
    if (summary.info > 0) console.log(`  🔵 Info: ${summary.info}`);

    if (violations.length === 0) {
        console.log('\n  ✨ No constitutional violations found!\n');
        return;
    }

    console.log('\n' + '─'.repeat(60));
    console.log('  Violations');
    console.log('─'.repeat(60));

    const severityEmoji = { ERROR: '🔴', WARNING: '🟡', INFO: '🔵' };

    violations.forEach((v, i) => {
        console.log(`\n  ${severityEmoji[v.severity]} [${v.severity}] ${v.doctrineName} (${v.doctrine})`);
        console.log(`     📍 ${v.file}:${v.line}`);
        console.log(`     💬 ${v.message}`);
        console.log(`     📝 ${v.code}...`);
    });

    console.log('\n' + '═'.repeat(60) + '\n');
    console.log('P.S. ⚡ Verified by CoinPika PR Reviewer');
}

function printHelp() {
    console.log(`
CoinPika PR Audit Script v1.3.0

USAGE:
  node audit_pr.v2.js [OPTIONS]

OPTIONS:
  --current           Audit changes from last commit
  --staged            Audit staged changes
  --branch <name>     Audit changes from branch vs main
  --file <path>       Audit single file
  --json              Output as JSON
  --help              Show this help

EXAMPLES:
  node audit_pr.v2.js --current
  node audit_pr.v2.js --branch feature/new-chart
  node audit_pr.v2.js --file src/components/Chart.tsx
  node audit_pr.v2.js --current --json
`);
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.length === 0) {
        printHelp();
        process.exit(0);
    }

    const jsonOutput = args.includes('--json');
    let mode = 'current';
    let target = null;

    if (args.includes('--current')) {
        mode = 'current';
    } else if (args.includes('--staged')) {
        mode = 'staged';
    } else if (args.includes('--branch')) {
        mode = 'branch';
        target = args[args.indexOf('--branch') + 1];
    } else if (args.includes('--file')) {
        mode = 'file';
        target = args[args.indexOf('--file') + 1];
    }

    const files = getChangedFiles(mode, target);

    if (files.length === 0) {
        console.log('ℹ️  No files to audit.');
        process.exit(0);
    }

    const allViolations = [];

    for (const file of files) {
        try {
            if (!fs.existsSync(file)) continue;
            const content = fs.readFileSync(file, 'utf8');
            const violations = validateFile(file, content);
            allViolations.push(...violations);
        } catch (error) {
        }
    }

    const report = generateReport(allViolations, files);

    if (jsonOutput) {
        console.log(JSON.stringify(report, null, 2));
    } else {
        printReport(report);
    }

    if (report.summary.status === 'REJECTED') {
        process.exit(1);
    }
    process.exit(0);
}

main();
