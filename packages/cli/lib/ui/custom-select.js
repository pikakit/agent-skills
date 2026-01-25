/**
 * Custom Select Component - Beautiful icons using @clack/core
 */
import { SelectPrompt, isCancel } from "@clack/core";
import pc from "picocolors";

// ============================================================================
// CUSTOM ICONS
// ============================================================================

const ICONS = {
    // Cursor
    cursor: pc.cyan("❯"),
    blank: " ",

    // Menu items with colors
    learn: pc.green("◆"),
    recall: pc.blue("◇"),
    stats: pc.yellow("▣"),
    audit: pc.red("▲"),
    watch: pc.magenta("○"),
    exit: pc.gray("×")
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
        options: items.map((item, i) => ({
            value: item.value,
            label: item.label,
            hint: item.hint
        })),
        initialValue: items[0]?.value,
        render() {
            const header = `${pc.gray("┌")}  ${pc.cyan("🧠")} ${pc.bold(message)}`;

            const body = items.map((item) => {
                const isActive = this.value === item.value;
                const cursor = isActive ? ICONS.cursor : ICONS.blank;
                const icon = ICONS[item.value] || pc.gray("•");
                const label = isActive ? pc.bold(pc.white(item.label)) : pc.dim(item.label);
                const hint = item.hint && isActive ? pc.dim(` (${item.hint})`) : "";

                return `${pc.gray("│")}  ${cursor} ${icon}  ${label}${hint}`;
            }).join("\n");

            const footer = `${pc.gray("└")}`;

            return `${header}\n${pc.gray("│")}\n${body}\n${footer}`;
        }
    });

    const result = await prompt.prompt();
    return result;
}

export { ICONS, pc, isCancel };
