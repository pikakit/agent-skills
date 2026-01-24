/**
 * @fileoverview Configuration for agent-skill-kit CLI
 */

import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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

/** CLI version */
export const VERSION = "2.0.0";

/** Debug mode */
export const DEBUG = process.env.DEBUG === "true";
