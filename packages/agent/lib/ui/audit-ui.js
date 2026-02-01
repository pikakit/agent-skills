/**
 * Audit UI - Compliance check with Clack UI
 * 
 * Wrapper for the audit functionality that integrates
 * with the main menu instead of spawning a separate process.
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs";
import path from "path";
import { scanDirectory, loadKnowledge, saveKnowledge } from "../recall.js";
import { VERSION, cwd } from "../config.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const SCAN_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".mjs"];

// ============================================================================
// GOVERNANCE CHECKS
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
            details.push(`${pc.green("✓")} ${file.name} found`);
        } else {
            details.push(`${pc.yellow("⚠")} ${file.name} not found (optional)`);
        }
    });

    // Check for skills
    const skillsDir = path.join(projectRoot, ".agent", "skills");
    if (fs.existsSync(skillsDir)) {
        try {
            const skills = fs.readdirSync(skillsDir).filter(f =>
                fs.statSync(path.join(skillsDir, f)).isDirectory()
            );
            details.push(`${pc.green("✓")} ${skills.length} skill(s) loaded`);
        } catch (e) {
            details.push(`${pc.dim("○")} Skills directory not accessible`);
        }
    }

    return { passed, details };
}

// ============================================================================
// AUDIT UI
// ============================================================================

/**
 * Run audit with Clack UI
 */
export async function runAuditUI() {
    const projectRoot = cwd;

    p.intro(pc.cyan(`Smart Audit v${VERSION}`));

    const startTime = Date.now();
    let hasErrors = false;

    // Phase 1: Memory Recall
    const s1 = p.spinner();
    s1.start("Phase 1: Memory Recall");

    const db = loadKnowledge();

    if (db.lessons.length === 0) {
        s1.stop(pc.dim("Phase 1: No lessons learned yet"));
    } else {
        const { results } = scanDirectory(projectRoot, db);

        // Count violations
        let totalViolations = 0;
        let errorCount = 0;
        let warningCount = 0;

        results.forEach(result => {
            result.violations.forEach(({ lesson, matches }) => {
                totalViolations += matches.length;
                if (lesson.severity === "ERROR") {
                    errorCount += matches.length;
                    hasErrors = true;
                } else {
                    warningCount += matches.length;
                }
            });
        });

        if (totalViolations > 0) {
            s1.stop(`Phase 1: Found ${totalViolations} violation(s)`);

            // Show violations summary
            if (errorCount > 0 || warningCount > 0) {
                p.log.warn(`${pc.red("✖")} ${errorCount} error(s)  ${pc.yellow("⚠")} ${warningCount} warning(s)`);
            }

            saveKnowledge(db);
        } else {
            s1.stop(pc.green("Phase 1: No violations found ✓"));
        }
    }

    // Phase 2: Governance
    const s2 = p.spinner();
    s2.start("Phase 2: Governance Check");

    const govResult = checkGovernance(projectRoot);
    s2.stop("Phase 2: Governance checked");

    p.note(govResult.details.join("\n"), "Governance");

    // Phase 3: Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);

    p.note(
        `${pc.dim("Duration:")}  ${duration}s\n` +
        `${pc.dim("Lessons:")}   ${db.lessons.length} in memory\n` +
        `${pc.dim("Hits:")}      ${totalHits} total`,
        "Summary"
    );

    if (hasErrors) {
        p.outro(pc.red("AUDIT FAILED: Please fix ERROR violations"));
    } else {
        p.outro(pc.green("AUDIT PASSED: Code is compliant"));
    }
}

export default runAuditUI;
