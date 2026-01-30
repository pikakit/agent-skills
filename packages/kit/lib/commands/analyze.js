/**
 * @fileoverview Analyze command - Skill structure analysis
 */

import fs from "fs";
import path from "path";
import { resolveScope, getDirSize } from "../helpers.js";
import { parseSkillMdFrontmatter, detectSkillStructure } from "../skills.js";
import { step, stepLine, S, c, fatal } from "../ui.js";

/**
 * Analyze skill structure
 * @param {string} skillName - Skill to analyze
 */
export async function run(skillName) {
    if (!skillName) fatal("Missing skill name");

    const scope = resolveScope();
    const skillDir = path.join(scope, skillName);

    if (!fs.existsSync(skillDir)) fatal(`Skill not found: ${skillName}`);

    stepLine();
    step(c.bold(`Skill Analysis: ${skillName}`), S.diamondFilled, "cyan");
    console.log(`${c.gray(S.branch)}  ${c.dim("Path: " + skillDir)}`);
    stepLine();

    // SKILL.md frontmatter
    const smp = path.join(skillDir, "SKILL.md");
    if (fs.existsSync(smp)) {
        const m = parseSkillMdFrontmatter(smp);
        console.log(`${c.gray(S.branch)}  ${c.cyan("SKILL.md Frontmatter:")}`);
        console.log(`${c.gray(S.branch)}    Name: ${m.name || c.dim("(not set)")}`);
        console.log(`${c.gray(S.branch)}    Description: ${m.description ? m.description.substring(0, 60) : c.red("(MISSING)")}`);
        if (m.tags) console.log(`${c.gray(S.branch)}    Tags: ${m.tags.join(", ")}`);
        stepLine();
    }

    // Structure
    const structure = detectSkillStructure(skillDir);
    console.log(`${c.gray(S.branch)}  ${c.cyan("Structure:")}`);

    const items = [
        ["resources", structure.hasResources],
        ["examples", structure.hasExamples],
        ["scripts", structure.hasScripts],
        ["constitution", structure.hasConstitution],
        ["doctrines", structure.hasDoctrines]
    ];

    items.forEach(([n, has]) => {
        console.log(`${c.gray(S.branch)}    ${has ? c.green(S.check) : c.dim("○")} ${has ? c.bold(n) : c.dim(n)}`);
    });

    stepLine();

    // Antigravity Score
    let score = 0;
    if (fs.existsSync(smp)) score += 20;
    const m = parseSkillMdFrontmatter(smp);
    if (m.description) score += 25;
    if (m.tags && m.tags.length > 0) score += 10;
    if (structure.hasResources || structure.hasExamples || structure.hasScripts) score += 20;
    if (fs.existsSync(path.join(skillDir, ".skill-source.json"))) score += 10;
    if (structure.hasConstitution || structure.hasDoctrines) score += 15;

    const scoreColor = score >= 80 ? c.green : score >= 50 ? c.yellow : c.red;
    console.log(`${c.gray(S.branch)}  ${c.cyan("Antigravity Score:")} ${scoreColor(score + "/100")}`);
    stepLine();
}
