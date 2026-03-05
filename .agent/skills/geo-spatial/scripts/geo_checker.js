#!/usr/bin/env node
/**
 * GEO Checker — Generative Engine Optimization Audit
 *
 * Checks public web content against the 7-item GEO checklist
 * from SKILL.md for AI citation readiness.
 *
 * @version 2.0.0
 * @contract geo-spatial v2.0.0
 * @see references/engineering-spec.md Section 6.1
 *
 * Checklist items (score 0–7):
 *  1. Question-based titles
 *  2. Summary / TL;DR at top
 *  3. Original data with sources
 *  4. Expert quotes (name, title)
 *  5. FAQ section (3–5 Q&A)
 *  6. "Last updated" timestamp
 *  7. Article + FAQPage schema markup
 *
 * Read-only: scans files, never modifies them.
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

/**
 * Check a single page against the 7-item GEO checklist.
 * Returns score 0–7 (count of items passed).
 */
function checkPage(filePath) {
    const checklist = [];
    const extras = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        // === CHECKLIST ITEM 1: Question-based titles ===
        const titleMatch = content.match(/<title[^>]*>(.*?)<\/title>/is);
        const h1Match = content.match(/<h1[^>]*>(.*?)<\/h1>/is);
        const titleText = (titleMatch?.[1] || h1Match?.[1] || '').trim();
        const hasQuestionTitle = /^(what|how|why|when|where|which|who|is|can|do|does|should|will)\b/i.test(titleText)
            || titleText.includes('?');
        checklist.push({
            id: 1, check: 'Question-based title',
            status: hasQuestionTitle ? 'pass' : 'fail',
            fix: hasQuestionTitle ? null : 'Start title with a question word (What, How, Why) or end with ?'
        });

        // === CHECKLIST ITEM 2: Summary / TL;DR at top ===
        const summaryPatterns = [/tl;?dr/i, /summary/i, /key\s*takeaway/i, /in\s*brief/i,
            /overview/i, /<meta\s+name="description"/i, /description.*content=/i];
        const hasSummary = summaryPatterns.some(p => p.test(content));
        checklist.push({
            id: 2, check: 'Summary / TL;DR at top',
            status: hasSummary ? 'pass' : 'fail',
            fix: hasSummary ? null : 'Add a TL;DR or summary section near the top of the page'
        });

        // === CHECKLIST ITEM 3: Original data with sources ===
        const statPatterns = [/\d+%/, /\$[\d,]+/, /study\s+(shows|found)/i, /according to/i,
            /research\s+(shows|indicates)/i, /data\s+(shows|suggests)/i, /source:/i];
        const statMatches = statPatterns.filter(p => p.test(content)).length;
        const hasStats = statMatches >= 2;
        checklist.push({
            id: 3, check: 'Original data with sources',
            status: hasStats ? 'pass' : 'fail',
            fix: hasStats ? null : 'Add original statistics, percentages, or cited data points'
        });

        // === CHECKLIST ITEM 4: Expert quotes (name, title) ===
        const quotePatterns = [/\bsays\b/i, /\baccording\s+to\b/i, /"[^"]{20,}".*said/i,
            /expert/i, /\bceo\b/i, /\bcto\b/i, /\bfound(er|ing)/i, /blockquote/i,
            /\bcite\b/i, /<q\b/i];
        const quoteMatches = quotePatterns.filter(p => p.test(content)).length;
        const hasQuotes = quoteMatches >= 2;
        checklist.push({
            id: 4, check: 'Expert quotes (name, title)',
            status: hasQuotes ? 'pass' : 'fail',
            fix: hasQuotes ? null : 'Add expert quotes with attribution (name + title)'
        });

        // === CHECKLIST ITEM 5: FAQ section (3–5 Q&A) ===
        const faqPatterns = [/<details/i, /faq/i, /frequently.?asked/i, /"FAQPage"/];
        const hasFAQ = faqPatterns.some(p => p.test(content));
        checklist.push({
            id: 5, check: 'FAQ section (3–5 Q&A)',
            status: hasFAQ ? 'pass' : 'fail',
            fix: hasFAQ ? null : 'Add an FAQ section with 3–5 question-and-answer pairs'
        });

        // === CHECKLIST ITEM 6: "Last updated" timestamp ===
        const datePatterns = ['datepublished', 'datemodified', 'datetime=', 'pubdate',
            'article:published', 'last.?updated', 'modified', 'published.?on'];
        const hasDate = datePatterns.some(p => content.toLowerCase().includes(p));
        checklist.push({
            id: 6, check: '"Last updated" timestamp',
            status: hasDate ? 'pass' : 'fail',
            fix: hasDate ? null : 'Add datePublished/dateModified or a visible "Last updated" date'
        });

        // === CHECKLIST ITEM 7: Article + FAQPage schema markup ===
        const hasJsonLd = content.includes('application/ld+json');
        const hasArticleSchema = hasJsonLd && /Article/i.test(content);
        const hasFAQSchema = hasJsonLd && /"FAQPage"/.test(content);
        const hasSchema = hasArticleSchema || hasFAQSchema;
        checklist.push({
            id: 7, check: 'Article + FAQPage schema markup',
            status: hasSchema ? 'pass' : 'fail',
            fix: hasSchema ? null : 'Add JSON-LD with @type Article and/or FAQPage schema'
        });

        // === BONUS CHECKS (beyond 7-item checklist) ===
        const h1Count = (content.match(/<h1[^>]*>/gi) || []).length;
        const h2Count = (content.match(/<h2[^>]*>/gi) || []).length;
        if (h1Count === 1) extras.push('Single H1 heading (clear topic)');
        if (h2Count >= 2) extras.push(`${h2Count} H2 subheadings (good structure)`);

        const listCount = (content.match(/<(ul|ol)[^>]*>/gi) || []).length;
        if (listCount >= 2) extras.push(`${listCount} lists (structured content)`);

        const tableCount = (content.match(/<table[^>]*>/gi) || []).length;
        if (tableCount >= 1) extras.push(`${tableCount} table(s) (comparison data)`);

        const authorPatterns = ['author', 'byline', 'written-by', 'rel="author"'];
        if (authorPatterns.some(p => content.toLowerCase().includes(p))) {
            extras.push('Author attribution found');
        }

        const directPatterns = [/is defined as/i, /refers to/i, /in short,/i, /simply put,/i];
        if (directPatterns.some(p => p.test(content))) {
            extras.push('Direct answer patterns (LLM-friendly)');
        }

    } catch (e) {
        checklist.push({
            id: 0, check: 'File readable', status: 'fail', fix: e.message
        });
    }

    const score = checklist.filter(c => c.status === 'pass').length;

    return {
        file: filePath.split(/[/\\]/).pop(),
        checklist,
        extras,
        score,
        maxScore: 7
    };
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  GEO CHECKER — AI Citation Readiness Audit (v2.0.0)');
    console.log('  7-item checklist · Score 0–7');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log('-'.repeat(60));

    const pages = findWebPages(projectPath);

    if (pages.length === 0) {
        console.log('\n[!] No public web pages found.');
        console.log('    Looking for: HTML, JSX, TSX files in pages/app directories');
        const output = { script: 'geo_checker', version: '2.0.0', pages_found: 0, passed: true };
        console.log('\n' + JSON.stringify(output, null, 2));
        process.exit(0);
    }

    console.log(`Found ${pages.length} public pages to analyze\n`);

    const results = pages.map(page => checkPage(page));

    for (const result of results) {
        const status = result.score >= 5 ? '[OK]' : '[!]';
        console.log(`${status} ${result.file}: ${result.score}/7`);
        const fails = result.checklist.filter(c => c.status === 'fail');
        if (fails.length && result.score < 5) {
            fails.slice(0, 3).forEach(f => console.log(`    - ${f.check}: ${f.fix}`));
        }
        if (result.extras.length) {
            result.extras.forEach(e => console.log(`    + ${e}`));
        }
    }

    const avgScore = results.reduce((sum, r) => sum + r.score, 0) / results.length;

    console.log('\n' + '='.repeat(60));
    console.log(`AVERAGE GEO SCORE: ${avgScore.toFixed(1)}/7`);
    console.log('='.repeat(60));

    if (avgScore >= 6) {
        console.log('[OK] Excellent — Content well-optimized for AI citations');
    } else if (avgScore >= 5) {
        console.log('[OK] Good — Minor improvements recommended');
    } else if (avgScore >= 3) {
        console.log('[!] Needs work — Add structured elements');
    } else {
        console.log('[X] Poor — Content needs GEO optimization');
    }

    const output = {
        script: 'geo_checker',
        version: '2.0.0',
        contract: 'geo-spatial v2.0.0',
        project: projectPath,
        pages_checked: results.length,
        average_score: Math.round(avgScore * 10) / 10,
        max_score: 7,
        passed: avgScore >= 5
    };
    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(avgScore >= 5 ? 0 : 1);
}

main();
