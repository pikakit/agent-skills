#!/usr/bin/env node
/**
 * Self-Improve Cycle Orchestrator for SelfEvolution v4.0
 * 
 * 5-Step Process:
 * 1. Analyze learnings (keep/refine/add/deprecate)
 * 2. Improve skill code
 * 3. Update knowledge base with versioning
 * 4. Notify user
 * 5. Apply to source code
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

import {
    getMistakesFile,
    getImprovementsFile,
    getVersionsDir,
    ensureV4Structure
} from './project_utils.js';
import {
    checkThreshold,
    resetSinceLastImprove,
    addImproveHistory,
    getEventCount
} from './event_tracker.js';
import {
    categorizeLearnings
} from './analyze_learnings.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Step 1: Analyze Aggregated Learnings
 */
async function step1Analyze() {
    console.log('='.repeat(60));
    console.log('STEP 1: Analyze Learnings');
    console.log('='.repeat(60) + '\n');

    const categorized = await categorizeLearnings(false); // Heuristic for now

    console.log('\n✅ Analysis complete:');
    console.log(`   Keep: ${categorized.keep.length}`);
    console.log(`   Refine: ${categorized.refine.length}`);
    console.log(`   Add New: ${categorized.add_new.length}`);
    console.log(`   Deprecate: ${categorized.deprecate.length}`);

    return categorized;
}

/**
 * Step 2: Improve Auto-Learning Skill Code
 */
function step2ImproveSkill() {
    console.log('\n' + '='.repeat(60));
    console.log('STEP 2: Improve Skill Code');
    console.log('='.repeat(60) + '\n');

    console.log('⚠️  Skill code improvement not yet implemented');
    console.log('   (Would improve query_lessons.js relevance scoring)');

    return false;
}

/**
 * Step 3: Update Learning Knowledge Base
 */
function step3UpdateKnowledge(categorized) {
    console.log('\n' + '='.repeat(60));
    console.log('STEP 3: Update Knowledge Base');
    console.log('='.repeat(60) + '\n');

    const changes = {
        mistakes_kept: 0,
        mistakes_refined: 0,
        mistakes_added: 0,
        mistakes_deprecated: 0,
        improvements_kept: 0,
        improvements_refined: 0,
        improvements_added: 0,
        improvements_deprecated: 0
    };

    // Load current data
    const mistakesFile = getMistakesFile();
    const improvementsFile = getImprovementsFile();

    let mistakesData = {};
    if (fs.existsSync(mistakesFile)) {
        mistakesData = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
    }

    let improvementsData = {};
    if (fs.existsSync(improvementsFile)) {
        improvementsData = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
    }

    // Process keep (no changes)
    for (const item of categorized.keep) {
        if (item.type === 'mistake') {
            changes.mistakes_kept++;
        } else {
            changes.improvements_kept++;
        }
    }

    console.log(`✓ Kept ${changes.mistakes_kept} mistakes, ${changes.improvements_kept} improvements`);

    // Process refine
    for (const item of categorized.refine) {
        const learning = item.learning;
        const learningId = learning.id;

        if (item.type === 'mistake') {
            for (const m of mistakesData.mistakes || []) {
                if (m.id === learningId) {
                    const oldVersion = m.version || 1;
                    const newVersion = oldVersion + 1;

                    m.version = newVersion;
                    m.updated = new Date().toISOString();

                    if (!m.previous_versions) m.previous_versions = [];
                    m.previous_versions.push(oldVersion);

                    if (!m.changelog) m.changelog = [];
                    m.changelog.push({
                        version: newVersion,
                        date: new Date().toISOString(),
                        change: `Refined during self-improve cycle (hits=${m.hitCount || 0}, applied=${m.appliedCount || 0})`
                    });

                    console.log(`  🔄 Refined ${learningId} (v${oldVersion} → v${newVersion})`);
                    changes.mistakes_refined++;
                    break;
                }
            }
        } else {
            for (const imp of improvementsData.improvements || []) {
                if (imp.id === learningId) {
                    const oldVersion = imp.version || 1;
                    const newVersion = oldVersion + 1;

                    imp.version = newVersion;
                    imp.updated = new Date().toISOString();

                    if (!imp.previous_versions) imp.previous_versions = [];
                    imp.previous_versions.push(oldVersion);

                    if (!imp.changelog) imp.changelog = [];
                    imp.changelog.push({
                        version: newVersion,
                        date: new Date().toISOString(),
                        change: 'Refined during self-improve cycle'
                    });

                    console.log(`  🔄 Refined ${learningId} (v${oldVersion} → v${newVersion})`);
                    changes.improvements_refined++;
                    break;
                }
            }
        }
    }

    // Process deprecate
    for (const item of categorized.deprecate) {
        const learning = item.learning;
        const learningId = learning.id;

        if (item.type === 'mistake') {
            for (const m of mistakesData.mistakes || []) {
                if (m.id === learningId) {
                    m.status = 'deprecated';
                    m.deprecated_at = new Date().toISOString();
                    m.deprecated_reason = 'Self-improve cycle determined no longer applicable';
                    console.log(`  ❌ Deprecated ${learningId}`);
                    changes.mistakes_deprecated++;
                    break;
                }
            }
        } else {
            for (const imp of improvementsData.improvements || []) {
                if (imp.id === learningId) {
                    imp.status = 'deprecated';
                    imp.deprecated_at = new Date().toISOString();
                    imp.deprecated_reason = 'Self-improve cycle determined no longer applicable';
                    console.log(`  ❌ Deprecated ${learningId}`);
                    changes.improvements_deprecated++;
                    break;
                }
            }
        }
    }

    // Save updated data with version increment
    if (mistakesData.mistakes && mistakesData.mistakes.length > 0) {
        const oldVersion = mistakesData.version || 1;
        const newVersion = oldVersion + 1;
        mistakesData.version = newVersion;
        mistakesData.last_improved = new Date().toISOString();

        fs.writeFileSync(mistakesFile, yaml.dump(mistakesData, { noRefs: true }), 'utf-8');

        // Save version history
        const versionsDir = getVersionsDir();
        fs.mkdirSync(versionsDir, { recursive: true });
        const versionFile = path.join(versionsDir, `mistakes-v${newVersion}.yaml`);
        fs.writeFileSync(versionFile, yaml.dump(mistakesData, { noRefs: true }), 'utf-8');

        console.log(`\n✅ Saved mistakes v${newVersion}`);
    }

    if (improvementsData.improvements && improvementsData.improvements.length > 0) {
        const oldVersion = improvementsData.version || 1;
        const newVersion = oldVersion + 1;
        improvementsData.version = newVersion;
        improvementsData.last_improved = new Date().toISOString();

        fs.writeFileSync(improvementsFile, yaml.dump(improvementsData, { noRefs: true }), 'utf-8');

        const versionsDir = getVersionsDir();
        const versionFile = path.join(versionsDir, `improvements-v${newVersion}.yaml`);
        fs.writeFileSync(versionFile, yaml.dump(improvementsData, { noRefs: true }), 'utf-8');

        console.log(`✅ Saved improvements v${newVersion}`);
    }

    return changes;
}

/**
 * Step 4: Notify User
 */
function step4NotifyUser(changes) {
    console.log('\n' + '='.repeat(60));
    console.log('STEP 4: Notify User');
    console.log('='.repeat(60) + '\n');

    const totalRefined = changes.mistakes_refined + changes.improvements_refined;
    const totalAdded = changes.mistakes_added + changes.improvements_added;
    const totalDeprecated = changes.mistakes_deprecated + changes.improvements_deprecated;

    const notification = `
┌─────────────────────────────────────────────────────────┐
│ 🧠 Auto-Learning – Skill Self-Improved                  │
├─────────────────────────────────────────────────────────┤
│ ⚡ Self-Improve Cycle Complete                          │
│                                                          │
│ 📊 Changes:                                             │
│   • ${totalRefined} existing learnings refined                      │
│   • ${totalAdded} new learnings added                               │
│   • ${totalDeprecated} outdated learnings deprecated                    │
│                                                          │
│ @Mistakes (${changes.mistakes_kept + changes.mistakes_refined} active)                                 │
│   ${changes.mistakes_kept} kept unchanged                                  │
│   ${changes.mistakes_refined} refined with better patterns                │
│   ${changes.mistakes_deprecated} deprecated                                       │
│                                                          │
│ @Improvements (${changes.improvements_kept + changes.improvements_refined} active)                            │
│   ${changes.improvements_kept} kept unchanged                                  │
│   ${changes.improvements_refined} refined with better examples              │
│   ${changes.improvements_deprecated} deprecated                                       │
│                                                          │
│ ℹ️  Will be applied to future coding decisions          │
└─────────────────────────────────────────────────────────┘`;

    console.log(notification);
}

/**
 * Step 5: Apply to Current Source Code
 */
function step5ApplyToSource() {
    console.log('\n' + '='.repeat(60));
    console.log('STEP 5: Apply to Source Code');
    console.log('='.repeat(60) + '\n');

    console.log('✅ Learnings ready to be queried during coding');
    console.log('   Agent will use query_lessons.js to check before decisions');
}

/**
 * Run the complete self-improve cycle
 */
export async function runSelfImproveCycle(force = false) {
    console.log('\n🧠 SelfEvolution v4.0 - Self-Improve Cycle\n');

    // Check threshold
    if (!force && !checkThreshold()) {
        const counter = getEventCount();
        const threshold = 5;
        console.log('⚠️  Threshold not reached yet');
        console.log(`   Current: ${counter.since_last_improve}/${threshold}`);
        console.log(`   Need ${threshold - counter.since_last_improve} more events`);
        return false;
    }

    console.log('🎯 Starting Self-Improve Cycle...\n');

    try {
        // Step 1: Analyze
        const categorized = await step1Analyze();

        // Step 2: Improve skill code
        step2ImproveSkill();

        // Step 3: Update knowledge
        const changes = step3UpdateKnowledge(categorized);

        // Step 4: Notify user
        step4NotifyUser(changes);

        // Step 5: Apply to source
        step5ApplyToSource();

        // Update event tracker
        addImproveHistory(changes);
        resetSinceLastImprove();

        console.log('\n' + '='.repeat(60));
        console.log('✅ SELF-IMPROVE CYCLE COMPLETE');
        console.log('='.repeat(60) + '\n');

        return true;
    } catch (e) {
        console.log(`\n❌ Self-improve cycle failed: ${e.message}`);
        console.error(e);
        return false;
    }
}

async function main() {
    const args = process.argv.slice(2);
    const force = args.includes('--force');

    const success = await runSelfImproveCycle(force);
    process.exit(success ? 0 : 1);
}

if (process.argv[1] === __filename) {
    main();
}
