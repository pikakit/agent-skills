#!/usr/bin/env node

/**
 * PikaKit Version Sync v2.0
 * Synchronizes version across ALL files in the project.
 *
 * Usage:
 *   node scripts/sync-version.mjs              # Bump patch (3.9.78 → 3.9.79)
 *   node scripts/sync-version.mjs minor        # Bump minor (3.9.78 → 3.10.0)
 *   node scripts/sync-version.mjs major        # Bump major (3.9.78 → 4.0.0)
 *   node scripts/sync-version.mjs 4.0.0        # Set exact version
 *   node scripts/sync-version.mjs --dry-run    # Preview changes without writing
 */

import { readFileSync, writeFileSync, copyFileSync, readdirSync, existsSync } from 'fs';
import { join, resolve, extname } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────
const ROOT = resolve(import.meta.dirname, '..');
const ADD_SKILL_KIT = resolve(ROOT, '..', 'add-agent-skill-kit');

// All package.json files to sync
const PACKAGE_FILES = [
  join(ROOT, 'package.json'),
  join(ADD_SKILL_KIT, 'package.json'),
  join(ADD_SKILL_KIT, 'packages', 'pikakit-extension', 'package.json'),
];

// All directories containing .md files with "PikaKit v" footers
const MD_DIRS = [
  join(ROOT, '.agent', 'skills'),
  join(ROOT, '.agent', 'agents'),
  join(ROOT, '.agent', 'workflows'),
  join(ROOT, 'docs'),
];

// Single files with version references
const SINGLE_FILES = [
  { path: join(ROOT, '.agent', 'GEMINI.md'), label: 'GEMINI.md' },
  { path: join(ROOT, 'README.md'), label: 'README.md' },
  { path: join(ROOT, 'CHANGELOG.md'), label: 'CHANGELOG.md' },
  { path: join(ADD_SKILL_KIT, 'README.md'), label: 'add-skill-kit/README.md' },
];

// Files to copy from agent-skill-kit → add-agent-skill-kit (keep in sync)
const COPY_FILES = [
  { src: join(ROOT, 'README.md'), dest: join(ADD_SKILL_KIT, 'README.md'), label: 'README.md' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCurrentVersion() {
  return JSON.parse(readFileSync(PACKAGE_FILES[0], 'utf-8')).version;
}

function bumpVersion(current, type) {
  const [major, minor, patch] = current.split('.').map(Number);
  switch (type) {
    case 'major': return `${major + 1}.0.0`;
    case 'minor': return `${major}.${minor + 1}.0`;
    case 'patch': return `${major}.${minor}.${patch + 1}`;
    default: return type; // exact version string
  }
}

function collectMdFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) files.push(...collectMdFiles(fullPath));
      else if (extname(entry.name) === '.md') files.push(fullPath);
    }
  } catch { /* skip inaccessible dirs */ }
  return files;
}

// Version patterns to replace
const VERSION_PATTERNS = [
  /PikaKit v\d+\.\d+\.\d+/g,       // "PikaKit v3.9.78" (footers, headers)
  /\*\*v\d+\.\d+\.\d+\*\*/g,       // "**v3.9.78**" (GEMINI.md header)
  /npm-v\d+\.\d+\.\d+/g,           // "npm-v3.9.78" (README badge)
];

function replaceVersions(content, newVersion) {
  let changed = false;
  let result = content;
  for (const pattern of VERSION_PATTERNS) {
    result = result.replace(pattern, (match) => {
      changed = true;
      if (match.startsWith('**v')) return `**v${newVersion}**`;
      if (match.startsWith('npm-v')) return `npm-v${newVersion}`;
      return `PikaKit v${newVersion}`;
    });
  }
  return { content: result, changed };
}

// ─── Update Functions ────────────────────────────────────────────────────────
function updatePackageFiles(version, dryRun) {
  let count = 0;
  for (const file of PACKAGE_FILES) {
    try {
      const pkg = JSON.parse(readFileSync(file, 'utf-8'));
      if (pkg.version !== version) {
        if (!dryRun) writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
        // Update version in memory for dry-run display
        pkg.version = version;
        console.log(`  ✅ ${file.replace(ROOT, '.').replace(ADD_SKILL_KIT, '../add-agent-skill-kit')}`);
        count++;
      } else {
        console.log(`  ⏭️  ${file.replace(ROOT, '.').replace(ADD_SKILL_KIT, '../add-agent-skill-kit')} (already ${version})`);
      }
    } catch (e) {
      console.log(`  ⚠️  ${file.replace(ROOT, '.')} — ${e.message}`);
    }
  }
  return count;
}

function updateSingleFiles(newVersion, dryRun) {
  let count = 0;
  for (const { path, label } of SINGLE_FILES) {
    try {
      if (!existsSync(path)) { console.log(`  ⏭️  ${label} (not found)`); continue; }
      const content = readFileSync(path, 'utf-8');
      const { content: updated, changed } = replaceVersions(content, newVersion);
      if (changed) {
        if (!dryRun) writeFileSync(path, updated, 'utf-8');
        console.log(`  ✅ ${label}`);
        count++;
      } else {
        console.log(`  ⏭️  ${label} (already ${newVersion})`);
      }
    } catch (e) {
      console.log(`  ⚠️  ${label} — ${e.message}`);
    }
  }
  return count;
}

function updateMdDirs(newVersion, dryRun) {
  let totalCount = 0;
  for (const dir of MD_DIRS) {
    const dirLabel = dir.replace(ROOT, '.');
    const files = collectMdFiles(dir);
    let count = 0;

    for (const file of files) {
      try {
        const content = readFileSync(file, 'utf-8');
        const { content: updated, changed } = replaceVersions(content, newVersion);
        if (changed) {
          if (!dryRun) writeFileSync(file, updated, 'utf-8');
          count++;
        }
      } catch { /* skip */ }
    }

    if (count > 0) {
      console.log(`  ✅ ${dirLabel} — ${count}/${files.length} files updated`);
    } else {
      console.log(`  ⏭️  ${dirLabel} — ${files.length} files (all current)`);
    }
    totalCount += count;
  }
  return totalCount;
}

// ─── Main ────────────────────────────────────────────────────────────────────
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run');
const versionArg = args.find(a => a !== '--dry-run') || 'patch';

const currentVersion = getCurrentVersion();
const newVersion = bumpVersion(currentVersion, versionArg);

console.log(`\n⚡ PikaKit Version Sync v2.0${dryRun ? ' [DRY RUN]' : ''}`);
console.log(`   ${currentVersion} → ${newVersion}\n`);

console.log(`📦 Package files:`);
const pkgCount = updatePackageFiles(newVersion, dryRun);

console.log(`\n📜 Root files:`);
const singleCount = updateSingleFiles(newVersion, dryRun);

console.log(`\n🧩 Markdown directories:`);
const mdCount = updateMdDirs(newVersion, dryRun);

const total = pkgCount + singleCount + mdCount;

console.log(`\n📋 Copy shared files:`);
let copyCount = 0;
for (const { src, dest, label } of COPY_FILES) {
  try {
    if (!existsSync(src)) { console.log(`  ⚠️  ${label} — source not found`); continue; }
    if (!dryRun) copyFileSync(src, dest);
    console.log(`  ✅ ${label} → add-agent-skill-kit/`);
    copyCount++;
  } catch (e) {
    console.log(`  ⚠️  ${label} — ${e.message}`);
  }
}

const grandTotal = total + copyCount;
console.log(`\n${'─'.repeat(50)}`);
console.log(`✅ ${dryRun ? 'Would update' : 'Updated'} ${grandTotal} files to v${newVersion}`);

if (!dryRun && grandTotal > 0) {
  console.log(`\n💡 Next steps:`);
  console.log(`   git add -A ; git commit -m "chore: bump to v${newVersion}"`);
  console.log(`   cd ${ADD_SKILL_KIT}`);
  console.log(`   git add -A ; git commit -m "chore: sync to v${newVersion}"`);
  console.log(`   npm publish`);
}
