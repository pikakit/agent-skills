import { execFile } from 'node:child_process';
import fs from 'node:fs';
import { createRequire } from 'node:module';
import path from 'node:path';
import { promisify } from 'node:util';

import type { Diagnostic, ExecFailure, TypeCheckResult } from './problem-checker-types.ts';
import { errorMessage, outputText } from './problem-checker-utils.ts';

const execFileAsync = promisify(execFile);

export function parseTypeScriptOutput(
    output: string,
    directory: string,
): Pick<TypeCheckResult, 'errors' | 'warnings'> {
    const errors: Diagnostic[] = [];
    const warnings: Diagnostic[] = [];
    const located = /^(.+?)\((\d+),(\d+)\):\s+(error|warning)\s+(TS\d+):\s+(.+)$/;
    const global = /^(error|warning)\s+(TS\d+):\s+(.+)$/;

    for (const rawLine of output.split(/\r?\n/)) {
        const line = rawLine.trim();
        const match = line.match(located);
        const generic = match ? null : line.match(global);
        if (!match && !generic) continue;
        const severity = (match?.[4] ?? generic?.[1]) === 'warning' ? 'warning' : 'error';
        const diagnostic: Diagnostic = match
            ? {
                file: path.resolve(directory, match[1]),
                line: Number(match[2]),
                column: Number(match[3]),
                severity,
                code: match[5],
                message: match[6].trim(),
            }
            : {
                file: null,
                line: 0,
                column: 0,
                severity,
                code: generic![2],
                message: generic![3].trim(),
            };
        (severity === 'error' ? errors : warnings).push(diagnostic);
    }
    return { errors, warnings };
}

export async function runTypeCheck(directory: string): Promise<TypeCheckResult> {
    if (!fs.existsSync(path.join(directory, 'tsconfig.json'))) {
        return { errors: [], warnings: [], skipped: true };
    }

    let tscPath: string;
    try {
        const projectRequire = createRequire(path.join(directory, 'package.json'));
        tscPath = projectRequire.resolve('typescript/bin/tsc');
    } catch (error: unknown) {
        throw new Error(`Unable to resolve TypeScript compiler: ${errorMessage(error)}`);
    }

    try {
        await execFileAsync(process.execPath, [tscPath, '--noEmit', '--pretty', 'false'], {
            cwd: directory,
            timeout: 60_000,
            maxBuffer: 10 * 1024 * 1024,
            windowsHide: true,
        });
        return { errors: [], warnings: [], skipped: false };
    } catch (error: unknown) {
        const failure = error as ExecFailure;
        const combined = `${outputText(failure.stdout)}\n${outputText(failure.stderr)}`.trim();
        const diagnostics = parseTypeScriptOutput(combined, directory);
        if (diagnostics.errors.length > 0 || diagnostics.warnings.length > 0) {
            return { ...diagnostics, skipped: false };
        }
        throw new Error(`TypeScript check failed operationally: ${combined || failure.message}`);
    }
}
