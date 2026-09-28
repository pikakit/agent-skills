#!/usr/bin/env node

import { existsSync, mkdirSync, readFileSync, writeFileSync } from 'node:fs';
import { basename, dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverRuleFiles, discoverSkillDocuments, normalizeNewlines, parseMarkdown, slug } from './utils/skill-docs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SKILLS = join(ROOT, '.agent', 'skills');
const COMPACT_LIMIT = 32 * 1024;

interface RuleRecord {
  anchor: string;
  body: string;
  file: string;
  impact: string;
  kind: string;
  summary: string;
  title: string;
}

export interface CompiledArtifacts {
  compact: string;
  compactPath: string;
  full: string;
  fullPath: string;
  ruleCount: number;
  skillId: string;
}

function stringField(record: Record<string, unknown>, key: string, fallback: string): string {
  return typeof record[key] === 'string' && record[key] ? String(record[key]) : fallback;
}

function firstGuidanceSentence(body: string, title: string): string {
  const candidate = body.split('\n')
    .map(line => line.trim())
    .find(line => line && !line.startsWith('#') && !line.startsWith('```') && !line.startsWith('---'));
  return (candidate ?? title).replace(/^>\s*/, '').replace(/\|/g, '\\|').slice(0, 200);
}

function readRules(skillDirectory: string): RuleRecord[] {
  return discoverRuleFiles(skillDirectory).map(file => {
    const parsed = parseMarkdown(readFileSync(file, 'utf8'), file);
    const fileStem = basename(file, '.md');
    const title = stringField(parsed.frontmatter, 'title', fileStem);
    return {
      anchor: `rule-${slug(fileStem)}`,
      body: parsed.body.trim(),
      file: basename(file),
      impact: stringField(parsed.frontmatter, 'impact', 'standard'),
      kind: stringField(parsed.frontmatter, 'kind', 'reference'),
      summary: firstGuidanceSentence(parsed.body, title),
      title,
    };
  });
}

function titleCase(value: string): string {
  return value.split(/[-/]/).map(part => part.charAt(0).toUpperCase() + part.slice(1)).join(' ');
}

export function compileSkill(skillDirectory: string, skillsDirectory = SKILLS): CompiledArtifacts {
  const descriptorPath = join(skillDirectory, 'SKILL.md');
  const descriptor = parseMarkdown(readFileSync(descriptorPath, 'utf8'), descriptorPath);
  const metadata = typeof descriptor.frontmatter.metadata === 'object' && descriptor.frontmatter.metadata !== null
    ? descriptor.frontmatter.metadata as Record<string, unknown>
    : {};
  const skillId = stringField(metadata, 'id', relative(skillsDirectory, skillDirectory).replace(/\\/g, '/'));
  const name = stringField(descriptor.frontmatter, 'name', skillId);
  const version = stringField(metadata, 'version', '0.0.0');
  const rules = readRules(skillDirectory);
  if (rules.length === 0) throw new Error(`${skillId}: no rule files found`);

  const compactLines = [
    `# ${titleCase(name)} Agent Rules`,
    '',
    `> Generated from ${rules.length} source rules for ${skillId} v${version}. Do not edit directly.`,
    '',
    '## Mandatory Rules',
    '',
    '| Impact | Kind | Rule | Requirement |',
    '|---|---|---|---|',
    ...rules.map(rule => `| ${rule.impact} | ${rule.kind} | [${rule.title}](references/AGENTS.full.md#${rule.anchor}) | ${rule.summary} |`),
    '',
    '## Use',
    '',
    'Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.',
    '',
  ];

  const fullLines = [
    `# ${titleCase(name)} Full Agent Rules`,
    '',
    `> Deterministic compilation of ${rules.length} source rules for ${skillId} v${version}. Do not edit directly.`,
    '',
    '## Rule Index',
    '',
    ...rules.map(rule => `- [${rule.title}](#${rule.anchor}) (${rule.impact}, ${rule.kind}, source: \`rules/${rule.file}\`)`),
    '',
    ...rules.flatMap(rule => [
      `<a id="${rule.anchor}"></a>`,
      '',
      `## ${rule.title}`,
      '',
      `**Impact:** ${rule.impact}  `,
      `**Kind:** ${rule.kind}  `,
      `**Source:** \`rules/${rule.file}\``,
      '',
      rule.body,
      '',
    ]),
  ];

  const compact = `${compactLines.join('\n').replace(/[ \t]+$/gm, '').trimEnd()}\n`;
  if (Buffer.byteLength(compact, 'utf8') > COMPACT_LIMIT) throw new Error(`${skillId}: compact AGENTS.md exceeds ${COMPACT_LIMIT} bytes`);
  const full = `${fullLines.join('\n').replace(/[ \t]+$/gm, '').trimEnd()}\n`;
  return {
    compact,
    compactPath: join(skillDirectory, 'AGENTS.md'),
    full,
    fullPath: join(skillDirectory, 'references', 'AGENTS.full.md'),
    ruleCount: rules.length,
    skillId,
  };
}

interface CliOptions { check: boolean; force: boolean; target?: string }

function parseArgs(args: string[]): CliOptions {
  const options: CliOptions = { check: false, force: false };
  for (const argument of args) {
    if (argument === '--check') options.check = true;
    else if (argument === '--force') options.force = true;
    else if (argument.startsWith('--')) throw new Error(`Unknown option: ${argument}`);
    else if (options.target) throw new Error('Only one skill target is supported');
    else options.target = argument.replace(/\\/g, '/');
  }
  return options;
}

function sameContent(path: string, expected: string): boolean {
  return existsSync(path) && normalizeNewlines(readFileSync(path, 'utf8')) === expected;
}

export function runCompiler(args = process.argv.slice(2), skillsDirectory = SKILLS): 0 | 1 | 2 {
  let options: CliOptions;
  try {
    options = parseArgs(args);
  } catch (error: unknown) {
    console.error(error instanceof Error ? error.message : String(error));
    return 2;
  }
  try {
    const descriptors = discoverSkillDocuments(skillsDirectory)
      .filter(skill => discoverRuleFiles(skill.directory).length > 0)
      .filter(skill => !options.target || skill.id === options.target);
    if (options.target && descriptors.length === 0) throw new Error(`Unknown or rule-less skill: ${options.target}`);
    if (descriptors.length === 0) throw new Error('No rule-based skills found');
    let stale = 0;
    for (const descriptor of descriptors) {
      const artifact = compileSkill(descriptor.directory, skillsDirectory);
      if (options.check) {
        const compactOk = sameContent(artifact.compactPath, artifact.compact);
        const fullOk = sameContent(artifact.fullPath, artifact.full);
        if (!compactOk || !fullOk) {
          stale += 1;
          console.error(`${artifact.skillId}: stale ${[!compactOk && 'AGENTS.md', !fullOk && 'references/AGENTS.full.md'].filter(Boolean).join(' and ')}`);
        }
      } else {
        mkdirSync(dirname(artifact.fullPath), { recursive: true });
        writeFileSync(artifact.compactPath, artifact.compact, 'utf8');
        writeFileSync(artifact.fullPath, artifact.full, 'utf8');
        console.log(`${artifact.skillId}: compiled ${artifact.ruleCount} rules`);
      }
    }
    console.log(`${options.check ? 'Checked' : 'Compiled'} ${descriptors.length} skill artifacts.`);
    return stale === 0 ? 0 : 1;
  } catch (error: unknown) {
    console.error(`Compile error: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = runCompiler();
