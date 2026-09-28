---
name: offensive-sec
description: This skill should be used when the user asks to "plan an authorized penetration test", "design a red-team exercise", "map ATT&CK techniques", or "write a finding report". Do not use it without explicit scope or for defensive source scanning.
metadata:
  id: offensive-sec
  schema_version: "2.0.0"
  type: knowledge
  category: security
  risk_tier: critical
  version: "4.0.0"
  author: pikakit
  triggers: ["plan an authorized penetration test", "design a red-team exercise", "map ATT&CK techniques", "write a finding report"]
  negative_triggers: ["scan source code defensively", "test an unowned target", "implement authentication"]
  coordinates_with: [security-scanner, auth-patterns, problem-checker]
  capabilities: [engagement-planning, threat-emulation, evidence-handling, remediation-reporting]
  platforms: [web, api, cloud, enterprise]
  last_reviewed: "2026-09-28"
  review_interval_days: 90
---

# Offensive Security

Plan authorized, bounded security assessments that improve defensive controls. Never infer authorization from technical access.

## Authorization Gate

Require written rules of engagement containing the owner, exact targets, permitted techniques, time window, data-handling rules, stop conditions, emergency contacts, and approval. Stop when any field is absent or target identity is ambiguous.

## Workflow

1. Record scope and exclusions before discussing test actions.
2. Translate objectives into observable hypotheses and ATT&CK technique identifiers.
3. Prefer the least disruptive validation capable of proving the hypothesis.
4. Define telemetry, cleanup, evidence retention, and rollback before execution.
5. Pause on unexpected impact, sensitive-data access, scope drift, or loss of monitoring.
6. Report reproducible evidence, business impact, detection coverage, and remediation.
7. Verify cleanup and obtain closure from the system owner.

## Safety Boundaries

- Do not provide operational steps for unauthorized access, persistence, evasion, destructive actions, credential theft, or indiscriminate exploitation.
- Do not test availability controls in production unless explicitly approved with a tested abort path.
- Minimize collected data; redact secrets and personal data from evidence.
- Treat successful access as a stop-and-report event unless lateral movement is explicitly authorized.

## Output Contract

Return authorization status, scope, assumptions, hypotheses, test plan, risk controls, stop conditions, evidence plan, cleanup plan, and report format. Return `BLOCKED` when authorization or scope cannot be verified. Read [engineering-spec.md](rules/engineering-spec.md) for the engagement decision gate.
