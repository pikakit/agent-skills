/**
 * @fileoverview Verify command - Checksum verification
 */

import fs from "fs";
import path from "path";
import { resolveScope, merkleHash } from "../helpers.js";
import { step, stepLine, S, c } from "../ui.js";
import { STRICT } from "../config.js";

/**
 * Verify skill checksums
 */
export async function run() {
    const scope = resolveScope();

    if (!fs.existsSync(scope)) {
        stepLine();
        step("No skills directory found", S.diamond);
        return;
    }

    stepLine();
    step(c.bold("Verifying Skills"), S.diamondFilled, "cyan");
    stepLine();

    let issues = 0;

    for (const name of fs.readdirSync(scope)) {
        const dir = path.join(scope, name);
        if (!fs.statSync(dir).isDirectory()) continue;

        const mf = path.join(dir, ".skill-source.json");
        if (!fs.existsSync(mf)) {
            step(`${name}: ${c.red("missing metadata")}`, S.cross, "red");
            issues++;
            continue;
        }

        const m = JSON.parse(fs.readFileSync(mf, "utf-8"));
        const actual = merkleHash(dir);

        if (actual !== m.checksum) {
            step(`${name}: ${c.red("checksum mismatch")}`, S.cross, "red");
            issues++;
        } else {
            step(`${name}: ${c.green("OK")}`, S.check, "green");
        }
    }

    stepLine();
    console.log(`${c.gray(S.branch)}  ${issues ? c.red(issues + " issue(s)") : c.green("All verified")}`);
    stepLine();

    if (issues && STRICT) process.exit(1);
}
