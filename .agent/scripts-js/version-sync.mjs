import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, '../../');
const SKILLS_DIR = path.join(ROOT_DIR, '.agent/skills');

// 1. Determine new version
// npm run version:sync passes arguments as process.argv. 
// Filter out standard node/npm paths to find the actual argument
const args = process.argv.slice(2);
let action = 'patch'; // Default
if (args.length > 0) {
  action = args[0];
}

const pkgPath = path.join(ROOT_DIR, 'package.json');
const pkg = JSON.parse(fs.readFileSync(pkgPath, 'utf-8'));
const currentVersion = pkg.version;

let newVersion = currentVersion;

if (action === 'patch' || action === 'minor' || action === 'major') {
  let [major, minor, patch] = currentVersion.split('.').map(Number);
  if (action === 'patch') {
    patch++;
  } else if (action === 'minor') {
    minor++;
    patch = 0;
  } else if (action === 'major') {
    major++;
    minor = 0;
    patch = 0;
  }
  newVersion = `${major}.${minor}.${patch}`;
} else {
  // Assume it's an exact version string (e.g. "4.0.0")
  newVersion = action.replace(/^v/, ''); // strip leading 'v' if present
}

if (newVersion === currentVersion) {
  console.log(`\n🔄 Version is unchanged (${newVersion}). Syncing...`);
} else {
  console.log(`\n🚀 Bumping version: ${currentVersion} → ${newVersion}`);
  pkg.version = newVersion;
  fs.writeFileSync(pkgPath, JSON.stringify(pkg, null, 2) + '\n', 'utf-8');
}

let updatedFiles = 0;

// 2. Update SKILL.md files
const skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
  .filter(d => d.isDirectory())
  .map(d => d.name);

for (const skill of skills) {
  const skillPath = path.join(SKILLS_DIR, skill, 'SKILL.md');
  if (fs.existsSync(skillPath)) {
    let content = fs.readFileSync(skillPath, 'utf-8').replace(/^\uFEFF/, '').replace(/\r\n/g, '\n');
    let fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
      const fm = fmMatch[1];
      // Update metadata.version if it exists
      if (fm.includes('version:')) {
        const newFm = fm.replace(/version:\s*['"]?([0-9.]+)['"]?/, `version: "${newVersion}"`);
        if (fm !== newFm) {
          content = content.replace(fmMatch[0], `---\n${newFm}\n---`);
          fs.writeFileSync(skillPath, content, 'utf-8');
          updatedFiles++;
        }
      }
    }
    
    // Also update any "PikaKit v..." in the body of SKILL.md
    if (content.match(/PikaKit v[0-9.]+/)) {
      const newContent = content.replace(/PikaKit v[0-9.]+/g, `PikaKit v${newVersion}`);
      if (newContent !== content) {
         fs.writeFileSync(skillPath, newContent, 'utf-8');
         updatedFiles++;
      }
    }
  }
}

// 3. Update registry.json
const registryPath = path.join(SKILLS_DIR, 'registry.json');
if (fs.existsSync(registryPath)) {
  const registry = JSON.parse(fs.readFileSync(registryPath, 'utf-8'));
  if (registry.version !== newVersion) {
    registry.version = newVersion;
    fs.writeFileSync(registryPath, JSON.stringify(registry, null, 2) + '\n', 'utf-8');
    console.log(`✅ Updated registry.json to v${newVersion}`);
    updatedFiles++;
  }
}

// 4. Update README.md
const readmePath = path.join(ROOT_DIR, 'README.md');
if (fs.existsSync(readmePath)) {
  let readme = fs.readFileSync(readmePath, 'utf-8');
  const newReadme = readme
    .replace(/PikaKit v[0-9.]+/g, `PikaKit v${newVersion}`)
    .replace(/npm-v[0-9.]+/g, `npm-v${newVersion}`);
  if (readme !== newReadme) {
    fs.writeFileSync(readmePath, newReadme, 'utf-8');
    console.log(`✅ Updated README.md to v${newVersion}`);
    updatedFiles++;
  }
}

// 5. Update WORKFLOW_DESIGN_GUIDE.md
const guidePath = path.join(ROOT_DIR, 'docs/WORKFLOW_DESIGN_GUIDE.md');
if (fs.existsSync(guidePath)) {
  let guide = fs.readFileSync(guidePath, 'utf-8');
  const newGuide = guide.replace(/PikaKit v[0-9.]+/g, `PikaKit v${newVersion}`);
  if (guide !== newGuide) {
    fs.writeFileSync(guidePath, newGuide, 'utf-8');
    console.log(`✅ Updated WORKFLOW_DESIGN_GUIDE.md to v${newVersion}`);
    updatedFiles++;
  }
}

console.log(`\n🎉 Sync complete! Modified ${updatedFiles} instances to v${newVersion}.`);
