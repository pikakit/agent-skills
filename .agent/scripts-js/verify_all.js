#!/usr/bin/env node

/**
 * Full Verification Suite - Agent Skill Kit
 * ==========================================
 * Comprehensive validation with all checks + performance + E2E
 * JavaScript port of verify_all.py
 * 
 * Usage:
 *   node verify_all.js \u003cproject\u003e --url \u003cURL\u003e
 *   node verify_all.js \u003cproject\u003e --url \u003cURL\u003e --no-e2e
 */

import { resolve, join } from 'path';
import { parseArgs } from 'node:util';
import { access } from 'fs/promises';
import { printHeader, printStep, printSuccess, printWarning, printError } from './utils/colors.js';
import { runScript, scriptExists } from './utils/runner.js';
import { printFinalReport } from './utils/reporter.js';

// Complete verification suite
const VERIFICATION_SUITE = [
    // P0: Security (CRITICAL)
    {
        category: 'Security',
        checks: [
            { name: 'Security Scan', script: '.agent/skills/vulnerability-scanner/scripts/security_scan.py', required: true },
            { name: 'Dependency Analysis', script: '.agent/skills/vulnerability-scanner/scripts/dependency_analyzer.py', required: false }
        ]
    },

    // P1: Code Quality (CRITICAL)
    {
        category: 'Code Quality',
        checks: [
            { name: 'Lint Check', script: '.agent/skills/lint-and-validate/scripts/lint_runner.py', required: true },
            { name: 'Type Coverage', script: '.agent/skills/lint-and-validate/scripts/type_coverage.py', required: false }
        ]
    },

    // P2: Data Layer
    {
        category: 'Data Layer',
        checks: [
            { name: 'Schema Validation', script: '.agent/skills/database-design/scripts/schema_validator.py', required: false }
        ]
    },

    // P3: Testing
    {
        category: 'Testing',
        checks: [
            { name: 'Test Suite', script: '.agent/skills/testing-patterns/scripts/test_runner.py', required: false }
        ]
    },

    // P4: UX & Accessibility
    {
        category: 'UX & Accessibility',
        checks: [
            { name: 'UX Audit', script: '.agent/skills/frontend-design/scripts/ux_audit.py', required: false },
            { name: 'Accessibility Check', script: '.agent/skills/frontend-design/scripts/accessibility_checker.py', required: false }
        ]
    },

    // P5: SEO & Content
    {
        category: 'SEO & Content',
        checks: [
            { name: 'SEO Check', script: '.agent/skills/seo-fundamentals/scripts/seo_checker.py', required: false },
            { name: 'GEO Check', script: '.agent/skills/geo-fundamentals/scripts/geo_checker.py', required: false }
        ]
    },

    // P6: Performance (requires URL)
    {
        category: 'Performance',
        requiresUrl: true,
        checks: [
            { name: 'Lighthouse Audit', script: '.agent/skills/performance-profiling/scripts/lighthouse_audit.py', required: true },
            { name: 'Bundle Analysis', script: '.agent/skills/performance-profiling/scripts/bundle_analyzer.py', required: false }
        ]
    },

    // P7: E2E Testing (requires URL)
    {
        category: 'E2E Testing',
        requiresUrl: true,
        checks: [
            { name: 'Playwright E2E', script: '.agent/skills/webapp-testing/scripts/playwright_runner.py', required: false }
        ]
    },

    // P8: Mobile
    {
        category: 'Mobile',
        checks: [
            { name: 'Mobile Audit', script: '.agent/skills/mobile-design/scripts/mobile_audit.py', required: false }
        ]
    },

    // P9: Internationalization
    {
        category: 'Internationalization',
        checks: [
            { name: 'i18n Check', script: '.agent/skills/i18n-localization/scripts/i18n_checker.py', required: false }
        ]
    }
];

/**
 * Run a single check
 */
async function runCheck(name, scriptPath, projectPath, url = null) {
    const fullPath = join(projectPath, scriptPath);

    if (!(await scriptExists(fullPath))) {
        printWarning(`${name}: Script not found, skipping`);
        return { name, passed: true, skipped: true, duration: 0 };
    }

    printStep(`Running: ${name}`);
    const startTime = Date.now();

    try {
        const args = [projectPath];
        if (url && (scriptPath.includes('lighthouse') || scriptPath.includes('playwright'))) {
            args.push(url);
        }

        const result = await runScript(fullPath, args, {
            timeout: 600000, // 10 minutes for slow checks
            cwd: projectPath
        });

        const duration = (Date.now() - startTime) / 1000;

        if (result.passed) {
            printSuccess(`${name}: PASSED (${duration.toFixed(1)}s)`);
        } else {
            printError(`${name}: FAILED (${duration.toFixed(1)}s)`);
            if (result.stderr) {
                console.log(`  ${result.stderr.substring(0, 300)}`);
            }
        }

        return {
            name,
            passed: result.passed,
            output: result.stdout,
            error: result.stderr,
            skipped: false,
            duration
        };

    } catch (err) {
        const duration = (Date.now() - startTime) / 1000;

        if (err.message.includes('Timeout')) {
            printError(`${name}: TIMEOUT (>${duration.toFixed(0)}s)`);
            return { name, passed: false, skipped: false, duration, error: 'Timeout' };
        } else {
            printError(`${name}: ERROR - ${err.message}`);
            return { name, passed: false, skipped: false, duration, error: err.message };
        }
    }
}

/**
 * Main entry point
 */
async function main() {
    const { values, positionals } = parseArgs({
        args: process.argv.slice(2),
        allowPositionals: true,
        options: {
            url: { type: 'string' },
            'no-e2e': { type: 'boolean', default: false },
            'stop-on-fail': { type: 'boolean', default: false }
        }
    });

    const projectPath = resolve(positionals[0] || '.');

    // Validate project path
    try {
        await access(projectPath);
    } catch {
        printError(`Project path does not exist: ${projectPath}`);
        process.exit(1);
    }

    // Validate URL for performance checks
    if (!values.url) {
        printError('URL is required for performance & E2E checks');
        console.log('\nUsage: node verify_all.js \u003cproject\u003e --url \u003cURL\u003e');
        process.exit(1);
    }

    printHeader('🚀 AGENT SKILL KIT - FULL VERIFICATION SUITE');
    console.log(`Project: ${projectPath}`);
    console.log(`URL: ${values.url}`);
    console.log(`Started: ${new Date().toLocaleString()}`);

    const startTime = new Date();
    const results = [];

    // Run all verification categories
    for (const suite of VERIFICATION_SUITE) {
        const { category, requiresUrl = false, checks } = suite;

        // Skip if requires URL and not provided
        if (requiresUrl && !values.url) continue;

        // Skip E2E if flag set
        if (values['no-e2e'] && category === 'E2E Testing') continue;

        printHeader(`📋 ${category.toUpperCase()}`);

        for (const check of checks) {
            const result = await runCheck(check.name, check.script, projectPath, values.url);
            result.category = category;
            results.push(result);

            // Stop on critical failure if flag set
            if (values['stop-on-fail'] && check.required && !result.passed && !result.skipped) {
                printError(`CRITICAL: ${check.name} failed. Stopping verification.`);
                printFinalReport(results, startTime);
                process.exit(1);
            }
        }
    }

    // Print final report
    const allPassed = printFinalReport(results, startTime);
    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
