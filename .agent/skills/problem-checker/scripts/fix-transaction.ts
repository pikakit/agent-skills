import fs from 'node:fs';
import path from 'node:path';

import { tryFix } from './fix-engine.ts';
import type { AppliedFix, Diagnostic, FixBatch } from './problem-checker-types.ts';
import { errorMessage } from './problem-checker-utils.ts';

function isInsideRoot(root: string, file: string): boolean {
    const relative = path.relative(root, file);
    return relative !== '' && !relative.startsWith(`..${path.sep}`) && relative !== '..' && !path.isAbsolute(relative);
}

export function rollback(snapshots: Map<string, string>): void {
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

export function applyAutoFixes(problems: Diagnostic[], directory: string): FixBatch {
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

export function newDiagnostics(before: Diagnostic[], after: Diagnostic[], directory: string): Diagnostic[] {
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
