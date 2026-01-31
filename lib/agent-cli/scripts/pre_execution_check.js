#!/usr/bin/env node
/**
 * Pre-Execution Check - Prevent known errors before they happen
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 3
 * 
 * Before AI writes code, this checks:
 * - Active rules from lessons-learned
 * - Auto-generated rules from pattern_analyzer
 * - Known anti-patterns
 * 
 * Usage:
 *   node pre_execution_check.js --check "code intent description"
 *   node pre_execution_check.js --list-rules
 *   node pre_execution_check.js --approve RULE-ID
 */

import fs from 'fs';
import path from 'path';
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
const lessonsPath = path.join(knowledgePath, 'lessons-learned.json');
const autoRulesPath = path.join(knowledgePath, 'auto-rules.yaml');
const activeRulesPath = path.join(knowledgePath, 'active-rules.json');
const errorsPath = path.join(knowledgePath, 'detected-errors.json');
const successesPath = path.join(knowledgePath, 'successes.json');

// Load lessons
function loadLessons() {
    try {
        if (fs.existsSync(lessonsPath)) {
            const data = JSON.parse(fs.readFileSync(lessonsPath, 'utf8'));
            return data.lessons || [];
        }
    } catch { }
    return [];
}

// Load errors for pattern analysis
function loadErrors() {
    try {
        if (fs.existsSync(errorsPath)) {
            const data = JSON.parse(fs.readFileSync(errorsPath, 'utf8'));
            return data.errors || [];
        }
    } catch { }
    return [];
}

// Load successes for positive patterns
function loadSuccesses() {
    try {
        if (fs.existsSync(successesPath)) {
            const data = JSON.parse(fs.readFileSync(successesPath, 'utf8'));
            return data.successes || [];
        }
    } catch { }
    return [];
}

// Load auto-rules (parse YAML)
function loadAutoRules() {
    try {
        if (fs.existsSync(autoRulesPath)) {
            const content = fs.readFileSync(autoRulesPath, 'utf8');
            // Simple YAML parsing for rules
            const rules = [];
            const ruleBlocks = content.split(/\n\s*-\s+id:/);

            for (let i = 1; i < ruleBlocks.length; i++) {
                const block = '- id:' + ruleBlocks[i];
                const rule = {};

                const idMatch = block.match(/id:\s*(\S+)/);
                const patternMatch = block.match(/pattern:\s*"([^"]+)"/);
                const preventionMatch = block.match(/prevention:\s*"([^"]+)"/);
                const statusMatch = block.match(/status:\s*(\S+)/);
                const severityMatch = block.match(/severity:\s*(\S+)/);

                if (idMatch) rule.id = idMatch[1];
                if (patternMatch) rule.pattern = patternMatch[1];
                if (preventionMatch) rule.prevention = preventionMatch[1];
                if (statusMatch) rule.status = statusMatch[1];
                if (severityMatch) rule.severity = severityMatch[1];

                if (rule.id) rules.push(rule);
            }

            return rules;
        }
    } catch { }
    return [];
}

// Load active rules
function loadActiveRules() {
    try {
        if (fs.existsSync(activeRulesPath)) {
            const data = JSON.parse(fs.readFileSync(activeRulesPath, 'utf8'));
            return data.rules || [];
        }
    } catch { }
    return [];
}

// Save active rules
function saveActiveRules(rules) {
    const data = {
        _comment: "Active prevention rules",
        updatedAt: new Date().toISOString(),
        rules
    };
    fs.writeFileSync(activeRulesPath, JSON.stringify(data, null, 2));
}

// ==================== INTENT DETECTION ====================

/**
 * Advanced intent detection from code/description
 */
function detectIntent(input) {
    const intents = [];
    const inputLower = input.toLowerCase();

    // File operations
    if (/\b(rename|mv|move)\b/i.test(input)) {
        intents.push({ action: 'rename', target: 'file', risk: 'HIGH' });
    }
    if (/\b(delete|remove|unlink|rm)\b/i.test(input)) {
        intents.push({ action: 'delete', target: 'file', risk: 'CRITICAL' });
    }
    if (/\b(create|new|add|write)\b.*\b(file|component|module)\b/i.test(input)) {
        intents.push({ action: 'create', target: 'file', risk: 'LOW' });
    }
    if (/\b(modify|update|change|edit)\b/i.test(input)) {
        intents.push({ action: 'modify', target: 'file', risk: 'MEDIUM' });
    }

    // Code patterns
    if (/\b(async|await|promise|fetch)\b/i.test(input)) {
        intents.push({ action: 'async', target: 'code', risk: 'MEDIUM' });
    }
    if (/\b(import|require|from)\b/i.test(input)) {
        intents.push({ action: 'import', target: 'module', risk: 'MEDIUM' });
    }
    if (/\b(function|method|handler)\b/i.test(input)) {
        intents.push({ action: 'function', target: 'code', risk: 'LOW' });
    }
    if (/\b(api|endpoint|request|response)\b/i.test(input)) {
        intents.push({ action: 'api', target: 'network', risk: 'MEDIUM' });
    }
    if (/\b(database|db|query|sql|prisma)\b/i.test(input)) {
        intents.push({ action: 'database', target: 'data', risk: 'HIGH' });
    }

    // Completion/notification
    if (/\b(complete|finish|done|notify|submit)\b/i.test(input)) {
        intents.push({ action: 'complete', target: 'task', risk: 'CRITICAL' });
    }

    return intents;
}

/**
 * Get high-frequency error patterns for matching
 */
function getHighFrequencyPatterns() {
    const errors = loadErrors();
    const patterns = {};

    for (const err of errors) {
        const key = err.pattern || err.type;
        patterns[key] = (patterns[key] || 0) + 1;
    }

    // Return patterns that occurred 2+ times
    return Object.entries(patterns)
        .filter(([, count]) => count >= 2)
        .map(([pattern, count]) => ({ pattern, count, type: 'error' }));
}

/**
 * Get success patterns for positive reinforcement
 */
function getSuccessPatterns() {
    const successes = loadSuccesses();
    const patterns = {};

    for (const s of successes) {
        patterns[s.pattern] = (patterns[s.pattern] || 0) + 1;
    }

    return Object.entries(patterns)
        .map(([pattern, count]) => ({ pattern, count, type: 'success' }));
}

// ==================== RULE MATCHING ====================

/**
 * Built-in prevention rules
 */
const BUILTIN_RULES = [
    {
        id: 'BUILTIN-001',
        name: 'TypeScript type safety',
        keywords: ['function', 'param', 'return', 'type'],
        check: (intent) => intent.toLowerCase().includes('function'),
        prevention: 'Add explicit TypeScript types to all function parameters and return types',
        severity: 'HIGH'
    },
    {
        id: 'BUILTIN-002',
        name: 'Async/await usage',
        keywords: ['async', 'await', 'promise', 'fetch', 'api'],
        check: (intent) => /async|await|promise|fetch|api/i.test(intent),
        prevention: 'Always use async/await pattern. Never mix callbacks and promises.',
        severity: 'HIGH'
    },
    {
        id: 'BUILTIN-003',
        name: 'Error handling',
        keywords: ['try', 'catch', 'error', 'exception'],
        check: (intent) => /async|fetch|api|database|file/i.test(intent),
        prevention: 'Wrap async operations in try/catch. Never use empty catch blocks.',
        severity: 'HIGH'
    },
    {
        id: 'BUILTIN-004',
        name: 'Import paths',
        keywords: ['import', 'require', 'from'],
        check: (intent) => /import|require|module/i.test(intent),
        prevention: 'Verify import paths exist. Use relative imports from project root.',
        severity: 'MEDIUM'
    },
    {
        id: 'BUILTIN-005',
        name: 'Null safety',
        keywords: ['null', 'undefined', 'optional'],
        check: (intent) => /optional|null|undefined|maybe|might/i.test(intent),
        prevention: 'Use optional chaining (?.) and nullish coalescing (??). Check for null/undefined.',
        severity: 'HIGH'
    },
    {
        id: 'BUILTIN-006',
        name: 'React component types',
        keywords: ['react', 'component', 'jsx', 'tsx'],
        check: (intent) => /react|component|jsx|tsx/i.test(intent),
        prevention: 'Use React.FC for components. Use ReactNode instead of JSX.Element.',
        severity: 'MEDIUM'
    },
    {
        id: 'BUILTIN-007',
        name: 'Test before completion',
        keywords: ['complete', 'finish', 'done', 'notify'],
        check: (intent) => /complete|finish|done|notify/i.test(intent),
        prevention: 'Run tests before marking task complete. Verify no TypeScript errors.',
        severity: 'CRITICAL'
    }
];

/**
 * Check intent against all rules (ENHANCED)
 */
function checkIntent(intent) {
    const violations = [];
    const warnings = [];
    const recommendations = [];

    // PHASE 1: Intent Detection
    const detectedIntents = detectIntent(intent);

    // Add risk warnings from detected intents
    for (const di of detectedIntents) {
        if (di.risk === 'CRITICAL') {
            violations.push({
                id: `INTENT-${di.action.toUpperCase()}`,
                pattern: `${di.action} ${di.target}`,
                prevention: `CRITICAL: ${di.action} operation detected. Verify safety before proceeding.`,
                severity: 'CRITICAL',
                source: 'intent-detection'
            });
        } else if (di.risk === 'HIGH') {
            warnings.push({
                id: `INTENT-${di.action.toUpperCase()}`,
                name: `High-risk: ${di.action}`,
                prevention: `${di.action} on ${di.target} - use extra caution`,
                severity: 'HIGH',
                source: 'intent-detection'
            });
        }
    }

    // Check builtin rules
    for (const rule of BUILTIN_RULES) {
        if (rule.check(intent)) {
            warnings.push({
                id: rule.id,
                name: rule.name,
                prevention: rule.prevention,
                severity: rule.severity,
                source: 'builtin'
            });
        }
    }

    // Check lessons
    const lessons = loadLessons();
    for (const lesson of lessons) {
        if (lesson.pattern && intent.toLowerCase().includes(lesson.pattern.toLowerCase().split(' ')[0])) {
            violations.push({
                id: lesson.id,
                pattern: lesson.pattern,
                prevention: lesson.message,
                severity: lesson.severity,
                source: 'lesson'
            });
        }
    }

    // PHASE 2: High-Frequency Error Pattern Matching
    const errorPatterns = getHighFrequencyPatterns();
    for (const ep of errorPatterns) {
        if (ep.pattern && intent.toLowerCase().includes(ep.pattern.toLowerCase())) {
            violations.push({
                id: `FREQ-${ep.pattern.toUpperCase().replace(/\s+/g, '-').slice(0, 10)}`,
                pattern: ep.pattern,
                prevention: `This pattern caused ${ep.count} errors before. Apply extra care.`,
                severity: ep.count >= 5 ? 'HIGH' : 'MEDIUM',
                source: 'error-frequency'
            });
        }
    }

    // PHASE 3: Success Pattern Recommendations
    const successPatterns = getSuccessPatterns();
    for (const sp of successPatterns) {
        // If intent matches a success pattern, recommend it
        const matchWords = sp.pattern.split('-').map(w => w.toLowerCase());
        if (matchWords.some(w => intent.toLowerCase().includes(w))) {
            recommendations.push({
                id: `SUCCESS-${sp.pattern}`,
                pattern: sp.pattern,
                message: `Good pattern! "${sp.pattern}" has ${sp.count} successes.`,
                type: 'positive'
            });
        }
    }

    // Check approved auto-rules
    const autoRules = loadAutoRules().filter(r => r.status === 'approved');
    for (const rule of autoRules) {
        if (rule.pattern && intent.toLowerCase().includes(rule.pattern.toLowerCase())) {
            violations.push({
                id: rule.id,
                pattern: rule.pattern,
                prevention: rule.prevention,
                severity: rule.severity,
                source: 'auto-rule'
            });
        }
    }

    // Check active rules
    const activeRules = loadActiveRules();
    for (const rule of activeRules) {
        if (rule.keywords?.some(kw => intent.toLowerCase().includes(kw))) {
            warnings.push({
                id: rule.id,
                name: rule.name,
                prevention: rule.prevention,
                severity: rule.severity,
                source: 'active'
            });
        }
    }

    return { violations, warnings, recommendations, detectedIntents };
}

/**
 * Generate prevention advice
 */
function generateAdvice(violations, warnings) {
    const advice = [];

    // Critical violations first
    const critical = [...violations, ...warnings].filter(v => v.severity === 'CRITICAL');
    if (critical.length > 0) {
        advice.push({
            level: 'STOP',
            message: 'Critical rules triggered. Address these before proceeding:',
            items: critical.map(v => `[${v.id}] ${v.prevention}`)
        });
    }

    // High severity
    const high = [...violations, ...warnings].filter(v => v.severity === 'HIGH');
    if (high.length > 0) {
        advice.push({
            level: 'CAUTION',
            message: 'High-priority checks to apply:',
            items: high.map(v => `[${v.id}] ${v.prevention}`)
        });
    }

    // Medium/Low as tips
    const other = [...violations, ...warnings].filter(v => v.severity === 'MEDIUM' || v.severity === 'LOW');
    if (other.length > 0) {
        advice.push({
            level: 'TIP',
            message: 'Best practices to consider:',
            items: other.map(v => `[${v.id}] ${v.prevention}`)
        });
    }

    return advice;
}

// ==================== MAIN ====================

function runCheck(intent) {
    console.log(`${c.cyan}🛡️  Pre-Execution Check${c.reset}\n`);
    console.log(`${c.gray}Intent: "${intent}"${c.reset}\n`);

    const { violations, warnings } = checkIntent(intent);
    const advice = generateAdvice(violations, warnings);

    if (advice.length === 0) {
        console.log(`${c.green}✓ No known issues for this intent${c.reset}`);
        console.log(`${c.gray}Proceed with standard best practices${c.reset}`);
        return { proceed: true, violations: [], warnings: [] };
    }

    for (const a of advice) {
        const color = {
            'STOP': c.red,
            'CAUTION': c.yellow,
            'TIP': c.blue
        }[a.level] || c.gray;

        console.log(`${color}${c.bold}${a.level}${c.reset} ${a.message}`);
        for (const item of a.items) {
            console.log(`  ${color}●${c.reset} ${item}`);
        }
        console.log('');
    }

    // Determine if should proceed
    const hasCritical = violations.some(v => v.severity === 'CRITICAL') ||
        warnings.some(v => v.severity === 'CRITICAL');

    if (hasCritical) {
        console.log(`${c.red}${c.bold}⛔ BLOCKED${c.reset} - Critical rules violated`);
        console.log(`${c.gray}Address critical issues before proceeding${c.reset}`);
        return { proceed: false, violations, warnings };
    }

    console.log(`${c.yellow}⚠️  PROCEED WITH CAUTION${c.reset}`);
    console.log(`${c.gray}Apply the recommendations above${c.reset}`);
    return { proceed: true, violations, warnings };
}

function listRules() {
    console.log(`${c.cyan}📋 Active Prevention Rules${c.reset}\n`);

    console.log(`${c.bold}Built-in Rules:${c.reset}`);
    for (const rule of BUILTIN_RULES) {
        const sevColor = { CRITICAL: c.red, HIGH: c.yellow, MEDIUM: c.blue }[rule.severity] || c.gray;
        console.log(`  ${c.cyan}${rule.id}${c.reset} ${sevColor}[${rule.severity}]${c.reset}`);
        console.log(`    ${rule.name}`);
        console.log(`    ${c.gray}${rule.prevention}${c.reset}\n`);
    }

    const lessons = loadLessons();
    if (lessons.length > 0) {
        console.log(`${c.bold}Lessons (${lessons.length}):${c.reset}`);
        for (const lesson of lessons.slice(0, 5)) {
            console.log(`  ${c.cyan}${lesson.id}${c.reset}: ${lesson.pattern}`);
        }
        if (lessons.length > 5) {
            console.log(`  ${c.gray}... and ${lessons.length - 5} more${c.reset}`);
        }
        console.log('');
    }

    const autoRules = loadAutoRules();
    const approved = autoRules.filter(r => r.status === 'approved');
    const pending = autoRules.filter(r => r.status === 'pending');

    if (approved.length > 0) {
        console.log(`${c.bold}Approved Auto-Rules (${approved.length}):${c.reset}`);
        for (const rule of approved) {
            console.log(`  ${c.green}${rule.id}${c.reset}: ${rule.pattern}`);
        }
        console.log('');
    }

    if (pending.length > 0) {
        console.log(`${c.bold}${c.yellow}Pending Auto-Rules (${pending.length}):${c.reset}`);
        for (const rule of pending) {
            console.log(`  ${c.yellow}${rule.id}${c.reset}: ${rule.pattern}`);
        }
        console.log(`\n${c.gray}Approve pending rules with: --approve RULE-ID${c.reset}`);
    }
}

function approveRule(ruleId) {
    const content = fs.readFileSync(autoRulesPath, 'utf8');
    const updated = content.replace(
        new RegExp(`(id:\\s*${ruleId}[\\s\\S]*?status:\\s*)pending`, 'm'),
        '$1approved'
    );

    if (updated === content) {
        console.log(`${c.red}Rule ${ruleId} not found or already approved${c.reset}`);
        return;
    }

    fs.writeFileSync(autoRulesPath, updated);
    console.log(`${c.green}✓ Approved rule: ${ruleId}${c.reset}`);
}

function rejectRule(ruleId) {
    const content = fs.readFileSync(autoRulesPath, 'utf8');
    const updated = content.replace(
        new RegExp(`(id:\\s*${ruleId}[\\s\\S]*?status:\\s*)pending`, 'm'),
        '$1rejected'
    );

    if (updated === content) {
        console.log(`${c.red}Rule ${ruleId} not found or already processed${c.reset}`);
        return;
    }

    fs.writeFileSync(autoRulesPath, updated);
    console.log(`${c.yellow}✓ Rejected rule: ${ruleId}${c.reset}`);
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--check') || args.includes('-c')) {
    const idx = args.findIndex(a => a === '--check' || a === '-c');
    const intent = args.slice(idx + 1).join(' ');
    if (intent) {
        runCheck(intent);
    } else {
        console.log(`${c.red}Error: --check requires an intent description${c.reset}`);
    }
} else if (args.includes('--list') || args.includes('-l')) {
    listRules();
} else if (args.includes('--approve')) {
    const idx = args.findIndex(a => a === '--approve');
    const ruleId = args[idx + 1];
    if (ruleId) {
        approveRule(ruleId);
    } else {
        console.log(`${c.red}Error: --approve requires a rule ID${c.reset}`);
    }
} else if (args.includes('--reject')) {
    const idx = args.findIndex(a => a === '--reject');
    const ruleId = args[idx + 1];
    if (ruleId) {
        rejectRule(ruleId);
    } else {
        console.log(`${c.red}Error: --reject requires a rule ID${c.reset}`);
    }
} else {
    console.log(`${c.cyan}pre_execution_check - Prevent known errors before they happen${c.reset}

${c.bold}Usage:${c.reset}
  node pre_execution_check.js --check "intent"    Check intent against rules
  node pre_execution_check.js --list              List all active rules
  node pre_execution_check.js --approve ID        Approve an auto-rule
  node pre_execution_check.js --reject ID         Reject an auto-rule

${c.bold}Examples:${c.reset}
  node pre_execution_check.js --check "create async function to fetch API"
  node pre_execution_check.js --check "complete task and notify user"
  node pre_execution_check.js --approve AUTO-IMPORT

${c.bold}Rule sources:${c.reset}
  • Built-in rules (7 core patterns)
  • Lessons from lessons-learned.json
  • Approved auto-rules from auto-rules.yaml

${c.bold}Output levels:${c.reset}
  STOP      - Critical violation, must address
  CAUTION   - High priority, should address
  TIP       - Best practice recommendation
`);
}

export { runCheck, checkIntent, generateAdvice, loadActiveRules };
