/**
 * @fileoverview Configuration for agent-skill-kit CLI
 */

import path from "path";
import { fileURLToPath } from "url";
import { createRequire } from "module";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);

/** Current working directory */
export const cwd = process.cwd();

/** Path to .agent directory (configurable via AGENT_DIR env) */
export const AGENT_DIR = process.env.AGENT_DIR || path.join(cwd, ".agent");

/** Path to knowledge directory */
export const KNOWLEDGE_DIR = path.join(AGENT_DIR, "knowledge");

/** Path to lessons learned file */
export const LESSONS_PATH = path.join(KNOWLEDGE_DIR, "lessons-learned.yaml");

/** Path to rules directory */
export const RULES_DIR = path.join(AGENT_DIR, "rules");

/** CLI version - read from package.json */
export const VERSION = (() => {
    try { return require("../package.json").version; }
    catch { return "2.2.0"; }
})();

/** Debug mode */
export const DEBUG = process.env.DEBUG === "true";

