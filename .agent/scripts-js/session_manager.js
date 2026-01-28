#!/usr/bin/env node

/**
 * Session Manager - Agent Skill Kit
 * ==================================
 * Analyzes project state, detects tech stack, tracks file statistics,
 * and provides a summary of the current session.
 * 
 * JavaScript port of session_manager.py
 * 
 * Usage:
 *   node session_manager.js status [path]
 *   node session_manager.js info [path]
 */

import { readFile, readdir, stat } from 'fs/promises';
import { resolve, join } from 'path';
import { parseArgs } from 'node:util';
import { colors } from './utils/colors.js';

/**
 * Get project root path
 */
function getProjectRoot(pathArg = '.') {
    return resolve(pathArg);
}

/**
 * Analyze package.json to detect tech stack
 */
async function analyzePackageJson(root) {
    const pkgFile = join(root, 'package.json');

    try {
        const data = JSON.parse(await readFile(pkgFile, 'utf-8'));
        const deps = { ...data.dependencies, ...data.devDependencies };

        const stack = [];

        // Framework detection
        if (deps['next']) stack.push('Next.js');
        else if (deps['react']) stack.push('React');
        else if (deps['vue']) stack.push('Vue');
        else if (deps['svelte']) stack.push('Svelte');
        else if (deps['express']) stack.push('Express');
        else if (deps['@nestjs/core'] || deps['nestjs']) stack.push('NestJS');

        // Utility stack
        if (deps['tailwindcss']) stack.push('Tailwind CSS');
        if (deps['prisma']) stack.push('Prisma');
        if (deps['typescript']) stack.push('TypeScript');

        return {
            name: data.name || 'unnamed',
            version: data.version || '0.0.0',
            stack,
            scripts: Object.keys(data.scripts || {})
        };
    } catch (err) {
        return {
            type: 'unknown',
            error: err.message
        };
    }
}

/**
 * Count files in project (excluding common build/dependency dirs)
 */
async function countFiles(root) {
    const stats = { created: 0, modified: 0, total: 0 };
    const exclude = new Set([
        '.git',
        'node_modules',
        '.next',
        'dist',
        'build',
        '.agent',
        '.gemini',
        '__pycache__'
    ]);

    async function walk(dir) {
        try {
            const entries = await readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                if (exclude.has(entry.name)) continue;

                const fullPath = join(dir, entry.name);

                if (entry.isDirectory()) {
                    await walk(fullPath);
                } else {
                    stats.total++;
                }
            }
        } catch {
            // Ignore permission errors
        }
    }

    await walk(root);
    return stats;
}

/**
 * Detect project features/modules
 */
async function detectFeatures(root) {
    const features = [];
    const src = join(root, 'src');

    try {
        const possibleDirs = ['components', 'modules', 'features', 'app', 'pages', 'services'];

        for (const dirName of possibleDirs) {
            const dirPath = join(src, dirName);

            try {
                const entries = await readdir(dirPath, { withFileTypes: true });

                for (const entry of entries) {
                    if (entry.isDirectory()) {
                        features.push(entry.name);
                    }
                }
            } catch {
                // Directory doesn't exist
            }
        }
    } catch {
        // src directory doesn't exist
    }

    return features.slice(0, 10); // Limit to top 10
}

/**
 * Print project status
 */
async function printStatus(root) {
    const info = await analyzePackageJson(root);
    const stats = await countFiles(root);
    const features = await detectFeatures(root);

    console.log('\n=== Project Status ===');
    console.log(`\n📁 Project: ${info.name || root}`);
    console.log(`📂 Path: ${root}`);
    console.log(`🏷️  Type: ${(info.stack || ['Generic']).join(', ')}`);
    console.log(`📊 Status: Active`);

    console.log('\n🔧 Tech Stack:');
    for (const tech of (info.stack || [])) {
        console.log(`   • ${tech}`);
    }

    console.log(`\n✅ Detected Modules/Features (${features.length}):`);
    for (const feat of features) {
        console.log(`   • ${feat}`);
    }
    if (features.length === 0) {
        console.log('   (No distinct feature modules detected)');
    }

    console.log(`\n📄 Files: ${stats.total} total files tracked`);
    console.log('\n====================\n');
}

/**
 * Main entry point
 */
async function main() {
    const { values, positionals } = parseArgs({
        args: process.argv.slice(2),
        allowPositionals: true,
        options: {}
    });

    const command = positionals[0] || 'status';
    const pathArg = positionals[1] || '.';

    const root = getProjectRoot(pathArg);

    if (command === 'status') {
        await printStatus(root);
    } else if (command === 'info') {
        const info = await analyzePackageJson(root);
        console.log(JSON.stringify(info, null, 2));
    } else {
        console.error(`Unknown command: ${command}`);
        console.error('Usage: node session_manager.js [status|info] [path]');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
