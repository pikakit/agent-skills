/**
 * Reporter - PikaKit
 * ===========================
 * Result formatting utilities (JSON, summary tables)
 * Replacement for Python report formatting functions
 */

import { colors } from './colors.js';

/**
 * Format validation results as JSON
 * 
 * @param {Array} results - Array of check results
 * @param {string} projectPath - Project path
 * @param {string|null} url - URL if provided
 * @param {Date} startTime - Start time
 * @returns {string} JSON string
 */
export function formatJsonOutput(results, projectPath, url, startTime) {
    const totalDuration = (Date.now() - startTime.getTime()) / 1000;

    const output = {
        version: '3.2.0',
        timestamp: new Date().toISOString(),
        project_path: projectPath,
        url: url || null,
        summary: {
            total: results.length,
            passed: results.filter(r => r.passed && !r.skipped).length,
            failed: results.filter(r => !r.passed && !r.skipped).length,
            skipped: results.filter(r => r.skipped).length,
            duration: Math.round(totalDuration * 100) / 100
        },
        results: results.map(r => ({
            name: r.name,
            passed: r.passed,
            skipped: r.skipped || false,
            duration: r.duration || 0,
            output: r.output || '',
            error: r.error || ''
        }))
    };

    return JSON.stringify(output, null, 2);
}

/**
 * Print summary of validation results
 * 
 * @param {Array} results - Array of check results
 * @returns {boolean} - True if all passed
 */
export function printSummary(results) {
    console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'📊 CHECKLIST SUMMARY'.padStart(38)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'='.repeat(60)}${colors.reset}\n`);

    const passedCount = results.filter(r => r.passed && !r.skipped).length;
    const failedCount = results.filter(r => !r.passed && !r.skipped).length;
    const skippedCount = results.filter(r => r.skipped).length;

    console.log(`Total Checks: ${results.length}`);
    console.log(`${colors.green}✅ Passed: ${passedCount}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failedCount}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${skippedCount}${colors.reset}\n`);

    // Detailed results
    for (const r of results) {
        let status;
        if (r.skipped) {
            status = `${colors.yellow}⏭️ ${colors.reset}`;
        } else if (r.passed) {
            status = `${colors.green}✅${colors.reset}`;
        } else {
            status = `${colors.red}❌${colors.reset}`;
        }
        console.log(`${status} ${r.name}`);
    }

    console.log();

    if (failedCount > 0) {
        console.log(`${colors.red}❌ ${failedCount} check(s) FAILED - Please fix before proceeding${colors.reset}`);
        return false;
    } else {
        console.log(`${colors.green}✅ All checks PASSED ✨${colors.reset}`);
        return true;
    }
}

/**
 * Print comprehensive final report with category breakdown
 * 
 * @param {Array} results - Array of check results with category field
 * @param {Date} startTime - Start time
 * @returns {boolean} - True if all passed
 */
export function printFinalReport(results, startTime) {
    const totalDuration = (Date.now() - startTime.getTime()) / 1000;

    console.log(`\n${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'📊 FULL VERIFICATION REPORT'.padStart(48)}${colors.reset}`);
    console.log(`${colors.bold}${colors.cyan}${'='.repeat(70)}${colors.reset}\n`);

    // Statistics
    const total = results.length;
    const passed = results.filter(r => r.passed && !r.skipped).length;
    const failed = results.filter(r => !r.passed && !r.skipped).length;
    const skipped = results.filter(r => r.skipped).length;

    console.log(`Total Duration: ${totalDuration.toFixed(1)}s`);
    console.log(`Total Checks: ${total}`);
    console.log(`${colors.green}✅ Passed: ${passed}${colors.reset}`);
    console.log(`${colors.red}❌ Failed: ${failed}${colors.reset}`);
    console.log(`${colors.yellow}⏭️  Skipped: ${skipped}${colors.reset}\n`);

    // Category breakdown
    console.log(`${colors.bold}Results by Category:${colors.reset}`);
    let currentCategory = null;

    for (const r of results) {
        // Print category header if changed
        if (r.category && r.category !== currentCategory) {
            currentCategory = r.category;
            console.log(`\n${colors.bold}${colors.cyan}${currentCategory}:${colors.reset}`);
        }

        // Print result
        let status;
        if (r.skipped) {
            status = `${colors.yellow}⏭️ ${colors.reset}`;
        } else if (r.passed) {
            status = `${colors.green}✅${colors.reset}`;
        } else {
            status = `${colors.red}❌${colors.reset}`;
        }

        const durationStr = !r.skipped && r.duration ? ` (${r.duration.toFixed(1)}s)` : '';
        console.log(`  ${status} ${r.name}${durationStr}`);
    }

    console.log();

    // Failed checks detail
    if (failed > 0) {
        console.log(`${colors.bold}${colors.red}❌ FAILED CHECKS:${colors.reset}`);
        for (const r of results) {
            if (!r.passed && !r.skipped) {
                console.log(`\n${colors.red}✗ ${r.name}${colors.reset}`);
                if (r.error) {
                    const errorPreview = r.error.substring(0, 200);
                    console.log(`  Error: ${errorPreview}`);
                }
            }
        }
        console.log();
    }

    // Final verdict
    if (failed > 0) {
        console.log(`${colors.red}❌ VERIFICATION FAILED - ${failed} check(s) need attention${colors.reset}`);
        console.log(`\n${colors.yellow}💡 Tip: Fix critical (security, lint) issues first${colors.reset}\n`);
        return false;
    } else {
        console.log(`${colors.green}✨ ALL CHECKS PASSED - Ready for deployment! ✨${colors.reset}\n`);
        return true;
    }
}
