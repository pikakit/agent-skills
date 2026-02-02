#!/usr/bin/env node
/**
 * Test Runner - Unified test execution and coverage reporting
 * Runs tests and generates coverage report based on project type.
 *
 * Usage:
 *     node test_runner.js <project_path> [--coverage]
 *
 * Supports:
 *     - Node.js: npm test, jest, vitest
 *     - Python: pytest, unittest
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

function detectTestFramework(projectPath) {
    /**
     * Detect test framework and commands.
     */
    const result = {
        type: 'unknown',
        framework: null,
        cmd: null,
        coverage_cmd: null
    };

    // Node.js project
    const packageJsonPath = resolve(projectPath, 'package.json');
    if (existsSync(packageJsonPath)) {
        result.type = 'node';
        try {
            const pkg = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));
            const scripts = pkg.scripts || {};
            const deps = { ...pkg.dependencies, ...pkg.devDependencies };

            // Check for test script
            if (scripts.test) {
                result.framework = 'npm test';
                result.cmd = ['npm', 'test'];

                // Try to detect specific framework for coverage
                if (deps.vitest) {
                    result.framework = 'vitest';
                    result.coverage_cmd = ['npx', 'vitest', 'run', '--coverage'];
                } else if (deps.jest) {
                    result.framework = 'jest';
                    result.coverage_cmd = ['npx', 'jest', '--coverage'];
                }
            } else if (deps.vitest) {
                result.framework = 'vitest';
                result.cmd = ['npx', 'vitest', 'run'];
                result.coverage_cmd = ['npx', 'vitest', 'run', '--coverage'];
            } else if (deps.jest) {
                result.framework = 'jest';
                result.cmd = ['npx', 'jest'];
                result.coverage_cmd = ['npx', 'jest', '--coverage'];
            }
        } catch {
            // Parse error
        }
    }

    // Python project
    if (existsSync(resolve(projectPath, 'pyproject.toml')) ||
        existsSync(resolve(projectPath, 'requirements.txt'))) {
        result.type = 'python';
        result.framework = 'pytest';
        result.cmd = ['python', '-m', 'pytest', '-v'];
        result.coverage_cmd = ['python', '-m', 'pytest', '--cov', '--cov-report=term-missing'];
    }

    return result;
}

function runTests(cmd, cwd) {
    /**
     * Run tests and return results.
     */
    const result = {
        passed: false,
        output: '',
        error: '',
        tests_run: 0,
        tests_passed: 0,
        tests_failed: 0
    };

    try {
        const output = execSync(cmd.join(' '), {
            cwd: cwd,
            encoding: 'utf-8',
            timeout: 300000, // 5 min timeout for tests
            stdio: ['pipe', 'pipe', 'pipe']
        });

        result.output = output.slice(0, 3000);
        result.passed = true;

        // Try to parse test counts from output
        parseTestCounts(result, output, cmd);
    } catch (err) {
        if (err.stdout) {
            result.output = err.stdout.slice(0, 3000);
            parseTestCounts(result, err.stdout, cmd);
        }
        if (err.stderr) {
            result.error = err.stderr.slice(0, 500);
        }
        if (err.status !== undefined) {
            result.passed = err.status === 0;
        }
        if (err.code === 'ENOENT') {
            result.error = `Command not found: ${cmd[0]}`;
        }
        if (err.code === 'ETIMEDOUT') {
            result.error = 'Timeout after 300s';
        }
    }

    return result;
}

function parseTestCounts(result, output, cmd) {
    // Jest/Vitest pattern: "X passed, Y failed"
    const passedMatch = output.match(/(\d+)\s+passed/i);
    const failedMatch = output.match(/(\d+)\s+failed/i);

    if (passedMatch) {
        result.tests_passed = parseInt(passedMatch[1], 10);
    }
    if (failedMatch) {
        result.tests_failed = parseInt(failedMatch[1], 10);
    }
    result.tests_run = result.tests_passed + result.tests_failed;
}

function main() {
    const args = process.argv.slice(2);
    const projectPath = resolve(args.find(a => !a.startsWith('--')) || '.');
    const withCoverage = args.includes('--coverage');

    console.log(`\n${'='.repeat(60)}`);
    console.log('[TEST RUNNER] Unified Test Execution');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Coverage: ${withCoverage ? 'enabled' : 'disabled'}`);
    console.log(`Time: ${new Date().toISOString()}`);

    // Detect test framework
    const testInfo = detectTestFramework(projectPath);
    console.log(`Type: ${testInfo.type}`);
    console.log(`Framework: ${testInfo.framework}`);
    console.log('-'.repeat(60));

    if (!testInfo.cmd) {
        console.log('No test framework found for this project.');
        const output = {
            script: 'test_runner',
            project: projectPath,
            type: testInfo.type,
            framework: null,
            passed: true,
            message: 'No tests configured'
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    // Choose command
    const cmd = withCoverage && testInfo.coverage_cmd ? testInfo.coverage_cmd : testInfo.cmd;

    console.log(`Running: ${cmd.join(' ')}`);
    console.log('-'.repeat(60));

    // Run tests
    const result = runTests(cmd, projectPath);

    // Print output (truncated)
    if (result.output) {
        const lines = result.output.split('\n');
        lines.slice(0, 30).forEach(line => console.log(line));
        if (lines.length > 30) {
            console.log(`... (${lines.length - 30} more lines)`);
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SUMMARY');
    console.log('='.repeat(60));

    if (result.passed) {
        console.log('[PASS] All tests passed');
    } else {
        console.log('[FAIL] Some tests failed');
        if (result.error) {
            console.log(`Error: ${result.error.slice(0, 200)}`);
        }
    }

    if (result.tests_run > 0) {
        console.log(`Tests: ${result.tests_run} total, ${result.tests_passed} passed, ${result.tests_failed} failed`);
    }

    const output = {
        script: 'test_runner',
        project: projectPath,
        type: testInfo.type,
        framework: testInfo.framework,
        tests_run: result.tests_run,
        tests_passed: result.tests_passed,
        tests_failed: result.tests_failed,
        passed: result.passed
    };

    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(result.passed ? 0 : 1);
}

main();
