#!/usr/bin/env node
/**
 * Script Runner - PikaKit
 * ================================
 * Executes scripts with timeout, output capture, and error handling.
 */

import { spawn, type ChildProcess } from 'child_process';
import { resolve } from 'path';
import { access } from 'fs/promises';

export interface RunScriptOptions {
    timeout?: number;
    cwd?: string;
    env?: NodeJS.ProcessEnv;
}

export interface ScriptResult {
    code: number;
    stdout: string;
    stderr: string;
    passed: boolean;
}

/**
 * Run a script with timeout and output capture
 */
export async function runScript(
    scriptPath: string,
    args: string[] = [],
    options: RunScriptOptions = {}
): Promise<ScriptResult> {
    const {
        timeout = 300000, // 5 minute default
        cwd = process.cwd(),
        env = process.env
    } = options;

    const fullPath = resolve(cwd, scriptPath);

    // Determine command based on file extension
    const extension = scriptPath.split('.').pop();
    let command: string;
    let commandArgs: string[];

    if (extension === 'ts' || extension === 'mts') {
        command = 'npx';
        commandArgs = ['tsx', fullPath, ...args];
    } else if (extension === 'js' || extension === 'mjs') {
        command = 'node';
        commandArgs = [fullPath, ...args];
    } else if (extension === 'py') {
        command = 'python';
        commandArgs = [fullPath, ...args];
    } else {
        // Assume executable
        command = fullPath;
        commandArgs = args;
    }

    return new Promise<ScriptResult>((resolvePromise, reject) => {
        const child: ChildProcess = spawn(command, commandArgs, {
            cwd,
            env: { ...env },
            shell: true, // Required for npm/node on Windows
            windowsHide: true
        });

        let stdout = '';
        let stderr = '';
        let timedOut = false;

        // Timeout handler
        const timer = setTimeout(() => {
            timedOut = true;
            child.kill('SIGTERM');
            // Force kill after 2s if not terminated
            setTimeout(() => {
                if (!child.killed) {
                    child.kill('SIGKILL');
                }
            }, 2000);
        }, timeout);

        // Capture output
        child.stdout?.on('data', (data: Buffer) => {
            stdout += data.toString();
        });

        child.stderr?.on('data', (data: Buffer) => {
            stderr += data.toString();
        });

        // Handle completion
        child.on('close', (code: number | null) => {
            clearTimeout(timer);

            if (timedOut) {
                reject(new Error(`Timeout: Script exceeded ${timeout}ms`));
            } else {
                resolvePromise({
                    code: code ?? 1,
                    stdout,
                    stderr,
                    passed: code === 0
                });
            }
        });

        // Handle spawn errors
        child.on('error', (err: Error) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

/**
 * Check if a script file exists
 */
export async function scriptExists(scriptPath: string): Promise<boolean> {
    try {
        await access(scriptPath);
        return true;
    } catch {
        return false;
    }
}
