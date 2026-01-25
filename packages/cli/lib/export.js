/**
 * @fileoverview Export and Import for Agent Skill Kit
 * Share settings between projects
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import { LESSONS_PATH } from "./config.js";
import { SETTINGS_PATH, loadSettings } from "./settings.js";
import { loadKnowledge, saveKnowledge } from "./recall.js";

/**
 * Export lessons and settings to JSON file
 * @param {string} outputPath - Output file path
 * @returns {boolean}
 */
export function exportData(outputPath) {
    try {
        const data = {
            version: 1,
            exportedAt: new Date().toISOString(),
            lessons: loadKnowledge().lessons || [],
            settings: loadSettings()
        };

        fs.writeFileSync(outputPath, JSON.stringify(data, null, 2), "utf8");
        return true;
    } catch (e) {
        console.error("Failed to export:", e.message);
        return false;
    }
}

/**
 * Import data from JSON file
 * @param {string} inputPath - Input file path
 * @param {"merge" | "replace"} mode - Import mode
 * @returns {{ success: boolean, lessonsCount: number, hasSettings: boolean }}
 */
export function importData(inputPath, mode = "merge") {
    try {
        if (!fs.existsSync(inputPath)) {
            return { success: false, lessonsCount: 0, hasSettings: false };
        }

        const content = fs.readFileSync(inputPath, "utf8");
        const data = JSON.parse(content);

        // Import lessons
        const currentDb = loadKnowledge();

        if (mode === "replace") {
            currentDb.lessons = data.lessons || [];
        } else {
            // Merge - add new lessons, skip duplicates by pattern
            const existingPatterns = new Set(currentDb.lessons.map(l => l.pattern));
            for (const lesson of (data.lessons || [])) {
                if (!existingPatterns.has(lesson.pattern)) {
                    currentDb.lessons.push(lesson);
                }
            }
        }

        saveKnowledge(currentDb);

        // Import settings if present
        let hasSettings = false;
        if (data.settings) {
            const settingsPath = SETTINGS_PATH;
            fs.writeFileSync(settingsPath, yaml.dump(data.settings), "utf8");
            hasSettings = true;
        }

        return {
            success: true,
            lessonsCount: data.lessons?.length || 0,
            hasSettings
        };
    } catch (e) {
        console.error("Failed to import:", e.message);
        return { success: false, lessonsCount: 0, hasSettings: false };
    }
}

export default { exportData, importData };
