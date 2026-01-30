#!/usr/bin/env node
/**
 * Pattern Analyzer - Analyze errors and corrections to find patterns
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 2
 * 
 * Analyzes:
 * - Frequency of error types
 * - Common correction patterns
 * - Hot files/directories
 * - Time-based trends
 * 
 * Generates:
 * - Auto-rules for frequent patterns
 * - Insights for improvement
 * 
 * Usage:
 *   node pattern_analyzer.js --analyze
 *   node pattern_analyzer.js --rules
 *   node pattern_analyzer.js --insights
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
    magenta: '\x1b[35m',
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
const errorsPath = path.join(knowledgePath, 'detected-errors.json');
const correctionsPath = path.join(knowledgePath, 'user-corrections.json');
const lessonsPath = path.join(knowledgePath, 'lessons-learned.json');
const patternsPath = path.join(knowledgePath, 'patterns.json');
const autoRulesPath = path.join(knowledgePath, 'auto-rules.yaml');

// Load data files
function loadJson(filePath) {
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch { }
    return null;
}

function loadErrors() {
    const data = loadJson(errorsPath);
    return data?.errors || [];
}

function loadCorrections() {
    const data = loadJson(correctionsPath);
    return data?.corrections || [];
}

function loadLessons() {
    const data = loadJson(lessonsPath);
    return data?.lessons || [];
}

// ==================== PATTERN ANALYSIS ====================

/**
 * Analyze error patterns
 */
function analyzeErrorPatterns(errors) {
    const patterns = {
        byType: {},
        bySeverity: {},
        bySource: {},
        byFile: {},
        byHour: {},
        byDay: {}
    };

    for (const err of errors) {
        // By type
        patterns.byType[err.type] = (patterns.byType[err.type] || 0) + 1;

        // By severity
        patterns.bySeverity[err.severity] = (patterns.bySeverity[err.severity] || 0) + 1;

        // By source
        patterns.bySource[err.source] = (patterns.bySource[err.source] || 0) + 1;

        // By file (directory actually)
        if (err.file) {
            const dir = path.dirname(err.file);
            patterns.byFile[dir] = (patterns.byFile[dir] || 0) + 1;
        }

        // By hour of day
        if (err.timestamp) {
            const hour = new Date(err.timestamp).getHours();
            patterns.byHour[hour] = (patterns.byHour[hour] || 0) + 1;

            const day = new Date(err.timestamp).toISOString().split('T')[0];
            patterns.byDay[day] = (patterns.byDay[day] || 0) + 1;
        }
    }

    return patterns;
}

/**
 * Analyze correction patterns
 */
function analyzeCorrectionPatterns(corrections) {
    const patterns = {
        byCategory: {},
        byFile: {},
        bySeverity: {},
        byPattern: {}
    };

    for (const corr of corrections) {
        // By category
        patterns.byCategory[corr.category] = (patterns.byCategory[corr.category] || 0) + 1;

        // By file
        if (corr.file) {
            const dir = path.dirname(corr.file);
            patterns.byFile[dir] = (patterns.byFile[dir] || 0) + 1;
        }

        // By severity
        patterns.bySeverity[corr.severity] = (patterns.bySeverity[corr.severity] || 0) + 1;

        // By pattern name
        patterns.byPattern[corr.pattern] = (patterns.byPattern[corr.pattern] || 0) + 1;
    }

    return patterns;
}

/**
 * Find high-frequency patterns (candidates for auto-rules)
 */
function findHighFrequencyPatterns(errorPatterns, correctionPatterns) {
    const threshold = 3; // Minimum occurrences to be considered high-frequency
    const highFrequency = [];

    // Error patterns
    for (const [type, count] of Object.entries(errorPatterns.byType)) {
        if (count >= threshold) {
            highFrequency.push({
                source: 'errors',
                type: type,
                count: count,
                severity: 'HIGH',
                suggestedRule: generateRuleForError(type, count)
            });
        }
    }

    // Correction patterns
    for (const [pattern, count] of Object.entries(correctionPatterns.byPattern)) {
        if (count >= threshold) {
            highFrequency.push({
                source: 'corrections',
                type: pattern,
                count: count,
                severity: 'HIGH',
                suggestedRule: generateRuleForCorrection(pattern, count)
            });
        }
    }

    // Category patterns
    for (const [category, count] of Object.entries(correctionPatterns.byCategory)) {
        if (count >= threshold) {
            highFrequency.push({
                source: 'corrections',
                type: `category:${category}`,
                count: count,
                severity: 'MEDIUM',
                suggestedRule: generateRuleForCategory(category, count)
            });
        }
    }

    return highFrequency.sort((a, b) => b.count - a.count);
}

/**
 * Generate rule for error type
 */
function generateRuleForError(type, count) {
    const rules = {
        'test': {
            id: 'AUTO-TEST',
            name: 'Ensure tests pass before completion',
            check: 'Run npm test before notify_user',
            prevention: 'Always verify test suite passes'
        },
        'build': {
            id: 'AUTO-BUILD',
            name: 'Ensure TypeScript compiles',
            check: 'Run npx tsc --noEmit before completion',
            prevention: 'Check for type errors before proceeding'
        },
        'lint': {
            id: 'AUTO-LINT',
            name: 'Fix linting issues',
            check: 'Run npm run lint before completion',
            prevention: 'Follow ESLint rules strictly'
        },
        'pattern': {
            id: 'AUTO-PATTERN',
            name: 'Avoid anti-patterns',
            check: 'Scan for console.error, empty catch',
            prevention: 'Use proper error handling'
        }
    };

    return rules[type] || {
        id: `AUTO-${type.toUpperCase()}`,
        name: `Address ${type} issues`,
        check: `Monitor ${type} errors`,
        prevention: `Reduce ${type} error frequency (currently ${count})`
    };
}

/**
 * Generate rule for correction pattern
 */
function generateRuleForCorrection(pattern, count) {
    const rules = {
        'import_path_fix': {
            id: 'AUTO-IMPORT',
            name: 'Use correct import paths',
            check: 'Verify import paths exist before writing',
            prevention: 'Use relative imports from project root, check tsconfig paths'
        },
        'type_annotation_fix': {
            id: 'AUTO-TYPE',
            name: 'Add explicit type annotations',
            check: 'Ensure function params and returns have types',
            prevention: 'Always add TypeScript types, avoid any'
        },
        'null_check_added': {
            id: 'AUTO-NULL',
            name: 'Handle null/undefined',
            check: 'Use optional chaining and nullish coalescing',
            prevention: 'Always handle potential null values with ?. and ??'
        },
        'async_await_fix': {
            id: 'AUTO-ASYNC',
            name: 'Proper async/await usage',
            check: 'Verify async functions are awaited',
            prevention: 'Never forget await, don\'t mix callbacks and promises'
        },
        'error_handling_added': {
            id: 'AUTO-ERROR',
            name: 'Add error handling',
            check: 'Wrap async operations in try/catch',
            prevention: 'Always handle errors, never use empty catch'
        }
    };

    return rules[pattern] || {
        id: `AUTO-${pattern.toUpperCase().replace(/_/g, '-')}`,
        name: `Fix ${pattern.replace(/_/g, ' ')}`,
        check: `Monitor for ${pattern} issues`,
        prevention: `Reduce ${pattern} corrections (currently ${count})`
    };
}

/**
 * Generate rule for category
 */
function generateRuleForCategory(category, count) {
    const categoryRules = {
        'imports': 'Double-check all import paths before writing code',
        'types': 'Add explicit TypeScript types to all functions',
        'null-safety': 'Use optional chaining (?.) and nullish coalescing (??)',
        'async': 'Always use async/await, never mix with callbacks',
        'error-handling': 'Wrap all async operations in try/catch',
        'naming': 'Follow naming conventions: camelCase for vars, PascalCase for types',
        'logic': 'Review conditional logic and add edge case tests'
    };

    return {
        id: `AUTO-CAT-${category.toUpperCase()}`,
        name: `${category} best practices`,
        check: `Review ${category} patterns`,
        prevention: categoryRules[category] || `Follow ${category} best practices`
    };
}

// ==================== AUTO-RULES GENERATION ====================

/**
 * Generate auto-rules YAML file
 */
function generateAutoRules(highFrequencyPatterns) {
    const existingLessons = loadLessons();
    const existingPatterns = existingLessons.map(l => l.pattern);

    // Filter out patterns that already have lessons
    const newPatterns = highFrequencyPatterns.filter(p =>
        !existingPatterns.some(existing => existing.includes(p.type))
    );

    const yaml = `# Auto-Generated Rules
# Generated: ${new Date().toISOString()}
# Based on: ${highFrequencyPatterns.length} high-frequency patterns
# New rules: ${newPatterns.length}

# These rules are auto-generated from error and correction patterns.
# Review and move approved rules to lessons-learned.yaml

rules:
${newPatterns.map(p => `
  - id: ${p.suggestedRule.id}
    source: ${p.source}
    pattern: "${p.type}"
    frequency: ${p.count}
    severity: ${p.severity}
    name: "${p.suggestedRule.name}"
    check: "${p.suggestedRule.check}"
    prevention: "${p.suggestedRule.prevention}"
    status: pending  # pending | approved | rejected
    created: "${new Date().toISOString()}"
`).join('')}
`;

    fs.writeFileSync(autoRulesPath, yaml);
    return newPatterns;
}

/**
 * Save patterns analysis to JSON
 */
function savePatterns(errorPatterns, correctionPatterns, highFrequency) {
    const data = {
        _comment: "Pattern analysis from error_sensor and user_correction_sensor",
        analyzedAt: new Date().toISOString(),
        errors: errorPatterns,
        corrections: correctionPatterns,
        highFrequency: highFrequency.map(p => ({
            type: p.type,
            count: p.count,
            source: p.source,
            suggestedRuleId: p.suggestedRule.id
        }))
    };

    fs.writeFileSync(patternsPath, JSON.stringify(data, null, 2));
}

// ==================== INSIGHTS ====================

/**
 * Generate insights from patterns
 */
function generateInsights(errorPatterns, correctionPatterns, highFrequency) {
    const insights = [];

    // Insight 1: Most common error type
    const topError = Object.entries(errorPatterns.byType).sort((a, b) => b[1] - a[1])[0];
    if (topError) {
        insights.push({
            type: 'error_hotspot',
            title: 'Most Common Error Type',
            message: `"${topError[0]}" errors occur most frequently (${topError[1]} times)`,
            recommendation: `Focus on reducing ${topError[0]} errors first`,
            severity: 'HIGH'
        });
    }

    // Insight 2: Most corrected category
    const topCorrection = Object.entries(correctionPatterns.byCategory).sort((a, b) => b[1] - a[1])[0];
    if (topCorrection) {
        insights.push({
            type: 'correction_hotspot',
            title: 'Most Corrected Category',
            message: `"${topCorrection[0]}" corrections happen most often (${topCorrection[1]} times)`,
            recommendation: `AI should pay more attention to ${topCorrection[0]}`,
            severity: 'HIGH'
        });
    }

    // Insight 3: Hot directories
    const allFiles = { ...errorPatterns.byFile, ...correctionPatterns.byFile };
    const topDir = Object.entries(allFiles).sort((a, b) => b[1] - a[1])[0];
    if (topDir) {
        insights.push({
            type: 'hot_directory',
            title: 'Hot Directory',
            message: `"${topDir[0]}" has the most issues (${topDir[1]} combined)`,
            recommendation: `Extra care needed when modifying files in ${topDir[0]}`,
            severity: 'MEDIUM'
        });
    }

    // Insight 4: Rule candidates
    const ruleCandidates = highFrequency.filter(p => p.count >= 5);
    if (ruleCandidates.length > 0) {
        insights.push({
            type: 'rule_candidates',
            title: 'Strong Rule Candidates',
            message: `${ruleCandidates.length} patterns occurred 5+ times`,
            recommendation: `Consider promoting these to permanent rules: ${ruleCandidates.map(r => r.type).join(', ')}`,
            severity: 'HIGH'
        });
    }

    // Insight 5: Peak error hours
    const peakHour = Object.entries(errorPatterns.byHour).sort((a, b) => b[1] - a[1])[0];
    if (peakHour) {
        insights.push({
            type: 'peak_hours',
            title: 'Peak Error Time',
            message: `Most errors occur around ${peakHour[0]}:00 (${peakHour[1]} errors)`,
            recommendation: 'Consider taking breaks or extra care during this time',
            severity: 'LOW'
        });
    }

    return insights;
}

// ==================== MAIN ====================

function runAnalysis() {
    console.log(`${c.cyan}📊 Pattern Analyzer${c.reset}\n`);

    const errors = loadErrors();
    const corrections = loadCorrections();

    console.log(`${c.gray}Data loaded:${c.reset}`);
    console.log(`  Errors: ${errors.length}`);
    console.log(`  Corrections: ${corrections.length}\n`);

    if (errors.length === 0 && corrections.length === 0) {
        console.log(`${c.yellow}No data to analyze.${c.reset}`);
        console.log(`${c.gray}Run error_sensor.js and user_correction_sensor.js first.${c.reset}`);
        return;
    }

    // Analyze patterns
    const errorPatterns = analyzeErrorPatterns(errors);
    const correctionPatterns = analyzeCorrectionPatterns(corrections);
    const highFrequency = findHighFrequencyPatterns(errorPatterns, correctionPatterns);

    // Save analysis
    savePatterns(errorPatterns, correctionPatterns, highFrequency);

    console.log(`${c.cyan}════════════════════════════════════════${c.reset}`);
    console.log(`${c.bold}Analysis Complete${c.reset}\n`);

    // Error patterns
    console.log(`${c.bold}Error Patterns:${c.reset}`);
    for (const [type, count] of Object.entries(errorPatterns.byType).sort((a, b) => b[1] - a[1])) {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(`  ${type.padEnd(12)} ${c.red}${bar}${c.reset} ${count}`);
    }

    // Correction patterns
    console.log(`\n${c.bold}Correction Patterns:${c.reset}`);
    for (const [cat, count] of Object.entries(correctionPatterns.byCategory).sort((a, b) => b[1] - a[1])) {
        const bar = '█'.repeat(Math.min(count, 20));
        console.log(`  ${cat.padEnd(15)} ${c.blue}${bar}${c.reset} ${count}`);
    }

    // High frequency
    if (highFrequency.length > 0) {
        console.log(`\n${c.bold}${c.yellow}⚠️  High-Frequency Patterns (candidates for rules):${c.reset}`);
        for (const p of highFrequency.slice(0, 5)) {
            console.log(`  ${c.yellow}●${c.reset} ${p.type}: ${p.count} times → ${p.suggestedRule.id}`);
        }
    }

    console.log(`\n${c.gray}Saved to: ${patternsPath}${c.reset}`);
}

function generateRules() {
    console.log(`${c.cyan}🔧 Generating Auto-Rules${c.reset}\n`);

    const errors = loadErrors();
    const corrections = loadCorrections();

    const errorPatterns = analyzeErrorPatterns(errors);
    const correctionPatterns = analyzeCorrectionPatterns(corrections);
    const highFrequency = findHighFrequencyPatterns(errorPatterns, correctionPatterns);

    if (highFrequency.length === 0) {
        console.log(`${c.yellow}No high-frequency patterns found.${c.reset}`);
        console.log(`${c.gray}Need at least 3 occurrences of a pattern.${c.reset}`);
        return;
    }

    const newRules = generateAutoRules(highFrequency);

    console.log(`${c.green}✓ Generated ${newRules.length} auto-rules${c.reset}`);
    console.log(`${c.gray}Saved to: ${autoRulesPath}${c.reset}\n`);

    console.log(`${c.bold}Generated Rules:${c.reset}`);
    for (const rule of newRules) {
        console.log(`  ${c.cyan}${rule.suggestedRule.id}${c.reset}: ${rule.suggestedRule.name}`);
        console.log(`    ${c.gray}Prevention: ${rule.suggestedRule.prevention}${c.reset}`);
    }

    console.log(`\n${c.yellow}Note: Review and approve rules in auto-rules.yaml${c.reset}`);
}

function showInsights() {
    console.log(`${c.cyan}💡 Pattern Insights${c.reset}\n`);

    const errors = loadErrors();
    const corrections = loadCorrections();

    const errorPatterns = analyzeErrorPatterns(errors);
    const correctionPatterns = analyzeCorrectionPatterns(corrections);
    const highFrequency = findHighFrequencyPatterns(errorPatterns, correctionPatterns);

    const insights = generateInsights(errorPatterns, correctionPatterns, highFrequency);

    if (insights.length === 0) {
        console.log(`${c.yellow}Not enough data for insights.${c.reset}`);
        return;
    }

    for (const insight of insights) {
        const sevColor = { HIGH: c.red, MEDIUM: c.yellow, LOW: c.gray }[insight.severity];
        console.log(`${c.bold}${insight.title}${c.reset} ${sevColor}[${insight.severity}]${c.reset}`);
        console.log(`  ${insight.message}`);
        console.log(`  ${c.green}→ ${insight.recommendation}${c.reset}\n`);
    }
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--analyze') || args.includes('-a')) {
    runAnalysis();
} else if (args.includes('--rules') || args.includes('-r')) {
    generateRules();
} else if (args.includes('--insights') || args.includes('-i')) {
    showInsights();
} else {
    console.log(`${c.cyan}pattern_analyzer - Analyze patterns and generate rules${c.reset}

${c.bold}Usage:${c.reset}
  node pattern_analyzer.js --analyze     Analyze error and correction patterns
  node pattern_analyzer.js --rules       Generate auto-rules from patterns
  node pattern_analyzer.js --insights    Show insights and recommendations

${c.bold}Input files:${c.reset}
  .agent/knowledge/detected-errors.json      (from error_sensor)
  .agent/knowledge/user-corrections.json     (from correction_sensor)

${c.bold}Output files:${c.reset}
  .agent/knowledge/patterns.json             Analysis results
  .agent/knowledge/auto-rules.yaml           Generated rules

${c.bold}Example workflow:${c.reset}
  1. Run error_sensor.js --scan all
  2. Run user_correction_sensor.js --scan
  3. Run pattern_analyzer.js --analyze
  4. Run pattern_analyzer.js --rules
  5. Review auto-rules.yaml and approve
`);
}

export { runAnalysis, analyzeErrorPatterns, analyzeCorrectionPatterns, findHighFrequencyPatterns, generateInsights };
