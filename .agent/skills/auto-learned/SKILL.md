---
name: auto-learned
description: >-
  Hierarchical skill containing all auto-learned patterns from IDE errors 
  and code analysis. Organizes patterns by category (import, type, syntax, etc.)
  with subskills in patterns/ folder.
  Triggers on: auto-learn, pattern, learned, error fix.
  Coordinates with: problem-checker, skill-generator, auto-learner.
metadata:
  category: "evolution"
  version: "1.0.0"
  triggers: "auto-learn, pattern, learned, error fix"
  coordinates_with: "problem-checker, skill-generator"
  success_metrics: "pattern_matches, auto_fixes_applied"
  generated_by: "skill-generator"
  hierarchical: true
---

# Auto-Learned Patterns

> **Purpose:** Central repository for all auto-learned patterns from IDE errors and code analysis

---

## 🎯 Purpose

This skill contains patterns automatically learned from:
- IDE errors detected by PikaKit extension
- Code analysis and linting issues
- User corrections and fixes

Patterns are organized by category in subskill files within `patterns/` folder.

---

## 📂 Skill Structure

```
auto-learned/
├── SKILL.md              # This file (index, <200 lines)
├── patterns/             # Subskills by category
│   ├── import-patterns.md    # Import-related patterns
│   ├── type-patterns.md      # Type-related patterns
│   └── syntax-patterns.md    # Syntax-related patterns
├── patterns.json         # Raw pattern data for dashboard
└── config.json           # Auto-learn configuration
```

---

## 🔧 Quick Reference

### View Patterns by Category

```bash
# View import patterns
cat .agent/skills/auto-learned/patterns/import-patterns.md

# View type patterns
cat .agent/skills/auto-learned/patterns/type-patterns.md
```

### Pattern Categories

| Category | File | Description |
|----------|------|-------------|
| `import` | `import-patterns.md` | Missing imports, module resolution |
| `type` | `type-patterns.md` | Type mismatches, property errors |
| `syntax` | `syntax-patterns.md` | Syntax errors, parsing issues |
| `logic` | `logic-patterns.md` | Logical errors, undefined values |
| `style` | `style-patterns.md` | Code style, formatting |

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Categories** | 2 |
| **Import Patterns** | 4 |
| **Type Patterns** | 3 |
| **Last Updated** | 2026-02-03 |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| IDE shows import error | Check `import-patterns.md` for known fixes |
| Type mismatch detected | Check `type-patterns.md` for solutions |
| New pattern learned | Auto-merged into correct category file |

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Detection** | `problem-checker` | Detects IDE errors |
| **Learning** | `auto-learner` | Extracts patterns |
| **Storage** | `skill-generator` | Merges into this skill |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `problem-checker` | Skill | Detects IDE errors |
| `skill-generator` | Skill | Generates/updates patterns |
| `auto-learner` | Extension | Learns from errors |

---

## 📖 Subskills

For detailed patterns, see:
- [import-patterns.md](patterns/import-patterns.md) - Import issues
- [type-patterns.md](patterns/type-patterns.md) - Type issues

---

⚡ PikaKit v3.9.66
Composable Skills. Coordinated Agents. Intelligent Execution.
