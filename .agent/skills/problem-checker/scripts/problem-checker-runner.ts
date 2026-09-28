import path from 'node:path';

import { applyAutoFixes, newDiagnostics, rollback } from './fix-transaction.ts';
import type {
    Diagnostic,
    ProblemCheckerExecution,
    ProblemCheckerOptions,
    ProblemCheckerResult,
    TypeCheckResult,
} from './problem-checker-types.ts';
import { errorMessage } from './problem-checker-utils.ts';
import { runTypeCheck } from './typecheck-runner.ts';

const VERSION = '2.1.0';
const MAX_CYCLES = 3;

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

function rollbackAfterCheckError(
    result: ProblemCheckerResult,
    snapshots: Map<string, string>,
    error: unknown,
): ProblemCheckerExecution | null {
    try {
        rollback(snapshots);
    } catch (rollbackError: unknown) {
        result.status = 'ERROR';
        result.error = `${errorMessage(error)}; ${errorMessage(rollbackError)}`;
        result.rollbackReason = 'rollback-failed';
        return { exitCode: 2, result };
    }
    return null;
}

function finalizeChangedFiles(result: ProblemCheckerResult, directory: string): void {
    result.changedFiles = [...new Set(result.changedFiles.map(file => path.relative(directory, file)))];
}

export async function runProblemChecker(options: ProblemCheckerOptions): Promise<ProblemCheckerExecution> {
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
        const before: Diagnostic[] = [...currentErrors, ...currentWarnings];
        let batch;
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
            const rollbackFailure = rollbackAfterCheckError(result, batch.snapshots, error);
            if (rollbackFailure) return rollbackFailure;
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
            const rollbackFailure = rollbackAfterCheckError(result, batch.snapshots, 'recheck rejected fixes');
            if (rollbackFailure) return rollbackFailure;
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
            finalizeChangedFiles(result, directory);
            return { exitCode: 0, result };
        }
    }

    result.status = 'BLOCKED';
    result.errors = currentErrors;
    result.warnings = currentWarnings;
    result.diagnosticsAfter = { errors: currentErrors.length, warnings: currentWarnings.length };
    finalizeChangedFiles(result, directory);
    return { exitCode: 1, result };
}
