---
name: test-driven-dev
description: >-
  Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.
  Triggers on: TDD, test first, red-green-refactor.
  Coordinates with: test-architect, code-craft.
metadata:
  version: "2.0.0"
  category: "testing"
  triggers: "TDD, test first, red-green-refactor, write test"
  success_metrics: "tests written before code, high coverage"
  coordinates_with: "test-architect, code-craft"
---

# Test-Driven Development — RED-GREEN-REFACTOR

> Write test first. Watch it fail. Write minimal code. Refactor. Repeat.

---

## When to Use

| Situation | TDD Value |
|-----------|-----------|
| New feature | High |
| Bug fix | High (reproduce with test first) |
| Complex logic | High |
| Exploratory | Low (spike first, then TDD) |
| UI layout | Low |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| TDD cycle (RED/GREEN/REFACTOR) | Testing patterns (→ test-architect) |
| 3 Laws of TDD | Mock strategies (→ test-architect) |
| Phase guidance + rules | Clean code (→ code-craft) |
| Value routing (5 situations) | Test execution / coverage |

**Expert decision skill:** Produces TDD workflow guidance. Does not write or execute tests.

---

## The TDD Cycle (3 Phases — Fixed)

```
🔴 RED → Write failing test
    ↓
🟢 GREEN → Write minimal code to pass
    ↓
🔵 REFACTOR → Improve code quality
    ↓
   Repeat...
```

---

## 3 Laws of TDD (Immutable)

1. Write production code only to make a failing test pass
2. Write only enough test to demonstrate failure
3. Write only enough code to make the test pass

---

## RED Phase

| Focus | Example |
|-------|---------|
| Behavior | "should add two numbers" |
| Edge cases | "should handle empty input" |
| Error states | "should throw for invalid data" |

**Rules:** Test must fail first. One assertion per test.

---

## GREEN Phase (3 Principles)

| Principle | Meaning |
|-----------|---------|
| **YAGNI** | You Aren't Gonna Need It |
| **Simplest** | Write minimum to pass |
| **No premature work** | Just make it work |

---

## REFACTOR Phase (4 Areas)

| Area | Action |
|------|--------|
| Duplication | Extract common code |
| Naming | Make intent clear |
| Structure | Improve organization |
| Complexity | Simplify logic |

**Rules:** All tests must stay green. Small incremental changes.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_SITUATION` | Yes | Situation not one of 5 |
| `ERR_INVALID_PHASE` | Yes | Phase not red, green, or refactor |

**Zero internal retries.** Same situation = same value assessment.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Skip the RED phase | Watch test fail first |
| Write tests after code | Write tests before code |
| Over-engineer in GREEN | Keep it simple (YAGNI) |
| Multiple asserts per test | One behavior per test |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `test-architect` | Skill | Testing patterns |
| `code-craft` | Skill | Clean code |

---

⚡ PikaKit v3.9.80
