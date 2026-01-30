#!/usr/bin/env node
/**
 * Event Tracker for SelfEvolution v4.0
 * Tracks mistake and improvement events to trigger self-improve cycle
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { fileURLToPath } from 'url';
import {
    getMetaFile,
    getMistakesFile,
    getImprovementsFile,
    ensureV4Structure
} from './project_utils.js';

const __filename = fileURLToPath(import.meta.url);

/**
 * Load meta.json configuration
 */
export function loadMeta() {
    try {
        const metaFile = getMetaFile();

        if (fs.existsSync(metaFile)) {
            return JSON.parse(fs.readFileSync(metaFile, 'utf-8'));
        }
    } catch (e) {
        // Return default if error
    }

    // Default meta structure
    return {
        version: '4.0.0',
        schema_version: '1.0.0',
        event_counter: {
            total: 0,
            mistakes: 0,
            improvements: 0,
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
        config: {
            auto_track_events: true,
            auto_trigger_improve: true,
            require_user_approval: false,
            backup_before_improve: true,
            max_history_versions: 10
        }
    };
}

/**
 * Save meta.json configuration
 */
export function saveMeta(meta) {
    ensureV4Structure();
    const metaFile = getMetaFile();

    meta.updated = new Date().toISOString();

    fs.writeFileSync(metaFile, JSON.stringify(meta, null, 2), 'utf-8');
}

/**
 * Increment event counter
 */
export function incrementEvent(eventType) {
    const meta = loadMeta();
    const counter = meta.event_counter;

    counter.total++;
    counter.since_last_improve++;

    if (eventType === 'mistake') {
        counter.mistakes++;
    } else if (eventType === 'improvement') {
        counter.improvements++;
    } else {
        throw new Error(`Invalid eventType: ${eventType}. Must be 'mistake' or 'improvement'`);
    }

    saveMeta(meta);
    return meta;
}

/**
 * Get current event counts
 */
export function getEventCount() {
    const meta = loadMeta();
    return meta.event_counter || {
        total: 0,
        mistakes: 0,
        improvements: 0,
        since_last_improve: 0
    };
}

/**
 * Check if event count has reached self-improve threshold
 */
export function checkThreshold() {
    const meta = loadMeta();
    const counter = meta.event_counter;
    const threshold = meta.self_improve.trigger_threshold;

    return counter.since_last_improve >= threshold;
}

/**
 * Reset since_last_improve counter
 */
export function resetSinceLastImprove() {
    const meta = loadMeta();
    meta.event_counter.since_last_improve = 0;

    meta.self_improve.last_improved = new Date().toISOString();
    meta.self_improve.improve_count++;

    const threshold = meta.self_improve.trigger_threshold;
    const currentTotal = meta.event_counter.total;
    meta.self_improve.next_trigger_at_event = currentTotal + threshold;

    saveMeta(meta);
}

/**
 * Add entry to self-improve history
 */
export function addImproveHistory(changes) {
    const meta = loadMeta();

    const historyEntry = {
        cycle_number: meta.self_improve.improve_count + 1,
        triggered_at: new Date().toISOString(),
        event_count_trigger: meta.event_counter.since_last_improve,
        changes,
        skill_code_improved: true,
        applied_to_source: true
    };

    meta.self_improve.history.push(historyEntry);

    const maxHistory = meta.config.max_history_versions || 10;
    if (meta.self_improve.history.length > maxHistory) {
        meta.self_improve.history = meta.self_improve.history.slice(-maxHistory);
    }

    saveMeta(meta);
}

/**
 * Get configuration value from meta.json
 */
export function getConfig(key, defaultValue = null) {
    const meta = loadMeta();
    const keys = key.split('.');
    let value = meta;

    for (const k of keys) {
        if (value && typeof value === 'object' && k in value) {
            value = value[k];
        } else {
            return defaultValue;
        }
    }

    return value;
}

/**
 * Set configuration value in meta.json
 */
export function setConfig(key, value) {
    const meta = loadMeta();
    const keys = key.split('.');
    let target = meta;

    for (const k of keys.slice(0, -1)) {
        if (!(k in target)) {
            target[k] = {};
        }
        target = target[k];
    }

    target[keys[keys.length - 1]] = value;
    saveMeta(meta);
}

/**
 * Get learning statistics
 */
export function getStatistics() {
    const meta = loadMeta();
    const counter = meta.event_counter;

    let mistakesCount = 0;
    let improvementsCount = 0;

    try {
        const mistakesFile = getMistakesFile();
        if (fs.existsSync(mistakesFile)) {
            const data = yaml.load(fs.readFileSync(mistakesFile, 'utf-8')) || {};
            mistakesCount = (data.mistakes || []).length;
        }
    } catch (e) { /* ignore */ }

    try {
        const improvementsFile = getImprovementsFile();
        if (fs.existsSync(improvementsFile)) {
            const data = yaml.load(fs.readFileSync(improvementsFile, 'utf-8')) || {};
            improvementsCount = (data.improvements || []).length;
        }
    } catch (e) { /* ignore */ }

    return {
        event_counter: counter,
        total_learnings: mistakesCount + improvementsCount,
        mistakes_count: mistakesCount,
        improvements_count: improvementsCount,
        threshold: meta.self_improve.trigger_threshold,
        threshold_reached: checkThreshold(),
        improve_count: meta.self_improve.improve_count,
        last_improved: meta.self_improve.last_improved,
        next_trigger: meta.self_improve.next_trigger_at_event
    };
}

function main() {
    const args = process.argv.slice(2);
    const command = args[0];

    switch (command) {
        case 'increment': {
            const type = args[1];
            if (!['mistake', 'improvement'].includes(type)) {
                console.log('Usage: node event_tracker.js increment <mistake|improvement>');
                process.exit(1);
            }
            const meta = incrementEvent(type);
            const counter = meta.event_counter;
            console.log(`✅ Incremented ${type} event`);
            console.log(`   Total: ${counter.total}`);
            console.log(`   Mistakes: ${counter.mistakes}`);
            console.log(`   Improvements: ${counter.improvements}`);
            console.log(`   Since last improve: ${counter.since_last_improve}`);

            if (checkThreshold()) {
                console.log('\n⚡ THRESHOLD REACHED! Time to self-improve!');
            }
            break;
        }

        case 'count': {
            const counter = getEventCount();
            console.log('📊 Event Counts:');
            console.log(`   Total: ${counter.total}`);
            console.log(`   Mistakes: ${counter.mistakes}`);
            console.log(`   Improvements: ${counter.improvements}`);
            console.log(`   Since last improve: ${counter.since_last_improve}`);
            break;
        }

        case 'threshold': {
            if (checkThreshold()) {
                console.log('⚡ Threshold REACHED - Self-improve should trigger');
            } else {
                const counter = getEventCount();
                const threshold = getConfig('self_improve.trigger_threshold', 5);
                const remaining = threshold - counter.since_last_improve;
                console.log('📊 Threshold NOT reached');
                console.log(`   Current: ${counter.since_last_improve}/${threshold}`);
                console.log(`   Remaining: ${remaining} events`);
            }
            break;
        }

        case 'stats': {
            const stats = getStatistics();
            console.log('📊 Learning Statistics:\n');
            console.log('Events:');
            console.log(`  Total: ${stats.event_counter.total}`);
            console.log(`  Mistakes: ${stats.event_counter.mistakes}`);
            console.log(`  Improvements: ${stats.event_counter.improvements}`);
            console.log(`  Since last improve: ${stats.event_counter.since_last_improve}`);
            console.log('\nLearnings:');
            console.log(`  Total: ${stats.total_learnings}`);
            console.log(`  Mistakes: ${stats.mistakes_count}`);
            console.log(`  Improvements: ${stats.improvements_count}`);
            console.log('\nSelf-Improve:');
            console.log(`  Threshold: ${stats.threshold}`);
            console.log(`  Reached: ${stats.threshold_reached ? 'YES ⚡' : 'NO'}`);
            console.log(`  Improve count: ${stats.improve_count}`);
            console.log(`  Last improved: ${stats.last_improved || 'Never'}`);
            console.log(`  Next trigger at: event #${stats.next_trigger}`);
            break;
        }

        case 'reset': {
            resetSinceLastImprove();
            console.log('✅ Reset since_last_improve counter');
            console.log('   Updated self-improve metadata');
            break;
        }

        default:
            console.log('Event Tracker for SelfEvolution v4.0');
            console.log('\nCommands:');
            console.log('  increment <mistake|improvement> - Increment event counter');
            console.log('  count                           - Get current event count');
            console.log('  threshold                       - Check if threshold reached');
            console.log('  stats                           - Get learning statistics');
            console.log('  reset                           - Reset since_last_improve counter');
    }
}

if (process.argv[1] === __filename) {
    main();
}
