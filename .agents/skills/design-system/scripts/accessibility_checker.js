#!/usr/bin/env node
/**
 * Accessibility Checker - WCAG compliance audit
 * Checks HTML/JSX/TSX files for accessibility issues.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git']);

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
                if (['.html', '.jsx', '.tsx'].includes(ext)) {
                    callback(fullPath);
                }
            }
        }
    } catch { /* ignore */ }
}

function checkAccessibility(filePath) {
    const issues = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        // Inputs without labels
        const inputs = content.match(/<input[^>]*>/gi) || [];
        for (const inp of inputs) {
            if (!inp.toLowerCase().includes('type="hidden"')) {
                if (!inp.toLowerCase().includes('aria-label') && !inp.includes('id=')) {
                    issues.push('Input without label or aria-label');
                    break;
                }
            }
        }

        // Buttons without accessible text
        const buttons = content.match(/<button[^>]*>[^<]*<\/button>/gi) || [];
        for (const btn of buttons) {
            if (!btn.toLowerCase().includes('aria-label')) {
                const text = btn.replace(/<[^>]+>/g, '');
                if (!text.trim()) {
                    issues.push('Button without accessible text');
                    break;
                }
            }
        }

        // Missing lang attribute
        if (content.toLowerCase().includes('<html') && !content.toLowerCase().includes('lang=')) {
            issues.push('Missing lang attribute on <html>');
        }

        // Missing skip link
        if (content.toLowerCase().includes('<main') || content.toLowerCase().includes('<body')) {
            if (!content.toLowerCase().includes('skip') && !content.includes('#main')) {
                issues.push('Consider adding skip-to-main-content link');
            }
        }

        // onClick without keyboard support
        const onclickCount = (content.toLowerCase().match(/onclick=/g) || []).length;
        const onkeydownCount = (content.toLowerCase().match(/onkeydown=|onkeyup=/g) || []).length;
        if (onclickCount > 0 && onkeydownCount === 0) {
            issues.push('onClick without keyboard handler (onKeyDown)');
        }

        // Positive tabIndex
        const positiveTabindex = content.match(/tabindex="([1-9]\d*)"/gi);
        if (positiveTabindex) {
            issues.push('Avoid positive tabIndex values');
        }

        // Autoplay without muted
        if (content.toLowerCase().includes('autoplay') && !content.toLowerCase().includes('muted')) {
            issues.push('Autoplay media should be muted');
        }

        // role="button" without tabindex
        const divButtons = content.match(/<div[^>]*role="button"[^>]*>/gi) || [];
        for (const div of divButtons) {
            if (!div.toLowerCase().includes('tabindex')) {
                issues.push("role='button' without tabindex");
                break;
            }
        }

    } catch (e) {
        issues.push(`Error reading file: ${e.message.slice(0, 50)}`);
    }

    return issues;
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log(`\n${'='.repeat(60)}`);
    console.log('[ACCESSIBILITY CHECKER] WCAG Compliance Audit');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    const files = [];
    walkFiles(projectPath, (f) => files.push(f));
    console.log(`Found ${files.length} HTML/JSX/TSX files`);

    if (files.length === 0) {
        const output = {
            script: 'accessibility_checker',
            project: projectPath,
            files_checked: 0,
            issues_found: 0,
            passed: true,
            message: 'No HTML files found'
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    const allIssues = [];

    for (const f of files.slice(0, 50)) {
        const issues = checkAccessibility(f);
        if (issues.length > 0) {
            allIssues.push({
                file: f.split(/[/\\]/).pop(),
                issues: issues
            });
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log('ACCESSIBILITY ISSUES');
    console.log('='.repeat(60));

    if (allIssues.length > 0) {
        for (const item of allIssues.slice(0, 10)) {
            console.log(`\n${item.file}:`);
            item.issues.forEach(issue => console.log(`  - ${issue}`));
        }
        if (allIssues.length > 10) {
            console.log(`\n... and ${allIssues.length - 10} more files with issues`);
        }
    } else {
        console.log('No accessibility issues found!');
    }

    const totalIssues = allIssues.reduce((sum, item) => sum + item.issues.length, 0);
    const passed = totalIssues < 5;

    const output = {
        script: 'accessibility_checker',
        project: projectPath,
        files_checked: files.length,
        files_with_issues: allIssues.length,
        issues_found: totalIssues,
        passed: passed
    };

    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(passed ? 0 : 1);
}

main();
