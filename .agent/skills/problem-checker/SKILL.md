---
name: problem-checker
description: >-
  Runs bounded TypeScript diagnostics and transactional local auto-fixes. Use after source changes, before completion, or when TypeScript diagnostics must be classified. NOT for semantic debugging or broad code review.
metadata:
  id: problem-checker
  schema_version: "2.0.0"
  type: executable
  category: quality
  risk_tier: critical
  version: "3.9.224"
  author: pikakit
  triggers: [TypeScript diagnostics, transactional auto-fix, pre-completion error gate]
  negative_triggers: [root cause investigation, architectural code review]
  coordinates_with: [debug-pro, code-review, typescript-expert]
  capabilities: [diagnostic classification, bounded auto-fix, regression rollback]
  platforms: [node, windows, linux, macos]
  last_reviewed: 2026-09-28
  review_interval_days: 90
---

# Problem Checker

Run the TypeScript checker, distinguish diagnostics from operational errors, and keep a fix only when the next check improves the diagnostic fingerprint set.

## Workflow

1. Resolve the project root and local TypeScript binary.
2. Run `tsc --noEmit --pretty false` without a shell.
3. Return `CLEAN`, `DIAGNOSTICS`, or `ERROR`; never convert a checker failure into clean status.
4. With `--fix`, snapshot original bytes, reject paths outside the project root, apply one bounded fix cycle, and recheck.
5. Roll back the full cycle when it introduces a diagnostic or the checker fails.

## CLI

```bash
npx tsx .agent/skills/problem-checker/scripts/check_problems.ts [directory]
npx tsx .agent/skills/problem-checker/scripts/check_problems.ts --fix --json [directory]
```

Exit codes are `0` for clean, `1` when diagnostics remain, and `2` for configuration or checker errors. JSON mode emits one document.

## Boundaries

- The executable owns TypeScript diagnostic collection and its explicit local fix patterns.
- It does not install dependencies, infer missing imports, suppress diagnostics, or claim that a build/test suite passed.
- A clean typecheck is evidence only for the configured TypeScript project.

## Release Gate

Require typecheck and the transactional safety tests to pass. Treat path-escape rejection, byte-exact rollback, and checker-error propagation as mandatory behavior.

## References

- [Executable](scripts/check_problems.ts)
- [Transactional contract](rules/engineering-spec.md)
