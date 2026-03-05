#!/usr/bin/env node
/**
 * PikaKit PR Audit Tool
 * 
 * Audits a Git branch or PR for doctrine compliance
 * 
 * Usage:
 *   node scripts/audit_pr.js <branch-name>
 *   node scripts/audit_pr.js --current  (audit current branch vs main)
 * 
 * Exit codes:
 *   0 = All checks passed
 *   1 = Violations found
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    magenta: '\x1b[35m',
    dim: '\x1b[2m',
    bold: '\x1b[1m',
};

class PRAuditor {
    constructor(targetBranch, baseBranch = 'main') {
        this.targetBranch = targetBranch;
        this.baseBranch = baseBranch;
        this.changedFiles = [];
        this.violations = [];
    }

    getChangedFiles() {
        try {
            const diff = execSync(
                `git diff --name-only ${this.baseBranch}...${this.targetBranch}`,
                { encoding: 'utf-8' }
            );

            this.changedFiles = diff
                .split('\n')
                .filter(f => f.trim())
                .filter(f => f.match(/\.(ts|tsx|js|jsx)$/))
                .filter(f => !f.includes('node_modules'))
                .filter(f => !f.includes('.test.'))
                .filter(f => !f.includes('.spec.'));

            return this.changedFiles;
        } catch (error) {
            console.error(colors.red + 'Error getting changed files:' + colors.reset, error.message);
            process.exit(1);
        }
    }

    categorizePR() {
        const categories = {
            backend: false,
            frontend: false,
            api: false,
            chart: false,
            mobile: false,
            data: false,
        };

        for (const file of this.changedFiles) {
            if (file.match(/api\//)) categories.api = true;
            if (file.match(/lib\/|server\/|db\//)) categories.backend = true;
            if (file.match(/components\/|app\/|pages\//)) categories.frontend = true;
            if (file.match(/chart|graph|ohlc|candle/i)) categories.chart = true;
            if (file.match(/mobile|gesture|swipe|scroll/i)) categories.mobile = true;
            if (file.match(/data|price|market|coin/i)) categories.data = true;
        }

        return categories;
    }

    getApplicableDoctrines(categories) {
        const doctrines = [
            'constitution/master-constitution.md',
        ];

        if (categories.backend || categories.api) {
            doctrines.push('doctrines/architecture/architecture-doctrine.md');
            doctrines.push('doctrines/backend/backend-data-engine-doctrine.md');
        }

        if (categories.chart || categories.data) {
            doctrines.push('doctrines/data/data-integrity-doctrine.md');
        }

        if (categories.frontend || categories.mobile) {
            doctrines.push('doctrines/frontend/frontend-mobile-doctrine.md');
        }

        if (categories.mobile) {
            doctrines.push('doctrines/frontend/interaction-patterns-doctrine.md');
        }

        doctrines.push('doctrines/performance/performance-doctrine.md');
        doctrines.push('doctrines/commercial/commercial-guardrails-doctrine.md');

        return doctrines;
    }

    async auditFiles() {
        const validatorPath = path.join(__dirname, 'validate_doctrine.js');

        for (const file of this.changedFiles) {
            if (!fs.existsSync(file)) {
                console.log(colors.yellow + `⚠️  File deleted: ${file}` + colors.reset);
                continue;
            }

            console.log(colors.dim + `\nValidating: ${file}` + colors.reset);

            try {
                execSync(`node "${validatorPath}" "${file}"`, {
                    stdio: 'inherit',
                });
            } catch (error) {
                this.violations.push(file);
            }
        }
    }

    printSummary() {
        const categories = this.categorizePR();
        const doctrines = this.getApplicableDoctrines(categories);

        console.log('\n' + colors.magenta + '═'.repeat(70) + colors.reset);
        console.log(colors.magenta + colors.bold + `PikaKit PR Audit Report` + colors.reset);
        console.log(colors.magenta + '═'.repeat(70) + colors.reset + '\n');

        console.log(colors.cyan + `Branch: ${this.targetBranch}` + colors.reset);
        console.log(colors.dim + `Base: ${this.baseBranch}` + colors.reset);
        console.log(colors.dim + `Files changed: ${this.changedFiles.length}` + colors.reset);
        console.log();

        console.log(colors.bold + 'PR Categories:' + colors.reset);
        Object.entries(categories).forEach(([cat, val]) => {
            if (val) {
                console.log(`  ✓ ${cat}`);
            }
        });
        console.log();

        console.log(colors.bold + 'Applicable Doctrines:' + colors.reset);
        doctrines.forEach(d => {
            console.log(colors.dim + `  • ${d}` + colors.reset);
        });
        console.log();

        if (this.violations.length === 0) {
            console.log(colors.green + '✅ All files passed doctrine validation!' + colors.reset);
        } else {
            console.log(colors.red + `❌ ${this.violations.length} file(s) with violations:` + colors.reset);
            this.violations.forEach(file => {
                console.log(colors.red + `  • ${file}` + colors.reset);
            });
        }

        console.log('\n' + colors.magenta + '═'.repeat(70) + colors.reset + '\n');
    }

    async run() {
        console.log(colors.cyan + '\n🔍 Starting PikaKit PR Audit...\n' + colors.reset);

        this.getChangedFiles();

        if (this.changedFiles.length === 0) {
            console.log(colors.yellow + 'No relevant files changed.' + colors.reset);
            return 0;
        }

        console.log(colors.dim + `Found ${this.changedFiles.length} file(s) to audit\n` + colors.reset);

        await this.auditFiles();
        this.printSummary();

        return this.violations.length > 0 ? 1 : 0;
    }
}

// Main execution
const arg = process.argv[2];

if (!arg) {
    console.error('Usage: node audit_pr.js <branch-name>');
    console.error('       node audit_pr.js --current');
    process.exit(1);
}

let targetBranch;
if (arg === '--current') {
    try {
        targetBranch = execSync('git branch --show-current', { encoding: 'utf-8' }).trim();
    } catch (error) {
        console.error(colors.red + 'Error getting current branch' + colors.reset);
        process.exit(1);
    }
} else {
    targetBranch = arg;
}

const auditor = new PRAuditor(targetBranch);
auditor.run().then(exitCode => {
    process.exit(exitCode);
});
