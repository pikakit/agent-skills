#!/usr/bin/env node
/** Transactional TypeScript diagnostic checker and conservative auto-fixer. */

import { execFile } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { createRequire } from 'node:module';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';

const execFileAsync = promisify(execFile);
const VERSION = '2.1.0';
const MAX_CYCLES = 3;

export interface Diagnostic {
    file: string | null;
    line: number;
    column: number;
    severity: 'error' | 'warning';
    code: string;
    message: string;
}

export interface TypeCheckResult {
    errors: Diagnostic[];
    warnings: Diagnostic[];
    skipped: boolean;
}

export interface AppliedFix extends Diagnostic {
    file: string;
    fix: string;
}

export interface ProblemCheckerResult {
    version: string;
    directory: string;
    cycles: number;
    status: 'CLEAN' | 'BLOCKED' | 'ERROR' | 'SKIPPED';
    totalFixed: number;
    errors: Diagnostic[];
    warnings: Diagnostic[];
    fixes: AppliedFix[];
    unfixed: Diagnostic[];
    changedFiles: string[];
    rolledBack: boolean;
    rollbackReason: string | null;
    diagnosticsBefore: { errors: number; warnings: number };
    diagnosticsAfter: { errors: number; warnings: number };
    error?: string;
}

export interface ProblemCheckerOptions {
    directory: string;
    fix?: boolean;
    typeCheck?: (directory: string) => Promise<TypeCheckResult>;
    onLog?: (message: string) => void;
}

interface FixCandidate {
    content: string;
    description: string;
}

interface FixBatch {
    fixed: AppliedFix[];
    unfixed: Diagnostic[];
    snapshots: Map<string, string>;
}

interface ExecFailure extends Error {
    code?: number | string;
    stdout?: string | Buffer;
    stderr?: string | Buffer;
    killed?: boolean;
    signal?: NodeJS.Signals;
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function outputText(value: string | Buffer | undefined): string {
    return typeof value === 'string' ? value : value?.toString('utf-8') ?? '';
}

export function parseTypeScriptOutput(output: string, directory: string): Pick<TypeCheckResult, 'errors' | 'warnings'> {
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
        const detail = combined || failure.message;
        throw new Error(`TypeScript check failed operationally: ${detail}`);
    }
}

function escapeRegex(value: string): string {
    return value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

function hasImportedName(content: string, name: string): boolean {
    const escaped = escapeRegex(name);
    return new RegExp(`import\\s+(?:type\\s+)?(?:[^;\\n]*\\b${escaped}\\b)[^;\\n]*from\\s*['\"][^'\"]+['\"]`).test(content);
}

function addNamedReactImport(content: string, name: string): string {
    const namedReact = /import\s*{([^}]+)}\s*from\s*['"]react['"];?/;
    const match = content.match(namedReact);
    if (!match) return `import { ${name} } from 'react';\n${content}`;
    const imports = match[1].split(',').map(value => value.trim()).filter(Boolean);
    if (!imports.some(value => new RegExp(`\\b${escapeRegex(name)}\\b`).test(value))) imports.push(name);
    return content.replace(namedReact, `import { ${imports.join(', ')} } from 'react';`);
}

export function tryFix(content: string, problem: Diagnostic, filePath: string): FixCandidate | null {
    const ext = path.extname(filePath).toLowerCase();
    const missingName = problem.message.match(/Cannot find name '([A-Za-z_$][\w$]*)'/)?.[1];
    if (missingName) {
        const reactImports = new Set([
            'Fragment', 'Suspense', 'createContext', 'forwardRef', 'lazy', 'memo',
            'useCallback', 'useContext', 'useEffect', 'useMemo', 'useReducer',
            'useRef', 'useState',
        ]);
        if (reactImports.has(missingName) && !hasImportedName(content, missingName)) {
            return {
                content: addNamedReactImport(content, missingName),
                description: `Added '${missingName}' to React imports`,
            };
        }

        const nextImports: Record<string, { module: string; named: boolean }> = {
            Image: { module: 'next/image', named: false },
            Link: { module: 'next/link', named: false },
            usePathname: { module: 'next/navigation', named: true },
            useRouter: { module: 'next/navigation', named: true },
            useSearchParams: { module: 'next/navigation', named: true },
        };
        const nextImport = nextImports[missingName];
        if (nextImport && !hasImportedName(content, missingName)) {
            const statement = nextImport.named
                ? `import { ${missingName} } from '${nextImport.module}';`
                : `import ${missingName} from '${nextImport.module}';`;
            return { content: `${statement}\n${content}`, description: `Added '${missingName}' import from '${nextImport.module}'` };
        }
    }

    if (problem.message.includes("Cannot find namespace 'JSX'") && !hasImportedName(content, 'JSX')) {
        return {
            content: `import type { JSX } from 'react';\n${content}`,
            description: "Imported React's JSX namespace",
        };
    }

    if (problem.message.includes('is declared but') && problem.message.includes('never used')) {
        const variable = problem.message.match(/'([^']+)'/)?.[1];
        if (variable && !variable.startsWith('_')) {
            const declaration = new RegExp(`\\b(const|let|var|function)\\s+${escapeRegex(variable)}\\b`);
            if (declaration.test(content)) {
                return {
                    content: content.replace(declaration, `$1 _${variable}`),
                    description: `Prefixed unused '${variable}' with '_'`,
                };
            }
        }
    }

    if (problem.message.includes('@import') && problem.message.includes('precede') && (ext === '.css' || ext === '.scss')) {
        const newline = content.includes('\r\n') ? '\r\n' : '\n';
        const lines = content.split(/\r?\n/);
        const imports = lines.filter(line => line.trimStart().startsWith('@import '));
        if (imports.length > 0) {
            const remaining = lines.filter(line => !line.trimStart().startsWith('@import '));
            const charsetIndex = remaining.findIndex(line => /^\uFEFF?\s*@charset\b/i.test(line));
            const insertAt = charsetIndex >= 0 ? charsetIndex + 1 : 0;
            remaining.splice(insertAt, 0, ...imports);
            return {
                content: remaining.join(newline),
                description: `Moved ${imports.length} @import rule(s) after @charset`,
            };
        }
    }

    return null;
}

function isInsideRoot(root: string, file: string): boolean {
    const relative = path.relative(root, file);
    return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

function rollback(snapshots: Map<string, string>): void {
    const failures: string[] = [];
    for (const [file, content] of snapshots) {
        try {
            fs.writeFileSync(file, content, 'utf-8');
        } catch (error: unknown) {
            failures.push(`${file}: ${errorMessage(error)}`);
        }
    }
    if (failures.length > 0) throw new Error(`Rollback failed: ${failures.join('; ')}`);
}

function applyAutoFixes(problems: Diagnostic[], directory: string): FixBatch {
    const fixed: AppliedFix[] = [];
    const unfixed: Diagnostic[] = [];
    const snapshots = new Map<string, string>();
    const byFile = new Map<string, Diagnostic[]>();
    const realRoot = fs.realpathSync(directory);

    for (const problem of problems) {
        if (!problem.file || !fs.existsSync(problem.file)) {
            unfixed.push(problem);
            continue;
        }
        const realFile = fs.realpathSync(problem.file);
        if (!isInsideRoot(realRoot, realFile)) {
            unfixed.push(problem);
            continue;
        }
        const list = byFile.get(realFile) ?? [];
        list.push(problem);
        byFile.set(realFile, list);
    }

    try {
        for (const [file, fileProblems] of byFile) {
            const original = fs.readFileSync(file, 'utf-8');
            let content = original;
            const fileFixes: AppliedFix[] = [];
            for (const problem of fileProblems) {
                const candidate = tryFix(content, problem, file);
                if (!candidate || candidate.content === content) {
                    unfixed.push(problem);
                    continue;
                }
                content = candidate.content;
                fileFixes.push({ ...problem, file, fix: candidate.description });
            }
            if (content !== original) {
                snapshots.set(file, original);
                fs.writeFileSync(file, content, 'utf-8');
                fixed.push(...fileFixes);
            }
        }
    } catch (error: unknown) {
        rollback(snapshots);
        throw error;
    }
    return { fixed, unfixed, snapshots };
}

function diagnosticFingerprint(diagnostic: Diagnostic, directory: string): string {
    const relativeFile = diagnostic.file ? path.relative(directory, diagnostic.file) : '<global>';
    const file = process.platform === 'win32' ? relativeFile.toLowerCase() : relativeFile;
    return `${file}|${diagnostic.severity}|${diagnostic.code}|${diagnostic.message.replace(/\s+/g, ' ').trim()}`;
}

function newDiagnostics(before: Diagnostic[], after: Diagnostic[], directory: string): Diagnostic[] {
    const counts = new Map<string, number>();
    for (const diagnostic of before) {
        const key = diagnosticFingerprint(diagnostic, directory);
        counts.set(key, (counts.get(key) ?? 0) + 1);
    }
    return after.filter(diagnostic => {
        const key = diagnosticFingerprint(diagnostic, directory);
        const count = counts.get(key) ?? 0;
        if (count === 0) return true;
        counts.set(key, count - 1);
        return false;
    });
}

function createResult(directory: string): ProblemCheckerResult {
    return {
        version: VERSION,
        directory,
        cycles: 0,
        status: 'CLEAN',
        totalFixed: 0,
        errors: [],
        warnings: [],
        fixes: [],
        unfixed: [],
        changedFiles: [],
        rolledBack: false,
        rollbackReason: null,
        diagnosticsBefore: { errors: 0, warnings: 0 },
        diagnosticsAfter: { errors: 0, warnings: 0 },
    };
}

export async function runProblemChecker(options: ProblemCheckerOptions): Promise<{ exitCode: 0 | 1 | 2; result: ProblemCheckerResult }> {
    const directory = path.resolve(options.directory);
    const check = options.typeCheck ?? runTypeCheck;
    const log = options.onLog ?? (() => undefined);
    const result = createResult(directory);
    let initial: TypeCheckResult;
    try {
        initial = await check(directory);
    } catch (error: unknown) {
        result.status = 'ERROR';
        result.error = errorMessage(error);
        return { exitCode: 2, result };
    }

    result.diagnosticsBefore = { errors: initial.errors.length, warnings: initial.warnings.length };
    result.diagnosticsAfter = { ...result.diagnosticsBefore };
    if (initial.skipped) {
        result.status = 'SKIPPED';
        return { exitCode: 0, result };
    }
    if (initial.errors.length === 0 && initial.warnings.length === 0) return { exitCode: 0, result };
    if (!options.fix) {
        result.status = 'BLOCKED';
        result.errors = initial.errors;
        result.warnings = initial.warnings;
        return { exitCode: 1, result };
    }

    let currentErrors = initial.errors;
    let currentWarnings = initial.warnings;
    for (let cycle = 1; cycle <= MAX_CYCLES; cycle++) {
        result.cycles = cycle;
        const before = [...currentErrors, ...currentWarnings];
        let batch: FixBatch;
        try {
            batch = applyAutoFixes(before, directory);
        } catch (error: unknown) {
            result.status = 'ERROR';
            result.error = errorMessage(error);
            result.errors = currentErrors;
            result.warnings = currentWarnings;
            return { exitCode: 2, result };
        }

        if (batch.fixed.length === 0) {
            result.unfixed = batch.unfixed;
            break;
        }

        let recheck: TypeCheckResult;
        try {
            recheck = await check(directory);
        } catch (error: unknown) {
            try {
                rollback(batch.snapshots);
            } catch (rollbackError: unknown) {
                result.status = 'ERROR';
                result.error = `${errorMessage(error)}; ${errorMessage(rollbackError)}`;
                result.rollbackReason = 'rollback-failed';
                return { exitCode: 2, result };
            }
            result.status = 'ERROR';
            result.rolledBack = true;
            result.rollbackReason = 'typecheck-error';
            result.error = errorMessage(error);
            result.errors = currentErrors;
            result.warnings = currentWarnings;
            return { exitCode: 2, result };
        }

        const after = [...recheck.errors, ...recheck.warnings];
        const regressions = newDiagnostics(before, after, directory);
        if (regressions.length > 0 || after.length >= before.length) {
            try {
                rollback(batch.snapshots);
            } catch (error: unknown) {
                result.status = 'ERROR';
                result.error = errorMessage(error);
                result.rollbackReason = 'rollback-failed';
                return { exitCode: 2, result };
            }
            result.status = 'BLOCKED';
            result.rolledBack = true;
            result.rollbackReason = regressions.length > 0 ? 'new-diagnostics' : 'no-progress';
            result.unfixed = regressions.length > 0 ? regressions : before;
            result.errors = currentErrors;
            result.warnings = currentWarnings;
            return { exitCode: 1, result };
        }

        result.fixes.push(...batch.fixed);
        result.totalFixed += batch.fixed.length;
        result.changedFiles.push(...batch.snapshots.keys());
        currentErrors = recheck.errors;
        currentWarnings = recheck.warnings;
        result.diagnosticsAfter = { errors: currentErrors.length, warnings: currentWarnings.length };
        log(`Cycle ${cycle}: accepted ${batch.fixed.length} fix(es)`);
        if (after.length === 0) {
            result.changedFiles = [...new Set(result.changedFiles.map(file => path.relative(directory, file)))];
            return { exitCode: 0, result };
        }
    }

    result.status = 'BLOCKED';
    result.errors = currentErrors;
    result.warnings = currentWarnings;
    result.diagnosticsAfter = { errors: currentErrors.length, warnings: currentWarnings.length };
    result.changedFiles = [...new Set(result.changedFiles.map(file => path.relative(directory, file)))];
    return { exitCode: 1, result };
}

function helpText(): string {
    return `Problem Checker v${VERSION}\n\nUsage:\n  npx tsx check_problems.ts [directory]\n  npx tsx check_problems.ts --fix [directory]\n  npx tsx check_problems.ts --fix --json [directory]\n\nExit codes: 0 clean/skipped, 1 diagnostics remain, 2 checker error`;
}

async function main(argv = process.argv.slice(2)): Promise<number> {
    if (argv.includes('--help') || argv.includes('-h')) {
        console.log(helpText());
        return 0;
    }
    const json = argv.includes('--json');
    const directory = path.resolve(argv.find(argument => !argument.startsWith('--')) ?? process.cwd());
    const execution = await runProblemChecker({
        directory,
        fix: argv.includes('--fix'),
        onLog: json ? undefined : message => console.log(message),
    });
    if (json) {
        console.log(JSON.stringify(execution.result, null, 2));
    } else if (execution.result.status === 'CLEAN') {
        console.log(`No TypeScript diagnostics found. Fixed: ${execution.result.totalFixed}`);
    } else if (execution.result.status === 'SKIPPED') {
        console.log('No tsconfig.json found; TypeScript check skipped.');
    } else {
        const detail = execution.result.error ?? `${execution.result.errors.length} error(s) remain`;
        console.error(`${execution.result.status}: ${detail}`);
        if (execution.result.rolledBack) console.error(`Changes rolled back: ${execution.result.rollbackReason}`);
    }
    return execution.exitCode;
}

const isMain = process.argv[1]
    && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) {
    main().then(
        code => { process.exitCode = code; },
        (error: unknown) => {
            console.error(`ERROR: ${errorMessage(error)}`);
            process.exitCode = 2;
        },
    );
}
