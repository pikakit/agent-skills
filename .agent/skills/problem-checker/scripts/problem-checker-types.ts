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

export interface FixCandidate {
    content: string;
    description: string;
}

export interface FixBatch {
    fixed: AppliedFix[];
    unfixed: Diagnostic[];
    snapshots: Map<string, string>;
}

export interface ExecFailure extends Error {
    code?: number | string;
    stdout?: string | Buffer;
    stderr?: string | Buffer;
    killed?: boolean;
    signal?: NodeJS.Signals;
}

export type ProblemCheckerExecution = {
    exitCode: 0 | 1 | 2;
    result: ProblemCheckerResult;
};
