#!/usr/bin/env node
/**
 * API Validator — Checks API endpoints for best practices.
 * Validates OpenAPI specs, response formats, and common issues.
 *
 * Usage: node api_validator.js <project_path> [--json] [--help] [--version]
 *
 * @version 2.0.0
 * @skill api-architect
 */

import { readFile, readdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { resolve, relative, extname } from 'node:path';

const VERSION = '2.0.0';

const HELP = `
API Validator v${VERSION}
Checks API endpoints for best practices.

Usage:
  node api_validator.js <project_path>        Validate API files
  node api_validator.js <project_path> --json  Output JSON
  node api_validator.js --help                 Show help
  node api_validator.js --version              Show version

Checks:
  - OpenAPI/Swagger spec validation (JSON + YAML)
  - Error handling patterns
  - HTTP status code usage
  - Input validation (Zod, Joi, Yup)
  - Authentication/authorization
  - Rate limiting
  - API versioning
  - CORS configuration
  - Pagination support
  - Structured logging
`.trim();

const SKIP_DIRS = new Set([
    'node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo',
]);

const API_PATTERNS = [/api/i, /routes/i, /controllers/i, /endpoints/i, /openapi/i, /swagger/i];
const CODE_EXTENSIONS = new Set(['.ts', '.js', '.mts', '.mjs', '.json', '.yaml', '.yml']);

// --- File Discovery ---

async function findApiFiles(projectPath, maxFiles = 15) {
    const files = [];

    async function walk(dir) {
        let entries;
        try {
            entries = await readdir(dir, { withFileTypes: true });
        } catch (err) {
            // Permission denied or other I/O error — skip gracefully
            if (err.code !== 'ENOENT' && err.code !== 'EACCES') {
                console.error(`[WARN] Cannot read directory: ${dir} (${err.code})`);
            }
            return;
        }

        for (const entry of entries) {
            if (files.length >= maxFiles) return;
            if (SKIP_DIRS.has(entry.name)) continue;

            const fullPath = resolve(dir, entry.name);

            if (entry.isDirectory()) {
                await walk(fullPath);
            } else {
                const ext = extname(entry.name).toLowerCase();
                if (CODE_EXTENSIONS.has(ext)) {
                    if (API_PATTERNS.some(p => p.test(entry.name) || p.test(fullPath))) {
                        files.push(fullPath);
                    }
                }
            }
        }
    }

    await walk(projectPath);
    return files;
}

// --- OpenAPI Spec Validation ---

async function checkOpenApiSpec(filePath) {
    const issues = [];
    const passed = [];

    try {
        const content = await readFile(filePath, 'utf-8');

        if (filePath.endsWith('.json')) {
            const spec = JSON.parse(content);

            // Version check
            if (spec.openapi) {
                passed.push(`[OK] OpenAPI ${spec.openapi} detected`);
            } else if (spec.swagger) {
                passed.push(`[OK] Swagger ${spec.swagger} detected (consider upgrading to OpenAPI 3.x)`);
            } else {
                issues.push('[X] No OpenAPI/Swagger version defined');
            }

            // Info section
            if (spec.info) {
                if (spec.info.title) passed.push('[OK] API title defined');
                else issues.push('[X] API title missing');
                if (spec.info.version) passed.push('[OK] API version defined');
                else issues.push('[X] API version missing');
                if (!spec.info.description) issues.push('[!] API description missing');
            } else {
                issues.push('[X] Info section missing');
            }

            // Paths
            if (spec.paths) {
                const pathCount = Object.keys(spec.paths).length;
                passed.push(`[OK] ${pathCount} endpoint(s) defined`);

                for (const [path, methods] of Object.entries(spec.paths)) {
                    // Check for verb-based endpoints
                    if (/\/(get|create|update|delete|fetch|remove)/i.test(path)) {
                        issues.push(`[!] ${path}: Uses verb in path — prefer resource nouns`);
                    }

                    for (const [method, details] of Object.entries(methods)) {
                        if (!['get', 'post', 'put', 'patch', 'delete'].includes(method)) continue;
                        if (!details.responses) {
                            issues.push(`[X] ${method.toUpperCase()} ${path}: No responses defined`);
                        }
                        if (!details.summary && !details.description) {
                            issues.push(`[!] ${method.toUpperCase()} ${path}: No summary/description`);
                        }
                        if (!details.operationId) {
                            issues.push(`[!] ${method.toUpperCase()} ${path}: No operationId`);
                        }
                    }
                }
            } else {
                issues.push('[X] No paths section');
            }

            // Components / security
            if (spec.components?.securitySchemes) {
                passed.push('[OK] Security schemes defined');
            } else {
                issues.push('[!] No security schemes defined');
            }
        } else {
            // YAML — basic string checks (no external YAML parser dependency)
            if (/^openapi:\s/m.test(content)) {
                passed.push('[OK] OpenAPI version defined');
            } else if (/^swagger:\s/m.test(content)) {
                passed.push('[OK] Swagger version defined (consider upgrading to OpenAPI 3.x)');
            } else {
                issues.push('[X] No OpenAPI/Swagger version found');
            }

            if (/^paths:/m.test(content)) passed.push('[OK] Paths section exists');
            else issues.push('[X] No paths defined');

            if (/^components:/m.test(content) || /^definitions:/m.test(content)) {
                passed.push('[OK] Schema components defined');
            }

            if (/securitySchemes:/m.test(content)) {
                passed.push('[OK] Security schemes defined');
            }
        }
    } catch (err) {
        issues.push(`[X] Parse error: ${err.message}`);
    }

    return { file: filePath, passed, issues, type: 'openapi' };
}

// --- API Code Validation ---

async function checkApiCode(filePath) {
    const issues = [];
    const passed = [];

    try {
        const content = await readFile(filePath, 'utf-8');

        // Error handling
        if (/try\s*\{/.test(content) || /\.catch\(/.test(content) || /catch\s*\(/.test(content)) {
            passed.push('[OK] Error handling present');
        } else {
            issues.push('[X] No error handling found');
        }

        // HTTP status codes
        if (/\.status\(\d{3}\)/.test(content) || /statusCode\s*[=:]\s*\d{3}/.test(content) || /HttpStatus\./.test(content)) {
            passed.push('[OK] HTTP status codes used');
        } else {
            issues.push('[!] No explicit HTTP status codes');
        }

        // Input validation
        if (/\b(zod|z\.object|z\.string|joi|yup|class-validator)\b/i.test(content)) {
            passed.push('[OK] Input validation library detected');
        } else if (/validate/i.test(content) || /schema/i.test(content)) {
            passed.push('[OK] Validation patterns detected');
        } else {
            issues.push('[!] No input validation detected');
        }

        // Auth
        if (/\b(auth|jwt|bearer|middleware|guard)\b/i.test(content)) {
            passed.push('[OK] Authentication/authorization detected');
        }

        // Rate limiting
        if (/\b(rateLimit|throttle|rate.limit)\b/i.test(content)) {
            passed.push('[OK] Rate limiting present');
        }

        // Structured logging (not console.log)
        if (/\b(logger|winston|pino|bunyan)\b/i.test(content)) {
            passed.push('[OK] Structured logging detected');
        } else if (/console\.(log|error|warn)/.test(content)) {
            issues.push('[!] Uses console.log — consider structured logging (pino, winston)');
        }

        // API versioning
        if (/\/v\d+\//i.test(content) || /api-version/i.test(content) || /\/api\/v\d/i.test(content)) {
            passed.push('[OK] API versioning detected');
        } else {
            issues.push('[!] No API versioning detected');
        }

        // Pagination
        if (/\b(paginate|cursor|offset|per_page)\b/i.test(content) || /page\s*[=:]/i.test(content)) {
            passed.push('[OK] Pagination support detected');
        }

        // CORS
        if (/\b(cors)\b/i.test(content) || /access-control-allow/i.test(content)) {
            passed.push('[OK] CORS configuration detected');
        } else {
            issues.push('[!] No CORS configuration detected');
        }

        // Response envelope
        if (/\b(success|ApiResponse|envelope)\b/i.test(content)) {
            passed.push('[OK] Response envelope pattern detected');
        }

    } catch (err) {
        issues.push(`[X] Read error: ${err.message}`);
    }

    return { file: filePath, passed, issues, type: 'code' };
}

// --- Output Formatting ---

function printResults(results, projectPath) {
    console.log('\n' + '='.repeat(60));
    console.log('  API VALIDATOR v' + VERSION + ' — Endpoint Best Practices');
    console.log('='.repeat(60) + '\n');

    let totalIssues = 0;
    let totalWarnings = 0;
    let totalPassed = 0;

    for (const result of results) {
        console.log(`\n[FILE] ${relative(projectPath, result.file)} [${result.type}]`);
        for (const item of result.passed) {
            console.log(`   ${item}`);
            totalPassed++;
        }
        for (const item of result.issues) {
            console.log(`   ${item}`);
            if (item.startsWith('[X]')) totalIssues++;
            else if (item.startsWith('[!]')) totalWarnings++;
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[RESULTS] ${totalPassed} passed, ${totalWarnings} warnings, ${totalIssues} critical`);
    console.log('='.repeat(60));

    if (totalIssues === 0) {
        console.log('[OK] API validation passed');
    } else {
        console.log('[X] Fix critical issues before deployment');
    }

    return totalIssues;
}

function jsonResults(results, projectPath) {
    return {
        version: VERSION,
        projectPath,
        timestamp: new Date().toISOString(),
        files: results.map(r => ({
            file: relative(projectPath, r.file),
            type: r.type,
            passed: r.passed.length,
            issues: r.issues.filter(i => i.startsWith('[X]')).length,
            warnings: r.issues.filter(i => i.startsWith('[!]')).length,
            details: { passed: r.passed, issues: r.issues },
        })),
        summary: {
            totalFiles: results.length,
            totalPassed: results.reduce((s, r) => s + r.passed.length, 0),
            totalIssues: results.reduce((s, r) => s + r.issues.filter(i => i.startsWith('[X]')).length, 0),
            totalWarnings: results.reduce((s, r) => s + r.issues.filter(i => i.startsWith('[!]')).length, 0),
        },
    };
}

// --- Main ---

async function main() {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        console.log(HELP);
        process.exit(0);
    }

    if (args.includes('--version') || args.includes('-v')) {
        console.log(VERSION);
        process.exit(0);
    }

    const isJson = args.includes('--json');
    const projectPath = resolve(args.find(a => !a.startsWith('-')) || '.');

    if (!existsSync(projectPath)) {
        console.error(`[ERROR] Path does not exist: ${projectPath}`);
        process.exit(1);
    }

    const apiFiles = await findApiFiles(projectPath);

    if (apiFiles.length === 0) {
        if (isJson) {
            console.log(JSON.stringify({ version: VERSION, files: [], summary: { totalFiles: 0 } }, null, 2));
        } else {
            console.log('[!] No API files found.');
            console.log('    Looking for: routes/, controllers/, api/, openapi.json/yaml');
        }
        process.exit(0);
    }

    const results = [];
    for (const filePath of apiFiles) {
        const basename = filePath.split(/[/\\]/).pop().toLowerCase();
        if (basename.includes('openapi') || basename.includes('swagger')) {
            results.push(await checkOpenApiSpec(filePath));
        } else {
            results.push(await checkApiCode(filePath));
        }
    }

    if (isJson) {
        console.log(JSON.stringify(jsonResults(results, projectPath), null, 2));
        const criticalCount = results.reduce((s, r) => s + r.issues.filter(i => i.startsWith('[X]')).length, 0);
        process.exit(criticalCount > 0 ? 1 : 0);
    } else {
        const criticalCount = printResults(results, projectPath);
        process.exit(criticalCount > 0 ? 1 : 0);
    }
}

main().catch(err => {
    console.error(`[FATAL] ${err.message}`);
    process.exit(1);
});
