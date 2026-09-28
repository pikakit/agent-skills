---
name: skill-generator
description: This skill should be used when the user asks to generate a reusable skill, convert validated patterns into a skill, scaffold skill resources, or review a generated skill package.
metadata:
  id: skill-generator
  schema_version: "2.0.0"
  type: knowledge
  category: meta
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["generate a reusable skill", "convert validated patterns into a skill", "scaffold skill resources", "review a generated skill package"]
  negative_triggers: ["record a single lesson", "install an existing skill", "write ordinary project documentation"]
  coordinates_with: [knowledge-compiler, knowledge-linter, code-constitution]
  capabilities: ["skill package design", "progressive disclosure", "trigger definition", "skill validation planning"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Skill Generator

Generate a skill only from a stable, reusable capability with concrete activation examples and verifiable guidance.

## Generation Gate

1. Confirm the capability recurs across contexts and is not merely project-specific history.
2. Collect positive, negative, and overlap prompts that distinguish the skill from adjacent skills.
3. Define the public name, ownership boundary, risk tier, capabilities, and supported platforms.
4. Keep routing and essential workflow in `SKILL.md`; place detailed guidance in focused rules or references and deterministic work in tested scripts.
5. Cite primary sources or tracked internal standards; remove unsupported guarantees and fake APIs.
6. Validate schema, size, links, examples, source freshness, routing behavior, and executable resources before publication.

## Rejection Conditions

Reject generation when the proposed skill duplicates an existing owner, lacks negative triggers, depends on unverified behavior, has no realistic acceptance criteria, or would contain only generic advice.

Preserve existing public identity during updates. Route knowledge extraction to `knowledge-compiler` and validation policy to `knowledge-linter`.
