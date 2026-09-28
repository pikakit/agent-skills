#!/usr/bin/env node
/** Executes validation scripts with bounded runtime and captured output. */

import { spawn, type ChildProcess, type SpawnOptions } from 'node:child_process';
import { resolve } from 'node:path';
import { access } from 'node:fs/promises';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

export interface RunScriptOptions {
    timeout?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}

export interface ScriptResult {
    code: number;
    signal: NodeJS.Signals | null;
    stdout: string;
    stderr: string;
    passed: boolean;
}

export class ScriptTimeoutError extends Error {
    readonly timeout: number;
    readonly stdout: string;
    readonly stderr: string;

    constructor(timeout: number, stdout = '', stderr = '') {
        super(`Timeout: Script exceeded ${timeout}ms`);
        this.name = 'ScriptTimeoutError';
        this.timeout = timeout;
        this.stdout = stdout;
        this.stderr = stderr;
    }
}

function waitForChild(child: ChildProcess, timeout: number): Promise<void> {
    return new Promise(resolvePromise => {
        let settled = false;
        const finish = () => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            resolvePromise();
        };
        const timer = setTimeout(finish, timeout);
        child.once('close', finish);
        child.once('error', finish);
    });
}

async function terminateProcessTree(pid: number): Promise<void> {
    if (process.platform === 'win32') {
        const killer = spawn('taskkill.exe', ['/PID', String(pid), '/T', '/F'], {
            windowsHide: true,
            stdio: 'ignore',
            shell: false
        });
        await waitForChild(killer, 2000);
        return;
    }

    try {
        process.kill(-pid, 'SIGTERM');
    } catch {
        try {
            process.kill(pid, 'SIGTERM');
        } catch {
            return;
        }
    }

    await new Promise<void>(resolvePromise => setTimeout(resolvePromise, 250));
    try {
        process.kill(-pid, 'SIGKILL');
    } catch {
        try {
            process.kill(pid, 'SIGKILL');
        } catch {
            // Process exited after SIGTERM.
        }
    }
}

function resolveCommand(scriptPath: string, fullPath: string, args: string[]): {
    command: string;
    commandArgs: string[];
} {
    const extension = scriptPath.split('.').pop()?.toLowerCase();
    if (extension === 'ts' || extension === 'mts') {
        return {
            command: process.execPath,
            commandArgs: [require.resolve('tsx/cli'), fullPath, ...args]
        };
    }
    if (extension === 'js' || extension === 'mjs' || extension === 'cjs') {
        return { command: process.execPath, commandArgs: [fullPath, ...args] };
    }
    if (extension === 'py') {
        return { command: process.platform === 'win32' ? 'python.exe' : 'python3', commandArgs: [fullPath, ...args] };
    }
    return { command: fullPath, commandArgs: args };
}

export async function runScript(
    scriptPath: string,
    args: string[] = [],
    options: RunScriptOptions = {}
): Promise<ScriptResult> {
    const {
        timeout = 300000,
        cwd = process.cwd(),
        env = process.env
    } = options;
    const fullPath = resolve(cwd, scriptPath);
    const { command, commandArgs } = resolveCommand(scriptPath, fullPath, args);

    return new Promise<ScriptResult>((resolvePromise, rejectPromise) => {
        const spawnOptions: SpawnOptions = {
            cwd,
            env: { ...env },
            shell: false,
            windowsHide: true,
            detached: process.platform !== 'win32'
        };
        const child = spawn(command, commandArgs, spawnOptions);
        let stdout = '';
        let stderr = '';
        let settled = false;
        let timedOut = false;

        const settle = (callback: () => void) => {
            if (settled) return;
            settled = true;
            clearTimeout(timer);
            callback();
        };

        child.stdout?.on('data', data => {
            stdout += String(data);
        });
        child.stderr?.on('data', data => {
            stderr += String(data);
        });

        child.once('error', error => {
            settle(() => rejectPromise(error));
        });
        child.once('close', (code, signal) => {
            if (timedOut) return;
            settle(() => resolvePromise({
                code: code ?? 1,
                signal,
                stdout,
                stderr,
                passed: code === 0
            }));
        });

        const timer = setTimeout(() => {
            timedOut = true;
            const pid = child.pid;
            const termination = pid ? terminateProcessTree(pid) : Promise.resolve();
            void termination.finally(() => {
                settle(() => rejectPromise(new ScriptTimeoutError(timeout, stdout, stderr)));
            });
        }, timeout);
    });
}

export async function scriptExists(scriptPath: string): Promise<boolean> {
    try {
        await access(scriptPath);
        return true;
    } catch {
        return false;
    }
}
