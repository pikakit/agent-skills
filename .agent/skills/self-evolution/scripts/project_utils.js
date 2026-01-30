#!/usr/bin/env node
/**
 * Project Detection Utility
 * Finds project root and manages project-scoped paths
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * Find project root by looking for marker files
 */
export function findProjectRoot(startPath = null) {
    let current = startPath ? path.resolve(startPath) : process.cwd();

    const markers = ['.git', 'package.json', 'pyproject.toml', 'Cargo.toml', 'go.mod'];

    while (current !== path.dirname(current)) {
        for (const marker of markers) {
            if (fs.existsSync(path.join(current, marker))) {
                return current;
            }
        }
        current = path.dirname(current);
    }

    return null;
}

/**
 * Get project-specific lessons directory
 */
export function getProjectLessonsDir(projectRoot = null) {
    if (!projectRoot) {
        projectRoot = findProjectRoot();
        if (!projectRoot) {
            throw new Error('Not in a project directory. Need .git, package.json, or other project marker.');
        }
    }

    return path.join(projectRoot, '.agent', 'skills', 'SelfEvolution', 'lessons');
}

/**
 * Get project-specific lessons YAML file
 */
export function getProjectLessonsFile(projectRoot = null) {
    return path.join(getProjectLessonsDir(projectRoot), 'project.yaml');
}

/**
 * Ensure lessons directory exists
 */
export function ensureLessonsDir(projectRoot = null) {
    const lessonsDir = getProjectLessonsDir(projectRoot);
    fs.mkdirSync(lessonsDir, { recursive: true });
    return lessonsDir;
}

/**
 * Get global (legacy) lessons file path
 */
export function getGlobalLessonsFile() {
    const agentDir = path.resolve(__dirname, '..', '..', '..', '..');
    return path.join(agentDir, '.agent', 'knowledge', 'lessons-learned.yaml');
}

// v4.0 Paths

/**
 * Get project-specific mistakes.yaml file (v4.0)
 */
export function getMistakesFile(projectRoot = null) {
    return path.join(getProjectLessonsDir(projectRoot), 'mistakes.yaml');
}

/**
 * Get project-specific improvements.yaml file (v4.0)
 */
export function getImprovementsFile(projectRoot = null) {
    return path.join(getProjectLessonsDir(projectRoot), 'improvements.yaml');
}

/**
 * Get project-specific meta.json config file (v4.0)
 */
export function getMetaFile(projectRoot = null) {
    return path.join(getProjectLessonsDir(projectRoot), 'meta.json');
}

/**
 * Get version history directory (v4.0)
 */
export function getVersionsDir(projectRoot = null) {
    return path.join(getProjectLessonsDir(projectRoot), 'versions');
}

/**
 * Detect which version of learning storage is in use
 */
export function detectVersion() {
    try {
        if (fs.existsSync(getMistakesFile()) || fs.existsSync(getImprovementsFile())) {
            return '4.0';
        }
        if (fs.existsSync(getProjectLessonsFile())) {
            return '3.0';
        }
        return 'none';
    } catch (e) {
        return 'none';
    }
}

/**
 * Ensure v4.0 directory structure exists
 */
export function ensureV4Structure() {
    try {
        const lessonsDir = ensureLessonsDir();
        const versionsDir = getVersionsDir();
        fs.mkdirSync(versionsDir, { recursive: true });
        return true;
    } catch (e) {
        return false;
    }
}

/**
 * Check if current directory is in a project
 */
export function isProjectScoped() {
    return findProjectRoot() !== null;
}

function main() {
    console.log('🔍 Project Detection Test\n');

    const root = findProjectRoot();
    if (root) {
        console.log(`✅ Project root: ${root}`);
        console.log(`   Lessons dir:  ${getProjectLessonsDir(root)}`);
        console.log(`   Lessons file: ${getProjectLessonsFile(root)}`);
    } else {
        console.log('❌ Not in a project directory');
        process.exit(1);
    }

    const lessonsFile = getProjectLessonsFile(root);
    if (fs.existsSync(lessonsFile)) {
        const stats = fs.statSync(lessonsFile);
        console.log(`\n📚 Lessons file exists (${stats.size} bytes)`);
    } else {
        console.log(`\n📭 No lessons file yet (will be created at ${lessonsFile})`);
    }

    const globalFile = getGlobalLessonsFile();
    if (fs.existsSync(globalFile)) {
        const stats = fs.statSync(globalFile);
        console.log(`\n🌍 Global lessons: ${globalFile} (${stats.size} bytes)`);
    }
}

// Run if executed directly
if (process.argv[1] === __filename) {
    main();
}
