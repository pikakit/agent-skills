#!/usr/bin/env node
/**
 * Knowledge Retention Runner
 * 
 * Executes retention policies defined in retention.yaml.
 * Archives or soft-deletes stale lessons based on policy rules.
 * 
 * Usage:
 *   ag-smart retention --dry-run    # Preview what would be cleaned
 *   ag-smart retention --apply      # Execute cleanup (with confirmation)
 *   ag-smart retention --status     # Show retention policy status
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import { KNOWLEDGE_DIR } from './config.js';

const RETENTION_PATH = path.join(KNOWLEDGE_DIR, 'retention.yaml');
const BACKUP_DIR = path.join(KNOWLEDGE_DIR, 'backups');

/**
 * Load retention policy
 * @returns {Object|null}
 */
function loadPolicy() {
    if (!fs.existsSync(RETENTION_PATH)) {
        return null;
    }
    
    try {
        return yaml.load(fs.readFileSync(RETENTION_PATH, 'utf8'));
    } catch (e) {
        console.error(`❌ Failed to load retention.yaml: ${e.message}`);
        return null;
    }
}

/**
 * Load all lessons from knowledge files
 * @returns {{ mistakes: Array, improvements: Array }}
 */
function loadAllLessons() {
    const mistakes = [];
    const improvements = [];
    
    const mistakesPath = path.join(KNOWLEDGE_DIR, 'mistakes.yaml');
    if (fs.existsSync(mistakesPath)) {
        const data = yaml.load(fs.readFileSync(mistakesPath, 'utf8'));
        if (data?.mistakes) mistakes.push(...data.mistakes.map(m => ({ ...m, _source: 'mistakes' })));
    }
    
    const improvementsPath = path.join(KNOWLEDGE_DIR, 'improvements.yaml');
    if (fs.existsSync(improvementsPath)) {
        const data = yaml.load(fs.readFileSync(improvementsPath, 'utf8'));
        if (data?.improvements) improvements.push(...data.improvements.map(i => ({ ...i, _source: 'improvements' })));
    }
    
    return { mistakes, improvements };
}

/**
 * Evaluate a single condition against a lesson
 * @param {Object} lesson
 * @param {Object} condition - { field, operator, value }
 * @returns {boolean}
 */
function evaluateCondition(lesson, condition) {
    const { field, operator, value } = condition;
    
    // Get nested field value (e.g., 'cognitive.confidence')
    const fieldValue = field.split('.').reduce((obj, key) => obj?.[key], lesson);
    
    switch (operator) {
        case 'equals':
            return fieldValue === value;
        case 'notEquals':
            return fieldValue !== value;
        case 'greaterThan':
            return (fieldValue || 0) > value;
        case 'lessThan':
            return (fieldValue || 0) < value;
        case 'isNull':
            return fieldValue === null || fieldValue === undefined;
        case 'contains':
            return Array.isArray(fieldValue) && fieldValue.includes(value);
        case 'olderThan': {
            if (!lesson.addedAt) return false;
            const addedTime = new Date(lesson.addedAt).getTime();
            const thresholdTime = Date.now() - (value * 24 * 60 * 60 * 1000);
            return addedTime < thresholdTime;
        }
        case 'newerThan': {
            if (!lesson.addedAt) return false;
            const addedTime = new Date(lesson.addedAt).getTime();
            const thresholdTime = Date.now() - (value * 24 * 60 * 60 * 1000);
            return addedTime > thresholdTime;
        }
        default:
            return false;
    }
}

/**
 * Evaluate policy conditions (all/any)
 * @param {Object} lesson
 * @param {Object} conditionGroup - { all?: [], any?: [] }
 * @returns {boolean}
 */
function matchesConditions(lesson, conditionGroup) {
    if (conditionGroup.all) {
        return conditionGroup.all.every(cond => evaluateCondition(lesson, cond));
    }
    if (conditionGroup.any) {
        return conditionGroup.any.some(cond => evaluateCondition(lesson, cond));
    }
    return false;
}

/**
 * Check if lesson is protected by high-priority policy
 * @param {Object} lesson
 * @param {Array} policies
 * @returns {boolean}
 */
function isProtected(lesson, policies) {
    const protectPolicy = policies.find(p => p.action?.type === 'protect' && p.enabled);
    if (!protectPolicy) return false;
    return matchesConditions(lesson, protectPolicy.condition);
}

/**
 * Run retention analysis (dry-run)
 * @returns {{ toArchive: Array, toDelete: Array, toFlag: Array, protected: Array }}
 */
export function analyzeRetention() {
    const policy = loadPolicy();
    
    if (!policy || !policy.settings?.enabled) {
        return { 
            toArchive: [], 
            toDelete: [], 
            toFlag: [], 
            protected: [],
            disabled: true 
        };
    }
    
    const { mistakes, improvements } = loadAllLessons();
    const allLessons = [...mistakes, ...improvements];
    const policies = policy.policies?.filter(p => p.enabled) || [];
    
    const result = {
        toArchive: [],
        toDelete: [],
        toFlag: [],
        protected: []
    };
    
    for (const lesson of allLessons) {
        // Check protection first
        if (isProtected(lesson, policies)) {
            result.protected.push({ id: lesson.id, reason: 'high_value_protection' });
            continue;
        }
        
        // Check other policies (sorted by priority)
        const sortedPolicies = policies
            .filter(p => p.action?.type !== 'protect')
            .sort((a, b) => (a.priority || 0) - (b.priority || 0));
        
        for (const pol of sortedPolicies) {
            if (pol.condition?.custom === 'detectDuplicatePatterns') {
                // Skip custom functions for now
                continue;
            }
            
            // Check exceptions
            const hasException = (pol.exceptions || []).some(exc => 
                evaluateCondition(lesson, exc)
            );
            
            if (hasException) continue;
            
            if (matchesConditions(lesson, pol.condition)) {
                const entry = { 
                    id: lesson.id, 
                    pattern: lesson.pattern,
                    source: lesson._source,
                    policy: pol.name,
                    reason: pol.description
                };
                
                switch (pol.action?.type) {
                    case 'archive':
                        result.toArchive.push(entry);
                        break;
                    case 'soft_delete':
                        result.toDelete.push(entry);
                        break;
                    case 'flag':
                        result.toFlag.push(entry);
                        break;
                }
                break; // Stop at first matching policy
            }
        }
    }
    
    return result;
}

/**
 * Execute retention cleanup
 * @param {{ toArchive: Array, toDelete: Array }} analysis
 * @returns {{ archived: number, deleted: number }}
 */
export function executeRetention(analysis) {
    const policy = loadPolicy();
    
    // Safety check
    if (!policy?.settings?.enabled) {
        console.log('❌ Retention is disabled. Enable in settings.yaml first.');
        return { archived: 0, deleted: 0 };
    }
    
    const limits = policy.limits || {};
    let archived = 0;
    let deleted = 0;
    
    // Ensure backup dir exists
    if (!fs.existsSync(BACKUP_DIR)) {
        fs.mkdirSync(BACKUP_DIR, { recursive: true });
    }
    
    // Archive lessons
    const archiveItems = analysis.toArchive.slice(0, limits.maxArchivePerRun || 50);
    if (archiveItems.length > 0) {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        const archivePath = path.join(BACKUP_DIR, `retention_archive_${timestamp}.yaml`);
        
        fs.writeFileSync(archivePath, yaml.dump({
            archivedAt: new Date().toISOString(),
            items: archiveItems
        }), 'utf8');
        
        archived = archiveItems.length;
        console.log(`📦 Archived ${archived} lessons to ${path.basename(archivePath)}`);
    }
    
    // Note: Actual removal from source files requires more careful handling
    // For now, we just log what would be removed
    
    return { archived, deleted };
}

/**
 * Display status
 */
function displayStatus() {
    const policy = loadPolicy();
    
    console.log(`
📋 Retention Policy Status
${'─'.repeat(50)}

Settings:
   Enabled:              ${policy?.settings?.enabled ? '✅ Yes' : '❌ No'}
   Dry-run default:      ${policy?.settings?.dryRunDefault ? 'Yes' : 'No'}
   Backup before cleanup: ${policy?.settings?.backupBeforeCleanup ? 'Yes' : 'No'}
   Confirmation required: ${policy?.settings?.confirmationRequired ? 'Yes' : 'No'}

Policies:`);

    const policies = policy?.policies || [];
    for (const pol of policies) {
        const status = pol.enabled ? '✅' : '⏸️';
        console.log(`   ${status} ${pol.name} (priority ${pol.priority || 0})`);
        console.log(`      Action: ${pol.action?.type || 'unknown'}`);
    }

    console.log(`
Limits:
   Max delete/run:       ${policy?.limits?.maxDeletePerRun || 10}
   Max archive/run:      ${policy?.limits?.maxArchivePerRun || 50}
   Approval threshold:   ${policy?.limits?.requireApprovalAbove || 5}
`);
}

/**
 * Display dry-run results
 * @param {Object} analysis
 */
function displayDryRun(analysis) {
    if (analysis.disabled) {
        console.log(`
⚠️  Retention is DISABLED

To enable, set in .agent/knowledge/settings.yaml:
   retention:
     enabled: true
`);
        return;
    }

    console.log(`
🔍 Retention Dry-Run Analysis
${'─'.repeat(50)}

📦 To Archive (${analysis.toArchive.length}):`);

    for (const item of analysis.toArchive) {
        console.log(`   • ${item.id}: ${item.reason}`);
    }

    console.log(`
🗑️  To Delete (${analysis.toDelete.length}):`);

    for (const item of analysis.toDelete) {
        console.log(`   • ${item.id}: ${item.reason}`);
    }

    console.log(`
🚩 To Flag for Review (${analysis.toFlag.length}):`);

    for (const item of analysis.toFlag) {
        console.log(`   • ${item.id}: ${item.reason}`);
    }

    console.log(`
🛡️  Protected (${analysis.protected.length}):`);

    for (const item of analysis.protected) {
        console.log(`   • ${item.id}: ${item.reason}`);
    }

    const total = analysis.toArchive.length + analysis.toDelete.length;
    console.log(`
${'─'.repeat(50)}
📊 Total actions: ${total}
${total > 0 ? '💡 Run with --apply to execute (requires confirmation)\n' : '✨ No cleanup needed!\n'}
`);
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--status') || args.length === 0) {
        displayStatus();
        return;
    }
    
    if (args.includes('--dry-run')) {
        const analysis = analyzeRetention();
        displayDryRun(analysis);
        return;
    }
    
    if (args.includes('--apply')) {
        const policy = loadPolicy();
        
        if (!policy?.settings?.enabled) {
            console.log('❌ Retention is disabled. Enable in settings.yaml first.');
            process.exit(1);
        }
        
        console.log('🔄 Running retention analysis...');
        const analysis = analyzeRetention();
        displayDryRun(analysis);
        
        const total = analysis.toArchive.length + analysis.toDelete.length;
        if (total === 0) {
            console.log('✨ No actions needed. Exiting.');
            return;
        }
        
        // In a real scenario, prompt for confirmation
        console.log('⚠️  Confirmation required. This is a dry-run preview.');
        console.log('   To actually execute, implement interactive confirmation.\n');
        
        return;
    }
    
    displayStatus();
}

// Run if called directly
if (process.argv[1]?.includes('knowledge-retention')) {
    main();
}

export default {
    analyzeRetention,
    executeRetention
};
