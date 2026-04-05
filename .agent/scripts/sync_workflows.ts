// @ts-nocheck
/**
 * Sync Workflows — PikaKit
 * Injects missing YAML fields, Auto-Learned sections, and Rollback paths.
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

const dir = 'C:/Users/sofma/Desktop/agent-skill-kit/.agent/workflows';
const files = fs.readdirSync(dir).filter((f: string) => f.endsWith('.md'));

for (const f of files) {
  let txt = fs.readFileSync(path.join(dir, f), 'utf8');
  let changed = false;

  // 1. YAML inject skills and agents
  if (!/^skills:/m.test(txt)) {
    const skillsMatch = txt.match(/SKILLS\s*\|\s*`([^`]+)`/g);
    const skills = new Set<string>();
    if (skillsMatch) {
      skillsMatch.forEach((m: string) => {
        const parts = m.split('|')[1].replace(/`/g, '').split(',').map((s: string) => s.trim());
        parts.forEach((p: string) => skills.add(p));
      });
    }
    const skillsStr = skills.size > 0 ? Array.from(skills).join(', ') : 'project-planner';
    txt = txt.replace(/^(---[\s\S]*?)(---)$/m, `$1skills: [${skillsStr}]\nagents: [orchestrator, assessor, recovery]\n$2`);
    changed = true;
  }

  // 2. Auto-Learned pattern (Phase 0)
  if (!/auto-learned|Auto-Learned/i.test(txt)) {
    txt = txt.replace(
      /## 🔴 MANDATORY:([^]*?)(### Phase 1)/,
      `## 🔴 MANDATORY:$1### Phase 0: Pre-flight & Auto-Learned Context\n\n> **Rule 0.5-K:** Auto-learned pattern check.\n\n1. Read \`.agent/skills/auto-learned/patterns/\` for past failures before proceeding.\n2. Trigger \`recovery\` agent to run Checkpoint (\`git commit -m "chore(checkpoint): pre-${f.replace('.md', '')}"\`).\n\n$2`
    );
    changed = true;
  }

  // 3. Rollback section before Output Format
  if (!/Rollback|recovery/i.test(txt) && !/Rollback Path/i.test(txt)) {
    txt = txt.replace(
      /## Output Format/,
      `## 🔙 Rollback Path\n\nIf the Exit Gates fail and cannot be resolved automatically:\n1. Restore to pre-workflow checkpoint (\`git checkout -- .\`).\n2. Log failure via \`learner\` meta-agent.\n\n## Output Format`
    );
    changed = true;
  }

  if (changed) {
    fs.writeFileSync(path.join(dir, f), txt, 'utf8');
    console.log(`Patched ${f}`);
  }
}
