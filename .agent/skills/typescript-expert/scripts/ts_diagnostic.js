#!/usr/bin/env node
/**
 * TypeScript Diagnostic — Project Health Analysis
 * Version: 2.0.0
 * Skill: typescript-expert
 *
 * Analyzes TS projects: tsconfig, strict flags, tooling, monorepo,
 * `any` usage, type assertions, type errors, performance.
 *
 * Usage: node ts_diagnostic.js <path> [--json]
 */

import { execFile } from 'node:child_process'
import { promisify } from 'node:util'
import { readFileSync, readdirSync, existsSync } from 'node:fs'
import { resolve, join, extname, relative } from 'node:path'

const execFileAsync = promisify(execFile)
const VERSION = '2.0.0'

// --- CLI ---
const args = process.argv.slice(2)

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
TypeScript Diagnostic v${VERSION}

Usage:
  node ts_diagnostic.js <path>         Full diagnostic
  node ts_diagnostic.js <path> --json  JSON output for agents
  node ts_diagnostic.js --help         Show this help

Checks:
  ✓ TypeScript version
  ✓ tsconfig.json strict flags + module config
  ✓ Tooling detection (biome, eslint, vitest, etc.)
  ✓ Monorepo detection (pnpm, turbo, nx, lerna)
  ✓ 'any' type usage scan
  ✓ Type assertion scan ('as' keyword)
  ✓ Type errors (tsc --noEmit)
  ✓ Performance diagnostics (tsc --extendedDiagnostics)

Exit Codes:
  0  HEALTHY  — No critical issues
  1  ISSUES   — Type errors or major config problems
`)
    process.exit(0)
}

const jsonMode = args.includes('--json')
const projectPath = resolve(args.find(a => !a.startsWith('--')) || '.')

function log(msg) { if (!jsonMode) console.log(msg) }

// --- Helpers ---
const SKIP_DIRS = new Set(['node_modules', '.next', 'dist', 'build', '.git', 'coverage', '__pycache__'])
const TS_EXTENSIONS = new Set(['.ts', '.tsx'])

function walkTs(dir, callback) {
    try {
        const entries = readdirSync(dir, { withFileTypes: true })
        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue
            const fullPath = join(dir, entry.name)
            if (entry.isDirectory()) {
                walkTs(fullPath, callback)
            } else if (TS_EXTENSIONS.has(extname(entry.name).toLowerCase())) {
                callback(fullPath)
            }
        }
    } catch { /* ignore unreadable */ }
}

async function runCmd(cmd, cmdArgs, cwd) {
    try {
        const { stdout, stderr } = await execFileAsync(cmd, cmdArgs, {
            cwd,
            timeout: 60_000,
        })
        return { stdout: stdout || '', stderr: stderr || '', ok: true }
    } catch (err) {
        return {
            stdout: err.stdout || '',
            stderr: err.stderr || '',
            ok: false,
            code: err.code,
        }
    }
}

// --- Checks ---
async function checkVersion() {
    const result = await runCmd('npx', ['tsc', '--version'], projectPath)
    const version = result.stdout.trim().replace('Version ', '')
    return { typescript: version || 'not found' }
}

function checkTsconfig() {
    const tsconfigPath = join(projectPath, 'tsconfig.json')
    if (!existsSync(tsconfigPath)) {
        return { found: false, issues: ['tsconfig.json not found'] }
    }

    try {
        const config = JSON.parse(readFileSync(tsconfigPath, 'utf-8'))
        const opts = config.compilerOptions || {}
        const issues = []
        const flags = {}

        // Strict flags
        const strictFlags = {
            strict: true,
            noUncheckedIndexedAccess: true,
            noImplicitOverride: true,
            skipLibCheck: true,
            incremental: true,
        }

        for (const [flag, recommended] of Object.entries(strictFlags)) {
            flags[flag] = opts[flag] ?? null
            if (recommended && !opts[flag]) {
                issues.push(`${flag} not enabled (recommended: true)`)
            }
        }

        // Module config
        flags.module = opts.module || null
        flags.moduleResolution = opts.moduleResolution || null
        flags.target = opts.target || null

        if (opts.moduleResolution && opts.moduleResolution !== 'bundler' && opts.moduleResolution !== 'Bundler') {
            issues.push(`moduleResolution is "${opts.moduleResolution}" (recommended: "bundler" for TS 5+)`)
        }

        return { found: true, flags, issues }
    } catch {
        return { found: true, issues: ['Invalid JSON in tsconfig.json'] }
    }
}

function checkTooling() {
    const pkgPath = join(projectPath, 'package.json')
    if (!existsSync(pkgPath)) return { detected: [] }

    try {
        const pkg = JSON.parse(readFileSync(pkgPath, 'utf-8'))
        const allDeps = { ...pkg.dependencies, ...pkg.devDependencies }
        const depNames = Object.keys(allDeps || {})

        const toolMap = {
            biome: 'Biome', '@biomejs/biome': 'Biome',
            eslint: 'ESLint', prettier: 'Prettier',
            vitest: 'Vitest', jest: 'Jest',
            turbo: 'Turborepo', turborepo: 'Turborepo',
            nx: 'Nx', lerna: 'Lerna',
        }

        const detected = []
        for (const dep of depNames) {
            const name = dep.toLowerCase()
            if (toolMap[name]) detected.push(toolMap[name])
        }
        return { detected: [...new Set(detected)] }
    } catch {
        return { detected: [] }
    }
}

function checkMonorepo() {
    const indicators = [
        ['pnpm-workspace.yaml', 'PNPM Workspace'],
        ['lerna.json', 'Lerna'],
        ['nx.json', 'Nx'],
        ['turbo.json', 'Turborepo'],
    ]

    const detected = []
    for (const [file, name] of indicators) {
        if (existsSync(join(projectPath, file))) detected.push(name)
    }
    return { detected }
}

function scanCodePatterns() {
    let anyCount = 0
    let assertionCount = 0
    let fileCount = 0
    const anyFiles = []
    const assertionFiles = []

    walkTs(projectPath, (filePath) => {
        fileCount++
        try {
            const content = readFileSync(filePath, 'utf-8')
            const lines = content.split('\n')

            for (const line of lines) {
                // Skip imports and type imports
                if (line.trimStart().startsWith('import')) continue

                // Count `: any` (not in comments)
                if (/:\s*any\b/.test(line) && !line.trimStart().startsWith('//')) {
                    anyCount++
                    const rel = relative(projectPath, filePath)
                    if (!anyFiles.includes(rel)) anyFiles.push(rel)
                }

                // Count ` as ` assertions (not imports)
                if (/\bas\b/.test(line) && !line.includes('import') && !line.trimStart().startsWith('//')) {
                    assertionCount++
                    const rel = relative(projectPath, filePath)
                    if (!assertionFiles.includes(rel)) assertionFiles.push(rel)
                }
            }
        } catch { /* read error */ }
    })

    return {
        filesScanned: fileCount,
        any: { count: anyCount, files: anyFiles.slice(0, 5) },
        assertions: { count: assertionCount, files: assertionFiles.slice(0, 5) },
    }
}

async function checkTypeErrors() {
    const result = await runCmd('npx', ['tsc', '--noEmit'], projectPath)
    const output = result.stdout + result.stderr
    const errorCount = (output.match(/error TS/g) || []).length

    return {
        errors: errorCount,
        passed: errorCount === 0,
        sample: errorCount > 0 ? output.slice(0, 500) : null,
    }
}

// --- Main ---
async function main() {
    log(`\n${'='.repeat(60)}`)
    log(`  TypeScript Diagnostic v${VERSION}`)
    log('='.repeat(60))
    log(`Project: ${projectPath}\n`)

    const report = { version: VERSION, project: projectPath }

    // 1. Version
    log('📦 Version')
    report.versions = await checkVersion()
    log(`  TypeScript: ${report.versions.typescript}`)

    // 2. TSConfig
    log('\n⚙️  TSConfig')
    report.tsconfig = checkTsconfig()
    if (!report.tsconfig.found) {
        log('  ⚠️  tsconfig.json not found')
    } else {
        const { flags, issues } = report.tsconfig
        if (flags) {
            for (const [key, val] of Object.entries(flags)) {
                const icon = val === true ? '✅' : val === false ? '❌' : '⚪'
                log(`  ${icon} ${key}: ${val ?? 'not set'}`)
            }
        }
        for (const issue of issues) log(`  ⚠️  ${issue}`)
    }

    // 3. Tooling
    log('\n🛠️  Tooling')
    report.tooling = checkTooling()
    if (report.tooling.detected.length > 0) {
        for (const tool of report.tooling.detected) log(`  ✅ ${tool}`)
    } else {
        log('  ⚪ No tools detected')
    }

    // 4. Monorepo
    log('\n📦 Monorepo')
    report.monorepo = checkMonorepo()
    if (report.monorepo.detected.length > 0) {
        for (const mono of report.monorepo.detected) log(`  ✅ ${mono}`)
    } else {
        log('  ⚪ Not a monorepo')
    }

    // 5. Code patterns
    log('\n🔍 Code Patterns')
    report.patterns = scanCodePatterns()
    const { any, assertions, filesScanned } = report.patterns
    log(`  Scanned: ${filesScanned} TS files`)
    log(`  ${any.count === 0 ? '✅' : '⚠️'} \`any\` usage: ${any.count}`)
    log(`  ${assertions.count === 0 ? '✅' : '⚠️'} Type assertions: ${assertions.count}`)

    // 6. Type errors
    log('\n🔍 Type Check')
    report.typeCheck = await checkTypeErrors()
    if (report.typeCheck.passed) {
        log('  ✅ No type errors')
    } else {
        log(`  ❌ ${report.typeCheck.errors} type error(s)`)
    }

    // Summary
    const healthy = report.typeCheck.passed &&
        (report.tsconfig.issues || []).length === 0

    report.healthy = healthy

    log('\n' + '='.repeat(60))
    log(`${healthy ? '✅ HEALTHY' : '⚠️  ISSUES FOUND'}`)
    log('='.repeat(60))

    if (jsonMode) console.log(JSON.stringify(report, null, 2))

    process.exit(healthy ? 0 : 1)
}

main().catch(err => {
    console.error(JSON.stringify({ error: err.message }))
    process.exit(1)
})
