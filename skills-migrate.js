// Skills Migration Script - Rename PascalCase to kebab-case
// Run: node skills-migrate.js [--dry-run | --execute]

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const SKILLS_DIR = '.agent/skills';

// Manual mapping for edge cases
const MANUAL_OVERRIDES = {
    'E2EAutomation': 'e2e-automation',
    'NextJSPro': 'nextjs-pro',
    'NodeJSPro': 'nodejs-pro',
    'MCPServer': 'mcp-server',
    'SEOOptimizer': 'seo-optimizer',
    'CICDPipeline': 'cicd-pipeline',
    'APIArchitect': 'api-architect'
};

function toKebabCase(name) {
    if (MANUAL_OVERRIDES[name]) {
        return MANUAL_OVERRIDES[name];
    }
    
    return name
        .replace(/([a-z0-9])([A-Z])/g, '$1-$2')
        .replace(/([A-Z]+)([A-Z][a-z])/g, '$1-$2')
        .toLowerCase();
}

function getAllSkills() {
    const entries = fs.readdirSync(SKILLS_DIR, { withFileTypes: true });
    return entries
        .filter(e => e.isDirectory())
        .map(e => e.name);
}

function generateMapping() {
    const skills = getAllSkills();
    const mapping = {};
    
    for (const skill of skills) {
        mapping[skill] = toKebabCase(skill);
    }
    
    return mapping;
}

function renameFolder(oldName, newName, dryRun) {
    const oldPath = path.join(SKILLS_DIR, oldName);
    const newPath = path.join(SKILLS_DIR, newName);
    
    if (dryRun) {
        console.log(`[DRY-RUN] git mv "${oldPath}" "${newPath}"`);
        return true;
    }
    
    try {
        execSync(`git mv "${oldPath}" "${newPath}"`, { stdio: 'inherit' });
        console.log(`✅ Renamed: ${oldName} -> ${newName}`);
        return true;
    } catch (e) {
        console.error(`❌ Failed: ${oldName} -> ${newName}`, e.message);
        return false;
    }
}

function updateSkillMd(skillPath, newName, dryRun) {
    const skillMdPath = path.join(skillPath, 'SKILL.md');
    
    if (!fs.existsSync(skillMdPath)) {
        return false;
    }
    
    let content = fs.readFileSync(skillMdPath, 'utf8');
    
    // Update name field in frontmatter
    content = content.replace(
        /^(name:\s*).*$/m,
        `$1${newName}`
    );
    
    // Move version/priority/status/scripts to metadata if not already
    // Keep simple for now - just update name
    
    if (dryRun) {
        console.log(`[DRY-RUN] Update SKILL.md name: -> ${newName}`);
        return true;
    }
    
    fs.writeFileSync(skillMdPath, content, 'utf8');
    return true;
}

function updateRegistryJson(mapping, dryRun) {
    const registryPath = path.join(SKILLS_DIR, 'registry.json');
    
    if (!fs.existsSync(registryPath)) {
        console.log('registry.json not found');
        return false;
    }
    
    let content = fs.readFileSync(registryPath, 'utf8');
    
    for (const [oldName, newName] of Object.entries(mapping)) {
        content = content.replace(new RegExp(`"name":\\s*"${oldName}"`, 'g'), `"name": "${newName}"`);
    }
    
    if (dryRun) {
        console.log('[DRY-RUN] Update registry.json');
        return true;
    }
    
    fs.writeFileSync(registryPath, content, 'utf8');
    console.log('✅ Updated registry.json');
    return true;
}

// Main
const args = process.argv.slice(2);
const dryRun = args.includes('--dry-run') || !args.includes('--execute');

console.log(`\n🔄 Skills Migration ${dryRun ? '(DRY-RUN)' : '(EXECUTING)'}\n`);

const mapping = generateMapping();
console.log(`Found ${Object.keys(mapping).length} skills to rename\n`);

// Show mapping
console.log('📋 Mapping:');
for (const [old, newName] of Object.entries(mapping)) {
    if (old !== newName) {
        console.log(`   ${old} -> ${newName}`);
    }
}

if (dryRun) {
    console.log('\n⚠️  This is a DRY RUN. Use --execute to apply changes.\n');
    // Save mapping
    fs.writeFileSync('skills-mapping.json', JSON.stringify(mapping, null, 2));
    console.log('Mapping saved to skills-mapping.json');
} else {
    // Execute renames
    let success = 0;
    let failed = 0;
    
    for (const [oldName, newName] of Object.entries(mapping)) {
        if (oldName === newName) continue;
        
        if (renameFolder(oldName, newName, false)) {
            // Update SKILL.md
            updateSkillMd(path.join(SKILLS_DIR, newName), newName, false);
            success++;
        } else {
            failed++;
        }
    }
    
    // Update registry
    updateRegistryJson(mapping, false);
    
    console.log(`\n📊 Results: ${success} renamed, ${failed} failed`);
}
