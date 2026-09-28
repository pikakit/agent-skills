# Observability Full Agent Rules

> Deterministic compilation of 1 source rules for observability v3.9.224. Do not edit directly.

## Rule Index

- [Telemetry Rollout Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Telemetry Rollout Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Telemetry Rollout Gate

## Preconditions

- Define diagnostic questions, service objectives, data owners, and retention requirements.
- Inventory current telemetry, traffic, and cardinality.
- Classify secrets and personal data that must be excluded or transformed.

## Procedure

1. Select stable resource attributes and official semantic conventions.
2. Instrument ingress, egress, data stores, and asynchronous boundaries before custom internals.
3. Propagate context only across trusted boundaries and validate incoming baggage.
4. Bound attribute length, metric labels, event volume, queue size, export timeout, and retries.
5. Configure redaction and sampling based on risk and measured volume.
6. Test exporter outage, overload, malformed context, and application shutdown.
7. Roll out gradually and compare latency, CPU, memory, signal loss, and cost.

## Rollback

Disable or reduce the new instrumentation through a controlled configuration, restore the prior collector pipeline, and preserve application availability. Do not drop required audit data without owner approval.

## Exit Gate

Pass when signals arrive with correct service identity and correlation, prohibited data is absent, cardinality and overhead remain within agreed budgets, alerts fire in a controlled test, and exporter failure does not break the application.
