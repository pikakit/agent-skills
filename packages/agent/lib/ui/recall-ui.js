/**
 * Recall UI - Scan files for violations
 */
import {
    showIntro,
    textInput,
    createSpinner,
    showSuccessNote,
    showErrorNote,
    theme,
} from "./clack-helpers.js";
import { scanDirectory, loadKnowledge, saveKnowledge, scanDirectoryStructured, saveScanResult } from "../recall.js";
import * as p from "@clack/prompts";
import fs from "fs";
import path from "path";

// ============================================================================
// GOVERNANCE CHECK
// ============================================================================

/**
 * Check if governance files exist
 * @param {string} projectRoot 
 * @returns {{ passed: boolean, details: string[] }}
 */
function checkGovernance(projectRoot) {
    const details = [];
    let passed = true;

    const governanceFiles = [
        { path: path.join(projectRoot, ".agent", "GEMINI.md"), name: "GEMINI.md" },
        { path: path.join(projectRoot, ".agent", "ARCHITECTURE.md"), name: "ARCHITECTURE.md" }
    ];

    governanceFiles.forEach(file => {
        if (fs.existsSync(file.path)) {
            details.push(`✓ ${file.name} found`);
        } else {
            details.push(`⚠ ${file.name} not found (optional)`);
        }
    });

    // Check for skills
    const skillsDir = path.join(projectRoot, ".agent", "skills");
    if (fs.existsSync(skillsDir)) {
        try {
            const skills = fs.readdirSync(skillsDir).filter(f =>
                fs.statSync(path.join(skillsDir, f)).isDirectory()
            );
            details.push(`✓ ${skills.length} skill(s) loaded`);
        } catch (e) {
            details.push(`○ Skills directory not accessible`);
        }
    }

    return { passed, details };
}

// ============================================================================
// RECALL UI
// ============================================================================

/**
 * Show detailed violation breakdown after scan
 */
async function showViolationDetails(scanResult) {
    console.log(`\n${'─'.repeat(60)}`);
    console.log(`${theme.primary('📋 Violation Details')}`);
    console.log(`${'─'.repeat(60)}\n`);

    // Group by severity
    const errors = scanResult.issues.filter(i => i.severity === 'ERROR');
    const warnings = scanResult.issues.filter(i => i.severity === 'WARNING');

    // Show summary
    console.log(theme.bold('Summary:'));
    console.log(`  ${theme.error('✗')} ${errors.length} errors`);
    console.log(`  ${theme.warning('⚠')} ${warnings.length} warnings`);
    console.log(`  Total: ${scanResult.totalIssues} violations\n`);

    // Group by file
    const byFile = {};
    scanResult.issues.forEach(issue => {
        const file = path.relative(process.cwd(), issue.file);
        if (!byFile[file]) byFile[file] = [];
        byFile[file].push(issue);
    });

    const fileList = Object.entries(byFile).sort((a, b) => b[1].length - a[1].length);

    console.log(theme.bold('Top Files with Issues:'));
    fileList.slice(0, 10).forEach(([file, issues], i) => {
        const errorCount = issues.filter(i => i.severity === 'ERROR').length;
        const warnCount = issues.filter(i => i.severity === 'WARNING').length;
        console.log(`  ${i + 1}. ${theme.primary(file)}`);
        console.log(`     ${theme.error(`${errorCount} errors`)} • ${theme.warning(`${warnCount} warnings`)}`);
    });

    if (fileList.length > 10) {
        console.log(theme.dim(`\n  ... and ${fileList.length - 10} more files`));
    }

    console.log(`\n${'─'.repeat(60)}\n`);

    // Wait for user
    await p.select({
        message: "What's next?",
        options: [
            { value: "back", label: "← Back to Main Menu" }
        ]
    });
}


export async function runRecallUI(autoScan = false) {
    showIntro("🔍 Recall - Scan Violations");

    let targetPath;

    // Scan All mode - skip directory selection
    if (autoScan) {
        targetPath = ".";

        const spinner = createSpinner('Scanning entire project...');

        try {
            const db = loadKnowledge();

            if (!db.lessons || db.lessons.length === 0) {
                spinner.stop("No patterns");
                showErrorNote("No lessons learned yet. Use the Learn command first.", "No Patterns");
                return;
            }

            // Use structured scan
            const scanResult = scanDirectoryStructured(targetPath, db);

            // Save to disk
            saveScanResult(scanResult);

            // Update hit counts
            saveKnowledge(db);

            spinner.stopSuccess("Scan complete");

            // Display summary
            if (scanResult.totalIssues === 0) {
                showSuccessNote(
                    `Scanned ${theme.primary(scanResult.summary.filesScanned)} files\nNo violations found! 🎉`,
                    "✓ All Clear"
                );
            } else {
                console.log('');
                showErrorNote(
                    `${theme.error(scanResult.totalIssues)} violations found\n` +
                    `${theme.error(`${scanResult.summary.errors} errors`)} • ${theme.warning(`${scanResult.summary.warnings} warnings`)}`,
                    `✗ Scan Results`
                );

                p.note(
                    `Scan ID: ${theme.primary(scanResult.scanId)}\n\n` +
                    `Results saved to: .agent/scans/${scanResult.scanId}.json`,
                    '📋 Scan Complete'
                );

                // Offer to fix violations immediately
                const fixAction = await p.select({
                    message: `Found ${scanResult.totalIssues} violation(s). What would you like to do?`,
                    options: [
                        { value: "fix", label: "🔧 Fix All", hint: "Auto-fix violations now" },
                        { value: "skip", label: "← Skip", hint: "Return to menu" }
                    ]
                });

                if (!p.isCancel(fixAction) && fixAction === "fix") {
                    // Import and run Fix All with current scan ID
                    const { runFixAllUI } = await import('./fix-all-ui.js');
                    await runFixAllUI(scanResult.scanId);
                }
            }

        } catch (error) {
            spinner.stopError("Scan failed");
            showErrorNote(error.message, "✗ Error");
        }

        return;
    }

    // Get file/directory path via select menu
    const pathChoice = await p.select({
        message: "Select directory to scan:",
        options: [
            { value: ".", label: "Current Directory", hint: "Scan entire project" },
            { value: "packages", label: "packages/", hint: "All monorepo packages" },
            { value: "packages/agent", label: "packages/agent/", hint: "CLI package only" },
            { value: "packages/agent/lib", label: "packages/agent/lib/", hint: "Library code" },
            { value: ".agent", label: ".agent/", hint: "Agent configuration" },
            { value: "custom", label: "Custom Path", hint: "Enter manually" }
        ]
    });

    if (p.isCancel(pathChoice)) {
        p.cancel("Cancelled");
        return;
    }

    targetPath = pathChoice;

    // If custom path, ask for input
    if (pathChoice === "custom") {
        targetPath = await textInput({
            message: "Enter custom path:",
            placeholder: "e.g., src/components",
            validate: (value) => {
                if (!value) return "Please enter a path";
            },
        });

        if (p.isCancel(targetPath)) {
            p.cancel("Cancelled");
            return;
        }
    }

    // Run scan
    const spinner = createSpinner(`Scanning ${targetPath}...`);

    try {
        const db = loadKnowledge();

        if (!db.lessons || db.lessons.length === 0) {
            spinner.stop("No patterns");
            showErrorNote("No lessons learned yet. Use the Learn command first.", "No Patterns");
            return;
        }

        const resolvedPath = path.resolve(targetPath);
        const { results } = scanDirectory(resolvedPath, db);
        spinner.stopSuccess("Scan complete");

        // Calculate stats
        let totalViolations = 0;
        let errorCount = 0;
        let warningCount = 0;
        const violationsByFile = [];

        results.forEach(result => {
            if (result.violations.length === 0) return;

            result.violations.forEach(({ lesson, matches }) => {
                totalViolations += matches.length;
                if (lesson.severity === "ERROR") {
                    errorCount += matches.length;
                } else {
                    warningCount += matches.length;
                }
            });

            violationsByFile.push(result);
        });

        // Display results
        if (totalViolations === 0) {
            showSuccessNote(
                `Scanned ${theme.primary(results.length)} files\nNo violations found! 🎉`,
                "✓ All Clear"
            );
        } else {
            // Simple summary
            console.log('');
            showErrorNote(
                `${theme.error(totalViolations)} violations found\n` +
                `${theme.error(`${errorCount} errors`)} • ${theme.warning(`${warningCount} warnings`)} across ${violationsByFile.length} files`,
                `✗ Scan Results`
            );

            // Show top 3 critical issues only
            const topIssues = [];
            violationsByFile.slice(0, 3).forEach(result => {
                const fileName = path.relative(process.cwd(), result.file);
                result.violations.forEach(({ lesson, matches }) => {
                    if (lesson.severity === "ERROR" || topIssues.length < 3) {
                        topIssues.push({
                            file: fileName,
                            message: lesson.message,
                            line: matches[0].line,
                            severity: lesson.severity
                        });
                    }
                });
            });

            // Display top issues
            if (topIssues.length > 0) {
                console.log(theme.dim('\nTop Issues:\n'));
                topIssues.slice(0, 3).forEach((issue, i) => {
                    const icon = issue.severity === "ERROR" ? theme.error('✗') : theme.warning('⚠');
                    console.log(`${i + 1}. ${icon} ${theme.primary(issue.file)}:${issue.line}`);
                    console.log(`   ${theme.dim(issue.message)}\n`);
                });

                if (violationsByFile.length > 3) {
                    console.log(theme.dim(`... and ${violationsByFile.length - 3} more files with issues\n`));
                }
            }

            // Ask if user wants to auto-fix violations
            const fixAction = await p.select({
                message: `Found ${totalViolations} violation(s). What would you like to do?`,
                options: [
                    { value: "fix", label: "🔧 Fix All", hint: "Auto-fix violations now" },
                    { value: "skip", label: "← Skip", hint: "Return to menu" }
                ]
            });

            if (!p.isCancel(fixAction) && fixAction === "fix") {
                // Import and run Fix All
                const { runFixAllUI } = await import('./fix-all-ui.js');
                await runFixAllUI();
            }

            // Save updated hit counts
            saveKnowledge(db);
        }

        // Governance Check
        const govSpinner = createSpinner("Checking governance...");
        const govResult = checkGovernance(resolvedPath);
        govSpinner.stopSuccess("Governance checked");

        // Simple governance display
        const govStatus = govResult.details.filter(d => d.startsWith('✓')).length;
        console.log(`\n${theme.dim('Governance:')} ${govStatus}/${govResult.details.length} checks passed\n`);

    } catch (error) {
        spinner.stopError("Scan failed");
        showErrorNote(error.message, "✗ Error");
    }
}

export default runRecallUI;
