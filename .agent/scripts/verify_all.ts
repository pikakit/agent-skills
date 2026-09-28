#!/usr/bin/env node
/** Comprehensive validation suite with explicit coverage and failure states. */

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
    printFinalReport,
    type CheckResult
} from './utils/reporter.ts';

interface CheckContext {
    projectPath: string;
    url: string;
}

interface CheckConfig {
    name: string;
    script: string;
    required: boolean;
    args: (context: CheckContext) => string[];
}

interface VerificationCategory {
    category: string;
    checks: CheckConfig[];
}

const projectArg = (context: CheckContext) => [context.projectPath];
const urlArg = (context: CheckContext) => [context.url];

const VERIFICATION_SUITE: VerificationCategory[] = [
    {
        category: 'Core Integrity',
        checks: [
            { name: 'Workflow Audit', script: '.agent/scripts/audit_workflows.ts', required: true, args: () => [] },
            { name: 'Skill Audit', script: '.agent/scripts/skill-audit.ts', required: true, args: () => [] },
            { name: 'TypeScript Typecheck', script: '.agent/scripts/typecheck.ts', required: true, args: () => [] },
            { name: 'Test Suite', script: '.agent/scripts/run-tests.ts', required: true, args: () => [] },
            { name: 'Studio Data Integrity', script: '.agent/skills/studio/scripts/validate_data.ts', required: true, args: () => [] },
            { name: 'Documentation Integrity', script: '.agent/scripts/validate_docs.ts', required: true, args: () => [] }
        ]
    },
    {
        category: 'Security',
        checks: [
            { name: 'Security Scan', script: '.agent/skills/knowledge-compiler/scripts/secret-scanner.ts', required: true, args: () => ['--all'] }
        ]
    },
    {
        category: 'Code Quality',
        checks: [
            { name: 'Lint Check', script: '.agent/skills/code-review/scripts/lint_runner.ts', required: false, args: projectArg },
            { name: 'Type Coverage', script: '.agent/skills/typescript-expert/scripts/ts_diagnostic.ts', required: false, args: projectArg }
        ]
    },
    {
        category: 'Data Layer',
        checks: [
            { name: 'Schema Validation', script: '.agent/skills/data-modeler/scripts/schema_validator.ts', required: false, args: projectArg }
        ]
    },
    {
        category: 'Testing',
        checks: [
            { name: 'Test Suite', script: '.agent/skills/test-architect/scripts/test_runner.ts', required: false, args: projectArg }
        ]
    },
    {
        category: 'UX & Accessibility',
        checks: [
            { name: 'UX Audit', script: '.agent/skills/design-system/scripts/ux_audit.ts', required: false, args: projectArg },
            { name: 'Accessibility Check', script: '.agent/skills/design-system/scripts/accessibility_checker.ts', required: false, args: projectArg }
        ]
    },
    {
        category: 'SEO & Content',
        checks: [
            { name: 'SEO Check', script: '.agent/skills/seo-optimizer/scripts/seo_checker.ts', required: false, args: projectArg }
        ]
    },
    {
        category: 'Performance',
        checks: [
            { name: 'Lighthouse Audit', script: '.agent/skills/perf-optimizer/scripts/lighthouse_audit.ts', required: false, args: urlArg }
        ]
    },
    {
        category: 'E2E Testing',
        checks: [
            { name: 'Playwright E2E', script: '.agent/skills/e2e-automation/scripts/playwright_runner.ts', required: false, args: urlArg }
        ]
    },
    {
        category: 'Mobile',
        checks: [
            { name: 'Mobile Audit', script: '.agent/skills/mobile-design/scripts/mobile_audit.ts', required: false, args: projectArg }
        ]
    }
];

function skippedResult(check: CheckConfig, category: string, reason: string): CheckResult {
    return createCheckResult({
        name: check.name,
        category,
        required: check.required,
        status: 'skipped',
        reason,
        durationMs: 0,
        exitCode: null
    });
}

async function runCheck(
    check: CheckConfig,
    category: string,
    context: CheckContext,
    quiet: boolean
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
            category,
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
            timeout: 600000,
            cwd: context.projectPath
        });
        const durationMs = Date.now() - startTime;
        const status = result.code === 0 ? 'passed' : result.code === 1 ? 'failed' : 'error';
        if (!quiet) {
            if (status === 'passed') printSuccess(`${check.name}: PASSED (${(durationMs / 1000).toFixed(1)}s)`);
            else if (status === 'failed') printError(`${check.name}: FAILED (${(durationMs / 1000).toFixed(1)}s)`);
            else printError(`${check.name}: ERROR (exit ${result.code})`);
            if (result.stderr) console.error(result.stderr.trimEnd());
        }
        return createCheckResult({
            name: check.name,
            category,
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
            category,
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
    url: string,
    startTime: Date
): void {
    if (format === 'json') console.log(formatJsonOutput(results, projectPath, url, startTime));
    else printFinalReport(results, startTime);
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
    let values: { url?: string; 'no-e2e': boolean; 'stop-on-fail': boolean; format: string };
    let positionals: string[];
    try {
        ({ values, positionals } = parseArgs({
            args,
            allowPositionals: true,
            options: {
                url: { type: 'string' },
                'no-e2e': { type: 'boolean', default: false },
                'stop-on-fail': { type: 'boolean', default: false },
                format: { type: 'string', default: 'text' }
            }
        }) as { values: typeof values; positionals: string[] });
    } catch (error) {
        return emitConfigurationError(args, error instanceof Error ? error.message : String(error), 'invalid_arguments');
    }

    if (positionals.length > 1 || (values.format !== 'text' && values.format !== 'json')) {
        return emitConfigurationError(
            args,
            'Usage: npx tsx verify_all.ts [project] --url URL [--no-e2e] [--stop-on-fail] [--format text|json]',
            'invalid_arguments'
        );
    }
    if (!values.url) {
        return emitConfigurationError(args, 'URL is required for performance and E2E checks', 'missing_url');
    }

    const format = values.format as 'text' | 'json';
    const quiet = format === 'json';
    const projectPath = resolve(positionals[0] || '.');
    try {
        await access(projectPath);
    } catch {
        return emitConfigurationError(args, `Project path does not exist: ${projectPath}`, 'project_not_found');
    }

    const context: CheckContext = { projectPath, url: values.url };
    const startTime = new Date();
    const results: CheckResult[] = [];
    if (!quiet) {
        printHeader('🚀 PikaKit - FULL VERIFICATION SUITE');
        console.log(`Project: ${projectPath}`);
        console.log(`URL: ${values.url}`);
        console.log(`Started: ${startTime.toLocaleString()}`);
    }

    let stopped = false;
    for (const suite of VERIFICATION_SUITE) {
        if (values['no-e2e'] && suite.category === 'E2E Testing') {
            results.push(...suite.checks.map(check => skippedResult(check, suite.category, 'disabled_by_flag')));
            continue;
        }
        if (!quiet) printHeader(`📋 ${suite.category.toUpperCase()}`);
        for (const check of suite.checks) {
            const result = await runCheck(check, suite.category, context, quiet);
            results.push(result);
            if (values['stop-on-fail'] && check.required && result.status !== 'passed') {
                stopped = true;
                if (!quiet) printError(`CRITICAL: ${check.name} did not pass. Stopping verification.`);
                break;
            }
        }
        if (stopped) break;
    }

    emitReport(results, format, projectPath, values.url, startTime);
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
