---
name: test-architect
description: >-
  Testing patterns and principles - unit, integration, E2E, and mocking strategies.
  Use when writing tests, improving coverage, or establishing testing standards.
  Triggers on: test, testing, unit test, coverage, mocking, AAA pattern.
  Coordinates with: code-craft, e2e-automation, code-review.
metadata:
  category: "testing"
  version: "1.0.0"
  triggers: "test, unit test, coverage, mocking, AAA, jest, vitest"
  coordinates_with: "code-craft, e2e-automation, code-review"
  success_metrics: "test coverage >80%, all tests pass"
---

# Test Architect

> **Purpose:** Testing patterns and principles for reliable test suites.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Writing unit tests | AAA pattern, FIRST principles |
| Need mocking | Stub/Spy/Mock selection |
| Test organization | Grouping and naming |
| Coverage gaps | Identify what to test |

---

## Testing Pyramid

```
        /\          E2E (Few) - Critical flows
       /  \         
      /----\
     /      \       Integration (Some) - API, DB
    /--------\      
   /          \     Unit (Many) - Functions, classes
```

### Strategy Selection

| Model | Structure | Best For |
|-------|-----------|----------|
| **Pyramid** | Unit 70% > Int 20% > E2E 10% | Monoliths |
| **Trophy** | Integration-heavy | Modern SPAs |
| **Honeycomb** | Contract-centric | Microservices |

---

## AAA Pattern

| Step | Purpose |
|------|---------|
| **Arrange** | Set up test data |
| **Act** | Execute code under test |
| **Assert** | Verify outcome |

---

## FIRST Principles

| Principle | Meaning |
|-----------|---------|
| **F**ast | < 100ms each |
| **I**solated | No external deps |
| **R**epeatable | Same result always |
| **S**elf-checking | No manual verification |
| **T**imely | Written with code |

---

## Mock Types

| Type | Use |
|------|-----|
| **Stub** | Return fixed values |
| **Spy** | Track calls |
| **Mock** | Set expectations |
| **Fake** | Simplified implementation |

---

## What to Mock

| ✅ Mock | ❌ Don't Mock |
|---------|---------------|
| External APIs | Code under test |
| Database (unit) | Pure functions |
| Time/random | Simple dependencies |
| Network | In-memory stores |

---

## Test Naming

| Pattern | Example |
|---------|---------|
| Should behavior | "should return error when..." |
| When condition | "when user not found..." |
| Given-when-then | "given X, when Y, then Z" |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Test implementation | Test behavior |
| Duplicate test code | Use factories |
| Complex test setup | Simplify or split |
| Skip cleanup | Reset state |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `e2e-automation` | Skill | Browser testing |
| `test-driven-dev` | Skill | TDD workflow |

---

⚡ PikaKit v3.2.0
