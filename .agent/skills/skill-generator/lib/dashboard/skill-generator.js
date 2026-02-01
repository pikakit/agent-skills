/**
 * Skill Generator v7.0 - Auto-generate Skills from Patterns
 * 
 * Automatically generates new skills from learned patterns.
 * Converts high-confidence patterns into reusable skills.
 * 
 * @version 7.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Find project root
function findProjectRoot() {
    let dir = process.cwd();
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, '.agent'))) return dir;
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
        dir = path.dirname(dir);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const SKILLS_DIR = path.join(projectRoot, '.agent', 'skills', 'auto-generated');
const SKILLS_REGISTRY = path.join(SKILLS_DIR, 'registry.json');

// ============================================================================
// SKILL TEMPLATES
// ============================================================================

const SKILL_TEMPLATE = `---
name: {{name}}
description: {{description}}
metadata:
  auto_generated: true
  source_pattern: {{patternId}}
  confidence: {{confidence}}
  created: {{created}}
  version: 7.0.0
---

# {{name}}

> Auto-generated skill from learned pattern

## Description
{{description}}

## When to Use
{{trigger}}

## Resolution
{{resolution}}

## Examples
\`\`\`
{{example}}
\`\`\`

## Related Patterns
- Source: {{patternId}}
- Confidence: {{confidence}}%
- Occurrences: {{occurrences}}
`;

// ============================================================================
// DATA LOADERS
// ============================================================================

/**
 * Ensure skills directory exists
 */
function ensureSkillsDir() {
    if (!fs.existsSync(SKILLS_DIR)) {
        fs.mkdirSync(SKILLS_DIR, { recursive: true });
    }
}

/**
 * Load skills registry
 */
function loadRegistry() {
    if (fs.existsSync(SKILLS_REGISTRY)) {
        try {
            return JSON.parse(fs.readFileSync(SKILLS_REGISTRY, 'utf8'));
        } catch (e) {
            return getDefaultRegistry();
        }
    }
    return getDefaultRegistry();
}

/**
 * Save skills registry
 */
function saveRegistry(registry) {
    ensureSkillsDir();
    registry.lastUpdated = new Date().toISOString();
    fs.writeFileSync(SKILLS_REGISTRY, JSON.stringify(registry, null, 2));
}

/**
 * Get default registry structure
 */
function getDefaultRegistry() {
    return {
        skills: [],
        totalGenerated: 0,
        lastUpdated: new Date().toISOString()
    };
}

// ============================================================================
// SKILL GENERATION
// ============================================================================

/**
 * Generate a skill from a pattern
 */
export function generateSkillFromPattern(pattern) {
    ensureSkillsDir();

    // Validate pattern has required fields
    if (!pattern || !pattern.id || !pattern.cause) {
        return { success: false, error: 'Invalid pattern' };
    }

    // Check confidence threshold (min 70%)
    const confidence = pattern.confidence || 0.7;
    if (confidence < 0.7) {
        return { success: false, error: 'Pattern confidence too low (min 70%)' };
    }

    // Generate skill name from pattern
    const skillName = generateSkillName(pattern);
    const skillSlug = skillName.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');

    // Check if skill already exists
    const registry = loadRegistry();
    if (registry.skills.some(s => s.patternId === pattern.id)) {
        return { success: false, error: 'Skill already generated for this pattern' };
    }

    // Generate skill content
    const content = SKILL_TEMPLATE
        .replace(/\{\{name\}\}/g, skillName)
        .replace(/\{\{description\}\}/g, pattern.effect || 'Auto-generated skill')
        .replace(/\{\{patternId\}\}/g, pattern.id)
        .replace(/\{\{confidence\}\}/g, Math.round(confidence * 100).toString())
        .replace(/\{\{created\}\}/g, new Date().toISOString())
        .replace(/\{\{trigger\}\}/g, pattern.cause || 'When pattern detected')
        .replace(/\{\{resolution\}\}/g, pattern.resolution || 'Apply learned fix')
        .replace(/\{\{example\}\}/g, pattern.cause || '// Example code')
        .replace(/\{\{occurrences\}\}/g, (pattern.occurrences || 1).toString());

    // Write skill file
    const skillPath = path.join(SKILLS_DIR, `${skillSlug}.md`);
    fs.writeFileSync(skillPath, content);

    // Update registry
    const skillEntry = {
        id: `auto-${skillSlug}`,
        name: skillName,
        patternId: pattern.id,
        path: skillPath,
        confidence: Math.round(confidence * 100),
        created: new Date().toISOString(),
        usageCount: 0
    };

    registry.skills.push(skillEntry);
    registry.totalGenerated = (registry.totalGenerated || 0) + 1;
    saveRegistry(registry);

    return { success: true, skill: skillEntry };
}

/**
 * Generate a readable skill name from pattern
 */
function generateSkillName(pattern) {
    const category = pattern.category || 'general';
    const cause = pattern.cause || 'unknown';

    // Extract key words from cause
    const words = cause
        .replace(/[^a-zA-Z0-9\s]/g, ' ')
        .split(/\s+/)
        .filter(w => w.length > 2)
        .slice(0, 3)
        .map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase());

    if (words.length === 0) {
        words.push('Auto');
    }

    // Add category prefix
    const categoryMap = {
        'import-error': 'Import Fix',
        'type-error': 'Type Fix',
        'syntax-error': 'Syntax Fix',
        'null-reference': 'Null Check',
        'async-error': 'Async Fix',
        'api-error': 'API Fix',
        'file-error': 'File Fix',
        'config-error': 'Config Fix',
        'general': 'Auto'
    };

    const prefix = categoryMap[category] || 'Auto';
    return `${prefix}: ${words.join(' ')}`;
}

// ============================================================================
// QUERIES
// ============================================================================

/**
 * Get all auto-generated skills
 */
export function getAllSkills() {
    const registry = loadRegistry();
    return registry.skills || [];
}

/**
 * Get skill count
 */
export function getSkillCount() {
    const registry = loadRegistry();
    return registry.skills?.length || 0;
}

/**
 * Get skill stats
 */
export function getSkillStats() {
    const registry = loadRegistry();
    const skills = registry.skills || [];

    // Group by category
    const byCategory = {};
    for (const skill of skills) {
        const cat = skill.name?.split(':')[0] || 'Auto';
        byCategory[cat] = (byCategory[cat] || 0) + 1;
    }

    // Calculate average confidence
    const avgConfidence = skills.length > 0
        ? skills.reduce((sum, s) => sum + (s.confidence || 0), 0) / skills.length
        : 0;

    return {
        total: skills.length,
        totalGenerated: registry.totalGenerated || 0,
        byCategory,
        avgConfidence: Math.round(avgConfidence)
    };
}

/**
 * Load auto skills (alias for dashboard)
 */
export function loadAutoSkills() {
    return getAllSkills();
}

/**
 * Get skill by ID
 */
export function getSkill(skillId) {
    const registry = loadRegistry();
    return registry.skills?.find(s => s.id === skillId);
}

/**
 * Record skill usage
 */
export function recordSkillUsage(skillId) {
    const registry = loadRegistry();
    const skill = registry.skills?.find(s => s.id === skillId);

    if (skill) {
        skill.usageCount = (skill.usageCount || 0) + 1;
        skill.lastUsed = new Date().toISOString();
        saveRegistry(registry);
        return { success: true };
    }

    return { success: false, error: 'Skill not found' };
}

/**
 * Delete an auto-generated skill
 */
export function deleteSkill(skillId) {
    const registry = loadRegistry();
    const skillIndex = registry.skills?.findIndex(s => s.id === skillId);

    if (skillIndex === -1 || skillIndex === undefined) {
        return { success: false, error: 'Skill not found' };
    }

    const skill = registry.skills[skillIndex];

    // Delete the skill file
    if (skill.path && fs.existsSync(skill.path)) {
        fs.unlinkSync(skill.path);
    }

    // Remove from registry
    registry.skills.splice(skillIndex, 1);
    saveRegistry(registry);

    return { success: true };
}

// ============================================================================
// BATCH GENERATION
// ============================================================================

/**
 * Generate skills from all high-confidence patterns
 */
export async function generateFromAllPatterns(minConfidence = 0.7) {
    // Try to import causality engine
    let causalityEngine;
    try {
        causalityEngine = await import('./causality-engine.js');
    } catch (e) {
        return { success: false, error: 'Causality engine not available' };
    }

    const patterns = causalityEngine.loadCausalPatterns?.() || [];
    const results = {
        generated: 0,
        skipped: 0,
        errors: []
    };

    for (const pattern of patterns) {
        if ((pattern.confidence || 0) >= minConfidence) {
            const result = generateSkillFromPattern(pattern);
            if (result.success) {
                results.generated++;
            } else {
                if (result.error === 'Skill already generated for this pattern') {
                    results.skipped++;
                } else {
                    results.errors.push({ patternId: pattern.id, error: result.error });
                }
            }
        }
    }

    return { success: true, results };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    generateSkillFromPattern,
    getAllSkills,
    getSkillCount,
    getSkillStats,
    loadAutoSkills,
    getSkill,
    recordSkillUsage,
    deleteSkill,
    generateFromAllPatterns
};
