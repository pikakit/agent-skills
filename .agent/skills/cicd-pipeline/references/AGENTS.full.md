# Cicd Pipeline Full Agent Rules

> Deterministic compilation of 1 source rules for cicd-pipeline v4.0.0. Do not edit directly.

## Rule Index

- [Production Release Process](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Production Release Process

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Production Release Process

## Preconditions

Identify the source revision, immutable artifact, target environment, approver, service objectives, compatibility constraints, migration plan, rollback owner, and release window. Confirm required checks can run and deployment credentials use least privilege. Block release on unknown artifact identity or missing recovery evidence.

## Procedure

1. Build once from a reviewed, locked source revision.
2. Produce provenance and scan the artifact and dependencies.
3. Run applicable type, test, security, policy, migration, and documentation gates.
4. Promote the same artifact through environments; do not rebuild for production.
5. Roll out with explicit health, error, latency, saturation, and business abort thresholds.
6. Pause or abort automatically when a threshold fails or telemetry disappears.
7. Verify the release, record evidence, and close or escalate the change.

## Rollback

Reverse traffic to a known-good immutable artifact when application compatibility permits. Keep schema changes expand/contract so the previous version remains usable. Revoke changed credentials and disable faulty feature flags. If rollback risks data loss, stop traffic-changing actions and execute an approved forward-fix or restore plan.

## Exit Gate

Pass only when all required gates executed, the deployed artifact matches provenance, health and business signals remain within thresholds, and rollback readiness is intact. A skipped required gate, timeout, missing tool, or unreadable result is a release failure, not a warning.
