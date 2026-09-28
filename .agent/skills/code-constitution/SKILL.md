---
name: code-constitution
description: This skill should be used when the user asks to govern a breaking change, review a critical data boundary, resolve a doctrine conflict, or assess agent authority.
metadata:
  id: code-constitution
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: critical
  version: "3.9.224"
  author: pikakit
  triggers: ["govern a breaking change", "review a critical data boundary", "resolve a doctrine conflict", "assess agent authority"]
  negative_triggers: ["perform a routine code review", "scan source code for vulnerabilities", "format source code"]
  coordinates_with: [code-review, security-scanner, system-design]
  capabilities: ["governance precedence", "change risk classification", "doctrine enforcement", "violation response"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 90
---

# Code Constitution

Apply repository governance to high-impact changes without replacing domain review or automated validation.

## Workflow

1. Declare the proposed change, affected owners, trust boundaries, data classes, compatibility impact, and rollback path.
2. Read `rules/constitution/master-constitution.md`, then load only the applicable doctrine and enforcement checklist.
3. Classify conflicts by authority: platform policy, repository standard, accepted ADR, then local convention.
4. Reject changes that conceal uncertainty, mutate authoritative history, bypass ownership, or lack verification and rollback.
5. Record the governing rule, evidence, exception owner, and expiry for any approved deviation.
6. Run the applicable checklist and release gate before approval.

## Boundaries

- Route ordinary implementation review to `code-review`.
- Route vulnerability discovery to `security-scanner`.
- Route architecture option analysis to `system-design`.
- Treat doctrine text as repository policy, not external legal, compliance, or safety advice.

## Resources

- `rules/constitution/master-constitution.md`: authority and invariant model.
- `rules/doctrines/`: concern-specific governance.
- `rules/enforcement/checklists/`: review gates.
- `rules/enforcement/playbooks/doctrine-violation-playbook.md`: incident response.
- `rules/production-gates.md`: release decision.
