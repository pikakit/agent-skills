/**
 * @fileoverview Backup and Restore for Agent Skill Kit
 * Protects lessons before changes
 */

import fs from "fs";
import path from "path";
import { KNOWLEDGE_DIR, LESSONS_PATH } from "./config.js";
import { SETTINGS_PATH } from "./settings.js";

/** Backup directory */
const BACKUPS_DIR = path.join(KNOWLEDGE_DIR, "backups");

/**
 * Create a timestamped backup of lessons and settings
 * @returns {{ path: string, timestamp: string } | null}
 */
export function createBackup() {
    try {
        fs.mkdirSync(BACKUPS_DIR, { recursive: true });

        const timestamp = new Date().toISOString().replace(/[:.]/g, "-");
        const backupDir = path.join(BACKUPS_DIR, timestamp);
        fs.mkdirSync(backupDir, { recursive: true });

        // Backup lessons
        if (fs.existsSync(LESSONS_PATH)) {
            fs.copyFileSync(
                LESSONS_PATH,
                path.join(backupDir, "lessons-learned.yaml")
            );
        }

        // Backup settings
        if (fs.existsSync(SETTINGS_PATH)) {
            fs.copyFileSync(
                SETTINGS_PATH,
                path.join(backupDir, "settings.yaml")
            );
        }

        return { path: backupDir, timestamp };
    } catch (e) {
        console.error("Failed to create backup:", e.message);
        return null;
    }
}

/**
 * List available backups
 * @returns {Array<{ name: string, date: Date, path: string }>}
 */
export function listBackups() {
    try {
        if (!fs.existsSync(BACKUPS_DIR)) {
            return [];
        }

        const entries = fs.readdirSync(BACKUPS_DIR, { withFileTypes: true });
        return entries
            .filter(e => e.isDirectory())
            .map(e => ({
                name: e.name,
                date: parseBackupDate(e.name),
                path: path.join(BACKUPS_DIR, e.name)
            }))
            .sort((a, b) => b.date - a.date); // Newest first
    } catch (e) {
        return [];
    }
}

/**
 * Parse backup folder name to date
 * @param {string} name - Folder name (ISO timestamp with - instead of :)
 * @returns {Date}
 */
function parseBackupDate(name) {
    try {
        // Convert 2026-01-25T17-30-00-000Z back to valid ISO
        const iso = name.replace(/-(\d{2})-(\d{2})-(\d{3})Z/, ":$1:$2.$3Z");
        return new Date(iso);
    } catch (e) {
        return new Date(0);
    }
}

/**
 * Restore from a backup
 * @param {string} backupPath - Path to backup folder
 * @returns {boolean}
 */
export function restoreBackup(backupPath) {
    try {
        const lessonsBackup = path.join(backupPath, "lessons-learned.yaml");
        const settingsBackup = path.join(backupPath, "settings.yaml");

        if (fs.existsSync(lessonsBackup)) {
            fs.copyFileSync(lessonsBackup, LESSONS_PATH);
        }

        if (fs.existsSync(settingsBackup)) {
            fs.copyFileSync(settingsBackup, SETTINGS_PATH);
        }

        return true;
    } catch (e) {
        console.error("Failed to restore backup:", e.message);
        return false;
    }
}

/**
 * Delete old backups, keep last N
 * @param {number} keep - Number of backups to keep
 */
export function pruneBackups(keep = 5) {
    const backups = listBackups();

    if (backups.length <= keep) return;

    const toDelete = backups.slice(keep);
    for (const backup of toDelete) {
        try {
            fs.rmSync(backup.path, { recursive: true, force: true });
        } catch (e) {
            // Ignore deletion errors
        }
    }
}

export default {
    createBackup,
    listBackups,
    restoreBackup,
    pruneBackups,
    BACKUPS_DIR
};
