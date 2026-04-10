---
name: skill-generator
description: >-
  Generates new skills from high-quality auto-learned patterns.
  Only creates skills when patterns meet strict quality thresholds.
  NOT for learning patterns (use auto-learner) or storing patterns (use auto-learned).
category: autonomous-learning
triggers: ["generate skill", "create skill from patterns", "skill generation"]
coordinates_with: ["auto-learner", "auto-learned", "problem-checker"]
success_metrics: ["Skill Usefulness Rating", "Generated Skill Quality Score"]
metadata:
  author: pikakit
  version: "3.9.125"
---

# Skill Generator

Converts high-quality auto-learned patterns into reusable skills.

---

## ⛔ Generation Gate — MANDATORY

> 🔴 A skill is ONLY generated when ALL of these conditions are met.
> Generating garbage skills is WORSE than generating nothing.

### Pre-Generation Checklist:

| # | Check | Threshold | Reject If |
|---|-------|-----------|-----------|
| 1 | Pattern count | ≥ 5 patterns in same category | < 5 patterns |
| 2 | Pattern quality | ALL patterns have `solution` + `before/after` | Any pattern missing actual fix code |
| 3 | Generalizability | ≥ 80% patterns marked `generalizable: true` | Mostly project-specific noise |
| 4 | Recurrence | Average occurrences ≥ 3 across sessions | One-off errors |
| 5 | Solution diversity | ≥ 3 distinct solutions | All patterns repeat "add import for X" |

### If ANY check fails → DO NOT GENERATE. Keep patterns in `auto-learned/` until threshold met.

---

## Naming Rules

| ❌ Never | ✅ Always |
|---------|----------|
| `import-imports` | `react-import-patterns` |
| `type-types` | `typescript-type-guards` |
| `fix-fixes` | `nextjs-app-router-fixes` |
| Category + Category | Domain + Problem-area |

**Format:** `{domain}-{problem-area}` where domain = framework/language, problem-area = what it solves.

---

## Generated Skill Template

```markdown
---
name: {domain}-{problem-area}
description: >-
  {count} actionable patterns for {problem description}.
  Auto-generated from verified fixes.
---

# {Skill Name}

> {count} patterns · Category: {category} · Confidence: {avg_confidence}

## Patterns

### 1. {Error Description}

**Error:** `{exact error message}`
**Fix:**
\`\`\`{language}
// Before (broken)
{before_code}

// After (fixed)
{after_code}
\`\`\`
**Import:** `{import_statement}` (if applicable)

### 2. ...
```

### Template Rules:
- Maximum **100 lines** for generated skills (not 294)
- Each pattern MUST have before/after code
- NO sections that just repeat the pattern list (When to Use, Solutions, Examples must be DIFFERENT content or omitted)
- NO meta-agent integration tables (boilerplate, adds zero value)
- NO statistics section (adds zero value)

---

## What Makes a USEFUL Skill

| ✅ Useful | ❌ Useless |
|----------|-----------|
| `import { useState } from 'react'` — exact fix | "Add import for 'useState'" — no path |
| Before/after code comparison | Just restating the error message |
| Framework-specific context | Generic "fix this" |
| One pattern per section, concise | Same error listed in 5 different sections |

---

## Integration

| Dependency | Direction | Purpose |
|-----------|-----------|---------|
| `auto-learned` | Reads from | Source patterns (only high-quality) |
| `auto-learner` | Feeds from | Pattern extraction pipeline |
| SKILL_INDEX.md | Writes to | Register new skills |

---

## Protocol

```
1. CHECK THRESHOLD → Are there ≥ 5 quality patterns in a category?
2. VALIDATE QUALITY → Do ALL patterns have solution + before/after?
3. NAME SKILL → {domain}-{problem-area} format
4. GENERATE SKILL.md → Use template (≤ 100 lines)
5. REGISTER → Add to SKILL_INDEX.md
6. CONFIRM → Output: 🤖 Generated skill: @{skill-name}
```

---

⚡ PikaKit v3.9.125
