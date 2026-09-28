---
name: context-engineering
description: This skill should be used when the user asks to reduce agent context, design memory boundaries, or improve retrieval and handoff quality.
metadata:
  id: context-engineering
  schema_version: "2.0.0"
  type: knowledge
  category: agentic
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["reduce agent context usage", "design an agent memory strategy", "improve multi-agent handoffs"]
  negative_triggers: ["optimize application runtime memory", "summarize a single document", "implement an unrelated feature"]
  coordinates_with: [lifecycle-orchestrator, system-design, knowledge-compiler]
  capabilities: ["context budget design", "retrieval boundary design", "handoff specification"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Context Engineering

Minimize context while preserving evidence, decisions, constraints, and unresolved risks. Measure actual model and tool limits rather than relying on universal token thresholds.

## Workflow

1. Inventory required instructions, evidence, working state, and optional background.
2. Remove duplicates and content unrelated to the current decision.
3. Store durable facts in tracked project knowledge; keep volatile state in the active handoff.
4. Retrieve narrow source excerpts with provenance when needed.
5. Isolate independent work only when ownership and merge contracts are explicit.
6. Verify that a cold reader can reproduce the next decision from the reduced context.

## Boundaries

- Preserve security constraints and user intent during every reduction.
- Never summarize secrets into durable knowledge.
- Treat model-specific context sizes and caching behavior as configuration, not constants.
- Route system topology decisions to `system-design` and durable learning to `knowledge-compiler`.

## Detailed Guidance

Read `rules/engineering-spec.md` for reduction choices, failure modes, and acceptance gates.
