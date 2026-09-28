---
name: knowledge-compiler
description: This skill should be used when the user asks to capture a verified lesson, compile project knowledge, update knowledge indexes, or record an ADR.
metadata:
  id: knowledge-compiler
  schema_version: "2.0.0"
  type: hybrid
  category: knowledge
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["capture this verified lesson", "compile project knowledge", "update the knowledge index", "record an architecture decision"]
  negative_triggers: ["lint knowledge health", "author a standalone skill package", "record an unverified hypothesis"]
  coordinates_with: [knowledge-linter, skill-generator, problem-checker]
  capabilities: ["evidence-backed knowledge capture", "knowledge compilation", "index maintenance", "secret prefiltering"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Knowledge Compiler

Convert verified project evidence into concise, traceable knowledge. Preserve provenance, distinguish observation from inference, and never store credentials or personal data without a documented requirement.

## Workflow

1. Require reproducible evidence: a test, command result, source change, accepted decision, or explicit correction.
2. Run the secret prefilter before every durable write.
3. Record the smallest atomic signal with date, scope, evidence, and confidence.
4. Merge only compatible signals; retain contradictions for review.
5. Compile stable concepts, patterns, or ADRs with backlinks to source signals.
6. Update indexes deterministically and run `knowledge-linter`.

## Failure Contract

Abort the write when secret scanning, parsing, evidence validation, or index update fails. Do not mark failed or partial compilation as complete.

Read `rules/secret-prefilter.md` before writes. Use `scripts/secret-scanner.ts` through the repository command contract; do not duplicate its detection logic.
