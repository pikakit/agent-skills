/**
 * @fileoverview Cache command
 */

import fs from "fs";
import { step, stepLine, S, c, fatal, success } from "../ui.js";
import { getDirSize, formatBytes, listBackups } from "../helpers.js";
import { CACHE_ROOT, REGISTRY_CACHE, BACKUP_DIR, DRY } from "../config.js";

/**
 * Manage cache
 * @param {string} [sub] - Subcommand: info, clear, backups
 */
export async function run(sub) {
    stepLine();

    if (sub === "clear") {
        if (DRY) {
            step(`Would clear: ${CACHE_ROOT}`, S.diamond);
            return;
        }
        if (fs.existsSync(CACHE_ROOT)) {
            const size = getDirSize(CACHE_ROOT);
            fs.rmSync(CACHE_ROOT, { recursive: true, force: true });
            success(`Cache cleared (${formatBytes(size)})`);
        } else {
            step("Cache already empty", S.diamond);
        }
        return;
    }

    if (sub === "info" || !sub) {
        if (!fs.existsSync(CACHE_ROOT)) {
            step("Cache is empty", S.diamond);
            return;
        }

        const rs = fs.existsSync(REGISTRY_CACHE) ? getDirSize(REGISTRY_CACHE) : 0;
        const bs = fs.existsSync(BACKUP_DIR) ? getDirSize(BACKUP_DIR) : 0;

        step(c.bold("Cache Info"), S.diamondFilled, "cyan");
        console.log(`${c.gray(S.branch)}  Location: ${CACHE_ROOT}`);
        console.log(`${c.gray(S.branch)}  Registries: ${formatBytes(rs)}`);
        console.log(`${c.gray(S.branch)}  Backups: ${formatBytes(bs)}`);
        console.log(`${c.gray(S.branch)}  Total: ${formatBytes(getDirSize(CACHE_ROOT))}`);
        stepLine();
        return;
    }

    if (sub === "backups") {
        const backups = listBackups();
        if (backups.length === 0) {
            step("No backups found", S.diamond);
            return;
        }

        step(c.bold("Backups"), S.diamondFilled, "cyan");
        stepLine();
        backups.forEach(b => console.log(`${c.gray(S.branch)}  ${b.name} (${formatBytes(b.size)})`));
        stepLine();
        return;
    }

    fatal(`Unknown cache subcommand: ${sub}`);
}
