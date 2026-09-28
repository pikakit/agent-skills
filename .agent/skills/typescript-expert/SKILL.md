---
name: "typescript-expert"
description: "Strict TypeScript type-system, API, configuration, and migration guidance. Use for type errors, public type design, generics, narrowing, or tsconfig. Do not use for JavaScript-only runtime diagnosis."
metadata:
  id: "typescript-expert"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "quality"
  risk_tier: "high"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["TypeScript","type error","generic type","type narrowing","tsconfig"]
  negative_triggers: ["JavaScript runtime only","CSS styling","database schema only"]
  coordinates_with: ["code-craft","react-pro","nextjs-pro","test-architect"]
  capabilities: ["design sound public types","configure strict compilation","diagnose type-system failures"]
  platforms: ["node","web"]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# typescript-expert

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

- design sound public types
- configure strict compilation
- diagnose type-system failures

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://www.typescriptlang.org/docs/).
