/**
 * @fileoverview List command
 */

import { getInstalledSkills } from "../skills.js";
import { resolveScope, formatBytes } from "../helpers.js";
import { step, stepLine, S, c, outputJSON } from "../ui.js";
import { VERBOSE, JSON_OUTPUT } from "../config.js";

/**
 * List installed skills
 */
export async function run() {
    stepLine();
    step(c.bold("Installed Skills"), S.diamondFilled, "cyan");
    console.log(`${c.gray(S.branch)}  ${c.dim("Location: " + resolveScope())}`);
    stepLine();

    const skills = getInstalledSkills();

    if (skills.length === 0) {
        step(c.dim("No skills installed."), S.diamond);
        stepLine();
        return;
    }

    if (JSON_OUTPUT) {
        outputJSON({ skills }, true);
        return;
    }

    for (const s of skills) {
        const icon = s.hasSkillMd ? c.green(S.check) : c.yellow(S.diamond);
        console.log(`${c.gray(S.branch)}  ${icon}  ${c.bold(s.name)} ${c.dim("v" + s.version)} ${c.dim("(" + formatBytes(s.size) + ")")}`);
        if (s.description && VERBOSE) {
            console.log(`${c.gray(S.branch)}      ${c.dim(s.description.substring(0, 60))}`);
        }
    }

    stepLine();
    console.log(`${c.gray(S.branch)}  ${c.dim("Total: " + skills.length + " skill(s)")}`);
    stepLine();
}
