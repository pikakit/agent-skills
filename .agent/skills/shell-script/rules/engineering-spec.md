---
title: Shell Script Safety Gate
kind: process
impact: high
tags: [shell, bash, safety]
applies_to: [shell-script]
last_reviewed: "2026-09-28"
sources:
  - title: PikaKit production skill rubric
    internal_ref: ../../../standards/PRODUCTION_RUBRIC.md
---

# Shell Script Safety Gate

## Preconditions

- Declare the interpreter and supported platforms.
- Define inputs, outputs, privileges, dependencies, and destructive effects.
- Prepare fixtures that include empty values, spaces, leading dashes, newlines, and interruption.

## Procedure

1. Validate arguments and dependencies before changing state.
2. Quote expansions; use `--` where supported; prefer arrays in Bash for argument vectors.
3. Avoid `eval`, parsing `ls`, predictable temporary paths, and secret-bearing command-line arguments.
4. Use strict mode only with understood exceptions; check failures explicitly at recovery boundaries.
5. Register idempotent cleanup and preserve the original exit status.
6. Resolve and validate every destructive target against an allowed root.
7. Run syntax checks, static analysis where available, and fixture tests under the declared interpreter.

## Rollback

Restore files from verified snapshots, terminate only processes started by the script, and remove only recorded temporary paths. Never derive rollback targets from unchecked output.

## Exit Gate

Pass when syntax and fixtures succeed, reruns are safe where promised, failures return nonzero, cleanup works after interruption, and no secret or unintended path appears in diagnostics.
