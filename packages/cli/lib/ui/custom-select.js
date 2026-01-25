/**
 * Custom Select Component - Beautiful icons using @clack/core
 */
import { SelectPrompt, isCancel } from "@clack/core";
import pc from "picocolors";

// ============================================================================
// CUSTOM ICONS
// ============================================================================

const ITEM_ICONS = {
    learn: "◆",
    recall: "◇",
    stats: "▣",
    audit: "▲",
    watch: "○",
    settings: "⚙",
    exit: "×"
};

const ITEM_COLORS = {
    learn: pc.green,
    recall: pc.blue,
    stats: pc.yellow,
    audit: pc.red,
    watch: pc.magenta,
    settings: pc.cyan,
    exit: pc.red // Changed to red as requested
};

// ============================================================================
// CUSTOM SELECT
// ============================================================================

/**
 * Custom select with beautiful icons
 * @param {object} config 
 * @returns {Promise<string|symbol>}
 */
export async function customSelect(config) {
    const { message, items } = config;

    const prompt = new SelectPrompt({
        options: items.map((item) => ({
            value: item.value,
            label: item.label,
            hint: item.hint
        })),
        initialValue: items[0]?.value,
        render() {
            const header = `${pc.gray("┌")}  💬 ${pc.bold(message)}`;

            const body = items.map((item) => {
                const isActive = this.value === item.value;
                const cursor = isActive ? pc.cyan("❯") : " ";
                const baseIcon = ITEM_ICONS[item.value] || "•";
                const colorFn = ITEM_COLORS[item.value] || pc.gray;

                // Icon có màu chỉ khi được select, còn lại gray
                // Pad icon to ensure alignment
                const iconStr = String(baseIcon).padEnd(2, " ");
                const icon = isActive ? colorFn(iconStr) : pc.gray(iconStr);

                const label = isActive ? pc.bold(pc.white(item.label)) : pc.dim(item.label);
                const hint = item.hint && isActive ? pc.dim(` (${item.hint})`) : "";

                return `${pc.gray("│")}  ${cursor} ${icon} ${label}${hint}`;
            }).join("\n");

            const footer = `${pc.gray("└")}`;

            return `${header}\n${pc.gray("│")}\n${body}\n${footer}`;
        }
    });

    const result = await prompt.prompt();
    return result;
}

export { ITEM_ICONS, ITEM_COLORS, pc, isCancel };
