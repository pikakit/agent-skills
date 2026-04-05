#!/usr/bin/env node
// @ts-nocheck
/**
 * UX Audit v2.0.0
 * Skill: design-system
 *
 * Comprehensive User Experience analysis based on UX psychology laws.
 *
 * Usage:
 *   node ux_audit.js <project_path>
 *   node ux_audit.js <project_path> --json
 *
 * Categories:
 *   - Hick's Law (decision complexity)
 *   - Fitts' Law (target accessibility)
 *   - Emotional Design (feedback, personalization)
 *   - Trust Building (security signals, social proof)
 *   - Cognitive Load (text density, form complexity)
 *   - Visual System (font size, spacing)
 *
 * Score:
 *   100 = no issues, -5 per issue, pass >= 70
 *
 * Flags:
 *   --json     Output as JSON only
 *   --help     Show help
 *   --version  Show version
 */

import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const VERSION = '2.0.0';
const SKIP_DIRS = new Set([
    'node_modules', '.next', 'dist', 'build', '.git',
    '__pycache__', '.vscode', 'coverage',
]);
const VALID_EXTS = new Set(['.html', '.jsx', '.tsx', '.vue']);
const MAX_FILES = 50;

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const filteredArgs = args.filter(a => !a.startsWith('--'));

function showHelp() {
    console.log(`UX Audit v${VERSION}

Usage: node ux_audit.js <project_path> [options]

Options:
  --json       Output as JSON only
  --help       Show this help
  --version    Show version

Categories: Hick's Law, Fitts' Law, Emotional Design, Trust, Cognitive Load, Visual System
Score: 100 - (issues × 5), pass >= 70`);
}

// --- File Discovery ---

async function walkFiles(dir, files = [], depth = 0) {
    if (depth > 8 || files.length >= MAX_FILES) return files;

    let entries;
    try {
        entries = await readdir(dir, { withFileTypes: true });
    } catch (err) {
        if (!jsonMode) console.warn(`[WARN] Cannot read: ${dir} (${err.code})`);
        return files;
    }

    for (const entry of entries) {
        if (SKIP_DIRS.has(entry.name) || files.length >= MAX_FILES) continue;
        const fullPath = resolve(dir, entry.name);

        if (entry.isDirectory()) {
            await walkFiles(fullPath, files, depth + 1);
        } else if (VALID_EXTS.has(extname(entry.name).toLowerCase())) {
            files.push(fullPath);
        }
    }
    return files;
}

// --- UX Auditor ---

class UXAuditor {
    constructor() {
        this.issues = [];
        this.passed = [];
    }

    async auditFile(filePath) {
        let content;
        try {
            content = await readFile(filePath, 'utf-8');
        } catch (err) {
            this.issues.push({ file: filePath.split(/[/\\]/).pop(), rule: 'FILE_READ', severity: 'error', message: err.message });
            return;
        }

        const fileName = filePath.split(/[/\\]/).pop();
        this.checkHicksLaw(content, fileName);
        this.checkFittsLaw(content, fileName);
        this.checkEmotionalDesign(content, fileName);
        this.checkTrustBuilding(content, fileName);
        this.checkCognitiveLoad(content, fileName);
        this.checkVisualSystem(content, fileName);
    }

    checkHicksLaw(content, fileName) {
        // Too many buttons increase decision time
        const buttonCount = (content.match(/<button/gi) || []).length;
        if (buttonCount > 7) {
            this.issues.push({
                file: fileName, rule: 'UX_HICKS_BUTTONS', severity: 'warning',
                message: `${buttonCount} buttons may overwhelm users (Hick's Law: target <7)`,
            });
        } else if (buttonCount > 0) {
            this.passed.push({ file: fileName, check: `Hick's Law: ${buttonCount} buttons (acceptable)` });
        }

        // Too many navigation items
        const navItems = (content.match(/<li[^>]*>/gi) || []).length;
        if (navItems > 10) {
            this.issues.push({
                file: fileName, rule: 'UX_HICKS_NAV', severity: 'warning',
                message: `${navItems} nav items — consider grouping (Hick's Law)`,
            });
        }
    }

    checkFittsLaw(content, fileName) {
        // Small touch targets
        const smallPatterns = [
            /class="[^"]*btn-xs/i,
            /class="[^"]*btn-sm/i,
            /width:\s*(1[0-9]|[0-9])px/,
            /height:\s*(1[0-9]|[0-9])px/,
        ];

        for (const pattern of smallPatterns) {
            if (pattern.test(content)) {
                this.issues.push({
                    file: fileName, rule: 'UX_FITTS_SMALL_TARGET', severity: 'warning',
                    message: "Small click target detected — min 44px recommended (Fitts' Law)",
                });
                break;
            }
        }

        // Icon-only buttons without labels
        const iconButtons = content.match(/<button[^>]*>[\s\n]*<(svg|icon|i)\b[^>]*>[\s\S]*?<\/button>/gi);
        if (iconButtons && iconButtons.length > 0) {
            // Check if any lack aria-label
            const noLabel = iconButtons.some(b => !b.toLowerCase().includes('aria-label'));
            if (noLabel) {
                this.issues.push({
                    file: fileName, rule: 'UX_FITTS_ICON_ONLY', severity: 'warning',
                    message: "Icon-only button without aria-label — add text or label (Fitts' Law)",
                });
            }
        }
    }

    checkEmotionalDesign(content, fileName) {
        // Positive feedback words
        const feedbackWords = ['success', 'congratulations', 'well done', 'great', 'thank you'];
        if (feedbackWords.some(w => content.toLowerCase().includes(w))) {
            this.passed.push({ file: fileName, check: 'Emotional: Positive feedback present' });
        }

        // User personalization
        if (content.includes('{user') || content.includes('{{name') || content.includes('{name}')) {
            this.passed.push({ file: fileName, check: 'Emotional: Personalization detected' });
        }

        // Progress indicators
        if (content.toLowerCase().includes('progress') || content.toLowerCase().includes('stepper')) {
            this.passed.push({ file: fileName, check: 'Emotional: Progress indicator present' });
        }
    }

    checkTrustBuilding(content, fileName) {
        const trustPatterns = [
            /https:/i, /ssl|tls/i, /secure/i, /privacy/i,
            /testimonial/i, /review/i, /rating/i,
            /guarantee/i, /refund/i, /support/i,
        ];

        const trustSignals = trustPatterns.filter(p => p.test(content)).length;
        if (trustSignals >= 2) {
            this.passed.push({ file: fileName, check: `Trust: ${trustSignals} trust signals found` });
        }

        // Form without security indicators
        if (content.includes('<form')) {
            const hasSecurityHint = content.toLowerCase().includes('secure')
                || content.toLowerCase().includes('encrypt')
                || content.includes('🔒');
            if (!hasSecurityHint) {
                this.issues.push({
                    file: fileName, rule: 'UX_TRUST_FORM', severity: 'warning',
                    message: 'Form without security indicators (add 🔒 or "Secure" label)',
                });
            }
        }
    }

    checkCognitiveLoad(content, fileName) {
        // Long text blocks
        const longParagraphs = content.match(/<p[^>]*>[^<]{500,}<\/p>/gi);
        if (longParagraphs && longParagraphs.length > 0) {
            this.issues.push({
                file: fileName, rule: 'UX_COGNITIVE_LONG_TEXT', severity: 'warning',
                message: 'Long paragraphs (>500 chars) — break into smaller chunks (Miller\'s Law)',
            });
        }

        // Complex forms
        const inputCount = (content.match(/<input/gi) || []).length;
        if (inputCount > 10) {
            this.issues.push({
                file: fileName, rule: 'UX_COGNITIVE_FORM', severity: 'warning',
                message: `${inputCount} inputs in form — consider multi-step wizard (Cognitive Load)`,
            });
        }

        // Large content without headings
        const headings = (content.match(/<h[1-6]/gi) || []).length;
        if (content.length > 2000 && headings < 2) {
            this.issues.push({
                file: fileName, rule: 'UX_COGNITIVE_NO_HIERARCHY', severity: 'warning',
                message: 'Large content without heading hierarchy — add headings for scanability',
            });
        }
    }

    checkVisualSystem(content, fileName) {
        // Too-small font sizes
        const smallFonts = content.match(/font-size:\s*([0-9.]+)rem/gi);
        if (smallFonts) {
            const tooSmall = smallFonts.some(f => {
                const size = parseFloat(f.match(/([0-9.]+)/)[1]);
                return size < 0.75;
            });
            if (tooSmall) {
                this.issues.push({
                    file: fileName, rule: 'UX_VISUAL_FONT_SIZE', severity: 'warning',
                    message: 'Font size <0.75rem may be too small for readability',
                });
            }
        }

        // Low contrast colors (basic heuristic)
        const lightGrayText = /color:\s*#[c-f][c-f][c-f]/i.test(content);
        if (lightGrayText) {
            this.issues.push({
                file: fileName, rule: 'UX_VISUAL_LOW_CONTRAST', severity: 'warning',
                message: 'Potential low-contrast text color detected — check WCAG 4.5:1 ratio',
            });
        }
    }

    getReport() {
        const errorCount = this.issues.filter(i => i.severity === 'error').length;
        const warningCount = this.issues.filter(i => i.severity === 'warning').length;
        const score = Math.max(0, 100 - (errorCount * 10) - (warningCount * 5));

        return {
            issues: this.issues,
            passed: this.passed,
            errors: errorCount,
            warnings: warningCount,
            score,
            passed_threshold: score >= 70,
        };
    }
}

// --- Main ---

async function main() {
    if (args.includes('--version')) { console.log(VERSION); return; }
    if (args.includes('--help') || filteredArgs.length === 0) { showHelp(); return; }

    const projectPath = resolve(filteredArgs[0]);

    if (!jsonMode) {
        console.log('\n' + '='.repeat(60));
        console.log(`  UX AUDIT v${VERSION} — User Experience Analysis`);
        console.log('='.repeat(60));
        console.log(`Project: ${projectPath}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log('-'.repeat(60));
    }

    const files = await walkFiles(projectPath);
    const auditor = new UXAuditor();

    for (const filePath of files) {
        await auditor.auditFile(filePath);
    }

    const report = auditor.getReport();

    if (!jsonMode) {
        console.log(`\nAnalyzed ${files.length} file(s)`);
        console.log('\n' + '='.repeat(60));

        if (report.issues.length > 0) {
            console.log('ISSUES:');
            for (const item of report.issues.slice(0, 15)) {
                const icon = item.severity === 'error' ? '[ERROR]' : '[WARN]';
                console.log(`  ${icon} ${item.file}: ${item.rule} — ${item.message}`);
            }
            if (report.issues.length > 15) {
                console.log(`  ... and ${report.issues.length - 15} more`);
            }
        }

        if (report.passed.length > 0) {
            console.log('\nPASSED:');
            for (const item of report.passed.slice(0, 10)) {
                console.log(`  [OK] ${item.file}: ${item.check}`);
            }
            if (report.passed.length > 10) {
                console.log(`  ... and ${report.passed.length - 10} more`);
            }
        }

        console.log(`\nSCORE: ${report.score}/100 | ${report.passed_threshold ? 'PASSED' : 'FAILED'}`);
        console.log('='.repeat(60));
    }

    const output = {
        script: 'ux_audit',
        version: VERSION,
        project: projectPath,
        files_analyzed: files.length,
        errors: report.errors,
        warnings: report.warnings,
        passed_checks: report.passed.length,
        score: report.score,
        passed: report.passed_threshold,
        issues: report.issues,
    };

    console.log('\n' + JSON.stringify(output, null, 2));
    process.exit(report.passed_threshold ? 0 : 1);
}

main().catch(err => {
    console.error(jsonMode ? JSON.stringify({ status: 'error', message: err.message }) : `[FATAL] ${err.message}`);
    process.exit(1);
});
