---
title: Architecture Decision Gate
kind: process
impact: high
tags: [architecture, adr, verification]
applies_to: [system-design]
last_reviewed: "2026-09-28"
sources:
  - title: AWS Well-Architected Framework
    url: https://docs.aws.amazon.com/wellarchitected/latest/framework/welcome.html
  - title: PikaKit production skill rubric
    internal_ref: ../../../standards/PRODUCTION_RUBRIC.md
---

# Architecture Decision Gate

## Preconditions

- Name the decision owner, stakeholders, scope, deadline, and review trigger.
- Record functional requirements, quality attributes, scale assumptions, security, compliance, budget, and team constraints.
- Identify unknowns that could change the decision.

## Procedure

1. Model components, data, trust, ownership, traffic, and failure boundaries.
2. Establish the simplest viable baseline and at least one alternative.
3. Compare options using the same measurable criteria and evidence.
4. Evaluate overload, dependency loss, partial failure, data recovery, security abuse, operability, and cost.
5. Record the decision, rejected options, consequences, migration, rollback, and review trigger in an ADR.
6. Validate risky assumptions with a prototype, benchmark, failure exercise, or documented source.

## Rollback

Define the last reversible point, compatible data path, traffic switch, and owner before implementation. If a choice is irreversible, require explicit approval and a containment plan.

## Exit Gate

Pass when requirements trace to components, major risks have mitigations and owners, estimates show assumptions, operations and observability are designed, and the ADR is reviewable by a team not present in the discussion.
