#!/usr/bin/env node
/**
 * Smart Recall Script - ESM Version (Production-Ready)
 * 
 * The "Memory" script. Checks code against learned lessons.
 * Features:
 * - Streaming file scanner (multiple files)
 * - Context-aware pattern matching (shows line numbers)
 * - Hit tracking for frequency analysis
 * 
 * Usage: 
 *   node recall.js <file_path>
 *   node recall.js <directory> --recursive
 */

import fs from "fs";
import path from "path";
import yaml from "js-yaml";
import ora from "ora";
import { KNOWLEDGE_DIR, LESSONS_PATH, DEBUG, cwd, VERSION } from "./config.js";
import { loadIgnorePatterns, isIgnored } from "./ignore.js";
import pretty from "./ui/pretty.js";
import * as p from "@clack/prompts";
import pc from "picocolors";
import { checkEvolutionThreshold, queueEvolutionSignal } from "./evolution-signal.js";
import { loadKnowledge as loadKnowledgeV6, saveKnowledge as saveKnowledgeV6 } from "./knowledge.js";

// ============================================================================
// PERCEPTION LAYER - Cognitive Enhancements
// ============================================================================

/**
 * Infer intent from lesson metadata
 * @param {object} lesson - Raw lesson from YAML
 * @returns {string} - Intent: 'prevent', 'warn', 'optimize'
 */
function inferIntent(lesson) {
    if (lesson.type === 'mistake') {
        return lesson.severity === 'ERROR' ? 'prevent' : 'warn';
    }
    return 'optimize'; // improvements
}

/**
 * Classify pattern type for better context
 * @param {string} pattern - Regex pattern
 * @returns {string} - Pattern type: 'dependency', 'structure', 'quality', 'security', 'performance', 'general'
 */
function classifyPattern(pattern) {
    if (!pattern) return 'general';

    // Security patterns
    if (pattern.includes('eval') || pattern.includes('innerHTML') || pattern.includes('dangerouslySetInnerHTML')) {
        return 'security';
    }

    // Dependency patterns
    if (pattern.includes('import') || pattern.includes('require') || pattern.includes('from')) {
        return 'dependency';
    }

    // Structure patterns
    if (pattern.includes('function') || pattern.includes('class') || pattern.includes('const') || pattern.includes('let')) {
        return 'structure';
    }

    // Quality patterns
    if (pattern.includes('console') || pattern.includes('debugger') || pattern.includes('TODO')) {
        return 'quality';
    }

    // Performance patterns
    if (pattern.includes('loop') || pattern.includes('forEach') || pattern.includes('map')) {
        return 'performance';
    }

    return 'general';
}

/**
 * Infer applicability context from tags
 * @param {Array<string>} tags - Lesson tags
 * @returns {object} - Context: { scope, appliesTo }
 */
function inferApplicability(tags = []) {
    return {
        scope: tags.includes('global') ? 'global' : 'local',
        appliesTo: tags.filter(t =>
            t.includes('file') ||
            t.includes('component') ||
            t.includes('module')
        )
    };
}

/**
 * Calculate confidence score based on lesson metadata
 * @param {object} lesson - Lesson with hitCount
 * @returns {number} - Confidence: 0.0 to 1.0
 */
function calculateConfidence(lesson) {
    const hitCount = lesson.hitCount || 0;

    // Confidence increases with hits (logarithmic scale)
    if (hitCount === 0) return 0.3; // Default for new lessons
    if (hitCount < 3) return 0.5;
    if (hitCount < 10) return 0.7;
    if (hitCount < 30) return 0.85;
    return 0.95; // High confidence for well-established patterns
}

/**
 * Transform raw lesson into cognitive lesson with intent & context
 * @param {object} rawLesson - Raw lesson from YAML
 * @returns {object} - Cognitive lesson with enhanced metadata
 */
function createCognitiveLesson(rawLesson) {
    return {
        ...rawLesson,

        // Intent inference
        intent: inferIntent(rawLesson),

        // Pattern classification
        patternType: classifyPattern(rawLesson.pattern),

        // Context awareness
        context: {
            appliesTo: inferApplicability(rawLesson.tags),
            scope: (rawLesson.tags || []).includes('global') ? 'global' : 'local'
        },

        // Cognitive metadata
        cognitive: {
            maturity: (rawLesson.hitCount || 0) > 10 ? 'stable' : 'learning',
            confidence: calculateConfidence(rawLesson)
        }
    };
}

// ============================================================================
// KNOWLEDGE BASE
// ============================================================================

/**
 * Load knowledge base from unified v6 format
 * With backward compatibility for v3.x and v4.x
 * @returns {{ lessons: Array<{ id: string, pattern: string, message: string, severity: string, hitCount?: number, lastHit?: string }>, version?: number }}
 */
export function loadKnowledge() {
    try {
        // Use unified v6 loader (handles all versions internally)
        const knowledge = loadKnowledgeV6();

        // Transform lessons for cognitive processing
        const lessons = knowledge.lessons.map(lesson => {
            // Apply cognitive transformation if not already present
            if (!lesson.cognitive) {
                return createCognitiveLesson(lesson);
            }
            return lesson;
        });

        return { lessons, version: knowledge.version || 6.0 };
    } catch (error) {
        if (DEBUG) console.error("Error loading knowledge:", error.message);
        return { lessons: [], version: 1 };
    }
}

/**
 * Save knowledge base to unified v6 format
 * @param {{ lessons: Array, version?: number }} data
 */
export function saveKnowledge(data) {
    try {
        // Convert to v6 format
        const knowledge = {
            version: 6.0,
            createdAt: data.createdAt || new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lessons: data.lessons
        };

        saveKnowledgeV6(knowledge);
    } catch (error) {
        console.error("❌ Failed to save knowledge base:", error.message);
    }
}

// ============================================================================
// FILE SCANNING
// ============================================================================

/**
 * Scan a single file against learned patterns
 * @param {string} filePath - Path to file to scan
 * @param {{ lessons: Array }} db - Knowledge base
 * @param {boolean} updateHits - Whether to update hit counts
 * @returns {{ file: string, violations: Array<{ lesson: object, matches: Array<{ line: number, content: string }> }> }}
 */
export function scanFile(filePath, db, updateHits = false) {
    const violations = [];

    if (!fs.existsSync(filePath)) {
        return { file: filePath, violations: [], error: "File not found" };
    }

    const content = fs.readFileSync(filePath, "utf8");
    const lines = content.split("\n");

    if (!db.lessons || db.lessons.length === 0) {
        return { file: filePath, violations: [] };
    }

    db.lessons.forEach(lesson => {
        // Skip if no valid pattern
        if (!lesson.pattern) return;

        // Check excludePaths - skip this lesson for excluded paths using glob patterns
        if (lesson.excludePaths && Array.isArray(lesson.excludePaths) && lesson.excludePaths.length > 0) {
            if (isIgnored(filePath, lesson.excludePaths)) {
                return; // Skip this lesson for this file
            }
        }

        try {
            const regex = new RegExp(lesson.pattern, "g");
            const matches = [];

            lines.forEach((line, idx) => {
                if (regex.test(line)) {
                    matches.push({
                        line: idx + 1,
                        content: line.trim().substring(0, 80)
                    });
                    regex.lastIndex = 0; // Reset for next test
                }
            });

            if (matches.length > 0) {
                violations.push({ lesson, matches });

                // Track hit count
                if (updateHits) {
                    lesson.hitCount = (lesson.hitCount || 0) + matches.length;
                    lesson.lastHit = new Date().toISOString();

                    // Check evolution threshold (Phase 2: Signal Layer)
                    const threshold = 10; // TODO: Get from settings
                    const evolutionCheck = checkEvolutionThreshold(lesson, threshold);

                    if (evolutionCheck.ready) {
                        // Queue evolution signal (doesn't evolve yet, just signals)
                        queueEvolutionSignal(lesson.id, evolutionCheck, {
                            triggerEvent: 'violation',
                            file: filePath,
                            matchCount: matches.length,
                            timestamp: Date.now()
                        });

                        if (DEBUG) {
                            console.log(`📡 Evolution signal queued for [${lesson.id}]: ${evolutionCheck.reason} (confidence: ${evolutionCheck.confidence.toFixed(2)})`);
                        }
                    }

                    // Auto-escalation: WARNING → ERROR after 5 violations
                    if (lesson.severity === "WARNING" && lesson.hitCount >= 5 && !lesson.autoEscalated) {
                        lesson.severity = "ERROR";
                        lesson.autoEscalated = true;
                        console.log(`⚡ Auto-escalated [${lesson.id}] to ERROR (${lesson.hitCount} violations)`);
                    }
                }
            }
        } catch (e) {
            if (DEBUG) console.error(`Invalid regex in lesson ${lesson.id}:`, e.message);
        }
    });

    return { file: filePath, violations };
}

/**
 * Scan multiple files in a directory recursively
 * @param {string} dirPath - Directory to scan
 * @param {{ lessons: Array }} db - Knowledge base
 * @param {string[]} extensions - File extensions to scan
 * @returns {{ results: Array<{ file: string, violations: Array }>, ignoredCount: number }}
 */
export function scanDirectory(dirPath, db, extensions = [".js", ".ts", ".tsx", ".jsx"]) {
    const results = [];
    const ignorePatterns = loadIgnorePatterns(dirPath);
    let ignoredCount = 0;

    function walk(dir) {
        let entries;
        try {
            entries = fs.readdirSync(dir, { withFileTypes: true });
        } catch (e) {
            return; // Skip unreadable directories
        }

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            const relativePath = path.relative(dirPath, fullPath);

            // Check .agentignore patterns
            if (isIgnored(relativePath, ignorePatterns)) {
                ignoredCount++;
                continue;
            }

            if (entry.isDirectory()) {
                walk(fullPath);
            } else if (entry.isFile()) {
                const ext = path.extname(entry.name);
                if (extensions.includes(ext)) {
                    const result = scanFile(fullPath, db, true);
                    if (result.violations.length > 0) {
                        results.push(result);
                    }
                }
            }
        }
    }

    if (fs.statSync(dirPath).isDirectory()) {
        walk(dirPath);
    } else {
        results.push(scanFile(dirPath, db, true));
    }

    return { results, ignoredCount };
}

// ============================================================================
// REPORTING
// ============================================================================

/**
 * Print scan results in a readable format
 * @param {Array} results - Scan results
 */
export function printResults(results) {
    let totalViolations = 0;
    let errorCount = 0;
    let warningCount = 0;

    results.forEach(result => {
        if (result.violations.length === 0) return;

        console.log(`\n📄 ${path.relative(process.cwd(), result.file)}`);

        result.violations.forEach(({ lesson, matches }) => {
            totalViolations += matches.length;
            if (lesson.severity === "ERROR") errorCount += matches.length;
            else warningCount += matches.length;

            const icon = lesson.severity === "ERROR" ? "❌" : "⚠️";
            console.log(`  ${icon} [${lesson.id}] ${lesson.message}`);

            matches.forEach(m => {
                console.log(`     L${m.line}: ${m.content}`);
            });
        });
    });

    // Return stats only - summary is handled by pretty.showScanSummary
    return { total: totalViolations, errors: errorCount, warnings: warningCount };
}

// ============================================================================
// CLI
// ============================================================================

function main() {
    const args = process.argv.slice(2);
    const jsonMode = args.includes("--json");

    if (args.length === 0 || args.includes("--help")) {
        console.log(`
🧠 Smart Recall - Memory Check Tool

Usage:
  recall <file>           Check single file
  recall <directory>      Check all files in directory
  recall --staged         Check git staged files only

Options:
  --json                  Output JSON for CI/CD
  --help                  Show this help
`);
        process.exit(0);
    }

    const target = args.find(a => !a.startsWith("--")) || ".";
    const db = loadKnowledge();

    if (!db.lessons || db.lessons.length === 0) {
        console.log("ℹ️  No lessons learned yet. Use 'agent learn' to add patterns.");
        process.exit(0);
    }

    // Scan first
    const { results, ignoredCount } = scanDirectory(target, db);
    const stats = printResults(results);

    // JSON output mode for CI/CD
    if (jsonMode) {
        const output = {
            version: VERSION,
            filesScanned: results.length,
            ignored: ignoredCount,
            violations: stats.total,
            errors: stats.errors,
            warnings: stats.warnings,
            passed: stats.errors === 0,
            details: results.filter(r => r.violations.length > 0).map(r => ({
                file: r.file,
                violations: r.violations.map(v => ({
                    id: v.lesson.id,
                    severity: v.lesson.severity,
                    message: v.lesson.message,
                    matches: v.matches.length
                }))
            }))
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(stats.errors > 0 ? 1 : 0);
    }

    // Show Clack-based summary (consistent with CLI)
    p.intro(pc.cyan(`🧠 PikaKit v${VERSION}`));

    // Save updated hit counts
    saveKnowledge(db);

    // Summary using Clack
    const summaryLines = [
        `${pc.green("✓")} ${results.length} file(s) scanned`,
        `${pc.dim("›")} ${ignoredCount} paths ignored`,
        stats.total > 0
            ? `${pc.red("✗")} ${stats.total} violation(s) found`
            : `${pc.green("✓")} No violations found`
    ];

    if (stats.total === 0) {
        summaryLines.push("");
        summaryLines.push(pc.green("All clear! Your code looks great. 🎉"));
    }

    p.note(summaryLines.join("\n"), pc.dim("Memory check completed ✓"));

    if (stats.errors > 0) {
        process.exit(1);
    } else {
        process.exit(0);
    }
}

// ============================================================================
// STRUCTURED SCAN (for Scan All / Fix All architecture)
// ============================================================================

/**
 * Sanitize filename for use in issue ID
 * @param {string} filepath - File path
 * @returns {string} Sanitized filename
 */
function sanitizeFilename(filepath) {
    return filepath
        .replace(/[^a-zA-Z0-9]/g, '_')
        .replace(/_+/g, '_')
        .substring(0, 50);
}

/**
 * Scan directory and generate structured output with issue IDs
 * This is the read-only analyzer for Scan All
 * @param {string} targetPath - Path to scan
 * @param {{ lessons: Array }} db - Knowledge base
 * @returns {{ scanId: string, timestamp: number, issues: Array, summary: object }}
 */
export function scanDirectoryStructured(targetPath, db) {
    // Run standard scan
    const { results, ignoredCount } = scanDirectory(targetPath, db);

    // Generate structured issues with unique IDs
    const issues = [];
    results.forEach(fileResult => {
        fileResult.violations.forEach(({ lesson, matches }) => {
            matches.forEach(match => {
                const issueId = `${lesson.id}_${sanitizeFilename(fileResult.file)}_L${match.line}`;
                issues.push({
                    id: issueId,
                    lessonId: lesson.id,
                    type: lesson.type || 'unknown',
                    severity: lesson.severity || 'WARNING',
                    file: fileResult.file,
                    line: match.line,
                    message: lesson.message,
                    pattern: lesson.pattern,
                    matchedCode: match.content,
                    fixable: !!lesson.autoFix, // Check if lesson has autoFix strategy
                    confidence: 0.95
                });
            });
        });
    });

    const scanResult = {
        scanId: `scan_${Date.now()}`,
        timestamp: Date.now(),
        projectPath: path.resolve(targetPath),
        totalIssues: issues.length,
        summary: {
            errors: issues.filter(i => i.severity === 'ERROR').length,
            warnings: issues.filter(i => i.severity !== 'ERROR').length,
            filesScanned: results.length,
            ignoredFiles: ignoredCount
        },
        issues
    };

    return scanResult;
}

/**
 * Save scan result to disk
 * @param {object} scanResult - Scan result object
 */
export function saveScanResult(scanResult) {
    const scansDir = path.join(KNOWLEDGE_DIR, 'scans');

    // Create scans directory if it doesn't exist
    if (!fs.existsSync(scansDir)) {
        fs.mkdirSync(scansDir, { recursive: true });
    }

    const filename = `${scanResult.scanId}.json`;
    const filepath = path.join(scansDir, filename);

    fs.writeFileSync(filepath, JSON.stringify(scanResult, null, 2));

    // Keep only last 10 scans
    cleanOldScans(scansDir, 10);
}

/**
 * Load scan result from disk
 * @param {string} scanId - Scan ID to load
 * @returns {object|null} Scan result or null if not found
 */
export function loadScanResult(scanId) {
    const filepath = path.join(KNOWLEDGE_DIR, 'scans', `${scanId}.json`);

    if (!fs.existsSync(filepath)) {
        return null;
    }

    return JSON.parse(fs.readFileSync(filepath, 'utf8'));
}

/**
 * Load most recent scan result
 * @returns {object|null} Most recent scan result or null
 */
export function loadMostRecentScan() {
    const scansDir = path.join(KNOWLEDGE_DIR, 'scans');

    if (!fs.existsSync(scansDir)) {
        return null;
    }

    const files = fs.readdirSync(scansDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(scansDir, f),
            mtime: fs.statSync(path.join(scansDir, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

    if (files.length === 0) {
        return null;
    }

    return JSON.parse(fs.readFileSync(files[0].path, 'utf8'));
}

/**
 * Clean old scan files, keeping only the most recent N
 * @param {string} scansDir - Scans directory path
 * @param {number} keepCount - Number of scans to keep
 */
function cleanOldScans(scansDir, keepCount) {
    const files = fs.readdirSync(scansDir)
        .filter(f => f.endsWith('.json'))
        .map(f => ({
            name: f,
            path: path.join(scansDir, f),
            mtime: fs.statSync(path.join(scansDir, f)).mtime
        }))
        .sort((a, b) => b.mtime - a.mtime);

    // Delete files beyond keepCount
    files.slice(keepCount).forEach(file => {
        try {
            fs.unlinkSync(file.path);
        } catch (e) {
            // Ignore errors
        }
    });
}

// ============================================================================
// AUTO-FIX LOGIC (for Fix All automation)
// ============================================================================

/**
 * Apply auto-fix to a file based on issue and lesson strategy
 * @param {object} issue - Issue object from scan with file, line, etc.
 * @param {object} lesson - Lesson with autoFix strategy
 * @returns {{ success: boolean, backup?: string, error?: string, details?: string }}
 */
export function applyFix(issue, lesson) {
    if (!lesson.autoFix) {
        return { success: false, error: 'No auto-fix strategy defined' };
    }

    const { file, line } = issue;
    const { autoFix } = lesson;

    try {
        // 1. Create backup
        const backup = createBackupFile(file);

        // 2. Read file
        const content = fs.readFileSync(file, 'utf8');
        const lines = content.split('\n');

        // 3. Apply fix based on type
        let fixed = false;
        let details = '';

        switch (autoFix.type) {
            case 'replace':
                const searchRegex = new RegExp(autoFix.search, 'g');
                const originalLine = lines[line - 1];
                lines[line - 1] = lines[line - 1].replace(
                    searchRegex,
                    autoFix.replace
                );
                fixed = lines[line - 1] !== originalLine;
                details = `Replaced: ${originalLine.trim()} → ${lines[line - 1].trim()}`;
                break;

            case 'regex-replace':
                const findRegex = new RegExp(autoFix.find, 'g');
                const origLine = lines[line - 1];
                lines[line - 1] = lines[line - 1].replace(
                    findRegex,
                    autoFix.replace
                );
                fixed = lines[line - 1] !== origLine;
                details = `Replaced: ${origLine.trim()} → ${lines[line - 1].trim()}`;
                break;

            case 'comment-warning':
                const targetLine = line - 1;
                const indent = lines[targetLine].match(/^\s*/)[0];
                lines.splice(targetLine, 0, indent + autoFix.comment);
                fixed = true;
                details = `Added warning comment above line ${line}`;
                break;

            case 'insert':
                const pos = autoFix.position === 'before' ? line - 1 : line;
                lines.splice(pos, 0, autoFix.content);
                fixed = true;
                details = `Inserted: ${autoFix.content}`;
                break;

            case 'delete':
                const deletedLine = lines[line - 1];
                lines.splice(line - 1, 1);
                fixed = true;
                details = `Deleted: ${deletedLine.trim()}`;
                break;

            default:
                return { success: false, error: `Unknown fix type: ${autoFix.type}` };
        }

        if (!fixed) {
            return { success: false, error: 'Fix did not modify file' };
        }

        // 4. Write back
        fs.writeFileSync(file, lines.join('\n'), 'utf8');

        return { success: true, backup, details };

    } catch (e) {
        return { success: false, error: e.message };
    }
}

/**
 * Create backup of file before fixing
 * @param {string} filepath - File to backup
 * @returns {string} Backup filepath
 */
function createBackupFile(filepath) {
    const backupDir = path.join(KNOWLEDGE_DIR, 'fix-backups');
    if (!fs.existsSync(backupDir)) {
        fs.mkdirSync(backupDir, { recursive: true });
    }

    const timestamp = Date.now();
    const filename = path.basename(filepath);
    const backupPath = path.join(backupDir, `${filename}.${timestamp}.bak`);

    fs.copyFileSync(filepath, backupPath);

    return backupPath;
}

/**
 * Restore file from backup
 * @param {string} originalPath - Original file path
 * @param {string} backupPath - Backup file path
 * @returns {boolean} True if restored successfully
 */
export function restoreFromBackup(originalPath, backupPath) {
    try {
        if (fs.existsSync(backupPath)) {
            fs.copyFileSync(backupPath, originalPath);
            fs.unlinkSync(backupPath);
            return true;
        }
        return false;
    } catch (e) {
        console.error(`Failed to restore from backup: ${e.message}`);
        return false;
    }
}

// Run if executed directly
if (process.argv[1]?.includes("recall")) {
    main();
}
