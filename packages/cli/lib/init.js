/**
 * @fileoverview Project initialization wizard
 * Sets up agent config for new projects
 */

import fs from "fs";
import path from "path";
import { cwd, AGENT_DIR, KNOWLEDGE_DIR, LESSONS_PATH } from "./config.js";

/**
 * Detect project type based on files
 * @returns {string} Project type
 */
export function detectProjectType() {
    const files = fs.readdirSync(cwd);

    if (files.includes("package.json")) {
        const pkg = JSON.parse(fs.readFileSync(path.join(cwd, "package.json"), "utf8"));

        if (pkg.dependencies?.next || pkg.devDependencies?.next) return "nextjs";
        if (pkg.dependencies?.react || pkg.devDependencies?.react) return "react";
        if (pkg.dependencies?.vue || pkg.devDependencies?.vue) return "vue";
        if (pkg.dependencies?.express || pkg.devDependencies?.express) return "node";
        return "node";
    }

    if (files.includes("requirements.txt") || files.includes("pyproject.toml")) return "python";
    if (files.includes("Cargo.toml")) return "rust";
    if (files.includes("go.mod")) return "go";
    if (files.includes("pom.xml") || files.includes("build.gradle")) return "java";

    return "generic";
}

/**
 * Get default ignore patterns for project type
 * @param {string} projectType 
 * @returns {string[]}
 */
export function getDefaultIgnorePatterns(projectType) {
    const common = [
        "node_modules/**",
        ".git/**",
        "dist/**",
        "build/**",
        "coverage/**",
        "*.log",
        "*.lock",
        ".env*"
    ];

    const specific = {
        node: ["package-lock.json"],
        nextjs: [".next/**", "out/**"],
        react: ["build/**"],
        vue: [".nuxt/**"],
        python: ["__pycache__/**", "*.pyc", ".venv/**", "venv/**"],
        rust: ["target/**"],
        go: ["vendor/**"],
        java: ["target/**", "*.class"],
        generic: []
    };

    return [...common, ...(specific[projectType] || [])];
}

/**
 * Initialize agent config
 * @param {object} options
 * @param {boolean} options.force - Overwrite existing
 * @returns {{ success: boolean, message: string }}
 */
export function initProject(options = {}) {
    const { force = false } = options;

    // Check if already initialized
    if (fs.existsSync(KNOWLEDGE_DIR) && !force) {
        return {
            success: false,
            message: "Already initialized. Use --force to reinitialize."
        };
    }

    // Detect project type
    const projectType = detectProjectType();

    // Create directories
    fs.mkdirSync(KNOWLEDGE_DIR, { recursive: true });

    // Create lessons-learned.yaml
    if (!fs.existsSync(LESSONS_PATH)) {
        const initialLessons = `# Agent Skill Kit - Lessons Learned
# Project Type: ${projectType}
# Created: ${new Date().toISOString()}

lessons: []
`;
        fs.writeFileSync(LESSONS_PATH, initialLessons);
    }

    // Create .agentignore if not exists
    const agentignorePath = path.join(cwd, ".agentignore");
    if (!fs.existsSync(agentignorePath)) {
        const patterns = getDefaultIgnorePatterns(projectType);
        fs.writeFileSync(agentignorePath, patterns.join("\n") + "\n");
    }

    return {
        success: true,
        message: `Initialized for ${projectType} project`,
        projectType,
        paths: {
            knowledge: KNOWLEDGE_DIR,
            lessons: LESSONS_PATH,
            agentignore: agentignorePath
        }
    };
}

export default {
    detectProjectType,
    getDefaultIgnorePatterns,
    initProject
};
