---
name: security-scanner
description: This skill should be used when the user asks to "review source security", "audit dependencies", "threat-model an application", "check OWASP risks", or "prioritize vulnerabilities". Do not use it to conduct offensive testing or design login flows.
metadata:
  id: security-scanner
  schema_version: "2.0.0"
  type: knowledge
  category: security
  risk_tier: critical
  version: "4.0.0"
  author: pikakit
  triggers: ["review source security", "audit dependencies", "threat-model an application", "check OWASP risks", "prioritize vulnerabilities"]
  negative_triggers: ["conduct a penetration test", "implement login", "perform a general code review"]
  coordinates_with: [offensive-sec, auth-patterns, cicd-pipeline, code-review, knowledge-compiler]
  capabilities: [source-review, dependency-audit, threat-modeling, risk-triage, secret-detection]
  platforms: [repository, web, api, cloud]
  last_reviewed: "2026-09-28"
  review_interval_days: 90
---

# Security Scanner

Find defensible security issues, preserve evidence, and fail closed when analysis is incomplete.

## Workflow

1. Inventory assets, entry points, trust boundaries, data classes, and deployment environment.
2. Select checks from the relevant OWASP project and platform guidance.
3. Run repository-local tools without network installation; preserve command, version, exit code, and redacted output.
4. Trace untrusted input to sensitive sinks and confirm exploit preconditions before reporting.
5. Rank findings by likelihood, exposure, privilege, blast radius, and business impact.
6. Propose the smallest remediation that removes the root cause and includes a regression test.
7. Rescan after remediation and report coverage gaps as unresolved risk.

## Result States

- `PASS`: all applicable checks executed and no finding remains.
- `FINDINGS`: one or more supported findings remain.
- `INCOMPLETE`: a required tool, target, permission, or evidence source was unavailable.
- `ERROR`: the scanner or parser failed. Never translate this state into `PASS`.

## Routing

- Read [auth-patterns.md](rules/auth-patterns.md) for defensive identity-code review.
- Read [checklists.md](rules/checklists.md) for review coverage and release gates.
- Read [engineering-spec.md](rules/engineering-spec.md) for triage and reporting contracts.
- Use the tracked knowledge-compiler secret scanner for repository secret detection.

## Output Contract

For each finding, return location, evidence, violated control, preconditions, impact, confidence, remediation, regression test, and primary source. Redact all secret material.
