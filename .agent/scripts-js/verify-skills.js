#!/usr/bin/env node
/**
 * Skill Registry Verifier
 * Validates all skills have required metadata and coordination mappings are valid.
 * 
 * Usage: node verify-skills.js
 */

import { readFile, readdir, stat } from 'fs/promises';
import { join } from 'path';

const SKILLS_DIR = join(process.cwd(), '.agent', 'skills');
const REGISTRY_PATH = join(SKILLS_DIR, 'registry.json');

const REQUIRED_METADATA = ['category', 'triggers', 'coordinates_with', 'success_metrics'];
const VALID_CATEGORIES = ['core', 'framework', 'architecture', 'devops', 'testing', 'specialized'];

const colors = {
  green: '\x1b[92m',
  red: '\x1b[91m',
  yellow: '\x1b[93m',
  cyan: '\x1b[96m',
  reset: '\x1b[0m'
};

function log(type, msg) {
  const icons = { pass: '✓', fail: '✗', warn: '⚠', info: '→' };
  const colorMap = { pass: 'green', fail: 'red', warn: 'yellow', info: 'cyan' };
  console.log(`${colors[colorMap[type]]}${icons[type]}${colors.reset} ${msg}`);
}

async function loadRegistry() {
  const content = await readFile(REGISTRY_PATH, 'utf-8');
  return JSON.parse(content);
}

async function getSkillDirs() {
  const entries = await readdir(SKILLS_DIR);
  const dirs = [];
  
  for (const entry of entries) {
    const fullPath = join(SKILLS_DIR, entry);
    try {
      const stats = await stat(fullPath); // Follow junctions/symlinks
      if (stats.isDirectory()) {
        dirs.push(entry);
      }
    } catch {
      // Ignore broken links or inaccessible items
    }
  }
  
  return dirs;
}

async function verifySkillFrontmatter(skillName) {
  const skillPath = join(SKILLS_DIR, skillName, 'SKILL.md');
  const issues = [];
  
  try {
    const content = await readFile(skillPath, 'utf-8');
    
    // Check for triggers
    if (!content.includes('Triggers on:')) {
      issues.push('Missing "Triggers on:" in description');
    }
    
    // Check for coordinates
    if (!content.includes('Coordinates with:')) {
      issues.push('Missing "Coordinates with:" in description');
    }
    
    // Check for metadata block
    if (!content.includes('success_metrics:')) {
      issues.push('Missing success_metrics in metadata');
    }
    
    if (!content.includes('category:')) {
      issues.push('Missing category in metadata');
    }
    
  } catch (err) {
    issues.push(`Cannot read SKILL.md: ${err.message}`);
  }
  
  return issues;
}

function verifyRegistrySkill(skill, allSkillNames) {
  const issues = [];
  
  // Check required fields
  for (const field of REQUIRED_METADATA) {
    if (!skill[field]) {
      issues.push(`Missing field: ${field}`);
    }
  }
  
  // Validate category
  if (skill.category && !VALID_CATEGORIES.includes(skill.category)) {
    issues.push(`Invalid category: ${skill.category}`);
  }
  
  // Validate coordinates_with references exist
  if (skill.coordinates_with) {
    for (const coord of skill.coordinates_with) {
      if (!allSkillNames.includes(coord)) {
        issues.push(`Invalid coordination ref: ${coord}`);
      }
    }
  }
  
  return issues;
}

function verifyChains(chains, allSkillNames) {
  const issues = [];
  
  for (const [chainName, chain] of Object.entries(chains)) {
    if (!chain.skills || !Array.isArray(chain.skills)) {
      issues.push(`Chain "${chainName}": Missing skills array`);
      continue;
    }
    
    for (const skill of chain.skills) {
      if (!allSkillNames.includes(skill)) {
        issues.push(`Chain "${chainName}": Invalid skill ref: ${skill}`);
      }
    }
    
    if (!chain.trigger) {
      issues.push(`Chain "${chainName}": Missing trigger phrase`);
    }
  }
  
  return issues;
}

async function main() {
  console.log('\n🔍 Skill Registry Verification\n');
  console.log('='.repeat(50));
  
  let errors = 0;
  let warnings = 0;
  
  // Load registry
  let registry;
  try {
    registry = await loadRegistry();
    log('pass', `Registry loaded: ${registry.skills.length} skills`);
  } catch (err) {
    log('fail', `Cannot load registry: ${err.message}`);
    process.exit(1);
  }
  
  // Get filesystem skills
  const fsDirs = await getSkillDirs();
  const registrySkillNames = registry.skills.map(s => s.name);
  
  // Check for unregistered skills
  console.log('\n📁 Filesystem vs Registry:');
  let coordinationErrors = 0;
  let implementationGaps = 0;
  
  for (const dir of fsDirs) {
    if (!registrySkillNames.includes(dir)) {
      log('warn', `Skill "${dir}" exists on disk but not in registry`);
      warnings++;
    }
  }
  
  // Check for missing skills (FOLDERS)
  for (const name of registrySkillNames) {
    if (!fsDirs.includes(name)) {
      log('fail', `Skill "${name}" in registry but folder missing on disk`);
      errors++;
      coordinationErrors++;
    }
  }
  
  if (coordinationErrors === 0) {
    log('pass', 'All registry skills have matching folders');
  }
  
  // Count implementation gaps (missing SKILL.md)
  for (const skill of registry.skills) {
    const skillPath = join(SKILLS_DIR, skill.name, 'SKILL.md');
    try {
      await readFile(skillPath, 'utf-8');
    } catch {
      implementationGaps++;
    }
  }
  
  if (implementationGaps > 0) {
    log('warn', `${implementationGaps}/${registry.skills.length} skills missing SKILL.md (implementation incomplete)`);
  } else {
    log('pass', 'All skills have SKILL.md files');
  }
  
  // Verify each skill
  console.log('\n📋 Skill Validation:');
  for (const skill of registry.skills) {
    const regIssues = verifyRegistrySkill(skill, registrySkillNames);
    const fsIssues = await verifySkillFrontmatter(skill.name);
    const allIssues = [...regIssues, ...fsIssues];
    
    if (allIssues.length === 0) {
      log('pass', skill.name);
    } else {
      log('fail', `${skill.name}: ${allIssues.length} issues`);
      for (const issue of allIssues) {
        console.log(`     - ${issue}`);
      }
      errors += allIssues.length;
    }
  }
  
  // Verify chains
  if (registry.chains) {
    console.log('\n🔗 Chain Validation:');
    const chainIssues = verifyChains(registry.chains, registrySkillNames);
    
    if (chainIssues.length === 0) {
      log('pass', `All ${Object.keys(registry.chains).length} chains valid`);
    } else {
      for (const issue of chainIssues) {
        log('fail', issue);
        errors++;
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log(`📊 Summary: ${registry.skills.length} skills, ${Object.keys(registry.chains || {}).length} chains`);
  
  if (errors > 0) {
    log('fail', `${errors} errors found`);
    process.exit(1);
  } else if (warnings > 0) {
    log('warn', `${warnings} warnings (non-blocking)`);
    log('pass', 'Verification passed with warnings');
  } else {
    log('pass', 'All validations passed!');
  }
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
