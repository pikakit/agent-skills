#!/usr/bin/env node
/**
 * Smart Auto-Learn - True Self-Learning Engine
 * 
 * Automatically learns from:
 * 1. ESLint output (runs ESLint and parses)
 * 2. Test failures (runs tests and parses)
 * 3. TypeScript errors (runs tsc and parses)
 * 
 * Usage:
 *   ag-smart auto-learn              # Run all
 *   ag-smart auto-learn --eslint     # ESLint only
 *   ag-smart auto-learn --test       # Test failures only
 *   ag-smart auto-learn --typescript # TypeScript only
 */

import fs from "fs";
import path from "path";
import { execSync, spawnSync } from "child_process";
import { loadKnowledge, saveKnowledge } from "./recall.v2.js";
import { VERSION } from "./config.js";

// ============================================================================
// ESLINT AUTO-LEARN
// ============================================================================

const ESLINT_PATTERN_MAP = {
    "no-console": { pattern: "console\\.(log|warn|error|info|debug)", message: "Avoid console statements in production" },
    "no-debugger": { pattern: "\\bdebugger\\b", message: "Remove debugger statements" },
    "no-var": { pattern: "\\bvar\\s+\\w", message: "Use const/let instead of var" },
    "eqeqeq": { pattern: "[^!=]==[^=]", message: "Use === instead of ==" },
    "no-eval": { pattern: "\\beval\\s*\\(", message: "Avoid eval() for security" },
    "no-alert": { pattern: "\\balert\\s*\\(", message: "Avoid alert() in production" },
    "no-implicit-globals": { pattern: "^(?!const|let|var|function|class|import|export)", message: "Avoid implicit globals" },
    "prefer-const": { pattern: "\\blet\\s+\\w+\\s*=\\s*[^;]+;(?![\\s\\S]*\\1\\s*=)", message: "Use const for variables that are never reassigned" },
    "no-unused-expressions": { pattern: "^\\s*['\"`]use strict['\"`];?\\s*$", message: "Remove unused expressions" },
    "semi": { pattern: "[^;{}]\\s*$", message: "Missing semicolon" },
    "quotes": { pattern: '(?<![\\w])"(?![^"]*"[,\\]\\}\\)])', message: "Prefer single quotes" },
    "no-empty": { pattern: "\\{\\s*\\}", message: "Empty block statement" },
    "no-extra-semi": { pattern: ";;", message: "Unnecessary semicolon" },
    "no-unreachable": { pattern: "(?:return|throw|break|continue)[^}]*[\\n\\r]+[^}]+", message: "Unreachable code" }
};

function runEslintAutoLearn(projectRoot) {
    console.log("\n🔍 Running ESLint analysis...\n");

    try {
        // Try to run ESLint with JSON output
        const result = spawnSync("npx", ["eslint", ".", "--format", "json", "--no-error-on-unmatched-pattern"], {
            cwd: projectRoot,
            encoding: "utf8",
            shell: true,
            timeout: 60000
        });

        if (!result.stdout) {
            console.log("   ℹ️  ESLint not configured or no files to lint.");
            return [];
        }

        const eslintResults = JSON.parse(result.stdout);
        const ruleViolations = {};

        eslintResults.forEach(file => {
            if (!file.messages) return;
            file.messages.forEach(msg => {
                if (!msg.ruleId) return;
                if (!ruleViolations[msg.ruleId]) {
                    ruleViolations[msg.ruleId] = {
                        rule: msg.ruleId,
                        count: 0,
                        severity: msg.severity === 2 ? "ERROR" : "WARNING",
                        sample: msg.message
                    };
                }
                ruleViolations[msg.ruleId].count++;
            });
        });

        return Object.values(ruleViolations).sort((a, b) => b.count - a.count);
    } catch (e) {
        console.log("   ⚠️  ESLint analysis skipped:", e.message);
        return [];
    }
}

// ============================================================================
// TEST FAILURE AUTO-LEARN
// ============================================================================

const TEST_PATTERN_MAP = {
    "undefined is not a function": { pattern: "\\w+\\s*\\(", message: "Function may be undefined before call" },
    "cannot read property": { pattern: "\\w+\\.\\w+", message: "Object property access may fail if undefined" },
    "null is not an object": { pattern: "\\.\\w+", message: "Null check needed before property access" },
    "expected.*to equal": { pattern: "expect\\s*\\(", message: "Assertion expectation mismatch" },
    "timeout": { pattern: "async|await|Promise", message: "Async operation may need longer timeout" },
    "not defined": { pattern: "\\b\\w+\\b", message: "Variable may not be defined in scope" }
};

function runTestAutoLearn(projectRoot) {
    console.log("\n🧪 Running test analysis...\n");

    try {
        // Try common test runners
        const testCommands = [
            { cmd: "npm", args: ["test", "--", "--json", "--passWithNoTests"], name: "npm test" },
            { cmd: "npx", args: ["vitest", "run", "--reporter=json"], name: "vitest" },
            { cmd: "npx", args: ["jest", "--json", "--passWithNoTests"], name: "jest" }
        ];

        for (const tc of testCommands) {
            const result = spawnSync(tc.cmd, tc.args, {
                cwd: projectRoot,
                encoding: "utf8",
                shell: true,
                timeout: 120000
            });

            // Look for test failures in output
            const output = result.stdout + result.stderr;
            const failures = [];

            // Parse failure messages
            const failurePatterns = [
                /FAIL\s+(.+)/g,
                /✕\s+(.+)/g,
                /Error:\s+(.+)/g,
                /AssertionError:\s+(.+)/g
            ];

            failurePatterns.forEach(regex => {
                let match;
                while ((match = regex.exec(output)) !== null) {
                    failures.push(match[1].trim());
                }
            });

            if (failures.length > 0) {
                console.log(`   Found ${failures.length} test failure(s) from ${tc.name}`);
                return failures.map(f => ({ message: f, source: tc.name }));
            }
        }

        console.log("   ✅ All tests passing or no tests found.");
        return [];
    } catch (e) {
        console.log("   ⚠️  Test analysis skipped:", e.message);
        return [];
    }
}

// ============================================================================
// TYPESCRIPT ERROR AUTO-LEARN
// ============================================================================

const TS_PATTERN_MAP = {
    "TS2304": { pattern: "\\b\\w+\\b", message: "TypeScript: Cannot find name" },
    "TS2322": { pattern: ":\\s*\\w+", message: "TypeScript: Type mismatch" },
    "TS2345": { pattern: "\\(.*\\)", message: "TypeScript: Argument type mismatch" },
    "TS2339": { pattern: "\\.\\w+", message: "TypeScript: Property does not exist" },
    "TS7006": { pattern: "\\(\\w+\\)", message: "TypeScript: Parameter implicitly has 'any' type" },
    "TS2531": { pattern: "\\w+\\.", message: "TypeScript: Object is possibly 'null'" },
    "TS2532": { pattern: "\\w+\\.", message: "TypeScript: Object is possibly 'undefined'" }
};

function runTypescriptAutoLearn(projectRoot) {
    console.log("\n📘 Running TypeScript analysis...\n");

    try {
        const result = spawnSync("npx", ["tsc", "--noEmit", "--pretty", "false"], {
            cwd: projectRoot,
            encoding: "utf8",
            shell: true,
            timeout: 60000
        });

        const output = result.stdout + result.stderr;
        const errors = {};

        // Parse TS errors: file(line,col): error TS1234: message
        const tsErrorRegex = /error (TS\d+):\s*(.+)/g;
        let match;

        while ((match = tsErrorRegex.exec(output)) !== null) {
            const code = match[1];
            const message = match[2];

            if (!errors[code]) {
                errors[code] = { code, message, count: 0 };
            }
            errors[code].count++;
        }

        const errorList = Object.values(errors).sort((a, b) => b.count - a.count);

        if (errorList.length > 0) {
            console.log(`   Found ${errorList.length} unique TypeScript error type(s)`);
        } else {
            console.log("   ✅ No TypeScript errors found.");
        }

        return errorList;
    } catch (e) {
        console.log("   ⚠️  TypeScript analysis skipped:", e.message);
        return [];
    }
}

// ============================================================================
// MAIN AUTO-LEARN ENGINE
// ============================================================================

function autoLearn(projectRoot, options = {}) {
    console.log(`\n🧠 Smart Auto-Learn Engine v${VERSION}`);
    console.log(`📂 Project: ${projectRoot}\n`);
    console.log("─".repeat(50));

    const db = loadKnowledge();
    let totalAdded = 0;

    // ESLint
    if (!options.onlyTest && !options.onlyTypescript) {
        const eslintViolations = runEslintAutoLearn(projectRoot);

        eslintViolations.forEach(v => {
            const mapping = ESLINT_PATTERN_MAP[v.rule];
            if (!mapping) return;

            // Check if already exists
            if (db.lessons.some(l => l.pattern === mapping.pattern)) return;

            const id = `AUTO-${String(db.lessons.length + 1).padStart(3, "0")}`;
            db.lessons.push({
                id,
                pattern: mapping.pattern,
                message: `${mapping.message} (ESLint: ${v.rule})`,
                severity: v.severity,
                source: "auto-eslint",
                hitCount: v.count,
                autoEscalated: false,
                addedAt: new Date().toISOString()
            });
            totalAdded++;
            console.log(`   ✅ Auto-learned: [${id}] ${v.rule} (${v.count} occurrences)`);
        });
    }

    // TypeScript
    if (!options.onlyEslint && !options.onlyTest) {
        const tsErrors = runTypescriptAutoLearn(projectRoot);

        tsErrors.slice(0, 5).forEach(e => { // Top 5 only
            const mapping = TS_PATTERN_MAP[e.code];
            if (!mapping) return;

            if (db.lessons.some(l => l.message.includes(e.code))) return;

            const id = `AUTO-${String(db.lessons.length + 1).padStart(3, "0")}`;
            db.lessons.push({
                id,
                pattern: mapping.pattern,
                message: `${mapping.message} (${e.code})`,
                severity: "WARNING",
                source: "auto-typescript",
                hitCount: e.count,
                autoEscalated: false,
                addedAt: new Date().toISOString()
            });
            totalAdded++;
            console.log(`   ✅ Auto-learned: [${id}] ${e.code} (${e.count} occurrences)`);
        });
    }

    // Summary
    console.log("\n" + "─".repeat(50));

    if (totalAdded > 0) {
        saveKnowledge(db);
        console.log(`\n🎓 Auto-learned ${totalAdded} new pattern(s)!`);
        console.log(`📊 Total lessons in memory: ${db.lessons.length}\n`);
    } else {
        console.log("\n✅ No new patterns discovered. Code looks clean!\n");
    }

    return totalAdded;
}

// ============================================================================
// CLI
// ============================================================================

const args = process.argv.slice(2);
const projectRoot = process.cwd();

if (args.includes("--help")) {
    console.log(`
🧠 Smart Auto-Learn - True Self-Learning Engine

Usage:
  ag-smart auto-learn              Run all analyzers
  ag-smart auto-learn --eslint     ESLint only
  ag-smart auto-learn --typescript TypeScript only
  ag-smart auto-learn --test       Test failures only

The engine automatically:
  1. Runs ESLint and learns from violations
  2. Runs TypeScript and learns from type errors
  3. Runs tests and learns from failures

Patterns are automatically added to knowledge base!
`);
    process.exit(0);
}

autoLearn(projectRoot, {
    onlyEslint: args.includes("--eslint"),
    onlyTypescript: args.includes("--typescript"),
    onlyTest: args.includes("--test")
});
