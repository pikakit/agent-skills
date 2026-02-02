/**
 * Skill Validator v1.0 - FAANG-Grade Validation Layer
 * 
 * Validates candidate skills before registry promotion.
 * Ensures all generated skills meet production standards.
 * 
 * @version 1.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// VALIDATION RULES
// ============================================================================

const VALIDATION_RULES = {
    // Interface completeness
    interface: {
        name: 'Interface Completeness',
        check: (skill) => {
            const required = ['name', 'description', 'inputs', 'outputs'];
            const missing = required.filter(field => !skill[field]);
            return {
                passed: missing.length === 0,
                message: missing.length ? `Missing: ${missing.join(', ')}` : 'All interface fields present'
            };
        }
    },

    // Naming convention
    naming: {
        name: 'Naming Convention',
        check: (skill) => {
            const kebabCase = /^[a-z][a-z0-9-]*[a-z0-9]$/;
            const valid = kebabCase.test(skill.name);
            return {
                passed: valid,
                message: valid ? 'Valid kebab-case name' : `Invalid name: ${skill.name} (must be kebab-case)`
            };
        }
    },

    // Idempotency check
    idempotency: {
        name: 'Idempotency',
        check: (skill) => {
            // Check for stateless indicators
            const hasState = skill.content?.includes('Math.random()') ||
                skill.content?.includes('Date.now()') ||
                skill.content?.includes('new Date()');
            return {
                passed: !hasState,
                message: hasState ? 'Contains non-idempotent operations (random/date)' : 'Skill is idempotent'
            };
        }
    },

    // Side-effect safety
    sideEffects: {
        name: 'Side-Effect Safety',
        check: (skill) => {
            const dangerous = ['fs.rm', 'fs.unlink', 'child_process.exec', 'eval('];
            const found = dangerous.filter(op => skill.content?.includes(op));
            return {
                passed: found.length === 0,
                message: found.length ? `Dangerous operations: ${found.join(', ')}` : 'No dangerous side-effects'
            };
        }
    },

    // SKILL_DESIGN_GUIDE compliance
    designGuide: {
        name: 'SKILL_DESIGN_GUIDE Compliance',
        check: (skill) => {
            const issues = [];

            // Check frontmatter
            if (!skill.frontmatter?.name) issues.push('Missing frontmatter.name');
            if (!skill.frontmatter?.description) issues.push('Missing frontmatter.description');
            if (!skill.frontmatter?.metadata?.category) issues.push('Missing metadata.category');

            // Check line count
            if (skill.lineCount > 200) issues.push(`SKILL.md too long: ${skill.lineCount} lines (max 200)`);

            return {
                passed: issues.length === 0,
                message: issues.length ? issues.join('; ') : 'Compliant with SKILL_DESIGN_GUIDE'
            };
        }
    }
};

// ============================================================================
// VALIDATOR
// ============================================================================

/**
 * Validate a candidate skill
 * @param {Object} skill - Skill to validate
 * @returns {Object} Validation result
 */
export function validateSkill(skill) {
    const results = {
        skillId: skill.id || skill.name,
        timestamp: new Date().toISOString(),
        passed: true,
        score: 0,
        checks: []
    };

    let passedCount = 0;
    const totalChecks = Object.keys(VALIDATION_RULES).length;

    for (const [ruleId, rule] of Object.entries(VALIDATION_RULES)) {
        const result = rule.check(skill);
        results.checks.push({
            rule: ruleId,
            name: rule.name,
            ...result
        });

        if (result.passed) {
            passedCount++;
        } else {
            results.passed = false;
        }
    }

    results.score = Math.round((passedCount / totalChecks) * 100);
    results.summary = `${passedCount}/${totalChecks} checks passed (${results.score}%)`;

    return results;
}

/**
 * Parse a SKILL.md file for validation
 * @param {string} skillPath - Path to skill folder
 * @returns {Object} Parsed skill object
 */
export function parseSkillForValidation(skillPath) {
    const skillMdPath = path.join(skillPath, 'SKILL.md');

    if (!fs.existsSync(skillMdPath)) {
        return { error: 'SKILL.md not found' };
    }

    const content = fs.readFileSync(skillMdPath, 'utf8');
    const lines = content.split('\n');

    // Parse YAML frontmatter
    let frontmatter = {};
    if (content.startsWith('---')) {
        const endIndex = content.indexOf('---', 3);
        if (endIndex !== -1) {
            const yamlContent = content.slice(4, endIndex).trim();
            // Simple YAML parsing for key fields
            const nameMatch = yamlContent.match(/^name:\s*(.+)$/m);
            const descMatch = yamlContent.match(/^description:\s*>-?\s*\n([\s\S]*?)(?=\n\w|$)/m) ||
                yamlContent.match(/^description:\s*(.+)$/m);
            const categoryMatch = yamlContent.match(/category:\s*["']?(\w+)["']?/m);

            frontmatter = {
                name: nameMatch?.[1]?.trim(),
                description: descMatch?.[1]?.trim(),
                metadata: {
                    category: categoryMatch?.[1]
                }
            };
        }
    }

    return {
        id: path.basename(skillPath),
        name: frontmatter.name || path.basename(skillPath),
        description: frontmatter.description || '',
        frontmatter,
        content,
        lineCount: lines.length,
        inputs: content.includes('Input') || content.includes('--'),
        outputs: content.includes('Output') || content.includes('Returns')
    };
}

/**
 * Validate skill from path
 * @param {string} skillPath - Path to skill folder
 * @returns {Object} Validation result
 */
export function validateSkillFromPath(skillPath) {
    const skill = parseSkillForValidation(skillPath);
    if (skill.error) {
        return { passed: false, error: skill.error };
    }
    return validateSkill(skill);
}

/**
 * Format validation result for display
 * @param {Object} result - Validation result
 * @returns {string} Formatted output
 */
export function formatValidationResult(result) {
    const lines = [
        `\n${'═'.repeat(60)}`,
        `  SKILL VALIDATION: ${result.skillId}`,
        `${'═'.repeat(60)}`,
        ``
    ];

    for (const check of result.checks) {
        const icon = check.passed ? '✅' : '❌';
        lines.push(`  ${icon} ${check.name}`);
        lines.push(`     ${check.message}`);
    }

    lines.push('');
    lines.push(`${'─'.repeat(60)}`);
    lines.push(`  Result: ${result.passed ? 'PASSED ✅' : 'FAILED ❌'} | Score: ${result.score}%`);
    lines.push(`${'═'.repeat(60)}\n`);

    return lines.join('\n');
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    validateSkill,
    parseSkillForValidation,
    validateSkillFromPath,
    formatValidationResult,
    VALIDATION_RULES
};
