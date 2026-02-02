#!/usr/bin/env node
/**
 * Lighthouse Audit - Performance profiling via Lighthouse CLI
 * Usage: node lighthouse_audit.js <url>
 * Note: Requires lighthouse CLI (npm install -g lighthouse)
 */

import { execSync } from 'child_process';
import { readFileSync, unlinkSync, existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function runLighthouse(url) {
    try {
        const outputDir = join(tmpdir(), 'lighthouse_audit');
        if (!existsSync(outputDir)) mkdirSync(outputDir, { recursive: true });
        const outputPath = join(outputDir, `lighthouse_${Date.now()}.json`);

        execSync([
            'lighthouse',
            url,
            '--output=json',
            `--output-path=${outputPath}`,
            '--chrome-flags=--headless',
            '--only-categories=performance,accessibility,best-practices,seo'
        ].join(' '), { encoding: 'utf-8', timeout: 120000, stdio: 'pipe' });

        if (existsSync(outputPath)) {
            const report = JSON.parse(readFileSync(outputPath, 'utf-8'));
            unlinkSync(outputPath);

            const categories = report.categories || {};
            const scores = {
                performance: Math.round((categories.performance?.score || 0) * 100),
                accessibility: Math.round((categories.accessibility?.score || 0) * 100),
                best_practices: Math.round((categories['best-practices']?.score || 0) * 100),
                seo: Math.round((categories.seo?.score || 0) * 100)
            };

            let summary = '[OK] Excellent performance';
            if (scores.performance < 50) {
                summary = '[X] Poor performance';
            } else if (scores.performance < 90) {
                summary = '[!] Needs improvement';
            }

            return { url, scores, summary };
        } else {
            return { error: 'Lighthouse failed to generate report' };
        }
    } catch (e) {
        if (e.code === 'ENOENT') {
            return { error: 'Lighthouse CLI not found. Install with: npm install -g lighthouse' };
        }
        if (e.code === 'ETIMEDOUT') {
            return { error: 'Lighthouse audit timed out' };
        }
        return { error: e.message };
    }
}

const url = process.argv[2];
if (!url) {
    console.log(JSON.stringify({ error: 'Usage: node lighthouse_audit.js <url>' }));
    process.exit(1);
}

const result = runLighthouse(url);
console.log(JSON.stringify(result, null, 2));
