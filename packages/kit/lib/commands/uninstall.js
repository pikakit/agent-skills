/**
 * @fileoverview Uninstall command
 */

import fs from "fs";
import path from "path";
import os from "os";
import prompts from "prompts";
import { resolveScope, createBackup } from "../helpers.js";
import { step, stepLine, success, fatal, c, select, isCancel, cancel } from "../ui.js";
import { DRY } from "../config.js";

/**
 * Remove a skill or all skills
 * @param {string} skillName - Skill name or "all" to remove everything
 */
export async function run(skillName) {
    const scope = resolveScope();

    // Check if skills directory exists
    if (!fs.existsSync(scope)) {
        fatal("No skills directory found");
    }

    // Get list of installed skills
    const skills = fs.readdirSync(scope)
        .filter(item => {
            const itemPath = path.join(scope, item);
            return fs.statSync(itemPath).isDirectory() && fs.existsSync(path.join(itemPath, "SKILL.md"));
        });

    if (skills.length === 0) {
        step("No skills installed");
        return;
    }

    // CASE 1: kit uninstall all → Auto-remove everything
    if (skillName === "all") {
        await removeAllAutomatic(scope, skills);
        return;
    }

    // CASE 2: kit uninstall (no params) → Interactive menu
    if (!skillName) {
        await interactiveRemove(scope, skills);
        return;
    }

    // CASE 3: kit uninstall <skill> → Remove specific skill
    await removeSingleSkill(scope, skillName);
}

/**
 * Interactive menu for skill removal
 */
async function interactiveRemove(scope, skills) {
    stepLine();
    step(`Found ${skills.length} installed skill(s)`);
    stepLine();

    const choice = await select({
        message: "What would you like to do?",
        options: [
            { value: "select", label: "Select specific skill", hint: "Choose one skill to remove" },
            { value: "all", label: "Remove all skills", hint: "Remove everything (with confirmations)" },
            { value: "cancel", label: "Cancel", hint: "Go back" }
        ]
    });

    if (isCancel(choice) || choice === "cancel") {
        cancel("Cancelled");
        return;
    }

    if (choice === "all") {
        await removeAllWithConfirmation(scope, skills);
        return;
    }

    // Select specific skill
    const skillChoice = await select({
        message: "Select skill to remove",
        options: skills.map(s => ({ value: s, label: s }))
    });

    if (isCancel(skillChoice)) {
        cancel("Cancelled");
        return;
    }

    await removeSingleSkill(scope, skillChoice);
}

/**
 * Remove all skills automatically (kit uninstall all)
 */
async function removeAllAutomatic(scope, skills) {
    stepLine();
    step(c.yellow("AUTOMATIC COMPLETE REMOVAL"));
    step(c.dim(`Removing ${skills.length} skill(s) + .agent folder + npm dependencies`));
    stepLine();

    if (DRY) {
        step(`Would remove ${skills.length} skill(s) from: ${scope}`);
        step("Would remove .agent folder");
        step("Would remove npm dependencies");
        return;
    }

    // 1. Remove all skills with backup
    for (const skill of skills) {
        const targetDir = path.join(scope, skill);
        createBackup(targetDir, skill);
        fs.rmSync(targetDir, { recursive: true, force: true });
        step(`✓ Removed: ${skill}`);
    }

    // 2. Remove .agent folder
    const agentDir = path.dirname(scope);
    if (fs.existsSync(agentDir) && path.basename(agentDir) === ".agent") {
        fs.rmSync(agentDir, { recursive: true, force: true });
        step("✓ Removed: .agent folder");
    }

    // 3. Remove npm dependencies
    const cwd = process.cwd();
    const nodeModules = path.join(cwd, "node_modules");
    const packageJson = path.join(cwd, "package.json");
    const packageLock = path.join(cwd, "package-lock.json");

    if (fs.existsSync(nodeModules)) {
        fs.rmSync(nodeModules, { recursive: true, force: true });
        step("✓ Removed: node_modules/");
    }
    if (fs.existsSync(packageJson)) {
        fs.rmSync(packageJson);
        step("✓ Removed: package.json");
    }
    if (fs.existsSync(packageLock)) {
        fs.rmSync(packageLock);
        step("✓ Removed: package-lock.json");
    }

    // 4. For global installs, ask about ~/.gemini/ cleanup
    if (scope.includes(".gemini")) {
        stepLine();
        step(c.yellow("Global Configuration Cleanup"));
        step(c.dim("The entire ~/.gemini/ folder can be removed:"));
        step(c.dim("  • GEMINI.md (global rules)"));
        step(c.dim("  • All Antigravity configs"));
        step(c.dim("  • Cache and backups"));
        stepLine();

        const geminiRoot = path.join(require("os").homedir(), ".gemini");
        if (fs.existsSync(geminiRoot)) {
            // Just remove it automatically in "all" mode
            fs.rmSync(geminiRoot, { recursive: true, force: true });
            step("✓ Removed: ~/.gemini/ (complete cleanup)");
        }
    }

    stepLine();
    success("Complete cleanup done - everything removed");
}

/**
 * Remove all skills with step-by-step confirmations (kit uninstall → all)
 */
async function removeAllWithConfirmation(scope, skills) {
    stepLine();
    step(`Found ${skills.length} skill(s) to remove:`);
    skills.forEach(s => step(`  • ${s}`, "", "dim"));
    stepLine();

    const confirmSkills = await prompts({
        type: "confirm",
        name: "value",
        message: `Remove all ${skills.length} skill(s)?`,
        initial: false
    });

    if (!confirmSkills.value) {
        step("Cancelled");
        return;
    }

    // Remove each skill with backup
    for (const skill of skills) {
        const targetDir = path.join(scope, skill);
        createBackup(targetDir, skill);
        fs.rmSync(targetDir, { recursive: true, force: true });
        step(`Removed: ${skill}`);
    }

    success(`All ${skills.length} skill(s) removed successfully`);
    stepLine();

    // Ask about .agent folder
    const agentDir = path.dirname(scope);
    if (fs.existsSync(agentDir) && path.basename(agentDir) === ".agent") {
        stepLine();
        step(c.yellow("Complete Cleanup"));
        step(c.dim("The following will also be removed:"));
        step(c.dim("  • Agents"));
        step(c.dim("  • Workflows"));
        step(c.dim("  • Knowledge & Lessons"));
        step(c.dim("  • All configuration files"));
        stepLine();

        const confirmAgent = await prompts({
            type: "confirm",
            name: "value",
            message: "Remove entire .agent folder?",
            initial: false
        });

        if (confirmAgent.value) {
            fs.rmSync(agentDir, { recursive: true, force: true });
            success("Complete cleanup done - .agent folder removed");

            // Ask about npm dependencies
            stepLine();
            step(c.yellow("npm Dependencies Cleanup"));
            step(c.dim("The following npm files will also be removed:"));
            step(c.dim("  • node_modules/"));
            step(c.dim("  • package.json"));
            step(c.dim("  • package-lock.json"));
            stepLine();

            const confirmNpm = await prompts({
                type: "confirm",
                name: "value",
                message: "Remove npm dependencies?",
                initial: false
            });

            if (confirmNpm.value) {
                const cwd = process.cwd();
                const nodeModules = path.join(cwd, "node_modules");
                const packageJson = path.join(cwd, "package.json");
                const packageLock = path.join(cwd, "package-lock.json");

                if (fs.existsSync(nodeModules)) {
                    fs.rmSync(nodeModules, { recursive: true, force: true });
                    step("Removed: node_modules/");
                }
                if (fs.existsSync(packageJson)) {
                    fs.rmSync(packageJson);
                    step("Removed: package.json");
                }
                if (fs.existsSync(packageLock)) {
                    fs.rmSync(packageLock);
                    step("Removed: package-lock.json");
                }
                success("npm dependencies removed");
            } else {
                step(c.dim("Kept npm dependencies"));
            }
        } else {
            step(c.dim("Kept .agent folder (agents, workflows, etc.)"));
        }
    }

    stepLine();
}

/**
 * Remove a single skill
 */
async function removeSingleSkill(scope, skillName) {
    const targetDir = path.join(scope, skillName);

    if (!fs.existsSync(targetDir)) {
        fatal(`Skill not found: ${skillName}`);
    }

    if (!fs.existsSync(path.join(targetDir, "SKILL.md"))) {
        fatal(`Not a valid skill: ${skillName}`);
    }

    stepLine();
    step(`Removing skill: ${c.cyan(skillName)}`);

    const confirm = await prompts({
        type: "confirm",
        name: "value",
        message: "Confirm removal?",
        initial: false
    });

    if (!confirm.value) {
        step("Cancelled");
        return;
    }

    if (DRY) {
        step(`Would remove: ${targetDir}`);
        return;
    }

    const backup = createBackup(targetDir, skillName);
    if (backup) step(`Backup created: ${backup}`);

    fs.rmSync(targetDir, { recursive: true, force: true });
    success(`Removed: ${skillName}`);
    stepLine();
}
