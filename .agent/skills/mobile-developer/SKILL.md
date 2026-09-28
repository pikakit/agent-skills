---
name: "mobile-developer"
description: "Production mobile engineering guidance for native iOS, native Android, React Native, and Flutter. Use for implementation, lifecycle, deep links, notifications, testing, and release readiness. Do not use for design-only requests."
metadata:
  id: "mobile-developer"
  schema_version: "2.0.0"
  type: "knowledge"
  category: "mobile"
  risk_tier: "high"
  version: "4.0.0"
  author: "pikakit"
  triggers: ["mobile application","React Native","Flutter","SwiftUI","Jetpack Compose"]
  negative_triggers: ["design-only mobile mockup","responsive website","backend-only API"]
  coordinates_with: ["mobile-design","security-scanner","test-architect","cicd-pipeline"]
  capabilities: ["choose a mobile implementation path","review lifecycle and platform integration","plan test and release gates"]
  platforms: ["android","ios"]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# mobile-developer

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

- choose a mobile implementation path
- review lifecycle and platform integration
- plan test and release gates

## Safety and quality gates

- Treat missing inputs, failed tools, and ambiguous results as errors rather than success.
- Preserve public interfaces unless the task explicitly authorizes a breaking change.
- Do not claim support for tools, APIs, or metrics that were not observed or sourced.
- Redact credentials and personal data from examples, logs, and diagnostics.
- Require accessible behavior and deterministic verification where the platform supports them.

## References

Load only the rule files relevant to the current decision. The authoritative external baseline is [official documentation](https://developer.android.com/guide).
