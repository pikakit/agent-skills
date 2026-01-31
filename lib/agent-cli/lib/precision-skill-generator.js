/**
 * AutoLearn v6.0 - Precision Skill Generator
 * 
 * Generates accurate, context-aware skills from patterns.
 * Uses context fingerprinting and evidence validation.
 * 
 * Key concepts:
 * - Context Fingerprint: WHO + WHAT + WHERE + WHEN to apply
 * - Evidence-Based: Requires minimum evidence before skill creation
 * - Auto-Versioning: Skills have semantic versions
 * - Lifecycle: Create → Evaluate → Prune
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { recordSkillEvent } from './metrics-collector.js';
import { shouldPromote, getReinforcementState } from './reinforcement.js';

// ============================================================================
// CONFIGURATION
// ============================================================================

const SKILLS_DIR = path.join(process.cwd(), '.agent', 'skills', 'auto-generated');
const SKILL_REGISTRY = path.join(SKILLS_DIR, 'registry.json');

// Minimum requirements for skill generation
const SKILL_REQUIREMENTS = {
    MIN_CONFIDENCE: 0.80,
    MIN_EVIDENCE: 5,
    MIN_POSITIVE_REINFORCEMENTS: 3
};

// ============================================================================
// CONTEXT FINGERPRINTING
// ============================================================================

/**
 * Create a context fingerprint for a pattern
 * @param {Object} pattern - Pattern with context
 * @returns {Object} - Context fingerprint
 */
export function createContextFingerprint(pattern) {
    const context = pattern.context || {};

    return {
        // WHO: What type of files/code
        filePatterns: context.fileTypes || extractFilePatterns(pattern),
        language: context.language || detectLanguage(pattern),

        // WHAT: What is being detected
        patternType: pattern.patternType || 'general',
        category: pattern.category || categorizePattern(pattern),

        // WHERE: In what context
        framework: context.framework || null,
        library: context.library || null,
        domain: context.domain || null,

        // WHEN: Conditions for application
        conditions: extractConditions(pattern),
        excludePaths: pattern.excludePaths || [],

        // HOW CONFIDENT
        confidence: pattern.confidence,
        evidenceCount: pattern.evidence?.length || pattern.hitCount || 0
    };
}

/**
 * Extract file patterns from pattern regex
 */
function extractFilePatterns(pattern) {
    const patterns = ['*.js', '*.ts', '*.tsx', '*.jsx'];

    // Check for specific file type hints
    if (pattern.pattern?.includes('tsx') || pattern.pattern?.includes('jsx')) {
        return ['*.tsx', '*.jsx'];
    }
    if (pattern.pattern?.includes('import')) {
        return patterns;
    }

    return patterns;
}

/**
 * Detect language from pattern
 */
function detectLanguage(pattern) {
    const p = pattern.pattern || '';

    if (p.includes('interface') || p.includes(': ')) return 'typescript';
    if (p.includes('useState') || p.includes('useEffect')) return 'react';
    if (p.includes('def ') || p.includes('import ')) return 'python';

    return 'javascript';
}

/**
 * Categorize pattern based on content
 */
function categorizePattern(pattern) {
    const p = (pattern.pattern || '').toLowerCase();
    const m = (pattern.message || '').toLowerCase();

    if (p.includes('security') || m.includes('security') || p.includes('eval')) {
        return 'security';
    }
    if (p.includes('import') || p.includes('require')) {
        return 'dependency';
    }
    if (p.includes('console') || p.includes('debugger')) {
        return 'quality';
    }
    if (p.includes('async') || p.includes('await')) {
        return 'async';
    }
    if (p.includes('type') || p.includes('interface')) {
        return 'type_safety';
    }

    return 'general';
}

/**
 * Extract conditions from pattern
 */
function extractConditions(pattern) {
    const conditions = [];

    if (pattern.cause) {
        conditions.push({ type: 'cause', value: pattern.cause });
    }

    if (pattern.context?.framework) {
        conditions.push({ type: 'framework', value: pattern.context.framework });
    }

    return conditions;
}

// ============================================================================
// SKILL GENERATION
// ============================================================================

/**
 * Check if pattern is ready to become a skill
 * @param {Object} pattern - Pattern to check
 * @returns {Object} - Readiness check result
 */
export function checkSkillReadiness(pattern) {
    const checks = {
        confidence: pattern.confidence >= SKILL_REQUIREMENTS.MIN_CONFIDENCE,
        evidence: (pattern.evidence?.length || pattern.hitCount || 0) >= SKILL_REQUIREMENTS.MIN_EVIDENCE,
        reinforcement: checkPositiveReinforcement(pattern)
    };

    const ready = Object.values(checks).every(Boolean);
    const missing = Object.entries(checks)
        .filter(([, passed]) => !passed)
        .map(([name]) => name);

    return {
        ready,
        checks,
        missing,
        requirements: SKILL_REQUIREMENTS
    };
}

/**
 * Check if pattern has enough positive reinforcement
 */
function checkPositiveReinforcement(pattern) {
    const history = pattern.reinforcementHistory || [];
    const recentPositive = history.slice(-10).filter(r => r.delta > 0).length;
    return recentPositive >= SKILL_REQUIREMENTS.MIN_POSITIVE_REINFORCEMENTS;
}

/**
 * Generate a precision skill from a pattern
 * @param {Object} pattern - Validated pattern
 * @returns {Object} - Generated skill
 */
export function generateSkill(pattern) {
    const readiness = checkSkillReadiness(pattern);
    if (!readiness.ready) {
        return { success: false, reason: 'Pattern not ready', missing: readiness.missing };
    }

    const fingerprint = createContextFingerprint(pattern);
    const skillId = generateSkillId(pattern);
    const version = '1.0.0';

    const skill = {
        // Metadata
        id: skillId,
        version,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        sourcePatternId: pattern.id,

        // Human-readable
        name: generateSkillName(pattern),
        description: pattern.message || 'Auto-generated skill',

        // Context Fingerprint (WHEN to apply)
        appliesWhen: {
            filePatterns: fingerprint.filePatterns,
            language: fingerprint.language,
            framework: fingerprint.framework,
            conditions: fingerprint.conditions
        },

        // Detection (WHAT to check)
        detection: {
            pattern: pattern.pattern,
            patternType: fingerprint.patternType,
            category: fingerprint.category
        },

        // Root Cause (WHY it's important)
        cause: {
            root: pattern.cause || 'Learned from past experience',
            effect: pattern.effect || 'May cause issues',
            evidenceCount: fingerprint.evidenceCount
        },

        // Fix (HOW to resolve)
        fix: pattern.fix || pattern.autoFix || null,

        // Metrics
        metrics: {
            confidence: pattern.confidence,
            effectiveness: 0, // Tracked over time
            timesApplied: 0,
            timesHelped: 0,
            lastReinforcement: pattern.lastReinforcement || null
        },

        // Lifecycle
        lifecycle: {
            state: 'active',
            stateChangedAt: new Date().toISOString(),
            evaluationCount: 0
        }
    };

    // Generate SKILL.md content
    const skillMd = generateSkillMarkdown(skill);

    // Save skill
    saveSkill(skill, skillMd);

    // Record for metrics
    recordSkillEvent({
        type: 'created',
        creationTime: 1 // Placeholder
    });

    return { success: true, skill, skillMd };
}

/**
 * Generate unique skill ID
 */
function generateSkillId(pattern) {
    const category = categorizePattern(pattern);
    const timestamp = Date.now().toString(36).toUpperCase();
    return `SKILL-AUTO-${category.toUpperCase()}-${timestamp}`;
}

/**
 * Generate human-readable skill name
 */
function generateSkillName(pattern) {
    const category = categorizePattern(pattern);
    const action = pattern.message?.split(' ').slice(0, 3).join(' ') || 'Auto-learned';
    return `${category}: ${action}`;
}

/**
 * Generate SKILL.md content
 */
function generateSkillMarkdown(skill) {
    return `---
name: ${skill.name}
id: ${skill.id}
version: ${skill.version}
description: ${skill.description}
triggers:
${skill.appliesWhen.filePatterns.map(p => `  - "${p}"`).join('\n')}
auto_generated: true
source_pattern: ${skill.sourcePatternId}
created: ${skill.createdAt}
---

# ${skill.name}

> Auto-generated skill from pattern learning

## When This Applies

| Condition | Value |
|-----------|-------|
| File Patterns | ${skill.appliesWhen.filePatterns.join(', ')} |
| Language | ${skill.appliesWhen.language || 'Any'} |
| Framework | ${skill.appliesWhen.framework || 'Any'} |

## What to Detect

\`\`\`regex
${skill.detection.pattern}
\`\`\`

**Category**: ${skill.detection.category}

## Why It Matters

**Root Cause**: ${skill.cause.root}

**Potential Effect**: ${skill.cause.effect}

**Evidence**: ${skill.cause.evidenceCount} occurrences recorded

## How to Fix

${skill.fix ? `
**Fix Type**: ${skill.fix.type || 'Manual'}

${skill.fix.details ? `\`\`\`
${JSON.stringify(skill.fix.details, null, 2)}
\`\`\`` : 'Follow the guidance above to resolve.'}
` : 'Manual review and correction required.'}

## Metrics

| Metric | Value |
|--------|-------|
| Confidence | ${(skill.metrics.confidence * 100).toFixed(1)}% |
| Times Applied | ${skill.metrics.timesApplied} |
| Effectiveness | ${(skill.metrics.effectiveness * 100).toFixed(1)}% |

---

*This skill was auto-generated by AutoLearn v6.0*
`;
}

// ============================================================================
// SKILL STORAGE
// ============================================================================

/**
 * Save skill to disk
 * @param {Object} skill - Skill object
 * @param {string} skillMd - SKILL.md content
 */
function saveSkill(skill, skillMd) {
    try {
        // Create directory
        const skillDir = path.join(SKILLS_DIR, skill.id.toLowerCase());
        if (!fs.existsSync(skillDir)) {
            fs.mkdirSync(skillDir, { recursive: true });
        }

        // Save SKILL.md
        fs.writeFileSync(path.join(skillDir, 'SKILL.md'), skillMd, 'utf8');

        // Save skill.json
        fs.writeFileSync(
            path.join(skillDir, 'skill.json'),
            JSON.stringify(skill, null, 2),
            'utf8'
        );

        // Update registry
        updateRegistry(skill);

    } catch (error) {
        console.error('Error saving skill:', error.message);
    }
}

/**
 * Update skill registry
 */
function updateRegistry(skill) {
    try {
        if (!fs.existsSync(SKILLS_DIR)) {
            fs.mkdirSync(SKILLS_DIR, { recursive: true });
        }

        let registry = [];
        if (fs.existsSync(SKILL_REGISTRY)) {
            registry = JSON.parse(fs.readFileSync(SKILL_REGISTRY, 'utf8'));
        }

        const existingIndex = registry.findIndex(s => s.id === skill.id);
        const entry = {
            id: skill.id,
            name: skill.name,
            version: skill.version,
            category: skill.detection.category,
            confidence: skill.metrics.confidence,
            state: skill.lifecycle.state,
            updatedAt: skill.updatedAt
        };

        if (existingIndex >= 0) {
            registry[existingIndex] = entry;
        } else {
            registry.push(entry);
        }

        fs.writeFileSync(SKILL_REGISTRY, JSON.stringify(registry, null, 2), 'utf8');
    } catch (error) {
        console.error('Error updating registry:', error.message);
    }
}

/**
 * Load all auto-generated skills
 * @returns {Array} - Array of skills
 */
export function loadAutoSkills() {
    try {
        if (!fs.existsSync(SKILL_REGISTRY)) return [];
        return JSON.parse(fs.readFileSync(SKILL_REGISTRY, 'utf8'));
    } catch {
        return [];
    }
}

/**
 * Load a specific skill
 * @param {string} skillId - Skill ID
 * @returns {Object|null} - Skill or null
 */
export function loadSkill(skillId) {
    try {
        const skillPath = path.join(SKILLS_DIR, skillId.toLowerCase(), 'skill.json');
        if (!fs.existsSync(skillPath)) return null;
        return JSON.parse(fs.readFileSync(skillPath, 'utf8'));
    } catch {
        return null;
    }
}

// ============================================================================
// SKILL LIFECYCLE
// ============================================================================

/**
 * Evaluate skill effectiveness
 * @param {string} skillId - Skill ID
 * @param {Object} outcome - Task outcome where skill was applied
 * @returns {Object} - Updated skill metrics
 */
export function evaluateSkill(skillId, outcome) {
    const skill = loadSkill(skillId);
    if (!skill) return null;

    skill.metrics.timesApplied++;

    if (outcome.success && outcome.skillHelped) {
        skill.metrics.timesHelped++;
    }

    // Recalculate effectiveness
    skill.metrics.effectiveness = skill.metrics.timesApplied > 0
        ? skill.metrics.timesHelped / skill.metrics.timesApplied
        : 0;

    skill.lifecycle.evaluationCount++;
    skill.updatedAt = new Date().toISOString();

    // Check if skill should be demoted
    if (skill.metrics.effectiveness < 0.3 && skill.metrics.timesApplied >= 10) {
        skill.lifecycle.state = 'underperforming';
        skill.lifecycle.stateChangedAt = new Date().toISOString();
    }

    // Update file
    const skillDir = path.join(SKILLS_DIR, skillId.toLowerCase());
    fs.writeFileSync(
        path.join(skillDir, 'skill.json'),
        JSON.stringify(skill, null, 2),
        'utf8'
    );
    updateRegistry(skill);

    return skill;
}

/**
 * Prune underperforming skills
 * @returns {Object} - Prune results
 */
export function pruneUnderperformingSkills() {
    const skills = loadAutoSkills();
    const pruned = [];

    for (const skillEntry of skills) {
        const skill = loadSkill(skillEntry.id);
        if (!skill) continue;

        // Prune if underperforming for too long
        if (skill.lifecycle.state === 'underperforming' && skill.lifecycle.evaluationCount >= 20) {
            skill.lifecycle.state = 'pruned';
            skill.lifecycle.stateChangedAt = new Date().toISOString();

            // Move to archive instead of delete
            archiveSkill(skill);
            pruned.push(skill.id);

            recordSkillEvent({ type: 'pruned' });
        }
    }

    return { pruned };
}

/**
 * Archive a skill (soft delete)
 */
function archiveSkill(skill) {
    try {
        const archiveDir = path.join(SKILLS_DIR, '_archive');
        if (!fs.existsSync(archiveDir)) {
            fs.mkdirSync(archiveDir, { recursive: true });
        }

        const skillDir = path.join(SKILLS_DIR, skill.id.toLowerCase());
        const archivePath = path.join(archiveDir, skill.id.toLowerCase());

        if (fs.existsSync(skillDir)) {
            fs.renameSync(skillDir, archivePath);
        }

        // Remove from registry
        const registry = loadAutoSkills().filter(s => s.id !== skill.id);
        fs.writeFileSync(SKILL_REGISTRY, JSON.stringify(registry, null, 2), 'utf8');
    } catch (error) {
        console.error('Error archiving skill:', error.message);
    }
}

/**
 * Get skill statistics
 * @returns {Object} - Statistics
 */
export function getSkillStats() {
    const skills = loadAutoSkills();

    return {
        total: skills.length,
        active: skills.filter(s => s.state === 'active').length,
        underperforming: skills.filter(s => s.state === 'underperforming').length,
        avgConfidence: skills.length > 0
            ? skills.reduce((sum, s) => sum + s.confidence, 0) / skills.length
            : 0,
        categories: [...new Set(skills.map(s => s.category))]
    };
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    createContextFingerprint,
    checkSkillReadiness,
    generateSkill,
    loadAutoSkills,
    loadSkill,
    evaluateSkill,
    pruneUnderperformingSkills,
    getSkillStats,
    SKILL_REQUIREMENTS
};
