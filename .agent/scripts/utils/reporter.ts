#!/usr/bin/env node
/** Result formatting utilities for validation scripts. */

import { readFileSync } from 'node:fs';
import { colors } from './colors.ts';

export type CheckStatus = 'passed' | 'failed' | 'skipped' | 'error' | 'timeout';
export type VerdictStatus = 'passed' | 'passed_with_skips' | 'failed' | 'incomplete';

export interface CheckResult {
    name: string;
    status: CheckStatus;
    required: boolean;
    passed: boolean;
    skipped: boolean;
    category: string;
    reason: string;
    exitCode: number | null;
    durationMs: number;
    stdout: string;
    stderr: string;
}

export interface ReportVerdict {
    status: VerdictStatus;
    exitCode: 0 | 1 | 2;
}

export interface ReportSummary {
    total: number;
    passed: number;
    failed: number;
    skipped: number;
    errors: number;
    timed_out: number;
    duration: number;
    verdict: VerdictStatus;
    exit_code: 0 | 1 | 2;
    deployment_ready: boolean;
}

interface ReportOutput {
    schema_version: string;
    version: string;
    timestamp: string;
    project_path: string;
    url: string | null;
    summary: ReportSummary;
    results: Array<{
        name: string;
        category: string;
        status: CheckStatus;
        required: boolean;
        passed: boolean;
        skipped: boolean;
        reason: string;
        exit_code: number | null;
        duration_ms: number;
        stdout: string;
        stderr: string;
        /** @deprecated Use stdout. */
        output: string;
        /** @deprecated Use stderr. */
        error: string;
    }>;
}

function readToolkitVersion(): string {
    try {
        const packageJson = JSON.parse(
            readFileSync(new URL('../../../package.json', import.meta.url), 'utf8')
        ) as { version?: unknown };
        return typeof packageJson.version === 'string' ? packageJson.version : 'unknown';
    } catch {
        return 'unknown';
    }
}

export function createCheckResult(
    result: Pick<CheckResult, 'name' | 'status' | 'required'>
        & Partial<Omit<CheckResult, 'name' | 'status' | 'required' | 'passed' | 'skipped'>>
): CheckResult {
    return {
        category: '',
        reason: '',
        exitCode: null,
        durationMs: 0,
        stdout: '',
        stderr: '',
        ...result,
        passed: result.status === 'passed',
        skipped: result.status === 'skipped'
    };
}

export function getReportVerdict(results: CheckResult[]): ReportVerdict {
    if (results.some(result => result.status === 'error' || result.status === 'timeout')) {
        return { status: 'incomplete', exitCode: 2 };
    }
    if (results.some(result => result.status === 'failed')) {
        return { status: 'failed', exitCode: 1 };
    }
    if (!results.some(result => result.status === 'passed')) {
        return { status: 'incomplete', exitCode: 2 };
    }
    if (results.some(result => result.status === 'skipped')) {
        return { status: 'passed_with_skips', exitCode: 0 };
    }
    return { status: 'passed', exitCode: 0 };
}

export function summarizeResults(results: CheckResult[], duration = 0): ReportSummary {
    const verdict = getReportVerdict(results);
    return {
        total: results.length,
        passed: results.filter(result => result.status === 'passed').length,
        failed: results.filter(result => result.status === 'failed').length,
        skipped: results.filter(result => result.status === 'skipped').length,
        errors: results.filter(result => result.status === 'error').length,
        timed_out: results.filter(result => result.status === 'timeout').length,
        duration: Math.round(duration * 100) / 100,
        verdict: verdict.status,
        exit_code: verdict.exitCode,
        deployment_ready: verdict.status === 'passed'
    };
}

/** Format validation results as one machine-readable JSON document. */
export function formatJsonOutput(
    results: CheckResult[],
    projectPath: string,
    url: string | null,
    startTime: Date
): string {
    const totalDuration = (Date.now() - startTime.getTime()) / 1000;
    const output: ReportOutput = {
        schema_version: '1.0.0',
        version: readToolkitVersion(),
        timestamp: new Date().toISOString(),
        project_path: projectPath,
        url: url || null,
        summary: summarizeResults(results, totalDuration),
        results: results.map(result => ({
            name: result.name,
            category: result.category,
            status: result.status,
            required: result.required,
            passed: result.passed,
            skipped: result.skipped,
            reason: result.reason,
            exit_code: result.exitCode,
            duration_ms: result.durationMs,
            stdout: result.stdout,
            stderr: result.stderr,
            output: result.stdout,
            error: result.stderr
        }))
    };
    return JSON.stringify(output, null, 2);
}

function statusGlyph(result: CheckResult): string {
    switch (result.status) {
        case 'passed': return `${colors.green}✅${colors.reset}`;
        case 'skipped': return `${colors.yellow}⏭️ ${colors.reset}`;
        case 'failed': return `${colors.red}❌${colors.reset}`;
        case 'timeout': return `${colors.red}⏱️ ${colors.reset}`;
        case 'error': return `${colors.red}⚠️ ${colors.reset}`;
    }
}

function printVerdict(results: CheckResult[]): boolean {
    const verdict = getReportVerdict(results);
    if (verdict.status === 'failed') {
        console.log(`${colors.red}❌ VALIDATION FAILED - Fix failed checks before proceeding${colors.reset}`);
        return false;
    }
    if (verdict.status === 'incomplete') {
        console.log(`${colors.red}❌ VALIDATION INCOMPLETE - Required checks could not run${colors.reset}`);
        return false;
    }
    if (verdict.status === 'passed_with_skips') {
        console.log(`${colors.yellow}⚠️  VALIDATION PASSED WITH SKIPS - Review skipped checks${colors.reset}`);
        return true;
    }
    console.log(`${colors.green}✅ ALL CHECKS PASSED${colors.reset}`);
    return true;
}

/** Print a compact human-readable checklist summary. */
export function printSummary(results: CheckResult[]): boolean {
    const summary = summarizeResults(results);
    console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'📊 CHECKLIST SUMMARY'.padStart(38)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);
    console.log(`Total Checks: ${summary.total}`);
    console.log(`${colors.green}✅ Passed: ${summary.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${summary.failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${summary.skipped}${colors.reset}`);
    console.log(`${colors.red}⚠️  Errors: ${summary.errors}${colors.reset}`);
    console.log(`${colors.red}⏱️  Timed out: ${summary.timed_out}${colors.reset}\n`);

    for (const result of results) {
        const detail = result.reason ? ` (${result.reason})` : '';
        console.log(`${statusGlyph(result)} ${result.name}${detail}`);
    }
    console.log();
    return printVerdict(results);
}

/** Print a comprehensive report with category breakdown. */
export function printFinalReport(results: CheckResult[], startTime: Date): boolean {
    const totalDuration = (Date.now() - startTime.getTime()) / 1000;
    const summary = summarizeResults(results, totalDuration);
    console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'📊 FULL VERIFICATION REPORT'.padStart(48)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);
    console.log(`Total Duration: ${summary.duration.toFixed(1)}s`);
    console.log(`Total Checks: ${summary.total}`);
    console.log(`${colors.green}✅ Passed: ${summary.passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${summary.failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${summary.skipped}${colors.reset}`);
    console.log(`${colors.red}⚠️  Errors: ${summary.errors}${colors.reset}`);
    console.log(`${colors.red}⏱️  Timed out: ${summary.timed_out}${colors.reset}\n`);

    console.log(`${colors.bold}Results by Category:${colors.reset}`);
    let currentCategory: string | null = null;
    for (const result of results) {
        if (result.category && result.category !== currentCategory) {
            currentCategory = result.category;
            console.log(`\n${colors.bold}${colors.cyan}${currentCategory}:${colors.reset}`);
        }
        const duration = result.status !== 'skipped' && result.durationMs
            ? ` (${(result.durationMs / 1000).toFixed(1)}s)`
            : '';
        const reason = result.reason ? ` - ${result.reason}` : '';
        console.log(`  ${statusGlyph(result)} ${result.name}${duration}${reason}`);
    }

    const problems = results.filter(result =>
        result.status === 'failed' || result.status === 'error' || result.status === 'timeout'
    );
    if (problems.length > 0) {
        console.log(`\n${colors.bold}${colors.red}CHECKS NEEDING ATTENTION:${colors.reset}`);
        for (const result of problems) {
            console.log(`\n${colors.red}✗ ${result.name}${colors.reset}`);
            if (result.stderr) console.log(`  Error: ${result.stderr.substring(0, 200)}`);
        }
    }
    console.log();
    return printVerdict(results);
}
