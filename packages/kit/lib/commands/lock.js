/**
 * @fileoverview Lock command - Generate skill-lock.json
 */

import fs from "fs";
import path from "path";
import { step, stepLine, success, fatal, outputJSON } from "../ui.js";
import { WORKSPACE, DRY, cwd, VERSION } from "../config.js";

/**
 * Generate skill-lock.json
 */
export async function run() {
    if (!fs.existsSync(WORKSPACE)) {
        fatal("No .agent/skills directory");
        return;
    }

    stepLine();

    const skills = {};
    for (const name of fs.readdirSync(WORKSPACE)) {
        const dir = path.join(WORKSPACE, name);
        if (!fs.statSync(dir).isDirectory()) continue;

        const mf = path.join(dir, ".skill-source.json");
        if (!fs.existsSync(mf)) continue;

        const m = JSON.parse(fs.readFileSync(mf, "utf-8"));
        skills[name] = {
            repo: m.repo,
            skill: m.skill,
            ref: m.ref,
            checksum: `sha256:${m.checksum}`,
            publisher: m.publisher || null
        };
    }

    const lock = {
        lockVersion: 1,
        generatedAt: new Date().toISOString(),
        generator: `@dataguruin/add-skill@${VERSION}`,
        skills
    };

    if (DRY) {
        step("Would generate skill-lock.json");
        outputJSON(lock, true);
        return;
    }

    fs.mkdirSync(path.join(cwd, ".agent"), { recursive: true });
    fs.writeFileSync(path.join(cwd, ".agent", "skill-lock.json"), JSON.stringify(lock, null, 2));

    success("skill-lock.json generated");
    stepLine();
}
