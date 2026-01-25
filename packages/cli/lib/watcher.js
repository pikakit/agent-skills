#!/usr/bin/env node
/**
 * Smart Watcher - Real-Time File Monitoring
 * 
 * Watches for file changes and runs recall automatically.
 * Features:
 * - Debounced file change detection
 * - Pattern frequency tracking
 * - Live feedback on violations
 * 
 * Usage: ag-smart watch [directory]
 */

import fs from "fs";
import path from "path";
import { scanFile, loadKnowledge, saveKnowledge } from "./recall.js";
import { VERSION } from "./config.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const WATCH_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".mjs"];
const DEBOUNCE_MS = 300;
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage"];

// ============================================================================
// WATCHER
// ============================================================================

class SmartWatcher {
    constructor(rootDir) {
        this.rootDir = path.resolve(rootDir);
        this.db = loadKnowledge();
        this.debounceTimers = new Map();
        this.sessionStats = {
            filesChecked: 0,
            violationsFound: 0,
            startTime: Date.now()
        };
    }

    /**
     * Start watching
     */
    start() {
        console.log(`\n👁️  Smart Watcher v${VERSION}`);
        console.log(`📂 Watching: ${this.rootDir}`);
        console.log(`📚 Loaded ${this.db.lessons.length} pattern(s) from memory`);
        console.log("─".repeat(50));
        console.log("Watching for changes... (Ctrl+C to stop)\n");

        this.watch(this.rootDir);
    }

    /**
     * Recursively watch directories
     */
    watch(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            // Watch current directory
            fs.watch(dir, { persistent: true }, (eventType, filename) => {
                if (filename && eventType === "change") {
                    this.handleChange(path.join(dir, filename));
                }
            });

            // Recurse into subdirs
            for (const entry of entries) {
                if (entry.isDirectory() && !SKIP_DIRS.includes(entry.name)) {
                    this.watch(path.join(dir, entry.name));
                }
            }
        } catch (error) {
            // Ignore permission errors
        }
    }

    /**
     * Handle file change with debouncing
     */
    handleChange(filePath) {
        const ext = path.extname(filePath);
        if (!WATCH_EXTENSIONS.includes(ext)) return;
        if (!fs.existsSync(filePath)) return;

        // Debounce
        if (this.debounceTimers.has(filePath)) {
            clearTimeout(this.debounceTimers.get(filePath));
        }

        this.debounceTimers.set(filePath, setTimeout(() => {
            this.checkFile(filePath);
            this.debounceTimers.delete(filePath);
        }, DEBOUNCE_MS));
    }

    /**
     * Check a file against memory
     */
    checkFile(filePath) {
        const relativePath = path.relative(this.rootDir, filePath);
        const result = scanFile(filePath, this.db, true);

        this.sessionStats.filesChecked++;

        if (result.violations.length === 0) {
            console.log(`✅ ${relativePath}`);
            return;
        }

        console.log(`\n⚠️  ${relativePath}`);

        result.violations.forEach(({ lesson, matches }) => {
            this.sessionStats.violationsFound += matches.length;

            const icon = lesson.severity === "ERROR" ? "❌" : "⚠️";
            console.log(`   ${icon} [${lesson.id}] ${lesson.message}`);

            matches.slice(0, 3).forEach(m => {
                console.log(`      L${m.line}: ${m.content}`);
            });

            if (matches.length > 3) {
                console.log(`      ... and ${matches.length - 3} more`);
            }
        });

        console.log("");

        // Save updated stats
        saveKnowledge(this.db);
    }

    /**
     * Print session summary
     */
    printSummary() {
        const duration = Math.round((Date.now() - this.sessionStats.startTime) / 1000);
        console.log("\n" + "─".repeat(50));
        console.log("📊 Session Summary:");
        console.log(`   ⏱️  Duration: ${duration}s`);
        console.log(`   📄 Files checked: ${this.sessionStats.filesChecked}`);
        console.log(`   ⚠️  Violations found: ${this.sessionStats.violationsFound}`);
    }
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const targetDir = args[0] || process.cwd();

if (args.includes("--help")) {
    console.log(`
👁️  Smart Watcher - Real-Time Monitor

Usage:
  ag-smart watch [directory]

Options:
  --help    Show this help

The watcher monitors file changes and checks them against
learned patterns in real-time.
`);
    process.exit(0);
}

const watcher = new SmartWatcher(targetDir);

// Handle graceful shutdown
process.on("SIGINT", () => {
    watcher.printSummary();
    process.exit(0);
});

watcher.start();
