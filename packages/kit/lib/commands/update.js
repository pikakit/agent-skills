/**
 * @fileoverview Update command
 */

import fs from "fs";
import path from "path";

import { resolveScope, createBackup } from "../helpers.js";
import { step, stepLine, S, c, fatal, spinner } from "../ui.js";
import { DRY } from "../config.js";

/**
 * Update a skill
 * @param {string} skillName
 */
export async function run(skillName) {
    if (!skillName) fatal("Missing skill name");

    const scope = resolveScope();
    const targetDir = path.join(scope, skillName);

    if (!fs.existsSync(targetDir)) fatal(`Skill not found: ${skillName}`);

    const metaFile = path.join(targetDir, ".skill-source.json");
    if (!fs.existsSync(metaFile)) fatal("Skill metadata not found");

    const meta = JSON.parse(fs.readFileSync(metaFile, "utf-8"));
    if (!meta.repo || meta.repo === "local") fatal("Cannot update local skill");

    stepLine();

    const s = spinner();
    s.start(`Updating ${skillName}`);

    try {
        if (!DRY) {
            createBackup(targetDir, skillName);
            fs.rmSync(targetDir, { recursive: true, force: true });
        }

        const spec = `${meta.repo}#${meta.skill}${meta.ref ? "@" + meta.ref : ""}`;

        if (DRY) {
            s.stop("Dry run analysis complete");
            step(`Would update: ${skillName}`);
        } else {
            s.stop("Preparing update...");
            // Dynamically import install command
            const { run: install } = await import("./install.js");
            await install(spec);
        }
    } catch (err) {
        s.fail(`Failed: ${err.message}`);
    }
}
