#!/usr/bin/env node
// @ts-nocheck
import * as fs from 'node:fs';
import * as path from 'node:path';

const VERSION = '1.0.1';
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo']);
const CODE_EXTS = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs']);

const ANTI_PATTERNS = [
    {
        pattern: /localStorage\.setItem\(['"](token|jwt|accessToken|session)['"]/i,
        message: 'Security Risk: JWT/Token stored in localStorage (XSS vulnerability). Use httpOnly secure cookies.',
        severity: 'critical'
    },
    {
        pattern: /sessionStorage\.setItem\(['"](token|jwt|accessToken|session)['"]/i,
        message: 'Security Risk: JWT/Token stored in sessionStorage (XSS vulnerability). Use httpOnly secure cookies.',
        severity: 'critical'
    },
    {
        pattern: /jwt\.sign\([^,]*,?\s*['"][^'"]+['"]\s*(?:,|\))/i,
        message: 'Security Risk: Hardcoded JWT secret detected. Use environment variables.',
        severity: 'critical'
    }
];

function scanDirectory(dir, results) {
    if (!fs.existsSync(dir)) return;

    let entries;
    try {
        entries = fs.readdirSync(dir, { withFileTypes: true });
    } catch (e) {
        return;
    }

    for (const entry of entries) {
        if (SKIP_DIRS.has(entry.name)) continue;
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            scanDirectory(fullPath, results);
        } else if (CODE_EXTS.has(path.extname(entry.name).toLowerCase())) {
            try {
                const content = fs.readFileSync(fullPath, 'utf8');
                let fileIssues = [];

                ANTI_PATTERNS.forEach(rule => {
                    if (rule.pattern.test(content)) {
                        fileIssues.push({ rule: rule.message, severity: rule.severity });
                    }
                });

                if (fileIssues.length > 0) {
                    results.push({ file: path.relative(process.cwd(), fullPath), issues: fileIssues });
                }
            } catch (e) {
                // Ignore read errors for individual files
            }
        }
    }
}

function main() {
    const args = process.argv.slice(2);
    const targetPath = path.resolve(args[0] || '.');

    if (!fs.existsSync(targetPath)) {
        console.log(JSON.stringify({
            status: 'error',
            data: null,
            error: { code: 'ERR_INVALID_PATH', phase: 'setup', message: `Path not found: ${targetPath}` }
        }, null, 2));
        process.exit(1);
    }

    const results = [];
    scanDirectory(targetPath, results);

    const criticalIssuesCount = results.reduce((acc, r) => acc + r.issues.length, 0);

    const data = {
        version: VERSION,
        scannedPath: targetPath,
        timestamp: new Date().toISOString(),
        findings: results,
        summary: { totalFilesWithIssues: results.length, totalIssues: criticalIssuesCount }
    };

    if (criticalIssuesCount > 0) {
        console.log(JSON.stringify({
            status: 'error',
            data,
            error: {
                code: 'ERR_AUTH_VULNERABILITY',
                phase: 'scan',
                message: `Failed Auth Check: Found ${criticalIssuesCount} auth anti-patterns.`
            }
        }, null, 2));
        process.exit(1);
    } else {
        console.log(JSON.stringify({
            status: 'success',
            data,
            error: null
        }, null, 2));
        process.exit(0);
    }
}

try {
    main();
} catch (e) {
    console.log(JSON.stringify({
        status: 'error',
        data: null,
        error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
    }, null, 2));
    process.exit(1);
}
