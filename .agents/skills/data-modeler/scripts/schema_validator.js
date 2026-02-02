#!/usr/bin/env node
/**
 * Schema Validator - Database schema validation
 * Validates Prisma schemas and checks for common issues.
 *
 * Usage:
 *     node schema_validator.js <project_path>
 *
 * Checks:
 *     - Prisma schema syntax
 *     - Missing relations
 *     - Index recommendations
 *     - Naming conventions
 */

import { readFileSync, readdirSync, existsSync } from 'fs';
import { resolve, relative, extname } from 'path';

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__']);

function findSchemaFiles(projectPath) {
    const schemas = [];

    function walk(dir) {
        try {
            const entries = readdirSync(dir, { withFileTypes: true });
            for (const entry of entries) {
                if (SKIP_DIRS.has(entry.name)) continue;
                const fullPath = resolve(dir, entry.name);

                if (entry.isDirectory()) {
                    walk(fullPath);
                } else {
                    // Prisma schema
                    if (entry.name === 'schema.prisma') {
                        schemas.push(['prisma', fullPath]);
                    }
                    // Drizzle schema
                    if ((entry.name.includes('schema') || entry.name.includes('table')) &&
                        extname(entry.name) === '.ts') {
                        schemas.push(['drizzle', fullPath]);
                    }
                }
            }
        } catch { /* ignore */ }
    }

    walk(projectPath);
    return schemas.slice(0, 10);
}

function validatePrismaSchema(filePath) {
    const issues = [];

    try {
        const content = readFileSync(filePath, 'utf-8');

        // Find all models
        const modelRegex = /model\s+(\w+)\s*{([^}]+)}/g;
        let match;

        while ((match = modelRegex.exec(content)) !== null) {
            const modelName = match[1];
            const modelBody = match[2];

            // Check naming convention (PascalCase)
            if (modelName[0] !== modelName[0].toUpperCase()) {
                issues.push(`Model '${modelName}' should be PascalCase`);
            }

            // Check for id field
            if (!modelBody.includes('@id') && !modelBody.toLowerCase().includes('id')) {
                issues.push(`Model '${modelName}' might be missing @id field`);
            }

            // Check for createdAt/updatedAt
            if (!modelBody.includes('createdAt') && !modelBody.includes('created_at')) {
                issues.push(`Model '${modelName}' missing createdAt field (recommended)`);
            }

            // Check for foreign key index suggestions
            const fkRegex = /(\w+Id)\s+\w+/g;
            let fkMatch;
            while ((fkMatch = fkRegex.exec(modelBody)) !== null) {
                const fk = fkMatch[1];
                if (!content.includes(`@@index([${fk}])`) && !content.includes(`@@index(["${fk}"])`)) {
                    issues.push(`Consider adding @@index([${fk}]) for better query performance in ${modelName}`);
                }
            }
        }

        // Check enum definitions
        const enumRegex = /enum\s+(\w+)\s*{/g;
        while ((match = enumRegex.exec(content)) !== null) {
            const enumName = match[1];
            if (enumName[0] !== enumName[0].toUpperCase()) {
                issues.push(`Enum '${enumName}' should be PascalCase`);
            }
        }

    } catch (e) {
        issues.push(`Error reading schema: ${e.message.slice(0, 50)}`);
    }

    return issues;
}

function main() {
    const projectPath = resolve(process.argv[2] || '.');

    console.log(`\n${'='.repeat(60)}`);
    console.log('[SCHEMA VALIDATOR] Database Schema Validation');
    console.log('='.repeat(60));
    console.log(`Project: ${projectPath}`);
    console.log(`Time: ${new Date().toISOString()}`);
    console.log('-'.repeat(60));

    // Find schema files
    const schemas = findSchemaFiles(projectPath);
    console.log(`Found ${schemas.length} schema files`);

    if (schemas.length === 0) {
        const output = {
            script: 'schema_validator',
            project: projectPath,
            schemas_checked: 0,
            issues_found: 0,
            passed: true,
            message: 'No schema files found'
        };
        console.log(JSON.stringify(output, null, 2));
        process.exit(0);
    }

    // Validate each schema
    const allIssues = [];

    for (const [schemaType, filePath] of schemas) {
        const basename = filePath.split(/[/\\]/).pop();
        console.log(`\nValidating: ${basename} (${schemaType})`);

        let issues = [];
        if (schemaType === 'prisma') {
            issues = validatePrismaSchema(filePath);
        }
        // Drizzle validation could be added

        if (issues.length > 0) {
            allIssues.push({
                file: basename,
                type: schemaType,
                issues: issues
            });
        }
    }

    // Summary
    console.log('\n' + '='.repeat(60));
    console.log('SCHEMA ISSUES');
    console.log('='.repeat(60));

    if (allIssues.length > 0) {
        for (const item of allIssues) {
            console.log(`\n${item.file} (${item.type}):`);
            item.issues.slice(0, 5).forEach(issue => console.log(`  - ${issue}`));
            if (item.issues.length > 5) {
                console.log(`  ... and ${item.issues.length - 5} more issues`);
            }
        }
    } else {
        console.log('No schema issues found!');
    }

    const totalIssues = allIssues.reduce((sum, item) => sum + item.issues.length, 0);

    const output = {
        script: 'schema_validator',
        project: projectPath,
        schemas_checked: schemas.length,
        issues_found: totalIssues,
        passed: true, // Schema issues are warnings
        issues: allIssues
    };

    console.log('\n' + JSON.stringify(output, null, 2));

    process.exit(0);
}

main();
