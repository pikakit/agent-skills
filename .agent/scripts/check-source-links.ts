#!/usr/bin/env node

import { readFileSync } from 'node:fs';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { discoverRuleFiles, discoverSkillDocuments, parseMarkdown } from './utils/skill-docs.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const SKILLS = resolve(ROOT, '.agent/skills');
const TIMEOUT_MS = 15_000;
const CONCURRENCY = 8;

function collectUrls(): string[] {
  const urls = new Set<string>();
  for (const skill of discoverSkillDocuments(SKILLS)) {
    for (const rule of discoverRuleFiles(skill.directory)) {
      const metadata = parseMarkdown(readFileSync(rule, 'utf8'), rule).frontmatter;
      if (!Array.isArray(metadata.sources)) continue;
      for (const source of metadata.sources) {
        if (typeof source === 'object' && source !== null && typeof (source as { url?: unknown }).url === 'string') {
          urls.add((source as { url: string }).url);
        }
      }
    }
  }
  return [...urls].sort();
}

async function request(url: string, method: 'HEAD' | 'GET'): Promise<Response> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    return await fetch(url, {
      method,
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'PikaKit-source-audit/1.0' },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function check(url: string): Promise<string | null> {
  try {
    let response = await request(url, 'HEAD');
    if (response.status === 405 || response.status === 403) response = await request(url, 'GET');
    return response.ok ? null : `${url}: HTTP ${response.status}`;
  } catch (error: unknown) {
    return `${url}: ${error instanceof Error ? error.message : String(error)}`;
  }
}

async function main(): Promise<void> {
  const urls = collectUrls();
  if (urls.length === 0) throw new Error('No source URLs found');
  const failures: string[] = [];
  let cursor = 0;
  async function worker(): Promise<void> {
    while (cursor < urls.length) {
      const index = cursor++;
      const failure = await check(urls[index]);
      if (failure) failures.push(failure);
    }
  }
  await Promise.all(Array.from({ length: Math.min(CONCURRENCY, urls.length) }, () => worker()));
  for (const failure of failures.sort()) console.error(failure);
  console.log(`Source link audit checked ${urls.length} unique URLs; ${failures.length} failed.`);
  if (failures.length > 0) process.exitCode = 1;
}

void main().catch((error: unknown) => {
  console.error(`Source link audit error: ${error instanceof Error ? error.message : String(error)}`);
  process.exitCode = 2;
});
