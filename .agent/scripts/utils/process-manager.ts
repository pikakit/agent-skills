#!/usr/bin/env node
/**
 * Process Manager - PikaKit
 * ==================================
 * Cross-platform process management (PID files, process detection, termination)
 */

import { readFile, writeFile, unlink } from 'fs/promises';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

/**
 * Save PID to file
 */
export async function savePid(pidFile: string, pid: number): Promise<void> {
    await writeFile(pidFile, pid.toString(), 'utf-8');
}

/**
 * Load PID from file
 */
export async function loadPid(pidFile: string): Promise<number | null> {
    try {
        const content = await readFile(pidFile, 'utf-8');
        const pid = parseInt(content.trim(), 10);
        return isNaN(pid) ? null : pid;
    } catch {
        return null;
    }
}

/**
 * Delete PID file
 */
export async function deletePidFile(pidFile: string): Promise<void> {
    try {
        await unlink(pidFile);
    } catch {
        // Ignore if file doesn't exist
    }
}

/**
 * Check if process is running
 */
export function isRunning(pid: number): boolean {
    try {
        // Sending signal 0 checks existence without killing
        process.kill(pid, 0);
        return true;
    } catch (err: unknown) {
        // ESRCH = No such process
        return (err as NodeJS.ErrnoException).code !== 'ESRCH';
    }
}

/**
 * Kill process with signal
 */
export async function killProcess(pid: number, signal: NodeJS.Signals = 'SIGTERM'): Promise<void> {
    return new Promise<void>((resolvePromise) => {
        try {
            if (!isRunning(pid)) {
                resolvePromise();
                return;
            }

            process.kill(pid, signal);

            // Wait for process to die
            const checkInterval = setInterval(() => {
                if (!isRunning(pid)) {
                    clearInterval(checkInterval);
                    resolvePromise();
                }
            }, 100);

            // Timeout after 5 seconds, force kill
            setTimeout(() => {
                clearInterval(checkInterval);
                try {
                    if (isRunning(pid)) {
                        process.kill(pid, 'SIGKILL');
                    }
                } catch {
                    // Process already dead
                }
                resolvePromise();
            }, 5000);

        } catch (err: unknown) {
            if ((err as NodeJS.ErrnoException).code === 'ESRCH') {
                // Process already dead
                resolvePromise();
            } else {
                // Still resolve — best effort
                resolvePromise();
            }
        }
    });
}

/**
 * Kill process tree using platform-specific commands
 */
export async function killProcessTree(pid: number): Promise<void> {
    if (process.platform === 'win32') {
        // Windows: Use taskkill with /T (tree) flag
        try {
            await execAsync(`taskkill /F /T /PID ${pid}`);
        } catch {
            // Ignore errors (process might already be dead)
        }
    } else {
        // Unix: Kill process group
        try {
            process.kill(-pid, 'SIGTERM');

            // Wait 2s then SIGKILL if still alive
            await new Promise<void>(resolve => setTimeout(resolve, 2000));

            if (isRunning(pid)) {
                process.kill(-pid, 'SIGKILL');
            }
        } catch {
            // Ignore errors
        }
    }
}
