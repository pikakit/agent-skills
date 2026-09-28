# Server Ops Full Agent Rules

> Deterministic compilation of 1 source rules for server-ops v3.9.224. Do not edit directly.

## Rule Index

- [Production Server Change Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Production Server Change Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Production Server Change Gate

## Preconditions

- Identify the exact environment, host or workload, service owner, impact window, and authorization.
- Capture current configuration, health, capacity, dependencies, and recent changes.
- Prepare a tested rollback with explicit success criteria.

## Procedure

1. Diagnose with read-only checks before mutation.
2. State one hypothesis and the signal that would confirm or reject it.
3. Back up configuration and state needed for recovery.
4. Apply one bounded, reviewable change through the managed control plane.
5. Observe availability, errors, latency, saturation, logs, and dependency health.
6. Continue rollout only while health stays inside the agreed budget.
7. Record the change, evidence, operator, and outcome.

Never expose credentials in process listings or logs. Avoid unbounded recursive file operations, implicit globs, and commands whose target has not been resolved.

## Rollback

Stop rollout and restore the prior artifact, configuration, traffic route, and compatible state. Escalate rather than improvising when rollback prerequisites are missing.

## Exit Gate

Pass when target health and user-facing checks meet the baseline, monitoring is stable through the observation window, configuration is persisted, and rollback remains available.
