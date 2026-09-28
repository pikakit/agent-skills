#!/usr/bin/env node
/** Priority-ordered validation orchestrator. */

import { resolve, join } from 'node:path';
import { parseArgs } from 'node:util';
import { access } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { printHeader, printStep, printSuccess, printWarning, printError } from './utils/colors.ts';
import { runScript, scriptExists, ScriptTimeoutError } from './utils/runner.ts';
import {
    createCheckResult,
    formatJsonOutput,
    getReportVerdict,
    printSummary,
    type CheckResult
} from './utils/reporter.ts';

interface CheckContext {
    projectPath: string;
    url: string | null;
}

interface CheckConfig {
    name: string;
    category: string;
    script: string;
    required: boolean;
    args: (context: CheckContext) => string[];
}

const CORE_CHECKS: CheckConfig[] = [
    { name: 'Workflow Audit', category: 'Core', script: '.agent/scripts/audit_workflows.ts', required: true, args: () => [] },
    { name: 'Skill Audit', category: 'Core', script: '.agent/scripts/skill-audit.ts', required: true, args: () => [] },
    { name: 'Security Scan', category: 'Core', script: '.agent/skills/knowledge-compiler/scripts/secret-scanner.ts', required: true, args: () => ['--all'] },
    { name: 'TypeScript Typecheck', category: 'Core', script: '.agent/scripts/typecheck.ts', required: true, args: () => [] },
    { name: 'Test Suite', category: 'Core', script: '.agent/scripts/run-tests.ts', required: true, args: () => [] },
    { name: 'Studio Data Integrity', category: 'Core', script: '.agent/skills/studio/scripts/validate_data.ts', required: true, args: () => [] },
    { name: 'Documentation Integrity', category: 'Core', script: '.agent/scripts/validate_docs.ts', required: true, args: () => [] },
    { name: 'Schema Validation', category: 'Data Layer', script: '.agent/skills/data-modeler/scripts/schema_validator.ts', required: false, args: context => [context.projectPath] },
    { name: 'UX Audit', category: 'UX & Accessibility', script: '.agent/skills/design-system/scripts/ux_audit.ts', required: false, args: context => [context.projectPath] },
    { name: 'SEO Check', category: 'SEO & Content', script: '.agent/skills/seo-optimizer/scripts/seo_checker.ts', required: false, args: context => [context.projectPath] },
    { name: 'Mobile Audit', category: 'Mobile', script: '.agent/skills/mobile-design/scripts/mobile_audit.ts', required: false, args: context => [context.projectPath] }
];

const PERFORMANCE_CHECKS: CheckConfig[] = [
    { name: 'Lighthouse Audit', category: 'Performance', script: '.agent/skills/perf-optimizer/scripts/lighthouse_audit.ts', required: false, args: context => [context.url as string] },
    { name: 'Playwright E2E', category: 'Performance', script: '.agent/skills/e2e-automation/scripts/playwright_runner.ts', required: false, args: context => [context.url as string] }
];

function skippedResult(check: CheckConfig, reason: string): CheckResult {
    return createCheckResult({
        name: check.name,
        category: check.category,
        required: check.required,
        status: 'skipped',
        reason,
        durationMs: 0,
        exitCode: null
    });
}

async function runCheck(
    check: CheckConfig,
    context: CheckContext,
    quiet: boolean,
    verbose: boolean
): Promise<CheckResult> {
    const fullPath = join(context.projectPath, check.script);
    if (!(await scriptExists(fullPath))) {
        const status = check.required ? 'error' : 'skipped';
        const reason = check.required ? 'required_script_missing' : 'not_configured';
        if (!quiet) {
            const message = `${check.name}: Script not found (${check.script})`;
            if (check.required) printError(message);
            else printWarning(`${message}, skipping`);
        }
        return createCheckResult({
            name: check.name,
            category: check.category,
            required: check.required,
            status,
            reason,
            stderr: check.required ? `Required script not found: ${check.script}` : '',
            durationMs: 0,
            exitCode: null
        });
    }

    if (!quiet) printStep(`Running: ${check.name}`);
    const startTime = Date.now();
    try {
        const result = await runScript(fullPath, check.args(context), {
            timeout: 300000,
            cwd: context.projectPath
        });
        const durationMs = Date.now() - startTime;
        const status = result.code === 0 ? 'passed' : result.code === 1 ? 'failed' : 'error';
        if (!quiet) {
            if (status === 'passed') printSuccess(`${check.name}: PASSED`);
            else if (status === 'failed') printError(`${check.name}: FAILED`);
            else printError(`${check.name}: ERROR (exit ${result.code})`);
            if (verbose && result.stdout) console.log(result.stdout.trimEnd());
            if (result.stderr) console.error(result.stderr.trimEnd());
        }
        return createCheckResult({
            name: check.name,
            category: check.category,
            required: check.required,
            status,
            stdout: result.stdout,
            stderr: result.stderr || (status === 'error' ? `Checker exited with code ${result.code}` : ''),
            durationMs,
            exitCode: result.code
        });
    } catch (error) {
        const durationMs = Date.now() - startTime;
        const message = error instanceof Error ? error.message : String(error);
        const status = error instanceof ScriptTimeoutError ? 'timeout' : 'error';
        if (!quiet) printError(`${check.name}: ${status === 'timeout' ? 'TIMEOUT' : `ERROR - ${message}`}`);
        return createCheckResult({
            name: check.name,
            category: check.category,
            required: check.required,
            status,
            stdout: error instanceof ScriptTimeoutError ? error.stdout : '',
            stderr: error instanceof ScriptTimeoutError
                ? [error.stderr, message].filter(Boolean).join('\n')
                : message,
            durationMs,
            exitCode: null
        });
    }
}

function emitReport(
    results: CheckResult[],
    format: 'text' | 'json',
    projectPath: string,
    url: string | null,
    startTime: Date
): void {
    if (format === 'json') console.log(formatJsonOutput(results, projectPath, url, startTime));
    else printSummary(results);
}

function requestedJson(args: string[]): boolean {
    return args.includes('--format=json')
        || args.some((arg, index) => arg === '--format' && args[index + 1] === 'json');
}

function emitConfigurationError(args: string[], message: string, reason: string): 2 {
    if (requestedJson(args)) {
        console.log(formatJsonOutput([createCheckResult({
            name: 'Configuration',
            category: 'Configuration',
            required: true,
            status: 'error',
            reason,
            stderr: message,
        })], resolve('.'), null, new Date()));
    } else {
        console.error(message);
    }
    return 2;
}

export async function main(args = process.argv.slice(2)): Promise<0 | 1 | 2> {
    let values: { url?: string; 'skip-performance': boolean; format: string; verbose: boolean };
    let positionals: string[];
    try {
        ({ values, positionals } = parseArgs({
            args,
            allowPositionals: true,
            options: {
                url: { type: 'string' },
                'skip-performance': { type: 'boolean', default: false },
                format: { type: 'string', default: 'text' },
                verbose: { type: 'boolean', short: 'v', default: false }
            }
        }) as { values: typeof values; positionals: string[] });
    } catch (error) {
        return emitConfigurationError(args, error instanceof Error ? error.message : String(error), 'invalid_arguments');
    }

    if (positionals.length > 1 || (values.format !== 'text' && values.format !== 'json')) {
        return emitConfigurationError(
            args,
            'Usage: npx tsx checklist.ts [project] [--url URL] [--skip-performance] [--format text|json] [-v]',
            'invalid_arguments'
        );
    }

    const format = values.format as 'text' | 'json';
    const quiet = format === 'json';
    const projectPath = resolve(positionals[0] || '.');
    try {
        await access(projectPath);
    } catch {
        return emitConfigurationError(args, `Project path does not exist: ${projectPath}`, 'project_not_found');
    }

    const url = values.url ?? null;
    const context: CheckContext = { projectPath, url };
    const startTime = new Date();
    const results: CheckResult[] = [];

    if (!quiet) {
        printHeader('🚀 PikaKit - MASTER CHECKLIST');
        console.log(`Project: ${projectPath}`);
        console.log(`URL: ${url || 'Not provided (performance checks skipped)'}`);
        printHeader('📋 CORE CHECKS');
    }

    for (const check of CORE_CHECKS) {
        const result = await runCheck(check, context, quiet, values.verbose);
        results.push(result);
        if (check.required && result.status !== 'passed') {
            if (!quiet) printError(`CRITICAL: ${check.name} did not pass. Stopping checklist.`);
            emitReport(results, format, projectPath, url, startTime);
            return getReportVerdict(results).exitCode;
        }
    }

    if (url && !values['skip-performance']) {
        if (!quiet) printHeader('⚡ PERFORMANCE CHECKS');
        for (const check of PERFORMANCE_CHECKS) {
            const result = await runCheck(check, context, quiet, values.verbose);
            results.push(result);
            if (check.required && result.status !== 'passed') break;
        }
    } else {
        const reason = values['skip-performance'] ? 'disabled_by_flag' : 'url_not_provided';
        results.push(...PERFORMANCE_CHECKS.map(check => skippedResult(check, reason)));
    }

    emitReport(results, format, projectPath, url, startTime);
    return getReportVerdict(results).exitCode;
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) {
    main().then(code => {
        process.exitCode = code;
    }).catch(error => {
        process.exitCode = emitConfigurationError(
            process.argv.slice(2),
            error instanceof Error ? error.message : String(error),
            'unexpected_error'
        );
    });
}
