---
name: system-design
description: This skill should be used when the user asks to design a system, compare architecture options, document an ADR, or plan architectural evolution.
metadata:
  id: system-design
  schema_version: "2.0.0"
  type: knowledge
  category: architecture
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["design a software system", "compare architecture options", "write an architecture decision record", "plan system evolution"]
  negative_triggers: ["implement a local code change", "choose an API endpoint shape", "debug a single production incident"]
  coordinates_with: [api-architect, data-modeler, cicd-pipeline, observability]
  capabilities: ["requirements discovery", "trade-off analysis", "architecture decision records", "evolution planning"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# System Design

Derive architecture from measurable requirements, constraints, failure modes, and team ownership. Prefer the least complex design that meets current requirements and exposes a reversible evolution path.

## Workflow

1. Establish functional requirements, quality attributes, scale, compliance, budget, and team constraints.
2. Model data, trust, traffic, ownership, and failure boundaries.
3. Generate at least two viable options, including the simplest baseline.
4. Compare options with explicit evidence and uncertainty.
5. Record the decision, consequences, rollback, and review trigger in an ADR.
6. Validate the design with failure scenarios, capacity estimates, security review, and an evolution plan.

## Detailed Guidance

Read only the relevant rule: context discovery, pattern selection, trade-off analysis, examples, patterns reference, or engineering specification.
