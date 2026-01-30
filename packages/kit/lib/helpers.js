/**
 * @fileoverview Utility helper functions
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { BACKUP_DIR, DRY, cwd, GLOBAL, WORKSPACE, GLOBAL_DIR, REGISTRIES_FILE } from "./config.js";

/**
 * Get directory size recursively
 * @param {string} dir - Directory path
 * @returns {number} Size in bytes
 */
export function getDirSize(dir) {
    let size = 0;
    try {
        const walk = (p) => {
            for (const f of fs.readdirSync(p)) {
                const full = path.join(p, f);
                const stat = fs.statSync(full);
                if (stat.isDirectory()) walk(full);
                else size += stat.size;
            }
        };
        walk(dir);
    } catch (err) {
        // Directory may not exist or be inaccessible
        if (process.env.DEBUG) console.error(`getDirSize error: ${err.message}`);
    }
    return size;
}

/**
 * Format bytes to human readable
 * @param {number} bytes
 * @returns {string}
 */
export function formatBytes(bytes) {
    if (bytes < 1024) return bytes + " B";
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
    return (bytes / 1024 / 1024).toFixed(1) + " MB";
}

/**
 * Format ISO date string
 * @param {string} [iso]
 * @returns {string}
 */
export function formatDate(iso) {
    return iso ? new Date(iso).toLocaleDateString() : "unknown";
}

/**
 * Calculate merkle hash of directory
 * @param {string} dir - Directory path
 * @returns {string} SHA256 hash
 */
export function merkleHash(dir) {
    const files = [];
    const walk = (p) => {
        for (const f of fs.readdirSync(p)) {
            if (f === ".skill-source.json") continue;
            const full = path.join(p, f);
            const stat = fs.statSync(full);
            if (stat.isDirectory()) walk(full);
            else {
                const h = crypto.createHash("sha256").update(fs.readFileSync(full)).digest("hex");
                files.push(`${path.relative(dir, full)}:${h}`);
            }
        }
    };
    walk(dir);
    files.sort();
    return crypto.createHash("sha256").update(files.join("|")).digest("hex");
}

/**
 * Parse skill spec string
 * @param {string} spec - Spec like org/repo#skill@ref
 * @returns {import('./types.js').ParsedSpec}
 */
export function parseSkillSpec(spec) {
    if (!spec || typeof spec !== 'string') {
        throw new Error('Skill spec is required');
    }

    const [repoPart, skillPart] = spec.split("#");

    if (!repoPart.includes('/')) {
        throw new Error(`Invalid spec format: "${spec}". Expected: org/repo or org/repo#skill`);
    }

    const [org, repo] = repoPart.split("/");

    if (!org || !repo) {
        throw new Error(`Invalid spec: missing org or repo in "${spec}"`);
    }

    const [skill, ref] = (skillPart || "").split("@");
    return { org, repo, skill: skill || undefined, ref: ref || undefined };
}

/**
 * Resolve scope based on flags and cwd
 * @returns {string} Skills directory path
 */
export function resolveScope() {
    if (GLOBAL) return GLOBAL_DIR;
    if (fs.existsSync(path.join(cwd, ".agent"))) return WORKSPACE;
    return GLOBAL_DIR;
}

/**
 * Create backup of skill directory
 * @param {string} skillDir - Source directory
 * @param {string} skillName - Skill name for backup naming
 * @returns {string|null} Backup path or null if dry run
 */
export function createBackup(skillDir, skillName) {
    if (DRY) return null;

    try {
        const ts = new Date().toISOString().replace(/[:.]/g, "-");
        const bp = path.join(BACKUP_DIR, `${skillName}_${ts}`);
        fs.mkdirSync(BACKUP_DIR, { recursive: true });

        // Resolve symlink to real path (Windows compatibility)
        const realPath = fs.realpathSync(skillDir);

        fs.cpSync(realPath, bp, { recursive: true });
        return bp;
    } catch (err) {
        // Fallback: try direct copy if realpath fails
        try {
            const ts = new Date().toISOString().replace(/[:.]/g, "-");
            const bp = path.join(BACKUP_DIR, `${skillName}_${ts}`);
            fs.cpSync(skillDir, bp, { recursive: true });
            return bp;
        } catch (fallbackErr) {
            if (process.env.DEBUG) {
                console.error(`Backup failed for ${skillName}:`, fallbackErr.message);
            }
            return null;
        }
    }
}

/**
 * List backups for a skill
 * @param {string} [skillName] - Filter by skill name
 * @returns {import('./types.js').Backup[]}
 */
export function listBackups(skillName = null) {
    if (!fs.existsSync(BACKUP_DIR)) return [];
    const backups = [];
    for (const name of fs.readdirSync(BACKUP_DIR)) {
        if (skillName && !name.startsWith(skillName + "_")) continue;
        const bp = path.join(BACKUP_DIR, name);
        backups.push({ name, path: bp, createdAt: fs.statSync(bp).mtime, size: getDirSize(bp) });
    }
    return backups.sort((a, b) => b.createdAt - a.createdAt);
}

/**
 * Load skill lock file
 * @returns {import('./types.js').SkillLock}
 */
export function loadSkillLock() {
    const f = path.join(cwd, ".agent", "skill-lock.json");
    if (!fs.existsSync(f)) throw new Error("skill-lock.json not found");
    return JSON.parse(fs.readFileSync(f, "utf-8"));
}

/**
 * Load registries list
 * @returns {string[]}
 */
export function loadRegistries() {
    try {
        return fs.existsSync(REGISTRIES_FILE) ? JSON.parse(fs.readFileSync(REGISTRIES_FILE, "utf-8")) : [];
    } catch (err) {
        if (process.env.DEBUG) console.error(`loadRegistries error: ${err.message}`);
        return [];
    }
}

/**
 * Save registries list
 * @param {string[]} regs
 */
export function saveRegistries(regs) {
    fs.mkdirSync(path.dirname(REGISTRIES_FILE), { recursive: true });
    fs.writeFileSync(REGISTRIES_FILE, JSON.stringify(regs, null, 2));
}

