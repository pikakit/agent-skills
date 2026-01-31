/**
 * Custom Select Component - Using @clack/prompts native select
 * This fixes the Windows terminal rendering issues with @clack/core
 */
import * as p from "@clack/prompts";
import pc from "picocolors";

// ============================================================================
// CUSTOM ICONS
// ============================================================================

const ITEM_ICONS = {
    routing: "◆",
    learn: "◆",
    recall: "◇",
    stats: "▣",
    settings: "◇",
    backup: "◇",
    export: "◇",
    proposals: "◇",
    completion: "◇",
    init: "◇",
    exit: "×"
};

const ITEM_COLORS = {
    routing: pc.cyan,
    learn: pc.green,
    recall: pc.blue,
    stats: pc.yellow,
    settings: pc.cyan,
    backup: pc.gray,
    export: pc.gray,
    proposals: pc.yellow,
    completion: pc.gray,
    init: pc.green,
    exit: pc.red
};

// ============================================================================
// CUSTOM SELECT - Using native @clack/prompts
// ============================================================================

/**
 * Custom select with icons - uses native clack select to fix Windows rendering
 * @param {object} config 
 * @returns {Promise<string|symbol>}
 */
export async function customSelect(config) {
    const { message, items } = config;

    // Transform items to clack format - clean labels without icons
    const options = items.map((item) => ({
        value: item.value,
        label: item.label,
        hint: item.hint
    }));

    const result = await p.select({
        message,
        options,
        initialValue: items[0]?.value
    });

    return result;
}

export { ITEM_ICONS, ITEM_COLORS, pc };
export { isCancel } from "@clack/prompts";
