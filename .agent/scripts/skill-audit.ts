// @ts-nocheck
/**
 * Skill Audit — PikaKit
 * Validates ALL skills against SKILL_DESIGN_GUIDE.md checklist.
 *
 * Usage:
 *   npx tsx skill-audit.ts                    # Audit all skills
 *   npx tsx skill-audit.ts react-pro          # Audit specific skill
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const SKILLS_DIR = path.resolve(__dirname, '../skills');

const args = process.argv.slice(2);
const targetSkill = args.find(a => !a.startsWith('--'));

interface CheckResult {
  name: string;
  passed: number;
  total: number;
  issues: string[];
}

function auditSkill(skillName: string): CheckResult {
  const skillDir = path.join(SKILLS_DIR, skillName);
  const issues: string[] = [];
  let checks = 0;
  let passed = 0;

  // === CHECK 1: SKILL.md exists ===
  checks++;
  const skillMdPath = path.join(skillDir, 'SKILL.md');
  if (fs.existsSync(skillMdPath)) {
    passed++;
  } else {
    issues.push('Missing SKILL.md');
    return { name: skillName, passed, total: checks, issues };
  }

  let content = fs.readFileSync(skillMdPath, 'utf-8');
  // Strip UTF-8 BOM if present
  if (content.charCodeAt(0) === 0xFEFF) content = content.slice(1);
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);

  // === CHECK 2: YAML frontmatter exists ===
  checks++;
  if (fmMatch) {
    passed++;
  } else {
    issues.push('Missing YAML frontmatter');
    return { name: skillName, passed, total: checks, issues };
  }

  const fm = fmMatch[1];

  // === CHECK 3: name field ===
  checks++;
  if (fm.match(/^name:\s*.+/m)) {
    passed++;
  } else {
    issues.push('Missing `name` in frontmatter');
  }

  // === CHECK 4: description field ===
  checks++;
  const hasDesc = fm.match(/description:\s*>-/) || fm.match(/description:\s*.+/);
  if (hasDesc) {
    passed++;
  } else {
    issues.push('Missing `description` in frontmatter');
  }

  // === CHECK 5: Description has WHAT + WHEN + NOT FOR ===
  checks++;
  let desc = '';
  const multiDesc = fm.match(/description:\s*>-\s*\r?\n((?:\s+.*\r?\n)*)/);
  if (multiDesc) {
    desc = multiDesc[1].trim();
  } else {
    const singleDesc = fm.match(/description:\s*(.+)/);
    if (singleDesc) desc = singleDesc[1].trim();
  }

  const hasTrigger = /Use when|Use for|Use before|Use at|Triggers on/i.test(desc);
  const hasNegative = /NOT for/i.test(desc);
  if (hasTrigger && hasNegative) {
    passed++;
  } else {
    if (!hasTrigger) issues.push('Description missing trigger phrase ("Use when/for/before")');
    if (!hasNegative) issues.push('Description missing negative trigger ("NOT for")');
  }

  // === CHECK 6: Description length <= 1024 chars ===
  checks++;
  if (desc.length <= 1024) {
    passed++;
  } else {
    issues.push(`Description too long (${desc.length} > 1024 chars)`);
  }

  // === CHECK 7: metadata block ===
  checks++;
  if (fm.match(/metadata:/)) {
    passed++;
  } else {
    issues.push('Missing `metadata` block');
  }

  // === CHECK 8: metadata.triggers ===
  checks++;
  if (fm.match(/triggers:/)) {
    passed++;
  } else {
    issues.push('Missing `metadata.triggers`');
  }

  // === CHECK 9: metadata.coordinates_with ===
  checks++;
  if (fm.match(/coordinates_with:/)) {
    passed++;
  } else {
    issues.push('Missing `metadata.coordinates_with`');
  }

  // === CHECK 10: metadata.version ===
  checks++;
  if (fm.match(/version:/)) {
    passed++;
  } else {
    issues.push('Missing `metadata.version`');
  }

  // Determine skill type
  const rulesDir = path.join(skillDir, 'rules');
  const hasRules = fs.existsSync(rulesDir);
  const ruleFiles = hasRules
    ? fs.readdirSync(rulesDir).filter(f => f.endsWith('.md') && !f.startsWith('_'))
    : [];
  const isTypeA = hasRules && ruleFiles.length > 0;

  if (isTypeA) {
    // === CHECK 11: AGENTS.md for Type A ===
    checks++;
    if (fs.existsSync(path.join(skillDir, 'AGENTS.md'))) {
      passed++;
    } else {
      issues.push('Type A skill missing AGENTS.md');
    }

    // === CHECK 12: _sections.md ===
    checks++;
    if (fs.existsSync(path.join(rulesDir, '_sections.md'))) {
      passed++;
    } else {
      issues.push('Missing rules/_sections.md');
    }

    // === CHECK 13: _template.md ===
    checks++;
    if (fs.existsSync(path.join(rulesDir, '_template.md'))) {
      passed++;
    } else {
      issues.push('Missing rules/_template.md');
    }

    // === CHECK 14: Rule files have YAML frontmatter ===
    checks++;
    let allRulesHaveFm = true;
    for (const rf of ruleFiles) {
      let rc = fs.readFileSync(path.join(rulesDir, rf), 'utf-8');
      // Strip UTF-8 BOM if present
      if (rc.charCodeAt(0) === 0xFEFF) rc = rc.slice(1);
      if (!rc.match(/^---/)) {
        allRulesHaveFm = false;
        issues.push(`Rule ${rf} missing YAML frontmatter`);
      }
    }
    if (allRulesHaveFm) passed++;
  }

  // === CHECK 15: Body has "When to Apply" or "When to Use" section ===
  checks++;
  if (content.match(/## When to (Apply|Use)|## Protocol|## Routing Table|## Trigger Words/)) {
    passed++;
  } else {
    issues.push('Missing "When to Apply/Use" section in body');
  }

  // === CHECK 16: Body has "System Boundaries" section ===
  checks++;
  if (content.match(/## System Boundaries|## Scope|## Integration/)) {
    passed++;
  } else {
    issues.push('Missing "System Boundaries/Scope" section in body');
  }

  return { name: skillName, passed, total: checks, issues };
}

// Get skills to audit
let skills: string[];
if (targetSkill) {
  skills = [targetSkill];
} else {
  skills = fs.readdirSync(SKILLS_DIR, { withFileTypes: true })
    .filter(d => d.isDirectory())
    .map(d => d.name)
    .sort();
}

console.log(`\n🔍 PikaKit Skill Audit — SKILL_DESIGN_GUIDE.md Compliance\n`);
console.log(`Auditing ${skills.length} skills...\n`);

let totalPass = 0;
let totalFail = 0;
let totalWarn = 0;

const results: CheckResult[] = [];

for (const skill of skills) {
  const result = auditSkill(skill);
  results.push(result);

  const pct = Math.round((result.passed / result.total) * 100);
  const icon = pct === 100 ? '✅' : pct >= 80 ? '⚠️' : '❌';

  if (pct === 100) totalPass++;
  else if (pct >= 80) totalWarn++;
  else totalFail++;

  if (result.issues.length > 0) {
    console.log(`${icon} ${result.name}: ${result.passed}/${result.total} checks (${pct}%)`);
    for (const issue of result.issues) {
      console.log(`   ⤷ ${issue}`);
    }
  } else {
    console.log(`${icon} ${result.name}: ${result.passed}/${result.total} checks (${pct}%)`);
  }
}

console.log(`\n${'─'.repeat(60)}`);
console.log(`📊 Summary: ${totalPass} pass | ${totalWarn} warn | ${totalFail} fail | ${skills.length} total`);

if (totalFail === 0 && totalWarn === 0) {
  console.log(`\n🎉 All skills pass SKILL_DESIGN_GUIDE compliance!`);
} else {
  console.log(`\n⚠️ ${totalWarn + totalFail} skill(s) need attention.`);
}

console.log('');
