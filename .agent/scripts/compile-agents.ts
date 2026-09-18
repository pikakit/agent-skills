// @ts-nocheck
/**
 * Compile AGENTS.md — PikaKit
 * Compiles all rule files in a skill's rules/ directory into a single AGENTS.md.
 *
 * Usage:
 *   npx tsx compile-agents.ts                    # Compile ALL skills missing AGENTS.md
 *   npx tsx compile-agents.ts ai-artist          # Compile specific skill
 *   npx tsx compile-agents.ts --force             # Recompile ALL skills (overwrite existing)
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

const args = process.argv.slice(2);
const force = args.includes('--force');
const targetSkill = args.find(a => !a.startsWith('--'));

function getSkillsToCompile(): string[] {
  if (targetSkill) return [targetSkill];

  const dirs = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name);

  return dirs.filter(skill => {
    const rulesDir = path.join(SKILLS_DIR, skill, 'rules');
    const agentsMd = path.join(SKILLS_DIR, skill, 'AGENTS.md');
    const hasRules = fs.existsSync(rulesDir);
    const hasAgents = fs.existsSync(agentsMd);

    if (!hasRules) return false;

    // Count non-meta rule files
    const ruleFiles = fs.readdirSync(rulesDir)
      .filter(f => f.endsWith('.md') && !f.startsWith('_'));

    if (ruleFiles.length === 0) return false;

    return force || !hasAgents;
  });
}

function readSections(skillDir: string): Map<string, { impact: string; description: string }> {
  const sectionsPath = path.join(skillDir, 'rules', '_sections.md');
  const sections = new Map<string, { impact: string; description: string }>();

  if (!fs.existsSync(sectionsPath)) return sections;

  const content = fs.readFileSync(sectionsPath, 'utf-8');
  const sectionRegex = /##\s+\d+\.\s+(.+?)\s+\((\w[\w-]*)\)\s*\n+\*\*Impact:\*\*\s*(\w+)\s*\n\*\*Description:\*\*\s*(.+)/g;
  let match;

  while ((match = sectionRegex.exec(content)) !== null) {
    sections.set(match[2], {
      impact: match[3],
      description: match[4].trim()
    });
  }

  return sections;
}

function readSkillFrontmatter(skillDir: string): { name: string; description: string; version: string } {
  const skillMd = path.join(skillDir, 'SKILL.md');
  const content = fs.readFileSync(skillMd, 'utf-8');
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  let name = path.basename(skillDir);
  let description = '';
  let version = '3.9.121';

  if (fmMatch) {
    const fm = fmMatch[1];
    const nameMatch = fm.match(/name:\s*(.+)/);
    if (nameMatch) name = nameMatch[1].trim();

    const versionMatch = fm.match(/version:\s*['"]?([^'"]+)['"]?/);
    if (versionMatch) version = versionMatch[1].trim();

    const descMatch = fm.match(/description:\s*>-\s*\r?\n((?:\s+.*\r?\n)*)/);
    if (descMatch) {
      description = descMatch[1].replace(/^\s+/gm, '').trim();
    } else {
      const singleDesc = fm.match(/description:\s*(.+)/);
      if (singleDesc) description = singleDesc[1].trim();
    }
  }

  return { name, description, version };
}

function compileAgentsMd(skill: string): void {
  const skillDir = path.join(SKILLS_DIR, skill);
  const rulesDir = path.join(skillDir, 'rules');

  const { name, description, version } = readSkillFrontmatter(skillDir);
  const sections = readSections(skillDir);

  // Read all rule files (excluding _ prefixed)
  const ruleFiles = fs.readdirSync(rulesDir)
    .filter(f => f.endsWith('.md') && !f.startsWith('_'))
    .sort();

  // Group rules by prefix
  const ruleGroups = new Map<string, { filename: string; content: string }[]>();

  for (const file of ruleFiles) {
    const content = fs.readFileSync(path.join(rulesDir, file), 'utf-8');
    // Strip frontmatter from rule content
    const bodyMatch = content.match(/^---\r?\n[\s\S]*?\r?\n---\r?\n([\s\S]*)$/);
    const body = bodyMatch ? bodyMatch[1].trim() : content.trim();

    // Determine prefix (group key)
    const prefix = file.replace(/\.md$/, '').replace(/-[^-]+$/, '') || 'general';

    if (!ruleGroups.has(prefix)) {
      ruleGroups.set(prefix, []);
    }
    ruleGroups.get(prefix)!.push({ filename: file, content: body });
  }

  // Build display name
  const displayName = name.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

  // Count total rules
  const totalRules = ruleFiles.length;
  const totalCategories = ruleGroups.size;

  // Build AGENTS.md
  const lines: string[] = [];

  lines.push(`# ${displayName}`);
  lines.push('');
  lines.push(`**Version ${version}**`);
  lines.push('Engineering');
  lines.push(`${new Date().toLocaleString('en-US', { month: 'long', year: 'numeric' })}`);
  lines.push('');
  lines.push('> **Note:**');
  lines.push(`> This document is for agents and LLMs to follow when working on ${name} tasks.`);
  lines.push('> Optimized for automation and consistency by AI-assisted workflows.');
  lines.push('');
  lines.push('---');
  lines.push('');
  lines.push('## Abstract');
  lines.push('');
  lines.push(`This document compiles ${totalRules} rules across ${totalCategories} categories for the ${displayName} skill. ${description.split('.')[0]}.`);
  lines.push('');
  lines.push('---');
  lines.push('');

  // Table of Contents
  lines.push('## Table of Contents');
  lines.push('');
  let sectionNum = 0;
  for (const [prefix, rules] of ruleGroups) {
    sectionNum++;
    const sectionInfo = sections.get(prefix);
    const impact = sectionInfo?.impact || 'MEDIUM';
    const sectionTitle = prefix.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    lines.push(`${sectionNum}. [${sectionTitle}](#${sectionNum}-${prefix}) — **${impact}**`);
    let ruleNum = 0;
    for (const rule of rules) {
      ruleNum++;
      const ruleTitle = rule.filename.replace('.md', '').split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
      lines.push(`   - ${sectionNum}.${ruleNum} [${ruleTitle}](#${sectionNum}${ruleNum}-${rule.filename.replace('.md', '')})`);
    }
  }
  lines.push('');
  lines.push('---');
  lines.push('');

  // Content sections
  sectionNum = 0;
  for (const [prefix, rules] of ruleGroups) {
    sectionNum++;
    const sectionInfo = sections.get(prefix);
    const impact = sectionInfo?.impact || 'MEDIUM';
    const sectionTitle = prefix.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');

    lines.push(`## ${sectionNum}. ${sectionTitle}`);
    lines.push('');
    lines.push(`**Impact: ${impact}**`);
    if (sectionInfo?.description) {
      lines.push('');
      lines.push(sectionInfo.description);
    }
    lines.push('');

    let ruleNum = 0;
    for (const rule of rules) {
      ruleNum++;
      lines.push('');
      // The rule content already has its own headers, just include it
      lines.push(rule.content);
      lines.push('');
    }

    lines.push('---');
    lines.push('');
  }

  lines.push(`⚡ PikaKit v${version}`);
  lines.push('');

  const output = lines.join('\n');
  const outputPath = path.join(skillDir, 'AGENTS.md');
  fs.writeFileSync(outputPath, output, 'utf-8');
  console.log(`✅ Compiled ${skill}/AGENTS.md (${totalRules} rules, ${totalCategories} categories, ${output.length} bytes)`);
}

// Execute
const skills = getSkillsToCompile();

if (skills.length === 0) {
  console.log('\n✨ All skills already have AGENTS.md!');
  process.exit(0);
}

console.log(`\n🔧 Compiling AGENTS.md for ${skills.length} skills...\n`);

let compiled = 0;
for (const skill of skills) {
  try {
    compileAgentsMd(skill);
    compiled++;
  } catch (e: any) {
    console.error(`❌ Failed to compile ${skill}: ${e.message}`);
  }
}

console.log(`\n🎉 Done! Compiled ${compiled}/${skills.length} AGENTS.md files.`);
