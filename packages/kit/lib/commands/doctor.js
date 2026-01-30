/**
 * @fileoverview Doctor command - Health check
 */

import fs from "fs";
import path from "path";
import { resolveScope, merkleHash, loadSkillLock } from "../helpers.js";
import { step, stepLine, S, c } from "../ui.js";
import { STRICT, FIX, DRY, cwd } from "../config.js";

/**
 * Run health check on installed skills
 */
export async function run() {
    const scope = resolveScope();

    if (!fs.existsSync(scope)) {
        stepLine();
        step("No skills directory found", S.diamond);
        return;
    }

    stepLine();
    step(c.bold("Health Check"), S.diamondFilled, "cyan");
    stepLine();

    let errors = 0, warnings = 0;
    const lock = fs.existsSync(path.join(cwd, ".agent", "skill-lock.json")) ? loadSkillLock() : null;

    for (const name of fs.readdirSync(scope)) {
        const dir = path.join(scope, name);
        if (!fs.statSync(dir).isDirectory()) continue;

        // Check SKILL.md
        if (!fs.existsSync(path.join(dir, "SKILL.md"))) {
            step(`${name}: ${c.red("missing SKILL.md")}`, S.cross, "red");
            errors++;
            continue;
        }

        // Check metadata
        const mf = path.join(dir, ".skill-source.json");
        if (!fs.existsSync(mf)) {
            step(`${name}: ${c.red("missing metadata")}`, S.cross, "red");
            errors++;
            continue;
        }

        const m = JSON.parse(fs.readFileSync(mf, "utf-8"));
        const actual = merkleHash(dir);

        // Check checksum
        if (actual !== m.checksum) {
            if (FIX && !DRY) {
                m.checksum = actual;
                fs.writeFileSync(mf, JSON.stringify(m, null, 2));
                step(`${name}: ${c.yellow("checksum fixed")}`, S.diamond, "yellow");
            } else {
                step(`${name}: ${c.yellow("checksum drift")}`, S.diamond, "yellow");
                STRICT ? errors++ : warnings++;
            }
        } else if (lock && !lock.skills[name]) {
            step(`${name}: ${c.yellow("not in lock")}`, S.diamond, "yellow");
            STRICT ? errors++ : warnings++;
        } else {
            step(`${name}: ${c.green("healthy")}`, S.check, "green");
        }
    }

    stepLine();
    console.log(`${c.gray(S.branch)}  Errors: ${errors}, Warnings: ${warnings}`);
    stepLine();

    if (STRICT && errors) process.exit(1);
}
