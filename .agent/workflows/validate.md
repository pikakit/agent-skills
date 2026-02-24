---
description: Test automation with Vitest/Playwright. Generate, execute, and analyze coverage with AAA pattern.
---

# /validate - Test Automation Suite

$ARGUMENTS

---

## Purpose

Generate comprehensive tests, execute suites, and analyze coverage. **AAA pattern, mutation testing, visual regression, and contract testing.**

---

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
|-------|-------|--------|
| **Test Generation** | `learner` | Analyze existing patterns for consistency |
| **Pre-Test** | `recovery` | Save state before execution |
| **Post-Test** | `learner` | Log common failure patterns |
| **On Failure** | `assessor` | Evaluate failure severity |

---

## Sub-commands

```
/validate              - Run all tests
/validate [target]     - Generate tests for specific file/feature
/validate coverage     - Show coverage report
/validate watch        - Run in watch mode
/validate fix          - Auto-fix failing tests
/validate mutation     - Run mutation testing
/validate visual       - Run visual regression tests
/validate contract     - Run API contract tests
```

---

## Phase 1: Test Generation Protocol

### Analyze Target
```
For function/component, identify:
□ Happy path (normal use)
□ Edge cases (boundaries, empty, null)
□ Error cases (invalid input, exceptions)
□ Integration points (external deps)
```

### Test Case Categories

| Category | Example |
|----------|---------|
| **Happy Path** | Valid input → expected output |
| **Empty Input** | `""`, `[]`, `null`, `undefined` |
| **Boundary** | Min, max, off-by-one |
| **Type Errors** | Wrong type, missing property |
| **Async** | Timeout, race condition, retry |
| **Security** | XSS, injection, auth bypass |

### AAA Pattern

```typescript
describe('UserService', () => {
  it('should create user with valid data', async () => {
    // ARRANGE
    const input = { email: 'test@example.com', name: 'Test' };
    // ACT
    const result = await userService.createUser(input);
    // ASSERT
    expect(result.id).toBeDefined();
    expect(result.email).toBe(input.email);
  });
});
```

---

## Phase 2: Mutation Testing

**What:** Automatically modify source code (mutants) and verify tests catch the changes.

```bash
/validate mutation

# Uses: Stryker (JS/TS) or mutmut (Python)
npx stryker run
```

| Mutant Type | Example | Good Test Catches It? |
|-------------|---------|----------------------|
| Conditional | `>` → `>=` | ✅ Boundary test |
| Return value | `return true` → `return false` | ✅ Assert on return |
| Remove call | Delete `validate()` | ✅ Integration test |
| Arithmetic | `+` → `-` | ✅ Calculation test |

**Target:** Mutation score ≥ 80%. If lower, tests are weak.

---

## Phase 3: Visual Regression Testing

```bash
/validate visual

# Captures screenshots and compares against baselines
npx playwright test --project=visual
```

| Tool | Best For | Integration |
|------|----------|-------------|
| **Playwright screenshots** | Component snapshots | Built-in |
| **Percy** | Full-page visual diffs | CI/CD |
| **Chromatic** | Storybook components | Storybook |

**Workflow:**
1. Baseline: Capture reference screenshots
2. Change: Modify code
3. Compare: Pixel-diff against baseline
4. Review: Approve or reject visual changes

---

## Phase 4: Contract Testing

```bash
/validate contract

# API consumer-provider contract verification
npx pact-verifier
```

| Pattern | Use When |
|---------|----------|
| **Consumer-driven (Pact)** | Frontend ↔ Backend API contracts |
| **Provider-driven (OpenAPI)** | Public API validation |
| **Schema validation (Zod)** | Runtime type checking |

**Contract test flow:**
```
Consumer defines expected API → Generate contract
Provider verifies against contract → Pass/fail
Breaking change? → Contract fails before deploy
```

---

## Phase 5: Framework Detection & Execution

| Project | Framework | Config |
|---------|-----------|--------|
| Next.js | Vitest | vitest.config.ts |
| Node.js | Jest | jest.config.js |
| React | Vitest + RTL | vitest.config.ts |
| API | Supertest | jest.config.js |
| Python | Pytest | pytest.ini |

---

## Output Format

```markdown
## 🧪 Test Results

### Summary
✅ Passed: 42  ❌ Failed: 2  ⏭️ Skipped: 1

### Coverage
| Metric | Current | Target | Status |
|--------|---------|--------|--------|
| Statements | 85% | 80% | ✅ |
| Branches | 72% | 70% | ✅ |
| Mutation Score | 82% | 80% | ✅ |
| Visual Diffs | 0 | 0 | ✅ |
| Contracts | 5/5 | 100% | ✅ |

### Next Steps
- [ ] Fix 2 failing tests
- [ ] Review visual baselines
```

---

## Key Principles

1. **Test behavior, not implementation**
2. **One assertion per test**
3. **Descriptive names** — test name = documentation
4. **Mock external deps** — isolate unit under test
5. **Mutation testing** — verify test quality
6. **Visual regression** — catch UI drift

---

## 🔗 Workflow Chain

**Skills (3):** `test-architect` · `e2e-automation` · `code-review`

| After /validate | Run | Purpose |
|-----------------|-----|---------|
| All pass | `/launch` | Deploy |
| Tests fail | `/diagnose` | Root cause |
| Need review | `/inspect` | Code review |

---

**Version:** 2.0.0 · **Updated:** v3.9.64
