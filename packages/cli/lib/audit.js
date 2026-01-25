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

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ============================================================================
// AUDIT CONFIGURATION
// ============================================================================

const SCAN_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".mjs"];
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage"];

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
            details.push(`✅ ${file.name} found`);
        } else {
            details.push(`⚠️  ${file.name} not found (optional)`);
        }
    });

    // Check for skills
    const skillsDir = path.join(projectRoot, ".agent", "skills");
    if (fs.existsSync(skillsDir)) {
        const skills = fs.readdirSync(skillsDir).filter(f =>
            fs.statSync(path.join(skillsDir, f)).isDirectory()
        );
        details.push(`✅ ${skills.length} skill(s) loaded`);
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
    console.log(`\n⚖️  SMART AUDIT v${VERSION}`);
    console.log(`📂 Target: ${projectRoot}\n`);
    console.log("─".repeat(50));

    let exitCode = 0;
    const startTime = Date.now();

    // Phase 1: Memory Recall
    console.log("\n🧠 [1/3] Memory Recall (Learned Patterns)...\n");

    const db = loadKnowledge();

    if (db.lessons.length === 0) {
        console.log("   ℹ️  No lessons learned yet.");
    } else {
        const results = scanDirectory(projectRoot, db, SCAN_EXTENSIONS);

        if (results.length > 0) {
            const stats = printResults(results);
            saveKnowledge(db); // Save updated hit counts

            if (stats.errors > 0) {
                exitCode = 1;
            }
        } else {
            console.log("   ✅ No violations found.");
        }
    }

    // Phase 2: Governance
    console.log("\n\n📜 [2/3] Governance Check...\n");

    const govResult = checkGovernance(projectRoot);
    govResult.details.forEach(d => console.log(`   ${d}`));

    // Phase 3: Summary
    console.log("\n\n📚 [3/3] Summary...\n");

    const duration = ((Date.now() - startTime) / 1000).toFixed(2);
    console.log(`   ⏱️  Completed in ${duration}s`);
    console.log(`   📊 Lessons in memory: ${db.lessons.length}`);

    const totalHits = db.lessons.reduce((sum, l) => sum + (l.hitCount || 0), 0);
    console.log(`   🎯 Total pattern hits: ${totalHits}`);

    console.log("\n" + "─".repeat(50));

    if (exitCode === 0) {
        console.log("✅ AUDIT PASSED: Code is smart and compliant.");
    } else {
        console.log("❌ AUDIT FAILED: Please fix ERROR violations above.");
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
