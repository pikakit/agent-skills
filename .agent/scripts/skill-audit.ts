#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { createRequire } from 'node:module';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { Ajv2020, type ErrorObject, type ValidateFunction } from 'ajv/dist/2020.js';
import type { FormatsPlugin } from 'ajv-formats';
import { parse } from 'yaml';
import {
  discoverRuleFiles,
  discoverSkillDocuments,
  parseMarkdown,
  resolveInternalReference,
  type ParsedMarkdown,
  type SkillDocument,
} from './utils/skill-docs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const require = createRequire(import.meta.url);
const addFormats: FormatsPlugin = require('ajv-formats');
const DEFAULT_SKILLS = join(ROOT, '.agent', 'skills');
const STANDARDS = join(ROOT, '.agent', 'standards');
const SKILL_LIMIT = 6 * 1024;
const FRONTMATTER_LIMIT = 1024;
const RULE_LIMIT = 8 * 1024;
const REFERENCE_LIMIT = 16 * 1024;
const REVIEW_DAYS: Record<string, number> = { critical: 90, high: 180, standard: 365 };
const REQUIRED_HEADINGS: Record<string, string[]> = {
  code: ['Incorrect', 'Correct', 'Verification'],
  process: ['Preconditions', 'Procedure', 'Rollback', 'Exit Gate'],
  decision: ['Decision', 'Use When', 'Avoid When', 'Trade-offs', 'Verification'],
  reference: ['Scope', 'Guidance', 'Verification'],
};

export interface AuditIssue { file: string; message: string }
export interface CheckResult { name: string; passed: number; total: number; issues: string[] }
export interface AuditReport {
  schema_version: '2.0.0';
  status: 'passed' | 'failed' | 'error';
  descriptors: number;
  rules: number;
  warnings: 0;
  issues: AuditIssue[];
}

interface AuditContext {
  skillValidator: ValidateFunction;
  ruleValidator: ValidateFunction;
  allowedHosts: Set<string>;
  blockedUrls: Set<string>;
  internalRoots: string[];
  categories: Map<string, string>;
  descriptors: SkillDocument[];
}

function createValidators(standardsDirectory: string): Pick<AuditContext, 'skillValidator' | 'ruleValidator'> {
  const ajv = new Ajv2020({ allErrors: true, strict: true });
  addFormats(ajv);
  const load = (name: string): object => JSON.parse(readFileSync(join(standardsDirectory, name), 'utf8')) as object;
  return {
    skillValidator: ajv.compile(load('skill.schema.json')),
    ruleValidator: ajv.compile(load('rule.schema.json')),
  };
}

function schemaErrors(errors: ErrorObject[] | null | undefined): string {
  return (errors ?? []).map(error => `${error.instancePath || '/'} ${error.message ?? 'is invalid'}`).join('; ');
}

function metadataOf(parsed: ParsedMarkdown): Record<string, unknown> {
  const metadata = parsed.frontmatter.metadata;
  return typeof metadata === 'object' && metadata !== null && !Array.isArray(metadata)
    ? metadata as Record<string, unknown>
    : {};
}

function isFresh(dateValue: unknown, interval: unknown, now = new Date()): boolean {
  if (typeof dateValue !== 'string' || typeof interval !== 'number') return false;
  const reviewed = new Date(`${dateValue}T23:59:59.999Z`);
  return Number.isFinite(reviewed.getTime())
    && reviewed.getTime() + interval * 86_400_000 >= now.getTime();
}

function hasHeading(body: string, heading: string): boolean {
  const escaped = heading.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^##\\s+${escaped}\\s*$`, 'im').test(body);
}

function hasBalancedFences(body: string): boolean {
  return (body.match(/^```/gm) ?? []).length % 2 === 0;
}

function validateSources(
  rulePath: string,
  displayPath: string,
  metadata: Record<string, unknown>,
  context: AuditContext,
  issues: AuditIssue[],
): void {
  if (!Array.isArray(metadata.sources)) return;
  for (const source of metadata.sources) {
    if (typeof source !== 'object' || source === null || Array.isArray(source)) continue;
    const item = source as Record<string, unknown>;
    if (typeof item.url === 'string') {
      try {
        const host = new URL(item.url).hostname.toLowerCase();
        if (!context.allowedHosts.has(host)) issues.push({ file: displayPath, message: `unapproved source host: ${host}` });
        if (context.blockedUrls.has(item.url.replace(/\/$/, ''))) {
          issues.push({ file: displayPath, message: `source URL is too generic: ${item.url}` });
        }
      } catch {
        // URI shape errors are emitted by AJV.
      }
    }
    if (typeof item.internal_ref === 'string') {
      const target = resolveInternalReference(rulePath, item.internal_ref);
      const relativeTarget = relative(ROOT, target).replace(/\\/g, '/');
      if (!existsSync(target)) issues.push({ file: displayPath, message: `missing internal_ref: ${item.internal_ref}` });
      else if (!context.internalRoots.some(root => relativeTarget === root || relativeTarget.startsWith(`${root}/`))) {
        issues.push({ file: displayPath, message: `internal_ref outside approved roots: ${item.internal_ref}` });
      }
    }
  }
}

function auditRule(rule: string, context: AuditContext): AuditIssue[] {
  const file = relative(ROOT, rule).replace(/\\/g, '/');
  const issues: AuditIssue[] = [];
  const raw = readFileSync(rule, 'utf8');
  if (Buffer.byteLength(raw, 'utf8') > RULE_LIMIT) issues.push({ file, message: `rule exceeds ${RULE_LIMIT} bytes` });
  let parsed: ParsedMarkdown;
  try {
    parsed = parseMarkdown(raw, file);
  } catch (error: unknown) {
    return [{ file, message: error instanceof Error ? error.message : String(error) }];
  }
  if (!context.ruleValidator(parsed.frontmatter)) {
    issues.push({ file, message: `rule schema: ${schemaErrors(context.ruleValidator.errors)}` });
    return issues;
  }
  const impact = String(parsed.frontmatter.impact);
  if (!isFresh(parsed.frontmatter.last_reviewed, REVIEW_DAYS[impact])) {
    issues.push({ file, message: `review is stale for ${impact} impact` });
  }
  const kind = String(parsed.frontmatter.kind);
  for (const heading of REQUIRED_HEADINGS[kind] ?? []) {
    if (!hasHeading(parsed.body, heading)) issues.push({ file, message: `${kind} rule missing "## ${heading}"` });
  }
  if (!hasBalancedFences(parsed.body)) issues.push({ file, message: 'unbalanced fenced code block' });
  validateSources(rule, file, parsed.frontmatter, context, issues);
  return issues;
}

function auditDescriptor(document: SkillDocument, context: AuditContext): AuditIssue[] {
  const file = relative(ROOT, document.path).replace(/\\/g, '/');
  const issues: AuditIssue[] = [];
  const raw = readFileSync(document.path, 'utf8');
  if (document.parseError) return [{ file, message: document.parseError }];
  if (Buffer.byteLength(raw, 'utf8') > SKILL_LIMIT) issues.push({ file, message: `SKILL.md exceeds ${SKILL_LIMIT} bytes` });
  if (Buffer.byteLength(document.parsed.frontmatterText, 'utf8') > FRONTMATTER_LIMIT) {
    issues.push({ file, message: `frontmatter exceeds ${FRONTMATTER_LIMIT} bytes` });
  }
  if (!context.skillValidator(document.parsed.frontmatter)) {
    issues.push({ file, message: `skill schema: ${schemaErrors(context.skillValidator.errors)}` });
    return issues;
  }
  const metadata = metadataOf(document.parsed);
  if (metadata.id !== document.id) issues.push({ file, message: `metadata.id must be ${document.id}` });
  if (!isFresh(metadata.last_reviewed, metadata.review_interval_days)) issues.push({ file, message: 'descriptor review is stale' });
  const rootId = document.id.split('/')[0];
  const expectedCategory = context.categories.get(rootId);
  if (!expectedCategory) issues.push({ file, message: `skill is missing from taxonomy: ${rootId}` });
  else if (metadata.category !== expectedCategory) {
    issues.push({ file, message: `metadata.category must be ${expectedCategory}` });
  }
  const known = new Set(context.descriptors.flatMap(skill => [skill.id, skill.id.split('/')[0]]));
  for (const coordinate of metadata.coordinates_with as string[]) {
    if (coordinate === document.id) issues.push({ file, message: `self coordination: ${coordinate}` });
    else if (!known.has(coordinate)) issues.push({ file, message: `unknown coordination target: ${coordinate}` });
  }
  if (!hasBalancedFences(document.parsed.body)) issues.push({ file, message: 'unbalanced fenced code block' });
  return issues;
}

function loadContext(skillsDirectory: string, standardsDirectory: string): AuditContext {
  const policy = parse(readFileSync(join(standardsDirectory, 'source-policy.yml'), 'utf8')) as {
    blocked_urls?: string[];
    allowed_hosts: string[];
    internal_roots: string[];
  };
  const taxonomy = parse(readFileSync(join(standardsDirectory, 'taxonomy.yml'), 'utf8')) as {
    categories: Record<string, string[]>;
  };
  const categories = new Map<string, string>();
  for (const [category, skills] of Object.entries(taxonomy.categories)) {
    for (const skill of skills) categories.set(skill, category);
  }
  return {
    ...createValidators(standardsDirectory),
    allowedHosts: new Set(policy.allowed_hosts.map(host => host.toLowerCase())),
    blockedUrls: new Set((policy.blocked_urls ?? []).map(url => url.replace(/\/$/, ''))),
    internalRoots: policy.internal_roots,
    categories,
    descriptors: discoverSkillDocuments(skillsDirectory),
  };
}

function referenceFiles(directory: string): string[] {
  const files: string[] = [];
  for (const entry of readdirSync(directory, { withFileTypes: true })) {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...referenceFiles(path));
    else if (entry.isFile()) files.push(path);
  }
  return files;
}

export function auditRepository(
  skillsDirectory = DEFAULT_SKILLS,
  target?: string,
  standardsDirectory = STANDARDS,
): AuditReport {
  const context = loadContext(skillsDirectory, standardsDirectory);
  const descriptors = target ? context.descriptors.filter(document => document.id === target) : context.descriptors;
  if (target && descriptors.length === 0) throw new Error(`Skill not found: ${target}`);
  if (descriptors.length === 0) throw new Error('No skill descriptors found');
  const issues: AuditIssue[] = [];
  let rules = 0;
  for (const descriptor of descriptors) {
    issues.push(...auditDescriptor(descriptor, context));
    for (const rule of discoverRuleFiles(descriptor.directory)) {
      rules += 1;
      issues.push(...auditRule(rule, context));
    }
    const references = join(descriptor.directory, 'references');
    if (!existsSync(references)) continue;
    for (const reference of referenceFiles(references)) {
      if (reference.endsWith('AGENTS.full.md')) continue;
      if (statSync(reference).size > REFERENCE_LIMIT) {
        issues.push({ file: relative(ROOT, reference).replace(/\\/g, '/'), message: `reference exceeds ${REFERENCE_LIMIT} bytes` });
      }
    }
  }
  return {
    schema_version: '2.0.0',
    status: issues.length === 0 ? 'passed' : 'failed',
    descriptors: descriptors.length,
    rules,
    warnings: 0,
    issues,
  };
}

export function auditSkill(skillName: string, skillsDirectory = DEFAULT_SKILLS): CheckResult {
  try {
    const report = auditRepository(skillsDirectory, skillName);
    return {
      name: skillName,
      passed: report.issues.length === 0 ? 1 : 0,
      total: 1,
      issues: report.issues.map(issue => {
        const marker = issue.message.indexOf('Invalid YAML frontmatter:');
        return marker >= 0 ? issue.message.slice(marker) : issue.message;
      }),
    };
  } catch (error: unknown) {
    return { name: skillName, passed: 0, total: 1, issues: [error instanceof Error ? error.message : String(error)] };
  }
}

interface CliOptions { format: 'text' | 'json'; target?: string }

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { format: 'text' };
  for (let index = 0; index < args.length; index += 1) {
    const argument = args[index];
    if (argument === '--format') {
      const value = args[++index];
      if (value !== 'text' && value !== 'json') throw new Error('--format must be text or json');
      options.format = value;
    } else if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`);
    else if (options.target) throw new Error('Only one skill target is supported');
    else options.target = argument.replace(/\\/g, '/');
  }
  if (options.target && (options.target === '.' || options.target === '..' || options.target.startsWith('../'))) {
    throw new Error(`Invalid skill target: ${options.target}`);
  }
  return options;
}

export function main(args = process.argv.slice(2)): 0 | 1 | 2 {
  let options: CliOptions;
  try {
    options = parseArgs(args);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }
  try {
    const report = auditRepository(DEFAULT_SKILLS, options.target);
    if (options.format === 'json') console.log(JSON.stringify(report, null, 2));
    else {
      for (const issue of report.issues) console.error(`${issue.file}: ${issue.message}`);
      console.log(`Skill audit ${report.status}: ${report.descriptors} descriptors, ${report.rules} rules, ${report.issues.length} issues.`);
    }
    return report.status === 'passed' ? 0 : 1;
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    if (message.startsWith('Skill not found:')) {
      if (options.format === 'json') {
        console.log(JSON.stringify({ schema_version: '2.0.0', status: 'failed', descriptors: 0, rules: 0, warnings: 0, issues: [{ file: options.target, message }] }));
      } else console.error(message);
      return 1;
    }
    if (options.format === 'json') console.log(JSON.stringify({ schema_version: '2.0.0', status: 'error', message }));
    else console.error(`Skill audit error: ${message}`);
    return 2;
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = main();
