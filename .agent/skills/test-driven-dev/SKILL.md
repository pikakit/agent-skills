---
name: test-driven-dev
description: >-
  Test-Driven Development workflow principles. RED-GREEN-REFACTOR cycle.
  Triggers on: TDD, test first, red-green-refactor.
  Coordinates with: test-architect, code-craft.
metadata:
  category: "testing"
  version: "1.0.0"
  triggers: "TDD, test first, red-green-refactor, write test"
  coordinates_with: "test-architect, code-craft"
  success_metrics: "tests written before code, high coverage"
---

# TDD Workflow

> **Purpose:** Test-Driven Development - write tests first, code second.

---

## When to Use

| Situation | TDD Value |
|-----------|-----------|
| New feature | High |
| Bug fix | High (test first) |
| Complex logic | High |
| Exploratory | Low (spike, then TDD) |
| UI layout | Low |

---

## The TDD Cycle

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

## Three Laws of TDD

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

**Rules:** Test must fail first, one assertion per test.

---

## GREEN Phase

| Principle | Meaning |
|-----------|---------|
| **YAGNI** | You Aren't Gonna Need It |
| **Simplest** | Write minimum to pass |
| **No optimization** | Just make it work |

---

## REFACTOR Phase

| Area | Action |
|------|--------|
| Duplication | Extract common code |
| Naming | Make intent clear |
| Structure | Improve organization |
| Complexity | Simplify logic |

**Rules:** All tests must stay green, small incremental changes.

---

## AAA Pattern

| Step | Purpose |
|------|---------|
| **Arrange** | Set up test data |
| **Act** | Execute code under test |
| **Assert** | Verify expected outcome |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Skip the RED phase | Watch test fail first |
| Write tests after | Write tests before |
| Over-engineer initial | Keep it simple |
| Multiple asserts | One behavior per test |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `test-architect` | Skill | Testing patterns |
| `code-craft` | Skill | Clean code |

---

⚡ PikaKit v3.9.67
