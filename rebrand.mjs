#!/usr/bin/env node
/**
 * Smart Rebrand CLI - Agent Skill Kit
 * Beautiful CLI rebrand tool powered by @clack/prompts
 */

import * as p from '@clack/prompts';
import { readdir, readFile, writeFile } from 'fs/promises';
import { join, relative, extname } from 'path';
import { glob } from 'glob';
import color from 'picocolors';

class RebrandCLI {
    constructor() {
        this.variations = new Map();
        this.changes = [];
        this.errors = [];
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
        const patterns = ['**/*.{js,ts,tsx,jsx,py,md,json}'];
        const ignore = ['**/node_modules/**', '**/.git/**', '**/dist/**', '**/build/**'];

        return await glob(patterns, { ignore, nodir: true });
    }

    async scanFile(filePath) {
        try {
            const content = await readFile(filePath, 'utf-8');
            const refs = [];

            for (const [variant, [oldVal, newVal]] of this.variations) {
                if (content.includes(oldVal)) {
                    const count = (content.match(new RegExp(oldVal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g')) || []).length;
                    refs.push({ variant, old: oldVal, new: newVal, count });
                }
            }

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

            for (const [_, [oldVal, newVal]] of this.variations) {
                content = content.replaceAll(oldVal, newVal);
            }

            if (content !== original) {
                if (!dryRun) {
                    await writeFile(filePath, content, 'utf-8');
                }
                return true;
            }
            return false;
        } catch (error) {
            this.errors.push({ file: filePath, error: error.message });
            return false;
        }
    }

    async updatePackageJson(oldName, newName) {
        try {
            const pkgPath = join(process.cwd(), 'package.json');
            const content = await readFile(pkgPath, 'utf-8');
            const pkg = JSON.parse(content);

            // Update description if it contains the old brand name
            if (pkg.description && pkg.description.includes(oldName)) {
                pkg.description = pkg.description.replace(oldName, newName);

                // Write back with pretty formatting
                await writeFile(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
                return true;
            }

            return false;
        } catch (error) {
            this.errors.push({ file: 'package.json', error: error.message });
            return false;
        }
    }

    async detectCurrentBrand() {
        try {
            const pkgPath = join(process.cwd(), 'package.json');
            const content = await readFile(pkgPath, 'utf-8');
            const pkg = JSON.parse(content);

            // Priority 1: description (more accurate)
            if (pkg.description) {
                const match = pkg.description.match(/^(?:The )?(.+?)(?:\s+for|$)/);
                if (match) return match[1];
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

    async run() {
        console.clear();

        p.intro(color.bgCyan(color.black(' Smart Rebrand v2 ')));

        // Auto-detect current brand
        const currentBrand = await this.detectCurrentBrand();

        if (currentBrand) {
            p.note(
                `Current: ${color.cyan(currentBrand)}\n` +
                color.dim('Detected from package.json'),
                'Current Brand'
            );
        }

        const project = await p.group(
            {
                newName: () => p.text({
                    message: currentBrand
                        ? `What would you like to change "${color.cyan(currentBrand)}" to?`
                        : 'What is the new brand name?',
                    placeholder: 'Agent Skill Kit',
                    validate: (value) => {
                        if (!value) return 'Please enter the new brand name';
                        if (currentBrand && value === currentBrand) return 'New name must be different from current';
                    },
                }),
                mode: () => p.select({
                    message: 'Run mode:',
                    options: [
                        { value: 'dry-run', label: 'Dry Run (preview only)', hint: 'Safe preview' },
                        { value: 'live', label: 'Live Mode (apply changes)', hint: 'Make changes' },
                    ],
                }),
            },
            {
                onCancel: () => {
                    p.cancel('Operation cancelled.');
                    process.exit(0);
                },
            }
        );

        const oldName = currentBrand || await p.text({
            message: 'Could not detect current brand. Please enter manually:',
            validate: (value) => {
                if (!value) return 'Please enter the current brand name';
            },
        });

        if (oldName === project.newName) {
            p.cancel('Old and new names are identical!');
            process.exit(1);
        }

        // Confirm if live mode
        if (project.mode === 'live') {
            const confirmed = await p.confirm({
                message: `Replace "${oldName}" with "${project.newName}" in all files?`,
                initialValue: false,
            });

            if (!confirmed) {
                p.cancel('Aborted.');
                process.exit(0);
            }
        }

        // Generate variations
        this.variations = this.generateVariations(oldName, project.newName);

        // Scan phase
        const s = p.spinner();
        s.start('Scanning files...');

        const files = await this.findFiles();
        const references = [];

        for (const file of files) {
            const refs = await this.scanFile(file);
            if (refs) {
                references.push(refs);
            }
        }

        s.stop(`Found ${references.length} files with references`);

        if (references.length === 0) {
            p.note('No references found. Codebase is already clean!', 'All Clear ✓');
            p.outro(color.green('Nothing to do!'));
            return;
        }

        // Show preview
        p.note(
            references.slice(0, 5).map(r =>
                `${color.dim(r.file)} ${color.yellow(`(${r.refs.length} matches)`)}`
            ).join('\n') +
            (references.length > 5 ? `\n${color.dim(`... and ${references.length - 5} more`)}` : ''),
            'Files to modify'
        );

        if (project.mode === 'dry-run') {
            p.outro(color.yellow('Dry run complete. No files were modified.'));
            return;
        }

        // Apply changes
        s.start('Applying changes...');

        for (const { file } of references) {
            const success = await this.processFile(file, false);
            if (success) {
                this.changes.push(file);
            }
        }

        s.stop('Changes applied');

        // Update package.json with new brand name
        const pkgUpdated = await this.updatePackageJson(oldName, project.newName);
        if (pkgUpdated) {
            p.note(
                `Updated description: "${project.newName}"`,
                color.green('✓ package.json updated')
            );
        }

        // Report
        if (this.errors.length > 0) {
            p.note(
                this.errors.slice(0, 3).map(e =>
                    `${color.red('✗')} ${e.file}\n  ${color.dim(e.error)}`
                ).join('\n'),
                color.red('Errors')
            );
        }

        const nextSteps = `
${color.cyan('1.')} Review changes: ${color.bold('git diff')}
${color.cyan('2.')} Test your application
${color.cyan('3.')} Commit: ${color.bold('git add . && git commit -m "rebrand: ..."')}
        `.trim();

        p.note(nextSteps, 'Next Steps');

        p.outro(
            color.green(`✓ Successfully rebranded ${this.changes.length} files!`)
        );
    }
}

// Run
const cli = new RebrandCLI();
cli.run().catch((error) => {
    console.error(color.red('Error:'), error.message);
    process.exit(1);
});
