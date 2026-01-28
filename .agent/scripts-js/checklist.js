#!/usr/bin/env node

/**
 * Checklist - Agent Skill Kit Master Validator
 * =============================================
 * Priority-based validation orchestrator
 * JavaScript port of checklist.py
 * 
 * Usage:
 *   node checklist.js \u003cproject\u003e
 *   node checklist.js \u003cproject\u003e --url \u003cURL\u003e
 *   node checklist.js \u003cproject\u003e --format json
 */

import { resolve, join } from 'path';
import { parseArgs } from 'node:util';
import { access } from 'fs/promises';
import { printHeader, printStep, printSuccess, printWarning, printError } from './utils/colors.js';
import { runScript, scriptExists } from './utils/runner.js';
import { formatJsonOutput, printSummary } from './utils/reporter.js';

// Define priority-ordered checks
const CORE_CHECKS = [
    { name: 'Security Scan', script: '.agent/skills/vulnerability-scanner/scripts/security_scan.py', required: true },
    { name: 'Lint Check', script: '.agent/skills/lint-and-validate/scripts/lint_runner.py', required: true },
    { name: 'Schema Validation', script: '.agent/skills/database-design/scripts/schema_validator.py', required: false },
    { name: 'Test Runner', script: '.agent/skills/testing-patterns/scripts/test_runner.py', required: false },
    { name: 'UX Audit', script: '.agent/skills/frontend-design/scripts/ux_audit.py', required: false },
    { name: 'SEO Check', script: '.agent/skills/seo-fundamentals/scripts/seo_checker.py', required: false }
];

const PERFORMANCE_CHECKS = [
    { name: 'Lighthouse Audit', script: '.agent/skills/performance-profiling/scripts/lighthouse_audit.py', required: true },
    { name: 'Playwright E2E', script: '.agent/skills/webapp-testing/scripts/playwright_runner.py', required: false }
];

/**
 * Run a single validation script
 */
async function runCheck(name, scriptPath, projectPath, url = null) {
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
        const args = [projectPath];
        if (url && (scriptPath.includes('lighthouse') || scriptPath.includes('playwright'))) {
            args.push(url);
        }

        const result = await runScript(fullPath, args, {
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

    } catch (err) {
        const duration = (Date.now() - startTime) / 1000;

        if (err.message.includes('Timeout')) {
            printError(`${name}: TIMEOUT (>5 minutes)`);
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
        printHeader('🚀 AGENT SKILL KIT - MASTER CHECKLIST');
    }

    console.log(`Project: ${projectPath}`);
    console.log(`URL: ${values.url || 'Not provided (performance checks skipped)'}`);

    const results = [];

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
        console.log(formatJsonOutput(results, projectPath, values.url, startTime));
    }

    const allPassed = printSummary(results);
    process.exit(allPassed ? 0 : 1);
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
