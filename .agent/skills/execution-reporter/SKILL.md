---
name: execution-reporter
description: This skill should be used when the user asks to report task progress, summarize agent routing, explain validation status, or produce an auditable execution result.
metadata:
  id: execution-reporter
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["report task progress", "summarize agent routing", "explain validation status", "produce an execution report"]
  negative_triggers: ["execute a task", "select a specialist agent", "diagnose a code failure"]
  coordinates_with: [lifecycle-orchestrator, smart-router, problem-checker]
  capabilities: ["progress reporting", "result summarization", "validation evidence formatting"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Execution Reporter

Report observed work and evidence without inventing progress, results, agents, or checks.

## Workflow

1. Capture the task objective, active phase, owners, and relevant tools from actual execution state.
2. Separate completed, in-progress, skipped, failed, and blocked work.
3. Include commands or checks only when they ran; label unavailable evidence explicitly.
4. Keep intermediate updates concise and reserve the complete evidence summary for the final report.
5. Redact credentials, tokens, private payloads, and sensitive paths before emission.
6. Preserve machine-readable status and exit semantics when reporting structured results.

## Required Fields

- Objective and current phase.
- Material changes or decisions.
- Validation performed and exact outcome.
- Remaining risks, skips, failures, or user action.

## Boundaries

Use `smart-router` for agent selection, `lifecycle-orchestrator` for phase control, and `problem-checker` for diagnostics. Reporting never changes task state by itself.

Read `rules/production-gates.md` for the reporting contract and final evidence gate.
