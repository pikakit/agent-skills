/**
 * Process Manager - PikaKit
 * ==================================
 * Cross-platform process management (PID files, process detection, termination)
 * Replacement for Python os.kill + taskkill
 */

import { readFile, writeFile, unlink } from 'fs/promises';
import { resolve } from 'path';

/**
 * Save PID to file
 * @param {string} pidFile - Path to PID file
 * @param {number} pid - Process ID
 */
export async function savePid(pidFile, pid) {
    await writeFile(pidFile, pid.toString(), 'utf-8');
}

/**
 * Load PID from file
 * @param {string} pidFile - Path to PID file
 * @returns {Promise<number|null>} - PID or null if file doesn't exist
 */
export async function loadPid(pidFile) {
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
 * @param {string} pidFile - Path to PID file
 */
export async function deletePidFile(pidFile) {
    try {
        await unlink(pidFile);
    } catch {
        // Ignore if file doesn't exist
    }
}

/**
 * Check if process is running
 * @param {number} pid - Process ID
 * @returns {boolean}
 */
export function isRunning(pid) {
    try {
        // Sending signal 0 checks existence without killing
        process.kill(pid, 0);
        return true;
    } catch (err) {
        // ESRCH = No such process
        return err.code !== 'ESRCH';
    }
}

/**
 * Kill process tree (cross-platform)
 * Uses tree-kill package for reliable process tree termination
 * 
 * @param {number} pid - Process ID
 * @param {string} signal - Signal to send (default: SIGTERM)
 * @returns {Promise<void>}
 */
export async function killProcess(pid, signal = 'SIGTERM') {
    // For now, use native process.kill
    // TODO: Add tree-kill package for better Windows support
    return new Promise((resolve, reject) => {
        try {
            if (!isRunning(pid)) {
                resolve();
                return;
            }

            process.kill(pid, signal);

            // Wait for process to die
            const checkInterval = setInterval(() => {
                if (!isRunning(pid)) {
                    clearInterval(checkInterval);
                    resolve();
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
                resolve();
            }, 5000);

        } catch (err) {
            if (err.code === 'ESRCH') {
                // Process already dead
                resolve();
            } else {
                reject(err);
            }
        }
    });
}

/**
 * Kill process tree using platform-specific commands
 * Fallback when tree-kill is not available
 * 
 * @param {number} pid - Process ID
 */
export async function killProcessTree(pid) {
    const { exec } = await import('child_process');
    const { promisify } = await import('util');
    const execAsync = promisify(exec);

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
            await new Promise(resolve => setTimeout(resolve, 2000));

            if (isRunning(pid)) {
                process.kill(-pid, 'SIGKILL');
            }
        } catch {
            // Ignore errors
        }
    }
}
