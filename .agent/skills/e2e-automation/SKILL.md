---
name: e2e-automation
description: >-
  Web application testing principles. E2E, Playwright, visual testing, and deep audit strategies.
  Triggers on: E2E test, Playwright, browser test, visual testing, automation.
  Coordinates with: test-architect, perf-optimizer, cicd-pipeline.
metadata:
  category: "testing"
  version: "1.0.0"
  triggers: "E2E, Playwright, browser test, visual testing, automation"
  coordinates_with: "test-architect, perf-optimizer, cicd-pipeline"
  success_metrics: "critical paths tested, zero flaky tests"
---

# E2E Automation

> **Purpose:** Web application E2E testing with Playwright and deep audit strategies.

---

## 🔧 Quick Reference

```bash
# Run Playwright tests
node .agent/skills/e2e-automation/scripts/playwright_runner.js https://example.com

# With screenshot
node .agent/skills/e2e-automation/scripts/playwright_runner.js <url> --screenshot

# Accessibility check
node .agent/skills/e2e-automation/scripts/playwright_runner.js <url> --a11y
```

**Requires:** `npm install playwright && npx playwright install chromium`

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Critical user flows | E2E with Playwright |
| Component testing | Use test-architect instead |
| Visual regression | Visual testing with screenshots |
| API testing only | Use test-architect |

---

## Testing Pyramid

```
        /\          E2E (Few) - Critical flows
       /  \         
      /----\
     /      \       Integration (Some) - API, DB
    /--------\      
   /          \     Component (Many) - UI units
```

---

## E2E Best Practices

| Practice | Why |
|----------|-----|
| Use data-testid | Stable selectors |
| Wait for elements | Avoid flaky tests |
| Clean state | Independent tests |
| Test user behavior | Not implementation |

---

## Playwright Config

| Setting | Recommendation |
|---------|----------------|
| Retries | 2 on CI |
| Trace | on-first-retry |
| Screenshots | on-failure |
| Video | retain-on-failure |

---

## Test Organization

```
tests/
├── e2e/           # Full user flows
├── integration/   # API, data
├── component/     # UI units
└── fixtures/      # Shared data
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|----------|-------|
| Test implementation | Test behavior |
| Hardcode waits | Use auto-wait |
| Skip cleanup | Isolate tests |
| Ignore flaky tests | Fix root cause |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/validate` | Workflow | Run all tests |
| `test-architect` | Skill | Unit/integration patterns |
| `cicd-pipeline` | Skill | CI integration |

---

## References

- [references/aria-snapshot.md](references/aria-snapshot.md) - ARIA Snapshot pattern

---

⚡ PikaKit v3.9.68
