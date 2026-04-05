#!/usr/bin/env node
// @ts-nocheck
/**
 * Lighthouse Performance Audit
 * Version: 2.0.0
 *
 * Runs Lighthouse CLI and extracts Core Web Vitals + category scores.
 * Requires: npm install -g lighthouse
 *
 * Usage:
 *   node lighthouse_audit.js <url>
 *   node lighthouse_audit.js <url> --threshold=80
 *   node lighthouse_audit.js <url> --mobile
 *   node lighthouse_audit.js --help
 */

import { execFile } from 'node:child_process'
import { readFile, unlink, mkdir } from 'node:fs/promises'
import { existsSync } from 'node:fs'
import { tmpdir } from 'node:os'
import { join } from 'node:path'
import { promisify } from 'node:util'

const execFileAsync = promisify(execFile)
const VERSION = '2.0.0'

// --- CLI Argument Parsing ---
const args = process.argv.slice(2)

if (args.includes('--help') || args.length === 0) {
    console.log(`
Lighthouse Audit v${VERSION}

Usage:
  node lighthouse_audit.js <url>                     Run audit (desktop)
  node lighthouse_audit.js <url> --mobile            Run audit (mobile)
  node lighthouse_audit.js <url> --threshold=80      Set pass/fail threshold
  node lighthouse_audit.js <url> --categories=perf   Audit specific categories

Options:
  --mobile          Emulate mobile device (default: desktop)
  --threshold=N     Performance score threshold (0-100). Exit 1 if below.
  --categories=X    Comma-separated: perf,a11y,bp,seo (default: all)
  --help            Show this help

Examples:
  node lighthouse_audit.js https://example.com
  node lighthouse_audit.js https://example.com --mobile --threshold=90
  node lighthouse_audit.js http://localhost:3000 --categories=perf

Requires: npm install -g lighthouse
`)
    process.exit(0)
}

const url = args.find(a => !a.startsWith('--'))
const isMobile = args.includes('--mobile')
const thresholdArg = args.find(a => a.startsWith('--threshold='))
const threshold = thresholdArg ? parseInt(thresholdArg.split('=')[1], 10) : null
const catArg = args.find(a => a.startsWith('--categories='))

const categoryMap = { perf: 'performance', a11y: 'accessibility', bp: 'best-practices', seo: 'seo' }
const categories = catArg
    ? catArg.split('=')[1].split(',').map(c => categoryMap[c] || c).join(',')
    : 'performance,accessibility,best-practices,seo'

if (!url) {
    console.log(JSON.stringify({ error: 'No URL provided. Use --help for usage.' }))
    process.exit(1)
}

// --- Main Audit Function ---
async function runLighthouse(targetUrl) {
    const outputDir = join(tmpdir(), 'lighthouse_audit')
    if (!existsSync(outputDir)) await mkdir(outputDir, { recursive: true })
    const outputPath = join(outputDir, `lighthouse_${Date.now()}.json`)

    const lhArgs = [
        targetUrl,
        '--output=json',
        `--output-path=${outputPath}`,
        '--chrome-flags=--headless --no-sandbox',
        `--only-categories=${categories}`,
    ]

    if (!isMobile) {
        lhArgs.push('--preset=desktop')
    }

    try {
        await execFileAsync('lighthouse', lhArgs, {
            timeout: 120_000,
            maxBuffer: 10 * 1024 * 1024,
        })
    } catch (err) {
        if (err.code === 'ENOENT') {
            return { error: 'Lighthouse CLI not found. Install: npm install -g lighthouse' }
        }
        if (err.killed) {
            return { error: 'Lighthouse audit timed out (120s)' }
        }
        // Lighthouse may exit non-zero but still produce output
        if (!existsSync(outputPath)) {
            return { error: `Lighthouse failed: ${err.message}` }
        }
    }

    if (!existsSync(outputPath)) {
        return { error: 'Lighthouse did not produce output' }
    }

    try {
        const raw = await readFile(outputPath, 'utf-8')
        await unlink(outputPath).catch(() => { })

        const report = JSON.parse(raw)
        return parseReport(report, targetUrl)
    } catch (err) {
        return { error: `Failed to parse report: ${err.message}` }
    }
}

function parseReport(report, targetUrl) {
    const cats = report.categories || {}
    const audits = report.audits || {}

    // Category scores (0-100)
    const scores = {}
    for (const [key, cat] of Object.entries(cats)) {
        scores[key] = Math.round((cat.score || 0) * 100)
    }

    // Core Web Vitals
    const cwv = {
        lcp: extractMetric(audits, 'largest-contentful-paint'),
        inp: extractMetric(audits, 'interaction-to-next-paint') ||
            extractMetric(audits, 'total-blocking-time'), // TBT as INP proxy in lab
        cls: extractMetric(audits, 'cumulative-layout-shift'),
        fcp: extractMetric(audits, 'first-contentful-paint'),
        ttfb: extractMetric(audits, 'server-response-time'),
        si: extractMetric(audits, 'speed-index'),
    }

    // CWV pass/fail
    const cwvStatus = {
        lcp: cwv.lcp ? (cwv.lcp.value <= 2500 ? 'GOOD' : cwv.lcp.value <= 4000 ? 'NEEDS_WORK' : 'POOR') : null,
        cls: cwv.cls ? (cwv.cls.value <= 0.1 ? 'GOOD' : cwv.cls.value <= 0.25 ? 'NEEDS_WORK' : 'POOR') : null,
    }

    // Summary
    const perfScore = scores.performance ?? 0
    let summary
    if (perfScore >= 90) summary = '✅ Excellent performance'
    else if (perfScore >= 50) summary = '⚠️ Needs improvement'
    else summary = '❌ Poor performance'

    // Top opportunities
    const opportunities = (report.audits ? Object.values(report.audits) : [])
        .filter(a => a.details?.type === 'opportunity' && a.details?.overallSavingsMs > 0)
        .sort((a, b) => (b.details.overallSavingsMs || 0) - (a.details.overallSavingsMs || 0))
        .slice(0, 5)
        .map(a => ({
            title: a.title,
            savingsMs: Math.round(a.details.overallSavingsMs),
        }))

    return {
        url: targetUrl,
        device: isMobile ? 'mobile' : 'desktop',
        scores,
        cwv,
        cwvStatus,
        summary,
        opportunities,
        threshold: threshold ? { value: threshold, passed: perfScore >= threshold } : undefined,
    }
}

function extractMetric(audits, id) {
    const audit = audits[id]
    if (!audit) return null
    return {
        value: audit.numericValue != null ? Math.round(audit.numericValue * 100) / 100 : null,
        unit: audit.numericUnit || 'ms',
        display: audit.displayValue || null,
        score: audit.score != null ? Math.round(audit.score * 100) : null,
    }
}

// --- Run ---
const result = await runLighthouse(url)
console.log(JSON.stringify(result, null, 2))

// Exit code based on threshold
if (result.error) {
    process.exit(2)
} else if (threshold && result.scores?.performance < threshold) {
    process.exit(1)
} else {
    process.exit(0)
}
