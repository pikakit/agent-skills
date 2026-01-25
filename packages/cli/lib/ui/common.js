/**
 * Common UI helpers for Clack-based CLI
 */
import * as p from "@clack/prompts";
import { loadKnowledge } from "../recall.js";
import { VERSION } from "../config.js";

// ============================================================================
// THEME COLORS
// ============================================================================

export const ICONS = {
    brain: "🧠",
    learn: "🎓",
    recall: "🔍",
    stats: "📊",
    audit: "⚖️",
    watch: "👁️",
    success: "✅",
    error: "❌",
    warning: "⚠️",
    info: "ℹ️"
};

// ============================================================================
// SHARED FUNCTIONS
// ============================================================================

/**
 * Show app header
 */
export function showHeader() {
    p.intro(`${ICONS.brain} Agent Skill Kit v${VERSION}`);
}

/**
 * Show outro message
 * @param {string} message 
 */
export function showSuccess(message) {
    p.outro(`${ICONS.success} ${message}`);
}

/**
 * Show error and exit
 * @param {string} message 
 */
export function showError(message) {
    p.cancel(`${ICONS.error} ${message}`);
    process.exit(1);
}

/**
 * Handle user cancellation (CTRL+C)
 * @param {any} value 
 */
export function handleCancel(value) {
    if (p.isCancel(value)) {
        p.cancel("Operation cancelled.");
        process.exit(0);
    }
}

/**
 * Get knowledge base with error handling
 * @returns {object}
 */
export function getKnowledge() {
    try {
        return loadKnowledge();
    } catch (e) {
        showError("Failed to load knowledge base");
        return { lessons: [] };
    }
}

/**
 * Format horizontal line
 * @param {number} width 
 */
export function line(width = 50) {
    return "─".repeat(width);
}

export { p, VERSION };
