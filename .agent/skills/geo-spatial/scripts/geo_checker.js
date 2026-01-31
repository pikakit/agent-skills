#!/usr/bin/env node
/**
 * GEO Checker - Generative Engine Optimization Audit
 * Checks public web content for AI citation readiness.
 */

import { readFileSync, readdirSync } from 'fs';
import { resolve, extname } from 'path';

const SKIP_DIRS = new Set([
    'node_modules', '.next', 'dist', 'build', '.git', '.github',
    '__pycache__', '.vscode', '.idea', 'coverage', 'test', 'tests',
    '__tests__', 'spec', 'docs', 'documentation'
]);

const SKIP_FILES = new Set([
    'jest.config', 'webpack.config', 'vite.config', 'tsconfig',
    'package.json', 'package-lock', 'yarn.lock', '.eslintrc',
    'tailwind.config', 'postcss.config', 'next.config'
]);

function isPageFile(filePath) {
    const name = filePath.split(/[/\\]/).pop().replace(/\.[^.]+$/, '').toLowerCase();

    if ([...SKIP_FILES].some(skip => name.includes(skip))) return false;
    if (name.endsWith('.test') || name.endsWith('.spec')) return false;
    if (name.startsWith('test_') || name.startsWith('spec_')) return false;

    const pageIndicators = ['page', 'index', 'home', 'about', 'contact', 'blog',
        'post', 'article', 'product', 'service', 'landing'];

    const parts = filePath.toLowerCase().split(/[/\\]/);
    if (parts.includes('pages') || parts.includes('app') || parts.includes('routes')) {
        return true;
    }

    if (pageIndicators.some(ind => name.includes(ind))) return true;
    if (filePath.toLowerCase().endsWith('.html')) return true;

    return false;
}

function findWebPages(projectPath) {
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
                        if (isPageFile(fullPath)) {
                            files.push(fullPath);
                        }
                    }
                }
            }
        } catch { /* ignore */ }
    }

    walk(projectPath);
    return files.slice(0, 30);
}

function checkPage(filePath) {
    const issues = [];
    const passed = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        // 1. JSON-LD Structured Data
        if (content.includes('application/ld+json')) {
            passed.push('JSON-LD structured data found');
            if (content.includes('"@type"')) {
                if (content.includes('Article')) passed.push('Article schema present');
                if (content.includes('FAQPage')) passed.push('FAQ schema present');
                if (content.includes('Organization') || content.includes('Person')) {
                    passed.push('Entity schema present');
                }
            }
        } else {
            issues.push('No JSON-LD structured data (AI engines prefer structured content)');
        }

        // 2. Heading Structure
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;

        if (h1Count === 1) {
            passed.push('Single H1 heading (clear topic)');
        } else if (h1Count === 0) {
            issues.push('No H1 heading - page topic unclear');
        } else {
            issues.push(`Multiple H1 headings (${h1Count}) - confusing for AI`);
        }

        if (h2Count >= 2) {
            passed.push(`${h2Count} H2 subheadings (good structure)`);
        } else {
            issues.push('Add more H2 subheadings for scannable content');
        }

        // 3. Author Attribution
        const authorPatterns = ['author', 'byline', 'written-by', 'contributor', 'rel="author"'];
        if (authorPatterns.some(p => content.toLowerCase().includes(p))) {
            passed.push('Author attribution found');
        } else {
            issues.push('No author info (AI prefers attributed content)');
        }

        // 4. Publication Date
        const datePatterns = ['datePublished', 'dateModified', 'datetime=', 'pubdate', 'article:published'];
        if (datePatterns.some(p => content.toLowerCase().includes(p.toLowerCase()))) {
            passed.push('Publication date found');
        } else {
            issues.push('No publication date (freshness matters for AI)');
        }

        // 5. FAQ Section
        const faqPatterns = [/<details/i, /faq/i, /frequently.?asked/i, /"FAQPage"/];
        if (faqPatterns.some(p => p.test(content))) {
            passed.push('FAQ section detected (highly citable)');
        }

        // 6. Lists
        const listCount = (content.match(/<(ul|ol)[^>]*>/gi) || []).length;
        if (listCount >= 2) {
            passed.push(`${listCount} lists (structured content)`);
        }

        // 7. Tables
        const tableCount = (content.match(/<table[^>]*>/gi) || []).length;
        if (tableCount >= 1) {
            passed.push(`${tableCount} table(s) (comparison data)`);
        }

        // 8. Entity Recognition
        const entityPatterns = [
            /"@type"\s*:\s*"Organization"/,
            /"@type"\s*:\s*"LocalBusiness"/,
            /rel="author"/
        ];
        if (entityPatterns.some(p => p.test(content))) {
            passed.push('Entity/Brand recognition (E-E-A-T)');
        }

        // 9. Original Statistics
        const statPatterns = [/\d+%/, /\$[\d,]+/, /study\s+(shows|found)/i, /according to/i];
        const statMatches = statPatterns.filter(p => p.test(content)).length;
        if (statMatches >= 2) {
            passed.push('Original statistics/data (citation magnet)');
        }

        // 10. Direct answers
        const directPatterns = [/is defined as/i, /refers to/i, /in short,/i, /simply put,/i];
        if (directPatterns.some(p => p.test(content))) {
            passed.push('Direct answer patterns (LLM-friendly)');
        }

    } catch (e) {
        issues.push(`Error: ${e.message}`);
    }

    const total = passed.length + issues.length;
    const score = total > 0 ? Math.round((passed.length / total) * 100) : 0;

    return {
        file: filePath.split(/[/\\]/).pop(),
        passed,
        issues,
        score
    };
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  GEO CHECKER - AI Citation Readiness Audit');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log('-'.repeat(60));

    const pages = findWebPages(projectPath);

    if (pages.length === 0) {
        console.log('\n[!] No public web pages found.');
        console.log('    Looking for: HTML, JSX, TSX files in pages/app directories');
        const output = { script: 'geo_checker', pages_found: 0, passed: true };
        console.log('\n' + JSON.stringify(output, null, 2));
        process.exit(0);
    }

    console.log(`Found ${pages.length} public pages to analyze\n`);

    const results = pages.map(page => checkPage(page));

    for (const result of results) {
        const status = result.score >= 60 ? '[OK]' : '[!]';
        console.log(`${status} ${result.file}: ${result.score}%`);
        if (result.issues.length && result.score < 60) {
            result.issues.slice(0, 2).forEach(issue => console.log(`    - ${issue}`));
        }
    }

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    console.log('\n' + '='.repeat(60));
    console.log(`AVERAGE GEO SCORE: ${avgScore.toFixed(0)}%`);
    console.log('='.repeat(60));

    if (avgScore >= 80) {
        console.log('[OK] Excellent - Content well-optimized for AI citations');
    } else if (avgScore >= 60) {
        console.log('[OK] Good - Some improvements recommended');
    } else if (avgScore >= 40) {
        console.log('[!] Needs work - Add structured elements');
    } else {
        console.log('[X] Poor - Content needs GEO optimization');
    }

    const output = {
        script: 'geo_checker',
        project: projectPath,
        pages_checked: results.length,
        average_score: Math.round(avgScore),
        passed: avgScore >= 60
    };
    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(avgScore >= 60 ? 0 : 1);
}

main();
