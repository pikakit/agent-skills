/**
 * Unit Tests - Reporter Utility
 */
import { describe, it, expect, vi } from 'vitest';
import { formatJsonOutput, printSummary, printFinalReport } from '../../../.agent/scripts-js/utils/reporter.js';

describe('Reporter', () => {
    const mockResults = [
        { name: 'Test 1', passed: true, skipped: false, duration: 1.5 },
        { name: 'Test 2', passed: false, skipped: false, duration: 2.0, error: 'Failed' },
        { name: 'Test 3', passed: true, skipped: true }
    ];

    it('should format JSON output with correct structure', () => {
        const startTime = new Date(Date.now() - 5000);
        const json = formatJsonOutput(mockResults, '/project/path', 'http://localhost:3000', startTime);
        const parsed = JSON.parse(json);

        expect(parsed.version).toBe('3.2.0');
        expect(parsed.project_path).toBe('/project/path');
        expect(parsed.url).toBe('http://localhost:3000');
        expect(parsed.summary.total).toBe(3);
        expect(parsed.summary.passed).toBe(1);
        expect(parsed.summary.failed).toBe(1);
        expect(parsed.summary.skipped).toBe(1);
        expect(parsed.results).toHaveLength(3);
    });

    it('should handle null URL in JSON output', () => {
        const json = formatJsonOutput(mockResults, '/path', null, new Date());
        const parsed = JSON.parse(json);

        expect(parsed.url).toBeNull();
    });

    it('printSummary should return false when checks fail', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        const result = printSummary(mockResults);

        expect(result).toBe(false);
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('❌ Failed: 1')
        );

        consoleSpy.mockRestore();
    });

    it('printSummary should return true when all checks pass', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        const passingResults = [
            { name: 'Test 1', passed: true, skipped: false },
            { name: 'Test 2', passed: true, skipped: false }
        ];

        const result = printSummary(passingResults);

        expect(result).toBe(true);
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('All checks PASSED')
        );

        consoleSpy.mockRestore();
    });

    it('printFinalReport should include category breakdown', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        const categorizedResults = [
            { name: 'Security', passed: true, skipped: false, category: 'Security', duration: 1.0 },
            { name: 'Lint', passed: true, skipped: false, category: 'Code Quality', duration: 0.5 }
        ];

        printFinalReport(categorizedResults, new Date(Date.now() - 3000));

        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Security:')
        );
        expect(consoleSpy).toHaveBeenCalledWith(
            expect.stringContaining('Code Quality:')
        );

        consoleSpy.mockRestore();
    });

    it('printFinalReport should return false on failures', () => {
        const consoleSpy = vi.spyOn(console, 'log').mockImplementation(() => { });

        const result = printFinalReport(mockResults, new Date());

        expect(result).toBe(false);

        consoleSpy.mockRestore();
    });
});
