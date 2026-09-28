#!/usr/bin/env node

import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { dirname, join, relative, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverRuleFiles, discoverSkillDocuments, normalizeNewlines, parseMarkdown } from './utils/skill-docs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SKILLS = join(ROOT, '.agent', 'skills');
const MAP_PATH = join(ROOT, '.agent', 'standards', 'migration-map.json');

interface MigrationEntry {
  source: string;
  targets: string[];
  sections: string[];
  status: 'reviewed';
}

interface MigrationMap {
  schema_version: '1.0.0';
  policy: string;
  entries: MigrationEntry[];
  legacy_entries: LegacyMigrationEntry[];
}

export interface LegacyMigrationEntry {
  source: string;
  targets: Array<{ file: string; section: string }>;
}

function headings(body: string): string[] {
  return [...body.matchAll(/^#{1,3}\s+(.+)$/gm)].map(match => match[1].trim());
}

export function buildMigrationMap(
  skillsDirectory = SKILLS,
  legacyEntries: LegacyMigrationEntry[] = [],
): MigrationMap {
  const entries: MigrationEntry[] = [];
  for (const descriptor of discoverSkillDocuments(skillsDirectory)) {
    const descriptorPath = relative(ROOT, descriptor.path).replace(/\\/g, '/');
    entries.push({
      source: descriptorPath,
      targets: [descriptorPath],
      sections: headings(descriptor.parsed.body),
      status: 'reviewed',
    });
    for (const rule of discoverRuleFiles(descriptor.directory)) {
      const rulePath = relative(ROOT, rule).replace(/\\/g, '/');
      entries.push({
        source: rulePath,
        targets: [rulePath],
        sections: headings(parseMarkdown(readFileSync(rule, 'utf8'), rule).body),
        status: 'reviewed',
      });
    }
  }
  return {
    schema_version: '1.0.0',
    policy: 'Every v2 descriptor and substantive rule maps to its reviewed production location; explicit split mappings may add targets.',
    entries: entries.sort((a, b) => a.source.localeCompare(b.source)),
    legacy_entries: [...legacyEntries].sort((a, b) => a.source.localeCompare(b.source)),
  };
}

function readLegacyEntries(): LegacyMigrationEntry[] {
  if (!existsSync(MAP_PATH)) return [];
  const parsed = JSON.parse(readFileSync(MAP_PATH, 'utf8')) as Partial<MigrationMap>;
  return Array.isArray(parsed.legacy_entries) ? parsed.legacy_entries : [];
}

function readWaveEntries(existing: LegacyMigrationEntry[]): LegacyMigrationEntry[] {
  const merged = new Map(existing.map(entry => [entry.source, entry]));
  for (const name of readdirSync(SKILLS).filter(file => /^\.wave\d+-migration-map\.json$/.test(file)).sort()) {
    const raw = JSON.parse(readFileSync(join(SKILLS, name), 'utf8')) as Array<{
      skill: string;
      from: string;
      to: Array<{ file: string; section: string }>;
    }>;
    for (const entry of raw) {
      const source = `.agent/skills/${entry.skill}/${entry.from}`;
      merged.set(source, {
        source,
        targets: entry.to.map(target => ({
          file: `.agent/skills/${entry.skill}/${target.file}`,
          section: target.section,
        })),
      });
    }
  }
  return [...merged.values()];
}

function validateLegacyEntries(entries: LegacyMigrationEntry[]): string[] {
  const issues: string[] = [];
  const sources = new Set<string>();
  for (const entry of entries) {
    if (!entry.source || sources.has(entry.source)) issues.push(`duplicate or empty legacy source: ${entry.source}`);
    sources.add(entry.source);
    if (!Array.isArray(entry.targets) || entry.targets.length === 0) issues.push(`${entry.source}: no migration target`);
    for (const target of entry.targets ?? []) {
      const path = resolve(ROOT, target.file);
      if (!existsSync(path)) issues.push(`${entry.source}: missing target ${target.file}`);
      else if (target.section && !readFileSync(path, 'utf8').includes(target.section)) {
        issues.push(`${entry.source}: missing target section "${target.section}" in ${target.file}`);
      }
    }
  }
  return issues;
}

export function main(args = process.argv.slice(2)): 0 | 1 | 2 {
  const update = args.length === 1 && args[0] === '--update';
  if (args.length > (update ? 1 : 0)) {
    console.error('Usage: npx tsx .agent/scripts/migration-map.ts [--update]');
    return 2;
  }
  try {
    const legacyEntries = update ? readWaveEntries(readLegacyEntries()) : readLegacyEntries();
    const legacyIssues = validateLegacyEntries(legacyEntries);
    if (legacyIssues.length > 0) {
      for (const issue of legacyIssues) console.error(issue);
      return 1;
    }
    const serialized = `${JSON.stringify(buildMigrationMap(SKILLS, legacyEntries), null, 2)}\n`;
    if (update) writeFileSync(MAP_PATH, serialized, 'utf8');
    else if (!existsSync(MAP_PATH) || normalizeNewlines(readFileSync(MAP_PATH, 'utf8')) !== serialized) {
      console.error('Migration map is missing or stale; run with --update');
      return 1;
    }
    const count = JSON.parse(serialized) as MigrationMap;
    console.log(`Migration map covers ${count.entries.length} current files and ${count.legacy_entries.length} legacy paths.`);
    return 0;
  } catch (error: unknown) {
    console.error(`Migration map error: ${error instanceof Error ? error.message : String(error)}`);
    return 2;
  }
}

const isMain = process.argv[1] && resolve(process.argv[1]) === fileURLToPath(import.meta.url);
if (isMain) process.exitCode = main();
