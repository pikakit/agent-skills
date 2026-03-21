---
name: test-architect
description: >-
  Testing patterns and principles - unit, integration, E2E, and mocking strategies.
  Use when writing tests, improving coverage, or establishing testing standards.
  Triggers on: test, testing, unit test, coverage, mocking, AAA pattern.
  Coordinates with: code-craft, e2e-automation, code-review.
metadata:
  version: "2.0.0"
  category: "testing"
  triggers: "test, unit test, coverage, mocking, AAA, jest, vitest"
  success_metrics: "test coverage >80%, all tests pass"
  coordinates_with: "code-craft, e2e-automation, code-review"
---

# Test Architect — Testing Patterns & Principles

> Pyramid/Trophy/Honeycomb strategy. AAA structure. FIRST principles. Mock routing.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Writing unit tests | AAA pattern, FIRST principles |
| Need mocking | Stub/Spy/Mock/Fake selection |
| Test organization | Grouping and naming |
| Coverage gaps | Identify what to test |
| Strategy selection | Match to architecture type |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Strategy selection (3 models) | E2E browser testing (→ e2e-automation) |
| AAA pattern + FIRST principles | TDD workflow (→ test-driven-dev) |
| Mock type routing (4 types) | Code quality (→ code-craft) |
| Naming conventions (3 patterns) | Test execution / coverage tooling |

**Expert decision skill:** Produces testing guidance. Does not write or execute tests.

---

## Strategy Selection (3 Models — Deterministic)

| Model | Distribution | Best For |
|-------|-------------|----------|
| **Pyramid** | Unit 70% > Int 20% > E2E 10% | Monoliths |
| **Trophy** | Integration-heavy | Modern SPAs |
| **Honeycomb** | Contract-centric | Microservices |

---

## AAA Pattern (Fixed)

| Step | Purpose |
|------|---------|
| **Arrange** | Set up test data |
| **Act** | Execute code under test |
| **Assert** | Verify outcome |

---

## FIRST Principles (5 — Fixed)

| Principle | Constraint |
|-----------|-----------|
| **F**ast | < 100ms each |
| **I**solated | No external deps |
| **R**epeatable | Same result always |
| **S**elf-checking | No manual verification |
| **T**imely | Written with code |

---

## Mock Types (4 — Deterministic)

| Type | Use When |
|------|----------|
| **Stub** | Return fixed values |
| **Spy** | Track calls |
| **Mock** | Set expectations |
| **Fake** | Simplified implementation |

### What to Mock vs Not

| ✅ Mock | ❌ Don't Mock |
|---------|--------------|
| External APIs | Code under test |
| Database (unit) | Pure functions |
| Time/random | Simple dependencies |
| Network | In-memory stores |

---

## Naming Conventions (3 Patterns)

| Pattern | Example |
|---------|---------|
| Should | "should return error when..." |
| When | "when user not found..." |
| Given-When-Then | "given X, when Y, then Z" |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_ARCHITECTURE` | Yes | Architecture not one of 3 |
| `ERR_UNKNOWN_DEPENDENCY` | Yes | Dependency type not recognized |
| `ERR_UNKNOWN_TEST_LEVEL` | Yes | Test level not unit/integration/e2e |

**Zero internal retries.** Same architecture = same strategy model.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test behavior |
| Duplicate test code | Use factories |
| Complex test setup (>10 lines) | Simplify or split |
| Skip cleanup | Reset state after each test |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [test_runner.js](scripts/test_runner.js) | Unified test execution + coverage validation | Running tests |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `e2e-automation` | Skill | Browser testing |
| `test-driven-dev` | Skill | TDD workflow |

---

⚡ PikaKit v3.9.105
