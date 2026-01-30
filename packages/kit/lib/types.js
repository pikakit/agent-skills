/**
 * @fileoverview JSDoc Type Definitions for add-skill CLI
 * Provides IDE autocomplete support
 */

/**
 * @typedef {Object} SkillStructure
 * @property {boolean} hasResources
 * @property {boolean} hasExamples
 * @property {boolean} hasScripts
 * @property {boolean} hasConstitution
 * @property {boolean} hasDoctrines
 * @property {boolean} hasEnforcement
 * @property {boolean} hasProposals
 * @property {string[]} directories
 * @property {string[]} files
 */

/**
 * @typedef {Object} Skill
 * @property {string} name - Skill folder name
 * @property {string} path - Absolute path to skill
 * @property {boolean} hasSkillMd - Has SKILL.md file
 * @property {string} description - From SKILL.md frontmatter
 * @property {string[]} tags - From SKILL.md frontmatter
 * @property {string} author - Author or publisher
 * @property {string} version - Version or ref
 * @property {SkillStructure} structure - Directory structure
 * @property {number} size - Total size in bytes
 * @property {string} [repo] - Source repository
 * @property {string} [skill] - Skill name in repo
 * @property {string} [ref] - Git ref
 * @property {string} [checksum] - Merkle hash
 * @property {string} [installedAt] - ISO timestamp
 */

/**
 * @typedef {Object} SkillMeta
 * @property {string} [name]
 * @property {string} [description]
 * @property {string} [version]
 * @property {string} [author]
 * @property {string[]} [tags]
 * @property {string} [type]
 * @property {string} [authority]
 * @property {string} [parent]
 */

/**
 * @typedef {Object} ParsedSpec
 * @property {string} org - GitHub org
 * @property {string} repo - GitHub repo
 * @property {string} [skill] - Skill name
 * @property {string} [ref] - Git ref
 */

/**
 * @typedef {Object} Backup
 * @property {string} name
 * @property {string} path
 * @property {Date} createdAt
 * @property {number} size
 */

/**
 * @typedef {Object} SkillLock
 * @property {number} lockVersion
 * @property {string} generatedAt
 * @property {string} generator
 * @property {Object.<string, SkillLockEntry>} skills
 */

/**
 * @typedef {Object} SkillLockEntry
 * @property {string} repo
 * @property {string} skill
 * @property {string} ref
 * @property {string} checksum
 * @property {string} [publisher]
 */

export { };
