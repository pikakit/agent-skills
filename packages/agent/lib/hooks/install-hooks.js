#!/usr/bin/env node
/**
 * Git Hooks Installer
 * 
 * Installs pre-commit hook that runs recall on staged files.
 * 
 * Usage: agent install-hooks
 */

import fs from "fs";
import path from "path";
import { VERSION } from "../config.js";

// ============================================================================
// HOOK TEMPLATES
// ============================================================================

const PRE_COMMIT_HOOK = `#!/bin/sh
# PikaKit Pre-Commit Hook v${VERSION}

# Get staged JS/TS files
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACM | grep -E "\\\\.(js|ts|tsx|jsx|mjs)$")

if [ -z "$STAGED_FILES" ]; then
    exit 0
fi

# Run recall (Clack handles all output)
npx agent recall . 2>/dev/null
exit $?
`;

// ============================================================================
// INSTALLER
// ============================================================================

/**
 * Find .git directory
 * @returns {string|null}
 */
function findGitDir() {
    let dir = process.cwd();

    while (dir !== path.dirname(dir)) {
        const gitDir = path.join(dir, ".git");
        if (fs.existsSync(gitDir)) {
            return gitDir;
        }
        dir = path.dirname(dir);
    }

    return null;
}

/**
 * Install git hooks
 */
function installHooks() {
    console.log(`\n🔧 PikaKit Hooks Installer v${VERSION}\n`);

    const gitDir = findGitDir();

    if (!gitDir) {
        console.log("❌ Not a git repository. Initialize git first:");
        console.log("   git init\n");
        process.exit(1);
    }

    const hooksDir = path.join(gitDir, "hooks");
    const preCommitPath = path.join(hooksDir, "pre-commit");

    // Create hooks directory if missing
    if (!fs.existsSync(hooksDir)) {
        fs.mkdirSync(hooksDir, { recursive: true });
    }

    // Backup existing hook
    if (fs.existsSync(preCommitPath)) {
        const backupPath = preCommitPath + ".backup";
        fs.copyFileSync(preCommitPath, backupPath);
        console.log(`📦 Backed up existing hook to: pre-commit.backup`);
    }

    // Write new hook
    fs.writeFileSync(preCommitPath, PRE_COMMIT_HOOK, { mode: 0o755 });

    console.log("✅ Installed pre-commit hook");
    console.log(`   Location: ${preCommitPath}\n`);

    console.log("📋 What it does:");
    console.log("   • Runs on every commit");
    console.log("   • Checks staged JS/TS files against memory");
    console.log("   • Shows violations (does NOT block commits)\n");

    console.log("💡 Tips:");
    console.log("   • Skip hook: git commit --no-verify");
    console.log("   • Uninstall: rm .git/hooks/pre-commit\n");
}

/**
 * Uninstall hooks
 */
function uninstallHooks() {
    const gitDir = findGitDir();

    if (!gitDir) {
        console.log("❌ Not a git repository.\n");
        process.exit(1);
    }

    const preCommitPath = path.join(gitDir, "hooks", "pre-commit");

    if (fs.existsSync(preCommitPath)) {
        fs.unlinkSync(preCommitPath);
        console.log("✅ Removed pre-commit hook.\n");

        // Restore backup if exists
        const backupPath = preCommitPath + ".backup";
        if (fs.existsSync(backupPath)) {
            fs.renameSync(backupPath, preCommitPath);
            console.log("📦 Restored previous hook from backup.\n");
        }
    } else {
        console.log("ℹ️  No hook installed.\n");
    }
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);

if (args.includes("--help")) {
    console.log(`
🔧 PikaKit Hooks Installer

Usage:
  agent install-hooks           Install git hooks
  agent install-hooks --remove  Remove installed hooks

The pre-commit hook checks staged files against learned
patterns before each commit.
`);
    process.exit(0);
}

if (args.includes("--remove") || args.includes("--uninstall")) {
    uninstallHooks();
} else {
    installHooks();
}
