/**
 * @fileoverview Init command
 */

import fs from "fs";
import { step, stepLine, S, success } from "../ui.js";
import { GLOBAL, GLOBAL_DIR, WORKSPACE, DRY, cwd } from "../config.js";
import path from "path";

/**
 * Initialize skills directory
 */
export async function run() {
    stepLine();

    const targetDir = GLOBAL ? GLOBAL_DIR : WORKSPACE;

    if (fs.existsSync(targetDir)) {
        step(`Skills directory already exists: ${targetDir}`, S.check, "green");
        return;
    }

    if (DRY) {
        step(`Would create: ${targetDir}`, S.diamond);
        return;
    }

    fs.mkdirSync(targetDir, { recursive: true });

    // Create .gitignore if workspace
    if (!GLOBAL) {
        const gi = path.join(cwd, ".agent", ".gitignore");
        if (!fs.existsSync(gi)) {
            fs.writeFileSync(gi, "# Skill caches\nskills/*/.skill-source.json\n");
        }
    }

    success(`Initialized: ${targetDir}`);
}
