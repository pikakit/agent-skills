/**
 * @fileoverview Type Definitions for agent-skill-kit CLI
 */

/**
 * @typedef {Object} Lesson
 * @property {string} id - Lesson ID (e.g., LEARN-001)
 * @property {string} pattern - Regex pattern to match
 * @property {string} message - Explanation message
 * @property {'WARNING'|'ERROR'} severity - Severity level
 * @property {string} addedAt - ISO timestamp
 */

/**
 * @typedef {Object} KnowledgeBase
 * @property {Lesson[]} lessons - Array of learned lessons
 */

/**
 * @typedef {Object} AuditResult
 * @property {string} file - File path
 * @property {string[]} violations - List of violations found
 * @property {boolean} passed - Whether file passed audit
 */

/**
 * @typedef {Object} CLIConfig
 * @property {string} agentDir - Path to .agent directory
 * @property {string} knowledgePath - Path to lessons file
 * @property {string} rulesPath - Path to rules directory
 */

export { };
