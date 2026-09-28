import { readFileSync, readdirSync, statSync } from 'node:fs';
import { dirname, join, relative, resolve, sep } from 'node:path';
import { parse } from 'yaml';

export interface ParsedMarkdown<T extends Record<string, unknown> = Record<string, unknown>> {
  frontmatter: T;
  frontmatterText: string;
  body: string;
}

export interface SkillDocument {
  directory: string;
  id: string;
  path: string;
  parsed: ParsedMarkdown;
  parseError?: string;
}

export function normalizeNewlines(value: string): string {
  return value.replace(/^\uFEFF/, '').replace(/\r\n?/g, '\n');
}

export function parseMarkdown<T extends Record<string, unknown> = Record<string, unknown>>(
  content: string,
  label: string,
): ParsedMarkdown<T> {
  const normalized = normalizeNewlines(content);
  const match = normalized.match(/^---\n([\s\S]*?)\n---(?:\n|$)([\s\S]*)$/);
  if (!match) throw new Error(`${label}: missing YAML frontmatter`);
  let parsed: unknown;
  try {
    parsed = parse(match[1]);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message.split(/\r?\n/, 1)[0] : String(error);
    throw new Error(`${label}: Invalid YAML frontmatter: ${message}`);
  }
  if (typeof parsed !== 'object' || parsed === null || Array.isArray(parsed)) {
    throw new Error(`${label}: frontmatter must be a mapping`);
  }
  return { frontmatter: parsed as T, frontmatterText: match[1], body: match[2] };
}

export function discoverSkillDocuments(skillsDirectory: string): SkillDocument[] {
  const documents: SkillDocument[] = [];
  function visit(directory: string): void {
    for (const entry of readdirSync(directory, { withFileTypes: true })) {
      if (!entry.isDirectory()) continue;
      const child = join(directory, entry.name);
      const descriptor = join(child, 'SKILL.md');
      try {
        if (statSync(descriptor).isFile()) {
          const id = relative(skillsDirectory, child).split(sep).join('/');
          try {
            documents.push({
              directory: child,
              id,
              path: descriptor,
              parsed: parseMarkdown(readFileSync(descriptor, 'utf8'), descriptor),
            });
          } catch (error: unknown) {
            documents.push({
              directory: child,
              id,
              path: descriptor,
              parsed: { frontmatter: {}, frontmatterText: '', body: '' },
              parseError: error instanceof Error ? error.message : String(error),
            });
          }
        }
      } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
      }
      visit(child);
    }
  }
  visit(resolve(skillsDirectory));
  return documents.sort((a, b) => a.id.localeCompare(b.id));
}

export function discoverRuleFiles(skillDirectory: string): string[] {
  const rulesDirectory = join(skillDirectory, 'rules');
  try {
    return readdirSync(rulesDirectory, { withFileTypes: true })
      .filter(entry => entry.isFile() && entry.name.endsWith('.md') && !entry.name.startsWith('_'))
      .map(entry => join(rulesDirectory, entry.name))
      .sort((a, b) => a.localeCompare(b));
  } catch (error: unknown) {
    if ((error as NodeJS.ErrnoException).code === 'ENOENT') return [];
    throw error;
  }
}

export function slug(value: string): string {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
}

export function resolveInternalReference(rulePath: string, reference: string): string {
  return resolve(dirname(rulePath), reference);
}
