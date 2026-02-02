#!/usr/bin/env node
/**
 * Migration Script: v3.0 → v4.0
 * Splits project.yaml into mistakes.yaml + improvements.yaml
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

import {
    findProjectRoot,
    getProjectLessonsDir,
    ensureLessonsDir
} from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Load v3.0 project.yaml
 */
function loadV3Lessons() {
    const lessonsDir = getProjectLessonsDir();
    const v3File = path.join(lessonsDir, 'project.yaml');

    if (!fs.existsSync(v3File)) {
        return null;
    }

    return yaml.load(fs.readFileSync(v3File, 'utf-8')) || {};
}

/**
 * Determine if lesson is MISTAKE or IMPROVEMENT
 */
function categorizeLesson(lesson) {
    const severity = (lesson.severity || '').toUpperCase();
    const category = (lesson.category || '').toLowerCase();

    // Explicit improvement indicators
    if (category.includes('improve') || (lesson.message || '').toLowerCase().includes('benefit')) {
        return 'improvement';
    }

    // High/Medium severity → mistake
    if (['ERROR', 'HIGH', 'WARNING', 'MEDIUM'].includes(severity)) {
        return 'mistake';
    }

    // Has anti-pattern keywords
    const message = (lesson.message || '').toLowerCase();
    const antiPatterns = ['never', "don't", 'avoid', 'not', 'wrong', 'bad', 'error'];
    if (antiPatterns.some(word => message.includes(word))) {
        return 'mistake';
    }

    return 'mistake';
}

/**
 * Convert v3.0 lesson to v4.0 mistake format
 */
function convertToMistake(lesson, newId) {
    const now = new Date().toISOString();

    return {
        id: newId,
        version: 1,
        scope: lesson.scope || 'general',

        problem: `Anti-pattern or error: ${lesson.pattern || 'unknown'}`,
        lesson: lesson.message || '',
        severity: (lesson.severity || 'medium').toLowerCase(),
        impact: lesson.impact || 'Code quality degradation',

        category: lesson.category || 'code-quality',
        tags: lesson.tags || [],
        applies_to_files: lesson.files || [],

        created: lesson.addedAt || now,
        updated: now,
        previous_versions: [],
        changelog: [{
            version: 1,
            date: now,
            change: 'Migrated from v3.0 project.yaml'
        }],

        hitCount: lesson.hitCount || 0,
        appliedCount: lesson.appliedCount || 0,
        lastHit: lesson.lastHit,
        lastApplied: lesson.lastApplied,

        status: lesson.status || 'active',
        superseded_by: lesson.replacedBy,
        deprecated_at: null,
        deprecated_reason: null,

        related_improvements: []
    };
}

/**
 * Convert v3.0 lesson to v4.0 improvement format
 */
function convertToImprovement(lesson, newId) {
    const now = new Date().toISOString();

    return {
        id: newId,
        version: 1,
        scope: lesson.scope || 'general',

        improvement: lesson.pattern || 'Good practice',
        benefit: lesson.message || '',
        context: `Learned: ${lesson.source || 'manual'}`,

        pattern: lesson.correct_pattern || '',
        when_to_use: '',

        improves_metrics: [],

        category: lesson.category || 'code-quality',
        tags: lesson.tags || [],
        applies_to_files: lesson.files || [],

        created: lesson.addedAt || now,
        updated: now,
        previous_versions: [],
        changelog: [{
            version: 1,
            date: now,
            change: 'Migrated from v3.0 project.yaml'
        }],

        appliedCount: lesson.appliedCount || 0,
        lastApplied: lesson.lastApplied,
        effectiveness_score: null,

        status: lesson.status || 'active',
        superseded_by: lesson.replacedBy,
        deprecated_at: null,
        deprecated_reason: null,

        related_mistakes: [],
        replaces_pattern: null
    };
}

/**
 * Main migration function
 */
export function migrateV3ToV4() {
    console.log('🔄 Starting v3.0 → v4.0 migration...\n');

    // 1. Load v3.0 data
    const v3Data = loadV3Lessons();
    if (!v3Data) {
        console.log('❌ No v3.0 project.yaml found. Nothing to migrate.');
        return false;
    }

    const lessons = v3Data.lessons || [];
    if (lessons.length === 0) {
        console.log('❌ No lessons found in project.yaml');
        return false;
    }

    console.log(`📚 Found ${lessons.length} lessons in v3.0 format\n`);

    // 2. Categorize and convert
    const mistakes = [];
    const improvements = [];

    let mistakeCounter = 1;
    let improvementCounter = 1;

    for (const lesson of lessons) {
        const lessonType = categorizeLesson(lesson);

        if (lessonType === 'mistake') {
            const newId = `MISTAKE-${String(mistakeCounter).padStart(3, '0')}`;
            mistakes.push(convertToMistake(lesson, newId));
            console.log(`  ✓ ${lesson.id || '?'} → ${newId} (mistake)`);
            mistakeCounter++;
        } else {
            const newId = `IMPROVE-${String(improvementCounter).padStart(3, '0')}`;
            improvements.push(convertToImprovement(lesson, newId));
            console.log(`  ✓ ${lesson.id || '?'} → ${newId} (improvement)`);
            improvementCounter++;
        }
    }

    console.log('\n📊 Split result:');
    console.log(`  • Mistakes: ${mistakes.length}`);
    console.log(`  • Improvements: ${improvements.length}\n`);

    // 3. Prepare output
    const lessonsDir = getProjectLessonsDir();
    ensureLessonsDir();

    const versionsDir = path.join(lessonsDir, 'versions');
    fs.mkdirSync(versionsDir, { recursive: true });

    const now = new Date().toISOString();

    // 4. Save mistakes.yaml
    const mistakesFile = path.join(lessonsDir, 'mistakes.yaml');
    const mistakesData = {
        version: 1,
        scope: 'project',
        event_count: mistakes.length,
        last_improved: null,
        mistakes: mistakes,
        metadata: {
            total_mistakes: mistakes.length,
            active_mistakes: mistakes.filter(m => m.status === 'active').length,
            deprecated_mistakes: mistakes.filter(m => m.status !== 'active').length
        }
    };

    fs.writeFileSync(mistakesFile, yaml.dump(mistakesData, { noRefs: true }), 'utf-8');
    console.log(`✅ Created ${mistakesFile}`);

    // 5. Save improvements.yaml
    const improvementsFile = path.join(lessonsDir, 'improvements.yaml');
    const improvementsData = {
        version: 1,
        scope: 'project',
        event_count: improvements.length,
        last_improved: null,
        improvements: improvements,
        metadata: {
            total_improvements: improvements.length,
            active_improvements: improvements.filter(i => i.status === 'active').length,
            deprecated_improvements: improvements.filter(i => i.status !== 'active').length
        }
    };

    fs.writeFileSync(improvementsFile, yaml.dump(improvementsData, { noRefs: true }), 'utf-8');
    console.log(`✅ Created ${improvementsFile}`);

    // 6. Create meta.json
    const metaFile = path.join(lessonsDir, 'meta.json');
    const projectRoot = findProjectRoot();

    const metaData = {
        version: '4.0.0',
        schema_version: '1.0.0',
        project: {
            root: projectRoot,
            name: projectRoot ? path.basename(projectRoot) : 'unknown',
            created: v3Data.created || now,
            updated: now
        },
        event_counter: {
            total: lessons.length,
            mistakes: mistakes.length,
            improvements: improvements.length,
            since_last_improve: 0
        },
        self_improve: {
            enabled: true,
            trigger_threshold: 5,
            apply_immediately: true,
            notify_user: true,
            history: [],
            last_improved: null,
            improve_count: 0,
            next_trigger_at_event: 5
        },
        files: {
            mistakes: 'mistakes.yaml',
            improvements: 'improvements.yaml',
            versions_dir: 'versions/'
        },
        versions: {
            mistakes: {
                current: 1,
                history: [{
                    version: 1,
                    date: now,
                    file: 'versions/mistakes-v1.yaml',
                    change_summary: 'Initial split from project.yaml'
                }]
            },
            improvements: {
                current: 1,
                history: [{
                    version: 1,
                    date: now,
                    file: 'versions/improvements-v1.yaml',
                    change_summary: 'Initial creation'
                }]
            }
        },
        migration: {
            from_version: '3.0.0',
            migrated: true,
            migration_date: now,
            source_file: 'project.yaml',
            lessons_count: lessons.length,
            split_result: {
                mistakes: mistakes.length,
                improvements: improvements.length
            }
        },
        config: {
            auto_track_events: true,
            auto_trigger_improve: true,
            require_user_approval: false,
            backup_before_improve: true,
            max_history_versions: 10
        }
    };

    fs.writeFileSync(metaFile, JSON.stringify(metaData, null, 2), 'utf-8');
    console.log(`✅ Created ${metaFile}`);

    // 7. Backup original v3.0 file
    const v3File = path.join(lessonsDir, 'project.yaml');
    const backupFile = path.join(lessonsDir, 'project.yaml.v3.backup');

    if (fs.existsSync(v3File)) {
        fs.copyFileSync(v3File, backupFile);
        console.log(`\n💾 Backed up v3.0 file to ${backupFile}`);
    }

    // 8. Save initial versions
    fs.writeFileSync(
        path.join(versionsDir, 'mistakes-v1.yaml'),
        yaml.dump(mistakesData, { noRefs: true }),
        'utf-8'
    );
    fs.writeFileSync(
        path.join(versionsDir, 'improvements-v1.yaml'),
        yaml.dump(improvementsData, { noRefs: true }),
        'utf-8'
    );

    console.log('✅ Saved version history\n');

    console.log('🎉 Migration complete!');
    console.log('\n📁 New structure:');
    console.log(`  ${lessonsDir}/`);
    console.log(`  ├── mistakes.yaml (${mistakes.length} mistakes)`);
    console.log(`  ├── improvements.yaml (${improvements.length} improvements)`);
    console.log('  ├── meta.json (config)');
    console.log('  ├── versions/ (history)');
    console.log('  └── project.yaml.v3.backup (backup)');

    return true;
}

function main() {
    try {
        const success = migrateV3ToV4();
        process.exit(success ? 0 : 1);
    } catch (e) {
        console.log(`\n❌ Migration failed: ${e.message}`);
        console.error(e);
        process.exit(1);
    }
}

if (process.argv[1] === __filename) {
    main();
}
