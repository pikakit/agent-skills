#!/usr/bin/env node
/** Audit workflow files for the required PikaKit contract. */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'yaml';

export interface WorkflowAuditResult {
    file: string;
    issues: string[];
}

function frontmatterOf(content: string): string | null {
    const normalized = content.charCodeAt(0) === 0xFEFF ? content.slice(1) : content;
    return normalized.match(/^---\r?\n([\s\S]*?)\r?\n---/)?.[1] ?? null;
}

function isRecord(value: unknown): value is Record<string, unknown> {
    return typeof value === 'object' && value !== null && !Array.isArray(value);
}

export function auditWorkflowContent(file: string, content: string): WorkflowAuditResult {
    const issues: string[] = [];
    const frontmatter = frontmatterOf(content);
    if (!frontmatter) {
        issues.push('Missing YAML frontmatter');
    } else {
        try {
            const metadata: unknown = parse(frontmatter);
            if (!isRecord(metadata)) {
                issues.push('YAML frontmatter must be a mapping');
            } else {
                if (!Array.isArray(metadata.skills) || metadata.skills.length === 0
                    || metadata.skills.some(value => typeof value !== 'string' || value.trim() === '')) {
                    issues.push('skills must be a non-empty string array in YAML');
                }
                if (!Array.isArray(metadata.agents) || metadata.agents.length === 0
                    || metadata.agents.some(value => typeof value !== 'string' || value.trim() === '')) {
                    issues.push('agents must be a non-empty string array in YAML');
                }
            }
        } catch (error: unknown) {
            const message = error instanceof Error ? error.message.split(/\r?\n/, 1)[0] : String(error);
            issues.push(`Invalid YAML frontmatter: ${message}`);
        }
    }
    if (!/auto-learned|Auto-Learned/i.test(content)) issues.push('Missing Auto-Learned Pattern check');
    if (!/Exit Gate|Problem Verification|@\[current_problems\]/i.test(content)) issues.push('Missing Exit Gates');
    if (!/Rollback/i.test(content)) issues.push('Missing Rollback section');
    return { file, issues };
}

export function auditWorkflows(projectPath: string): WorkflowAuditResult[] {
    const directory = path.resolve(projectPath, '.agent/workflows');
    const files = fs.readdirSync(directory).filter(file => file.endsWith('.md')).sort();
    if (files.length === 0) {
        return [{ file: '<none>', issues: ['No workflow files found'] }];
    }
    return files.map(file => auditWorkflowContent(
        file,
        fs.readFileSync(path.join(directory, file), 'utf8')
    ));
}

export function main(args = process.argv.slice(2)): 0 | 1 | 2 {
    if (args.length > 1 || args.some(arg => arg.startsWith('-'))) {
        console.error('Usage: npx tsx audit_workflows.ts [project]');
        return 2;
    }
    const projectPath = path.resolve(args[0] || '.');
    try {
        const results = auditWorkflows(projectPath);
        let issueCount = 0;
        for (const result of results) {
            if (result.issues.length > 0) {
                issueCount += result.issues.length;
                console.log(`❌ ${result.file} -> ${result.issues.join(', ')}`);
            } else {
                console.log(`✅ ${result.file} -> FAANG compliant!`);
            }
        }
        if (issueCount > 0) {
            console.log(`\n❌ Workflow audit failed: ${issueCount} issue(s)`);
            return 1;
        }
        console.log(`\n✅ Workflow audit passed: ${results.length} workflow(s)`);
        return 0;
    } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(`Workflow audit error: ${message}`);
        return 2;
    }
}

const isMain = process.argv[1] && fileURLToPath(import.meta.url) === path.resolve(process.argv[1]);
if (isMain) process.exitCode = main();
