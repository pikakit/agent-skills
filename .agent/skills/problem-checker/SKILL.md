---
name: problem-checker
description: >-
  Automated IDE problem detection and auto-fix before task completion. Checks
  @[current_problems] and auto-fixes common issues. Triggers on: before notify_user, after code
  modification, IDE errors.
metadata:
  author: pikakit
  version: "2.0.0"
---

# Problem Checker â€” Automated IDE Error Gate

> 4 auto-fix patterns. 3 escalation categories. Max 3 cycles. Hard-block on errors.

---

## ðŸš¨ Critical Rule

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
| IDE problem detection (`@[current_problems]`) | Pattern storage (â†’ auto-learned) |
| Auto-fix (4 patterns) | Skill generation (â†’ skill-generator) |
| Fix-verify loop (max 3 cycles) | Full test execution (â†’ /validate) |
| Completion gate (hard-block) | Code review (â†’ code-review) |

**Automation (scripted):** Reads IDE state, modifies files (auto-fix), re-checks. Sequential only.

---

## Check Protocol (Decision Tree)

```
Read @[current_problems]
â”œâ”€â”€ 0 problems â†’ CLEAN (proceed)
â””â”€â”€ Problems found â†’ Classify each:
    â”œâ”€â”€ Auto-fixable â†’ Fix â†’ Re-check (max 3 cycles)
    â”‚   â”œâ”€â”€ 0 remaining â†’ CLEAN (proceed)
    â”‚   â””â”€â”€ Still remaining â†’ BLOCKED (escalate)
    â””â”€â”€ Not fixable â†’ BLOCKED (escalate)
```

---

## State Transitions

```
IDLE â†’ CHECKING               [action received]
CHECKING â†’ CLEAN              [0 problems]  // terminal
CHECKING â†’ FIXING             [auto-fixable found]
CHECKING â†’ BLOCKED            [only non-fixable]  // terminal
FIXING â†’ VERIFYING            [fix applied]
VERIFYING â†’ CLEAN             [0 remaining]  // terminal
VERIFYING â†’ FIXING            [fixable + cycles < max]
VERIFYING â†’ BLOCKED           [cycles >= max OR only non-fixable]  // terminal
```

---

## Auto-Fixable Patterns (4 â€” Fixed)

| Pattern | IDE Message Match | Fix Action |
|---------|------------------|------------|
| Missing import | `Cannot find name 'X'` | Add import statement |
| JSX namespace | `Cannot find namespace 'JSX'` | Import ReactNode / JSX types |
| Unused variable | `'x' is declared but never used` | Remove or prefix with `_` |
| CSS @import order | `@import must precede all other rules` | Move @import to top |

---

## Escalation Categories (3 â€” Fixed)

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

**Fix regression:** If auto-fix introduces new errors â†’ revert fix â†’ escalate.

---

## Quick Reference

```bash
# Run TypeScript check
node .agent/skills/problem-checker/scripts/check_problems.js

# Check specific file
npx tsc --noEmit <file>
```

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/check_problems.js](scripts/check_problems.js) | Problem check script | Running checks |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `auto-learned` | Skill | Stores learned patterns |
| `skill-generator` | Skill | Generates from patterns |
| `/validate` | Workflow | Run all checks |

---

âš¡ PikaKit v3.9.105
