#!/usr/bin/env node
/**
 * API Validator - Checks API endpoints for best practices.
 * Validates OpenAPI specs, response formats, and common issues.
 */

import { readFileSync, existsSync, readdirSync, statSync } from 'fs';
import { resolve, relative, extname } from 'path';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__']);

function findApiFiles(projectPath) {
    const patterns = [
        /api/i, /routes/i, /controllers/i, /endpoints/i,
        /openapi/i, /swagger/i
    ];

    const files = [];

    function walk(dir) {
        try {
            const entries = readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (SKIP_DIRS.has(entry.name)) continue;
                const fullPath = resolve(dir, entry.name);

                if (entry.isDirectory()) {
                    walk(fullPath);
                } else {
                    const ext = extname(entry.name).toLowerCase();
                    if (['.ts', '.js', '.json', '.yaml', '.yml'].includes(ext)) {
                        if (patterns.some(p => p.test(entry.name) || p.test(fullPath))) {
                            files.push(fullPath);
                        }
                    }
                }
            }
        } catch { /* ignore */ }
    }

    walk(projectPath);
    return files.slice(0, 15);
}

function checkOpenApiSpec(filePath) {
    const issues = [];
    const passed = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        if (filePath.endsWith('.json')) {
            const spec = JSON.parse(content);

            if (spec.openapi || spec.swagger) {
                passed.push('[OK] OpenAPI version defined');
            }

            if (spec.info) {
                if (spec.info.title) passed.push('[OK] API title defined');
                if (spec.info.version) passed.push('[OK] API version defined');
                if (!spec.info.description) issues.push('[!] API description missing');
            }

            if (spec.paths) {
                passed.push(`[OK] ${Object.keys(spec.paths).length} endpoints defined`);

                for (const [path, methods] of Object.entries(spec.paths)) {
                    for (const [method, details] of Object.entries(methods)) {
                        if (['get', 'post', 'put', 'patch', 'delete'].includes(method)) {
                            if (!details.responses) {
                                issues.push(`[X] ${method.toUpperCase()} ${path}: No responses defined`);
                            }
                            if (!details.summary && !details.description) {
                                issues.push(`[!] ${method.toUpperCase()} ${path}: No description`);
                            }
                        }
                    }
                }
            }
        } else {
            // YAML check
            if (content.includes('openapi:') || content.includes('swagger:')) {
                passed.push('[OK] OpenAPI/Swagger version defined');
            } else {
                issues.push('[X] No OpenAPI version found');
            }

            if (content.includes('paths:')) {
                passed.push('[OK] Paths section exists');
            } else {
                issues.push('[X] No paths defined');
            }

            if (content.includes('components:') || content.includes('definitions:')) {
                passed.push('[OK] Schema components defined');
            }
        }
    } catch (e) {
        issues.push(`[X] Parse error: ${e.message}`);
    }

    return { file: filePath, passed, issues, type: 'openapi' };
}

function checkApiCode(filePath) {
    const issues = [];
    const passed = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        // Check for error handling
        const errorPatterns = [/try\s*{/, /try:/, /\.catch\(/, /except\s+/, /catch\s*\(/];
        if (errorPatterns.some(p => p.test(content))) {
            passed.push('[OK] Error handling present');
        } else {
            issues.push('[X] No error handling found');
        }

        // Check for status codes
        const statusPatterns = [
            /status\s*\(\s*\d{3}\s*\)/, /statusCode\s*[=:]\s*\d{3}/,
            /HttpStatus\./, /status_code\s*=\s*\d{3}/,
            /\.status\(\d{3}\)/, /res\.status\(/
        ];
        if (statusPatterns.some(p => p.test(content))) {
            passed.push('[OK] HTTP status codes used');
        } else {
            issues.push('[!] No explicit HTTP status codes');
        }

        // Check for validation
        const validationPatterns = [/validate/i, /schema/i, /zod/i, /joi/i, /yup/i, /pydantic/i];
        if (validationPatterns.some(p => p.test(content))) {
            passed.push('[OK] Input validation present');
        } else {
            issues.push('[!] No input validation detected');
        }

        // Check for auth
        const authPatterns = [/auth/i, /jwt/i, /bearer/i, /token/i, /middleware/i, /guard/i];
        if (authPatterns.some(p => p.test(content))) {
            passed.push('[OK] Authentication/authorization detected');
        }

        // Check for rate limiting
        if (/rateLimit/i.test(content) || /throttle/i.test(content)) {
            passed.push('[OK] Rate limiting present');
        }

        // Check for logging
        if (/console\.log/.test(content) || /logger\./.test(content)) {
            passed.push('[OK] Logging present');
        }

    } catch (e) {
        issues.push(`[X] Read error: ${e.message}`);
    }

    return { file: filePath, passed, issues, type: 'code' };
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log('\n' + '='.repeat(60));
    console.log('  API VALIDATOR - Endpoint Best Practices Check');
    console.log('='.repeat(60) + '\n');

    const apiFiles = findApiFiles(projectPath);

    if (apiFiles.length === 0) {
        console.log('[!] No API files found.');
        console.log('   Looking for: routes/, controllers/, api/, openapi.json/yaml');
        process.exit(0);
    }

    const results = [];
    for (const filePath of apiFiles) {
        const basename = filePath.split(/[/\\]/).pop().toLowerCase();
        if (basename.includes('openapi') || basename.includes('swagger')) {
            results.push(checkOpenApiSpec(filePath));
        } else {
            results.push(checkApiCode(filePath));
        }
    }

    // Print results
    let totalIssues = 0;
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
        }
    }

    console.log('\n' + '='.repeat(60));
    console.log(`[RESULTS] ${totalPassed} passed, ${totalIssues} critical issues`);
    console.log('='.repeat(60));

    if (totalIssues === 0) {
        console.log('[OK] API validation passed');
        process.exit(0);
    } else {
        console.log('[X] Fix critical issues before deployment');
        process.exit(1);
    }
}

main();
