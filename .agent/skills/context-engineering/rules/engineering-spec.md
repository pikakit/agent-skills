---
title: Context Reduction Gate
kind: process
impact: standard
tags: [context, retrieval, handoff]
applies_to: [context-engineering]
last_reviewed: "2026-09-28"
sources:
  - title: Claude context windows
    url: https://docs.anthropic.com/en/docs/build-with-claude/context-windows
---

# Context Reduction Gate

## Preconditions

- Identify the target model, available context, active task, and acceptance criteria.
- Separate authoritative instructions from evidence, working notes, and optional background.
- Mark secrets and personal data that must not enter prompts or durable storage.

## Procedure

1. Remove exact duplicates and superseded intermediate output.
2. Select only evidence needed for the next decision, retaining source paths and revisions.
3. Externalize stable project facts into reviewed knowledge when authorized.
4. Compress narrative into decisions, constraints, evidence, risks, and next actions.
5. Isolate independent work behind explicit ownership and integration contracts.
6. Test the reduced handoff with a cold-reader question: can the next action and its evidence be reconstructed?

Do not use a universal utilization threshold. Tokenizers, context windows, cache behavior, and tool overhead vary by model and runtime.

## Rollback

Restore the last complete handoff when reduction drops a constraint, source, unresolved risk, or required decision history. Do not reconstruct lost facts from memory.

## Exit Gate

Pass when the context fits the configured limit, contains no prohibited data, preserves all task-critical facts with provenance, and supports the next decision without hidden dependencies.
