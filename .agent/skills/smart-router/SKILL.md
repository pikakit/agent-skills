---
name: smart-router
description: This skill should be used when the user asks to classify a request, choose a specialist skill, resolve overlapping skill triggers, or design multi-domain routing.
metadata:
  id: smart-router
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["classify a request", "choose a specialist skill", "resolve overlapping skill triggers", "design multi-domain routing"]
  negative_triggers: ["execute the selected task", "author a new specialist skill", "report task progress"]
  coordinates_with: [lifecycle-orchestrator, execution-reporter, skill-generator]
  capabilities: ["intent classification", "skill selection", "overlap resolution", "routing explanation"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Smart Router

Select the smallest set of skills that covers the requested outcome and constraints.

## Routing Protocol

1. Extract the requested action, domain, artifact, platform, lifecycle phase, and explicit constraints.
2. Match concrete positive triggers and eliminate candidates whose negative triggers apply.
3. Prefer the skill that owns the output or side effect over a broad advisory skill.
4. Add coordinating skills only when the task crosses genuine ownership boundaries.
5. Resolve overlap by specificity, evidence needs, and risk; ask only when different routes would materially change the result.
6. Report the selected route briefly, then hand off execution without duplicating the specialist workflow.

## Failure Modes

Avoid keyword-only routing, circular coordination, self-routing, choosing unavailable capabilities, and loading every adjacent skill. Preserve explicit user routing unless it conflicts with policy or cannot perform the requested work.

Validate routing with representative positive, negative, and overlap prompts.
