---
name: e2e-automation
description: >-
  Web application testing principles. E2E, Playwright, visual testing, and deep audit strategies.
  Triggers on: E2E test, Playwright, browser test, visual testing, automation.
  Coordinates with: test-architect, perf-optimizer, cicd-pipeline.
metadata:
  version: "2.0.0"
  category: "testing"
  triggers: "E2E, Playwright, browser test, visual testing, automation"
  success_metrics: "critical paths tested, flake rate < 1%, zero orphaned browsers"
  coordinates_with: "test-architect, perf-optimizer, cicd-pipeline"
---

# E2E Automation — Playwright Testing

> Behavior-driven E2E tests. `data-testid` selectors. Auto-wait, never sleep. Zero flake tolerance.

---

## Prerequisites

**Required:** Playwright installed with Chromium browser.

```bash
npm install playwright && npx playwright install chromium
```

---

## When to Use

| Situation | Action |
|-----------|--------|
| Critical user flows | E2E with Playwright runner |
| Visual regression | Screenshot comparison (`--screenshot`) |
| Accessibility audit | A11y check (`--a11y`) |
| Component/unit testing | Use `test-architect` instead |
| API testing only | Use `test-architect` instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Playwright test runner (`scripts/playwright_runner.js`) | Unit/integration patterns (→ test-architect) |
| Screenshot capture (on-failure + on-demand) | Performance benchmarking (→ perf-optimizer) |
| Accessibility audit (axe-core via `--a11y`) | CI/CD pipeline config (→ cicd-pipeline) |
| ARIA snapshot testing reference | Browser scraping (→ agent-browser) |
| Test organization structure | Test content authoring |

**Automation skill:** Launches browser, navigates pages, captures screenshots. Session-based with side effects.

---

## Quick Reference

```bash
# Run Playwright tests
node .agent/skills/e2e-automation/scripts/playwright_runner.js https://example.com

# With screenshot
node .agent/skills/e2e-automation/scripts/playwright_runner.js <url> --screenshot

# Accessibility check
node .agent/skills/e2e-automation/scripts/playwright_runner.js <url> --a11y
```

---

## Playwright Config (Fixed Recommendations)

| Setting | Value | Rationale |
|---------|-------|-----------|
| Retries (CI) | 2 | Flake mitigation |
| Retries (local) | 0 | Development speed |
| Trace | on-first-retry | Disk space control |
| Screenshots | on-failure | Failure diagnosis |
| Video | retain-on-failure | Complex failure analysis |

---

## E2E Best Practices

| Rule | Enforcement |
|------|------------|
| Use `data-testid` selectors | CSS/XPath selectors forbidden |
| Auto-wait for elements | No `sleep()` or `setTimeout()` |
| Clean state per test | Fresh browser context each test |
| Test user behavior | Assert visible outcomes, not DOM structure |
| Isolate test data | No shared data between tests |

---

## Test Organization

```
tests/
├── e2e/           # Full user flows
├── integration/   # API, data
├── component/     # UI units
└── fixtures/      # Shared test data
```

---

## Session Lifecycle

```
IDLE → LAUNCHING          [run-tests invoked]
LAUNCHING → NAVIGATING    [browser started]
NAVIGATING → EXECUTING    [target loaded]
EXECUTING → CAPTURING     [screenshot/trace needed]
CAPTURING → REPORTING     [artifacts saved]
REPORTING → COMPLETED     [results output]  // terminal
LAUNCHING → ERROR         [browser launch failed]  // terminal
NAVIGATING → ERROR        [target unreachable]  // terminal
```

**Invariant:** Browser process ALWAYS terminated in Report phase. No orphaned processes.

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_PLAYWRIGHT_MISSING` | Yes | Playwright not installed |
| `ERR_BROWSER_LAUNCH` | Yes | Browser failed to start |
| `ERR_TARGET_UNREACHABLE` | Yes | Target URL not reachable |
| `ERR_TIMEOUT` | Yes | Test exceeded timeout |
| `ERR_SELECTOR_NOT_FOUND` | Yes | Element not found on page |
| `ERR_ASSERTION_FAILED` | No | Test assertion did not pass |
| `ERR_A11Y_VIOLATION` | Yes | WCAG violation detected |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Test implementation details | Test user-visible behavior |
| Hardcode waits (`sleep`) | Use Playwright auto-wait |
| Skip test cleanup | Isolate with fresh context |
| Ignore flaky tests | Fix root cause; track flake rate |
| Use CSS/XPath selectors | Use `data-testid` attributes |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [aria-snapshot.md](references/aria-snapshot.md) | ARIA snapshot testing pattern | ARIA-based tests |
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

| Script | Purpose |
|--------|---------|
| `scripts/playwright_runner.js` | Test execution runner |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `test-architect` | Skill | Unit/integration patterns |
| `cicd-pipeline` | Skill | CI integration |

---

⚡ PikaKit v3.9.72
