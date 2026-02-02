#!/usr/bin/env node
/**
 * Learning Status Display for SelfEvolution v4.0
 * Shows active mistakes and improvements before coding
 */

import fs from 'fs';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import {
    getMistakesFile,
    getImprovementsFile,
    getMetaFile,
    getVersionsDir,
    detectVersion
} from './project_utils.js';
import { getStatistics } from './event_tracker.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Load active mistakes (not deprecated)
 */
export function loadActiveMistakes() {
    try {
        const mistakesFile = getMistakesFile();
        if (!fs.existsSync(mistakesFile)) return [];

        const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
        const mistakes = data.mistakes || [];
        return mistakes.filter(m => (m.status || 'active') === 'active');
    } catch (e) {
        return [];
    }
}

/**
 * Load active improvements (not deprecated)
 */
export function loadActiveImprovements() {
    try {
        const improvementsFile = getImprovementsFile();
        if (!fs.existsSync(improvementsFile)) return [];

        const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
        const improvements = data.improvements || [];
        return improvements.filter(i => (i.status || 'active') === 'active');
    } catch (e) {
        return [];
    }
}

/**
 * Display current learning status
 */
export function displayStatus(detailed = false) {
    const version = detectVersion();

    if (version !== '4.0') {
        console.log(`⚠️  SelfEvolution v${version} detected`);
        console.log('   Run migration to v4.0 first');
        return;
    }

    const stats = getStatistics();
    const mistakes = loadActiveMistakes();
    const improvements = loadActiveImprovements();

    // Header
    console.log('┌' + '─'.repeat(60) + '┐');
    console.log('│ 🧠 Auto-Learning – Active for this Project' + ' '.repeat(13) + '│');
    console.log('├' + '─'.repeat(60) + '┤');

    // Self-improve status
    if (stats.improve_count > 0) {
        const lastImproved = stats.last_improved ? stats.last_improved.slice(0, 10) : 'Never';
        console.log(`│ ⚡ Skill Self-Improved (${stats.improve_count} times)`.padEnd(61) + '│');
        console.log(`│   Last improved: ${lastImproved}`.padEnd(61) + '│');
        console.log('│' + ' '.repeat(60) + '│');
    }

    // Event counter
    const thresholdStatus = `${stats.event_counter.since_last_improve}/${stats.threshold}`;
    console.log(`│ 📊 Events: ${stats.event_counter.total} total, ${thresholdStatus} to next improve`.padEnd(61) + '│');
    console.log('│' + ' '.repeat(60) + '│');

    // Mistakes
    console.log(`│ @Mistakes (${mistakes.length} active)`.padEnd(61) + '│');

    if (mistakes.length > 0) {
        for (const mistake of mistakes.slice(0, 5)) {
            const lesson = (mistake.lesson || '').slice(0, 45);
            const vInfo = `v${mistake.version || 1}`;
            console.log(`│   ❌ ${mistake.id} ${vInfo}: ${lesson}`.padEnd(61) + '│');
        }
        if (mistakes.length > 5) {
            console.log(`│   ... and ${mistakes.length - 5} more`.padEnd(61) + '│');
        }
    } else {
        console.log('│   (none)'.padEnd(61) + '│');
    }

    console.log('│' + ' '.repeat(60) + '│');

    // Improvements
    console.log(`│ @Improvements (${improvements.length} active)`.padEnd(61) + '│');

    if (improvements.length > 0) {
        for (const improvement of improvements.slice(0, 5)) {
            const impText = (improvement.improvement || '').slice(0, 42);
            const vInfo = `v${improvement.version || 1}`;
            console.log(`│   ✅ ${improvement.id} ${vInfo}: ${impText}`.padEnd(61) + '│');
        }
        if (improvements.length > 5) {
            console.log(`│   ... and ${improvements.length - 5} more`.padEnd(61) + '│');
        }
    } else {
        console.log('│   (none)'.padEnd(61) + '│');
    }

    console.log('│' + ' '.repeat(60) + '│');
    console.log('│ ℹ️  Applied to coding decisions via query_lessons.js' + ' '.repeat(6) + '│');
    console.log('└' + '─'.repeat(60) + '┘');

    // Detailed view
    if (detailed && (mistakes.length > 0 || improvements.length > 0)) {
        console.log('\n' + '='.repeat(60));
        console.log('DETAILED VIEW');
        console.log('='.repeat(60) + '\n');

        if (mistakes.length > 0) {
            console.log('@Mistakes:');
            for (const mistake of mistakes) {
                console.log(`\n${mistake.id} (v${mistake.version || 1}, ${mistake.severity || 'medium'})`);
                console.log(`  Problem: ${mistake.problem || 'N/A'}`);
                console.log(`  Lesson: ${mistake.lesson || 'N/A'}`);
                console.log(`  Stats: ${mistake.hitCount || 0} hits, ${mistake.appliedCount || 0} applied`);
            }
        }

        if (improvements.length > 0) {
            console.log('\n@Improvements:');
            for (const improvement of improvements) {
                console.log(`\n${improvement.id} (v${improvement.version || 1})`);
                console.log(`  Improvement: ${improvement.improvement || 'N/A'}`);
                console.log(`  Benefit: ${improvement.benefit || 'N/A'}`);
                console.log(`  Stats: ${improvement.appliedCount || 0} applied`);
            }
        }
    }
}

/**
 * Display version history
 */
export function displayVersions() {
    const versionsDir = getVersionsDir();

    if (!fs.existsSync(versionsDir)) {
        console.log('No version history found');
        return;
    }

    const files = fs.readdirSync(versionsDir);
    const mistakeVersions = files.filter(f => f.startsWith('mistakes-v')).sort();
    const improvementVersions = files.filter(f => f.startsWith('improvements-v')).sort();

    console.log('📚 Version History\n');

    if (mistakeVersions.length > 0) {
        console.log('Mistakes:');
        for (const vFile of mistakeVersions) {
            const version = vFile.split('-v')[1].replace('.yaml', '');
            const stats = fs.statSync(path.join(versionsDir, vFile));
            const modified = new Date(stats.mtime).toISOString().slice(0, 16).replace('T', ' ');
            console.log(`  v${version}: ${modified} (${stats.size} bytes)`);
        }
    }

    if (improvementVersions.length > 0) {
        console.log('\nImprovements:');
        for (const vFile of improvementVersions) {
            const version = vFile.split('-v')[1].replace('.yaml', '');
            const stats = fs.statSync(path.join(versionsDir, vFile));
            const modified = new Date(stats.mtime).toISOString().slice(0, 16).replace('T', ' ');
            console.log(`  v${version}: ${modified} (${stats.size} bytes)`);
        }
    }
}

/**
 * Display self-improve history
 */
export function displayHistory() {
    try {
        const metaFile = getMetaFile();
        if (!fs.existsSync(metaFile)) {
            console.log('No history found');
            return;
        }

        const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
        const history = (meta.self_improve || {}).history || [];

        if (history.length === 0) {
            console.log('No self-improve cycles yet');
            return;
        }

        console.log('🔄 Self-Improve History\n');

        for (const entry of history) {
            const cycle = entry.cycle_number || '?';
            const triggeredAt = (entry.triggered_at || '').slice(0, 19);
            const changes = entry.changes || {};

            console.log(`Cycle #${cycle} - ${triggeredAt}`);
            console.log(`  Mistakes: ${changes.mistakes_refined || 0} refined, ${changes.mistakes_added || 0} added, ${changes.mistakes_deprecated || 0} deprecated`);
            console.log(`  Improvements: ${changes.improvements_refined || 0} refined, ${changes.improvements_added || 0} added, ${changes.improvements_deprecated || 0} deprecated`);
            console.log();
        }
    } catch (e) {
        console.log('No history found');
    }
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'status';
    const detailed = args.includes('--detailed') || args.includes('-d');

    switch (command) {
        case 'status':
            displayStatus(detailed);
            break;
        case 'versions':
            displayVersions();
            break;
        case 'history':
            displayHistory();
            break;
        default:
            console.log('Learning Status Display');
            console.log('\nCommands:');
            console.log('  status    Show learning status (default)');
            console.log('  versions  Show version history');
            console.log('  history   Show self-improve history');
            console.log('\nOptions:');
            console.log('  --detailed, -d  Show detailed view');
    }
}

if (process.argv[1] === __filename) {
    main();
}
