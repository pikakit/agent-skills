---
name: cicd-pipeline
description: This skill should be used when the user asks to "design a CI pipeline", "plan a production rollout", "add deployment gates", "choose canary or blue-green", or "define rollback". Do not use it for routine Git operations or a Vercel-only release.
metadata:
  id: cicd-pipeline
  schema_version: "2.0.0"
  type: knowledge
  category: delivery
  risk_tier: high
  version: "4.0.0"
  author: pikakit
  triggers: ["design a CI pipeline", "plan a production rollout", "add deployment gates", "choose canary or blue-green", "define rollback"]
  negative_triggers: ["make a Git commit", "deploy only to Vercel", "configure Kubernetes reconciliation"]
  coordinates_with: [security-scanner, git-workflow, gitops]
  capabilities: [pipeline-design, release-gating, rollout-strategy, rollback-planning]
  platforms: [github-actions, gitlab-ci, containers, cloud]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# CI/CD Pipeline

Design deterministic delivery with immutable inputs, least privilege, observable rollout, and an exercised recovery path.

## Workflow

1. Identify protected environments, approvers, compliance controls, and service objectives.
2. Build once; attest, store, and promote the same immutable artifact.
3. Pin actions and dependencies, isolate untrusted contributions, and minimize token permissions.
4. Gate release on applicable tests, security checks, migrations, and artifact provenance.
5. Choose rolling, blue-green, or canary rollout from state compatibility and risk.
6. Define automatic abort signals and a human stop mechanism before deployment.
7. Verify service health and business outcomes, then record evidence and close the change.

## Failure Contract

Stop on failed, skipped-required, timed-out, or unavailable gates. Never treat tool failure as a clean result. Preserve redacted logs, artifact identity, deployment identity, and rollback outcome.

## Rollback

Prefer traffic reversal to a known-good immutable artifact. Use forward-compatible database changes so application rollback remains possible. Rehearse the rollback and define the point after which forward-fix is safer.

Read [engineering-spec.md](rules/engineering-spec.md) for the complete release gate.
