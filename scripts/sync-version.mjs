#!/usr/bin/env node

/**
 * PikaKit Version Sync
 * Đồng bộ phiên bản trên tất cả package.json, GEMINI.md, skill files, và README.md
 *
 * Usage:
 *   node scripts/sync-version.mjs              # Bump patch (3.9.65 → 3.9.66)
 *   node scripts/sync-version.mjs minor        # Bump minor (3.9.65 → 3.10.0)
 *   node scripts/sync-version.mjs major        # Bump major (3.9.65 → 4.0.0)
 *   node scripts/sync-version.mjs 4.0.0        # Set exact version
 */

import { readFileSync, writeFileSync, readdirSync, statSync } from 'fs';
import { join, resolve, extname } from 'path';

// ─── Config ──────────────────────────────────────────────────────────────────
const ROOT = resolve(import.meta.dirname, '..');
const ADD_SKILL_KIT = resolve(ROOT, '..', 'add-agent-skill-kit');

const PACKAGE_FILES = [
  join(ROOT, 'package.json'),
  join(ADD_SKILL_KIT, 'package.json'),
  join(ADD_SKILL_KIT, 'packages', 'pikakit-extension', 'package.json'),
];

const GEMINI_PATH = join(ROOT, '.agent', 'GEMINI.md');
const SKILLS_DIR = join(ROOT, '.agent', 'skills');
const README_PATH = join(ROOT, 'README.md');

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getCurrentVersion() {
  const pkg = JSON.parse(readFileSync(PACKAGE_FILES[0], 'utf-8'));
  return pkg.version;
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

function getAllMdFiles(dir) {
  const files = [];
  try {
    for (const entry of readdirSync(dir, { withFileTypes: true })) {
      const fullPath = join(dir, entry.name);
      if (entry.isDirectory()) {
        files.push(...getAllMdFiles(fullPath));
      } else if (extname(entry.name) === '.md') {
        files.push(fullPath);
      }
    }
  } catch { /* skip inaccessible dirs */ }
  return files;
}

// ─── Update Functions ────────────────────────────────────────────────────────
function updatePackageFiles(version) {
  let count = 0;
  for (const file of PACKAGE_FILES) {
    try {
      const pkg = JSON.parse(readFileSync(file, 'utf-8'));
      if (pkg.version !== version) {
        pkg.version = version;
        writeFileSync(file, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
        console.log(`  ✅ ${file}`);
        count++;
      } else {
        console.log(`  ⏭️  ${file} (already ${version})`);
      }
    } catch (e) {
      console.log(`  ⚠️  ${file} — ${e.message}`);
    }
  }
  return count;
}

function updateGemini(oldVersion, newVersion) {
  try {
    let content = readFileSync(GEMINI_PATH, 'utf-8');
    const regex = /PikaKit v\d+\.\d+\.\d+/g;
    const versionHeader = /\*\*v\d+\.\d+\.\d+\*\*/g;

    let changed = false;
    const newContent = content
      .replace(regex, (match) => { changed = true; return `PikaKit v${newVersion}`; })
      .replace(versionHeader, (match) => { changed = true; return `**v${newVersion}**`; });

    if (changed) {
      writeFileSync(GEMINI_PATH, newContent, 'utf-8');
      console.log(`  ✅ GEMINI.md`);
      return 1;
    }
    console.log(`  ⏭️  GEMINI.md (already ${newVersion})`);
  } catch (e) {
    console.log(`  ⚠️  GEMINI.md — ${e.message}`);
  }
  return 0;
}

function updateSkillFiles(oldVersion, newVersion) {
  const files = getAllMdFiles(SKILLS_DIR);
  let count = 0;

  for (const file of files) {
    try {
      const content = readFileSync(file, 'utf-8');
      const regex = /PikaKit v\d+\.\d+\.\d+/g;

      if (regex.test(content)) {
        const newContent = content.replace(/PikaKit v\d+\.\d+\.\d+/g, `PikaKit v${newVersion}`);
        writeFileSync(file, newContent, 'utf-8');
        count++;
      }
    } catch { /* skip */ }
  }

  console.log(`  ✅ ${count} skill files updated`);
  return count;
}

function updateReadme(newVersion) {
  try {
    let content = readFileSync(README_PATH, 'utf-8');
    const regex = /PikaKit v\d+\.\d+\.\d+/g;
    const badgeRegex = /npm-v\d+\.\d+\.\d+/g;
    const versionBadge = /version-\d+\.\d+\.\d+/g;

    let changed = false;
    const newContent = content
      .replace(regex, () => { changed = true; return `PikaKit v${newVersion}`; })
      .replace(badgeRegex, () => { changed = true; return `npm-v${newVersion}`; })
      .replace(versionBadge, () => { changed = true; return `version-${newVersion}`; });

    if (changed) {
      writeFileSync(README_PATH, newContent, 'utf-8');
      console.log(`  ✅ README.md`);
      return 1;
    }
    console.log(`  ⏭️  README.md (already ${newVersion})`);
  } catch (e) {
    console.log(`  ⚠️  README.md — ${e.message}`);
  }
  return 0;
}

// ─── Main ────────────────────────────────────────────────────────────────────
const arg = process.argv[2] || 'patch';
const currentVersion = getCurrentVersion();
const newVersion = bumpVersion(currentVersion, arg);

console.log(`\n⚡ PikaKit Version Sync`);
console.log(`   ${currentVersion} → ${newVersion}\n`);

console.log(`📦 Package files:`);
const pkgCount = updatePackageFiles(newVersion);

console.log(`\n📜 GEMINI.md:`);
const geminiCount = updateGemini(currentVersion, newVersion);

console.log(`\n🧩 Skills:`);
const skillCount = updateSkillFiles(currentVersion, newVersion);

console.log(`\n📄 README.md:`);
const readmeCount = updateReadme(newVersion);

const total = pkgCount + geminiCount + skillCount + readmeCount;
console.log(`\n✅ Done! Updated ${total} files to v${newVersion}`);
console.log(`\n💡 Next steps:`);
console.log(`   cd ${ADD_SKILL_KIT}`);
console.log(`   npm publish`);
