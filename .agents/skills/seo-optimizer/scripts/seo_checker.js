#!/usr/bin/env node
/**
 * SEO Checker - Search Engine Optimization Audit
 * Checks HTML/JSX/TSX pages for SEO best practices.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set([
    'node_modules', '.next', 'dist', 'build', '.git', '.github',
    '__pycache__', '.vscode', '.idea', 'coverage', 'test', 'tests',
    '__tests__', 'spec', 'docs', 'documentation', 'examples'
]);

const SKIP_PATTERNS = [
    'config', 'setup', 'util', 'helper', 'hook', 'context', 'store',
    'service', 'api', 'lib', 'constant', 'type', 'interface', 'mock',
    '.test.', '.spec.', '_test.', '_spec.'
];

function isPageFile(filePath) {
    const name = filePath.split(/[/\\]/).pop().toLowerCase();
    if (SKIP_PATTERNS.some(p => name.includes(p))) return false;

    const parts = filePath.toLowerCase().split(/[/\\]/);
    const pageDirs = ['pages', 'app', 'routes', 'views', 'screens'];
    if (pageDirs.some(d => parts.includes(d))) return true;

    const pageNames = ['page', 'index', 'home', 'about', 'contact', 'blog',
        'post', 'article', 'product', 'landing', 'layout'];
    if (pageNames.some(p => name.includes(p))) return true;
    if (['.html', '.htm'].includes(extname(filePath).toLowerCase())) return true;

    return false;
}

function findPages(projectPath) {
    const files = [];

    function walk(dir) {
        try {
            const entries = readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (SKIP_DIRS.has(entry.name)) continue;
                const fullPath = resolve(dir, entry.name);
                if (entry.isDirectory()) {
                    walk(fullPath);
                } else {
                    const ext = extname(entry.name).toLowerCase();
                    if (['.html', '.htm', '.jsx', '.tsx'].includes(ext)) {
                        if (isPageFile(fullPath)) files.push(fullPath);
                    }
                }
            }
        } catch { /* ignore */ }
    }

    walk(projectPath);
    return files.slice(0, 50);
}

function checkPage(filePath) {
    const issues = [];

    try {
        const content = readFileSync(filePath, 'utf-8');
        const isLayout = content.includes('Head>') || content.toLowerCase().includes('<head');

        // Title tag
        const hasTitle = content.toLowerCase().includes('<title') || content.includes('title=');
        if (!hasTitle && isLayout) issues.push('Missing <title> tag');

        // Meta description
        const hasDescription = content.toLowerCase().includes('name="description"');
        if (!hasDescription && isLayout) issues.push('Missing meta description');

        // Open Graph
        const hasOg = content.includes('og:') || content.toLowerCase().includes('property="og:');
        if (!hasOg && isLayout) issues.push('Missing Open Graph tags');

        // Multiple H1
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        if (h1Count > 1) issues.push(`Multiple H1 tags (${h1Count})`);

        // Images without alt
        const imgs = content.match(/<img[^>]+>/gi) || [];
        for (const img of imgs) {
            if (!img.toLowerCase().includes('alt=')) {
                issues.push('Image missing alt attribute');
                break;
            }
        }

    } catch (e) {
        issues.push(`Error: ${e.message}`);
    }

    return { file: filePath.split(/[/\\]/).pop(), issues };
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log(`\n${'='.repeat(60)}`);
    console.log('  SEO CHECKER - Search Engine Optimization Audit');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    const pages = findPages(projectPath);

    if (pages.length === 0) {
        console.log('\n[!] No page files found.');
        const output = { script: 'seo_checker', files_checked: 0, passed: true };
        console.log('\n' + JSON.stringify(output, null, 2));
        process.exit(0);
    }

    console.log(`Found ${pages.length} page files to analyze\n`);

    const allIssues = [];
    for (const f of pages) {
        const result = checkPage(f);
        if (result.issues.length > 0) allIssues.push(result);
    }

    console.log('='.repeat(60));
    console.log('SEO ANALYSIS RESULTS');
    console.log('='.repeat(60));

    if (allIssues.length > 0) {
        const issueCounts = {};
        for (const item of allIssues) {
            for (const issue of item.issues) {
                issueCounts[issue] = (issueCounts[issue] || 0) + 1;
            }
        }

        console.log('\nIssue Summary:');
        for (const [issue, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
            console.log(`  [${count}] ${issue}`);
        }

        console.log(`\nAffected files (${allIssues.length}):`);
        allIssues.slice(0, 5).forEach(item => console.log(`  - ${item.file}`));
        if (allIssues.length > 5) console.log(`  ... and ${allIssues.length - 5} more`);
    } else {
        console.log('\n[OK] No SEO issues found!');
    }

    const totalIssues = allIssues.reduce((sum, item) => sum + item.issues.length, 0);
    const passed = totalIssues === 0;

    const output = {
        script: 'seo_checker',
        project: projectPath,
        files_checked: pages.length,
        files_with_issues: allIssues.length,
        issues_found: totalIssues,
        passed: passed
    };

    console.log('\n' + JSON.stringify(output, null, 2));
    process.exit(passed ? 0 : 1);
}

main();
