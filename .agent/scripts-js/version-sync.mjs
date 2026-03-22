import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const AGENT_DIR = path.join(ROOT_DIR, '.agent');

// 1. Determine new version
const args = process.argv.slice(2);
let action = 'patch'; // Default

// Find the first valid action to avoid npm garbage arguments
for (const arg of args) {
  if (['patch', 'minor', 'major'].includes(arg) || /^[vV]?\d+\.\d+\.\d+$/.test(arg)) {
    action = arg;
    break;
  }
}

const pkgPath = path.join(ROOT_DIR, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const currentVersion = pkg.version;

let newVersion = currentVersion;

if (action === 'patch' || action === 'minor' || action === 'major') {
  let [major, minor, patch] = currentVersion.split('.').map(Number);
  if (action === 'patch') patch++;
  else if (action === 'minor') { minor++; patch = 0; }
  else if (action === 'major') { major++; minor = 0; patch = 0; }
  newVersion = `${major}.${minor}.${patch}`;
} else {
  newVersion = action.replace(/^[vV]/, '');
}

if (!/^\d+\.\d+\.\d+$/.test(newVersion)) {
    console.error(`\n❌ Lỗi: Version không hợp lệ (${newVersion})`);
    process.exit(1);
}

if (newVersion === currentVersion) {
  console.log(`\n🔄 Version is unchanged (${newVersion}). Syncing...`);
} else {
  console.log(`\n🚀 Bumping version: ${currentVersion} → ${newVersion}`);
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

let updatedFiles = 0;

// Recursive file scanner
function scanDirectory(dir, ext = '.md') {
  let results = [];
  if (!fs.existsSync(dir)) return results;
  const list = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of list) {
    if (['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo'].includes(entry.name)) continue;
    const fullPath = path.resolve(dir, entry.name);
    if (entry.isDirectory()) {
      results = results.concat(scanDirectory(fullPath, ext));
    } else if (fullPath.endsWith(ext)) {
      results.push(fullPath);
    }
  }
  return results;
}

// 2. Update all Markdown files in .agent/
const agentMdFiles = scanDirectory(AGENT_DIR, '.md');

for (const filePath of agentMdFiles) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let originalContent = content;

  // Update YAML metadata.version if it exists
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (fmMatch) {
    const fm = fmMatch[1];
    if (fm.includes('version:')) {
      const newFm = fm.replace(/version:\s*['"]?([0-9.]+)['"]?/, `version: "${newVersion}"`);
      if (fm !== newFm) {
        content = content.replace(fm, newFm);
      }
    }
  }

  // Update PikaKit vX.X.X footprint across the file
  if (content.match(/PikaKit v[0-9.]+/)) {
    content = content.replace(/PikaKit v[0-9.]+/g, `PikaKit v${newVersion}`);
  }

  // Also replace npm-vX.X.X if it exists
  if (content.match(/npm-v[0-9.]+/)) {
      content = content.replace(/npm-v[0-9.]+/g, `npm-v${newVersion}`);
  }

  // Catch standalone bold version patterns like **v3.9.105**
  if (content.match(/\*\*v\d+\.\d+\.\d+\*\*/)) {
    content = content.replace(/\*\*v\d+\.\d+\.\d+\*\*/g, `**v${newVersion}**`);
  }

  // Catch standalone vX.X.X references (not inside words/URLs)
  // Only match versions that look like our PikaKit semver (e.g., v3.9.XXX)
  const majorMinor = newVersion.split('.').slice(0, 2).join('.');
  const standalonePattern = new RegExp(`(?<![a-zA-Z0-9/:-])v${majorMinor.replace(/\./g, '\\.')}\\.\\d+(?![a-zA-Z0-9/])`, 'g');
  content = content.replace(standalonePattern, `v${newVersion}`);

  if (content !== originalContent) {
    fs.writeFileSync(filePath, content, 'utf-8');
    updatedFiles++;
    console.log(`✅ Updated ${path.relative(ROOT_DIR, filePath)} to v${newVersion}`);
  }
}

// 3. Update registry.json
const registryPath = path.join(AGENT_DIR, 'skills', 'registry.json');
if (fs.existsSync(registryPath)) {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  if (registry.version !== newVersion) {
    registry.version = newVersion;
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated .agent/skills/registry.json to v${newVersion}`);
    updatedFiles++;
  }
}

// 4. Update README.md and external root files
const rootMdFiles = ['README.md', 'SYSTEM_PROMPT.md', 'GEMINI.md']
  .map(f => path.join(ROOT_DIR, f))
  .concat(scanDirectory(path.join(ROOT_DIR, 'docs'), '.md'));

for (const filePath of rootMdFiles) {
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf-8');
    const newContent = content
      .replace(/PikaKit v[0-9.]+/g, `PikaKit v${newVersion}`)
      .replace(/npm-v[0-9.]+/g, `npm-v${newVersion}`);
    if (content !== newContent) {
      fs.writeFileSync(filePath, newContent, 'utf-8');
      console.log(`✅ Updated ${path.relative(ROOT_DIR, filePath)} to v${newVersion}`);
      updatedFiles++;
    }
  }
}

console.log(`\n🎉 Sync complete! Modified ${updatedFiles} instances to v${newVersion}.`);
