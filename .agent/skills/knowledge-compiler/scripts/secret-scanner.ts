#!/usr/bin/env node
/** Repository secret scanner. Exit codes: 0 clean, 1 violations, 2 scanner error. */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

interface SecretRule {
    id: string;
    type: string;
    pattern: RegExp;
    description: string;
    exclude?: RegExp;
}

export interface SecretViolation {
    id: string;
    type: string;
    description: string;
    line: number;
    file: string;
    snippet: string;
}

export interface ScanError {
    file: string;
    message: string;
}

export interface DirectoryScanResult {
    filesChecked: number;
    violations: SecretViolation[];
    errors: ScanError[];
}

interface TextScanResult {
    found: boolean;
    violations: SecretViolation[];
}

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ZERO_WIDTH_CHARS = /[\u200B\u200C\u200D\u200E\u200F\uFEFF\u00AD]/g;
const IGNORED_DIRECTORIES = new Set([
    '.git', '.cache', '.next', '.nuxt', '.output', '.turbo', '.vercel',
    'build', 'coverage', 'dist', 'node_modules', 'out', 'playwright-report',
    'test-results',
]);
const TEXT_EXTENSIONS = new Set([
    '.bash', '.cfg', '.cjs', '.conf', '.cs', '.css', '.csv', '.env', '.go',
    '.gql', '.graphql', '.html', '.ini', '.java', '.js', '.json', '.jsonc',
    '.jsx', '.kt', '.kts', '.md', '.mdx', '.mjs', '.php', '.ps1', '.py',
    '.rb', '.rs', '.scss', '.sh', '.sql', '.swift', '.toml', '.ts', '.tsx',
    '.txt', '.xml', '.yaml', '.yml', '.zsh',
]);
const TEXT_BASENAMES = new Set([
    '.netrc', '.npmrc', '.pypirc', '.yarnrc', 'dockerfile', 'gemfile',
    'makefile', 'procfile', 'requirements.txt',
]);

const SECRET_PATTERNS: SecretRule[] = [
    { id: 'SEC-01', type: 'anthropic-key', pattern: /\bsk-ant-[A-Za-z0-9_-]{20,}\b/, description: 'Anthropic API key' },
    { id: 'SEC-02', type: 'openai-key', pattern: /\bsk-(?:proj-)?[A-Za-z0-9][A-Za-z0-9_-]{20,}\b/, description: 'OpenAI API key', exclude: /\bsk-ant-/ },
    { id: 'SEC-03', type: 'github-token', pattern: /\b(?:gh[pousr]_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{80,})\b/, description: 'GitHub personal access token' },
    { id: 'SEC-04', type: 'aws-access-key', pattern: /\b(?:AKIA|ASIA)[0-9A-Z]{16}\b/, description: 'AWS access key ID' },
    { id: 'SEC-05', type: 'db-uri-credentials', pattern: /\b(?:postgres|mysql|mongodb|redis|amqp):\/\/[^:\s/@]+:[^@\s]{4,}@\S+/, description: 'Database connection URI with credentials' },
    { id: 'SEC-06', type: 'slack-token', pattern: /\bxox[baprs]-[A-Za-z0-9-]{10,}\b/, description: 'Slack API token' },
    { id: 'SEC-07', type: 'stripe-live-key', pattern: /\bsk_live_[A-Za-z0-9]{24,}\b/, description: 'Stripe live secret key' },
    { id: 'SEC-08', type: 'google-api-key', pattern: /\bAIza[0-9A-Za-z_-]{35}\b/, description: 'Google API key' },
    { id: 'SEC-09', type: 'vault-token', pattern: /\b(?:hvs|hvb|s)\.[A-Za-z0-9._-]{20,}\b/, description: 'HashiCorp Vault token' },
    { id: 'SEC-10', type: 'jwt', pattern: /\beyJ[A-Za-z0-9_=-]+\.[A-Za-z0-9_=-]+\.[A-Za-z0-9_.+/=-]*\b/, description: 'JSON Web Token' },
    { id: 'SEC-11', type: 'pem-private-key', pattern: /-----BEGIN (?:RSA |OPENSSH |DSA |EC )?PRIVATE KEY-----/, description: 'PEM private key block' },
    { id: 'SEC-12', type: 'bearer-token', pattern: /\bbearer\s+[A-Za-z0-9._~+/\-]{20,}\b/i, description: 'Bearer authentication token' },
];

function globalPattern(pattern: RegExp): RegExp {
    return new RegExp(pattern.source, pattern.flags.includes('g') ? pattern.flags : `${pattern.flags}g`);
}

function isFalsePositive(line: string, match: string): boolean {
    return /(?:YOUR[-_]?KEY[-_]?HERE|EXAMPLE|PLACEHOLDER|REDACTED)/i.test(match)
        || /^(?:postgres|mysql|mongodb|redis|amqp):\/\/test:test@(?:localhost|127\.0\.0\.1)(?:[/:]|$)/i.test(match)
        || /^x+$/i.test(match)
        || /^\*+$/.test(match);
}

function redactSecret(match: string): string {
    if (match.length <= 12) return `${match.slice(0, 4)}***`;
    return `${match.slice(0, 6)}***${match.slice(-4)}`;
}

function redactLine(line: string): string {
    let redacted = line;
    for (const rule of SECRET_PATTERNS) {
        redacted = redacted.replace(globalPattern(rule.pattern), match => (
            isFalsePositive(line, match) ? match : redactSecret(match)
        ));
    }
    return redacted;
}

export function scanForSecrets(content: string, filename = '<input>'): TextScanResult {
    const violations: SecretViolation[] = [];
    const lines = content.replace(ZERO_WIDTH_CHARS, '').split(/\r?\n/);

    for (let index = 0; index < lines.length; index++) {
        const line = lines[index];
        for (const rule of SECRET_PATTERNS) {
            for (const match of line.matchAll(globalPattern(rule.pattern))) {
                const value = match[0];
                if ((rule.exclude?.test(value) ?? false) || isFalsePositive(line, value)) continue;
                violations.push({
                    id: rule.id,
                    type: rule.type,
                    description: rule.description,
                    line: index + 1,
                    file: filename,
                    snippet: redactLine(line.trim()),
                });
            }
        }
    }

    return { found: violations.length > 0, violations };
}

function looksBinary(buffer: Buffer): boolean {
    const sampleLength = Math.min(buffer.length, 8_192);
    for (let index = 0; index < sampleLength; index++) {
        if (buffer[index] === 0) return true;
    }
    return false;
}

function shouldScanFile(filePath: string): boolean {
    const base = path.basename(filePath).toLowerCase();
    return base.startsWith('.env')
        || TEXT_BASENAMES.has(base)
        || TEXT_EXTENSIONS.has(path.extname(base));
}

function scanFile(filePath: string): { scanned: boolean; violations: SecretViolation[]; error?: ScanError } {
    try {
        const buffer = fs.readFileSync(filePath);
        if (looksBinary(buffer)) return { scanned: false, violations: [] };
        return { scanned: true, violations: scanForSecrets(buffer.toString('utf-8'), filePath).violations };
    } catch (error: unknown) {
        return {
            scanned: false,
            violations: [],
            error: { file: filePath, message: error instanceof Error ? error.message : String(error) },
        };
    }
}

export function scanDirectory(dirPath: string): DirectoryScanResult {
    const result: DirectoryScanResult = { filesChecked: 0, violations: [], errors: [] };

    const walk = (directory: string): void => {
        let entries: fs.Dirent[];
        try {
            entries = fs.readdirSync(directory, { withFileTypes: true });
        } catch (error: unknown) {
            result.errors.push({ file: directory, message: error instanceof Error ? error.message : String(error) });
            return;
        }

        for (const entry of entries) {
            const fullPath = path.join(directory, entry.name);
            if (entry.isSymbolicLink()) continue;
            if (entry.isDirectory()) {
                if (!IGNORED_DIRECTORIES.has(entry.name)) walk(fullPath);
                continue;
            }
            if (!entry.isFile() || !shouldScanFile(fullPath)) continue;
            const fileResult = scanFile(fullPath);
            if (fileResult.scanned) result.filesChecked++;
            result.violations.push(...fileResult.violations);
            if (fileResult.error) result.errors.push(fileResult.error);
        }
    };

    walk(dirPath);
    return result;
}

export function scanPath(targetPath: string): DirectoryScanResult {
    let stats: fs.Stats;
    try {
        stats = fs.statSync(targetPath);
    } catch (error: unknown) {
        return {
            filesChecked: 0,
            violations: [],
            errors: [{ file: targetPath, message: error instanceof Error ? error.message : String(error) }],
        };
    }
    if (stats.isDirectory()) return scanDirectory(targetPath);
    if (!stats.isFile()) {
        return { filesChecked: 0, violations: [], errors: [{ file: targetPath, message: 'Unsupported path type' }] };
    }
    const fileResult = scanFile(targetPath);
    return {
        filesChecked: fileResult.scanned ? 1 : 0,
        violations: fileResult.violations,
        errors: fileResult.error ? [fileResult.error] : [],
    };
}

function printText(targetPath: string, result: DirectoryScanResult): void {
    console.log('Secret Scanner - PikaKit');
    console.log(`Scanning: ${targetPath}`);
    console.log(`Files checked: ${result.filesChecked}`);
    for (const violation of result.violations) {
        console.log(`${violation.id} [${violation.type}] ${violation.file}:${violation.line}`);
        console.log(`  ${violation.description}`);
        console.log(`  ${violation.snippet}`);
    }
    for (const error of result.errors) console.error(`Scanner error: ${error.file}: ${error.message}`);
    if (result.errors.length > 0) console.log(`Status: ERROR (${result.errors.length} unreadable path(s))`);
    else if (result.violations.length > 0) console.log(`Status: FAILED (${result.violations.length} violation(s))`);
    else console.log('Status: CLEAN');
}

export function runSecretScannerCli(args: string[]): number {
    const json = args.includes('--json');
    const positional = args.filter(arg => !arg.startsWith('--'));
    const scanAll = args.includes('--all');
    if ((!scanAll && positional.length !== 1) || (scanAll && positional.length > 0)) {
        const message = 'Usage: secret-scanner.ts <path|--all> [--json]';
        if (json) console.log(JSON.stringify({ status: 'ERROR', error: message }));
        else console.error(message);
        return 2;
    }

    const targetPath = scanAll
        ? path.resolve(__dirname, '..', '..', '..', '..')
        : path.resolve(positional[0]);
    const result = scanPath(targetPath);
    const status = result.errors.length > 0
        ? 'ERROR'
        : result.violations.length > 0 ? 'FAILED' : 'CLEAN';
    if (json) console.log(JSON.stringify({ status, targetPath, ...result }));
    else printText(targetPath, result);
    return status === 'CLEAN' ? 0 : status === 'FAILED' ? 1 : 2;
}

const isMain = process.argv[1]
    && path.resolve(process.argv[1]) === path.resolve(fileURLToPath(import.meta.url));
if (isMain) process.exitCode = runSecretScannerCli(process.argv.slice(2));
