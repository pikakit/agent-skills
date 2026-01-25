/**
 * @fileoverview Settings management for Agent Skill Kit
 * Handles Auto-Learning and Auto-Updating preferences
 */

import fs from "fs";
import yaml from "js-yaml";
import path from "path";
import { KNOWLEDGE_DIR } from "./config.js";

/** Path to settings file */
export const SETTINGS_PATH = path.join(KNOWLEDGE_DIR, "settings.yaml");

/** Default settings */
const DEFAULT_SETTINGS = {
    version: 1,
    autoLearning: true,   // ON by default - learn from mistakes
    autoUpdating: false,  // OFF by default - requires user trust
    updateThreshold: 5,   // Hits before proposing update
    lastUpdateCheck: null
};

/**
 * Load settings from YAML file
 * @returns {object} Settings object
 */
export function loadSettings() {
    try {
        if (fs.existsSync(SETTINGS_PATH)) {
            const content = fs.readFileSync(SETTINGS_PATH, "utf8");
            return { ...DEFAULT_SETTINGS, ...yaml.load(content) };
        }
    } catch (e) {
        console.error("Failed to load settings:", e.message);
    }
    return { ...DEFAULT_SETTINGS };
}

/**
 * Save settings to YAML file
 * @param {object} settings - Settings to save
 */
export function saveSettings(settings) {
    try {
        fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });
        fs.writeFileSync(SETTINGS_PATH, yaml.dump(settings), "utf8");
        return true;
    } catch (e) {
        console.error("Failed to save settings:", e.message);
        return false;
    }
}

/**
 * Toggle Auto-Learning setting
 * @returns {boolean} New value
 */
export function toggleAutoLearning() {
    const settings = loadSettings();
    settings.autoLearning = !settings.autoLearning;
    saveSettings(settings);
    return settings.autoLearning;
}

/**
 * Toggle Auto-Updating setting
 * @returns {boolean} New value
 */
export function toggleAutoUpdating() {
    const settings = loadSettings();
    settings.autoUpdating = !settings.autoUpdating;
    saveSettings(settings);
    return settings.autoUpdating;
}

/**
 * Check if Auto-Learning is enabled
 * @returns {boolean}
 */
export function isAutoLearningEnabled() {
    return loadSettings().autoLearning;
}

/**
 * Check if Auto-Updating is enabled
 * @returns {boolean}
 */
export function isAutoUpdatingEnabled() {
    return loadSettings().autoUpdating;
}

/**
 * Get update threshold
 * @returns {number}
 */
export function getUpdateThreshold() {
    return loadSettings().updateThreshold;
}

/**
 * Initialize settings file if not exists
 */
export function initSettings() {
    if (!fs.existsSync(SETTINGS_PATH)) {
        saveSettings(DEFAULT_SETTINGS);
    }
}

export default {
    loadSettings,
    saveSettings,
    toggleAutoLearning,
    toggleAutoUpdating,
    isAutoLearningEnabled,
    isAutoUpdatingEnabled,
    getUpdateThreshold,
    initSettings,
    SETTINGS_PATH
};
