#!/usr/bin/env node
// @ts-nocheck
/**
 * Test Runner — Unified Test Execution & Coverage
 * Version: 2.0.0
 * Skill: test-architect
 *
 * Auto-detects framework (vitest/jest/pytest), runs tests,
 * parses results + coverage, validates threshold.
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync, existsSync } from 'node:fs'
import { resolve } from 'node:path'

const execFileAsync = promisify(execFile)
const VERSION = '2.0.0'

// --- CLI ---
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
Test Runner v${VERSION}

Usage:
  node test_runner.js <path>                    Run tests
  node test_runner.js <path> --coverage         Run with coverage
  node test_runner.js <path> --threshold=80     Coverage threshold (default: 80)
  node test_runner.js <path> --json             JSON output only
  node test_runner.js --help                    Show this help

Options:
  --coverage        Enable coverage reporting
  --threshold=N     Minimum coverage % (default: 80, per SKILL.md)
  --json            JSON output for agent consumption
  --help, -h        Show this help

Supported Frameworks:
  Node.js   vitest, jest, npm test
  Python    pytest, unittest

Exit Codes:
  0  PASS       — All tests pass (+ coverage met if --coverage)
  1  FAIL       — Tests failed
  2  THRESHOLD  — Tests pass but coverage below threshold
  3  ERROR      — Script error (no framework, timeout, etc.)
`)
    process.exit(0)
}

const jsonOutput = args.includes('--json')
const withCoverage = args.includes('--coverage')
const thresholdArg = args.find(a => a.startsWith('--threshold'))
const threshold = thresholdArg ? parseInt(thresholdArg.split('=')[1], 10) : 80
const projectPath = resolve(args.find(a => !a.startsWith('--')) || '.')

function log(msg) { if (!jsonOutput) console.log(msg) }

// --- Framework Detection ---
function detectFramework(projectPath) {
    const result = { type: 'unknown', framework: null, cmd: null, coverageCmd: null }

    // Node.js
    const pkgPath = resolve(projectPath, 'package.json')
    if (existsSync(pkgPath)) {
        result.type = 'node'
        try {
            const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
            const scripts = pkg.scripts || {}
            const deps = { ...pkg.dependencies, ...pkg.devDependencies }

            if (deps.vitest) {
                result.framework = 'vitest'
                result.cmd = ['npx', 'vitest', 'run']
                result.coverageCmd = ['npx', 'vitest', 'run', '--coverage']
            } else if (deps.jest) {
                result.framework = 'jest'
                result.cmd = ['npx', 'jest']
                result.coverageCmd = ['npx', 'jest', '--coverage']
            } else if (scripts.test && scripts.test !== 'echo "Error: no test specified" && exit 1') {
                result.framework = 'npm test'
                result.cmd = ['npm', 'test']
            }
        } catch { /* parse error */ }
    }

    // Python
    if (existsSync(resolve(projectPath, 'pyproject.toml')) ||
        existsSync(resolve(projectPath, 'requirements.txt')) ||
        existsSync(resolve(projectPath, 'setup.py'))) {
        result.type = 'python'
        result.framework = 'pytest'
        result.cmd = ['python', '-m', 'pytest', '-v']
        result.coverageCmd = ['python', '-m', 'pytest', '--cov', '--cov-report=term-missing']
    }

    return result
}

// --- Test Parsing ---
function parseTestCounts(output) {
    let passed = 0, failed = 0, skipped = 0

    // Vitest/Jest: "X passed", "X failed"
    const passMatch = output.match(/(\d+)\s+passed/i)
    const failMatch = output.match(/(\d+)\s+failed/i)
    const skipMatch = output.match(/(\d+)\s+skipped/i)

    if (passMatch) passed = parseInt(passMatch[1], 10)
    if (failMatch) failed = parseInt(failMatch[1], 10)
    if (skipMatch) skipped = parseInt(skipMatch[1], 10)

    // Pytest: "X passed, Y failed"
    const pytestMatch = output.match(/(\d+)\s+passed(?:.*?(\d+)\s+failed)?/i)
    if (pytestMatch && !passMatch) {
        passed = parseInt(pytestMatch[1], 10)
        if (pytestMatch[2]) failed = parseInt(pytestMatch[2], 10)
    }

    return { passed, failed, skipped, total: passed + failed + skipped }
}

function parseCoverage(output) {
    // Vitest/Jest: "All files  |   85.3 |"
    const allFilesMatch = output.match(/All files\s*\|\s*([\d.]+)/i)
    if (allFilesMatch) return parseFloat(allFilesMatch[1])

    // Jest: "Statements   : 85.3%"
    const statementsMatch = output.match(/Statements\s*:\s*([\d.]+)%/i)
    if (statementsMatch) return parseFloat(statementsMatch[1])

    // Pytest: "TOTAL    xxx   xxx    85%"
    const pytestMatch = output.match(/TOTAL\s+\d+\s+\d+\s+(\d+)%/i)
    if (pytestMatch) return parseInt(pytestMatch[1], 10)

    return null
}

// --- Run Tests ---
async function runTests(cmd, cwd) {
    const result = {
        passed: false,
        output: '',
        error: '',
        tests: { passed: 0, failed: 0, skipped: 0, total: 0 },
        coverage: null,
    }

    try {
        const { stdout, stderr } = await execFileAsync(cmd[0], cmd.slice(1), {
            cwd,
            timeout: 300_000, // 5 min
        })

        result.output = stdout.slice(0, 5000)
        result.passed = true
        result.tests = parseTestCounts(stdout)
        result.coverage = parseCoverage(stdout + (stderr || ''))
    } catch (err) {
        const stdout = err.stdout || ''
        const stderr = err.stderr || ''
        result.output = stdout.slice(0, 5000)
        result.error = stderr.slice(0, 500)
        result.tests = parseTestCounts(stdout)
        result.coverage = parseCoverage(stdout + stderr)

        if (err.code === 'ENOENT') {
            result.error = `Command not found: ${cmd[0]}`
        } else if (err.killed) {
            result.error = 'Timeout after 300s'
        } else {
            // Tests failed but ran successfully
            result.passed = result.tests.failed === 0 && result.tests.total > 0
        }
    }

    return result
}

// --- Main ---
async function main() {
    log(`\n${'='.repeat(60)}`)
    log(`  Test Runner v${VERSION}`)
    log('='.repeat(60))
    log(`Project: ${projectPath}`)
    log(`Coverage: ${withCoverage ? `enabled (threshold: ${threshold}%)` : 'disabled'}`)

    const info = detectFramework(projectPath)
    log(`Type: ${info.type} | Framework: ${info.framework}`)
    log('-'.repeat(60))

    if (!info.cmd) {
        log('\n[!] No test framework detected.')
        const output = {
            version: VERSION,
            project: projectPath,
            framework: null,
            passed: false,
            error: 'No test framework found',
        }
        if (jsonOutput) console.log(JSON.stringify(output, null, 2))
        process.exit(3)
    }

    const cmd = withCoverage && info.coverageCmd ? info.coverageCmd : info.cmd
    log(`Running: ${cmd.join(' ')}\n`)

    const result = await runTests(cmd, projectPath)

    // Print output (truncated)
    if (!jsonOutput && result.output) {
        const lines = result.output.split('\n')
        lines.slice(0, 30).forEach(line => log(line))
        if (lines.length > 30) log(`... (${lines.length - 30} more lines)`)
    }

    // Summary
    log('\n' + '='.repeat(60))
    log('SUMMARY')
    log('='.repeat(60))

    const { tests, coverage } = result

    if (result.passed) {
        log(`✅ PASS — ${tests.passed} passed, ${tests.failed} failed, ${tests.skipped} skipped`)
    } else {
        log(`❌ FAIL — ${tests.passed} passed, ${tests.failed} failed`)
        if (result.error) log(`   Error: ${result.error.slice(0, 200)}`)
    }

    // Coverage threshold check
    let coverageMet = true
    if (withCoverage && coverage !== null) {
        const status = coverage >= threshold ? '✅' : '❌'
        log(`${status} Coverage: ${coverage}% (threshold: ${threshold}%)`)
        coverageMet = coverage >= threshold
    } else if (withCoverage) {
        log('⚠️  Coverage: could not parse from output')
    }

    // JSON output
    const output = {
        version: VERSION,
        project: projectPath,
        type: info.type,
        framework: info.framework,
        tests,
        coverage: withCoverage ? { percentage: coverage, threshold, met: coverageMet } : undefined,
        passed: result.passed && coverageMet,
    }

    if (jsonOutput) console.log(JSON.stringify(output, null, 2))

    // Exit codes: 0=pass, 1=fail, 2=threshold, 3=error
    if (!result.passed) process.exit(1)
    if (!coverageMet) process.exit(2)
    process.exit(0)
}

main().catch(err => {
    console.error(JSON.stringify({ error: err.message }))
    process.exit(3)
})
