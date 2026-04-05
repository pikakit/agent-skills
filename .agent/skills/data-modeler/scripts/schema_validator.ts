#!/usr/bin/env node
// @ts-nocheck
/**
 * Schema Validator v2.0.0
 * Skill: data-modeler
 *
 * Validates Prisma and Drizzle schemas for common issues.
 *
 * Usage:
 *   node schema_validator.js <project_path>
 *   node schema_validator.js <project_path> --json
 *
 * Checks:
 *   - Prisma schema: model naming, @id, timestamps, FK indexes, enum naming
 *   - Drizzle schema: table naming, primaryKey, timestamps, index hints
 *
 * Flags:
 *   --json     Output as JSON only
 *   --help     Show help
 *   --version  Show version
 */

import { readFile, readdir, stat } from 'node:fs/promises';
import { resolve, extname } from 'node:path';

const VERSION = '2.0.0';
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.next', '.nuxt']);
const MAX_SCHEMA_FILES = 10;

// --- CLI ---

const args = process.argv.slice(2);
const jsonMode = args.includes('--json');
const filteredArgs = args.filter(a => !a.startsWith('--'));

function showHelp() {
    console.log(`Schema Validator v${VERSION}

Usage: node schema_validator.js <project_path> [options]

Options:
  --json       Output as JSON only
  --help       Show this help
  --version    Show version

Checks:
  Prisma: model PascalCase, @id present, createdAt/updatedAt, FK indexes, enum naming
  Drizzle: table definition, primaryKey call, timestamp columns, index hints`);
}

// --- File Discovery ---

async function findSchemaFiles(projectPath) {
    const schemas = [];

    async function walk(dir, depth = 0) {
        if (depth > 8 || schemas.length >= MAX_SCHEMA_FILES) return;

        let entries;
        try {
            entries = await readdir(dir, { withFileTypes: true });
        } catch (err) {
            if (!jsonMode) console.warn(`[WARN] Cannot read directory: ${dir} (${err.code})`);
            return;
        }

        for (const entry of entries) {
            if (SKIP_DIRS.has(entry.name)) continue;
            const fullPath = resolve(dir, entry.name);

            if (entry.isDirectory()) {
                await walk(fullPath, depth + 1);
            } else if (entry.name === 'schema.prisma') {
                schemas.push({ type: 'prisma', path: fullPath, name: entry.name });
            } else if (
                (entry.name.includes('schema') || entry.name.includes('table')) &&
                extname(entry.name) === '.ts' &&
                !entry.name.endsWith('.d.ts')
            ) {
                schemas.push({ type: 'drizzle', path: fullPath, name: entry.name });
            }
        }
    }

    await walk(projectPath);
    return schemas;
}

// --- Prisma Validation ---

async function validatePrisma(filePath) {
    const issues = [];
    let content;

    try {
        content = await readFile(filePath, 'utf-8');
    } catch (err) {
        issues.push({ rule: 'FILE_READ', severity: 'error', message: `Cannot read file: ${err.message}` });
        return issues;
    }

    const modelRegex = /model\s+(\w+)\s*\{([^}]+)\}/g;
    let match;

    while ((match = modelRegex.exec(content)) !== null) {
        const modelName = match[1];
        const modelBody = match[2];

        // PascalCase check
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(modelName)) {
            issues.push({
                rule: 'PRISMA_MODEL_NAMING',
                severity: 'error',
                message: `Model '${modelName}' should be PascalCase`,
            });
        }

        // @id field check
        if (!modelBody.includes('@id') && !modelBody.includes('@@id')) {
            issues.push({
                rule: 'PRISMA_MISSING_ID',
                severity: 'error',
                message: `Model '${modelName}' missing @id or @@id field`,
            });
        }

        // createdAt check
        if (!modelBody.includes('createdAt') && !modelBody.includes('created_at')) {
            issues.push({
                rule: 'PRISMA_MISSING_CREATED_AT',
                severity: 'warning',
                message: `Model '${modelName}' missing createdAt/created_at timestamp`,
            });
        }

        // updatedAt check
        if (!modelBody.includes('updatedAt') && !modelBody.includes('updated_at')) {
            issues.push({
                rule: 'PRISMA_MISSING_UPDATED_AT',
                severity: 'warning',
                message: `Model '${modelName}' missing updatedAt/updated_at timestamp`,
            });
        }

        // FK index suggestions (camelCase + snake_case)
        const fkRegex = /(\w+(?:Id|_id))\s+String/g;
        let fkMatch;
        while ((fkMatch = fkRegex.exec(modelBody)) !== null) {
            const fk = fkMatch[1];
            if (!content.includes(`@@index([${fk}])`) && !content.includes(`@@index(["${fk}"])`)) {
                issues.push({
                    rule: 'PRISMA_MISSING_FK_INDEX',
                    severity: 'warning',
                    message: `Consider @@index([${fk}]) in ${modelName} for query performance`,
                });
            }
        }
    }

    // Enum naming check
    const enumRegex = /enum\s+(\w+)\s*\{/g;
    while ((match = enumRegex.exec(content)) !== null) {
        if (!/^[A-Z][a-zA-Z0-9]*$/.test(match[1])) {
            issues.push({
                rule: 'PRISMA_ENUM_NAMING',
                severity: 'error',
                message: `Enum '${match[1]}' should be PascalCase`,
            });
        }
    }

    return issues;
}

// --- Drizzle Validation ---

async function validateDrizzle(filePath) {
    const issues = [];
    let content;

    try {
        content = await readFile(filePath, 'utf-8');
    } catch (err) {
        issues.push({ rule: 'FILE_READ', severity: 'error', message: `Cannot read file: ${err.message}` });
        return issues;
    }

    // Check for table definitions
    const tableRegex = /(?:pgTable|sqliteTable|mysqlTable)\(\s*['"](\w+)['"]/g;
    let match;
    const tables = [];

    while ((match = tableRegex.exec(content)) !== null) {
        tables.push(match[1]);
    }

    if (tables.length === 0) return issues; // Not a schema file

    for (const tableName of tables) {
        // snake_case check for table names
        if (tableName !== tableName.toLowerCase()) {
            issues.push({
                rule: 'DRIZZLE_TABLE_NAMING',
                severity: 'warning',
                message: `Table '${tableName}' should be snake_case`,
            });
        }
    }

    // Check for primaryKey
    if (!content.includes('primaryKey') && !content.includes('.primaryKey()')) {
        issues.push({
            rule: 'DRIZZLE_MISSING_PK',
            severity: 'error',
            message: 'No primaryKey() found — every table needs a primary key',
        });
    }

    // Check for timestamps
    if (!content.includes('created_at') && !content.includes('createdAt')) {
        issues.push({
            rule: 'DRIZZLE_MISSING_CREATED_AT',
            severity: 'warning',
            message: 'No created_at/createdAt column found — recommended for all tables',
        });
    }

    // Check for withTimezone (TIMESTAMPTZ)
    if (content.includes('timestamp(') && !content.includes('withTimezone')) {
        issues.push({
            rule: 'DRIZZLE_NO_TIMEZONE',
            severity: 'warning',
            message: 'timestamp() without { withTimezone: true } — use TIMESTAMPTZ',
        });
    }

    return issues;
}

// --- Main ---

async function main() {
    if (args.includes('--version')) {
        console.log(VERSION);
        return;
    }
    if (args.includes('--help') || filteredArgs.length === 0) {
        showHelp();
        return;
    }

    const projectPath = resolve(filteredArgs[0]);

    try {
        await stat(projectPath);
    } catch {
        console.error(`[ERROR] Path does not exist: ${projectPath}`);
        process.exit(1);
    }

    if (!jsonMode) {
        console.log(`\n${'='.repeat(60)}`);
        console.log('[SCHEMA VALIDATOR] Database Schema Validation v' + VERSION);
        console.log('='.repeat(60));
        console.log(`Project: ${projectPath}`);
        console.log(`Time: ${new Date().toISOString()}`);
        console.log('-'.repeat(60));
    }

    const schemas = await findSchemaFiles(projectPath);

    if (schemas.length === 0) {
        const output = {
            script: 'schema_validator',
            version: VERSION,
            project: projectPath,
            schemas_checked: 0,
            errors: 0,
            warnings: 0,
            passed: true,
            message: 'No schema files found',
        };
        if (jsonMode) {
            console.log(JSON.stringify(output, null, 2));
        } else {
            console.log('No schema files found.');
            console.log('\n' + JSON.stringify(output, null, 2));
        }
        return;
    }

    if (!jsonMode) console.log(`Found ${schemas.length} schema file(s)`);

    const allResults = [];

    for (const schema of schemas) {
        if (!jsonMode) console.log(`\nValidating: ${schema.name} (${schema.type})`);

        const issues = schema.type === 'prisma'
            ? await validatePrisma(schema.path)
            : await validateDrizzle(schema.path);

        if (issues.length > 0) {
            allResults.push({ file: schema.name, type: schema.type, issues });
        }

        if (!jsonMode && issues.length > 0) {
            for (const issue of issues.slice(0, 8)) {
                const icon = issue.severity === 'error' ? '[ERROR]' : '[WARN]';
                console.log(`  ${icon} ${issue.rule}: ${issue.message}`);
            }
            if (issues.length > 8) {
                console.log(`  ... and ${issues.length - 8} more issues`);
            }
        } else if (!jsonMode) {
            console.log('  [OK] No issues found');
        }
    }

    const totalErrors = allResults.reduce(
        (sum, r) => sum + r.issues.filter(i => i.severity === 'error').length, 0,
    );
    const totalWarnings = allResults.reduce(
        (sum, r) => sum + r.issues.filter(i => i.severity === 'warning').length, 0,
    );

    const output = {
        script: 'schema_validator',
        version: VERSION,
        project: projectPath,
        schemas_checked: schemas.length,
        errors: totalErrors,
        warnings: totalWarnings,
        passed: totalErrors === 0,
        results: allResults,
    };

    if (!jsonMode) {
        console.log('\n' + '='.repeat(60));
        console.log(`RESULT: ${output.passed ? 'PASSED' : 'FAILED'} | ${totalErrors} errors, ${totalWarnings} warnings`);
        console.log('='.repeat(60));
    }

    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(totalErrors > 0 ? 1 : 0);
}

main().catch(err => {
    const error = { status: 'error', code: 'ERR_UNEXPECTED', message: err.message };
    if (jsonMode) {
        console.error(JSON.stringify(error));
    } else {
        console.error(`[FATAL] ${err.message}`);
    }
    process.exit(1);
});
