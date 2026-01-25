#!/usr/bin/env node
/**
 * Smart Audit Script (Production-Ready)
 * 
 * The "Judge" - Orchestrates all compliance checks:
 * 1. Memory Recall (Past Mistakes)
 * 2. Constitution Checks (Governance)
 * 3. Real-time Analysis
 * 
 * Usage: ag-smart audit [directory]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { scanDirectory, loadKnowledge, saveKnowledge, printResults } from "./recall.js";
import { AGENT_DIR, VERSION } from "./config.js";
import * as p from "@clack/prompts";
import pc from "picocolors";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// AUDIT CONFIGURATION
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
        const skills = fs.readdirSync(skillsDir).filter(f =>
            fs.statSync(path.join(skillsDir, f)).isDirectory()
        );
        details.push(`${pc.green("✓")} ${skills.length} skill(s) loaded`);
    }

    return { passed, details };
}

// ============================================================================
// MAIN AUDIT
// ============================================================================

/**
 * Run full audit on a project
 * @param {string} projectRoot 
 */
async function runAudit(projectRoot) {
    p.intro(pc.cyan(`⚖️  SMART AUDIT v${VERSION}`));

    let exitCode = 0;
    const startTime = Date.now();

    // Phase 1: Memory Recall
    const s1 = p.spinner();
    s1.start("Phase 1: Memory Recall");

    const db = loadKnowledge();

    if (db.lessons.length === 0) {
        s1.stop("Phase 1: No lessons learned yet");
    } else {
        const { results } = scanDirectory(projectRoot, db, SCAN_EXTENSIONS);

        if (results.length > 0) {
            const stats = printResults(results);
            saveKnowledge(db);

            if (stats.errors > 0) {
                exitCode = 1;
            }
            s1.stop(`Phase 1: Found ${stats.total} violation(s)`);
        } else {
            s1.stop("Phase 1: No violations found");
        }
    }

    // Phase 2: Governance
    const s2 = p.spinner();
    s2.start("Phase 2: Governance Check");

    const govResult = checkGovernance(projectRoot);
    s2.stop("Phase 2: Governance checked");

    p.note(govResult.details.join("\n"), pc.dim("Governance"));

    // Phase 3: Summary
    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);

    const summaryLines = [
        `⏱️  Completed in ${duration}s`,
        `📊 Lessons in memory: ${db.lessons.length}`,
        `🎯 Total pattern hits: ${totalHits}`
    ];
    p.note(summaryLines.join("\n"), pc.dim("Summary"));

    if (exitCode === 0) {
        p.outro(pc.green("✅ AUDIT PASSED: Code is smart and compliant"));
    } else {
        p.outro(pc.red("❌ AUDIT FAILED: Please fix ERROR violations"));
    }

    process.exit(exitCode);
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const projectRoot = args[0] || process.cwd();

if (args.includes("--help")) {
    console.log(`
⚖️  Smart Audit - Compliance Checker

Usage:
  ag-smart audit [directory]

Options:
  --help    Show this help
`);
    process.exit(0);
}

runAudit(projectRoot);
