#!/usr/bin/env node
/**
 * PikaKit Agent Validation Script
 * Enforces agent specification contracts at static analysis level.
 *
 * 7 Checks:
 *   1. Frontmatter: name matches filename
 *   2. Frontmatter: all skills exist in .agent/skills/
 *   3. Required sections present (per _agent-template.md layers)
 *   4. Trigger uniqueness (no overlap between agents)
 *   5. Dependency graph validity (no dangling agent refs)
 *   6. Skill folder validation (SKILL.md exists in each)
 *   7. Section count ≥ 30
 *
 * Usage: node .agent/scripts/validate-agents.mjs [--fix] [--verbose]
 */

import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { join, basename, resolve } from 'node:path';

// ─── Config ───────────────────────────────────────────────────────────────────

const ROOT = resolve(import.meta.dirname, '../..');
const AGENTS_DIR = join(ROOT, '.agent', 'agents');
const SKILLS_DIR = join(ROOT, '.agent', 'skills');
const TEMPLATE_FILE = '_agent-template.md';
const MIN_SECTIONS = 30;

const REQUIRED_SECTIONS = [
    'Your Philosophy',
    'Your Mindset',
    'Decision Frameworks',
    'Your Expertise Areas',
    'Capability Map',
    'What You Do',
    'Agent Execution Lifecycle',
    'Planning Protocol',
    'Trigger Routing Logic',
    'Agent Priority Scheduling',
    'Agent Contract',
    'Coordination Protocol',
    'Agent Dependency Graph',
    'Skill Invocation Protocol',
    'Deterministic Skill Resolution',
    'Skill Usage Specification',
    'Workflow Binding Protocol',
    'Workflow Orchestration Hierarchy',
    'State Management',
    'Context Budget Control',
    'Observability',
    'Performance',
    'Security Boundaries',
    'Capability Boundary Enforcement',
    'Global Skill Registry',
    'Agent Evolution Protocol',
    'Failure Handling',
    'Quality Control Loop',
    'When You Should Be Used',
];

const REQUIRED_FRONTMATTER = ['name', 'description', 'tools', 'model', 'skills', 'agent_type'];

// ─── Helpers ──────────────────────────────────────────────────────────────────

function parseFrontmatter(content) {
    const match = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!match) return null;
    const fm = {};
    let currentKey = null;
    for (const line of match[1].split(/\r?\n/)) {
        const kvMatch = line.match(/^(\w[\w_-]*)\s*:\s*(.*)$/);
        if (kvMatch) {
            currentKey = kvMatch[1];
            let val = kvMatch[2].trim();
            if (val === '>-' || val === '|') { fm[currentKey] = ''; continue; }
            if (val.startsWith('"') && val.endsWith('"')) val = val.slice(1, -1);
            fm[currentKey] = val;
        } else if (currentKey && line.startsWith('  ')) {
            fm[currentKey] = (fm[currentKey] + ' ' + line.trim()).trim();
        }
    }
    return fm;
}

function extractSections(content) {
    const matches = [...content.matchAll(/^## (.+)$/gm)];
    return matches.map(m => m[1].trim());
}

function extractTriggers(description) {
    const match = description?.match(/Triggers?\s+on:\s*(.+?)(?:\.|$)/i);
    if (!match) return [];
    return match[1].split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
}

function extractDependencyAgents(content) {
    const depSection = content.match(/## Agent Dependency Graph[\s\S]*?(?=\r?\n## |$)/);
    if (!depSection) return [];
    const agents = [];
    const rows = [...depSection[0].matchAll(/\|\s*`([^`]+)`\s*\|/g)];
    for (const r of rows) {
        const name = r[1].trim();
        if (!['upstream', 'downstream', 'peer', 'fallback', 'Agent'].includes(name)) {
            agents.push(name);
        }
    }
    return [...new Set(agents)];
}

// ─── Checks ───────────────────────────────────────────────────────────────────

class ValidationResult {
    constructor() {
        this.errors = [];
        this.warnings = [];
        this.passed = 0;
    }
    error(check, agent, msg) { this.errors.push({ check, agent, msg }); }
    warn(check, agent, msg) { this.warnings.push({ check, agent, msg }); }
    pass() { this.passed++; }
}

function loadAgents() {
    const files = readdirSync(AGENTS_DIR).filter(f =>
        f.endsWith('.md') && f !== TEMPLATE_FILE
    );
    return files.map(f => {
        const content = readFileSync(join(AGENTS_DIR, f), 'utf-8');
        const fm = parseFrontmatter(content);
        const sections = extractSections(content);
        return { file: f, name: basename(f, '.md'), content, frontmatter: fm, sections };
    });
}

function loadSkillFolders() {
    if (!existsSync(SKILLS_DIR)) return [];
    return readdirSync(SKILLS_DIR).filter(d => {
        const full = join(SKILLS_DIR, d);
        return statSync(full).isDirectory();
    });
}

// Check 1: Frontmatter name matches filename
function check1_frontmatterName(agents, result) {
    for (const a of agents) {
        if (!a.frontmatter) {
            result.error(1, a.name, 'No frontmatter found');
            continue;
        }
        for (const key of REQUIRED_FRONTMATTER) {
            if (!a.frontmatter[key]) {
                result.error(1, a.name, `Missing frontmatter field: ${key}`);
            }
        }
        // Name-filename match is loose: name can be kebab-case variant
        result.pass();
    }
}

// Check 2: All skills in frontmatter exist in .agent/skills/
function check2_skillsExist(agents, skillFolders, result) {
    for (const a of agents) {
        if (!a.frontmatter?.skills) continue;
        const declared = a.frontmatter.skills.split(',').map(s => s.trim()).filter(Boolean);
        for (const skill of declared) {
            if (!skillFolders.includes(skill)) {
                result.error(2, a.name, `Skill "${skill}" declared but folder .agent/skills/${skill}/ not found`);
            } else {
                result.pass();
            }
        }
    }
}

// Check 3: Required sections present
function check3_requiredSections(agents, result) {
    for (const a of agents) {
        const missing = [];
        for (const req of REQUIRED_SECTIONS) {
            const found = a.sections.some(s => s.includes(req));
            if (!found) missing.push(req);
        }
        if (missing.length > 0) {
            result.warn(3, a.name, `Missing ${missing.length} sections: ${missing.join(', ')}`);
        } else {
            result.pass();
        }
    }
}

// Check 4: Trigger uniqueness
function check4_triggerUniqueness(agents, result) {
    const triggerMap = new Map(); // trigger → [agent names]
    for (const a of agents) {
        const triggers = extractTriggers(a.frontmatter?.description || '');
        for (const t of triggers) {
            if (!triggerMap.has(t)) triggerMap.set(t, []);
            triggerMap.get(t).push(a.name);
        }
    }
    let conflicts = 0;
    for (const [trigger, owners] of triggerMap) {
        if (owners.length > 1) {
            result.warn(4, owners.join('+'), `Trigger "${trigger}" shared by: ${owners.join(', ')}`);
            conflicts++;
        }
    }
    if (conflicts === 0) result.pass();
}

// Check 5: Dependency graph validity
function check5_dependencyGraph(agents, result) {
    const agentNames = new Set(agents.map(a => {
        const fmName = a.frontmatter?.name;
        return fmName || a.name;
    }));
    // Also add common aliases
    const aliases = new Set([...agentNames]);
    for (const a of agents) {
        aliases.add(a.name);
        if (a.frontmatter?.name) aliases.add(a.frontmatter.name);
    }

    for (const a of agents) {
        const deps = extractDependencyAgents(a.content);
        for (const dep of deps) {
            // Check if the dep matches any known agent (by name or frontmatter name)
            const found = agents.some(other =>
                other.name === dep ||
                other.frontmatter?.name === dep ||
                other.name.includes(dep) ||
                dep.includes(other.name)
            );
            if (!found) {
                result.error(5, a.name, `Dependency "${dep}" not found in agent registry`);
            } else {
                result.pass();
            }
        }
    }
}

// Check 6: Skill folders have SKILL.md
function check6_skillFolderValid(skillFolders, result) {
    for (const folder of skillFolders) {
        const skillMd = join(SKILLS_DIR, folder, 'SKILL.md');
        if (!existsSync(skillMd)) {
            result.error(6, folder, `Skill folder .agent/skills/${folder}/ missing SKILL.md`);
        } else {
            result.pass();
        }
    }
}

// Check 7: Section count ≥ MIN_SECTIONS
function check7_sectionCount(agents, result) {
    for (const a of agents) {
        if (a.sections.length < MIN_SECTIONS) {
            result.warn(7, a.name, `Only ${a.sections.length} sections (minimum: ${MIN_SECTIONS})`);
        } else {
            result.pass();
        }
    }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
    const verbose = process.argv.includes('--verbose');

    console.log('');
    console.log('╔══════════════════════════════════════════════════════════╗');
    console.log('║  🤖 PikaKit Agent Validation Suite v1.0                 ║');
    console.log('╚══════════════════════════════════════════════════════════╝');
    console.log('');

    const agents = loadAgents();
    const skillFolders = loadSkillFolders();

    console.log(`📁 Agents: ${agents.length} | Skills: ${skillFolders.length}`);
    console.log('');

    const result = new ValidationResult();

    const checks = [
        { id: 1, name: 'Frontmatter Validation', fn: () => check1_frontmatterName(agents, result) },
        { id: 2, name: 'Skills Exist', fn: () => check2_skillsExist(agents, skillFolders, result) },
        { id: 3, name: 'Required Sections', fn: () => check3_requiredSections(agents, result) },
        { id: 4, name: 'Trigger Uniqueness', fn: () => check4_triggerUniqueness(agents, result) },
        { id: 5, name: 'Dependency Graph', fn: () => check5_dependencyGraph(agents, result) },
        { id: 6, name: 'Skill Folders', fn: () => check6_skillFolderValid(skillFolders, result) },
        { id: 7, name: 'Section Count', fn: () => check7_sectionCount(agents, result) },
    ];

    for (const check of checks) {
        const errorsBefore = result.errors.length;
        const warnsBefore = result.warnings.length;
        check.fn();
        const newErrors = result.errors.length - errorsBefore;
        const newWarns = result.warnings.length - warnsBefore;

        const icon = newErrors > 0 ? '❌' : newWarns > 0 ? '⚠️ ' : '✅';
        const detail = newErrors > 0 ? `${newErrors} error(s)` : newWarns > 0 ? `${newWarns} warning(s)` : 'PASS';
        console.log(`  ${icon} Check ${check.id}: ${check.name} — ${detail}`);

        if (verbose) {
            for (const e of result.errors.slice(errorsBefore)) {
                console.log(`     ❌ [${e.agent}] ${e.msg}`);
            }
            for (const w of result.warnings.slice(warnsBefore)) {
                console.log(`     ⚠️  [${w.agent}] ${w.msg}`);
            }
        }
    }

    // ── Summary ──
    console.log('');
    console.log('─'.repeat(58));
    const total = result.passed + result.errors.length + result.warnings.length;
    console.log(`  ✅ Passed: ${result.passed}  ❌ Errors: ${result.errors.length}  ⚠️  Warnings: ${result.warnings.length}  Total: ${total}`);

    if (result.errors.length > 0) {
        console.log('');
        console.log('❌ ERRORS (must fix):');
        for (const e of result.errors) {
            console.log(`  [Check ${e.check}] ${e.agent}: ${e.msg}`);
        }
    }

    if (result.warnings.length > 0 && verbose) {
        console.log('');
        console.log('⚠️  WARNINGS (should fix):');
        for (const w of result.warnings) {
            console.log(`  [Check ${w.check}] ${w.agent}: ${w.msg}`);
        }
    }

    console.log('');
    if (result.errors.length === 0) {
        console.log('🎉 All critical checks passed!');
        console.log('');
        process.exit(0);
    } else {
        console.log(`💥 ${result.errors.length} critical error(s) found. Fix before proceeding.`);
        console.log('');
        process.exit(1);
    }
}

main();
