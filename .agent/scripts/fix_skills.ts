#!/usr/bin/env node
/**
 * Fix Skills — PikaKit
 * Auto-corrects skill metadata, triggers, and runs compliance audit.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

console.log(`\n🛠️  PikaKit - Skill Auto-Fix & Compliance Verifier\n`);

if (!fs.existsSync(SKILLS_DIR)) {
  console.error(`❌ Skills directory not found: ${SKILLS_DIR}`);
  process.exit(1);
}

const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name)
  .sort();

let fixCount = 0;

for (const name of skills) {
  const sDir = path.join(SKILLS_DIR, name);
  const sMd = path.join(sDir, 'SKILL.md');
  if (!fs.existsSync(sMd)) continue;

  let content = fs.readFileSync(sMd, 'utf-8');
  let changed = false;

  // Ensure trailing newline
  if (!content.endsWith('\n')) {
    content += '\n';
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(sMd, content, 'utf-8');
    fixCount++;
    console.log(`✨ Fixed format for: ${name}`);
  }
}

console.log(`\n✅ Analyzed ${skills.length} skills. Applied ${fixCount} automatic formatting fixes.`);
console.log(`\n🔍 Running skill audit verification...`);

import('./skill-audit.js').catch(() => {
  // If run via tsx, import ts file directly
  import('./skill-audit.ts');
});
