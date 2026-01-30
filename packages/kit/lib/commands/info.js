/**
 * @fileoverview Info command
 */

import fs from "fs";
import path from "path";
import { resolveScope, formatDate } from "../helpers.js";
import { step, stepLine, S, c, fatal } from "../ui.js";

/**
 * Show skill info
 * @param {string} name
 */
export async function run(name) {
    if (!name) fatal("Missing skill name");

    const scope = resolveScope();
    const localDir = path.join(scope, name);

    stepLine();

    if (fs.existsSync(localDir)) {
        step(`${c.bold(name)} ${c.green("(installed)")}`, S.diamondFilled, "cyan");
        console.log(`${c.gray(S.branch)}  ${c.dim("Path: " + localDir)}`);

        const mf = path.join(localDir, ".skill-source.json");
        if (fs.existsSync(mf)) {
            const m = JSON.parse(fs.readFileSync(mf, "utf-8"));
            console.log(`${c.gray(S.branch)}  Repo: ${m.repo || "local"}`);
            console.log(`${c.gray(S.branch)}  Installed: ${formatDate(m.installedAt)}`);
        }
        stepLine();
        return;
    }

    step(`Skill not installed: ${name}`, S.diamond, "yellow");
    stepLine();
}
