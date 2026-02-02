#!/usr/bin/env node
/**
 * Quick Skill Validator - Minimal validation for skills
 * Usage: node quick_validate.js <skill_directory>
 */

import { readFileSync, existsSync } from 'fs';
import { resolve, join } from 'path';

function validateSkill(skillPath) {
    const skillDir = resolve(skillPath);

    // Check SKILL.md exists
    const skillMd = join(skillDir, 'SKILL.md');
    if (!existsSync(skillMd)) {
        return { valid: false, message: 'SKILL.md not found' };
    }

    // Read and validate frontmatter
    const content = readFileSync(skillMd, 'utf-8');
    if (!content.startsWith('---')) {
        return { valid: false, message: 'No YAML frontmatter found' };
    }

    // Extract frontmatter
    const match = content.match(/^---\n([\s\S]*?)\n---/);
    if (!match) {
        return { valid: false, message: 'Invalid frontmatter format' };
    }

    const frontmatter = match[1];

    // Check required fields
    if (!frontmatter.includes('name:')) {
        return { valid: false, message: "Missing 'name' in frontmatter" };
    }
    if (!frontmatter.includes('description:')) {
        return { valid: false, message: "Missing 'description' in frontmatter" };
    }

    // Extract and validate name
    const nameMatch = frontmatter.match(/name:\s*(.+)/);
    if (nameMatch) {
        const name = nameMatch[1].trim();
        // Check hyphen-case
        if (!/^[a-z0-9-]+$/.test(name)) {
            return { valid: false, message: `Name '${name}' should be hyphen-case (lowercase letters, digits, and hyphens only)` };
        }
        if (name.startsWith('-') || name.endsWith('-') || name.includes('--')) {
            return { valid: false, message: `Name '${name}' cannot start/end with hyphen or contain consecutive hyphens` };
        }
    }

    // Validate description
    const descMatch = frontmatter.match(/description:\s*(.+)/);
    if (descMatch) {
        const description = descMatch[1].trim();
        if (description.includes('<') || description.includes('>')) {
            return { valid: false, message: 'Description cannot contain angle brackets (< or >)' };
        }
    }

    return { valid: true, message: 'Skill is valid!' };
}

const skillPath = process.argv[2];
if (!skillPath) {
    console.log('Usage: node quick_validate.js <skill_directory>');
    process.exit(1);
}

const result = validateSkill(skillPath);
console.log(result.message);
process.exit(result.valid ? 0 : 1);
