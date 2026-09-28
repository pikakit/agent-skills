#!/usr/bin/env node

import { existsSync } from 'node:fs';
import { readFile, readdir } from 'node:fs/promises';
import { dirname, extname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const IGNORE_DIRECTORIES = new Set(['.git', 'node_modules', 'dist', 'build', 'coverage']);

interface DocumentationIssue {
  file: string;
  line: number;
  message: string;
}

async function findMarkdown(directory: string): Promise<string[]> {
  const files: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    if (entry.isDirectory() && (IGNORE_DIRECTORIES.has(entry.name) || entry.name === 'docs')) continue;
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await findMarkdown(entryPath));
    else if (entry.isFile() && extname(entry.name).toLowerCase() === '.md' && entry.name !== 'AGENTS.md' && entry.name !== 'AGENTS.full.md') files.push(entryPath);
  }
  return files;
}

function lineAt(content: string, offset: number): number {
  return content.slice(0, offset).split(/\r?\n/).length;
}

function validateMarkdown(file: string, content: string): DocumentationIssue[] {
  const issues: DocumentationIssue[] = [];
  const relativeFile = file.slice(ROOT.length + 1);
  const linkPattern = /\[[^\]]*\]\(([^)\s]+)(?:\s+['"][^'"]*['"])?\)/g;
  const scriptPattern = /\.agent\/[A-Za-z0-9_./-]+\.(?:ts|js|mjs|py|sh)/g;
  const nodeTypescriptPattern = /\bnode\s+(\.agent\/[A-Za-z0-9_./-]+\.ts)\b/g;
  const linkContent = content.replace(/```[\s\S]*?```/g, block => block.replace(/[^\r\n]/g, ' '));

  for (const match of linkContent.matchAll(linkPattern)) {
    const target = match[1].replace(/^<|>$/g, '').split('#')[0];
    if (!target || /^(?:https?:|mailto:|data:|#)/i.test(target)) continue;
    let decoded: string;
    try {
      decoded = decodeURIComponent(target);
    } catch {
      issues.push({ file: relativeFile, line: lineAt(content, match.index ?? 0), message: `Invalid link encoding: ${target}` });
      continue;
    }
    if (!existsSync(resolve(dirname(file), decoded))) {
      issues.push({ file: relativeFile, line: lineAt(content, match.index ?? 0), message: `Missing local link target: ${target}` });
    }
  }

  if ((content.match(/^```/gm) ?? []).length % 2 !== 0) {
    issues.push({ file: relativeFile, line: content.split(/\r?\n/).length, message: 'Unbalanced fenced code block' });
  }

  for (const match of content.matchAll(scriptPattern)) {
    const target = match[0];
    if (!existsSync(resolve(ROOT, target))) {
      issues.push({ file: relativeFile, line: lineAt(content, match.index ?? 0), message: `Missing published script reference: ${target}` });
    }
  }

  for (const match of content.matchAll(nodeTypescriptPattern)) {
    issues.push({
      file: relativeFile,
      line: lineAt(content, match.index ?? 0),
      message: `TypeScript command must use "npx tsx", not "node": ${match[1]}`,
    });
  }

  return issues;
}

async function main(): Promise<void> {
  const markdownFiles = await findMarkdown(ROOT);
  const issues: DocumentationIssue[] = [];
  for (const file of markdownFiles) {
    issues.push(...validateMarkdown(file, await readFile(file, 'utf8')));
  }

  if (issues.length > 0) {
    for (const issue of issues) console.error(`${issue.file}:${issue.line} ${issue.message}`);
    console.error(`Documentation validation failed with ${issues.length} issue(s).`);
    process.exitCode = 1;
    return;
  }

  console.log(`Documentation validation passed (${markdownFiles.length} files).`);
}

void main().catch((error: unknown) => {
  console.error(error instanceof Error ? error.message : String(error));
  process.exitCode = 2;
});
