---
name: google-adk-python
description: This skill should be used when the user asks to design a Python agent with Google ADK, compose ADK agents, or expose typed ADK tools.
metadata:
  id: google-adk-python
  schema_version: "2.0.0"
  type: knowledge
  category: agentic
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["build a Python agent with Google ADK", "compose Google ADK agents", "create a typed ADK tool"]
  negative_triggers: ["write general Python code", "build an agent with another framework", "configure a generic REST API"]
  coordinates_with: [python-pro, api-architect, observability]
  capabilities: ["ADK agent selection", "typed tool design", "multi-agent composition", "deployment planning"]
  platforms: [linux, macos, windows, google-cloud]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# Google ADK Python

Design Google ADK applications from the current official API. Pin the package version, verify imported symbols against that version, and keep credentials outside code and generated artifacts.

## Workflow

1. Define the agent objective, termination condition, tool permissions, and data boundary.
2. Select the simplest ADK agent composition that expresses the control flow.
3. Define typed tools with bounded inputs, timeouts, and actionable errors.
4. Add tracing and evaluation before adding more agents or tools.
5. Select a deployment target from measured latency, security, and scaling requirements.
6. Run deterministic tests with external services replaced by controlled fixtures.

## Detailed Guidance

- Read `rules/tools.md` for tool contracts.
- Read `rules/multi-agent.md` for delegation and composition.
- Read `rules/deployment.md` for release and rollback gates.
- Read `rules/engineering-spec.md` for the end-to-end quality contract.
