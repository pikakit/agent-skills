/**
 * Watch UI - Real-Time File Monitoring with Clack UI
 * 
 * Watches for file changes and runs recall automatically.
 * Uses @clack/prompts for consistent terminal UI.
 */
import * as p from "@clack/prompts";
import pc from "picocolors";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import { scanFile, loadKnowledge, saveKnowledge } from "../recall.js";
import { VERSION } from "../config.js";

// ============================================================================
// CONFIGURATION
// ============================================================================

const WATCH_EXTENSIONS = [".js", ".ts", ".tsx", ".jsx", ".mjs"];
const DEBOUNCE_MS = 300;
const SKIP_DIRS = ["node_modules", ".git", "dist", "build", ".next", "coverage"];

// ============================================================================
// WATCHER CLASS
// ============================================================================

class SmartWatcher {
    constructor(rootDir) {
        this.rootDir = path.resolve(rootDir);
        this.db = loadKnowledge();
        this.debounceTimers = new Map();
        this.watchers = [];
        this.isRunning = false;
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
        this.isRunning = true;
        this.watch(this.rootDir);
    }

    /**
     * Stop watching
     */
    stop() {
        this.isRunning = false;
        // Close all watchers
        this.watchers.forEach(w => {
            try { w.close(); } catch (e) { }
        });
        this.watchers = [];
        // Clear debounce timers
        this.debounceTimers.forEach(timer => clearTimeout(timer));
        this.debounceTimers.clear();
    }

    /**
     * Recursively watch directories
     */
    watch(dir) {
        try {
            const entries = fs.readdirSync(dir, { withFileTypes: true });

            // Watch current directory
            const watcher = fs.watch(dir, { persistent: true }, (eventType, filename) => {
                if (filename && eventType === "change" && this.isRunning) {
                    this.handleChange(path.join(dir, filename));
                }
            });
            this.watchers.push(watcher);

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
            const result = this.checkFile(filePath);
            this.debounceTimers.delete(filePath);

            // Emit event for UI
            if (this.onFileChange) {
                this.onFileChange(result);
            }
        }, DEBOUNCE_MS));
    }

    /**
     * Check a file against memory
     */
    checkFile(filePath) {
        const relativePath = path.relative(this.rootDir, filePath);
        const result = scanFile(filePath, this.db, true);

        this.sessionStats.filesChecked++;

        if (result.violations.length > 0) {
            this.sessionStats.violationsFound += result.violations.reduce((sum, v) => sum + v.matches.length, 0);
            saveKnowledge(this.db);
        }

        return {
            path: relativePath,
            violations: result.violations,
            hasViolations: result.violations.length > 0
        };
    }

    /**
     * Get session summary
     */
    getSummary() {
        const duration = Math.round((Date.now() - this.sessionStats.startTime) / 1000);
        return {
            duration,
            filesChecked: this.sessionStats.filesChecked,
            violationsFound: this.sessionStats.violationsFound
        };
    }
}

// ============================================================================
// WATCH UI
// ============================================================================

/**
 * Run Watch UI with Clack
 * @param {string} targetDir - Directory to watch
 */
export async function runWatchUI(targetDir = process.cwd()) {
    const watcher = new SmartWatcher(targetDir);

    // Show intro
    p.intro(pc.cyan(`Smart Watcher v${VERSION}`));

    // Show info
    p.note(
        `${pc.dim("Directory:")} ${watcher.rootDir}\n` +
        `${pc.dim("Patterns:")}  ${watcher.db.lessons.length} loaded\n` +
        `${pc.dim("Extensions:")} ${WATCH_EXTENSIONS.join(", ")}`,
        "Watch Configuration"
    );

    // Spinner for starting
    const s = p.spinner();
    s.start("Starting file watcher...");

    // Start watcher
    watcher.start();

    s.stop(pc.green("✓") + " Watching for changes");

    // Setup file change handler
    watcher.onFileChange = (result) => {
        if (result.hasViolations) {
            console.log("");
            p.log.warn(pc.yellow(result.path));
            result.violations.forEach(({ lesson, matches }) => {
                const icon = lesson.severity === "ERROR" ? pc.red("✖") : pc.yellow("⚠");
                console.log(`  ${icon} ${pc.dim(`[${lesson.id}]`)} ${lesson.message}`);
                matches.slice(0, 2).forEach(m => {
                    console.log(`    ${pc.dim(`L${m.line}:`)} ${pc.dim(m.content.substring(0, 60))}`);
                });
                if (matches.length > 2) {
                    console.log(`    ${pc.dim(`... +${matches.length - 2} more`)}`);
                }
            });
        } else {
            p.log.success(pc.green("✓ ") + pc.dim(result.path));
        }
    };

    // Wait for user to press Enter or Ctrl+C
    console.log("");
    console.log(pc.dim("  Watching for file changes..."));
    console.log(pc.dim("  Press Enter to stop\n"));

    // Wait for Enter key
    await new Promise((resolve) => {
        const handler = (data) => {
            if (data.toString().includes("\n") || data.toString().includes("\r")) {
                process.stdin.removeListener("data", handler);
                process.stdin.setRawMode?.(false);
                resolve();
            }
        };

        process.stdin.setRawMode?.(true);
        process.stdin.resume();
        process.stdin.on("data", handler);
    });

    // Stop watcher
    watcher.stop();

    // Show summary
    const summary = watcher.getSummary();

    p.note(
        `${pc.dim("Duration:")}   ${summary.duration}s\n` +
        `${pc.dim("Files:")}      ${summary.filesChecked} checked\n` +
        `${pc.dim("Violations:")} ${summary.violationsFound} found`,
        "Session Summary"
    );

    p.outro(pc.green("Watch session ended"));
}

export default runWatchUI;
