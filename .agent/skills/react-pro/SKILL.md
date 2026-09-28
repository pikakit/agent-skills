---
name: "react-pro"
description: "Production React component, hook, state, accessibility, and rendering guidance. Use for React or TSX component architecture. Do not use for Next.js routing, native mobile UI, or CSS-only styling."
metadata:
  id: "react-pro"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "frontend"
  risk_tier: "high"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["React component","React hook","TSX","React state","React rendering"]
  negative_triggers: ["Next.js route","native mobile UI","CSS-only styling"]
  coordinates_with: ["nextjs-pro","typescript-expert","design-system","test-architect"]
  capabilities: ["design component boundaries","review hook and state usage","diagnose rendering behavior"]
  platforms: ["web"]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# react-pro

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

- design component boundaries
- review hook and state usage
- diagnose rendering behavior

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://react.dev/reference/react).
