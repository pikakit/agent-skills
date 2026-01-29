#!/usr/bin/env node
/**
 * Skill Standard Validator
 * 
 * Validates all skills against the official skill-standard.md specification.
 * 
 * Checks:
 * - SKILL.md exists
 * - Frontmatter present and valid
 * - name field: lowercase, kebab-case, matches directory
 * - description field: non-empty, 1-1024 chars
 * - Only allowed fields used
 * - Line count < 500
 * 
 * Usage:
 *   node skill-validator.js
 *   node skill-validator.js --verbose
 *   node skill-validator.js --skill code-craft
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SKILLS_DIR = path.join(__dirname, '..', 'skills');

// Allowed frontmatter fields per standard
const ALLOWED_FIELDS = ['name', 'description', 'license', 'compatibility', 'metadata', 'allowed-tools'];

// Colors
const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

/**
 * Parse YAML frontmatter
 */
function parseFrontmatter(content) {
    if (!content.startsWith('---')) {
        return { error: 'File does not start with ---', data: null };
    }

    const endIndex = content.indexOf('---', 3);
    if (endIndex === -1) {
        return { error: 'No closing --- found', data: null };
    }

    const yamlContent = content.slice(3, endIndex).trim();
    const data = {};

    // Simple YAML parser for frontmatter
    const lines = yamlContent.split('\n');
    let currentKey = null;
    let inMultiline = false;

    for (const line of lines) {
        // Multi-line continuation: indented lines that are part of description
        if (inMultiline && line.startsWith('  ')) {
            data[currentKey] += (data[currentKey] ? ' ' : '') + line.trim();
            continue;
        }

        if (line.startsWith('  ') && currentKey === 'metadata') {
            // Handle metadata sub-fields
            const match = line.match(/^\s+(\w+):\s*(.*)$/);
            if (match) {
                if (!data.metadata) data.metadata = {};
                data.metadata[match[1]] = match[2].replace(/^["']|["']$/g, '');
            }
        } else if (!line.startsWith('  ') && line.includes(':')) {
            const colonIdx = line.indexOf(':');
            const key = line.slice(0, colonIdx).trim();
            let value = line.slice(colonIdx + 1).trim();

            // Handle multi-line description (>- or | or >)
            if (value === '>' || value === '|' || value === '>-') {
                inMultiline = true;
                currentKey = key;
                data[key] = '';
            } else {
                data[key] = value.replace(/^["']|["']$/g, '');
                currentKey = key;
                inMultiline = false;
            }
        }
    }

    return { error: null, data };
}

/**
 * Validate a single skill
 */
function validateSkill(skillDir, skillName, verbose = false) {
    const issues = [];
    const warnings = [];

    // Check SKILL.md exists
    const skillMdPath = path.join(skillDir, 'SKILL.md');
    const skillMdAltPath = path.join(skillDir, 'skill.md');

    let skillMdFile = null;
    if (fs.existsSync(skillMdPath)) {
        skillMdFile = skillMdPath;
    } else if (fs.existsSync(skillMdAltPath)) {
        skillMdFile = skillMdAltPath;
    }

    if (!skillMdFile) {
        return { valid: false, issues: ['SKILL.md not found'], warnings: [] };
    }

    const content = fs.readFileSync(skillMdFile, 'utf-8');
    const lines = content.split('\n');

    // Check line count
    if (lines.length > 500) {
        warnings.push(`Line count ${lines.length} > 500 (recommended)`);
    }

    // Parse frontmatter
    const { error, data } = parseFrontmatter(content);
    if (error) {
        return { valid: false, issues: [error], warnings: [] };
    }

    // Check required fields
    if (!data.name) {
        issues.push('Missing required field: name');
    } else {
        // Validate name
        if (data.name !== data.name.toLowerCase()) {
            issues.push(`name must be lowercase: "${data.name}"`);
        }
        if (data.name.includes('_')) {
            issues.push(`name cannot contain underscore: "${data.name}"`);
        }
        if (data.name.startsWith('-') || data.name.endsWith('-')) {
            issues.push(`name cannot start/end with hyphen: "${data.name}"`);
        }
        if (data.name.includes('--')) {
            issues.push(`name cannot have consecutive hyphens: "${data.name}"`);
        }
        if (data.name.length > 64) {
            issues.push(`name too long (${data.name.length} > 64)`);
        }
        if (data.name !== skillName) {
            warnings.push(`name "${data.name}" doesn't match directory "${skillName}"`);
        }
    }

    if (!data.description) {
        issues.push('Missing required field: description');
    } else {
        if (data.description.length > 1024) {
            issues.push(`description too long (${data.description.length} > 1024)`);
        }
        if (data.description.length < 10) {
            warnings.push('description seems too short');
        }
    }

    // Check for disallowed fields
    for (const key of Object.keys(data)) {
        if (!ALLOWED_FIELDS.includes(key)) {
            warnings.push(`Non-standard field: "${key}"`);
        }
    }

    // Check metadata values are strings
    if (data.metadata) {
        for (const [key, value] of Object.entries(data.metadata)) {
            if (typeof value !== 'string') {
                issues.push(`metadata.${key} must be a string`);
            }
        }
    }

    return {
        valid: issues.length === 0,
        issues,
        warnings,
        lineCount: lines.length,
        name: data.name,
        description: data.description?.slice(0, 50) + (data.description?.length > 50 ? '...' : '')
    };
}

/**
 * Validate all skills
 */
function validateAllSkills(verbose = false, specificSkill = null) {
    const results = {
        total: 0,
        valid: 0,
        invalid: 0,
        warnings: 0,
        skills: []
    };

    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
    const skillDirs = entries.filter(e => e.isDirectory()).map(e => e.name);

    for (const skillName of skillDirs) {
        if (specificSkill && skillName !== specificSkill) continue;

        const skillDir = path.join(SKILLS_DIR, skillName);
        const result = validateSkill(skillDir, skillName, verbose);

        results.total++;
        if (result.valid) {
            results.valid++;
        } else {
            results.invalid++;
        }
        if (result.warnings.length > 0) {
            results.warnings++;
        }

        results.skills.push({
            name: skillName,
            ...result
        });
    }

    return results;
}

/**
 * Print results
 */
function printResults(results, verbose = false) {
    console.log(`
${c.cyan}╔════════════════════════════════════════════════════════════════╗${c.reset}
${c.cyan}║${c.reset}  ${c.bold}📋 Skill Standard Validation Report${c.reset}                          ${c.cyan}║${c.reset}
${c.cyan}╚════════════════════════════════════════════════════════════════╝${c.reset}
`);

    // Summary
    console.log(`${c.bold}Summary:${c.reset}`);
    console.log(`  Total Skills: ${results.total}`);
    console.log(`  ${c.green}✅ Valid: ${results.valid}${c.reset}`);
    console.log(`  ${c.red}❌ Invalid: ${results.invalid}${c.reset}`);
    console.log(`  ${c.yellow}⚠️  With Warnings: ${results.warnings}${c.reset}\n`);

    // Invalid skills
    const invalid = results.skills.filter(s => !s.valid);
    if (invalid.length > 0) {
        console.log(`${c.red}${c.bold}❌ Invalid Skills:${c.reset}\n`);
        for (const skill of invalid) {
            console.log(`  ${c.bold}${skill.name}${c.reset}`);
            for (const issue of skill.issues) {
                console.log(`    ${c.red}• ${issue}${c.reset}`);
            }
        }
        console.log('');
    }

    // Warnings
    const withWarnings = results.skills.filter(s => s.warnings.length > 0);
    if (withWarnings.length > 0 && verbose) {
        console.log(`${c.yellow}${c.bold}⚠️ Skills with Warnings:${c.reset}\n`);
        for (const skill of withWarnings) {
            console.log(`  ${c.bold}${skill.name}${c.reset}`);
            for (const warning of skill.warnings) {
                console.log(`    ${c.yellow}• ${warning}${c.reset}`);
            }
        }
        console.log('');
    }

    // Valid skills (verbose only)
    if (verbose) {
        const validSkills = results.skills.filter(s => s.valid);
        console.log(`${c.green}${c.bold}✅ Valid Skills (${validSkills.length}):${c.reset}\n`);
        for (const skill of validSkills) {
            const lineInfo = skill.lineCount > 500 ? `${c.yellow}${skill.lineCount}${c.reset}` : skill.lineCount;
            console.log(`  ${c.green}✓${c.reset} ${skill.name} (${lineInfo} lines)`);
        }
    }

    // Final status
    console.log('');
    if (results.invalid === 0) {
        console.log(`${c.green}${c.bold}✅ All skills pass validation!${c.reset}`);
    } else {
        console.log(`${c.red}${c.bold}❌ ${results.invalid} skills need fixes${c.reset}`);
    }
}

/**
 * Main
 */
function main() {
    const args = process.argv.slice(2);
    const verbose = args.includes('--verbose') || args.includes('-v');

    let specificSkill = null;
    const skillIdx = args.indexOf('--skill');
    if (skillIdx >= 0 && args[skillIdx + 1]) {
        specificSkill = args[skillIdx + 1];
    }

    const results = validateAllSkills(verbose, specificSkill);
    printResults(results, verbose);
}

main();
