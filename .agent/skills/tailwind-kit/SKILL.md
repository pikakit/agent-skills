---
name: "tailwind-kit"
description: "Tailwind CSS implementation guidance for responsive layouts, tokens, variants, and version 4 configuration. Use for Tailwind utility code. Do not use for framework architecture or product design decisions."
metadata:
  id: "tailwind-kit"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "frontend"
  risk_tier: "standard"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["Tailwind CSS","utility classes","responsive Tailwind","Tailwind v4"]
  negative_triggers: ["React state architecture","product design research","native mobile styles"]
  coordinates_with: ["design-system","react-pro","nextjs-pro"]
  capabilities: ["compose maintainable utilities","configure Tailwind v4","review responsive styling"]
  platforms: ["web"]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# tailwind-kit

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

- compose maintainable utilities
- configure Tailwind v4
- review responsive styling

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://tailwindcss.com/docs).
