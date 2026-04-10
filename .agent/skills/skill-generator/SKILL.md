---
name: skill-generator
description: >-
  Generates new skills from high-quality auto-learned patterns.
  Only creates skills when patterns meet strict quality thresholds.
  Use when "generate skill", "create skill from patterns", or when auto-learned
  patterns reach the generation threshold (≥5 quality patterns).
  NOT for learning patterns (use auto-learner) or storing patterns (use auto-learned).
metadata:
  author: pikakit
  version: "3.9.125"
  reference: "docs/The-Complete-Guide-to-Building-Skills-for-Claude.md"
---

# Skill Generator

Converts high-quality auto-learned patterns into reusable skills.
Compliant with [Anthropic's Complete Guide to Building Skills](../../../docs/The-Complete-Guide-to-Building-Skills-for-Claude.md).

---

## ⛔ Generation Gate — MANDATORY

> 🔴 A skill is ONLY generated when ALL conditions are met.
> Generating garbage skills is WORSE than generating nothing.

| # | Check | Threshold | Reject If |
|---|-------|-----------|-----------|
| 1 | Pattern count | ≥ 5 in same category | < 5 patterns |
| 2 | Pattern quality | ALL have `solution` + `before/after` code | Missing actual fix |
| 3 | Generalizability | ≥ 80% marked `generalizable: true` | Project-specific noise |
| 4 | Recurrence | Avg occurrences ≥ 3 | One-off errors |
| 5 | Solution diversity | ≥ 3 distinct solutions | Repeating "add import for X" |

**If ANY check fails → DO NOT GENERATE.**

---

## Naming Rules (Anthropic Standard)

- **kebab-case only:** `react-import-patterns` ✅
- **No spaces/capitals:** `Import Imports` ❌
- **Format:** `{domain}-{problem-area}`
- **Folder name = skill name**

| ❌ Never | ✅ Always |
|---------|----------|
| `import-imports` | `react-import-patterns` |
| `type-types` | `typescript-type-guards` |
| `fix-fixes` | `nextjs-app-router-fixes` |

---

## Generated Skill Structure (Anthropic Standard)

```
{skill-name}/
├── SKILL.md        # Required — instructions (≤ 100 lines)
└── references/     # Optional — detailed docs if needed
```

**No README.md inside skill folder.** No `_template.md` or `_sections.md`.

---

## SKILL.md Template

```markdown
---
name: {domain}-{problem-area}
description: >-
  {count} actionable patterns for {problem description}.
  Use when encountering {trigger phrase 1}, {trigger phrase 2}.
  Auto-generated from verified fixes.
---

# {Skill Name}

## Instructions

### Pattern 1: {Error Description}

**Error:** `{exact IDE error message}`

**Fix:**
\`\`\`{language}
// Before (broken)
{before_code}

// After (fixed)
{after_code}
\`\`\`

### Pattern 2: ...

## Troubleshooting

### {Common error scenario}
**Cause:** {why it happens}
**Solution:** {exact fix steps}
```

### Template Rules:

| Rule | Requirement |
|------|------------|
| Max length | ≤ 100 lines |
| Each pattern | MUST have before/after code |
| Description | MUST include trigger phrases |
| Troubleshooting | MUST include ≥ 1 entry |
| No boilerplate | NO meta-agent tables, NO statistics, NO repeated sections |

---

## Quality Comparison

| ✅ Useful (Anthropic-grade) | ❌ Useless (what `import-imports` did) |
|---|---|
| `import { useState } from 'react'` — exact fix | "Add import for 'useState'" — no path |
| Before/after code comparison | Just restating the error |
| Trigger phrases in description | Vague "applies patterns" |
| Troubleshooting section | Same list repeated 5 times |
| ≤ 100 lines, concise | 294 lines of bloat |

---

## Protocol

```
1. CHECK THRESHOLD → ≥ 5 quality patterns in a category?
2. VALIDATE QUALITY → ALL patterns have solution + before/after?
3. NAME SKILL → kebab-case: {domain}-{problem-area}
4. GENERATE → SKILL.md using template (≤ 100 lines)
5. VALIDATE → Check against Anthropic Quick Checklist:
   - [ ] SKILL.md exists (exact name)
   - [ ] YAML frontmatter has --- delimiters
   - [ ] name field: kebab-case
   - [ ] description includes WHAT + WHEN + triggers
   - [ ] Instructions clear and actionable
   - [ ] Error handling / troubleshooting included
6. REGISTER → Add to SKILL_INDEX.md
7. CONFIRM → Output: 🤖 Generated skill: @{skill-name}
```

---

⚡ PikaKit v3.9.125
