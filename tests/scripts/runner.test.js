/**
 * Unit Tests - Script Runner Utility
 */
import { describe, it, expect, beforeEach } from 'vitest';
import { runScript, scriptExists } from '../../../.agent/scripts-js/utils/runner.js';
import { writeFile, unlink, mkdir } from 'fs/promises';
import { join } from 'path';

const TEST_DIR = join(process.cwd(), 'tests', 'scripts', '.tmp');

describe('Script Runner', () => {
    beforeEach(async () => {
        try {
            await mkdir(TEST_DIR, { recursive: true });
        } catch {
            // Directory exists
        }
    });

    it('should execute a simple script and capture output', async () => {
        const testScript = join(TEST_DIR, 'test-echo.js');
        await writeFile(testScript, `console.log('Hello World');`, 'utf-8');

        const result = await runScript(testScript, []);

        expect(result.code).toBe(0);
        expect(result.passed).toBe(true);
        expect(result.stdout).toContain('Hello World');

        await unlink(testScript);
    }, 10000);

    it('should capture stderr on error', async () => {
        const testScript = join(TEST_DIR, 'test-error.js');
        await writeFile(testScript, `console.error('Error message'); process.exit(1);`, 'utf-8');

        const result = await runScript(testScript, []);

        expect(result.code).toBe(1);
        expect(result.passed).toBe(false);
        expect(result.stderr).toContain('Error message');

        await unlink(testScript);
    }, 10000);

    it('should timeout long-running scripts', async () => {
        const testScript = join(TEST_DIR, 'test-timeout.js');
        await writeFile(testScript, `setTimeout(() => {}, 10000);`, 'utf-8');

        await expect(
            runScript(testScript, [], { timeout: 500 })
        ).rejects.toThrow('Timeout');

        await unlink(testScript);
    }, 15000);

    it('should pass arguments to script', async () => {
        const testScript = join(TEST_DIR, 'test-args.js');
        await writeFile(testScript, `console.log(process.argv.slice(2).join(' '));`, 'utf-8');

        const result = await runScript(testScript, ['arg1', 'arg2']);

        expect(result.stdout).toContain('arg1 arg2');

        await unlink(testScript);
    }, 10000);

    it('scriptExists should detect existing files', async () => {
        const testFile = join(TEST_DIR, 'exists.js');
        await writeFile(testFile, '', 'utf-8');

        const exists = await scriptExists(testFile);
        expect(exists).toBe(true);

        await unlink(testFile);
    });

    it('scriptExists should return false for missing files', async () => {
        const exists = await scriptExists(join(TEST_DIR, 'nonexistent.js'));
        expect(exists).toBe(false);
    });
});
