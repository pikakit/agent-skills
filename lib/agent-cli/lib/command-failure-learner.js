/**
 * Command Failure Learner v1.0
 * 
 * Learns from terminal command failures and prevents recurring mistakes.
 * Part of PikaKit AutoLearn system.
 * 
 * @version 1.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { addLesson, loadKnowledge } from './knowledge.js';

// ============================================================================
// KNOWN COMMAND FAILURE PATTERNS
// ============================================================================

/**
 * Pre-defined patterns for common command failures
 * These are learned from real-world agent execution errors
 */
const COMMAND_PATTERNS = [
    {
        id: 'CMD-001',
        match: /&& is not a valid statement separator/i,
        shell: 'powershell',
        message: 'PowerShell không hỗ trợ &&. Dùng ; hoặc chạy lệnh riêng biệt.',
        fix: 'Replace && with ; or run commands separately',
        severity: 'ERROR'
    },
    {
        id: 'CMD-002',
        match: /pre-commit.*hook.*(failed|exit|error)/i,
        shell: 'all',
        message: 'Pre-commit hook failed. Thử dùng --no-verify flag.',
        fix: 'git commit --no-verify -m "message"',
        severity: 'WARNING'
    },
    {
        id: 'CMD-003',
        match: /ENOENT.*npm|npm.*not found/i,
        shell: 'all',
        message: 'npm không tìm thấy. Chạy npm install trước.',
        fix: 'Run npm install first',
        severity: 'ERROR'
    },
    {
        id: 'CMD-004',
        match: /Cannot find module/i,
        shell: 'all',
        message: 'Module không tìm thấy. Kiểm tra dependencies.',
        fix: 'Run npm install or check import path',
        severity: 'ERROR'
    },
    {
        id: 'CMD-005',
        match: /permission denied/i,
        shell: 'all',
        message: 'Permission denied. Cần quyền admin hoặc sudo.',
        fix: 'Run with elevated permissions',
        severity: 'ERROR'
    },
    {
        id: 'CMD-006',
        match: /EADDRINUSE.*port/i,
        shell: 'all',
        message: 'Port đang được sử dụng bởi process khác.',
        fix: 'Kill existing process or use different port',
        severity: 'ERROR'
    },
    {
        id: 'CMD-007',
        match: /fatal: not a git repository/i,
        shell: 'all',
        message: 'Không phải git repository. Cần git init trước.',
        fix: 'Run git init or navigate to correct directory',
        severity: 'ERROR'
    },
    {
        id: 'CMD-008',
        match: /npm ERR! code ERESOLVE/i,
        shell: 'all',
        message: 'Dependency conflict. Thử --legacy-peer-deps.',
        fix: 'npm install --legacy-peer-deps',
        severity: 'WARNING'
    },
    {
        id: 'CMD-009',
        match: /the term .* is not recognized/i,
        shell: 'powershell',
        message: 'Command không được nhận dạng trong PowerShell.',
        fix: 'Check command name or install required tool',
        severity: 'ERROR'
    },
    {
        id: 'CMD-010',
        match: /TypeError|ReferenceError|SyntaxError/i,
        shell: 'all',
        message: 'JavaScript runtime error.',
        fix: 'Check code syntax and variable definitions',
        severity: 'ERROR'
    }
];

// ============================================================================
// CORE FUNCTIONS
// ============================================================================

/**
 * Analyze command output for failure patterns
 * @param {string} command - The command that was executed
 * @param {string} output - The command output/error message
 * @param {number} exitCode - Command exit code
 * @param {string} shell - Shell type (powershell, bash, cmd)
 * @returns {Object|null} - Matched pattern with suggestion, or null
 */
export function analyzeFailure(command, output, exitCode, shell = 'powershell') {
    // Only analyze failures (non-zero exit code)
    if (exitCode === 0) return null;

    const outputLower = (output || '').toLowerCase();
    const commandLower = (command || '').toLowerCase();

    for (const pattern of COMMAND_PATTERNS) {
        // Check if pattern applies to this shell
        if (pattern.shell !== 'all' && pattern.shell !== shell) continue;

        // Test against output
        if (pattern.match.test(output)) {
            return {
                patternId: pattern.id,
                command,
                shell,
                message: pattern.message,
                fix: pattern.fix,
                severity: pattern.severity,
                matchedPattern: pattern.match.toString()
            };
        }
    }

    return null;
}

/**
 * Learn from a command failure and save to knowledge base
 * @param {string} command - The failed command
 * @param {string} output - Error output
 * @param {number} exitCode - Exit code
 * @param {string} shell - Shell type
 * @returns {boolean} - True if lesson was learned/matched
 */
export function learnFromFailure(command, output, exitCode, shell = 'powershell') {
    const analysis = analyzeFailure(command, output, exitCode, shell);

    if (!analysis) {
        // Unknown pattern - could add to pending for review
        console.log('[CommandLearner] Unknown failure pattern, no lesson available');
        return false;
    }

    console.log(`[CommandLearner] Detected: ${analysis.patternId}`);
    console.log(`[CommandLearner] Fix: ${analysis.fix}`);

    // Check if already in knowledge base
    const knowledge = loadKnowledge();
    const existing = knowledge.lessons.find(l => l.id === analysis.patternId);

    if (existing) {
        console.log(`[CommandLearner] Pattern ${analysis.patternId} already known`);
        return true;
    }

    // Add as new lesson
    const lesson = {
        id: analysis.patternId,
        type: 'command',
        shell: analysis.shell,
        pattern: analysis.matchedPattern,
        message: analysis.message,
        severity: analysis.severity,
        intent: 'prevent',
        confidence: 0.9,
        maturity: 'stable',
        hitCount: 1,
        lastHit: new Date().toISOString(),
        excludePaths: [],
        tags: ['command', 'shell', analysis.shell],
        autoFix: { suggestion: analysis.fix }
    };

    const added = addLesson(lesson);
    if (added) {
        console.log(`[CommandLearner] Learned new pattern: ${analysis.patternId}`);
    }

    return true;
}

/**
 * Get suggestion for a command before execution
 * Checks if command matches any known failure patterns
 * @param {string} command - Command to check
 * @param {string} shell - Target shell
 * @returns {Object|null} - Warning if pattern detected
 */
export function checkCommandBeforeExec(command, shell = 'powershell') {
    // Pre-execution checks
    if (shell === 'powershell' && command.includes('&&')) {
        return {
            warning: true,
            patternId: 'CMD-001',
            message: 'PowerShell không hỗ trợ &&. Dùng ; thay thế.',
            suggestedCommand: command.replace(/\s*&&\s*/g, '; ')
        };
    }

    return null;
}

/**
 * Get all known command patterns
 * @returns {Array} - Array of patterns
 */
export function getKnownPatterns() {
    return COMMAND_PATTERNS.map(p => ({
        id: p.id,
        shell: p.shell,
        message: p.message,
        severity: p.severity
    }));
}

/**
 * Get pattern count
 * @returns {number}
 */
export function getPatternCount() {
    return COMMAND_PATTERNS.length;
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    analyzeFailure,
    learnFromFailure,
    checkCommandBeforeExec,
    getKnownPatterns,
    getPatternCount,
    COMMAND_PATTERNS
};
