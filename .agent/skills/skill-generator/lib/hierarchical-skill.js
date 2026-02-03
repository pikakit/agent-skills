/**
 * Hierarchical Skill Manager v1.0
 * 
 * Manages the auto-learned hierarchical skill structure.
 * Merges patterns into category-based subskills instead of creating new skills.
 * 
 * @version 1.0.0
 * @author PikaKit
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ============================================================================
// CONSTANTS
// ============================================================================

const AUTO_LEARNED_SKILL = 'auto-learned';
const PATTERNS_FOLDER = 'patterns';
const CONFIG_FILE = 'config.json';
const PATTERNS_JSON = 'patterns.json';

const DEFAULT_CONFIG = {
    version: "1.0.0",
    minPatternsToCreate: 3,
    categories: ["import", "type", "syntax", "logic", "style"],
    maxPatternsPerCategory: 50,
    autoMerge: true,
    requireApproval: false
};

// ============================================================================
// SKILL STRUCTURE MANAGEMENT
// ============================================================================

/**
 * Ensure auto-learned skill exists with proper structure
 * @param {string} skillsDir - Path to .agent/skills directory
 * @returns {Object} Result with path and created status
 */
export function ensureAutoLearnedExists(skillsDir) {
    const autoLearnedPath = path.join(skillsDir, AUTO_LEARNED_SKILL);
    const patternsPath = path.join(autoLearnedPath, PATTERNS_FOLDER);

    const created = [];

    // Create main folder
    if (!fs.existsSync(autoLearnedPath)) {
        fs.mkdirSync(autoLearnedPath, { recursive: true });
        created.push(autoLearnedPath);
    }

    // Create patterns folder
    if (!fs.existsSync(patternsPath)) {
        fs.mkdirSync(patternsPath, { recursive: true });
        created.push(patternsPath);
    }

    // Ensure SKILL.md exists
    const skillMdPath = path.join(autoLearnedPath, 'SKILL.md');
    if (!fs.existsSync(skillMdPath)) {
        fs.writeFileSync(skillMdPath, generateMainSkillMd());
        created.push(skillMdPath);
    }

    // Ensure config.json exists
    const configPath = path.join(autoLearnedPath, CONFIG_FILE);
    if (!fs.existsSync(configPath)) {
        fs.writeFileSync(configPath, JSON.stringify(DEFAULT_CONFIG, null, 2));
        created.push(configPath);
    }

    // Ensure patterns.json exists
    const patternsJsonPath = path.join(autoLearnedPath, PATTERNS_JSON);
    if (!fs.existsSync(patternsJsonPath)) {
        fs.writeFileSync(patternsJsonPath, JSON.stringify({
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            categories: {},
            statistics: { totalPatterns: 0, totalCategories: 0 }
        }, null, 2));
        created.push(patternsJsonPath);
    }

    return {
        path: autoLearnedPath,
        created: created.length > 0,
        createdFiles: created
    };
}

/**
 * Add a pattern to the appropriate category subskill
 * @param {string} skillsDir - Path to .agent/skills directory
 * @param {Object} pattern - Pattern to add
 * @param {string} category - Category (import, type, syntax, etc.)
 * @returns {Object} Result with success status
 */
export function addPatternToCategory(skillsDir, pattern, category) {
    // Ensure structure exists
    ensureAutoLearnedExists(skillsDir);

    const autoLearnedPath = path.join(skillsDir, AUTO_LEARNED_SKILL);
    const categoryFile = path.join(autoLearnedPath, PATTERNS_FOLDER, `${category}-patterns.md`);
    const patternsJsonPath = path.join(autoLearnedPath, PATTERNS_JSON);

    // Load or create patterns.json
    let patternsData;
    try {
        patternsData = JSON.parse(fs.readFileSync(patternsJsonPath, 'utf-8'));
    } catch {
        patternsData = {
            version: "1.0.0",
            lastUpdated: new Date().toISOString(),
            categories: {},
            statistics: { totalPatterns: 0, totalCategories: 0 }
        };
    }

    // Initialize category if not exists
    if (!patternsData.categories[category]) {
        patternsData.categories[category] = {
            patternCount: 0,
            file: `patterns/${category}-patterns.md`,
            patterns: []
        };
    }

    // Check if pattern already exists
    const existingIndex = patternsData.categories[category].patterns
        .findIndex(p => p.pattern === pattern.pattern);

    if (existingIndex >= 0) {
        // Update existing pattern
        patternsData.categories[category].patterns[existingIndex].occurrences++;
        patternsData.categories[category].patterns[existingIndex].lastSeen = new Date().toISOString();
    } else {
        // Add new pattern
        const patternId = `${category}-${String(patternsData.categories[category].patternCount + 1).padStart(3, '0')}`;
        patternsData.categories[category].patterns.push({
            id: patternId,
            pattern: pattern.pattern,
            fix: pattern.fix || pattern.message || 'See pattern for details',
            occurrences: 1,
            source: pattern.source || 'unknown',
            addedAt: new Date().toISOString()
        });
        patternsData.categories[category].patternCount++;
    }

    // Update statistics
    patternsData.lastUpdated = new Date().toISOString();
    patternsData.statistics.totalPatterns = Object.values(patternsData.categories)
        .reduce((sum, cat) => sum + cat.patternCount, 0);
    patternsData.statistics.totalCategories = Object.keys(patternsData.categories).length;

    // Save patterns.json
    fs.writeFileSync(patternsJsonPath, JSON.stringify(patternsData, null, 2));

    // Update/create category markdown file
    updateCategorySubskill(autoLearnedPath, category, patternsData.categories[category]);

    // Update main SKILL.md statistics
    updateMainIndex(autoLearnedPath, patternsData);

    return {
        success: true,
        category,
        patternId: patternsData.categories[category].patterns.slice(-1)[0]?.id,
        isNew: existingIndex < 0,
        totalInCategory: patternsData.categories[category].patternCount
    };
}

/**
 * Update category subskill markdown file
 * @param {string} autoLearnedPath - Path to auto-learned skill
 * @param {string} category - Category name
 * @param {Object} categoryData - Category data from patterns.json
 */
function updateCategorySubskill(autoLearnedPath, category, categoryData) {
    const categoryFile = path.join(autoLearnedPath, PATTERNS_FOLDER, `${category}-patterns.md`);

    const content = generateCategoryMd(category, categoryData);
    fs.writeFileSync(categoryFile, content);
}

/**
 * Update main SKILL.md with current statistics
 * @param {string} autoLearnedPath - Path to auto-learned skill
 * @param {Object} patternsData - Full patterns.json data
 */
function updateMainIndex(autoLearnedPath, patternsData) {
    const skillMdPath = path.join(autoLearnedPath, 'SKILL.md');

    // Read current content
    let content = fs.readFileSync(skillMdPath, 'utf-8');

    // Update statistics section
    const statsSection = `## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Categories** | ${patternsData.statistics.totalCategories} |
${Object.entries(patternsData.categories).map(([cat, data]) =>
        `| **${cat.charAt(0).toUpperCase() + cat.slice(1)} Patterns** | ${data.patternCount} |`
    ).join('\n')}
| **Last Updated** | ${new Date().toISOString().split('T')[0]} |`;

    // Replace statistics section
    content = content.replace(
        /## 📊 Statistics[\s\S]*?(?=---)/,
        statsSection + '\n\n'
    );

    fs.writeFileSync(skillMdPath, content);
}

// ============================================================================
// TEMPLATE GENERATION
// ============================================================================

/**
 * Generate main SKILL.md content
 */
function generateMainSkillMd() {
    return `---
name: auto-learned
description: >-
  Hierarchical skill containing all auto-learned patterns from IDE errors 
  and code analysis. Organizes patterns by category (import, type, syntax, etc.)
  with subskills in patterns/ folder.
  Triggers on: auto-learn, pattern, learned, error fix.
  Coordinates with: problem-checker, skill-generator, auto-learner.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "auto-learn, pattern, learned, error fix"
  coordinates_with: "problem-checker, skill-generator"
  success_metrics: "pattern_matches, auto_fixes_applied"
  hierarchical: true
---

# Auto-Learned Patterns

> **Purpose:** Central repository for all auto-learned patterns from IDE errors

---

## 🎯 Purpose

This skill contains patterns automatically learned from:
- IDE errors detected by PikaKit extension
- Code analysis and linting issues
- User corrections and fixes

---

## 📂 Skill Structure

\`\`\`
auto-learned/
├── SKILL.md              # This file
├── patterns/             # Subskills by category
├── patterns.json         # Raw pattern data
└── config.json           # Configuration
\`\`\`

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Categories** | 0 |
| **Last Updated** | ${new Date().toISOString().split('T')[0]} |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| \`problem-checker\` | Skill | Detects IDE errors |
| \`skill-generator\` | Skill | Generates patterns |

---

⚡ PikaKit v3.2.0
`;
}

/**
 * Generate category subskill markdown
 * @param {string} category - Category name
 * @param {Object} categoryData - Category data
 */
function generateCategoryMd(category, categoryData) {
    const categoryTitle = category.charAt(0).toUpperCase() + category.slice(1);

    let content = `# ${categoryTitle} Patterns

> Subskill of \`auto-learned\` - Contains ${category}-related patterns

---

## 📋 Learned Patterns

`;

    for (let i = 0; i < categoryData.patterns.length; i++) {
        const p = categoryData.patterns[i];
        content += `### ${i + 1}. ${p.pattern.slice(0, 50)}${p.pattern.length > 50 ? '...' : ''}

**Pattern:** \`${p.pattern}\`

**Fix:** ${p.fix}

**Occurrences:** ${p.occurrences} | **Source:** ${p.source}

---

`;
    }

    content += `## Statistics

- **Patterns:** ${categoryData.patternCount}
- **Category:** ${category}
- **Last Updated:** ${new Date().toISOString().split('T')[0]}
`;

    return content;
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

/**
 * Get category from error message
 * @param {string} errorMessage - Error message
 * @returns {string} Category name
 */
export function categorizeError(errorMessage) {
    const lowerMessage = errorMessage.toLowerCase();

    if (lowerMessage.includes('cannot find name') ||
        lowerMessage.includes('import') ||
        lowerMessage.includes('module')) {
        return 'import';
    }

    if (lowerMessage.includes('type') ||
        lowerMessage.includes('property') ||
        lowerMessage.includes('assignable')) {
        return 'type';
    }

    if (lowerMessage.includes('syntax') ||
        lowerMessage.includes('unexpected') ||
        lowerMessage.includes('parse')) {
        return 'syntax';
    }

    if (lowerMessage.includes('undefined') ||
        lowerMessage.includes('null') ||
        lowerMessage.includes('never')) {
        return 'logic';
    }

    return 'style';
}

/**
 * Load config from auto-learned skill
 * @param {string} skillsDir - Path to .agent/skills directory
 * @returns {Object} Config object
 */
export function loadConfig(skillsDir) {
    const configPath = path.join(skillsDir, AUTO_LEARNED_SKILL, CONFIG_FILE);

    try {
        return JSON.parse(fs.readFileSync(configPath, 'utf-8'));
    } catch {
        return DEFAULT_CONFIG;
    }
}

// ============================================================================
// EXPORTS
// ============================================================================

export default {
    ensureAutoLearnedExists,
    addPatternToCategory,
    categorizeError,
    loadConfig,
    AUTO_LEARNED_SKILL,
    PATTERNS_FOLDER
};
