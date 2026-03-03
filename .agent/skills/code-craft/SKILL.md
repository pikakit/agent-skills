---
name: code-craft
description: >-
  Pragmatic coding standards — concise, direct, no over-engineering.
  Fixed thresholds: 20 lines/function, 3 args max, 2 nesting levels.
  Triggers on: code style, clean code, best practices, naming conventions, SRP, DRY, KISS.
  Coordinates with: code-review, test-architect.
metadata:
  version: "2.0.0"
  priority: "CRITICAL"
  category: "core"
  triggers: "code style, clean code, best practices, naming conventions, SRP, DRY, KISS"
  success_metrics: "lint errors = 0, all naming rules followed, functions ≤ 20 lines"
  coordinates_with: "code-review, test-architect"
---

# Code Craft — Pragmatic Coding Standards

> Concise. Direct. Measurable. Fixed thresholds: 20 lines/function, 3 args, 2 nesting levels.

---

## Prerequisites

**Required:** None — Code Craft is a knowledge-based skill with no external dependencies.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Writing production code | Apply core principles + naming/function rules |
| Reviewing code quality | Run full-review check |
| Editing existing files | Check dependency impact first |
| Completing any task | Run 4-item self-check |
| Architecture review | Read `references/engineering-spec.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Naming conventions (4 rules) | Lint/format execution (→ code-review) |
| Function design (5 rules with thresholds) | Test writing (→ test-architect) |
| Code structure (4 patterns) | Constitutional governance (→ code-constitution) |
| Dependency awareness protocol | Language-specific style guides |
| Pre-completion self-check (4 items) | Automated code modification |

**Pure decision skill:** Produces coding guidance and evaluation results. Zero side effects.

---

## Core Principles

| Principle | Rule |
|-----------|------|
| **SRP** | Each function/class does ONE thing |
| **DRY** | Extract duplicated code; reuse |
| **KISS** | Simplest solution that works |
| **YAGNI** | Don't build features until needed |
| **Boy Scout** | Leave code cleaner than you found it |

---

## Naming Rules

| Element | Convention |
|---------|-----------|
| **Variables** | Reveal intent: `userCount` not `n` |
| **Functions** | Verb + noun: `getUserById()` not `user()` |
| **Booleans** | Question form: `isActive`, `hasPermission`, `canEdit` |
| **Constants** | SCREAMING_SNAKE: `MAX_RETRY_COUNT` |

---

## Function Rules (Fixed Thresholds)

| Rule | Threshold |
|------|-----------|
| **Size** | Max 20 lines; target 5–10 |
| **Responsibility** | Does one thing only |
| **Abstraction** | One level of abstraction per function |
| **Arguments** | Max 3; prefer 0–2 |
| **Side Effects** | Don't mutate inputs unexpectedly |

---

## Code Structure

| Pattern | Rule |
|---------|------|
| **Guard Clauses** | Early returns for edge cases |
| **Flat > Nested** | Max 2 levels of nesting |
| **Composition** | Small functions composed together |
| **Colocation** | Keep related code close |

---

## Before Editing ANY File

| Check | Why |
|-------|-----|
| **What imports this file?** | Dependents might break |
| **What does this file import?** | Interface changes propagate |
| **What tests cover this?** | Tests might fail |

> 🔴 **Rule:** Edit the file + ALL dependent files in the SAME task.

---

## Self-Check Before Completing

| # | Check | Question |
|---|-------|----------|
| 1 | ✅ Goal met? | Did I do exactly what user asked? |
| 2 | ✅ Files complete? | Did I modify all necessary files? |
| 3 | ✅ Code works? | Did I verify the change? |
| 4 | ✅ No errors? | Lint and TypeScript pass? |

> 🔴 **Rule:** If ANY check fails, fix it before completing.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CODE` | Yes | Code snippet not provided |
| `ERR_MISSING_FILE_PATH` | Yes | File path required for dependency check |
| `ERR_EMPTY_CODE` | Yes | Code snippet is empty |
| `WARN_UNKNOWN_LANGUAGE` | Yes | Language not recognized; generic rules applied |

**Zero internal retries.** Deterministic evaluation; same code = same violations.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Comment every line | Delete obvious comments |
| Helper for one-liner | Inline the code |
| Deep nesting (3+ levels) | Guard clauses; max 2 levels |
| Magic numbers | Named constants |
| God functions (50+ lines) | Split by responsibility; max 20 lines |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [verification-scripts.md](references/verification-scripts.md) | Validation scripts | Running automated checks |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality review and lint execution |
| `test-architect` | Skill | Test writing and coverage |
| `code-constitution` | Skill | Constitutional governance |

---

⚡ PikaKit v3.9.72
