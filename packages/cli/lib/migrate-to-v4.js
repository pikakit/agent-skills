#!/usr/bin/env node
/**
 * Migration Script: v3.x → v4.x Cognitive Lesson Engine
 * 
 * This script:
 * 1. Backs up current lessons-learned.yaml
 * 2. Classifies lessons into mistakes vs improvements
 * 3. Generates mistakes.yaml and improvements.yaml
 * 4. Preserves all existing data
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const PROJECT_ROOT = path.join(__dirname, '../../..');
const KNOWLEDGE_DIR = path.join(PROJECT_ROOT, '.agent/knowledge');
const LESSONS_PATH = path.join(KNOWLEDGE_DIR, 'lessons-learned.yaml');
const BACKUP_DIR = path.join(KNOWLEDGE_DIR, '_migration_backup');
const MISTAKES_PATH = path.join(KNOWLEDGE_DIR, 'mistakes.yaml');
const IMPROVEMENTS_PATH = path.join(KNOWLEDGE_DIR, 'improvements.yaml');

// ============================================================================
// STEP 1: Backup Current Data
// ============================================================================

function backupCurrentLessons() {
    console.log('📦 Step 1: Backing up current lessons...');

    if (!fs.existsSync(LESSONS_PATH)) {
        console.log('⚠️  No lessons-learned.yaml found, skipping backup');
        return null;
    }

    // Create backup directory
    fs.mkdirSync(BACKUP_DIR, { recursive: true });

    // Backup with timestamp
    const timestamp = new Date().toISOString().replace(/:/g, '-');
    const backupPath = path.join(BACKUP_DIR, `lessons-learned_${timestamp}.yaml`);

    fs.copyFileSync(LESSONS_PATH, backupPath);
    console.log(`✅ Backup created: ${backupPath}`);

    // Load and return data
    const content = fs.readFileSync(LESSONS_PATH, 'utf8');
    return yaml.load(content);
}

// ============================================================================
// STEP 2: Classification Logic
// ============================================================================

/**
 * Auto-classify lesson as mistake or improvement
 * Conservative: default to mistake (safer assumption)
 */
function classifyLesson(lesson) {
    const message = lesson.message.toLowerCase();

    // Keywords that indicate improvement/best practice
    const improvementKeywords = [
        'use ', 'always use', 'prefer ', 'should use',
        'best practice', 'recommended', 'instead use',
        'better to', 'proper way', 'correct approach'
    ];

    // Keywords that indicate mistake/anti-pattern
    const mistakeKeywords = [
        'never', 'avoid', 'don\'t', 'do not', 'incorrect',
        'wrong', 'bad', 'conflicts', 'causes', 'breaks'
    ];

    const hasMistakeKeyword = mistakeKeywords.some(kw => message.includes(kw));
    const hasImprovementKeyword = improvementKeywords.some(kw => message.includes(kw));

    // Both keywords present - need manual review
    if (hasMistakeKeyword && hasImprovementKeyword) {
        return 'mixed';
    }

    // Clear improvement
    if (hasImprovementKeyword && !hasMistakeKeyword) {
        return 'improvement';
    }

    // Default: mistake (conservative)
    return 'mistake';
}

/**
 * Extract tags from lesson data
 * Tags used for grouping into Cognitive Lessons
 */
function extractTags(lesson) {
    const tags = new Set();

    // Add category as tag
    if (lesson.category) {
        tags.add(lesson.category);
    }

    // Extract from pattern
    const pattern = lesson.pattern.toLowerCase();
    if (pattern.includes('select')) tags.add('cli-navigation');
    if (pattern.includes('menu')) tags.add('ux');
    if (pattern.includes('rename') || pattern.includes('move') || pattern.includes('rebrand')) {
        tags.add('file-safety');
        tags.add('rebranding');
    }
    if (pattern.includes('import')) tags.add('imports');
    if (pattern.includes('recursive')) tags.add('architecture');

    // Extract from message
    const message = lesson.message.toLowerCase();
    if (message.includes('esc')) tags.add('cli-navigation');
    if (message.includes('clack')) tags.add('clack-framework');
    if (message.includes('menu')) tags.add('ux');
    if (message.includes('security')) tags.add('security');
    if (message.includes('performance')) tags.add('performance');

    return Array.from(tags);
}

/**
 * Split mixed lessons into mistake + improvement
 */
function splitMixedLesson(lesson) {
    const message = lesson.message;

    // Try to extract both parts
    // Pattern: "NEVER X. Use Y instead"
    const neverMatch = message.match(/(NEVER|Don't|Avoid)\s+([^.]+)\./i);
    const useMatch = message.match(/(Use|Always use|Instead use)\s+([^.]+)/i);

    const mistake = {
        ...lesson,
        id: lesson.id.replace('LEARN', 'MISTAKE'),
        title: neverMatch ? neverMatch[0] : message.split('.')[0],
        message: neverMatch ? neverMatch[0] : message.split('.')[0],
    };

    let improvement = null;
    if (useMatch) {
        improvement = {
            id: lesson.id.replace('LEARN', 'IMPROVE'),
            title: useMatch[0],
            message: useMatch[0],
            pattern: lesson.pattern,
            priority: lesson.severity === 'ERROR' ? 'HIGH' : 'MEDIUM',
            tags: extractTags(lesson),
            added: lesson.addedAt,
            appliedCount: 0,
        };
    }

    return { mistake, improvement };
}

// ============================================================================
// STEP 3: Migration Logic
// ============================================================================

function migrateToV4(oldData) {
    console.log('\n🔄 Step 2: Classifying lessons...');

    const mistakes = [];
    const improvements = [];
    const needsReview = [];

    oldData.lessons.forEach((lesson, index) => {
        const classification = classifyLesson(lesson);
        const tags = extractTags(lesson);

        console.log(`  ${lesson.id}: ${classification} (tags: ${tags.join(', ')})`);

        if (classification === 'mistake') {
            mistakes.push({
                id: lesson.id.replace('LEARN', 'MISTAKE'),
                title: lesson.message.split('.')[0], // First sentence as title
                pattern: lesson.pattern,
                message: lesson.message,
                severity: lesson.severity,
                tags,
                context: lesson.category,
                hitCount: lesson.hitCount || 0,
                lastHit: lesson.lastHit,
                added: lesson.addedAt,
                source: lesson.source,
                excludePaths: lesson.excludePaths || [],
            });
        } else if (classification === 'improvement') {
            improvements.push({
                id: lesson.id.replace('LEARN', 'IMPROVE'),
                title: lesson.message.split('.')[0],
                pattern: lesson.pattern,
                message: lesson.message,
                priority: lesson.severity === 'ERROR' ? 'HIGH' : 'MEDIUM',
                tags,
                added: lesson.addedAt,
                appliedCount: lesson.hitCount || 0,
                lastApplied: lesson.lastHit,
                source: lesson.source,
            });
        } else {
            // Mixed - split into both
            const { mistake, improvement } = splitMixedLesson(lesson);
            mistakes.push({
                ...mistake,
                severity: lesson.severity,
                tags,
                hitCount: lesson.hitCount || 0,
                lastHit: lesson.lastHit,
                added: lesson.addedAt,
                source: lesson.source,
                excludePaths: lesson.excludePaths || [],
            });

            if (improvement) {
                improvements.push({
                    ...improvement,
                    source: lesson.source,
                });
            }

            needsReview.push({
                ...lesson,
                reason: 'Mixed mistake + improvement keywords, auto-split but needs verification',
            });
        }
    });

    console.log(`\n✅ Classification complete:`);
    console.log(`   ${mistakes.length} mistakes`);
    console.log(`   ${improvements.length} improvements`);
    console.log(`   ${needsReview.length} need manual review`);

    return { mistakes, improvements, needsReview };
}

// ============================================================================
// STEP 4: Save New Files
// ============================================================================

function saveYAML(filename, data) {
    const filepath = path.join(KNOWLEDGE_DIR, filename);
    const yamlStr = yaml.dump(data, {
        lineWidth: -1,
        noRefs: true,
        sortKeys: false,
    });
    fs.writeFileSync(filepath, yamlStr, 'utf8');
    console.log(`✅ Created: ${filename}`);
}

function saveNewStructure(result) {
    console.log('\n📝 Step 3: Creating new data files...');

    // Save mistakes
    saveYAML('mistakes.yaml', {
        version: 4.0,
        mistakes: result.mistakes,
    });

    // Save improvements
    saveYAML('improvements.yaml', {
        version: 4.0,
        improvements: result.improvements,
    });

    // Save review queue if needed
    if (result.needsReview.length > 0) {
        saveYAML('_needs_review.yaml', {
            note: 'These lessons contained both mistake and improvement keywords and were auto-split. Please review.',
            items: result.needsReview,
        });
        console.log(`⚠️  ${result.needsReview.length} items saved to _needs_review.yaml`);
    }
}

// ============================================================================
// MAIN MIGRATION
// ============================================================================

async function main() {
    console.log('🧠 Cognitive Lesson Engine v4.x Migration\n');
    console.log('This script will transform your lessons into the new architecture.');
    console.log('All existing data will be preserved in backups.\n');

    try {
        // Step 1: Backup
        const oldData = backupCurrentLessons();

        if (!oldData || !oldData.lessons || oldData.lessons.length === 0) {
            console.log('❌ No lessons found to migrate.');
            return;
        }

        // Step 2: Classify
        const result = migrateToV4(oldData);

        // Step 3: Save
        saveNewStructure(result);

        // Step 4: Summary
        console.log('\n🎉 Migration complete!');
        console.log('\nNext steps:');
        console.log('  1. Review _needs_review.yaml (if exists)');
        console.log('  2. Test with: node packages/cli/lib/ui/index.js');
        console.log('  3. Original file preserved in _migration_backup/');
        console.log('\n✅ You can now use the Cognitive Lesson Engine!');

    } catch (error) {
        console.error('\n❌ Migration failed:', error.message);
        console.error(error.stack);
        process.exit(1);
    }
}

main();
