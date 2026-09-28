---
name: shell-script
description: This skill should be used when the user asks to write, review, harden, or troubleshoot a Bash or POSIX shell script on Unix-like systems.
metadata:
  id: shell-script
  schema_version: "2.0.0"
  type: knowledge
  category: operations
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["write a Bash script", "harden a shell script", "debug a POSIX shell command", "review shell quoting"]
  negative_triggers: ["write a PowerShell script", "run an unspecified destructive command", "implement application logic in a shell script"]
  coordinates_with: [cicd-pipeline, server-ops, problem-checker]
  capabilities: ["shell portability review", "quoting and error handling", "safe command composition", "script verification"]
  platforms: [linux, macos]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Shell Script

Choose Bash or POSIX `sh` explicitly and test with the selected interpreter. Quote expansions, avoid parsing human-oriented output, and keep destructive targets explicit and validated.

## Workflow

1. Define interpreter, supported platforms, inputs, outputs, and side effects.
2. Validate arguments and dependencies before mutation.
3. Use arrays in Bash where argument boundaries matter; avoid `eval`.
4. Create temporary resources safely and register cleanup traps.
5. Propagate failures deliberately; do not rely on `set -e` as complete error handling.
6. Test success, invalid input, interruption, partial failure, and paths containing spaces.

## Detailed Guidance

Read `rules/engineering-spec.md` for portability, security, rollback, and verification requirements. Route PowerShell work to platform-specific guidance.
