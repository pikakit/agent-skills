---
name: "design-system"
description: "Accessible design-system architecture for tokens, typography, color, motion, components, and governance. Use for reusable visual language and component-system decisions. Do not use for one-off artwork or framework-specific state logic."
metadata:
  id: "design-system"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "design"
  risk_tier: "high"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["design system","design tokens","color system","typography scale","component library"]
  negative_triggers: ["one-off illustration","React state logic","mobile build configuration"]
  coordinates_with: ["react-pro","tailwind-kit","mobile-design","studio"]
  capabilities: ["define accessible tokens","specify component governance","review motion and visual hierarchy"]
  platforms: ["web","android","ios"]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# design-system

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

- define accessible tokens
- specify component governance
- review motion and visual hierarchy

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://www.w3.org/WAI/standards-guidelines/wcag/).
