/**
 * @fileoverview Configuration and argument parsing
 */

import path from "path";
import os from "os";

/** Current working directory */
export const cwd = process.cwd();

/** Local workspace skills directory (configurable via ADD_SKILL_WORKSPACE) */
export const WORKSPACE = process.env.ADD_SKILL_WORKSPACE || path.join(cwd, ".agent", "skills");

/** Global skills directory (configurable via ADD_SKILL_GLOBAL_DIR) */
export const GLOBAL_DIR = process.env.ADD_SKILL_GLOBAL_DIR || path.join(os.homedir(), ".gemini", "antigravity", "skills");

/** Cache root directory */
export const CACHE_ROOT = process.env.ADD_SKILL_CACHE_DIR || path.join(os.homedir(), ".cache", "agentskillskit");

/** Registry cache directory */
export const REGISTRY_CACHE = path.join(CACHE_ROOT, "registries");

/** Registries file path */
export const REGISTRIES_FILE = path.join(CACHE_ROOT, "registries.json");

/** Backup directory */
export const BACKUP_DIR = path.join(CACHE_ROOT, "backups");

// --- Argument Parsing ---

const args = process.argv.slice(2);

/** Command name (first non-flag argument) */
export const command = args[0] || "help";

/** All flags (starting with --) */
export const flags = new Set(args.filter((a) => a.startsWith("--")));

/** Command parameters (non-flag arguments after command) */
export const params = args.filter((a) => !a.startsWith("--")).slice(1);

// --- Flag Shortcuts ---

/** @type {boolean} Use global scope */
export const GLOBAL = flags.has("--global") || flags.has("-g");

/** @type {boolean} Verbose output */
export const VERBOSE = flags.has("--verbose") || flags.has("-v");

/** @type {boolean} JSON output mode */
export const JSON_OUTPUT = flags.has("--json");

/** @type {boolean} Force operation */
export const FORCE = flags.has("--force") || flags.has("-f");

/** @type {boolean} Dry run mode */
export const DRY = flags.has("--dry-run");

/** @type {boolean} Auto-fix mode */
export const FIX = flags.has("--fix");

/** @type {boolean} Strict mode */
export const STRICT = flags.has("--strict");

/** @type {boolean} Locked mode (install from lockfile) */
export const LOCKED = flags.has("--locked");

/** @type {boolean} Offline mode (skip network operations) */
export const OFFLINE = flags.has("--offline");

// --- Package Info ---

import { createRequire } from "module";
const require = createRequire(import.meta.url);

/** @type {string} Package version */
export const VERSION = (() => {
    try { return require("../../package.json").version; }
    catch { return "1.2.0"; }
})();

