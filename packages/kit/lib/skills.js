/**
 * @fileoverview Skill detection and parsing
 */

import fs from "fs";
import path from "path";
import { resolveScope } from "./helpers.js";
import { getDirSize } from "./helpers.js";

/**
 * Parse SKILL.md YAML frontmatter
 * @param {string} p - Path to SKILL.md
 * @returns {import('./types.js').SkillMeta}
 */
export function parseSkillMdFrontmatter(p) {
    try {
        const content = fs.readFileSync(p, "utf-8");
        const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
        if (!match) return {};

        /** @type {import('./types.js').SkillMeta} */
        const meta = {};

        for (const line of match[1].split(/\r?\n/)) {
            const i = line.indexOf(":");
            if (i === -1) continue;
            const key = line.substring(0, i).trim();
            const val = line.substring(i + 1).trim();
            if (key === "tags") meta.tags = val.split(",").map(t => t.trim()).filter(Boolean);
            else if (key && val) meta[key] = val;
        }
        return meta;
    } catch (err) {
        if (process.env.DEBUG) console.error(`parseSkillMdFrontmatter error: ${err.message}`);
        return {};
    }
}

/**
 * Detect skill directory structure
 * @param {string} dir - Skill directory
 * @returns {import('./types.js').SkillStructure}
 */
export function detectSkillStructure(dir) {
    /** @type {import('./types.js').SkillStructure} */
    const s = {
        hasResources: false,
        hasExamples: false,
        hasScripts: false,
        hasConstitution: false,
        hasDoctrines: false,
        hasEnforcement: false,
        hasProposals: false,
        directories: [],
        files: []
    };

    try {
        for (const item of fs.readdirSync(dir)) {
            const full = path.join(dir, item);
            if (fs.statSync(full).isDirectory()) {
                s.directories.push(item);
                const l = item.toLowerCase();
                if (l === "resources") s.hasResources = true;
                if (l === "examples") s.hasExamples = true;
                if (l === "scripts") s.hasScripts = true;
                if (l === "constitution") s.hasConstitution = true;
                if (l === "doctrines") s.hasDoctrines = true;
                if (l === "enforcement") s.hasEnforcement = true;
                if (l === "proposals") s.hasProposals = true;
            } else {
                s.files.push(item);
            }
        }
    } catch (err) {
        if (process.env.DEBUG) console.error(`detectSkillStructure error: ${err.message}`);
    }
    return s;
}

/**
 * Get all installed skills
 * @returns {import('./types.js').Skill[]}
 */
export function getInstalledSkills() {
    const scope = resolveScope();
    /** @type {import('./types.js').Skill[]} */
    const skills = [];

    if (!fs.existsSync(scope)) return skills;

    for (const name of fs.readdirSync(scope)) {
        const dir = path.join(scope, name);
        if (!fs.statSync(dir).isDirectory()) continue;

        const metaFile = path.join(dir, ".skill-source.json");
        const skillFile = path.join(dir, "SKILL.md");

        if (fs.existsSync(metaFile) || fs.existsSync(skillFile)) {
            const meta = fs.existsSync(metaFile) ? JSON.parse(fs.readFileSync(metaFile, "utf-8")) : {};
            const hasSkillMd = fs.existsSync(skillFile);
            const skillMeta = hasSkillMd ? parseSkillMdFrontmatter(skillFile) : {};

            skills.push({
                name,
                path: dir,
                ...meta,
                hasSkillMd,
                description: skillMeta.description || meta.description || "",
                tags: skillMeta.tags || [],
                author: skillMeta.author || meta.publisher || "",
                version: skillMeta.version || meta.ref || "unknown",
                structure: detectSkillStructure(dir),
                size: getDirSize(dir)
            });
        }
    }
    return skills;
}
