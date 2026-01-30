/**
 * @fileoverview UI components - Install Agent Skill theme
 */

import kleur from "kleur";
import boxen from "boxen";
import { intro, outro, multiselect, select, confirm, isCancel, cancel, text } from "@clack/prompts";
import ora from "ora";
import gradient from "gradient-string";

export { intro, outro, multiselect, select, confirm, isCancel, cancel, text };

// --- ASCII Art Banner ---
const PIKAKIT_BANNER = `
 ____  _ _         _  ___ _   
|  _ \\(_) | ____ _| |/ (_) |_ 
| |_) | | |/ / _\` | ' /| | __|
|  __/| |   < (_| | . \\| | |_ 
|_|   |_|_|\\_\\__,_|_|\\_\\_|\\__|
`;

// Custom gradient: white → gray (like vercel style)
const pikaGradient = gradient(['#ffffff', '#bbbbbb', '#888888', '#555555']);

/**
 * Create a spinner
 */
export function spinner() {
    return {
        _s: null,
        start(msg) {
            this._s = ora({
                text: " " + msg,
                prefixText: "",
                color: "blue",
                spinner: {
                    interval: 80,
                    frames: ['◒', '◐', '◓', '◑']
                }
            }).start();
        },
        stop(msg) {
            if (this._s) {
                this._s.stopAndPersist({
                    symbol: c.cyan(S.diamond),
                    text: " " + msg
                });
            }
        },
        fail(msg) {
            if (this._s) {
                this._s.stopAndPersist({
                    symbol: c.red(S.cross),
                    text: " " + msg
                });
            }
        },
        message(msg) {
            if (this._s) this._s.text = " " + msg;
        }
    };
}

// --- Symbols ---

/** UI symbols for tree structure */
export const S = {
    branch: "│",
    diamond: "◇",
    diamondFilled: "◆",
    check: "✓",
    cross: "x",
    arrow: "→"
};

// --- Colors ---

/** Color helper functions */
export const c = {
    cyan: kleur.cyan,
    gray: kleur.gray,
    green: kleur.green,
    red: kleur.red,
    yellow: kleur.yellow,
    magenta: kleur.magenta,
    blue: kleur.blue,
    white: kleur.white,
    bgBlue: kleur.bgBlue,
    bold: kleur.bold,
    dim: kleur.dim,
    inverse: kleur.inverse
};

// --- UI Functions ---

/**
 * Print a step in the tree
 * @param {string} text - Step text
 * @param {string} [icon] - Icon to use
 * @param {keyof typeof c} [color] - Color name
 */
export function step(text, icon = S.diamond, color = "cyan") {
    const colorFn = c[color] || c.cyan;
    console.log(`${colorFn(icon)}  ${text}`);
}

/**
 * Print an active step (Blue Filled Diamond)
 * @param {string} text - Step text
 */
export function activeStep(text) {
    console.log(`${c.blue(S.diamondFilled)}  ${text}`);
}

/**
 * Print empty branch line
 */
export function stepLine() {
    console.log(`${c.gray(S.branch)}`);
}

/**
 * Print fatal error and exit
 * @param {string} msg - Error message
 */
export function fatal(msg) {
    console.log(`${c.red(S.cross)}  ${c.red(msg)}`);
    process.exit(1);
}

/**
 * Print success message
 * @param {string} msg - Success message
 */
export function success(msg) {
    console.log(`${c.cyan(S.diamond)}  ${c.cyan(msg)}`);
}

/**
 * Output JSON if JSON_OUTPUT mode
 * @param {any} data - Data to output
 * @param {boolean} jsonMode - Whether to output JSON
 */
export function outputJSON(data, jsonMode) {
    if (jsonMode) console.log(JSON.stringify(data, null, 2));
}

/**
 * Create a nice box message
 * @param {string} message - Message content
 * @param {object} options - Box options
 */
export function box(message, options = {}) {
    return "\n" + boxen(message, {
        padding: { top: 0, bottom: 0, left: 1, right: 1 },
        margin: { top: 0, bottom: 0, left: 0, right: 0 },
        borderStyle: "round",
        borderColor: "blue",
        ...options
    });
}

/**
 * Show branded intro with version (matches agent CLI style)
 * @param {string} version - Package version
 * @param {string} [status] - Optional status text
 */
export function brandedIntro(version, status = "") {
    // Split banner and filter to get content lines only
    const bannerLines = PIKAKIT_BANNER.split('\n').filter(line => line.trim() !== '');

    // Print all lines except the last with gradient
    for (let i = 0; i < bannerLines.length - 1; i++) {
        console.log(pikaGradient(bannerLines[i]));
    }

    // Last line: gradient ASCII + dim version (aligned at bottom)
    const lastLine = bannerLines[bannerLines.length - 1];
    console.log(pikaGradient(lastLine) + `  ${c.dim(`v${version}`)}`);


    if (status) {
        console.log(`${c.dim(status)}`);
    }
}

// --- Vercel-Style Installation Prompts ---

/**
 * Prompt user to select which agents to install to
 * @param {Array<{name: string, displayName: string, skillsDir: string}>} detectedAgents
 * @returns {Promise<Array<{name: string, displayName: string, skillsDir: string}> | null>}
 */
export async function selectAgentsPrompt(detectedAgents) {
    if (detectedAgents.length === 0) {
        return null;
    }

    // First ask: All detected or select specific?
    const installChoice = await select({
        message: "Install to",
        options: [
            {
                value: "all",
                label: `All detected agents (Recommended)`,
                hint: `Install to all ${detectedAgents.length} detected agents`
            },
            {
                value: "select",
                label: "Select specific agents",
                hint: "Choose which agents to install to"
            }
        ]
    });

    if (isCancel(installChoice)) {
        cancel("Installation cancelled");
        return null;
    }

    if (installChoice === "all") {
        return detectedAgents;
    }

    // Let user select specific agents
    const selectedAgents = await multiselect({
        message: "Select agents to install skills to",
        options: detectedAgents.map(agent => ({
            value: agent.name,
            label: agent.displayName,
            hint: agent.skillsDir
        })),
        required: true
    });

    if (isCancel(selectedAgents)) {
        cancel("Installation cancelled");
        return null;
    }

    return detectedAgents.filter(a => selectedAgents.includes(a.name));
}

/**
 * Prompt user to select installation scope (Project or Global)
 * @returns {Promise<"project" | "global" | null>}
 */
export async function selectScopePrompt() {
    const scope = await select({
        message: "Installation scope",
        options: [
            {
                value: "project",
                label: "Project",
                hint: "Install in current directory (committed with your project)"
            },
            {
                value: "global",
                label: "Global",
                hint: "Install globally (available across all projects)"
            }
        ]
    });

    if (isCancel(scope)) {
        cancel("Installation cancelled");
        return null;
    }

    return scope;
}

/**
 * Prompt user to select installation method (Symlink or Copy)
 * @returns {Promise<"symlink" | "copy" | null>}
 */
export async function selectMethodPrompt() {
    const method = await select({
        message: "Installation method",
        options: [
            {
                value: "symlink",
                label: "Symlink (Recommended)",
                hint: "Single source of truth, easy updates"
            },
            {
                value: "copy",
                label: "Copy to all agents",
                hint: "Independent copies for each agent"
            }
        ]
    });

    if (isCancel(method)) {
        cancel("Installation cancelled");
        return null;
    }

    return method;
}

/**
 * Prompt user to select skills to install (multiselect with descriptions)
 * @param {Array<{name: string, description: string, path: string}>} skills
 * @returns {Promise<Array<{name: string, description: string, path: string}> | null>}
 */
export async function selectSkillsPrompt(skills) {
    if (skills.length === 0) {
        return null;
    }

    const selectedNames = await multiselect({
        message: "Select skills to install",
        options: skills.map(skill => ({
            value: skill.name,
            label: skill.name,
            hint: skill.description ? skill.description.substring(0, 60) + "..." : ""
        })),
        required: true
    });

    if (isCancel(selectedNames)) {
        cancel("Installation cancelled");
        return null;
    }

    return skills.filter(s => selectedNames.includes(s.name));
}

