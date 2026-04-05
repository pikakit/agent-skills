#!/usr/bin/env node
// @ts-nocheck
/**
 * Governance Doctrine Validator
 * 
 * Validates code files against PikaKit Architecture Doctrine
 * 
 * Usage:
 *   node scripts/validate_doctrine.js <file-path>
 *   node scripts/validate_doctrine.js --dir <directory>
 * 
 * Exit codes:
 *   0 = All checks passed
 *   1 = Violations found
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for output
const colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    dim: '\x1b[2m',
};

class DoctrineValidator {
    constructor(filepath) {
        this.filepath = filepath;
        this.content = fs.readFileSync(filepath, 'utf-8');
        this.errors = [];
        this.warnings = [];
        this.info = [];
    }

    // Law 1: Backend is source of truth
    checkTruthOwnership() {
        const violations = [];

        // Check for frontend managing financial data
        if (this.content.match(/localStorage\.setItem.*price|localStorage\.setItem.*balance|localStorage\.setItem.*portfolio/i)) {
            violations.push({
                law: 'Law 1: Truth Ownership',
                severity: 'ERROR',
                message: 'Frontend persisting financial data to localStorage',
                doctrine: 'constitution/master-constitution.md',
                line: this.findLineNumber(/localStorage\.setItem.*price|localStorage\.setItem.*balance/i),
            });
        }

        // Check for frontend calling external APIs directly (production code)
        if (this.content.match(/fetch\(['"]https:\/\/api\.(coingecko|binance|coinbase)/i) &&
            !this.filepath.includes('test') &&
            !this.filepath.includes('example')) {
            violations.push({
                law: 'Law 1: Truth Ownership',
                severity: 'ERROR',
                message: 'Frontend calling external API directly (should go through backend)',
                doctrine: 'doctrines/architecture/architecture-doctrine.md',
                line: this.findLineNumber(/fetch\(['"]https:\/\/api\./i),
            });
        }

        // Check for frontend calculating aggregates
        if (this.content.match(/\.reduce\([^)]*avg|\.reduce\([^)]*mean|Math\.average/i) &&
            this.content.match(/price|balance|volume/i)) {
            violations.push({
                law: 'Law 1: Truth Ownership',
                severity: 'WARNING',
                message: 'Frontend calculating financial aggregates (consider moving to backend)',
                doctrine: 'doctrines/backend/backend-data-engine-doctrine.md',
                line: this.findLineNumber(/\.reduce/i),
            });
        }

        return violations;
    }

    // Law 2: Historical data immutability
    checkHistoricalImmutability() {
        const violations = [];

        // Check for array mutation methods
        const mutationMethods = ['.splice(', '.shift(', '.pop(', '.push(', '.unshift('];
        const historyPatterns = ['history', 'chart', 'candle', 'ohlc', 'sparkline'];

        for (const method of mutationMethods) {
            for (const pattern of historyPatterns) {
                const regex = new RegExp(`${pattern}[^\\n]*${method.replace('(', '\\(')}`, 'i');
                if (this.content.match(regex)) {
                    violations.push({
                        law: 'Law 2: Historical Integrity',
                        severity: 'ERROR',
                        message: `Array mutation detected on historical data: ${method}`,
                        doctrine: 'constitution/master-constitution.md',
                        line: this.findLineNumber(regex),
                    });
                }
            }
        }

        // Check for direct object mutation
        if (this.content.match(/\.(data|history|candles)\[.*\]\s*=/)) {
            violations.push({
                law: 'Law 2: Historical Integrity',
                severity: 'ERROR',
                message: 'Direct mutation of historical data array index',
                doctrine: 'constitution/master-constitution.md',
                line: this.findLineNumber(/\.(data|history|candles)\[.*\]\s*=/),
            });
        }

        return violations;
    }

    // Law 3: Realtime ephemerality
    checkRealtimeEphemerality() {
        const violations = [];

        // Check for websocket data being added to charts
        if (this.content.match(/websocket|ws\.on|socket\.on/i) &&
            this.content.match(/\.update\(|\.setData\(|\.addTo/i) &&
            this.content.match(/chart|series|candle/i)) {
            violations.push({
                law: 'Law 3: Realtime Ephemerality',
                severity: 'ERROR',
                message: 'Potential realtime data injection into chart detected',
                doctrine: 'constitution/master-constitution.md',
                line: this.findLineNumber(/\.update\(|\.setData\(/i),
            });
        }

        // Check for persisting websocket data
        if (this.content.match(/websocket|ws\.on/i) &&
            this.content.match(/\.create\(|\.insert\(|\.save\(/i)) {
            violations.push({
                law: 'Law 3: Realtime Ephemerality',
                severity: 'WARNING',
                message: 'Realtime data being persisted (ensure proper aggregation)',
                doctrine: 'doctrines/data/data-integrity-doctrine.md',
                line: this.findLineNumber(/\.create\(|\.insert\(/i),
            });
        }

        return violations;
    }

    // Architecture: System boundaries
    checkSystemBoundaries() {
        const violations = [];

        // Check for frontend importing backend code
        if (this.content.match(/from ['"]@\/(?:lib|api|db|server)/i) &&
            this.filepath.match(/components|pages|app\/.*\.(tsx?|jsx?)$/)) {
            violations.push({
                law: 'System Boundary Law',
                severity: 'WARNING',
                message: 'Frontend importing backend modules (check dependency direction)',
                doctrine: 'doctrines/architecture/architecture-doctrine.md',
                line: this.findLineNumber(/from ['"]@\/(?:lib|api|db)/i),
            });
        }

        return violations;
    }

    // Performance: Caching
    checkCachingStrategy() {
        const info = [];

        // Check if API route has caching
        if (this.filepath.match(/api\/.*\.(ts|js)$/) &&
            !this.content.match(/Cache-Control|stale-while-revalidate|redis|kv/i)) {
            info.push({
                law: 'Performance Doctrine',
                severity: 'INFO',
                message: 'API route may benefit from caching strategy',
                doctrine: 'doctrines/performance/performance-doctrine.md',
            });
        }

        return info;
    }

    findLineNumber(regex) {
        const lines = this.content.split('\n');
        for (let i = 0; i < lines.length; i++) {
            if (lines[i].match(regex)) {
                return i + 1;
            }
        }
        return null;
    }

    validate() {
        this.errors = [
            ...this.checkTruthOwnership(),
            ...this.checkHistoricalImmutability(),
            ...this.checkRealtimeEphemerality(),
            ...this.checkSystemBoundaries(),
        ];

        this.info = [
            ...this.checkCachingStrategy(),
        ];

        return {
            errors: this.errors.filter(v => v.severity === 'ERROR'),
            warnings: this.errors.filter(v => v.severity === 'WARNING'),
            info: this.info,
        };
    }

    report() {
        const results = this.validate();
        const hasIssues = results.errors.length > 0 || results.warnings.length > 0;

        console.log('\n' + colors.cyan + '═'.repeat(70) + colors.reset);
        console.log(colors.cyan + `Governance Doctrine Validator` + colors.reset);
        console.log(colors.dim + `File: ${this.filepath}` + colors.reset);
        console.log(colors.cyan + '═'.repeat(70) + colors.reset + '\n');

        if (results.errors.length > 0) {
            console.log(colors.red + `❌ ${results.errors.length} ERROR(S) FOUND\n` + colors.reset);
            results.errors.forEach((error, i) => {
                console.log(colors.red + `[${i + 1}] ${error.law}` + colors.reset);
                console.log(`    ${error.message}`);
                if (error.line) console.log(colors.dim + `    Line ${error.line}` + colors.reset);
                console.log(colors.dim + `    Source: ${error.doctrine}` + colors.reset);
                console.log();
            });
        }

        if (results.warnings.length > 0) {
            console.log(colors.yellow + `⚠️  ${results.warnings.length} WARNING(S) FOUND\n` + colors.reset);
            results.warnings.forEach((warning, i) => {
                console.log(colors.yellow + `[${i + 1}] ${warning.law}` + colors.reset);
                console.log(`    ${warning.message}`);
                if (warning.line) console.log(colors.dim + `    Line ${warning.line}` + colors.reset);
                console.log(colors.dim + `    Source: ${warning.doctrine}` + colors.reset);
                console.log();
            });
        }

        if (results.info.length > 0) {
            console.log(colors.cyan + `ℹ️  ${results.info.length} SUGGESTION(S)\n` + colors.reset);
            results.info.forEach((info, i) => {
                console.log(colors.cyan + `[${i + 1}] ${info.law}` + colors.reset);
                console.log(`    ${info.message}`);
                console.log(colors.dim + `    Source: ${info.doctrine}` + colors.reset);
                console.log();
            });
        }

        if (!hasIssues && results.info.length === 0) {
            console.log(colors.green + `✅ All doctrine checks passed!` + colors.reset + '\n');
        }

        console.log(colors.cyan + '═'.repeat(70) + colors.reset + '\n');

        return results.errors.length > 0 ? 1 : 0;
    }
}

// Main execution
const filepath = process.argv[2];

if (!filepath) {
    console.error('Usage: node validate_doctrine.js <file-path>');
    process.exit(1);
}

if (!fs.existsSync(filepath)) {
    console.error(`Error: File not found: ${filepath}`);
    process.exit(1);
}

const validator = new DoctrineValidator(filepath);
const exitCode = validator.report();
process.exit(exitCode);
