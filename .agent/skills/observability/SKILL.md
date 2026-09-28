---
name: observability
description: This skill should be used when the user asks to instrument a service, design telemetry, correlate logs and traces, or define service-level alerting.
metadata:
  id: observability
  schema_version: "2.0.0"
  type: knowledge
  category: operations
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["instrument a service with OpenTelemetry", "design logs metrics and traces", "define service-level alerts"]
  negative_triggers: ["provision a server", "optimize code without measurements", "inspect a single local exception"]
  coordinates_with: [server-ops, perf-optimizer, cicd-pipeline]
  capabilities: ["telemetry architecture", "instrumentation planning", "sampling design", "signal verification"]
  platforms: [linux, macos, windows, cloud]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Observability

Design telemetry around explicit questions and service objectives. Prefer OpenTelemetry semantic conventions and preserve correlation across logs, metrics, and traces without collecting secrets or unnecessary personal data.

## Workflow

1. Define users, critical journeys, service objectives, and diagnostic questions.
2. Inventory existing signals and cardinality risks.
3. Select stable resource attributes and semantic conventions.
4. Instrument boundaries first, then add custom spans and metrics only for unanswered questions.
5. Configure sampling, redaction, retention, and exporter failure behavior.
6. Verify signal delivery, correlation, dashboards, and alerts under a controlled failure.

## Detailed Guidance

Read `rules/engineering-spec.md` for security, performance, rollout, rollback, and verification gates. Route host operations to `server-ops`.
