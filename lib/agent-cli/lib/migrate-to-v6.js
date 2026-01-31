#!/usr/bin/env node
/**
 * Migration Script: v3/v4 → v6
 * 
 * Migrates legacy knowledge files to unified knowledge.yaml format.
 * 
 * Source files:
 * - lessons-learned.yaml (v3)
 * - mistakes.yaml (v4)
 * - improvements.yaml (v4)
 * 
 * Target:
 * - knowledge.yaml (v6)
 * 
 * Usage:
 *   node migrate-to-v6.js
 *   node migrate-to-v6.js --dry-run
 * 
 * @version 6.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';

// ============================================================================
// CONFIGURATION
// ============================================================================

const KNOWLEDGE_DIR = path.join(process.cwd(), '.agent', 'knowledge');
const BACKUP_DIR = path.join(KNOWLEDGE_DIR, 'backup');

const FILES = {
    lessonsLearned: path.join(KNOWLEDGE_DIR, 'lessons-learned.yaml'),
    mistakes: path.join(KNOWLEDGE_DIR, 'mistakes.yaml'),
    improvements: path.join(KNOWLEDGE_DIR, 'improvements.yaml'),
    knowledge: path.join(KNOWLEDGE_DIR, 'knowledge.yaml')
};

const isDryRun = process.argv.includes('--dry-run');

// ============================================================================
// LOGGING
// ============================================================================

const log = {
    info: (msg) => console.log(`  ℹ️  ${msg}`),
    success: (msg) => console.log(`  ✅ ${msg}`),
    warning: (msg) => console.log(`  ⚠️  ${msg}`),
    error: (msg) => console.log(`  ❌ ${msg}`),
    step: (n, msg) => console.log(`\n📌 Step ${n}: ${msg}`)
};

// ============================================================================
// BACKUP
// ============================================================================

function backupFiles() {
    log.step(1, 'Backing up existing files');

    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    let backedUp = 0;

    for (const [name, filepath] of Object.entries(FILES)) {
        if (name === 'knowledge') continue; // Don't backup target

        if (fs.existsSync(filepath)) {
            const backupPath = path.join(BACKUP_DIR, `${path.basename(filepath)}.${timestamp}.bak`);

            if (!isDryRun) {
                fs.copyFileSync(filepath, backupPath);
            }

            log.success(`Backed up ${path.basename(filepath)}`);
            backedUp++;
        }
    }

    if (backedUp === 0) {
        log.warning('No files to backup');
    }

    return true;
}

// ============================================================================
// LOADING LEGACY DATA
// ============================================================================

function loadLegacyData() {
    log.step(2, 'Loading legacy data');

    const lessons = [];
    const stats = { v3: 0, v4Mistakes: 0, v4Improvements: 0 };

    // Load v3 lessons-learned.yaml
    if (fs.existsSync(FILES.lessonsLearned)) {
        try {
            const data = yaml.load(fs.readFileSync(FILES.lessonsLearned, 'utf8'));
            const v3Lessons = (data.lessons || []).map(l => ({
                id: l.id,
                type: l.severity === 'ERROR' ? 'mistake' : 'pattern',
                pattern: l.pattern,
                message: l.message,
                severity: l.severity || 'WARNING',
                intent: l.severity === 'ERROR' ? 'prevent' : 'inform',
                confidence: l.hitCount > 10 ? 0.9 : 0.5,
                maturity: l.hitCount > 10 ? 'stable' : 'learning',
                hitCount: l.hitCount || 0,
                lastHit: l.lastHit || null,
                excludePaths: [],
                tags: [l.category || 'general'],
                autoFix: null,
                _source: 'lessons-learned.yaml'
            }));
            lessons.push(...v3Lessons);
            stats.v3 = v3Lessons.length;
            log.success(`Loaded ${v3Lessons.length} lesson(s) from lessons-learned.yaml`);
        } catch (e) {
            log.error(`Failed to load lessons-learned.yaml: ${e.message}`);
        }
    } else {
        log.info('lessons-learned.yaml not found, skipping');
    }

    // Load v4 mistakes.yaml
    if (fs.existsSync(FILES.mistakes)) {
        try {
            const data = yaml.load(fs.readFileSync(FILES.mistakes, 'utf8'));
            const mistakes = (data.mistakes || []).map(m => ({
                id: m.id,
                type: 'mistake',
                pattern: m.pattern,
                message: m.message,
                severity: m.severity || 'WARNING',
                intent: 'prevent',
                confidence: m.cognitive?.confidence || 0.5,
                maturity: m.cognitive?.maturity || 'learning',
                hitCount: m.hitCount || 0,
                lastHit: m.lastHit || null,
                excludePaths: m.excludePaths || [],
                tags: m.tags || [],
                autoFix: m.autoFix || null,
                _source: 'mistakes.yaml'
            }));
            lessons.push(...mistakes);
            stats.v4Mistakes = mistakes.length;
            log.success(`Loaded ${mistakes.length} mistake(s) from mistakes.yaml`);
        } catch (e) {
            log.error(`Failed to load mistakes.yaml: ${e.message}`);
        }
    } else {
        log.info('mistakes.yaml not found, skipping');
    }

    // Load v4 improvements.yaml
    if (fs.existsSync(FILES.improvements)) {
        try {
            const data = yaml.load(fs.readFileSync(FILES.improvements, 'utf8'));
            const improvements = (data.improvements || []).map(i => ({
                id: i.id,
                type: 'improvement',
                pattern: i.pattern,
                message: i.message,
                severity: 'INFO',
                intent: 'optimize',
                confidence: i.cognitive?.confidence || 0.5,
                maturity: i.cognitive?.maturity || 'learning',
                hitCount: i.hitCount || i.appliedCount || 0,
                lastHit: i.lastHit || i.lastApplied || null,
                excludePaths: i.excludePaths || [],
                tags: i.tags || [],
                autoFix: null,
                _source: 'improvements.yaml'
            }));
            lessons.push(...improvements);
            stats.v4Improvements = improvements.length;
            log.success(`Loaded ${improvements.length} improvement(s) from improvements.yaml`);
        } catch (e) {
            log.error(`Failed to load improvements.yaml: ${e.message}`);
        }
    } else {
        log.info('improvements.yaml not found, skipping');
    }

    return { lessons, stats };
}

// ============================================================================
// DEDUPLICATION
// ============================================================================

function deduplicateLessons(lessons) {
    log.step(3, 'Deduplicating lessons');

    const seen = new Map();
    const duplicates = [];

    for (const lesson of lessons) {
        // Check by pattern (primary dedup key)
        if (seen.has(lesson.pattern)) {
            const existing = seen.get(lesson.pattern);
            duplicates.push({
                kept: existing.id,
                removed: lesson.id,
                pattern: lesson.pattern
            });
            // Keep the one with more hits
            if (lesson.hitCount > existing.hitCount) {
                seen.set(lesson.pattern, lesson);
            }
        } else {
            seen.set(lesson.pattern, lesson);
        }
    }

    const deduped = Array.from(seen.values());

    if (duplicates.length > 0) {
        log.warning(`Found ${duplicates.length} duplicate(s), keeping highest hitCount`);
        duplicates.forEach(d => {
            log.info(`  Merged ${d.removed} into ${d.kept}`);
        });
    } else {
        log.success('No duplicates found');
    }

    return deduped;
}

// ============================================================================
// RENUMBER IDS
// ============================================================================

function renumberLessons(lessons) {
    log.step(4, 'Renumbering lesson IDs');

    return lessons.map((lesson, index) => {
        // Remove internal _source field
        const { _source, ...cleanLesson } = lesson;

        // Assign new sequential ID
        cleanLesson.id = `LESSON-${String(index + 1).padStart(3, '0')}`;

        return cleanLesson;
    });
}

// ============================================================================
// SAVE
// ============================================================================

function saveKnowledge(lessons) {
    log.step(5, 'Saving unified knowledge.yaml');

    const knowledge = {
        version: 6.0,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        lessons
    };

    const yamlContent = yaml.dump(knowledge, {
        lineWidth: -1,
        quotingType: '"',
        forceQuotes: false
    });

    if (isDryRun) {
        log.info('[DRY RUN] Would write to knowledge.yaml');
        console.log('\n--- Preview of knowledge.yaml ---');
        console.log(yamlContent.slice(0, 1000) + (yamlContent.length > 1000 ? '\n...' : ''));
    } else {
        fs.writeFileSync(FILES.knowledge, yamlContent, 'utf8');
        log.success(`Saved ${lessons.length} lesson(s) to knowledge.yaml`);
    }

    return true;
}

// ============================================================================
// VERIFY
// ============================================================================

function verifyMigration(expectedCount) {
    log.step(6, 'Verifying migration');

    if (isDryRun) {
        log.info('[DRY RUN] Skipping verification');
        return true;
    }

    if (!fs.existsSync(FILES.knowledge)) {
        log.error('knowledge.yaml not created');
        return false;
    }

    const data = yaml.load(fs.readFileSync(FILES.knowledge, 'utf8'));
    const actualCount = data.lessons?.length || 0;

    if (actualCount !== expectedCount) {
        log.error(`Count mismatch: expected ${expectedCount}, got ${actualCount}`);
        return false;
    }

    log.success(`Verified: ${actualCount} lessons in knowledge.yaml`);
    log.success(`Version: ${data.version}`);

    return true;
}

// ============================================================================
// MAIN
// ============================================================================

async function main() {
    console.log('\n🔄 Knowledge Storage Migration: v3/v4 → v6');
    console.log('='.repeat(50));

    if (isDryRun) {
        console.log('🔍 DRY RUN MODE - No changes will be made\n');
    }

    // Step 1: Backup
    backupFiles();

    // Step 2: Load legacy data
    const { lessons, stats } = loadLegacyData();

    if (lessons.length === 0) {
        log.warning('No lessons found to migrate');
        console.log('\n✅ Migration complete (nothing to migrate)');
        return;
    }

    // Step 3: Deduplicate
    const deduped = deduplicateLessons(lessons);

    // Step 4: Renumber
    const renumbered = renumberLessons(deduped);

    // Step 5: Save
    saveKnowledge(renumbered);

    // Step 6: Verify
    const verified = verifyMigration(renumbered.length);

    // Summary
    console.log('\n' + '='.repeat(50));
    console.log('📊 Migration Summary');
    console.log('='.repeat(50));
    console.log(`  Source files:`);
    console.log(`    - lessons-learned.yaml: ${stats.v3} lesson(s)`);
    console.log(`    - mistakes.yaml: ${stats.v4Mistakes} mistake(s)`);
    console.log(`    - improvements.yaml: ${stats.v4Improvements} improvement(s)`);
    console.log(`  Total loaded: ${lessons.length}`);
    console.log(`  After dedup: ${deduped.length}`);
    console.log(`  Final count: ${renumbered.length}`);
    console.log(`  Verified: ${verified ? '✅ Yes' : '❌ No'}`);

    if (isDryRun) {
        console.log('\n🔍 This was a dry run. Run without --dry-run to apply changes.');
    } else {
        console.log('\n✅ Migration complete!');
        console.log('📁 Backup files saved to: .agent/knowledge/backup/');
    }
}

main().catch(e => {
    log.error(`Migration failed: ${e.message}`);
    process.exit(1);
});
