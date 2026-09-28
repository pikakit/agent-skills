---
name: "chrome-devtools"
description: "Evidence-driven browser diagnosis with Chrome DevTools for DOM, accessibility, network, performance, and runtime behavior. Use for inspecting a running web page. Do not use for source-only review without a browser target."
metadata:
  id: "chrome-devtools"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "quality"
  risk_tier: "standard"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["Chrome DevTools","inspect webpage","network trace","browser performance","accessibility tree"]
  negative_triggers: ["source-only review","native mobile debugging","server shell diagnosis"]
  coordinates_with: ["e2e-automation","perf-optimizer","debug-pro"]
  capabilities: ["capture browser evidence","diagnose network and runtime failures","inspect accessibility state"]
  platforms: ["web"]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# chrome-devtools

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

- capture browser evidence
- diagnose network and runtime failures
- inspect accessibility state

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://developer.chrome.com/docs/devtools/).
