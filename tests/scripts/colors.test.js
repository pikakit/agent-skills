/**
 * Unit Tests - Colors Utility
 */
import { describe, it, expect, vi } from 'vitest';
import { colors, printHeader, printStep, printSuccess, printWarning, printError } from '../../../.agent/scripts-js/utils/colors.js';

describe('Colors Utility', () => {
    it('should export ANSI color codes', () => {
        expect(colors.green).toBe('\x1b[92m');
        expect(colors.red).toBe('\x1b[91m');
        expect(colors.yellow).toBe('\x1b[93m');
        expect(colors.blue).toBe('\x1b[94m');
        expect(colors.cyan).toBe('\x1b[96m');
        expect(colors.bold).toBe('\x1b[1m');
        expect(colors.reset).toBe('\x1b[0m');
    });

    it('printSuccess should include green color and checkmark', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        printSuccess('Test passed');

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('\x1b[92m')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('✅')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Test passed')
        );

        consoleSpy.mockRestore();
    });

    it('printError should include red color and X mark', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        printError('Test failed');

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('\x1b[91m')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('❌')
        );

        consoleSpy.mockRestore();
    });

    it('printWarning should include yellow color', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        printWarning('Warning message');

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('\x1b[93m')
        );

        consoleSpy.mockRestore();
    });

    it('printHeader should print formatted header with separators', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        printHeader('TEST HEADER');

        expect(consoleSpy).toHaveBeenCalledTimes(3);
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('='.repeat(70))
        );

        consoleSpy.mockRestore();
    });
});
