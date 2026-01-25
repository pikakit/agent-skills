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
    autoLearning: "◆",
    autoUpdating: "◇",
    threshold: "▣",
    back: "◀",
    exit: "×"
};

const ITEM_COLORS = {
    learn: pc.green,
    recall: pc.blue,
    stats: pc.yellow,
    audit: pc.red,
    watch: pc.magenta,
    settings: pc.cyan,
    autoLearning: pc.green,
    autoUpdating: pc.blue,
    threshold: pc.yellow,
    back: pc.gray,
    exit: pc.red
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
                const colorFn = ITEM_COLORS[item.value] || pc.gray;

                // ◆ filled khi select (có màu), ◇ outline khi không select (gray)
                const iconChar = isActive ? "◆" : "◇";
                const iconStr = iconChar.padEnd(2, " ");
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
