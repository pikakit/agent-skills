import test from 'node:test';
import assert from 'node:assert/strict';
import { copyFile, mkdir, mkdtemp, readFile, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { auditRepository } from '../scripts/skill-audit.ts';
import { compileSkill, runCompiler } from '../scripts/compile-agents.ts';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const STANDARDS = join(ROOT, '.agent', 'standards');

const descriptor = `---
name: fixture
description: Use for fixture validation. Do not use for production deployment decisions.
metadata:
  id: fixture
  schema_version: "2.0.0"
  type: knowledge
  category: quality
  risk_tier: standard
  version: "1.0.0"
  author: tests
  triggers: [fixture audit, schema fixture, validation fixture]
  negative_triggers: [production deployment, unrelated writing]
  coordinates_with: []
  capabilities: [validation]
  platforms: [cross-platform]
  last_reviewed: 2026-09-28
  review_interval_days: 365
---
# Fixture

## Scope

Validate fixture content.
`;

const rule = `---
title: Validate a fixture
kind: process
impact: standard
tags: [validation]
applies_to: [fixtures]
last_reviewed: 2026-09-28
sources:
  - title: W3C Process
    url: https://www.w3.org/policies/process/
---
# Validate a fixture

## Preconditions

Use an isolated directory.

## Procedure

Run the validator.

## Rollback

Remove the fixture.

## Exit Gate

Require zero issues.
`;

async function fixtureRepository(): Promise<{ root: string; skills: string; skill: string; standards: string }> {
  const root = await mkdtemp(join(tmpdir(), 'pikakit-standards-'));
  const skills = join(root, 'skills');
  const skill = join(skills, 'fixture');
  const standards = join(root, 'standards');
  await mkdir(join(skill, 'rules'), { recursive: true });
  await mkdir(standards);
  await copyFile(join(STANDARDS, 'skill.schema.json'), join(standards, 'skill.schema.json'));
  await copyFile(join(STANDARDS, 'rule.schema.json'), join(standards, 'rule.schema.json'));
  await copyFile(join(STANDARDS, 'source-policy.yml'), join(standards, 'source-policy.yml'));
  await writeFile(join(standards, 'taxonomy.yml'), 'categories:\n  quality: [fixture]\n', 'utf8');
  await writeFile(join(skill, 'SKILL.md'), descriptor, 'utf8');
  await writeFile(join(skill, 'rules', 'validation.md'), rule, 'utf8');
  return { root, skills, skill, standards };
}

test('schema audit accepts valid descriptors and rules', async () => {
  const fixture = await fixtureRepository();
  const report = auditRepository(fixture.skills, undefined, fixture.standards);
  assert.equal(report.status, 'passed');
  assert.equal(report.descriptors, 1);
  assert.equal(report.rules, 1);
});

test('schema audit rejects malformed, missing, unofficial, stale, and oversized inputs', async () => {
  const cases: Array<[string, (value: string) => string, RegExp]> = [
    ['malformed YAML', value => value.replace('name: fixture', 'name: [fixture'), /Invalid YAML frontmatter/],
    ['missing field', value => value.replace('  capabilities: [validation]\n', ''), /required property 'capabilities'/],
    ['wrong type', value => value.replace('  platforms: [cross-platform]', '  platforms: cross-platform'), /platforms.*array/],
    ['stale review', value => value.replace('last_reviewed: 2026-09-28', 'last_reviewed: 2020-01-01'), /stale/],
    ['oversized', value => `${value}\n${'x'.repeat(7000)}`, /exceeds 6144 bytes/],
  ];
  for (const [label, mutate, expected] of cases) {
    const fixture = await fixtureRepository();
    await writeFile(join(fixture.skill, 'SKILL.md'), mutate(descriptor), 'utf8');
    const report = auditRepository(fixture.skills, undefined, fixture.standards);
    assert.match(report.issues.map(issue => issue.message).join('\n'), expected, label);
  }

  const unofficial = await fixtureRepository();
  await writeFile(join(unofficial.skill, 'rules', 'validation.md'), rule.replace('https://www.w3.org/policies/process/', 'https://example.com/blog'), 'utf8');
  assert.match(auditRepository(unofficial.skills, undefined, unofficial.standards).issues.map(issue => issue.message).join('\n'), /unapproved source host/);
});

test('recursive audit validates canonical nested ids and duplicate coordination', async () => {
  const fixture = await fixtureRepository();
  const child = join(fixture.skill, 'nested');
  await mkdir(child);
  const nested = descriptor
    .replace('name: fixture', 'name: nested')
    .replace('  id: fixture', '  id: fixture/nested')
    .replace('  coordinates_with: []', '  coordinates_with: [fixture, fixture]');
  await writeFile(join(child, 'SKILL.md'), nested, 'utf8');
  const report = auditRepository(fixture.skills, undefined, fixture.standards);
  assert.equal(report.descriptors, 2);
  assert.match(report.issues.map(issue => issue.message).join('\n'), /duplicate items|self coordination/);
});

test('compiler emits deterministic compact and full artifacts and detects staleness', async () => {
  const fixture = await fixtureRepository();
  const first = compileSkill(fixture.skill, fixture.skills);
  const second = compileSkill(fixture.skill, fixture.skills);
  assert.equal(first.compact, second.compact);
  assert.equal(first.full, second.full);
  assert.ok(Buffer.byteLength(first.compact, 'utf8') <= 32 * 1024);
  assert.match(first.compact, /references\/AGENTS\.full\.md#rule-validation/);
  assert.match(first.full, /<a id="rule-validation"><\/a>/);
  assert.ok(!first.compact.includes('\r'));
  assert.equal(runCompiler([], fixture.skills), 0);
  assert.equal(runCompiler(['--check'], fixture.skills), 0);
  await writeFile(join(fixture.skill, 'AGENTS.md'), 'stale\n', 'utf8');
  assert.equal(runCompiler(['--check'], fixture.skills), 1);
  assert.equal(await readFile(first.fullPath, 'utf8'), first.full);
});
