#!/usr/bin/env node
/**
 * Knowledge Schema Validator
 * 
 * Validates knowledge files against JSON schemas before save/load.
 * Ensures data integrity and prevents corruption.
 * 
 * Usage:
 *   ag-smart validate               # Validate all knowledge files
 *   ag-smart validate --fix         # Auto-fix minor issues
 *   ag-smart validate --json        # JSON output for CI
 */

import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import Ajv from 'ajv';
import addFormats from 'ajv-formats';
import { KNOWLEDGE_DIR } from './config.js';

const SCHEMA_DIR = path.join(KNOWLEDGE_DIR, 'schema');

// Initialize AJV with formats (date-time, etc.)
const ajv = new Ajv({ allErrors: true, strict: false });
addFormats(ajv);

// Cache compiled validators
const validators = {};

/**
 * Load and compile schema
 * @param {string} schemaName - Schema filename without extension
 * @returns {Function} Compiled validator
 */
function getValidator(schemaName) {
    if (validators[schemaName]) {
        return validators[schemaName];
    }
    
    const schemaPath = path.join(SCHEMA_DIR, `${schemaName}.schema.json`);
    if (!fs.existsSync(schemaPath)) {
        return null;
    }
    
    const schema = JSON.parse(fs.readFileSync(schemaPath, 'utf8'));
    validators[schemaName] = ajv.compile(schema);
    return validators[schemaName];
}

/**
 * Validate a knowledge file against its schema
 * @param {string} filename - File to validate (e.g., 'mistakes.yaml')
 * @returns {{ valid: boolean, errors: Array, file: string }}
 */
export function validateFile(filename) {
    const filePath = path.join(KNOWLEDGE_DIR, filename);
    
    if (!fs.existsSync(filePath)) {
        return { valid: true, errors: [], file: filename, skipped: true };
    }
    
    // Determine schema name from filename
    const baseName = path.basename(filename, path.extname(filename));
    const schemaName = baseName.replace(/-/g, ''); // mistakes, improvements, etc.
    
    // Map to correct schema names
    const schemaMap = {
        'mistakes': 'mistakes',
        'improvements': 'improvements',
        'evolutionsignals': 'evolution-signals',
        'settings': 'settings'
    };
    
    const mappedSchema = schemaMap[schemaName] || schemaName;
    const validator = getValidator(mappedSchema);
    
    if (!validator) {
        return { valid: true, errors: [], file: filename, noSchema: true };
    }
    
    try {
        let data;
        const ext = path.extname(filename).toLowerCase();
        const content = fs.readFileSync(filePath, 'utf8');
        
        if (ext === '.yaml' || ext === '.yml') {
            data = yaml.load(content);
        } else if (ext === '.json') {
            data = JSON.parse(content);
        } else {
            return { valid: true, errors: [], file: filename, unsupportedFormat: true };
        }
        
        const valid = validator(data);
        
        if (!valid) {
            return {
                valid: false,
                errors: validator.errors.map(err => ({
                    path: err.instancePath || '/',
                    message: err.message,
                    keyword: err.keyword,
                    params: err.params
                })),
                file: filename
            };
        }
        
        return { valid: true, errors: [], file: filename };
        
    } catch (e) {
        return {
            valid: false,
            errors: [{ path: '/', message: `Parse error: ${e.message}`, keyword: 'parse' }],
            file: filename
        };
    }
}

/**
 * Validate all knowledge files
 * @returns {{ results: Array, summary: { total: number, valid: number, invalid: number } }}
 */
export function validateAll() {
    const files = [
        'mistakes.yaml',
        'improvements.yaml',
        'evolution-signals.json',
        'settings.yaml'
    ];
    
    const results = [];
    
    for (const file of files) {
        const result = validateFile(file);
        results.push(result);
    }
    
    const valid = results.filter(r => r.valid).length;
    const invalid = results.filter(r => !r.valid).length;
    
    return {
        results,
        summary: {
            total: results.length,
            valid,
            invalid
        }
    };
}

/**
 * Auto-fix common issues
 * @param {string} filename - File to fix
 * @returns {{ fixed: boolean, changes: string[] }}
 */
export function autoFix(filename) {
    const filePath = path.join(KNOWLEDGE_DIR, filename);
    const changes = [];
    
    if (!fs.existsSync(filePath)) {
        return { fixed: false, changes: [] };
    }
    
    try {
        const ext = path.extname(filename).toLowerCase();
        const content = fs.readFileSync(filePath, 'utf8');
        let data;
        
        if (ext === '.yaml' || ext === '.yml') {
            data = yaml.load(content);
        } else if (ext === '.json') {
            data = JSON.parse(content);
        } else {
            return { fixed: false, changes: [] };
        }
        
        // Auto-fix: Ensure version field
        if (data && typeof data.version === 'undefined') {
            data.version = 1;
            changes.push('Added missing version field');
        }
        
        // Auto-fix: Ensure arrays exist
        if (filename === 'mistakes.yaml' && !Array.isArray(data.mistakes)) {
            data.mistakes = [];
            changes.push('Initialized empty mistakes array');
        }
        if (filename === 'improvements.yaml' && !Array.isArray(data.improvements)) {
            data.improvements = [];
            changes.push('Initialized empty improvements array');
        }
        if (filename === 'evolution-signals.json' && !Array.isArray(data.signals)) {
            data.signals = [];
            changes.push('Initialized empty signals array');
        }
        
        // Auto-fix: Default cognitive values
        const items = data.mistakes || data.improvements || [];
        for (const item of items) {
            if (!item.cognitive) {
                item.cognitive = { maturity: 'learning', confidence: 0.3 };
                changes.push(`Added default cognitive for ${item.id}`);
            }
            if (typeof item.hitCount === 'undefined') {
                item.hitCount = 0;
                changes.push(`Added default hitCount for ${item.id}`);
            }
        }
        
        if (changes.length > 0) {
            // Save fixed file
            if (ext === '.yaml' || ext === '.yml') {
                fs.writeFileSync(filePath, yaml.dump(data, { lineWidth: -1 }), 'utf8');
            } else {
                fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf8');
            }
        }
        
        return { fixed: changes.length > 0, changes };
        
    } catch (e) {
        return { fixed: false, changes: [], error: e.message };
    }
}

/**
 * Display validation results
 * @param {{ results: Array, summary: Object }} validation
 */
function displayResults(validation) {
    console.log(`
📋 Knowledge Schema Validation
${'─'.repeat(50)}
`);

    for (const result of validation.results) {
        if (result.skipped) {
            console.log(`⏭️  ${result.file} - Skipped (not found)`);
        } else if (result.noSchema) {
            console.log(`📄 ${result.file} - No schema (skipped)`);
        } else if (result.valid) {
            console.log(`✅ ${result.file} - Valid`);
        } else {
            console.log(`❌ ${result.file} - Invalid`);
            for (const err of result.errors) {
                console.log(`   └─ ${err.path}: ${err.message}`);
            }
        }
    }

    console.log(`
${'─'.repeat(50)}
📊 Summary: ${validation.summary.valid}/${validation.summary.total} valid
`);

    if (validation.summary.invalid > 0) {
        console.log('💡 Tip: Run with --fix to auto-fix common issues\n');
    }
}

/**
 * CLI entry point
 */
async function main() {
    const args = process.argv.slice(2);
    const jsonMode = args.includes('--json');
    const fixMode = args.includes('--fix');
    
    if (fixMode) {
        console.log('🔧 Auto-fixing knowledge files...\n');
        
        const files = ['mistakes.yaml', 'improvements.yaml', 'evolution-signals.json', 'settings.yaml'];
        let totalChanges = 0;
        
        for (const file of files) {
            const result = autoFix(file);
            if (result.fixed) {
                console.log(`✅ Fixed ${file}:`);
                result.changes.forEach(c => console.log(`   └─ ${c}`));
                totalChanges += result.changes.length;
            }
        }
        
        if (totalChanges === 0) {
            console.log('✨ No issues to fix!\n');
        } else {
            console.log(`\n🔧 Made ${totalChanges} fixes. Re-validating...\n`);
        }
    }
    
    const validation = validateAll();
    
    if (jsonMode) {
        console.log(JSON.stringify(validation, null, 2));
        process.exit(validation.summary.invalid > 0 ? 1 : 0);
    }
    
    displayResults(validation);
    process.exit(validation.summary.invalid > 0 ? 1 : 0);
}

// Run if called directly
if (process.argv[1]?.includes('knowledge-validator')) {
    main();
}

export default {
    validateFile,
    validateAll,
    autoFix
};
