#!/usr/bin/env node
/**
 * Execution History Logger
 * Logs workflow execution decisions to JSONL file
 * 
 * Log file: .agent/logs/execution-history.jsonl
 */

import { appendFile, mkdir } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Default log path
const DEFAULT_LOG_DIR = join(__dirname, '..', 'logs');
const DEFAULT_LOG_FILE = 'execution-history.jsonl';

/**
 * Ensure log directory exists
 */
async function ensureLogDir(logDir) {
  try {
    await mkdir(logDir, { recursive: true });
  } catch (err) {
    // Directory already exists or cannot be created
    if (err.code !== 'EEXIST') {
      console.warn(`[HISTORY] Could not create log directory: ${err.message}`);
    }
  }
}

/**
 * Log an execution decision
 * 
 * @param {Object} entry - Log entry
 * @param {string} entry.command - Command that was evaluated
 * @param {string} entry.workflow - Workflow name
 * @param {number} entry.phase - Phase number
 * @param {string} entry.decision - Decision: 'auto-accept' | 'blocked' | 'prompted' | 'skipped'
 * @param {string} entry.reason - Reason for decision
 * @param {string[]} entry.annotations - Annotations present
 * @param {Object} policy - Policy object (to get historyFile path)
 */
export async function logExecution(entry, policy = null) {
  // Get log file path from policy or use default
  const historyFile = policy?.logging?.historyFile || 
    join(DEFAULT_LOG_DIR, DEFAULT_LOG_FILE);
  
  const logDir = dirname(historyFile.startsWith('.') 
    ? join(process.cwd(), historyFile) 
    : historyFile);
  
  const logPath = historyFile.startsWith('.') 
    ? join(process.cwd(), historyFile) 
    : historyFile;
  
  // Ensure directory exists
  await ensureLogDir(logDir);
  
  // Create log entry
  const logEntry = {
    timestamp: new Date().toISOString(),
    command: entry.command?.substring(0, 200), // Truncate long commands
    workflow: entry.workflow || 'unknown',
    phase: entry.phase || 0,
    decision: entry.decision || 'unknown',
    reason: entry.reason || '',
    annotations: entry.annotations || [],
    severity: entry.severity,
    user: process.env.USER || process.env.USERNAME || 'unknown',
    ci: process.env.CI === 'true',
    cwd: process.cwd()
  };
  
  // Remove undefined values
  Object.keys(logEntry).forEach(key => {
    if (logEntry[key] === undefined) {
      delete logEntry[key];
    }
  });
  
  const line = JSON.stringify(logEntry) + '\n';
  
  try {
    await appendFile(logPath, line, 'utf-8');
  } catch (err) {
    // Silently fail - don't break execution for logging
    if (process.env.DEBUG) {
      console.warn(`[HISTORY] Could not write log: ${err.message}`);
    }
  }
}

/**
 * Create structured log entry from execution context
 * 
 * @param {Object} context - Execution context
 * @returns {Object} Formatted log entry
 */
export function createLogEntry(context) {
  return {
    command: context.command,
    workflow: context.workflowName,
    phase: context.phase?.number,
    phaseTitle: context.phase?.title,
    decision: context.decision,
    reason: context.reason,
    annotations: context.annotations,
    severity: context.severity,
    dryRun: context.dryRun,
    autoAccept: context.autoAccept
  };
}

// Export paths for testing
export { DEFAULT_LOG_DIR, DEFAULT_LOG_FILE };
