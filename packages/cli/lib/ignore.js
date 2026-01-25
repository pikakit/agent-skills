/**
 * @fileoverview Ignore patterns parser for Agent Skill Kit
 * Supports .agentignore file with glob patterns
 */

import fs from "fs";
import path from "path";
import { cwd } from "./config.js";

/** Default patterns always ignored */
const DEFAULT_IGNORES = [
    "node_modules/**",
    ".git/**",
    "dist/**",
    "build/**",
    ".next/**",
    "coverage/**",
    "*.log"
];

/**
 * Load ignore patterns from .agentignore file
 * @param {string} basePath - Base directory
 * @returns {string[]} Array of patterns
 */
export function loadIgnorePatterns(basePath = cwd) {
    const patterns = [...DEFAULT_IGNORES];
    const ignoreFile = path.join(basePath, ".agentignore");

    try {
        if (fs.existsSync(ignoreFile)) {
            const content = fs.readFileSync(ignoreFile, "utf8");
            const lines = content.split("\n");

            for (const line of lines) {
                const trimmed = line.trim();
                // Skip empty lines and comments
                if (trimmed && !trimmed.startsWith("#")) {
                    patterns.push(trimmed);
                }
            }
        }
    } catch (e) {
        // Silently use defaults
    }

    return [...new Set(patterns)]; // Remove duplicates
}

/**
 * Check if a file path matches any ignore pattern
 * @param {string} filePath - Relative file path
 * @param {string[]} patterns - Ignore patterns
 * @returns {boolean}
 */
export function isIgnored(filePath, patterns) {
    const normalized = filePath.replace(/\\/g, "/");

    for (const pattern of patterns) {
        // Simple glob matching
        const regex = patternToRegex(pattern);
        if (regex.test(normalized)) {
            return true;
        }
    }

    return false;
}

/**
 * Convert glob pattern to regex
 * @param {string} pattern - Glob pattern
 * @returns {RegExp}
 */
function patternToRegex(pattern) {
    let regex = pattern
        .replace(/\./g, "\\.")      // Escape dots
        .replace(/\*\*/g, ".*")     // ** matches everything
        .replace(/\*/g, "[^/]*")    // * matches segment
        .replace(/\?/g, ".");       // ? matches single char

    // Handle directory patterns (ending with /)
    if (pattern.endsWith("/")) {
        regex = regex.slice(0, -1) + "(/.*)?";
    }

    return new RegExp(`^${regex}$|/${regex}$|^${regex}/`);
}

/**
 * Filter files array by ignore patterns
 * @param {string[]} files - Array of file paths
 * @param {string[]} patterns - Ignore patterns
 * @returns {{ included: string[], ignored: number }}
 */
export function filterFiles(files, patterns) {
    const included = [];
    let ignored = 0;

    for (const file of files) {
        if (isIgnored(file, patterns)) {
            ignored++;
        } else {
            included.push(file);
        }
    }

    return { included, ignored };
}

export default {
    loadIgnorePatterns,
    isIgnored,
    filterFiles,
    DEFAULT_IGNORES
};
