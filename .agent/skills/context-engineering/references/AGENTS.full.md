# Context Engineering Full Agent Rules

> Deterministic compilation of 1 source rules for context-engineering v3.9.224. Do not edit directly.

## Rule Index

- [Context Reduction Gate](#rule-engineering-spec) (standard, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Context Reduction Gate

**Impact:** standard
**Kind:** process
**Source:** `rules/engineering-spec.md`

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
