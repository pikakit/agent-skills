/**
 * @fileoverview Validate command - Antigravity spec validation
 */

import fs from "fs";
import path from "path";
import { getInstalledSkills, parseSkillMdFrontmatter } from "../skills.js";
import { resolveScope } from "../helpers.js";
import { step, stepLine, S, c, fatal } from "../ui.js";
import { VERBOSE, STRICT } from "../config.js";

/**
 * Validate skills against Antigravity spec
 * @param {string} [skillName] - Optional specific skill
 */
export async function run(skillName) {
    const scope = resolveScope();
    let skillsToValidate = [];

    if (skillName) {
        const sd = path.join(scope, skillName);
        if (!fs.existsSync(sd)) fatal(`Skill not found: ${skillName}`);
        skillsToValidate = [{ name: skillName, path: sd }];
    } else {
        skillsToValidate = getInstalledSkills();
    }

    if (skillsToValidate.length === 0) {
        stepLine();
        step("No skills to validate", S.diamond);
        return;
    }

    stepLine();
    step(c.bold("Antigravity Validation"), S.diamondFilled, "cyan");
    stepLine();

    let totalErrors = 0, totalWarnings = 0;

    for (const skill of skillsToValidate) {
        const errors = [], warnings = [];
        const smp = path.join(skill.path, "SKILL.md");

        if (!fs.existsSync(smp)) {
            errors.push("Missing SKILL.md");
        } else {
            const m = parseSkillMdFrontmatter(smp);
            if (!m.description) errors.push("Missing description");
            else if (m.description.length < 50) warnings.push("Description too short");
        }

        const status = errors.length > 0 ? c.red("FAIL") : warnings.length > 0 ? c.yellow("WARN") : c.green("PASS");
        console.log(`${c.gray(S.branch)}  ${status}  ${c.bold(skill.name)}`);

        if (VERBOSE || errors.length || warnings.length) {
            errors.forEach(e => console.log(`${c.gray(S.branch)}      ${c.red("ERROR: " + e)}`));
            warnings.forEach(w => console.log(`${c.gray(S.branch)}      ${c.yellow("WARN: " + w)}`));
        }

        totalErrors += errors.length;
        totalWarnings += warnings.length;
    }

    stepLine();
    console.log(`${c.gray(S.branch)}  Total: ${skillsToValidate.length}, Errors: ${totalErrors}, Warnings: ${totalWarnings}`);
    stepLine();

    if (STRICT && totalErrors > 0) process.exit(1);
}
