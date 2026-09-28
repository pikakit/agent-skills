---
name: "e2e-automation"
description: "End-to-end browser automation guidance for stable, accessible, observable user-journey tests. Use for browser test architecture and flaky E2E diagnosis. Do not use for unit-test-only work or manual browser inspection."
metadata:
  id: "e2e-automation"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "quality"
  risk_tier: "high"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["end-to-end test","browser automation","Playwright","flaky E2E","user journey test"]
  negative_triggers: ["unit test only","manual browser inspection","native mobile test"]
  coordinates_with: ["test-architect","chrome-devtools","debug-pro"]
  capabilities: ["design resilient browser tests","choose accessible locators","diagnose E2E flakiness"]
  platforms: ["web"]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# e2e-automation

## Operating contract

Use this skill only when the request matches its positive triggers and none of its negative triggers. Establish the target platform, constraints, and acceptance evidence before recommending changes. Prefer repository conventions and official platform behavior over generic patterns.

## Workflow

1. Confirm scope, ownership boundaries, runtime versions, and risk.
2. Inspect the relevant implementation and reproduce or baseline the current behavior.
3. Select the smallest applicable rules from `rules/` or the guidance below.
4. State trade-offs and failure modes before changing code or configuration.
5. Verify with the narrowest reliable checks, then run the project gate.
6. Report evidence, residual risk, and rollback conditions.

## Capabilities

- design resilient browser tests
- choose accessible locators
- diagnose E2E flakiness

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://playwright.dev/docs/best-practices).
