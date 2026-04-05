# PikaKit Skill Design Guide

> **PikaKit v3.9.117** — Standard structure for all PikaKit skills.

---

## Skill Directory Structure

```
skill-name/
├── SKILL.md              ← [REQUIRED] Index — frontmatter + summary + rule catalog
├── AGENTS.md             ← [REQUIRED] Compiled full doc for AI consumption
├── README.md             ← [OPTIONAL] Contributor guide for humans
├── rules/                ← [REQUIRED] Individual rule files
│   ├── _sections.md      ← [RECOMMENDED] Section registry (categories + impact levels)
│   ├── _template.md      ← [RECOMMENDED] Template for creating new rules
│   └── {prefix}-{name}.md   ← Individual rule files
└── scripts/              ← [OPTIONAL] Helper scripts
```

### File Responsibilities

| File | Audience | Purpose | Max Size |
|------|----------|---------|----------|
| `SKILL.md` | AI Discovery | Frontmatter + summary + rule catalog | ~5KB |
| `AGENTS.md` | AI Deep Read | ALL rules compiled into ONE file | Unlimited |
| `README.md` | Humans | How to contribute, add rules | ~5KB |
| `rules/*.md` | Maintainers + AI | One rule per file, easy to edit | ~5KB each |

---

## 1. SKILL.md — The Index

The entry point. AI reads this FIRST for discovery and quick reference.

### YAML Frontmatter (Required)

```yaml
---
name: skill-name                        # Required — kebab-case, must match folder name
description: >-                         # Required — multi-line description
  What this skill covers. Use when doing X, Y, Z.
  Triggers on: keyword1, keyword2.
  Coordinates with: other-skill-1, other-skill-2.
license: MIT                            # Optional
metadata:
  author: pikakit                       # Required
  version: '1.0.0'                      # Required — semver
  category: architecture                # Optional — architecture, patterns, tooling, meta
  triggers: "keyword1, keyword2"        # Required — comma-separated trigger words
  coordinates_with: "skill-a, skill-b"  # Required — related skills
---
```

### Body Structure

```markdown
# Skill Display Name

Brief description of what this skill covers (1-2 sentences).

## When to Apply

Reference these guidelines when:
- Doing X
- Building Y
- Optimizing Z

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

## Checklist for New Skills

- [ ] `SKILL.md` has valid YAML frontmatter (`name`, `description`, `metadata`)
- [ ] `SKILL.md` has rule catalog with priorities and prefixes
- [ ] `AGENTS.md` exists with ALL rules compiled
- [ ] `rules/_sections.md` defines all categories
- [ ] `rules/_template.md` exists for contributors
- [ ] Each rule file has YAML frontmatter (`title`, `impact`, `tags`)
- [ ] Each rule follows Incorrect/Correct pattern with code examples
- [ ] Rule filenames use `{prefix}-{name}.md` convention
- [ ] Skill registered in `skills/registry.json`
