/**
 * Self-healing Recovery Utility
 * 
 * Provides checkpoint and rollback capabilities:
 * - Save state before risky operations
 * - Rollback on failure
 * - Recovery logging
 * 
 * Usage:
 *   import recovery from './recovery.js';
 *   
 *   const checkpoint = recovery.save('operation-name', currentState);
 *   try {
 *       // risky operation
 *   } catch (error) {
 *       recovery.rollback(checkpoint);
 *   }
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ==================== STORAGE ====================

const checkpoints = new Map();
const history = [];
const MAX_CHECKPOINTS = 10;

// ==================== COLORS ====================

const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m'
};

// ==================== CHECKPOINT ====================

/**
 * Generate checkpoint ID
 */
function generateId() {
    return `CP-${Date.now()}-${Math.random().toString(36).substr(2, 6)}`;
}

/**
 * Save a state checkpoint
 * @param {string} operation - Operation name
 * @param {any} state - State to save (will be deep cloned)
 * @param {object} options - Options
 * @returns {object} Checkpoint reference
 */
function save(operation, state, options = {}) {
    const id = generateId();
    const checkpoint = {
        id,
        operation,
        state: JSON.parse(JSON.stringify(state)), // Deep clone
        timestamp: new Date().toISOString(),
        options
    };

    checkpoints.set(id, checkpoint);
    history.push({ type: 'save', id, operation, timestamp: checkpoint.timestamp });

    // Cleanup old checkpoints
    if (checkpoints.size > MAX_CHECKPOINTS) {
        const oldest = [...checkpoints.keys()][0];
        checkpoints.delete(oldest);
    }

    console.log(`${c.gray}💾 Checkpoint saved: ${operation} (${id})${c.reset}`);

    return checkpoint;
}

/**
 * Rollback to a checkpoint
 * @param {object|string} checkpoint - Checkpoint reference or ID
 * @returns {any} Restored state
 */
function rollback(checkpoint) {
    const id = typeof checkpoint === 'string' ? checkpoint : checkpoint.id;
    const saved = checkpoints.get(id);

    if (!saved) {
        console.error(`${c.red}❌ Checkpoint not found: ${id}${c.reset}`);
        return null;
    }

    history.push({
        type: 'rollback',
        id,
        operation: saved.operation,
        timestamp: new Date().toISOString()
    });

    console.log(`${c.yellow}⏪ Rolling back: ${saved.operation}${c.reset}`);

    return saved.state;
}

/**
 * Get a checkpoint by ID
 * @param {string} id - Checkpoint ID
 */
function get(id) {
    return checkpoints.get(id);
}

/**
 * List all checkpoints
 */
function list() {
    return [...checkpoints.values()].map(cp => ({
        id: cp.id,
        operation: cp.operation,
        timestamp: cp.timestamp
    }));
}

// ==================== FILE RECOVERY ====================

/**
 * Backup a file before modification
 * @param {string} filePath - File to backup
 * @returns {object} Backup reference
 */
function backupFile(filePath) {
    if (!fs.existsSync(filePath)) {
        return { id: null, exists: false, path: filePath };
    }

    const content = fs.readFileSync(filePath, 'utf8');
    const backup = save(`file:${path.basename(filePath)}`, {
        path: filePath,
        content,
        exists: true
    });

    return backup;
}

/**
 * Restore a file from backup
 * @param {object|string} backup - Backup reference
 */
function restoreFile(backup) {
    const state = rollback(backup);

    if (!state) {
        return false;
    }

    if (state.exists) {
        fs.writeFileSync(state.path, state.content, 'utf8');
        console.log(`${c.green}✓ Restored: ${state.path}${c.reset}`);
    } else {
        // File didn't exist, delete if created
        if (fs.existsSync(state.path)) {
            fs.unlinkSync(state.path);
            console.log(`${c.green}✓ Removed: ${state.path}${c.reset}`);
        }
    }

    return true;
}

// ==================== TRANSACTION ====================

/**
 * Execute operation with automatic rollback on failure
 * @param {string} name - Operation name
 * @param {any} state - State to checkpoint
 * @param {Function} operation - Operation to execute
 * @returns {Promise<{success: boolean, result?: any, error?: Error}>}
 */
async function withRecovery(name, state, operation) {
    const checkpoint = save(name, state);

    try {
        const result = await operation();

        history.push({
            type: 'success',
            id: checkpoint.id,
            operation: name,
            timestamp: new Date().toISOString()
        });

        console.log(`${c.green}✓ ${name} completed successfully${c.reset}`);

        return { success: true, result };
    } catch (error) {
        const restored = rollback(checkpoint);

        history.push({
            type: 'failure',
            id: checkpoint.id,
            operation: name,
            error: error.message,
            timestamp: new Date().toISOString()
        });

        console.error(`${c.red}❌ ${name} failed, rolled back${c.reset}`);
        console.error(`${c.gray}   Error: ${error.message}${c.reset}`);

        return { success: false, error, restored };
    }
}

// ==================== HISTORY ====================

/**
 * Get recovery history
 */
function getHistory() {
    return [...history];
}

/**
 * Get statistics
 */
function getStats() {
    const stats = {
        totalCheckpoints: checkpoints.size,
        totalOperations: history.length,
        saves: history.filter(h => h.type === 'save').length,
        rollbacks: history.filter(h => h.type === 'rollback').length,
        successes: history.filter(h => h.type === 'success').length,
        failures: history.filter(h => h.type === 'failure').length
    };

    stats.successRate = stats.successes + stats.failures > 0
        ? (stats.successes / (stats.successes + stats.failures) * 100).toFixed(1) + '%'
        : 'N/A';

    return stats;
}

/**
 * Print history summary
 */
function printHistory() {
    console.log(`\n${c.cyan}═══ Recovery History ═══${c.reset}\n`);

    if (history.length === 0) {
        console.log(`${c.gray}No recovery operations yet.${c.reset}`);
        return;
    }

    for (const entry of history.slice(-10)) {
        const icon = {
            save: '💾',
            rollback: '⏪',
            success: '✅',
            failure: '❌'
        }[entry.type];

        console.log(`${icon} ${entry.operation} (${entry.type})`);
    }

    const stats = getStats();
    console.log(`\n${c.gray}Stats: ${stats.successes} success, ${stats.failures} failures (${stats.successRate})${c.reset}`);
}

/**
 * Clear all checkpoints and history
 */
function clear() {
    checkpoints.clear();
    history.length = 0;
}

// ==================== EXPORTS ====================

const recovery = {
    save,
    rollback,
    get,
    list,
    backupFile,
    restoreFile,
    withRecovery,
    getHistory,
    getStats,
    printHistory,
    clear
};

export {
    save,
    rollback,
    get,
    list,
    backupFile,
    restoreFile,
    withRecovery,
    getHistory,
    getStats,
    printHistory,
    clear
};

export default recovery;
