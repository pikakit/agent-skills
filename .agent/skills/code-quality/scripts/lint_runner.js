#!/usr/bin/env node
/**
 * Lint Runner - Unified linting and type checking
 * Runs appropriate linters based on project type.
 *
 * Usage:
 *     node lint_runner.js <project_path>
 *
 * Supports:
 *     - Node.js: npm run lint, npx tsc --noEmit
 *     - Python: ruff check, mypy
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function detectProjectType(projectPath) {
    /**
     * Detect project type and available linters.
     */
    const result = {
        type: 'unknown',
        linters: []
    };

    // Node.js project
    const packageJsonPath = resolve(projectPath, 'package.json');
    if (existsSync(packageJsonPath)) {
        result.type = 'node';
        try {
            const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
            const scripts = pkg.scripts || {};
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };

            // Check for lint script
            if (scripts.lint) {
                result.linters.push({ name: 'npm lint', cmd: ['npm', 'run', 'lint'] });
            } else if (deps.eslint) {
                result.linters.push({ name: 'eslint', cmd: ['npx', 'eslint', '.'] });
            }

            // Check for TypeScript
            if (deps.typescript || existsSync(resolve(projectPath, 'tsconfig.json'))) {
                result.linters.push({ name: 'tsc', cmd: ['npx', 'tsc', '--noEmit'] });
            }
        } catch {
            // Parse error
        }
    }

    // Python project
    if (existsSync(resolve(projectPath, 'pyproject.toml')) ||
        existsSync(resolve(projectPath, 'requirements.txt'))) {
        result.type = 'python';
        result.linters.push({ name: 'ruff', cmd: ['ruff', 'check', '.'] });

        if (existsSync(resolve(projectPath, 'mypy.ini')) ||
            existsSync(resolve(projectPath, 'pyproject.toml'))) {
            result.linters.push({ name: 'mypy', cmd: ['mypy', '.'] });
        }
    }

    return result;
}

function runLinter(linter, cwd) {
    /**
     * Run a single linter and return results.
     */
    const result = {
        name: linter.name,
        passed: false,
        output: '',
        error: ''
    };

    try {
        const output = execSync(linter.cmd.join(' '), {
            cwd: cwd,
            encoding: 'utf-8',
            timeout: 120000,
            stdio: ['pipe', 'pipe', 'pipe']
        });

        result.output = output.slice(0, 2000);
        result.passed = true;
    } catch (err) {
        if (err.stdout) {
            result.output = err.stdout.slice(0, 2000);
        }
        if (err.stderr) {
            result.error = err.stderr.slice(0, 500);
        }
        if (err.status !== undefined) {
            result.passed = err.status === 0;
        }
        if (err.code === 'ENOENT') {
            result.error = `Command not found: ${linter.cmd[0]}`;
        }
        if (err.code === 'ETIMEDOUT') {
            result.error = 'Timeout after 120s';
        }
    }

    return result;
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log(`\n${'='.repeat(60)}`);
    console.log('[LINT RUNNER] Unified Linting');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);

    // Detect project type
    const projectInfo = detectProjectType(projectPath);
    console.log(`Type: ${projectInfo.type}`);
    console.log(`Linters: ${projectInfo.linters.length}`);
    console.log('-'.repeat(60));

    if (projectInfo.linters.length === 0) {
        console.log('No linters found for this project type.');
        const output = {
            script: 'lint_runner',
            project: projectPath,
            type: projectInfo.type,
            checks: [],
            passed: true,
            message: 'No linters configured'
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    // Run each linter
    const results = [];
    let allPassed = true;

    for (const linter of projectInfo.linters) {
        console.log(`\nRunning: ${linter.name}...`);
        const result = runLinter(linter, projectPath);
        results.push(result);

        if (result.passed) {
            console.log(`  [PASS] ${linter.name}`);
        } else {
            console.log(`  [FAIL] ${linter.name}`);
            if (result.error) {
                console.log(`  Error: ${result.error.slice(0, 200)}`);
            }
            allPassed = false;
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    for (const r of results) {
        const icon = r.passed ? '[PASS]' : '[FAIL]';
        console.log(`${icon} ${r.name}`);
    }

    const output = {
        script: 'lint_runner',
        project: projectPath,
        type: projectInfo.type,
        checks: results,
        passed: allPassed
    };

    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(allPassed ? 0 : 1);
}

main();
