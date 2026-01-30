#!/usr/bin/env node
/**
 * TypeScript Project Diagnostic Script
 * Analyzes TypeScript projects for configuration, performance, and common issues.
 */

import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

/**
 * Run shell command and return output.
 * @param {string} cmd 
 * @returns {string}
 */
function runCmd(cmd) {
    try {
        return execSync(cmd, { encoding: 'utf-8', stdio: ['pipe', 'pipe', 'pipe'] });
    } catch (e) {
        return e.stdout || e.stderr || e.message;
    }
}

function checkVersions() {
    console.log('\n📦 Versions:');
    console.log('-'.repeat(40));

    const tsVersion = runCmd('npx tsc --version 2>/dev/null').trim();
    const nodeVersion = runCmd('node -v 2>/dev/null').trim();

    console.log(`  TypeScript: ${tsVersion || 'Not found'}`);
    console.log(`  Node.js: ${nodeVersion || 'Not found'}`);
}

function checkTsconfig() {
    console.log('\n⚙️ TSConfig Analysis:');
    console.log('-'.repeat(40));

    const tsconfigPath = 'tsconfig.json';
    if (!fs.existsSync(tsconfigPath)) {
        console.log('⚠️ tsconfig.json not found');
        return;
    }

    try {
        const config = JSON.parse(fs.readFileSync(tsconfigPath, 'utf-8'));
        const compilerOpts = config.compilerOptions || {};

        // Check strict mode
        if (compilerOpts.strict) {
            console.log('✅ Strict mode enabled');
        } else {
            console.log('⚠️ Strict mode NOT enabled');
        }

        // Check important flags
        const flags = {
            noUncheckedIndexedAccess: 'Unchecked index access protection',
            noImplicitOverride: 'Implicit override protection',
            skipLibCheck: 'Skip lib check (performance)',
            incremental: 'Incremental compilation'
        };

        for (const [flag, desc] of Object.entries(flags)) {
            const status = compilerOpts[flag] ? '✅' : '⚪';
            console.log(`  ${status} ${desc}: ${compilerOpts[flag] ?? 'not set'}`);
        }

        // Check module settings
        console.log(`\n  Module: ${compilerOpts.module || 'not set'}`);
        console.log(`  Module Resolution: ${compilerOpts.moduleResolution || 'not set'}`);
        console.log(`  Target: ${compilerOpts.target || 'not set'}`);

    } catch (e) {
        console.log('❌ Invalid JSON in tsconfig.json');
    }
}

function checkTooling() {
    console.log('\n🛠️ Tooling Detection:');
    console.log('-'.repeat(40));

    const pkgPath = 'package.json';
    if (!fs.existsSync(pkgPath)) {
        console.log('⚠️ package.json not found');
        return;
    }

    try {
        const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies };

        const tools = {
            biome: 'Biome (linter/formatter)',
            eslint: 'ESLint',
            prettier: 'Prettier',
            vitest: 'Vitest (testing)',
            jest: 'Jest (testing)',
            turborepo: 'Turborepo (monorepo)',
            turbo: 'Turbo (monorepo)',
            nx: 'Nx (monorepo)',
            lerna: 'Lerna (monorepo)'
        };

        for (const [tool, desc] of Object.entries(tools)) {
            for (const dep of Object.keys(allDeps || {})) {
                if (dep.toLowerCase().includes(tool)) {
                    console.log(`  ✅ ${desc}`);
                    break;
                }
            }
        }
    } catch (e) {
        console.log('❌ Invalid JSON in package.json');
    }
}

function checkMonorepo() {
    console.log('\n📦 Monorepo Check:');
    console.log('-'.repeat(40));

    const indicators = [
        ['pnpm-workspace.yaml', 'PNPM Workspace'],
        ['lerna.json', 'Lerna'],
        ['nx.json', 'Nx'],
        ['turbo.json', 'Turborepo']
    ];

    let found = false;
    for (const [file, name] of indicators) {
        if (fs.existsSync(file)) {
            console.log(`  ✅ ${name} detected`);
            found = true;
        }
    }

    if (!found) {
        console.log('  ⚪ No monorepo configuration detected');
    }
}

function checkTypeErrors() {
    console.log('\n🔍 Type Check:');
    console.log('-'.repeat(40));

    const result = runCmd('npx tsc --noEmit 2>&1');
    if (result.includes('error TS')) {
        const errors = (result.match(/error TS/g) || []).length;
        console.log(`  ❌ ${errors}+ type errors found`);
        console.log(result.slice(0, 500));
    } else {
        console.log('  ✅ No type errors');
    }
}

function checkAnyUsage() {
    console.log("\n⚠️ 'any' Type Usage:");
    console.log('-'.repeat(40));

    try {
        const result = runCmd("grep -r ': any' --include='*.ts' --include='*.tsx' src/ 2>/dev/null | wc -l");
        const count = result.trim();
        if (count && count !== '0') {
            console.log(`  ⚠️ Found ${count} occurrences of ': any'`);
            const sample = runCmd("grep -rn ': any' --include='*.ts' --include='*.tsx' src/ 2>/dev/null | head -5");
            if (sample) console.log(sample);
        } else {
            console.log("  ✅ No explicit 'any' types found");
        }
    } catch {
        console.log("  ⚪ Could not check (grep not available on Windows)");
    }
}

function checkTypeAssertions() {
    console.log('\n⚠️ Type Assertions (as):');
    console.log('-'.repeat(40));

    try {
        const result = runCmd("grep -r ' as ' --include='*.ts' --include='*.tsx' src/ 2>/dev/null | grep -v 'import' | wc -l");
        const count = result.trim();
        if (count && count !== '0') {
            console.log(`  ⚠️ Found ${count} type assertions`);
        } else {
            console.log('  ✅ No type assertions found');
        }
    } catch {
        console.log('  ⚪ Could not check (grep not available on Windows)');
    }
}

function checkPerformance() {
    console.log('\n⏱️ Type Check Performance:');
    console.log('-'.repeat(40));

    const result = runCmd('npx tsc --extendedDiagnostics --noEmit 2>&1');
    const lines = result.split('\n').filter(line =>
        /Check time|Files:|Lines:|Nodes:/.test(line)
    );

    if (lines.length > 0) {
        lines.forEach(line => console.log(`  ${line}`));
    } else {
        console.log('  ⚠️ Could not measure performance');
    }
}

function main() {
    console.log('='.repeat(50));
    console.log('🔍 TypeScript Project Diagnostic Report');
    console.log('='.repeat(50));

    checkVersions();
    checkTsconfig();
    checkTooling();
    checkMonorepo();
    checkAnyUsage();
    checkTypeAssertions();
    checkTypeErrors();
    checkPerformance();

    console.log('\n' + '='.repeat(50));
    console.log('✅ Diagnostic Complete');
    console.log('='.repeat(50));
}

main();
