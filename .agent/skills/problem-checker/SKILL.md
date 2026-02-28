---
name: problem-checker
description: >-
  Automated IDE problem detection and auto-fix before task completion. Checks
  @[current_problems] and auto-fixes common issues. Triggers on: before notify_user,
  after code modification, IDE errors. Coordinates with: code-quality, auto-learner.
metadata:
  category: "evolution"
  version: "1.0.0"
  triggers: "before notify_user, IDE errors, after code modification"
  coordinates_with: "auto-learned, auto-learner"
  success_metrics: "0 IDE errors at completion, auto-fix >80%"
---

# Problem Checker

> **Purpose:** Check `@[current_problems]` and auto-fix before task completion.

---

## 🚨 Critical Rule

**NEVER mark a task complete if `@[current_problems]` shows errors.**

---

## When to Use

| Situation | Action |
|-----------|--------|
| Before any `notify_user` | Run full check |
| After modifying `.ts`, `.tsx`, `.js` files | TypeScript check |
| After modifying `.css` files | CSS validation |
| User says "check for errors" | Full check |

---

## 🔧 Quick Reference

```bash
# Run TypeScript check
node .agent/skills/problem-checker/scripts/check_problems.js

# Check specific file
npx tsc --noEmit <file>
```

---

## Auto-Fixable Issues

| Issue Type | Pattern | Fix |
|------------|---------|-----|
| Missing import | `Cannot find name 'X'` | Add import |
| JSX namespace | `Cannot find namespace 'JSX'` | Import ReactNode |
| Unused variable | `'x' never used` | Remove or prefix `_` |
| @import order | `@import must precede` | Move to top |

---

## Non-Fixable (Escalate)

| Issue Type | Action |
|------------|--------|
| Logic error | Notify user |
| Breaking change | Block, explain impact |
| Missing dependency | Ask user to install |

---

## Check Protocol

```
Problem detected?
├── YES → Auto-fixable?
│         ├── YES → Fix → Re-check → Continue
│         └── NO  → STOP → Escalate
└── NO  → Proceed
```

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `auto-learned` | Skill | Stores learned patterns |
| `skill-generator` | Skill | Generates from patterns |
| `/validate` | Workflow | Run all checks |

---

⚡ PikaKit v3.9.68
