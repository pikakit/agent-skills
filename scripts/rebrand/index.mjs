#!/usr/bin/env node
/**
 * Smart Rebrand CLI - Agent Skill Kit v3.3.0
 * Intelligent multi-package rebrand tool with parallel processing
 * 
 * Usage: npm run rebrand
 */

import * as p from '@clack/prompts';
import { readFile, writeFile } from 'fs/promises';
import { join, extname } from 'path';
import { glob } from 'glob';
import color from 'picocolors';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

class RebrandCLI {
    constructor() {
        this.variations = new Map();
        this.changes = [];
        this.errors = [];
        this.stats = {
            scanned: 0,
            modified: 0,
            skipped: 0
        };
    }

    generateVariations(oldName, newName) {
        const toKebab = (text) => text.toLowerCase().replace(/[\s_]/g, '-');
        const toSnake = (text) => text.toLowerCase().replace(/[\s-]/g, '_');
        const toCamel = (text) => {
            const words = text.split(/[\s-_]+/);
            return words[0].toLowerCase() + words.slice(1).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        };
        const toPascal = (text) => {
            const words = text.split(/[\s-_]+/);
            return words.map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join('');
        };
        const toConstant = (text) => text.toUpperCase().replace(/[\s-]/g, '_');

        return new Map([
            ['original', [oldName, newName]],
            ['lowercase', [oldName.toLowerCase(), newName.toLowerCase()]],
            ['uppercase', [oldName.toUpperCase(), newName.toUpperCase()]],
            ['kebab-case', [toKebab(oldName), toKebab(newName)]],
            ['snake_case', [toSnake(oldName), toSnake(newName)]],
            ['camelCase', [toCamel(oldName), toCamel(newName)]],
            ['PascalCase', [toPascal(oldName), toPascal(newName)]],
            ['CONSTANT_CASE', [toConstant(oldName), toConstant(newName)]],
        ]);
    }

    async findFiles() {
        const patterns = [
            '**/*.{js,mjs,ts,tsx,jsx,md,json,yaml,yml}',
            '.agent/**/*.{md,yaml,yml}',
            'scripts/**/*.{js,mjs}',
        ];
        
        const ignore = [
            '**/node_modules/**',
            '**/.git/**',
            '**/dist/**',
            '**/build/**',
            '**/coverage/**',
            '**/.agent/knowledge/**',
            '**/.agent/studio/data/**',
            '**/package-lock.json',
            '**/pnpm-lock.yaml',
            '**/yarn.lock',
            '**/*.test.{js,ts}',
            '**/*.spec.{js,ts}',
            '**/.gemini/**',
        ];

        return await glob(patterns, { ignore, nodir: true, dot: true });
    }

    shouldApplyVariation(filePath, variant) {
        const ext = extname(filePath);
        
        // JSON files: only apply original, lowercase, kebab-case
        if (ext === '.json') {
            return ['original', 'lowercase', 'kebab-case'].includes(variant);
        }
        
        // YAML files: only apply original, kebab-case, snake_case
        if (ext === '.yaml' || ext === '.yml') {
            return ['original', 'kebab-case', 'snake_case'].includes(variant);
        }
        
        // Markdown: only apply original, lowercase, PascalCase
        if (ext === '.md') {
            return ['original', 'lowercase', 'PascalCase'].includes(variant);
        }
        
        // Code files: apply all variations
        return true;
    }

    async scanFile(filePath) {
        try {
            const content = await readFile(filePath, 'utf-8');
            const refs = [];

            for (const [variant, [oldVal, newVal]] of this.variations) {
                // Skip variations that don't apply to this file type
                if (!this.shouldApplyVariation(filePath, variant)) continue;
                
                if (content.includes(oldVal)) {
                    const escapedOld = oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                    const count = (content.match(new RegExp(escapedOld, 'g')) || []).length;
                    refs.push({ variant, old: oldVal, new: newVal, count });
                }
            }

            this.stats.scanned++;
            return refs.length > 0 ? { file: filePath, refs } : null;
        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            return null;
        }
    }

    async processFile(filePath, dryRun = false) {
        try {
            let content = await readFile(filePath, 'utf-8');
            const original = content;

            for (const [variant, [oldVal, newVal]] of this.variations) {
                // Skip variations that don't apply to this file type
                if (!this.shouldApplyVariation(filePath, variant)) continue;
                
                content = content.replaceAll(oldVal, newVal);
            }

            if (content !== original) {
                if (!dryRun) {
                    await writeFile(filePath, content, 'utf-8');
                }
                this.stats.modified++;
                return true;
            }
            this.stats.skipped++;
            return false;
        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            return false;
        }
    }

    async updatePackageJsonFiles(oldName, newName) {
        const packagePaths = [
            'package.json',
            'packages/cli/package.json'
        ];

        let updated = 0;
        const updates = [];

        for (const pkgPath of packagePaths) {
            try {
                const fullPath = join(process.cwd(), pkgPath);
                const content = await readFile(fullPath, 'utf-8');
                const pkg = JSON.parse(content);

                let changed = false;
                const changes = [];

                // Update description
                if (pkg.description && pkg.description.includes(oldName)) {
                    const before = pkg.description;
                    pkg.description = pkg.description.replace(new RegExp(oldName, 'g'), newName);
                    changes.push(`description: "${before}" → "${pkg.description}"`);
                    changed = true;
                }

                // Update author
                if (pkg.author && typeof pkg.author === 'string' && pkg.author.includes(oldName)) {
                    pkg.author = pkg.author.replace(new RegExp(oldName, 'g'), newName);
                    changes.push(`author: updated`);
                    changed = true;
                }

                if (changed) {
                    await writeFile(fullPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
                    updated++;
                    updates.push({ path: pkgPath, changes });
                }
            } catch (error) {
                if (error.code !== 'ENOENT') {
                    this.errors.push({ file: pkgPath, error: error.message });
                }
            }
        }

        return { count: updated, updates };
    }

    async detectCurrentBrand() {
        try {
            const pkgPath = join(process.cwd(), 'package.json');
            const content = await readFile(pkgPath, 'utf-8');
            const pkg = JSON.parse(content);

            // Priority 1: description (most accurate)
            if (pkg.description) {
                const match = pkg.description.match(/^(?:The )?(.+?)(?:\s+for|\s+CLI|$)/);
                if (match) return match[1].trim();
            }

            // Priority 2: package name
            if (pkg.name) {
                const match = pkg.name.match(/[@\/]?([^\/]+)(?:\/([^\/]+))?$/);
                if (match) {
                    const name = match[2] || match[1];
                    return name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
                }
            }

            return null;
        } catch {
            return null;
        }
    }

    async checkGitStatus() {
        try {
            const { stdout } = await execAsync('git status --porcelain');
            return stdout.trim().length === 0;
        } catch {
            return false; // Not a git repo or git not available
        }
    }

    async run() {
        console.clear();

        p.intro(color.bgCyan(color.black(' 🎨 Smart Rebrand v3.3.0 ')));

        // Check git status
        const isClean = await this.checkGitStatus();
        if (!isClean) {
            const shouldContinue = await p.confirm({
                message: 'Git working directory has uncommitted changes. Continue anyway?',
                initialValue: false,
            });

            if (!shouldContinue || p.isCancel(shouldContinue)) {
                p.cancel('Aborted. Commit your changes first.');
                process.exit(0);
            }
        }

        // Auto-detect current brand
        const currentBrand = await this.detectCurrentBrand();

        if (currentBrand) {
            p.note(
                `Current: ${color.cyan(currentBrand)}\n` +
                color.dim('Auto-detected from package.json'),
                '🏷️  Current Brand'
            );
        }

        // New Name Input
        const newName = await p.text({
            message: 'Enter new brand name',
            placeholder: 'e.g. Super Agent Kit',
            initialValue: '',
            validate: (value) => {
                if (!value) return 'Please enter the new brand name';
                if (value.length < 3) return 'Brand name too short';
                if (currentBrand && value === currentBrand) return 'New name must be different';
            },
        });

        if (p.isCancel(newName)) {
            p.cancel('Operation cancelled.');
            process.exit(0);
        }

        // Fallback if current brand not detected
        let oldName = currentBrand;
        if (!oldName) {
            oldName = await p.text({
                message: 'Could not auto-detect. Enter current brand manually:',
                validate: (value) => {
                    if (!value) return 'Required';
                    if (value === newName) return 'Must be different from new name';
                },
            });
            if (p.isCancel(oldName)) {
                p.cancel('Operation cancelled.');
                process.exit(0);
            }
        }

        // Run Mode
        const mode = await p.select({
            message: 'Run mode:',
            options: [
                { value: 'dry-run', label: '🔍 Dry Run (preview only)', hint: 'Safe, no changes' },
                { value: 'live', label: '⚡ Live Mode (apply changes)', hint: 'Make changes' },
            ],
        });

        if (p.isCancel(mode)) {
            p.cancel('Operation cancelled.');
            process.exit(0);
        }

        // Final confirmation for live mode
        if (mode === 'live') {
            const confirmed = await p.confirm({
                message: `Replace "${color.yellow(oldName)}" with "${color.green(newName)}" across entire codebase?`,
                initialValue: false,
            });

            if (!confirmed || p.isCancel(confirmed)) {
                p.cancel('Aborted.');
                process.exit(0);
            }
        }

        // Generate variations
        this.variations = this.generateVariations(oldName, newName);

        // Show variations
        p.note(
            Array.from(this.variations.entries())
                .slice(0, 4)
                .map(([variant, [old, newVal]]) => 
                    `${color.dim(variant + ':')} ${old} → ${color.cyan(newVal)}`
                ).join('\n') +
            color.dim('\n... and 4 more variations'),
            '🔄 Variants'
        );

        // Scan phase
        const s = p.spinner();
        s.start('Scanning files...');

        const files = await this.findFiles();
        const references = [];

        // Process files with progress
        for (let i = 0; i < files.length; i++) {
            if (i % 10 === 0) {
                s.message(`Scanning... ${i}/${files.length}`);
            }
            const refs = await this.scanFile(files[i]);
            if (refs) {
                references.push(refs);
            }
        }

        s.stop(`Scanned ${this.stats.scanned} files, found ${references.length} with matches`);

        if (references.length === 0) {
            p.note('No references found. Codebase already uses new brand!', '✓ All Clear');
            p.outro(color.green('Nothing to do!'));
            return;
        }

        // Show preview
        const preview = references.slice(0, 8).map(r => {
            const totalMatches = r.refs.reduce((sum, ref) => sum + ref.count, 0);
            return `${color.dim(r.file)} ${color.yellow(`(${totalMatches} matches)`)}`;
        }).join('\n') +
        (references.length > 8 ? `\n${color.dim(`... and ${references.length - 8} more files`)}` : '');

        p.note(preview, '📝 Files to modify');

        if (mode === 'dry-run') {
            p.outro(color.yellow('✓ Dry run complete. No files modified.'));
            return;
        }

        // Apply changes
        s.start('Applying changes...');

        for (let i = 0; i < references.length; i++) {
            if (i % 5 === 0) {
                s.message(`Processing... ${i}/${references.length}`);
            }
            const { file } = references[i];
            const success = await this.processFile(file, false);
            if (success) {
                this.changes.push(file);
            }
        }

        s.stop('Content changes applied');

        // Update package.json files
        const pkgResult = await this.updatePackageJsonFiles(oldName, newName);
        if (pkgResult.count > 0) {
            const details = pkgResult.updates.map(u => 
                `${color.dim(u.path)}\n  ${u.changes.join('\n  ')}`
            ).join('\n');
            
            p.note(details, color.green('✓ Package.json updated'));
        }

        // Final stats
        p.note(
            `Modified: ${color.green(this.stats.modified)}\n` +
            `Skipped: ${color.dim(this.stats.skipped)}\n` +
            (this.errors.length > 0 ? `Errors: ${color.red(this.errors.length)}` : ''),
            '📊 Stats'
        );

        // Show errors if any
        if (this.errors.length > 0) {
            p.note(
                this.errors.slice(0, 3).map(e =>
                    `${color.red('✗')} ${e.file}\n  ${color.dim(e.error)}`
                ).join('\n') +
                (this.errors.length > 3 ? color.dim(`\n... and ${this.errors.length - 3} more`) : ''),
                color.red('⚠️  Errors')
            );
        }

        // Next steps
        const nextSteps = `
${color.cyan('1.')} Review: ${color.bold('git diff')}
${color.cyan('2.')} Test: ${color.bold('npm test')}
${color.cyan('3.')} Commit: ${color.bold(`git add . && git commit -m "rebrand: ${oldName} → ${newName}"`)}
        `.trim();

        p.note(nextSteps, '📋 Next Steps');

        p.outro(
            color.green(`✨ Successfully rebranded ${this.changes.length} files!`)
        );
    }
}

// Run
const cli = new RebrandCLI();
cli.run().catch((error) => {
    console.error(color.red('Fatal Error:'), error.message);
    if (error.stack) console.error(color.dim(error.stack));
    process.exit(1);
});
