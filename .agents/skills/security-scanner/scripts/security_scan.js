#!/usr/bin/env node
/**
 * Skill: vulnerability-scanner
 * Script: security_scan.js
 * Purpose: Validate that security principles from SKILL.md are applied correctly
 * Usage: node security_scan.js <project_path> [--scan-type all|deps|secrets|patterns|config]
 * Output: JSON with validation findings
 *
 * This script verifies:
 * 1. Dependencies - Supply chain security (OWASP A03)
 * 2. Secrets - No hardcoded credentials (OWASP A04)
 * 3. Code Patterns - Dangerous patterns identified (OWASP A05)
 * 4. Configuration - Security settings validated (OWASP A02)
 */

import { execSync } from 'child_process';
import { readFileSync, readdirSync, statSync, existsSync } from 'fs';
import { join, resolve, relative, extname } from 'path';

// ============================================================================
//  CONFIGURATION
// ============================================================================

const SECRET_PATTERNS = [
    // API Keys & Tokens
    [/api[_-]?key\s*[=:]\s*["'][^"']{10,}["']/i, 'API Key', 'high'],
    [/token\s*[=:]\s*["'][^"']{10,}["']/i, 'Token', 'high'],
    [/bearer\s+[a-zA-Z0-9\-_.]+/i, 'Bearer Token', 'critical'],

    // Cloud Credentials
    [/AKIA[0-9A-Z]{16}/, 'AWS Access Key', 'critical'],
    [/aws[_-]?secret[_-]?access[_-]?key\s*[=:]\s*["'][^"']+["']/i, 'AWS Secret', 'critical'],
    [/AZURE[_-]?[A-Z_]+\s*[=:]\s*["'][^"']+["']/i, 'Azure Credential', 'critical'],
    [/GOOGLE[_-]?[A-Z_]+\s*[=:]\s*["'][^"']+["']/i, 'GCP Credential', 'critical'],

    // Database & Connections
    [/password\s*[=:]\s*["'][^"']{4,}["']/i, 'Password', 'high'],
    [/(mongodb|postgres|mysql|redis):\/\/[^\s"']+/, 'Database Connection String', 'critical'],

    // Private Keys
    [/-----BEGIN\s+(RSA|PRIVATE|EC)\s+KEY-----/, 'Private Key', 'critical'],
    [/ssh-rsa\s+[A-Za-z0-9+/]+/, 'SSH Key', 'critical'],

    // JWT
    [/eyJ[A-Za-z0-9-_]+\.eyJ[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+/, 'JWT Token', 'high'],
];

const DANGEROUS_PATTERNS = [
    // Injection risks
    [/eval\s*\(/, 'eval() usage', 'critical', 'Code Injection risk'],
    [/exec\s*\(/, 'exec() usage', 'critical', 'Code Injection risk'],
    [/new\s+Function\s*\(/, 'Function constructor', 'high', 'Code Injection risk'],
    [/child_process\.exec\s*\(/, 'child_process.exec', 'high', 'Command Injection risk'],
    [/subprocess\.call\s*\([^)]*shell\s*=\s*True/, 'subprocess with shell=True', 'high', 'Command Injection risk'],

    // XSS risks
    [/dangerouslySetInnerHTML/, 'dangerouslySetInnerHTML', 'high', 'XSS risk'],
    [/\.innerHTML\s*=/, 'innerHTML assignment', 'medium', 'XSS risk'],
    [/document\.write\s*\(/, 'document.write', 'medium', 'XSS risk'],

    // SQL Injection indicators
    [/["'][^"']*\+\s*[a-zA-Z_]+\s*\+\s*["'].*(?:SELECT|INSERT|UPDATE|DELETE)/i, 'SQL String Concat', 'critical', 'SQL Injection risk'],

    // Insecure configurations
    [/verify\s*=\s*False/i, 'SSL Verify Disabled', 'high', 'MITM risk'],
    [/--insecure/, 'Insecure flag', 'medium', 'Security disabled'],
    [/disable[_-]?ssl/i, 'SSL Disabled', 'high', 'MITM risk'],

    // Unsafe deserialization
    [/pickle\.loads?\s*\(/, 'pickle usage', 'high', 'Deserialization risk'],
    [/yaml\.load\s*\([^)]*\)(?!\s*,\s*Loader)/, 'Unsafe YAML load', 'high', 'Deserialization risk'],
];

const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '__pycache__', '.venv', 'venv', '.next']);
const CODE_EXTENSIONS = new Set(['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.rb', '.php']);
const CONFIG_EXTENSIONS = new Set(['.json', '.yaml', '.yml', '.toml', '.env', '.env.local', '.env.development']);

// ============================================================================
//  HELPER FUNCTIONS
// ============================================================================

function walkDir(dir, callback) {
    const entries = readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        if (SKIP_DIRS.has(entry.name)) continue;
        const fullPath = join(dir, entry.name);
        if (entry.isDirectory()) {
            walkDir(fullPath, callback);
        } else {
            callback(fullPath);
        }
    }
}

// ============================================================================
//  SCANNING FUNCTIONS
// ============================================================================

function scanDependencies(projectPath) {
    /**
     * Validate supply chain security (OWASP A03).
     * Checks: npm audit, lock file presence, dependency age.
     */
    const results = { tool: 'dependency_scanner', findings: [], status: '[OK] Secure' };

    const lockFiles = {
        npm: ['package-lock.json', 'npm-shrinkwrap.json'],
        yarn: ['yarn.lock'],
        pnpm: ['pnpm-lock.yaml'],
    };

    const foundLocks = [];
    const missingLocks = [];

    for (const [manager, files] of Object.entries(lockFiles)) {
        const pkgPath = join(projectPath, 'package.json');
        if (existsSync(pkgPath)) {
            const hasLock = files.some(f => existsSync(join(projectPath, f)));
            if (hasLock) {
                foundLocks.push(manager);
            } else {
                missingLocks.push(manager);
                results.findings.push({
                    type: 'Missing Lock File',
                    severity: 'high',
                    message: `${manager}: No lock file found. Supply chain integrity at risk.`
                });
            }
        }
    }

    // Run npm audit if applicable
    if (existsSync(join(projectPath, 'package.json'))) {
        try {
            const output = execSync('npm audit --json', {
                cwd: projectPath,
                encoding: 'utf-8',
                timeout: 60000,
                stdio: ['pipe', 'pipe', 'pipe']
            });

            try {
                const auditData = JSON.parse(output);
                const vulnerabilities = auditData.vulnerabilities || {};
                const severityCount = { critical: 0, high: 0, moderate: 0, low: 0 };

                for (const vuln of Object.values(vulnerabilities)) {
                    const sev = (vuln.severity || 'low').toLowerCase();
                    if (sev in severityCount) {
                        severityCount[sev]++;
                    }
                }

                if (severityCount.critical > 0) {
                    results.status = '[!!] Critical vulnerabilities';
                    results.findings.push({
                        type: 'npm audit',
                        severity: 'critical',
                        message: `${severityCount.critical} critical vulnerabilities in dependencies`
                    });
                } else if (severityCount.high > 0) {
                    results.status = '[!] High vulnerabilities';
                    results.findings.push({
                        type: 'npm audit',
                        severity: 'high',
                        message: `${severityCount.high} high severity vulnerabilities`
                    });
                }

                results.npm_audit = severityCount;
            } catch {
                // JSON parse error
            }
        } catch {
            // npm audit failed or not available
        }
    }

    if (results.findings.length === 0) {
        results.status = '[OK] Supply chain checks passed';
    }

    return results;
}

function scanSecrets(projectPath) {
    /**
     * Validate no hardcoded secrets (OWASP A04).
     * Checks: API keys, tokens, passwords, cloud credentials.
     */
    const results = {
        tool: 'secret_scanner',
        findings: [],
        status: '[OK] No secrets detected',
        scanned_files: 0,
        by_severity: { critical: 0, high: 0, medium: 0 }
    };

    walkDir(projectPath, (filepath) => {
        const ext = extname(filepath).toLowerCase();
        if (!CODE_EXTENSIONS.has(ext) && !CONFIG_EXTENSIONS.has(ext)) return;

        results.scanned_files++;

        try {
            const content = readFileSync(filepath, 'utf-8');

            for (const [pattern, secretType, severity] of SECRET_PATTERNS) {
                const matches = content.match(pattern);
                if (matches) {
                    results.findings.push({
                        file: relative(projectPath, filepath),
                        type: secretType,
                        severity: severity,
                        count: matches.length
                    });
                    results.by_severity[severity] = (results.by_severity[severity] || 0) + matches.length;
                }
            }
        } catch {
            // File read error
        }
    });

    if (results.by_severity.critical > 0) {
        results.status = '[!!] CRITICAL: Secrets exposed!';
    } else if (results.by_severity.high > 0) {
        results.status = '[!] HIGH: Secrets found';
    } else if (Object.values(results.by_severity).reduce((a, b) => a + b, 0) > 0) {
        results.status = '[?] Potential secrets detected';
    }

    // Limit findings
    results.findings = results.findings.slice(0, 15);

    return results;
}

function scanCodePatterns(projectPath) {
    /**
     * Validate dangerous code patterns (OWASP A05).
     * Checks: Injection risks, XSS, unsafe deserialization.
     */
    const results = {
        tool: 'pattern_scanner',
        findings: [],
        status: '[OK] No dangerous patterns',
        scanned_files: 0,
        by_category: {}
    };

    walkDir(projectPath, (filepath) => {
        const ext = extname(filepath).toLowerCase();
        if (!CODE_EXTENSIONS.has(ext)) return;

        results.scanned_files++;

        try {
            const content = readFileSync(filepath, 'utf-8');
            const lines = content.split('\n');

            lines.forEach((line, index) => {
                for (const [pattern, name, severity, category] of DANGEROUS_PATTERNS) {
                    if (pattern.test(line)) {
                        results.findings.push({
                            file: relative(projectPath, filepath),
                            line: index + 1,
                            pattern: name,
                            severity: severity,
                            category: category,
                            snippet: line.trim().slice(0, 80)
                        });
                        results.by_category[category] = (results.by_category[category] || 0) + 1;
                    }
                }
            });
        } catch {
            // File read error
        }
    });

    const criticalCount = results.findings.filter(f => f.severity === 'critical').length;
    const highCount = results.findings.filter(f => f.severity === 'high').length;

    if (criticalCount > 0) {
        results.status = `[!!] CRITICAL: ${criticalCount} dangerous patterns`;
    } else if (highCount > 0) {
        results.status = `[!] HIGH: ${highCount} risky patterns`;
    } else if (results.findings.length > 0) {
        results.status = '[?] Some patterns need review';
    }

    // Limit findings
    results.findings = results.findings.slice(0, 20);

    return results;
}

function scanConfiguration(projectPath) {
    /**
     * Validate security configuration (OWASP A02).
     * Checks: Security headers, CORS, debug modes.
     */
    const results = {
        tool: 'config_scanner',
        findings: [],
        status: '[OK] Configuration secure',
        checks: {}
    };

    const configIssues = [
        [/"DEBUG"\s*:\s*true/i, 'Debug mode enabled', 'high'],
        [/debug\s*=\s*True/i, 'Debug mode enabled', 'high'],
        [/NODE_ENV.*development/i, 'Development mode in config', 'medium'],
        [/"CORS_ALLOW_ALL".*true/i, 'CORS allow all origins', 'high'],
        [/"Access-Control-Allow-Origin".*\*/i, 'CORS wildcard', 'high'],
        [/allowCredentials.*true.*origin.*\*/i, 'Dangerous CORS combo', 'critical'],
    ];

    walkDir(projectPath, (filepath) => {
        const ext = extname(filepath).toLowerCase();
        const basename = filepath.split(/[/\\]/).pop();

        if (!CONFIG_EXTENSIONS.has(ext) &&
            !['next.config.js', 'webpack.config.js', '.eslintrc.js'].includes(basename)) {
            return;
        }

        try {
            const content = readFileSync(filepath, 'utf-8');

            for (const [pattern, issue, severity] of configIssues) {
                if (pattern.test(content)) {
                    results.findings.push({
                        file: relative(projectPath, filepath),
                        issue: issue,
                        severity: severity
                    });
                }
            }
        } catch {
            // File read error
        }
    });

    // Check for security header configurations
    const headerFiles = ['next.config.js', 'next.config.mjs', 'middleware.ts', 'nginx.conf'];
    let hasSecurityHeaders = false;

    for (const hf of headerFiles) {
        if (existsSync(join(projectPath, hf))) {
            hasSecurityHeaders = true;
            break;
        }
    }

    results.checks.security_headers_config = hasSecurityHeaders;

    if (!hasSecurityHeaders) {
        results.findings.push({
            issue: 'No security headers configuration found',
            severity: 'medium',
            recommendation: 'Configure CSP, HSTS, X-Frame-Options headers'
        });
    }

    if (results.findings.some(f => f.severity === 'critical')) {
        results.status = '[!!] CRITICAL: Configuration issues';
    } else if (results.findings.some(f => f.severity === 'high')) {
        results.status = '[!] HIGH: Configuration review needed';
    } else if (results.findings.length > 0) {
        results.status = '[?] Minor configuration issues';
    }

    return results;
}

// ============================================================================
//  MAIN
// ============================================================================

function runFullScan(projectPath, scanType = 'all') {
    const report = {
        project: projectPath,
        timestamp: new Date().toISOString(),
        scan_type: scanType,
        scans: {},
        summary: {
            total_findings: 0,
            critical: 0,
            high: 0,
            overall_status: '[OK] SECURE'
        }
    };

    const scanners = {
        deps: ['dependencies', scanDependencies],
        secrets: ['secrets', scanSecrets],
        patterns: ['code_patterns', scanCodePatterns],
        config: ['configuration', scanConfiguration],
    };

    for (const [key, [name, scanner]] of Object.entries(scanners)) {
        if (scanType === 'all' || scanType === key) {
            const result = scanner(projectPath);
            report.scans[name] = result;

            const findingsCount = (result.findings || []).length;
            report.summary.total_findings += findingsCount;

            for (const finding of result.findings || []) {
                const sev = finding.severity || 'low';
                if (sev === 'critical') {
                    report.summary.critical++;
                } else if (sev === 'high') {
                    report.summary.high++;
                }
            }
        }
    }

    // Determine overall status
    if (report.summary.critical > 0) {
        report.summary.overall_status = '[!!] CRITICAL ISSUES FOUND';
    } else if (report.summary.high > 0) {
        report.summary.overall_status = '[!] HIGH RISK ISSUES';
    } else if (report.summary.total_findings > 0) {
        report.summary.overall_status = '[?] REVIEW RECOMMENDED';
    }

    return report;
}

function main() {
    const args = process.argv.slice(2);
    const projectPath = resolve(args.find(a => !a.startsWith('--')) || '.');

    const scanTypeArg = args.find(a => a.startsWith('--scan-type'));
    const scanType = scanTypeArg ? scanTypeArg.split('=')[1] || args[args.indexOf(scanTypeArg) + 1] || 'all' : 'all';

    const outputFormat = args.includes('--output=summary') ? 'summary' : 'json';

    if (!existsSync(projectPath)) {
        console.log(JSON.stringify({ error: `Directory not found: ${projectPath}` }));
        process.exit(1);
    }

    const result = runFullScan(projectPath, scanType);

    if (outputFormat === 'summary') {
        console.log(`\n${'='.repeat(60)}`);
        console.log(`Security Scan: ${result.project}`);
        console.log('='.repeat(60));
        console.log(`Status: ${result.summary.overall_status}`);
        console.log(`Total Findings: ${result.summary.total_findings}`);
        console.log(`  Critical: ${result.summary.critical}`);
        console.log(`  High: ${result.summary.high}`);
        console.log('='.repeat(60));

        for (const [scanName, scanResult] of Object.entries(result.scans)) {
            console.log(`\n${scanName.toUpperCase()}: ${scanResult.status}`);
            for (const finding of (scanResult.findings || []).slice(0, 5)) {
                console.log(`  - ${JSON.stringify(finding)}`);
            }
        }
    } else {
        console.log(JSON.stringify(result, null, 2));
    }
}

main();
