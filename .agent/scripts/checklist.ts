#!/usr/bin/env node

/**
 * Checklist - PikaKit Master Validator
 * =============================================
 * Priority-based validation orchestrator
 *
 * Usage:
 *   npx tsx checklist.ts <project>
 *   npx tsx checklist.ts <project> --url <URL>
 *   npx tsx checklist.ts <project> --format json
 */

import { resolve, join } from 'path';
import { parseArgs } from 'node:util';
import { access } from 'fs/promises';
import { printHeader, printStep, printSuccess, printWarning, printError } from './utils/colors.ts';
import { runScript, scriptExists, type ScriptResult } from './utils/runner.ts';
import { formatJsonOutput, printSummary, type CheckResult } from './utils/reporter.ts';

interface CheckConfig {
    name: string;
    script: string;
    required: boolean;
}

// Define priority-ordered checks
const CORE_CHECKS: CheckConfig[] = [
    { name: 'Security Scan', script: '.agent/skills/security-scanner/scripts/security_scan.ts', required: true },
    { name: 'Lint Check', script: '.agent/skills/code-review/scripts/lint_runner.ts', required: true },
    { name: 'Schema Validation', script: '.agent/skills/data-modeler/scripts/schema_validator.ts', required: false },
    { name: 'Test Runner', script: '.agent/skills/test-architect/scripts/test_runner.ts', required: false },
    { name: 'UX Audit', script: '.agent/skills/design-system/scripts/ux_audit.ts', required: false },
    { name: 'SEO Check', script: '.agent/skills/seo-optimizer/scripts/seo_checker.ts', required: false }
];

const PERFORMANCE_CHECKS: CheckConfig[] = [
    { name: 'Lighthouse Audit', script: '.agent/skills/perf-optimizer/scripts/lighthouse_audit.ts', required: true },
    { name: 'Playwright E2E', script: '.agent/skills/e2e-automation/scripts/playwright_runner.ts', required: false }
];

/**
 * Run a single validation script
 */
async function runCheck(name: string, scriptPath: string, projectPath: string, url: string | null = null): Promise<CheckResult> {
    const fullPath = join(projectPath, scriptPath);

    // Check if script exists
    if (!(await scriptExists(fullPath))) {
        printWarning(`${name}: Script not found, skipping`);
        return { name, passed: true, skipped: true, duration: 0 };
    }

    printStep(`Running: ${name}`);
    const startTime = Date.now();

    try {
        // Build args
        const args: string[] = [projectPath];
        if (url && (scriptPath.includes('lighthouse') || scriptPath.includes('playwright'))) {
            args.push(url);
        }

        const result: ScriptResult = await runScript(fullPath, args, {
            timeout: 300000, // 5 minutes
            cwd: projectPath
        });

        const duration = (Date.now() - startTime) / 1000;

        if (result.passed) {
            printSuccess(`${name}: PASSED`);
        } else {
            printError(`${name}: FAILED`);
            if (result.stderr) {
                console.log(`  Error: ${result.stderr.substring(0, 200)}`);
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
            printError(`${name}: TIMEOUT (>5 minutes)`);
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
            'skip-performance': { type: 'boolean', default: false },
            format: { type: 'string', default: 'text' },
            verbose: { type: 'boolean', short: 'v', default: false }
        }
    });

    const projectPath = resolve(positionals[0] || '.');

    // Check if project exists
    try {
        await access(projectPath);
    } catch {
        printError(`Project path does not exist: ${projectPath}`);
        process.exit(1);
    }

    const startTime = new Date();

    if (values.format === 'text') {
        printHeader('🚀 PikaKit - MASTER CHECKLIST');
    }

    console.log(`Project: ${projectPath}`);
    console.log(`URL: ${values.url || 'Not provided (performance checks skipped)'}`);

    const results: CheckResult[] = [];

    // Run core checks
    if (values.format === 'text') {
        printHeader('📋 CORE CHECKS');
    }

    for (const check of CORE_CHECKS) {
        const result = await runCheck(check.name, check.script, projectPath);
        results.push(result);

        // If required check fails, stop
        if (check.required && !result.passed && !result.skipped) {
            printError(`CRITICAL: ${check.name} failed. Stopping checklist.`);
            printSummary(results);
            process.exit(1);
        }
    }

    // Run performance checks if URL provided
    if (values.url && !values['skip-performance']) {
        if (values.format === 'text') {
            printHeader('⚡ PERFORMANCE CHECKS');
        }

        for (const check of PERFORMANCE_CHECKS) {
            const result = await runCheck(check.name, check.script, projectPath, values.url);
            results.push(result);
        }
    }

    // Print summary
    if (values.format === 'json') {
        console.log(formatJsonOutput(results, projectPath, values.url ?? null, startTime));
    }

    const allPassed = printSummary(results);
    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Error:', err instanceof Error ? err.message : String(err));
    process.exit(1);
});
