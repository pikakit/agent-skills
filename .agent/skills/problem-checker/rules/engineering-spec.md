---
title: Transactional diagnostic gate
kind: process
impact: critical
tags: [typescript, diagnostics, rollback]
applies_to: [typescript-projects, automated-fixes]
last_reviewed: 2026-09-28
sources:
  - title: TypeScript compiler options
    url: https://www.typescriptlang.org/tsconfig/
  - title: Node.js child process API
    url: https://nodejs.org/api/child_process.html
---

# Transactional Diagnostic Gate

## Preconditions

- Resolve a real project directory and its local TypeScript compiler.
- Capture the baseline diagnostic set before any write.
- Normalize each diagnostic fingerprint from project-relative file, diagnostic code, and message. Do not depend on line numbers.
- Snapshot the exact bytes of every file selected for a fix cycle.

## Procedure

1. Execute the compiler through `process.execPath` with an argument array and `shell: false`.
2. Classify a completed compiler run with diagnostics as `DIAGNOSTICS`; classify spawn, timeout, and unusable output failures as `ERROR`.
3. Reject every diagnostic path that resolves outside the project root.
4. Apply only a recognized, deterministic transformation to files in the snapshot.
5. Re-run the same checker after the cycle.
6. Keep the cycle only when the checker completed and the new fingerprint set adds no regression.

The gate must preserve captured stdout and stderr for diagnosis while redacting any credential-like values before external reporting.

## Rollback

Restore every snapshot byte-for-byte when a write fails, a new diagnostic fingerprint appears, or the verification checker returns `ERROR`. A partial rollback is a failed operation and must return exit `2`.

## Exit Gate

- Exit `0` only when the final check is `CLEAN`.
- Exit `1` when a valid check completes with diagnostics.
- Exit `2` for invalid configuration, spawn/read/write/rollback failure, timeout, or an indeterminate checker result.
- Verify transactional behavior with tests for a retained improvement, byte-exact regression rollback, root escape rejection, and checker failure.
