#!/usr/bin/env node
/** Cross-platform PID persistence and verified process termination. */

import { execFile } from 'node:child_process';
import { readFile, unlink, writeFile } from 'node:fs/promises';
import { promisify } from 'node:util';

const execFileAsync = promisify(execFile);

function assertPid(pid: number): void {
    if (!Number.isSafeInteger(pid) || pid <= 0) {
        throw new RangeError(`Invalid process id: ${pid}`);
    }
}

function isMissingProcess(error: unknown): boolean {
    return (error as NodeJS.ErrnoException).code === 'ESRCH';
}

export async function savePid(pidFile: string, pid: number): Promise<void> {
    assertPid(pid);
    await writeFile(pidFile, pid.toString(), 'utf-8');
}

export async function loadPid(pidFile: string): Promise<number | null> {
    try {
        const content = await readFile(pidFile, 'utf-8');
        const pid = Number(content.trim());
        return Number.isSafeInteger(pid) && pid > 0 ? pid : null;
    } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw error;
    }
}

export async function deletePidFile(pidFile: string): Promise<void> {
    try {
        await unlink(pidFile);
    } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
}

export function isRunning(pid: number): boolean {
    assertPid(pid);
    try {
        process.kill(pid, 0);
        return true;
    } catch (error: unknown) {
        const code = (error as NodeJS.ErrnoException).code;
        if (code === 'ESRCH') return false;
        if (code === 'EPERM') return true;
        throw error;
    }
}

async function waitForExit(pid: number, timeoutMs: number): Promise<boolean> {
    const deadline = Date.now() + timeoutMs;
    while (Date.now() < deadline) {
        if (!isRunning(pid)) return true;
        await new Promise<void>(resolve => setTimeout(resolve, 100));
    }
    return !isRunning(pid);
}

export async function killProcess(
    pid: number,
    signal: NodeJS.Signals = 'SIGTERM',
    graceMs = 5_000,
): Promise<void> {
    assertPid(pid);
    if (!isRunning(pid)) return;

    try {
        process.kill(pid, signal);
    } catch (error: unknown) {
        if (isMissingProcess(error)) return;
        throw error;
    }

    if (await waitForExit(pid, graceMs)) return;

    try {
        process.kill(pid, 'SIGKILL');
    } catch (error: unknown) {
        if (!isMissingProcess(error)) throw error;
    }

    if (!(await waitForExit(pid, Math.min(graceMs, 2_000)))) {
        throw new Error(`Process ${pid} did not terminate`);
    }
}

async function runTaskkill(pid: number, force: boolean): Promise<void> {
    const args = force
        ? ['/F', '/T', '/PID', pid.toString()]
        : ['/T', '/PID', pid.toString()];
    try {
        await execFileAsync('taskkill.exe', args, { windowsHide: true });
    } catch (error: unknown) {
        if (isRunning(pid)) throw error;
    }
}

export async function killProcessTree(pid: number, graceMs = 2_000): Promise<void> {
    assertPid(pid);
    if (!isRunning(pid)) return;

    if (process.platform === 'win32') {
        try {
            await runTaskkill(pid, false);
        } catch {
            // Some console processes reject graceful taskkill; the verified force pass follows.
        }
        if (!(await waitForExit(pid, graceMs))) {
            await runTaskkill(pid, true);
        }
    } else {
        try {
            process.kill(-pid, 'SIGTERM');
        } catch (error: unknown) {
            if (isMissingProcess(error)) {
                await killProcess(pid, 'SIGTERM', graceMs);
                return;
            }
            throw error;
        }

        if (!(await waitForExit(pid, graceMs))) {
            try {
                process.kill(-pid, 'SIGKILL');
            } catch (error: unknown) {
                if (!isMissingProcess(error)) throw error;
            }
        }
    }

    if (!(await waitForExit(pid, 2_000))) {
        throw new Error(`Process tree ${pid} did not terminate`);
    }
}
