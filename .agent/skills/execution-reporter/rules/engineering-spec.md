---
title: Execution Progress and Reporting Gate
kind: process
impact: standard
tags: [execution, reporting, status, audit-trail, release-gate]
applies_to: [execution-reporter]
last_reviewed: "2026-09-28"
sources:
  - title: OpenTelemetry Logging Specification
    url: https://opentelemetry.io/docs/specs/otel/
  - title: NIST SP 800-92 Guide to Computer Security Log Management
    url: https://csrc.nist.gov/publications/detail/sp/800-92/final
---

# Execution Progress and Reporting Gate

## Preconditions

- Identify active task, executing agent, conversation scope, and reported phases.
- Confirm required status checkpoints: start, phase transitions, and completion evidence.
- Identify prohibited data classes: credentials, private tokens, and unredacted PII.

## Procedure

1. Record execution events with structured timestamps, agent identity, and step indices.
2. Emit unambiguous progress markers that distinguish planning, execution, and verification phases.
3. Validate that task deliverables match stated completion criteria before declaring completion.
4. Redact sensitive values and truncate noisy logs to maintain human-readable reports.
5. Provide auditable execution summaries with file touch counts and validation outputs.

## Rollback

Mark phase status as failed and retain error diagnostics when an unexpected exception or verification failure occurs. Do not emit completion markers for incomplete or erroneous runs.

## Exit Gate

Pass when all planned phases have verified terminal status, execution artifacts are recorded, no sensitive data is leaked, and output status reflects ground truth.
