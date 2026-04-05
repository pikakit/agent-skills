#!/usr/bin/env node
// @ts-nocheck
/**
 * Accessibility Checker v2.0.0
 * Skill: design-system
 *
 * WCAG compliance audit for HTML/JSX/TSX files.
 *
 * Usage:
 *   node accessibility_checker.js <project_path>
 *   node accessibility_checker.js <project_path> --json
 *
 * Checks:
 *   - Inputs without label or aria-label
 *   - Buttons without accessible text
 *   - Missing lang attribute on <html>
 *   - Missing skip-to-main-content link
 *   - onClick without keyboard handler
 *   - Positive tabIndex values
 *   - Autoplay media without muted
 *   - role="button" without tabindex
 *   - Images without alt attribute
 *
 * Flags:
 *   --json     Output as JSON only
 *   --help     Show help
 *   --version  Show version
 */

import { readFile, readdir } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const VERSION = '2.0.0';
const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git', '__pycache__']);
const VALID_EXTS = new Set(['.html', '.jsx', '.tsx', '.vue']);
const MAX_FILES = 50;

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const filteredArgs = args.filter(a => !a.startsWith('--'));

function showHelp() {
    console.log(`Accessibility Checker v${VERSION}

Usage: node accessibility_checker.js <project_path> [options]

Options:
  --json       Output as JSON only
  --help       Show this help
  --version    Show version

Checks: inputs, buttons, lang, skip-link, keyboard, tabindex, autoplay, role, img alt`);
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

// --- Checks ---

async function checkAccessibility(filePath) {
    const issues = [];
    let content;

    try {
        content = await readFile(filePath, 'utf-8');
    } catch (err) {
        issues.push({ rule: 'FILE_READ', severity: 'error', message: `Cannot read: ${err.message}` });
        return issues;
    }

    // 1. Inputs without labels
    const inputs = content.match(/<input[^>]*>/gi) || [];
    for (const inp of inputs) {
        const lower = inp.toLowerCase();
        if (lower.includes('type="hidden"') || lower.includes("type='hidden'")) continue;
        if (!lower.includes('aria-label') && !lower.includes('aria-labelledby')) {
            issues.push({
                rule: 'A11Y_INPUT_NO_LABEL',
                severity: 'error',
                message: 'Input without aria-label or aria-labelledby',
            });
            break; // report once per file
        }
    }

    // 2. Buttons without accessible text
    const buttons = content.match(/<button[^>]*>[\s\S]*?<\/button>/gi) || [];
    for (const btn of buttons) {
        const lower = btn.toLowerCase();
        if (lower.includes('aria-label') || lower.includes('aria-labelledby')) continue;
        const text = btn.replace(/<[^>]+>/g, '').trim();
        if (!text) {
            issues.push({
                rule: 'A11Y_BUTTON_NO_TEXT',
                severity: 'error',
                message: 'Button without accessible text or aria-label',
            });
            break;
        }
    }

    // 3. Missing lang attribute
    if (content.toLowerCase().includes('<html') && !content.toLowerCase().includes('lang=')) {
        issues.push({
            rule: 'A11Y_MISSING_LANG',
            severity: 'error',
            message: 'Missing lang attribute on <html>',
        });
    }

    // 4. Missing skip link
    if (content.toLowerCase().includes('<main') || content.toLowerCase().includes('<body')) {
        if (!content.toLowerCase().includes('skip') && !content.includes('#main')) {
            issues.push({
                rule: 'A11Y_NO_SKIP_LINK',
                severity: 'warning',
                message: 'Consider adding skip-to-main-content link',
            });
        }
    }

    // 5. onClick without keyboard support
    const onclickCount = (content.toLowerCase().match(/onclick=/g) || []).length;
    const keyboardCount = (content.toLowerCase().match(/onkeydown=|onkeyup=|onkeypress=/g) || []).length;
    if (onclickCount > 0 && keyboardCount === 0) {
        issues.push({
            rule: 'A11Y_NO_KEYBOARD',
            severity: 'warning',
            message: 'onClick without keyboard handler (onKeyDown)',
        });
    }

    // 6. Positive tabIndex
    if (/tabindex=["']([1-9]\d*)["']/i.test(content)) {
        issues.push({
            rule: 'A11Y_POSITIVE_TABINDEX',
            severity: 'warning',
            message: 'Avoid positive tabIndex values (use 0 or -1)',
        });
    }

    // 7. Autoplay without muted
    if (content.toLowerCase().includes('autoplay') && !content.toLowerCase().includes('muted')) {
        issues.push({
            rule: 'A11Y_AUTOPLAY_UNMUTED',
            severity: 'error',
            message: 'Autoplay media should be muted',
        });
    }

    // 8. role="button" without tabindex
    const divButtons = content.match(/<div[^>]*role=["']button["'][^>]*>/gi) || [];
    for (const div of divButtons) {
        if (!div.toLowerCase().includes('tabindex')) {
            issues.push({
                rule: 'A11Y_ROLE_NO_TABINDEX',
                severity: 'error',
                message: 'role="button" without tabindex',
            });
            break;
        }
    }

    // 9. Images without alt
    const images = content.match(/<img[^>]*>/gi) || [];
    for (const img of images) {
        if (!img.toLowerCase().includes('alt=')) {
            issues.push({
                rule: 'A11Y_IMG_NO_ALT',
                severity: 'error',
                message: 'Image without alt attribute',
            });
            break;
        }
    }

    return issues;
}

// --- Main ---

async function main() {
    if (args.includes('--version')) { console.log(VERSION); return; }
    if (args.includes('--help') || filteredArgs.length === 0) { showHelp(); return; }

    const projectPath = resolve(filteredArgs[0]);

    if (!jsonMode) {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`[ACCESSIBILITY CHECKER] WCAG Compliance v${VERSION}`);
        console.log('='.repeat(60));
        console.log(`Project: ${projectPath}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log('-'.repeat(60));
    }

    const files = await walkFiles(projectPath);

    if (files.length === 0) {
        const output = {
            script: 'accessibility_checker', version: VERSION,
            project: projectPath, files_checked: 0,
            errors: 0, warnings: 0, passed: true,
            message: 'No HTML/JSX/TSX files found',
        };
        console.log(jsonMode ? JSON.stringify(output, null, 2) : 'No files found.\n' + JSON.stringify(output, null, 2));
        return;
    }

    if (!jsonMode) console.log(`Found ${files.length} file(s)`);

    const allResults = [];

    for (const f of files) {
        const issues = await checkAccessibility(f);
        if (issues.length > 0) {
            allResults.push({ file: f.split(/[/\\]/).pop(), issues });
        }
    }

    const totalErrors = allResults.reduce(
        (sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0,
    );
    const totalWarnings = allResults.reduce(
        (sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0,
    );

    if (!jsonMode) {
        console.log('\n' + '='.repeat(60));
        if (allResults.length > 0) {
            console.log('ACCESSIBILITY ISSUES');
            console.log('='.repeat(60));
            for (const item of allResults.slice(0, 10)) {
                console.log(`\n${item.file}:`);
                for (const issue of item.issues) {
                    const icon = issue.severity === 'error' ? '[ERROR]' : '[WARN]';
                    console.log(`  ${icon} ${issue.rule}: ${issue.message}`);
                }
            }
            if (allResults.length > 10) {
                console.log(`\n... and ${allResults.length - 10} more files`);
            }
        } else {
            console.log('No accessibility issues found!');
        }
        console.log(`\nRESULT: ${totalErrors === 0 ? 'PASSED' : 'FAILED'} | ${totalErrors} errors, ${totalWarnings} warnings`);
        console.log('='.repeat(60));
    }

    const output = {
        script: 'accessibility_checker',
        version: VERSION,
        project: projectPath,
        files_checked: files.length,
        files_with_issues: allResults.length,
        errors: totalErrors,
        warnings: totalWarnings,
        passed: totalErrors === 0,
        results: allResults,
    };

    console.log('\n' + JSON.stringify(output, null, 2));
    process.exit(totalErrors === 0 ? 0 : 1);
}

main().catch(err => {
    console.error(jsonMode ? JSON.stringify({ status: 'error', message: err.message }) : `[FATAL] ${err.message}`);
    process.exit(1);
});
