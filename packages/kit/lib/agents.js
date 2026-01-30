/**
 * @fileoverview Agent definitions and detection
 * Based on Vercel's agent-skills CLI structure
 */

import { existsSync } from "fs";
import { homedir } from "os";
import { join } from "path";

const home = homedir();

// Environment-based paths
const codexHome = process.env.CODEX_HOME?.trim() || join(home, ".codex");
const claudeHome = process.env.CLAUDE_CONFIG_DIR?.trim() || join(home, ".claude");

/**
 * @typedef {Object} AgentConfig
 * @property {string} name - Internal agent ID
 * @property {string} displayName - Display name for UI
 * @property {string} skillsDir - Project-level skills directory
 * @property {string} globalSkillsDir - Global skills directory
 * @property {() => boolean} detect - Detection function
 */

/**
 * All supported agents with detection logic
 * @type {Record<string, AgentConfig>}
 */
export const AGENTS = {
    antigravity: {
        name: "antigravity",
        displayName: "Antigravity",
        skillsDir: ".agent/skills",
        globalSkillsDir: join(home, ".gemini/antigravity/global_skills"),
        detect: () => existsSync(join(process.cwd(), ".agent")) || existsSync(join(home, ".gemini/antigravity"))
    },
    "claude-code": {
        name: "claude-code",
        displayName: "Claude Code",
        skillsDir: ".claude/skills",
        globalSkillsDir: join(claudeHome, "skills"),
        detect: () => existsSync(claudeHome)
    },
    codex: {
        name: "codex",
        displayName: "Codex",
        skillsDir: ".codex/skills",
        globalSkillsDir: join(codexHome, "skills"),
        detect: () => existsSync(codexHome) || existsSync("/etc/codex")
    },
    "gemini-cli": {
        name: "gemini-cli",
        displayName: "Gemini CLI",
        skillsDir: ".gemini/skills",
        globalSkillsDir: join(home, ".gemini/skills"),
        detect: () => existsSync(join(home, ".gemini"))
    },
    "github-copilot": {
        name: "github-copilot",
        displayName: "GitHub Copilot",
        skillsDir: ".github/skills",
        globalSkillsDir: join(home, ".copilot/skills"),
        detect: () => existsSync(join(process.cwd(), ".github")) || existsSync(join(home, ".copilot"))
    },
    windsurf: {
        name: "windsurf",
        displayName: "Windsurf",
        skillsDir: ".windsurf/skills",
        globalSkillsDir: join(home, ".codeium/windsurf/skills"),
        detect: () => existsSync(join(home, ".codeium/windsurf"))
    },
    cursor: {
        name: "cursor",
        displayName: "Cursor",
        skillsDir: ".cursor/skills",
        globalSkillsDir: join(home, ".cursor/skills"),
        detect: () => existsSync(join(home, ".cursor"))
    },
    cline: {
        name: "cline",
        displayName: "Cline",
        skillsDir: ".cline/skills",
        globalSkillsDir: join(home, ".cline/skills"),
        detect: () => existsSync(join(home, ".cline"))
    },
    roo: {
        name: "roo",
        displayName: "Roo Code",
        skillsDir: ".roo/skills",
        globalSkillsDir: join(home, ".roo/skills"),
        detect: () => existsSync(join(home, ".roo"))
    },
    continue: {
        name: "continue",
        displayName: "Continue",
        skillsDir: ".continue/skills",
        globalSkillsDir: join(home, ".continue/skills"),
        detect: () => existsSync(join(process.cwd(), ".continue")) || existsSync(join(home, ".continue"))
    },
    goose: {
        name: "goose",
        displayName: "Goose",
        skillsDir: ".goose/skills",
        globalSkillsDir: join(home, ".config/goose/skills"),
        detect: () => existsSync(join(home, ".config/goose"))
    },
    trae: {
        name: "trae",
        displayName: "Trae",
        skillsDir: ".trae/skills",
        globalSkillsDir: join(home, ".trae/skills"),
        detect: () => existsSync(join(home, ".trae"))
    },
    kilo: {
        name: "kilo",
        displayName: "Kilo Code",
        skillsDir: ".kilocode/skills",
        globalSkillsDir: join(home, ".kilocode/skills"),
        detect: () => existsSync(join(home, ".kilocode"))
    },
    opencode: {
        name: "opencode",
        displayName: "OpenCode",
        skillsDir: ".opencode/skills",
        globalSkillsDir: join(home, ".config/opencode/skills"),
        detect: () => existsSync(join(home, ".config/opencode"))
    },
    amp: {
        name: "amp",
        displayName: "Amp",
        skillsDir: ".agents/skills",
        globalSkillsDir: join(home, ".config/agents/skills"),
        detect: () => existsSync(join(home, ".config/amp"))
    },
    junie: {
        name: "junie",
        displayName: "Junie",
        skillsDir: ".junie/skills",
        globalSkillsDir: join(home, ".junie/skills"),
        detect: () => existsSync(join(home, ".junie"))
    },
    "kiro-cli": {
        name: "kiro-cli",
        displayName: "Kiro CLI",
        skillsDir: ".kiro/skills",
        globalSkillsDir: join(home, ".kiro/skills"),
        detect: () => existsSync(join(home, ".kiro"))
    },
    zencoder: {
        name: "zencoder",
        displayName: "Zencoder",
        skillsDir: ".zencoder/skills",
        globalSkillsDir: join(home, ".zencoder/skills"),
        detect: () => existsSync(join(home, ".zencoder"))
    },
    openhands: {
        name: "openhands",
        displayName: "OpenHands",
        skillsDir: ".openhands/skills",
        globalSkillsDir: join(home, ".openhands/skills"),
        detect: () => existsSync(join(home, ".openhands"))
    },
    "qwen-code": {
        name: "qwen-code",
        displayName: "Qwen Code",
        skillsDir: ".qwen/skills",
        globalSkillsDir: join(home, ".qwen/skills"),
        detect: () => existsSync(join(home, ".qwen"))
    }
};

/**
 * Detect all installed agents on the system
 * @returns {Array<{name: string, displayName: string, skillsDir: string, globalSkillsDir: string}>}
 */
export function detectInstalledAgents() {
    const detected = [];

    for (const [key, config] of Object.entries(AGENTS)) {
        if (config.detect()) {
            detected.push({
                name: config.name,
                displayName: config.displayName,
                skillsDir: config.skillsDir,
                globalSkillsDir: config.globalSkillsDir
            });
        }
    }

    return detected;
}

/**
 * Get agent config by name
 * @param {string} name - Agent name
 * @returns {AgentConfig | undefined}
 */
export function getAgentConfig(name) {
    return AGENTS[name];
}

/**
 * Get all agent names
 * @returns {string[]}
 */
export function getAllAgentNames() {
    return Object.keys(AGENTS);
}
