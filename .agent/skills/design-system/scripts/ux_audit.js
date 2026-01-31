#!/usr/bin/env node
/**
 * UX Audit - Comprehensive User Experience Analysis
 * Checks for psychological principles, emotional design, and cognitive load.
 * 
 * Categories:
 * - Hick's Law (decision complexity)
 * - Fitts' Law (target accessibility)
 * - Emotional Design
 * - Trust Building
 * - Cognitive Load
 * - Visual/Color Systems
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set([
    'node_modules', '.next', 'dist', 'build', '.git',
    '__pycache__', '.vscode', 'coverage', 'test', 'tests'
]);

class UXAuditor {
    constructor() {
        this.issues = [];
        this.passed = [];
    }

    auditFile(filePath) {
        try {
            const content = readFileSync(filePath, 'utf-8');
            const fileName = filePath.split(/[/\\]/).pop();

            this.checkHicksLaw(content, fileName);
            this.checkFittsLaw(content, fileName);
            this.checkEmotionalDesign(content, fileName);
            this.checkTrustBuilding(content, fileName);
            this.checkCognitiveLoad(content, fileName);
            this.checkVisualSystem(content, fileName);

        } catch (e) {
            this.issues.push({ file: filePath, issue: `Error: ${e.message}` });
        }
    }

    checkHicksLaw(content, fileName) {
        // Too many options increase decision time
        const buttonCount = (content.match(/<button/gi) || []).length;
        const linkCount = (content.match(/<a\s/gi) || []).length;
        const selectCount = (content.match(/<select/gi) || []).length;

        if (buttonCount > 7) {
            this.issues.push({ file: fileName, issue: `Hick's Law: ${buttonCount} buttons may overwhelm users (target: <7)` });
        } else if (buttonCount > 0) {
            this.passed.push({ file: fileName, check: `Hick's Law: ${buttonCount} buttons (acceptable)` });
        }

        // Check for mega menus / too many nav items
        const navItems = (content.match(/<li[^>]*>/gi) || []).length;
        if (navItems > 10) {
            this.issues.push({ file: fileName, issue: `Hick's Law: ${navItems} nav items - consider grouping` });
        }
    }

    checkFittsLaw(content, fileName) {
        // Small touch targets
        const smallButtonPatterns = [
            /class="[^"]*btn-xs/i,
            /class="[^"]*btn-sm/i,
            /width:\s*(1[0-9]|[0-9])px/,
            /height:\s*(1[0-9]|[0-9])px/
        ];

        for (const pattern of smallButtonPatterns) {
            if (pattern.test(content)) {
                this.issues.push({ file: fileName, issue: "Fitts' Law: Small click target detected (<44px recommended)" });
                break;
            }
        }

        // Icons without labels
        const iconButtons = content.match(/<button[^>]*>[\s\n]*<(svg|icon|i)[^>]*>[\s\n]*<\/button>/gi);
        if (iconButtons && iconButtons.length > 0) {
            this.issues.push({ file: fileName, issue: "Fitts' Law: Icon-only buttons - add text labels for clarity" });
        }
    }

    checkEmotionalDesign(content, fileName) {
        // Positive feedback
        const feedbackPatterns = ['success', 'congratulations', 'well done', 'great', 'thank you'];
        const hasFeedback = feedbackPatterns.some(p => content.toLowerCase().includes(p));

        if (hasFeedback) {
            this.passed.push({ file: fileName, check: 'Emotional: Positive feedback present' });
        }

        // User personalization
        if (content.includes('{user') || content.includes('{{name')) {
            this.passed.push({ file: fileName, check: 'Emotional: Personalization detected' });
        }

        // Progress indicators
        if (content.toLowerCase().includes('progress') || content.includes('step')) {
            this.passed.push({ file: fileName, check: 'Emotional: Progress indicator present' });
        }
    }

    checkTrustBuilding(content, fileName) {
        // Trust signals
        const trustPatterns = [
            /https:/i, /ssl|tls/i, /secure/i, /privacy/i,
            /testimonial/i, /review/i, /rating/i,
            /guarantee/i, /refund/i, /support/i
        ];

        const trustSignals = trustPatterns.filter(p => p.test(content)).length;
        if (trustSignals >= 2) {
            this.passed.push({ file: fileName, check: `Trust: ${trustSignals} trust signals found` });
        }

        // Form security indicators
        if (content.includes('<form')) {
            if (!content.toLowerCase().includes('secure') && !content.includes('https')) {
                this.issues.push({ file: fileName, issue: 'Trust: Form without security indicators' });
            }
        }
    }

    checkCognitiveLoad(content, fileName) {
        // Long text blocks
        const paragraphs = content.match(/<p[^>]*>([^<]{500,})<\/p>/gi);
        if (paragraphs && paragraphs.length > 0) {
            this.issues.push({ file: fileName, issue: 'Cognitive: Long paragraphs (>500 chars) - break into smaller chunks' });
        }

        // Complex forms
        const inputCount = (content.match(/<input/gi) || []).length;
        if (inputCount > 10) {
            this.issues.push({ file: fileName, issue: `Cognitive: ${inputCount} inputs in form - consider multi-step` });
        }

        // Visual hierarchy
        const headings = (content.match(/<h[1-6]/gi) || []).length;
        if (content.length > 2000 && headings < 2) {
            this.issues.push({ file: fileName, issue: 'Cognitive: Large content without heading hierarchy' });
        }
    }

    checkVisualSystem(content, fileName) {
        // Color contrast (basic check)
        const lowContrastPatterns = [
            /#[a-f0-9]{6}/gi, // Check for colors
            /color:\s*gray/i,
            /color:\s*#[89a-f]/i
        ];

        // Font sizes
        const smallFonts = content.match(/font-size:\s*(0?\.[0-9]+|[0-9])rem/gi);
        if (smallFonts) {
            const tooSmall = smallFonts.some(f => {
                const size = parseFloat(f.match(/([0-9.]+)/)[1]);
                return size < 0.75;
            });
            if (tooSmall) {
                this.issues.push({ file: fileName, issue: 'Visual: Font size <0.75rem may be too small' });
            }
        }

        // Spacing consistency
        if (content.includes('margin') || content.includes('padding')) {
            this.passed.push({ file: fileName, check: 'Visual: Spacing system in use' });
        }
    }

    getReport() {
        return {
            issues: this.issues,
            passed: this.passed,
            score: this.issues.length === 0 ? 100 :
                Math.max(0, 100 - (this.issues.length * 5))
        };
    }
}

function walkFiles(dir, callback) {
    try {
        const entries = readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue;
            const fullPath = resolve(dir, entry.name);
            if (entry.isDirectory()) {
                walkFiles(fullPath, callback);
            } else {
                const ext = extname(entry.name).toLowerCase();
                if (['.html', '.jsx', '.tsx', '.vue'].includes(ext)) {
                    callback(fullPath);
                }
            }
        }
    } catch { /* ignore */ }
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  UX AUDIT - User Experience Analysis');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    const auditor = new UXAuditor();
    let fileCount = 0;

    walkFiles(projectPath, (filePath) => {
        if (fileCount < 50) {
            auditor.auditFile(filePath);
            fileCount++;
        }
    });

    const report = auditor.getReport();

    console.log(`\nAnalyzed ${fileCount} files`);
    console.log('\n' + '='.repeat(60));
    console.log('UX AUDIT RESULTS');
    console.log('='.repeat(60));

    if (report.issues.length > 0) {
        console.log('\nISSUES FOUND:');
        for (const item of report.issues.slice(0, 15)) {
            console.log(`  [!] ${item.file}: ${item.issue}`);
        }
        if (report.issues.length > 15) {
            console.log(`  ... and ${report.issues.length - 15} more issues`);
        }
    }

    if (report.passed.length > 0) {
        console.log('\nPASSED CHECKS:');
        for (const item of report.passed.slice(0, 10)) {
            console.log(`  [OK] ${item.file}: ${item.check}`);
        }
        if (report.passed.length > 10) {
            console.log(`  ... and ${report.passed.length - 10} more passed`);
        }
    }

    console.log(`\nUX SCORE: ${report.score}/100`);

    const output = {
        script: 'ux_audit',
        project: projectPath,
        files_analyzed: fileCount,
        issues_found: report.issues.length,
        passed_checks: report.passed.length,
        score: report.score,
        passed: report.score >= 70
    };

    console.log('\n' + JSON.stringify(output, null, 2));
    process.exit(report.score >= 70 ? 0 : 1);
}

main();
