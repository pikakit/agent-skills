/**
 * Script Runner - PikaKit
 * ================================
 * Executes scripts with timeout, output capture, and error handling.
 */

import { spawn } from 'child_process';
import { resolve } from 'path';

/**
 * Run a script with timeout and output capture
 * 
 * @param {string} scriptPath - Path to script (relative or absolute)
 * @param {string[]} args - Arguments to pass to script
 * @param {Object} options - Execution options
 * @param {number} options.timeout - Timeout in milliseconds (default: 300000 = 5 min)
 * @param {string} options.cwd - Working directory
 * @param {Object} options.env - Environment variables
 * @returns {Promise<{code: number, stdout: string, stderr: string, passed: boolean}>}
 */
export async function runScript(scriptPath, args = [], options = {}) {
    const {
        timeout = 300000, // 5 minute default
        cwd = process.cwd(),
        env = process.env
    } = options;

    const fullPath = resolve(cwd, scriptPath);

    // Determine command based on file extension
    const extension = scriptPath.split('.').pop();
    let command, commandArgs;

    if (extension === 'js' || extension === 'mjs') {
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

    return new Promise((resolve, reject) => {
        const child = spawn(command, commandArgs, {
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
        child.stdout?.on('data', (data) => {
            stdout += data.toString();
        });

        child.stderr?.on('data', (data) => {
            stderr += data.toString();
        });

        // Handle completion
        child.on('close', (code) => {
            clearTimeout(timer);

            if (timedOut) {
                reject(new Error(`Timeout: Script exceeded ${timeout}ms`));
            } else {
                resolve({
                    code: code ?? 1,
                    stdout,
                    stderr,
                    passed: code === 0
                });
            }
        });

        // Handle spawn errors
        child.on('error', (err) => {
            clearTimeout(timer);
            reject(err);
        });
    });
}

/**
 * Check if a script file exists
 * @param {string} scriptPath - Path to check
 * @returns {Promise<boolean>}
 */
export async function scriptExists(scriptPath) {
    const { access } = await import('fs/promises');
    try {
        await access(scriptPath);
        return true;
    } catch {
        return false;
    }
}
