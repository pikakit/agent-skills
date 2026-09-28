---
title: Deployment Patterns
kind: process
impact: high
tags: [google-adk, deployment]
applies_to: [google-adk-python]
last_reviewed: "2026-09-28"
sources:
  - title: Deploy Agent Development Kit agents
    url: https://google.github.io/adk-docs/deploy/
---

# Deployment Patterns

## Preconditions

- Pin the ADK, Python, and model configuration tested in staging.
- Choose a currently documented ADK deployment target from security, latency, data residency, scaling, and operational requirements.
- Store credentials in the platform secret manager and define service identity with least privilege.
- Establish health, readiness, telemetry, evaluation, and cost baselines.

## Procedure

1. Build an immutable artifact with locked dependencies and provenance.
2. Validate configuration without making a model call in the liveness check.
3. Use readiness to verify required local dependencies; keep expensive downstream probes out of high-frequency checks.
4. Bound request size, session lifetime, tool timeouts, concurrency, and retries.
5. Redact prompts, tool arguments, credentials, and personal data from telemetry.
6. Deploy to a non-production environment and run offline evaluation plus controlled integration tests.
7. Shift production traffic gradually while comparing quality, errors, latency, saturation, and cost.

Do not copy deployment snippets across ADK versions without verifying them against the pinned official documentation.

## Rollback

Retain the previous artifact and compatible session/state schema. Route traffic back or disable the new tool/model configuration when any release budget regresses.

## Exit Gate

Pass only when the official target supports the pinned version, identity and secrets are externalized, readiness is meaningful, evaluation passes, telemetry is redacted, and rollback is exercised.
