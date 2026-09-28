---
name: git-workflow
description: This skill should be used when the user asks to "create a commit", "prepare a pull request", "choose a branch strategy", "rebase a branch", or "recover Git history". Do not use it for deployment pipeline design or code-review findings.
metadata:
  id: git-workflow
  schema_version: "2.0.0"
  type: knowledge
  category: delivery
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["create a commit", "prepare a pull request", "choose a branch strategy", "rebase a branch", "recover Git history"]
  negative_triggers: ["design a deployment pipeline", "review code quality", "configure GitOps reconciliation"]
  coordinates_with: [cicd-pipeline, code-review, security-scanner]
  capabilities: [commit-planning, branch-management, pull-request-preparation, history-recovery]
  platforms: [git, github, gitlab]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Git Workflow

Produce reviewable changes while preserving user work and repository policy.

## Workflow

1. Inspect status, branch, remotes, staged changes, and repository instructions.
2. Separate unrelated changes; never stage or rewrite work without understanding ownership.
3. Scan the intended diff for secrets, generated noise, and accidental binary files.
4. Run relevant checks before committing and record unavailable checks.
5. Use an imperative, scoped commit message that explains the outcome.
6. Re-read the committed diff before push or pull-request creation.
7. Push or merge only when explicitly within scope; report remote side effects.

## Destructive Operations

Resolve exact refs before rebase, reset, force-push, or branch deletion. Create a recoverable ref when practical. Require explicit authorization for history rewriting and use force-with-lease rather than unconditional force.

## Exit Gate

Require a clean understanding of included paths, passing relevant checks, no detected secret, and a reviewable diff. Treat scan or hook failure as blocking. Read [engineering-spec.md](rules/engineering-spec.md) for recovery procedures.
