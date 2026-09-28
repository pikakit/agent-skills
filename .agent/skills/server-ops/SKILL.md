---
name: server-ops
description: This skill should be used when the user asks to operate a Linux service, manage a process lifecycle, diagnose host resources, or plan capacity.
metadata:
  id: server-ops
  schema_version: "2.0.0"
  type: knowledge
  category: operations
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["operate a Linux service", "diagnose server resources", "configure process supervision", "plan server capacity"]
  negative_triggers: ["build a deployment pipeline", "instrument application telemetry", "debug application source code"]
  coordinates_with: [cicd-pipeline, observability, security-scanner]
  capabilities: ["service lifecycle planning", "host diagnosis", "capacity planning", "operational rollback design"]
  platforms: [linux, containers, kubernetes]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Server Ops

Operate services from measured state, explicit authorization, and a tested rollback. Treat every production command as potentially destructive.

## Workflow

1. Identify the host, environment, service owner, impact window, and current symptoms.
2. Capture baseline health, resource, dependency, and recent-change evidence.
3. Form one falsifiable hypothesis and choose the least invasive diagnostic.
4. Snapshot configuration or state before mutation.
5. Apply one bounded change and monitor health signals.
6. Roll back on regression and document the result.

## Boundaries

Do not assume a process manager or orchestrator from the runtime alone. Route pipeline changes to `cicd-pipeline`, telemetry design to `observability`, and security assessment to `security-scanner`.

Read `rules/engineering-spec.md` for change, rollback, and exit gates.
