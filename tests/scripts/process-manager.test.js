/**
 * Unit Tests - Process Manager Utility
 */
import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { savePid, loadPid, deletePidFile, isRunning } from '../../../.agent/scripts-js/utils/process-manager.js';
import { spawn } from 'child_process';
import { join } from 'path';
import { unlink } from 'fs/promises';

const TEST_PID_FILE = join(process.cwd(), 'tests', 'scripts', '.tmp', 'test.pid');

describe('Process Manager', () => {
    afterEach(async () => {
        try {
            await unlink(TEST_PID_FILE);
        } catch {
            // File may not exist
        }
    });

    it('should save PID to file', async () => {
        await savePid(TEST_PID_FILE, 12345);

        const loaded = await loadPid(TEST_PID_FILE);
        expect(loaded).toBe(12345);
    });

    it('should load PID from file', async () => {
        await savePid(TEST_PID_FILE, 99999);

        const pid = await loadPid(TEST_PID_FILE);
        expect(pid).toBe(99999);
    });

    it('should return null for missing PID file', async () => {
        const pid = await loadPid(join(process.cwd(), 'nonexistent.pid'));
        expect(pid).toBeNull();
    });

    it('should return null for invalid PID content', async () => {
        const { writeFile } = await import('fs/promises');
        await writeFile(TEST_PID_FILE, 'not-a-number', 'utf-8');

        const pid = await loadPid(TEST_PID_FILE);
        expect(pid).toBeNull();
    });

    it('should delete PID file', async () => {
        await savePid(TEST_PID_FILE, 11111);
        await deletePidFile(TEST_PID_FILE);

        const pid = await loadPid(TEST_PID_FILE);
        expect(pid).toBeNull();
    });

    it('should detect running process (current process)', () => {
        const running = isRunning(process.pid);
        expect(running).toBe(true);
    });

    it('should detect non-existent process', () => {
        // PID 999999 should not exist
        const running = isRunning(999999);
        expect(running).toBe(false);
    });

    it('should detect spawned child process', () => {
        const child = spawn('node', ['-e', 'setTimeout(() => {}, 5000)'], {
            detached: true,
            stdio: 'ignore'
        });

        const running = isRunning(child.pid);
        expect(running).toBe(true);

        // Clean up
        child.kill('SIGTERM');
    });
});
