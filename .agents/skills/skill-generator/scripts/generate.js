#!/usr/bin/env node
/**
 * Skill Generator CLI v1.0 - Main Entry Point
 * 
 * Generate, validate, and promote skills with promotion flow.
 * 
 * Commands:
 *   generate --from-pattern <name>   Generate candidate from pattern
 *   generate --from-lesson <id>      Generate candidate from lesson
 *   validate <skill-id>              Validate a candidate skill
 *   promote <skill-id>               Promote to registry
 *   rollback <skill-id>              Remove from registry
 *   list [--status candidate|approved]
 * 
 * @version 1.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Local imports
import patternAnalyzer from '../lib/pattern-analyzer.js';
import skillValidator from '../lib/skill-validator.js';
import skillTemplate from '../lib/skill-template.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// FIND PROJECT ROOT
// ============================================================================

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
const SKILLS_DIR = path.join(projectRoot, '.agent', 'skills');
const GENERATED_DIR = path.join(SKILLS_DIR, 'auto-generated');
const REGISTRY_FILE = path.join(GENERATED_DIR, 'registry.json');

// ============================================================================
// REGISTRY MANAGEMENT
// ============================================================================

function loadRegistry() {
    try {
        if (fs.existsSync(REGISTRY_FILE)) {
            return JSON.parse(fs.readFileSync(REGISTRY_FILE, 'utf8'));
        }
    } catch (err) {
        console.error('Error loading registry:', err.message);
    }
    return { skills: [], lastUpdated: null };
}

function saveRegistry(registry) {
    fs.mkdirSync(path.dirname(REGISTRY_FILE), { recursive: true });
    registry.lastUpdated = new Date().toISOString();
    fs.writeFileSync(REGISTRY_FILE, JSON.stringify(registry, null, 2));
}

// ============================================================================
// COMMANDS
// ============================================================================

/**
 * Generate a candidate skill
 */
async function cmdGenerate(args) {
    console.log('\n🔧 SKILL GENERATOR - Generate Candidate\n');

    const fromPattern = args.find(a => a === '--from-pattern');
    const fromLesson = args.find(a => a === '--from-lesson');

    if (fromPattern) {
        const patternName = args[args.indexOf('--from-pattern') + 1];
        console.log(`Generating from pattern: ${patternName || 'all ready patterns'}`);

        // Get ready patterns
        const patterns = patternAnalyzer.getReadyPatterns(70);

        if (patterns.length === 0) {
            console.log('❌ No patterns ready for skill generation');
            console.log('   Patterns need ≥3 occurrences and ≥70% success rate');
            return;
        }

        console.log(`\n📊 Found ${patterns.length} ready patterns:\n`);

        for (const pattern of patterns) {
            console.log(`  • ${pattern.pattern}`);
            console.log(`    Confidence: ${pattern.confidence}% | Occurrences: ${pattern.occurrences}`);

            // Generate skill
            const skill = skillTemplate.generateSkillFromPattern(pattern);
            const result = skillTemplate.createSkillFiles(skill, GENERATED_DIR);

            // Add to registry as candidate
            const registry = loadRegistry();
            const entry = skillTemplate.createRegistryEntry(skill);
            registry.skills.push(entry);
            saveRegistry(registry);

            console.log(`    ✅ Created: ${result.path}`);
            console.log(`    📝 Status: candidate (run 'validate' then 'promote')\n`);
        }

    } else if (fromLesson) {
        const lessonId = args[args.indexOf('--from-lesson') + 1];
        console.log(`Generating from lesson: ${lessonId}`);
        console.log('⚠️  Lesson-based generation not yet implemented');

    } else {
        console.log('Usage:');
        console.log('  generate --from-pattern [name]');
        console.log('  generate --from-lesson <lesson-id>');
    }
}

/**
 * Validate a candidate skill
 */
async function cmdValidate(args) {
    console.log('\n🔍 SKILL GENERATOR - Validate Skill\n');

    const skillId = args[0];

    if (!skillId) {
        // Validate all candidates
        const registry = loadRegistry();
        const candidates = registry.skills.filter(s => s.status === 'candidate');

        if (candidates.length === 0) {
            console.log('No candidate skills to validate');
            return;
        }

        console.log(`Validating ${candidates.length} candidate(s)...\n`);

        for (const skill of candidates) {
            const skillPath = path.join(projectRoot, skill.path);
            const result = skillValidator.validateSkillFromPath(skillPath);
            console.log(skillValidator.formatValidationResult(result));
        }

    } else {
        // Validate specific skill
        const skillPath = path.join(GENERATED_DIR, skillId);

        if (!fs.existsSync(skillPath)) {
            console.log(`❌ Skill not found: ${skillId}`);
            return;
        }

        const result = skillValidator.validateSkillFromPath(skillPath);
        console.log(skillValidator.formatValidationResult(result));
    }
}

/**
 * Promote a skill to approved status
 */
async function cmdPromote(args) {
    console.log('\n🚀 SKILL GENERATOR - Promote Skill\n');

    const skillId = args[0];

    if (!skillId) {
        console.log('Usage: promote <skill-id>');
        return;
    }

    const registry = loadRegistry();
    const skill = registry.skills.find(s => s.name === skillId || s.id === skillId);

    if (!skill) {
        console.log(`❌ Skill not found: ${skillId}`);
        return;
    }

    if (skill.status === 'approved') {
        console.log(`⚠️  Skill already approved: ${skillId}`);
        return;
    }

    // Validate first
    const skillPath = path.join(projectRoot, skill.path);
    const validation = skillValidator.validateSkillFromPath(skillPath);

    if (!validation.passed) {
        console.log('❌ Skill failed validation. Fix issues before promoting:');
        console.log(skillValidator.formatValidationResult(validation));
        return;
    }

    // Promote
    skill.status = 'approved';
    skill.promotedAt = new Date().toISOString();
    saveRegistry(registry);

    console.log(`✅ Promoted: ${skill.name}`);
    console.log(`   Path: ${skill.path}`);
    console.log(`   Status: approved`);
}

/**
 * Rollback a promoted skill
 */
async function cmdRollback(args) {
    console.log('\n⏪ SKILL GENERATOR - Rollback Skill\n');

    const skillId = args[0];

    if (!skillId) {
        console.log('Usage: rollback <skill-id>');
        return;
    }

    const registry = loadRegistry();
    const skillIndex = registry.skills.findIndex(s => s.name === skillId || s.id === skillId);

    if (skillIndex === -1) {
        console.log(`❌ Skill not found: ${skillId}`);
        return;
    }

    const skill = registry.skills[skillIndex];

    // Remove from registry (don't delete files for safety)
    registry.skills.splice(skillIndex, 1);
    saveRegistry(registry);

    console.log(`✅ Rolled back: ${skill.name}`);
    console.log(`   Files preserved at: ${skill.path}`);
    console.log(`   Removed from registry`);
}

/**
 * List skills
 */
async function cmdList(args) {
    console.log('\n📋 SKILL GENERATOR - List Skills\n');

    const statusFilter = args.includes('--status') ?
        args[args.indexOf('--status') + 1] : null;

    const registry = loadRegistry();
    let skills = registry.skills;

    if (statusFilter) {
        skills = skills.filter(s => s.status === statusFilter);
    }

    if (skills.length === 0) {
        console.log('No skills found');
        return;
    }

    console.log(`Found ${skills.length} skill(s):\n`);

    // Group by status
    const byStatus = skills.reduce((acc, s) => {
        acc[s.status] = acc[s.status] || [];
        acc[s.status].push(s);
        return acc;
    }, {});

    for (const [status, statusSkills] of Object.entries(byStatus)) {
        const icon = status === 'approved' ? '✅' : status === 'candidate' ? '📝' : '⚠️';
        console.log(`${icon} ${status.toUpperCase()} (${statusSkills.length}):`);

        for (const skill of statusSkills) {
            console.log(`   • ${skill.name}`);
            console.log(`     Generated: ${skill.generatedAt?.slice(0, 10) || 'unknown'}`);
            console.log(`     Usage: ${skill.usageCount} times\n`);
        }
    }
}

/**
 * Show stats
 */
async function cmdStats() {
    console.log('\n📊 SKILL GENERATOR - Statistics\n');

    const patternStats = patternAnalyzer.getPatternStats();
    const registry = loadRegistry();

    console.log('Pattern Statistics:');
    console.log(`  Total patterns: ${patternStats.totalPatterns}`);
    console.log(`  Ready for skill: ${patternStats.readyForSkill}`);
    console.log(`  Avg confidence: ${patternStats.avgConfidence}%`);
    console.log(`  Rejected: ${patternStats.rejectedCount}`);

    console.log('\nGenerated Skills:');
    console.log(`  Total: ${registry.skills.length}`);
    console.log(`  Approved: ${registry.skills.filter(s => s.status === 'approved').length}`);
    console.log(`  Candidates: ${registry.skills.filter(s => s.status === 'candidate').length}`);

    console.log('\nBy Workflow:');
    for (const [wf, count] of Object.entries(patternStats.byWorkflow || {})) {
        console.log(`  ${wf}: ${count}`);
    }
}

/**
 * Show help
 */
function showHelp() {
    console.log(`
🤖 PikaKit Skill Generator v1.0.0

USAGE:
  node generate.js <command> [options]

COMMANDS:
  generate --from-pattern [name]   Generate candidate skill(s) from patterns
  generate --from-lesson <id>      Generate candidate from lesson (TODO)
  validate [skill-id]              Validate candidate skill(s)
  promote <skill-id>               Promote skill to approved status
  rollback <skill-id>              Remove skill from registry
  list [--status candidate|approved]
  stats                            Show statistics
  help                             Show this help

WORKFLOW:
  1. Patterns are collected automatically
  2. Run 'generate' to create candidate skills
  3. Run 'validate' to check compliance
  4. Run 'promote' to approve for use
  5. Run 'rollback' if needed

⚡ PikaKit v3.2.0
`);
}

// ============================================================================
// MAIN
// ============================================================================

const args = process.argv.slice(2);
const command = args[0];
const commandArgs = args.slice(1);

switch (command) {
    case 'generate':
        cmdGenerate(commandArgs);
        break;
    case 'validate':
        cmdValidate(commandArgs);
        break;
    case 'promote':
        cmdPromote(commandArgs);
        break;
    case 'rollback':
        cmdRollback(commandArgs);
        break;
    case 'list':
        cmdList(commandArgs);
        break;
    case 'stats':
        cmdStats();
        break;
    case 'help':
    case '--help':
    case '-h':
        showHelp();
        break;
    default:
        if (command) {
            console.log(`Unknown command: ${command}`);
        }
        showHelp();
}
