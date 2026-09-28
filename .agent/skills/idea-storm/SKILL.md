---
name: idea-storm
description: This skill should be used when the user asks to clarify an ambiguous product idea, compare architecture options, discover hidden constraints, or frame an uncertain problem.
metadata:
  id: idea-storm
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["clarify an ambiguous product idea", "compare architecture options", "discover hidden constraints", "frame an uncertain problem"]
  negative_triggers: ["implement a fully specified change", "fix a narrow reproducible bug", "answer a factual question"]
  coordinates_with: [project-planner, system-design, api-architect]
  capabilities: ["requirement elicitation", "assumption testing", "option comparison", "decision framing"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Idea Storm

Reduce consequential uncertainty before planning or implementation. Ask only questions whose answers can change scope, architecture, risk, or acceptance criteria.

## Workflow

1. Restate the outcome and separate known facts, assumptions, constraints, and open decisions.
2. Rank open decisions by reversibility and cost of being wrong.
3. Ask a small batch of concrete questions, offering mutually exclusive options when useful.
4. Record answers, unresolved assumptions, and default choices with their consequences.
5. For competing architectures, use `rules/architecture-debate.md` and compare the same criteria across options.
6. Stop questioning once the next action is safe and testable; hand the result to `project-planner` or the relevant domain skill.

## Boundaries

Do not block clear, reversible tasks. Do not ask for information already present in the repository or prompt. Do not turn optional preferences into mandatory gates.

Read `rules/dynamic-questioning.md` for question selection and `rules/production-gates.md` for completion criteria.
