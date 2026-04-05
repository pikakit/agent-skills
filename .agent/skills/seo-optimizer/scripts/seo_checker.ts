#!/usr/bin/env node
// @ts-nocheck
/**
 * SEO Checker — Search Engine Optimization Audit
 * Version: 2.0.0
 *
 * Static analysis of HTML/JSX/TSX pages for SEO best practices.
 * Checks: title, meta description, canonical, OG, H1, alt, schema, robots.txt, sitemap.
 *
 * Usage:
 *   node seo_checker.js <path>
 *   node seo_checker.js <path> --json
 *   node seo_checker.js --help
 */

import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, extname, relative, join } from 'node:path'

const VERSION = '2.0.0'

// --- CLI ---
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
SEO Checker v${VERSION}

Usage:
  node seo_checker.js <path>          Audit pages in project
  node seo_checker.js <path> --json   JSON output only (for agents)
  node seo_checker.js --help          Show this help

Checks:
  ✓ Title tag — exists + length (50-60 chars)
  ✓ Meta description — exists + length (150-160 chars)
  ✓ Canonical tag — present on all pages
  ✓ Open Graph — og:title, og:description, og:image
  ✓ H1 tag — exactly one per page
  ✓ Image alt — all <img> have alt attributes
  ✓ Schema markup — JSON-LD structured data
  ✓ robots.txt — exists in project root
  ✓ sitemap.xml — exists in project root

Exit Codes:
  0  PASS — No issues
  1  FAIL — Issues found
`)
    process.exit(0)
}

const jsonOutput = args.includes('--json')
const projectPath = resolve(args.find(a => !a.startsWith('--')) || '.')

function log(msg) { if (!jsonOutput) console.log(msg) }

// --- Configuration ---
const SKIP_DIRS = new Set([
    'node_modules', '.next', 'dist', 'build', '.git', '.github',
    '__pycache__', '.vscode', '.idea', 'coverage', '__tests__',
])

const SKIP_PATTERNS = [
    'config', 'setup', 'util', 'helper', 'hook', 'context', 'store',
    'service', 'api', 'lib', 'constant', 'type', 'interface', 'mock',
    '.test.', '.spec.', '_test.', '_spec.',
]

// --- Page Discovery ---
function isPageFile(filePath) {
    const name = filePath.split(/[/\\]/).pop().toLowerCase()
    if (SKIP_PATTERNS.some(p => name.includes(p))) return false

    const parts = filePath.toLowerCase().split(/[/\\]/)
    const pageDirs = ['pages', 'app', 'routes', 'views', 'screens']
    if (pageDirs.some(d => parts.includes(d))) return true

    const pageNames = ['page', 'index', 'home', 'about', 'contact', 'blog',
        'post', 'article', 'product', 'landing', 'layout']
    if (pageNames.some(p => name.includes(p))) return true
    if (['.html', '.htm'].includes(extname(filePath).toLowerCase())) return true

    return false
}

function findPages(dir) {
    const files = []

    function walk(d) {
        try {
            const entries = readdirSync(d, { withFileTypes: true })
            for (const entry of entries) {
                if (SKIP_DIRS.has(entry.name)) continue
                const fullPath = resolve(d, entry.name)
                if (entry.isDirectory()) {
                    walk(fullPath)
                } else {
                    const ext = extname(entry.name).toLowerCase()
                    if (['.html', '.htm', '.jsx', '.tsx'].includes(ext) && isPageFile(fullPath)) {
                        files.push(fullPath)
                    }
                }
            }
        } catch { /* ignore unreadable dirs */ }
    }

    walk(dir)
    return files.slice(0, 50)
}

// --- SEO Checks ---
function checkPage(filePath) {
    const issues = []
    const warnings = []

    try {
        const content = readFileSync(filePath, 'utf-8')
        const contentLower = content.toLowerCase()
        const isLayout = contentLower.includes('<head') || content.includes('Head>')

        // 1. Title tag — exists + length (50-60 chars)
        const titleMatch = content.match(/<title[^>]*>([^<]*)<\/title>/i)
        if (!titleMatch && isLayout) {
            issues.push({ check: 'title', message: 'Missing <title> tag', severity: 'error' })
        } else if (titleMatch) {
            const titleLen = titleMatch[1].trim().length
            if (titleLen < 30) {
                warnings.push({ check: 'title', message: `Title too short (${titleLen} chars, recommend 50-60)`, severity: 'warning' })
            } else if (titleLen > 70) {
                warnings.push({ check: 'title', message: `Title too long (${titleLen} chars, recommend 50-60)`, severity: 'warning' })
            }
        }

        // 2. Meta description — exists + length (150-160 chars)
        const descMatch = content.match(/name=["']description["']\s+content=["']([^"']*)["']/i)
            || content.match(/content=["']([^"']*)["']\s+name=["']description["']/i)
        if (!descMatch && isLayout) {
            issues.push({ check: 'meta_description', message: 'Missing meta description', severity: 'error' })
        } else if (descMatch) {
            const descLen = descMatch[1].trim().length
            if (descLen < 120) {
                warnings.push({ check: 'meta_description', message: `Meta description too short (${descLen} chars, recommend 150-160)`, severity: 'warning' })
            } else if (descLen > 170) {
                warnings.push({ check: 'meta_description', message: `Meta description too long (${descLen} chars, recommend 150-160)`, severity: 'warning' })
            }
        }

        // 3. Canonical tag
        const hasCanonical = contentLower.includes('rel="canonical"') || contentLower.includes("rel='canonical'")
        if (!hasCanonical && isLayout) {
            warnings.push({ check: 'canonical', message: 'Missing <link rel="canonical">', severity: 'warning' })
        }

        // 4. Open Graph tags
        const ogChecks = ['og:title', 'og:description', 'og:image']
        for (const og of ogChecks) {
            if (!contentLower.includes(og) && isLayout) {
                warnings.push({ check: 'opengraph', message: `Missing ${og}`, severity: 'warning' })
            }
        }

        // 5. H1 — exactly one per page
        const h1Count = (content.match(/<h1[\s>]/gi) || []).length
        if (h1Count === 0 && !isLayout) {
            warnings.push({ check: 'h1', message: 'No H1 tag found', severity: 'warning' })
        } else if (h1Count > 1) {
            issues.push({ check: 'h1', message: `Multiple H1 tags (${h1Count}), should be exactly 1`, severity: 'error' })
        }

        // 6. Images without alt
        const imgs = content.match(/<img[^>]+>/gi) || []
        const missingAlt = imgs.filter(img => !img.toLowerCase().includes('alt='))
        if (missingAlt.length > 0) {
            issues.push({ check: 'img_alt', message: `${missingAlt.length} image(s) missing alt attribute`, severity: 'error' })
        }

        // 7. Schema markup (JSON-LD)
        const hasSchema = contentLower.includes('application/ld+json')
            || content.includes('itemscope')
            || content.includes('itemtype')
        if (!hasSchema && isLayout) {
            warnings.push({ check: 'schema', message: 'No structured data (JSON-LD or Microdata)', severity: 'warning' })
        }

    } catch (e) {
        issues.push({ check: 'parse', message: `Parse error: ${e.message}`, severity: 'error' })
    }

    return {
        file: relative(projectPath, filePath),
        issues,
        warnings,
        total: issues.length + warnings.length,
    }
}

// --- Project-Level Checks ---
function checkProject() {
    const issues = []

    // robots.txt
    if (!existsSync(join(projectPath, 'robots.txt'))) {
        issues.push({ check: 'robots_txt', message: 'Missing robots.txt in project root', severity: 'warning' })
    }

    // sitemap.xml
    const sitemapExists = existsSync(join(projectPath, 'sitemap.xml'))
        || existsSync(join(projectPath, 'public', 'sitemap.xml'))
        || existsSync(join(projectPath, 'app', 'sitemap.ts'))
        || existsSync(join(projectPath, 'app', 'sitemap.xml'))
    if (!sitemapExists) {
        issues.push({ check: 'sitemap', message: 'Missing sitemap.xml (checked root, public/, app/)', severity: 'warning' })
    }

    return issues
}

// --- Main ---
function main() {
    log(`\n${'='.repeat(60)}`)
    log(`  SEO Checker v${VERSION}`)
    log('='.repeat(60))
    log(`Project: ${projectPath}`)
    log('-'.repeat(60))

    // Project-level checks
    const projectIssues = checkProject()
    if (projectIssues.length > 0) {
        log('\nProject-level issues:')
        for (const i of projectIssues) log(`  ⚠️  ${i.message}`)
    }

    // Page-level checks
    const pages = findPages(projectPath)

    if (pages.length === 0) {
        log('\n[!] No page files found.')
        const result = {
            version: VERSION,
            project: projectPath,
            files_checked: 0,
            project_issues: projectIssues,
            passed: projectIssues.length === 0,
        }
        if (jsonOutput) console.log(JSON.stringify(result, null, 2))
        process.exit(projectIssues.length > 0 ? 1 : 0)
    }

    log(`\nFound ${pages.length} page file(s)\n`)

    const results = []
    for (const f of pages) {
        const result = checkPage(f)
        if (result.total > 0) results.push(result)
    }

    // Summary
    log('='.repeat(60))
    log('SEO ANALYSIS RESULTS')
    log('='.repeat(60))

    const totalErrors = results.reduce((s, r) => s + r.issues.length, 0)
    const totalWarnings = results.reduce((s, r) => s + r.warnings.length, 0)

    if (results.length > 0) {
        // Aggregate issues
        const issueCounts = {}
        for (const r of results) {
            for (const i of [...r.issues, ...r.warnings]) {
                issueCounts[i.message] = (issueCounts[i.message] || 0) + 1
            }
        }

        log('\nIssue Summary:')
        for (const [msg, count] of Object.entries(issueCounts).sort((a, b) => b[1] - a[1])) {
            log(`  [${count}] ${msg}`)
        }

        log(`\nAffected files (${results.length}/${pages.length}):`)
        results.slice(0, 5).forEach(r => log(`  - ${r.file}`))
        if (results.length > 5) log(`  ... and ${results.length - 5} more`)
    } else {
        log('\n✅ No SEO issues found!')
    }

    log(`\n  Errors: ${totalErrors} | Warnings: ${totalWarnings + projectIssues.length}`)

    const passed = totalErrors === 0

    const output = {
        version: VERSION,
        project: projectPath,
        files_checked: pages.length,
        files_with_issues: results.length,
        errors: totalErrors,
        warnings: totalWarnings + projectIssues.length,
        project_issues: projectIssues,
        page_results: results.slice(0, 20),  // Limit output
        passed,
    }

    if (jsonOutput) {
        console.log(JSON.stringify(output, null, 2))
    }

    process.exit(passed ? 0 : 1)
}

main()
