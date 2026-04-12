# PikaKit Skill Design Guide

> **PikaKit v3.9.141** — Standard structure for all PikaKit skills.
> Incorporates [Anthropic's Skill Design Best Practices](The-Complete-Guide-to-Building-Skills-for-Claude.md).

---

## Core Design Principles

### Progressive Disclosure (3 Levels)

Skills use a three-level system to minimize token usage while maintaining expertise:

| Level | What | When Loaded | Max Size |
|-------|------|-------------|----------|
| **Level 1** | YAML frontmatter | Always (in system prompt) | <1KB |
| **Level 2** | SKILL.md body | When AI thinks skill is relevant | ~5KB |
| **Level 3** | Linked files (rules/, references/, AGENTS.md) | On demand, as needed | Unlimited |

> **Key insight from Anthropic:** *"This progressive disclosure minimizes token usage while maintaining specialized expertise."*

### Composability

Skills can be loaded simultaneously. Design each skill to work alongside others — don't assume it's the only capability available. Use `coordinates_with` to declare dependencies.

### Task Level Awareness

Skills are loaded based on task complexity (see `code-rules.md`):

| Task Level | Skill Protocol |
|-----------|---------------|
| L0 (Question) | No skill loaded |
| L1 (Quick fix) | Skill identified but not read |
| L2 (Multi-file) | SKILL.md read |
| L3 (Architecture) | SKILL.md + AGENTS.md read |

---

## Skill Types

### Type A: Rule-Based Skills (Full Structure)

For skills with many rules organized by category. Examples: `react-pro`, `nextjs-pro`, `design-system`.

```
skill-name/
├── SKILL.md              ← [REQUIRED] Index — frontmatter + summary + rule catalog
├── AGENTS.md             ← [REQUIRED] Compiled full doc for AI consumption
├── rules/                ← [REQUIRED] Individual rule files
│   ├── _sections.md      ← [RECOMMENDED] Section registry (categories + impact levels)
│   ├── _template.md      ← [RECOMMENDED] Template for creating new rules
│   └── {prefix}-{name}.md   ← Individual rule files
├── scripts/              ← [OPTIONAL] Helper scripts
└── references/           ← [OPTIONAL] Documentation loaded as needed
```

### Type B: Lightweight Skills (Minimal Structure)

For skills that are primarily decision frameworks or workflow guides. Examples: `idea-storm`, `smart-router`, `execution-reporter`.

```
skill-name/
├── SKILL.md              ← [REQUIRED] All content in one file
└── scripts/              ← [OPTIONAL] Helper scripts
```

> **When to use Type B:** If your skill has <10 "rules" and no code examples, put everything in SKILL.md. Don't create empty rules/ directories.

### File Responsibilities

| File | Audience | Purpose | Max Size |
|------|----------|---------|----------|
| `SKILL.md` | AI Discovery | Frontmatter + summary + rule catalog | ~5KB |
| `AGENTS.md` | AI Deep Read | ALL rules compiled into ONE file | Unlimited |
| `README.md` | Humans | How to contribute, add rules | ~5KB |
| `rules/*.md` | Maintainers + AI | One rule per file, easy to edit | ~5KB each |
| `references/*.md` | AI on-demand | Detailed documentation | ~5KB each |
| `scripts/*.ts` | AI execution | Helper scripts (TypeScript) | ~5KB each |

---

## 1. SKILL.md — The Index

The entry point. AI reads this FIRST for discovery and quick reference.

### YAML Frontmatter (Required)

```yaml
---
name: skill-name                        # Required — kebab-case, must match folder name
description: >-                         # Required — multi-line, <1024 chars
  What this skill covers. Use when doing X, Y, Z.
  Triggers on: keyword1, keyword2.
  NOT for: thing-a (use other-skill), thing-b.
license: MIT                            # Optional
metadata:
  author: pikakit                       # Required
  version: '1.0.0'                      # Required — semver
  category: architecture                # Optional — architecture, patterns, tooling, meta
  triggers: "keyword1, keyword2"        # Required — comma-separated trigger words
  coordinates_with: "skill-a, skill-b"  # Required — related skills
---
```

### Writing Effective Descriptions

The description field is **the most important part** — it determines whether the AI loads your skill.

**Formula:** `[What it does] + [Use when / trigger phrases] + [NOT for / negative triggers]`

#### ✅ Good Descriptions

```yaml
# Specific, actionable, with triggers AND negative triggers
description: >-
  React component architecture, hooks, state management, and performance patterns.
  Use when creating components, fixing hooks, managing state, or working with .tsx/.jsx files.
  NOT for Next.js routing (use nextjs-pro) or CSS styling (use design-system/tailwind-kit).

# Includes user phrases they might actually say
description: >-
  Deploy applications to Vercel with preview URLs and production releases.
  Use when user says "deploy", "push live", "preview deployment", or "deploy to Vercel".
  NOT for other platforms (use cicd-pipeline) or GitOps (use gitops).
```

#### ❌ Bad Descriptions

```yaml
# Too vague — AI can't determine when to trigger
description: Helps with projects.

# Missing triggers — when should this load?
description: Creates sophisticated multi-page documentation systems.

# Missing negative triggers — will over-trigger
description: >-
  Modern React patterns, component architecture, state management, TypeScript best practices,
  and modern React development with Suspense, TanStack Query, MUI v7, and lazy loading.
```

### Security Restrictions

**Forbidden in frontmatter:**
- XML angle brackets (`<` `>`)
- Skills with "claude" or "anthropic" in name (reserved)

> **Why:** Frontmatter appears in the system prompt. Malicious content could inject instructions.

### Body Structure

```markdown
# Skill Display Name

Brief description of what this skill covers (1-2 sentences).

## When to Apply

Reference these guidelines when:
- Doing X
- Building Y
- Optimizing Z

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Thing A             | Thing B (→ other-skill) |

## Rule Categories by Priority

| Priority | Category         | Impact   | Prefix              |
| -------- | ---------------- | -------- | -------------------- |
| 1        | Category A       | CRITICAL | `category-a-`       |
| 2        | Category B       | HIGH     | `category-b-`       |
| 3        | Category C       | MEDIUM   | `category-c-`       |

## Quick Reference

### 1. Category A (CRITICAL)
- `category-a-rule-name` - Brief description of rule

### 2. Category B (HIGH)
- `category-b-rule-name` - Brief description of rule

## How to Use

Read individual rule files for detailed explanations:
```
rules/category-a-rule-name.md
```

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
```

---

## 2. AGENTS.md — The Compiled Document

One file containing ALL content. AI reads this for deep understanding. Cross-platform compatible (Antigravity, Claude Code, Cursor, Windsurf).

> **Keep SKILL.md focused on core instructions.** Move detailed documentation to AGENTS.md or `references/` and link to it.

### Structure

```markdown
# Skill Display Name

**Version X.Y.Z**
Engineering
Month Year

> **Note:**
> This document is for agents and LLMs to follow when working on [domain].
> Optimized for automation and consistency by AI-assisted workflows.

---

## Abstract

One paragraph: what this covers, how many rules, categories, and how they're prioritized.

---

## Table of Contents

1. [Category A](#1-category-a) — **CRITICAL**
   - 1.1 [Rule Name](#11-rule-name)
2. [Category B](#2-category-b) — **HIGH**
   - 2.1 [Rule Name](#21-rule-name)

---

## 1. Category A

**Impact: CRITICAL**

Description of this category.

### 1.1 Rule Name

**Impact: CRITICAL (specific metric)**

Explanation of the rule.

**Incorrect (what's wrong):**
\`\`\`tsx
// Bad code
\`\`\`

**Correct (what's right):**
\`\`\`tsx
// Good code
\`\`\`

Reference: [link](https://...)
```

---

## 3. rules/ — Individual Rule Files

Each file = one atomic rule. Easy to add, edit, or delete independently.

### Special Files

| File | Purpose |
|------|---------|
| `_sections.md` | Registry of all categories with impact levels |
| `_template.md` | Template for creating new rules |

> Files starting with `_` are metadata — excluded from rule compilation.

### _sections.md Format

```markdown
# Sections

This file defines all sections, their ordering, impact levels, and descriptions.
The section ID (in parentheses) is the filename prefix used to group rules.

---

## 1. Category Name (prefix)

**Impact:** CRITICAL
**Description:** What this category covers.

## 2. Another Category (another-prefix)

**Impact:** HIGH
**Description:** What this covers.
```

### _template.md Format

```markdown
---
title: Rule Title Here
impact: MEDIUM
impactDescription: Optional metric (e.g., "20-50% improvement")
tags: tag1, tag2
---

## Rule Title Here

**Impact: MEDIUM (optional description)**

Brief explanation of the rule and why it matters.

**Incorrect (description of what's wrong):**

\`\`\`typescript
// Bad code example
\`\`\`

**Correct (description of what's right):**

\`\`\`typescript
// Good code example
\`\`\`

Reference: [Link](https://example.com)
```

### Rule File Naming Convention

```
{section-prefix}-{descriptive-name}.md
```

Examples:
- `list-performance-virtualize.md`
- `animation-gpu-properties.md`
- `ui-expo-image.md`
- `react-state-minimize.md`

**Naming Rules:**
- Use section prefix from `_sections.md`
- Use kebab-case for the descriptive part
- Keep names concise but descriptive
- Section is auto-inferred from filename prefix

### Rule YAML Frontmatter

```yaml
---
title: Human-Readable Rule Title       # Required
impact: HIGH                            # Required — CRITICAL | HIGH | MEDIUM | LOW
impactDescription: specific metric      # Optional — e.g., "prevents crash", "30% faster"
tags: tag1, tag2, tag3                  # Required — for searchability
---
```

### Rule Body Pattern

Every rule MUST follow this structure:

1. **Title** — Same as frontmatter `title`
2. **Impact statement** — One line with severity + metric
3. **Explanation** — Why this matters (2-3 sentences max)
4. **Incorrect example** — What NOT to do, with inline comments
5. **Correct example** — What TO do, with inline comments
6. **Reference** — Link to official docs or source (optional)

---

## 4. README.md — Contributor Guide (Optional)

For skills that accept contributions. Contains:
- Directory structure explanation
- How to create a new rule (reference `_template.md`)
- Naming conventions
- Impact level definitions

> **Note:** Don't include README.md inside a skill folder if distributed externally — all documentation goes in SKILL.md or references/. README.md is only for the repo-level human guide.

---

## Impact Levels

| Level | Meaning | Examples |
|-------|---------|---------|
| `CRITICAL` | Causes crashes or broken output | Runtime errors, data loss |
| `HIGH` | Significant performance/quality impact | 50%+ improvement potential |
| `MEDIUM` | Moderate improvement | Better patterns, cleaner code |
| `LOW` | Incremental optimization | Micro-optimizations, conventions |

---

## Compilation Flow

```
rules/*.md → AGENTS.md (compiled)
                 ↑
           _sections.md (ordering + categories)
```

When updating a skill:
1. Edit individual files in `rules/`
2. Recompile `AGENTS.md` from all rules (ordered by `_sections.md`)
3. Update `SKILL.md` quick reference if new rules added

---

## Testing Your Skill

### 1. Triggering Tests

Verify your skill loads at the right times:

| Test Type | Expected |
|-----------|----------|
| Obvious task (exact keywords) | ✅ Should trigger |
| Paraphrased request | ✅ Should trigger |
| Unrelated topic | ❌ Should NOT trigger |

**Target:** Skill triggers on **90%+** of relevant queries.

**Debug technique:** Ask the AI: *"When would you use the [skill-name] skill?"* — The AI will quote the description back, revealing what's missing.

### 2. Functional Tests

Verify the skill produces correct results:
- Valid outputs generated
- Error handling works
- Edge cases covered

### 3. Performance Comparison

Compare task completion with and without the skill:

```
Without skill:
- 15 back-and-forth messages
- 3 failed attempts
- 12,000 tokens consumed

With skill:
- 2 clarifying questions only
- 0 failures
- 6,000 tokens consumed
```

---

## Troubleshooting

### Skill doesn't trigger (under-triggering)

**Symptom:** Skill never loads automatically.

**Causes & fixes:**
- Description too generic → Add specific trigger phrases users would actually say
- Missing file type mentions → Add `.tsx`, `.py`, etc. if relevant
- No negative triggers → AI confuses this skill with similar ones

### Skill triggers too often (over-triggering)

**Symptom:** Skill loads for unrelated queries.

**Fixes:**
1. Add negative triggers: *"NOT for X (use other-skill)"*
2. Be more specific: *"PDF legal documents"* instead of *"documents"*
3. Narrow scope in description

### Instructions not followed

**Symptom:** Skill loads but AI doesn't follow rules.

**Common causes:**
1. **Instructions too verbose** → Keep SKILL.md under 5KB, move details to rules/
2. **Instructions buried** → Put critical rules at the top with `## Important` headers
3. **Ambiguous language** → Use specific, actionable instructions:

```markdown
# ❌ Bad
Make sure to validate things properly

# ✅ Good
CRITICAL: Before calling create_project, verify:
- Project name is non-empty
- At least one team member assigned
- Start date is not in the past
```

### Large context issues

**Symptom:** Skill seems slow or responses degraded.

**Solutions:**
1. Keep SKILL.md under 5,000 words
2. Move detailed docs to `references/` or `rules/`
3. Evaluate total skill count — more than **20-50 skills loaded simultaneously** can degrade quality

---

## Skill Registration

Every skill MUST be registered in two places:

| File | Purpose |
|------|---------|
| `skills/registry.json` | Machine-readable catalog with triggers and negative_triggers |
| `skills/SKILL_INDEX.md` | Human-readable quick reference grouped by domain |

### registry.json Entry

```json
{
  "name": "skill-name",
  "category": "domain",
  "triggers": ["keyword1", "keyword2"],
  "negative_triggers": ["not-this", "not-that"],
  "coordinates_with": ["other-skill"],
  "success_metrics": "what success looks like",
  "access_level": "domain"
}
```

### SKILL_INDEX.md Entry

```markdown
| `skill-name` | Use when doing X or Y | NOT for Z (→ other-skill) |
```

---

## Checklist for New Skills

### Before you start
- [ ] Identified 2-3 concrete use cases
- [ ] Tools/dependencies identified
- [ ] Planned folder structure (Type A or Type B)

### During development
- [ ] Folder named in kebab-case (must match `name` field)
- [ ] `SKILL.md` has valid YAML frontmatter (`name`, `description`, `metadata`)
- [ ] Description includes **WHAT** + **WHEN (triggers)** + **NOT FOR (negative triggers)**
- [ ] Description is under 1024 characters
- [ ] No XML angle brackets (`<` `>`) in frontmatter
- [ ] `SKILL.md` has rule catalog with priorities and prefixes (Type A)
- [ ] `AGENTS.md` exists with ALL rules compiled (Type A)
- [ ] `rules/_sections.md` defines all categories (Type A)
- [ ] `rules/_template.md` exists for contributors (Type A)
- [ ] Each rule file has YAML frontmatter (`title`, `impact`, `tags`)
- [ ] Each rule follows Incorrect/Correct pattern with code examples
- [ ] Rule filenames use `{prefix}-{name}.md` convention

### Before release
- [ ] Test triggering on obvious tasks — ✅ triggers
- [ ] Test triggering on paraphrased requests — ✅ triggers
- [ ] Verify doesn't trigger on unrelated topics — ❌ correct
- [ ] Functional tests pass
- [ ] Skill registered in `skills/registry.json` (with `negative_triggers`)
- [ ] Skill listed in `skills/SKILL_INDEX.md`

---

