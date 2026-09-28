---
"title": "Production verification gates"
"kind": "process"
"impact": "high"
"tags":
  - "verification"
  - "rollback"
  - "release-gate"
"applies_to":
  - "cross-platform"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official verification guidance"
    "url": "https://platform.openai.com/docs/guides/image-generation"
---

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.
