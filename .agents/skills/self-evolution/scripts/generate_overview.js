#!/usr/bin/env node
/**
 * SKILL.md Overview Generator
 * 
 * Auto-generates dynamic overview section showing:
 * - Latest learnings (mistakes + improvements)
 * - Current version numbers
 * - Recent self-improve cycles
 * - Statistics
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';

import {
    getMistakesFile,
    getImprovementsFile,
    getMetaFile
} from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Load recent learnings from mistakes and improvements
 */
export function loadRecentLearnings(limit = 5) {
    const result = {
        mistakes: [],
        improvements: [],
        mistakes_version: 1,
        improvements_version: 1
    };

    // Load mistakes
    try {
        const mistakesFile = getMistakesFile();
        if (fs.existsSync(mistakesFile)) {
            const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
            const mistakes = data.mistakes || [];

            const sortedMistakes = mistakes.sort((a, b) =>
                (b.addedAt || '').localeCompare(a.addedAt || '')
            );

            result.mistakes = sortedMistakes.slice(0, limit);
            result.mistakes_version = data.version || 1;
        }
    } catch (e) { /* ignore */ }

    // Load improvements
    try {
        const improvementsFile = getImprovementsFile();
        if (fs.existsSync(improvementsFile)) {
            const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
            const improvements = data.improvements || [];

            const sortedImprovements = improvements.sort((a, b) =>
                (b.addedAt || '').localeCompare(a.addedAt || '')
            );

            result.improvements = sortedImprovements.slice(0, limit);
            result.improvements_version = data.version || 1;
        }
    } catch (e) { /* ignore */ }

    return result;
}

/**
 * Load statistics from meta.json
 */
export function loadStatistics() {
    try {
        const metaFile = getMetaFile();
        if (fs.existsSync(metaFile)) {
            const meta = JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
            return {
                total_mistakes: (meta.event_counter || {}).mistakes || 0,
                total_improvements: (meta.event_counter || {}).improvements || 0,
                event_count: (meta.event_counter || {}).total || 0,
                improve_count: (meta.self_improve || {}).improve_count || 0,
                last_improved: (meta.self_improve || {}).last_improved
            };
        }
    } catch (e) { /* ignore */ }

    return {
        total_mistakes: 0,
        total_improvements: 0,
        event_count: 0,
        improve_count: 0,
        last_improved: null
    };
}

/**
 * Format ISO date to readable format
 */
function formatDate(isoDate) {
    if (!isoDate) return 'Unknown';

    try {
        const dt = new Date(isoDate);
        return dt.toISOString().slice(0, 16).replace('T', ' ');
    } catch (e) {
        return isoDate.length >= 10 ? isoDate.slice(0, 10) : isoDate;
    }
}

/**
 * Generate dynamic overview markdown section
 */
export function generateOverviewMarkdown() {
    const learnings = loadRecentLearnings(5);
    const stats = loadStatistics();

    const mistakesV = learnings.mistakes_version;
    const improvementsV = learnings.improvements_version;

    const overview = [];

    // Header
    overview.push('## 📊 Current Learning Status');
    overview.push('');
    overview.push(`**Knowledge Base Version**: Mistakes v${mistakesV} | Improvements v${improvementsV}`);
    overview.push(`**Total Learnings**: ${stats.total_mistakes} mistakes, ${stats.total_improvements} improvements`);
    overview.push(`**Self-Improve Cycles**: ${stats.improve_count} completed`);

    if (stats.last_improved) {
        overview.push(`**Last Improved**: ${formatDate(stats.last_improved)}`);
    }

    overview.push('');
    overview.push('---');
    overview.push('');

    // Recent Mistakes
    if (learnings.mistakes.length > 0) {
        overview.push('### 🔴 Recent Mistakes Learned');
        overview.push('');

        learnings.mistakes.forEach((mistake, i) => {
            let lesson = mistake.lesson || mistake.problem || 'No description';
            const mistakeId = mistake.id || 'UNKNOWN';
            const version = mistake.version || 1;
            const addedAt = formatDate(mistake.addedAt || '');

            if (lesson.length > 80) {
                lesson = lesson.slice(0, 77) + '...';
            }

            overview.push(`${i + 1}. **${mistakeId}** (v${version}): ${lesson}`);
            overview.push(`   *Added: ${addedAt}*`);
        });

        overview.push('');
    } else {
        overview.push('### 🔴 Recent Mistakes Learned');
        overview.push('');
        overview.push('*No mistakes recorded yet. Start learning by reporting errors!*');
        overview.push('');
    }

    // Recent Improvements
    if (learnings.improvements.length > 0) {
        overview.push('### 🟢 Recent Improvements Learned');
        overview.push('');

        learnings.improvements.forEach((improvement, i) => {
            let text = improvement.improvement || 'No description';
            const improveId = improvement.id || 'UNKNOWN';
            const version = improvement.version || 1;
            const addedAt = formatDate(improvement.addedAt || '');

            if (text.length > 80) {
                text = text.slice(0, 77) + '...';
            }

            overview.push(`${i + 1}. **${improveId}** (v${version}): ${text}`);
            overview.push(`   *Added: ${addedAt}*`);
        });

        overview.push('');
    } else {
        overview.push('### 🟢 Recent Improvements Learned');
        overview.push('');
        overview.push('*No improvements recorded yet. Share best practices to build knowledge!*');
        overview.push('');
    }

    overview.push('---');
    overview.push('');

    return overview.join('\n');
}

/**
 * Update SKILL.md with generated overview
 */
export function updateSkillMd() {
    const skillMd = path.join(__dirname, '..', 'SKILL.md');

    if (!fs.existsSync(skillMd)) {
        console.log('❌ SKILL.md not found');
        return false;
    }

    let content = fs.readFileSync(skillMd, 'utf-8');

    const newOverview = generateOverviewMarkdown();

    // Check for markers
    if (content.includes('<!-- OVERVIEW_START -->') && content.includes('<!-- OVERVIEW_END -->')) {
        const startMarker = '<!-- OVERVIEW_START -->';
        const endMarker = '<!-- OVERVIEW_END -->';

        const startIdx = content.indexOf(startMarker) + startMarker.length;
        const endIdx = content.indexOf(endMarker);

        const updatedContent =
            content.slice(0, startIdx) +
            '\n' + newOverview +
            content.slice(endIdx);

        fs.writeFileSync(skillMd, updatedContent, 'utf-8');

        console.log('✅ SKILL.md overview updated');
        return true;
    } else {
        console.log('⚠️  No markers found in SKILL.md');
        console.log('   Add <!-- OVERVIEW_START --> and <!-- OVERVIEW_END --> to enable auto-update');
        console.log('\nGenerated overview:');
        console.log(newOverview);
        return false;
    }
}

function main() {
    const args = process.argv.slice(2);

    if (args.includes('--update')) {
        updateSkillMd();
    } else if (args.includes('--generate') || args.includes('--print') || args.length === 0) {
        const overview = generateOverviewMarkdown();
        console.log(overview);
    } else {
        console.log('SKILL.md Overview Generator');
        console.log('\nCommands:');
        console.log('  --generate  Generate overview markdown');
        console.log('  --update    Update SKILL.md with overview');
        console.log('  --print     Print overview to console');
    }
}

if (process.argv[1] === __filename) {
    main();
}
