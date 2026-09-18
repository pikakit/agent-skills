#!/usr/bin/env node

/**
 * Full Verification Suite - PikaKit
 * ==========================================
 * Comprehensive validation with all checks + performance + E2E
 *
 * Usage:
 *   npx tsx verify_all.ts <project> --url <URL>
 *   npx tsx verify_all.ts <project> --url <URL> --no-e2e
 */

import { resolve, join } from 'path';
import { parseArgs } from 'node:util';
import { access } from 'fs/promises';
import { printHeader, printStep, printSuccess, printWarning, printError } from './utils/colors.ts';
import { runScript, scriptExists, type ScriptResult } from './utils/runner.ts';
import { printFinalReport, type CheckResult } from './utils/reporter.ts';

interface CheckConfig {
    name: string;
    script: string;
    required: boolean;
}

interface VerificationCategory {
    category: string;
    requiresUrl?: boolean;
    checks: CheckConfig[];
}

// Complete verification suite
const VERIFICATION_SUITE: VerificationCategory[] = [
    // P0: Security (CRITICAL)
    {
        category: 'Security',
        checks: [
            { name: 'Security Scan', script: '.agent/skills/security-scanner/scripts/security_scan.ts', required: true }
        ]
    },

    // P1: Code Quality (CRITICAL)
    {
        category: 'Code Quality',
        checks: [
            { name: 'Lint Check', script: '.agent/skills/code-review/scripts/lint_runner.ts', required: true },
            { name: 'Type Coverage', script: '.agent/skills/typescript-expert/scripts/ts_diagnostic.ts', required: false }
        ]
    },

    // P2: Data Layer
    {
        category: 'Data Layer',
        checks: [
            { name: 'Schema Validation', script: '.agent/skills/data-modeler/scripts/schema_validator.ts', required: false }
        ]
    },

    // P3: Testing
    {
        category: 'Testing',
        checks: [
            { name: 'Test Suite', script: '.agent/skills/test-architect/scripts/test_runner.ts', required: false }
        ]
    },

    // P4: UX & Accessibility
    {
        category: 'UX & Accessibility',
        checks: [
            { name: 'UX Audit', script: '.agent/skills/design-system/scripts/ux_audit.ts', required: false },
            { name: 'Accessibility Check', script: '.agent/skills/design-system/scripts/accessibility_checker.ts', required: false }
        ]
    },

    // P5: SEO & Content
    {
        category: 'SEO & Content',
        checks: [
            { name: 'SEO Check', script: '.agent/skills/seo-optimizer/scripts/seo_checker.ts', required: false }
        ]
    },

    // P6: Performance (requires URL)
    {
        category: 'Performance',
        requiresUrl: true,
        checks: [
            { name: 'Lighthouse Audit', script: '.agent/skills/perf-optimizer/scripts/lighthouse_audit.ts', required: true }
        ]
    },

    // P7: E2E Testing (requires URL)
    {
        category: 'E2E Testing',
        requiresUrl: true,
        checks: [
            { name: 'Playwright E2E', script: '.agent/skills/e2e-automation/scripts/playwright_runner.ts', required: false }
        ]
    },

    // P8: Mobile
    {
        category: 'Mobile',
        checks: [
            { name: 'Mobile Audit', script: '.agent/skills/mobile-design/scripts/mobile_audit.ts', required: false }
        ]
    }
];

/**
 * Run a single check
 */
async function runCheck(name: string, scriptPath: string, projectPath: string, url: string | null = null): Promise<CheckResult> {
    const fullPath = join(projectPath, scriptPath);

    if (!(await scriptExists(fullPath))) {
        printWarning(`${name}: Script not found, skipping`);
        return { name, passed: true, skipped: true, duration: 0 };
    }

    printStep(`Running: ${name}`);
    const startTime = Date.now();

    try {
        const args: string[] = [projectPath];
        if (url && (scriptPath.includes('lighthouse') || scriptPath.includes('playwright'))) {
            args.push(url);
        }

        const result: ScriptResult = await runScript(fullPath, args, {
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

    } catch (err: unknown) {
        const duration = (Date.now() - startTime) / 1000;
        const message = err instanceof Error ? err.message : String(err);

        if (message.includes('Timeout')) {
            printError(`${name}: TIMEOUT (>${duration.toFixed(0)}s)`);
            return { name, passed: false, skipped: false, duration, error: 'Timeout' };
        } else {
            printError(`${name}: ERROR - ${message}`);
            return { name, passed: false, skipped: false, duration, error: message };
        }
    }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
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
        console.log('\nUsage: npx tsx verify_all.ts <project> --url <URL>');
        process.exit(1);
    }

    printHeader('🚀 PikaKit - FULL VERIFICATION SUITE');
    console.log(`Project: ${projectPath}`);
    console.log(`URL: ${values.url}`);
    console.log(`Started: ${new Date().toLocaleString()}`);

    const startTime = new Date();
    const results: CheckResult[] = [];

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
    console.error('Error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
});
