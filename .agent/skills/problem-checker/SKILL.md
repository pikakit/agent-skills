---
name: problem-checker
description: >-
  Automated IDE problem detection and auto-fix before task completion. Checks
  @[current_problems] and auto-fixes common issues. Triggers on: before notify_user,
  after code modification, IDE errors. Coordinates with: auto-learned, auto-learner.
metadata:
  category: "evolution"
  version: "2.0.0"
  triggers: "before notify_user, IDE errors, after code modification"
  success_metrics: "0 IDE errors at completion, auto-fix rate >80%"
  coordinates_with: "auto-learned, auto-learner"
---

# Problem Checker — Automated IDE Error Gate

> 4 auto-fix patterns. 3 escalation categories. Max 3 cycles. Hard-block on errors.

---

## 🚨 Critical Rule

**NEVER mark a task complete if `@[current_problems]` shows errors.**

---

## When to Use

| Situation | Action |
|-----------|--------|
| Before any `notify_user` | Run full-cycle check |
| After modifying `.ts`, `.tsx`, `.js` | TypeScript check |
| After modifying `.css` | CSS validation |
| User says "check for errors" | Full check |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| IDE problem detection (`@[current_problems]`) | Pattern storage (→ auto-learned) |
| Auto-fix (4 patterns) | Skill generation (→ skill-generator) |
| Fix-verify loop (max 3 cycles) | Full test execution (→ /validate) |
| Completion gate (hard-block) | Code review (→ code-review) |

**Automation (scripted):** Reads IDE state, modifies files (auto-fix), re-checks. Sequential only.

---

## Check Protocol (Decision Tree)

```
Read @[current_problems]
├── 0 problems → CLEAN (proceed)
└── Problems found → Classify each:
    ├── Auto-fixable → Fix → Re-check (max 3 cycles)
    │   ├── 0 remaining → CLEAN (proceed)
    │   └── Still remaining → BLOCKED (escalate)
    └── Not fixable → BLOCKED (escalate)
```

---

## State Transitions

```
IDLE → CHECKING               [action received]
CHECKING → CLEAN              [0 problems]  // terminal
CHECKING → FIXING             [auto-fixable found]
CHECKING → BLOCKED            [only non-fixable]  // terminal
FIXING → VERIFYING            [fix applied]
VERIFYING → CLEAN             [0 remaining]  // terminal
VERIFYING → FIXING            [fixable + cycles < max]
VERIFYING → BLOCKED           [cycles >= max OR only non-fixable]  // terminal
```

---

## Auto-Fixable Patterns (4 — Fixed)

| Pattern | IDE Message Match | Fix Action |
|---------|------------------|------------|
| Missing import | `Cannot find name 'X'` | Add import statement |
| JSX namespace | `Cannot find namespace 'JSX'` | Import ReactNode / JSX types |
| Unused variable | `'x' is declared but never used` | Remove or prefix with `_` |
| CSS @import order | `@import must precede all other rules` | Move @import to top |

---

## Escalation Categories (3 — Fixed)

| Category | Indicators | Action |
|----------|-----------|--------|
| Logic error | Type mismatch, null ref | Notify user with context |
| Breaking change | Interface removed, property changed | Block, explain impact |
| Missing dependency | Module not found | Ask user to install |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_IDE_UNAVAILABLE` | Yes | Cannot read @[current_problems] |
| `ERR_FILE_WRITE_DENIED` | Yes | Cannot modify source file |
| `ERR_MAX_CYCLES_EXCEEDED` | Yes | Fix cycles exhausted (> 3) |
| `ERR_FIX_REGRESSION` | Yes | Fix introduced new error |
| `ERR_BLOCKED` | No | Unfixed errors remain |

**Fix regression:** If auto-fix introduces new errors → revert fix → escalate.

---

## Quick Reference

```bash
# Run TypeScript check
node .agent/skills/problem-checker/scripts/check_problems.js

# Check specific file
npx tsc --noEmit <file>
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/check_problems.js](scripts/check_problems.js) | Problem check script | Running checks |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `auto-learned` | Skill | Stores learned patterns |
| `skill-generator` | Skill | Generates from patterns |
| `/validate` | Workflow | Run all checks |

---

⚡ PikaKit v3.9.83
