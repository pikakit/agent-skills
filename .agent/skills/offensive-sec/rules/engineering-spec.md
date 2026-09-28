---
title: Authorized Security Assessment Process
kind: process
impact: critical
tags: [offensive-security, authorization, evidence]
applies_to: [web, api, cloud, enterprise]
last_reviewed: "2026-09-28"
sources:
  - title: NIST SP 800-115 Technical Guide to Information Security Testing
    url: https://csrc.nist.gov/pubs/sp/800/115/final
  - title: MITRE ATT&CK Enterprise Matrix
    url: https://attack.mitre.org/matrices/enterprise/
---

# Authorized Security Assessment Process

## Preconditions

Obtain written authorization that identifies system owners, exact targets, permitted techniques, test window, source addresses, data-handling rules, exclusions, emergency contacts, stop conditions, and approvers. Confirm backups, monitoring, and a stable communication channel. Block work when authorization or ownership is ambiguous.

## Procedure

1. Convert engagement objectives into hypotheses and ATT&CK technique identifiers.
2. Inventory target boundaries and validate each target against the signed scope.
3. Select the least disruptive test that can prove or disprove each hypothesis.
4. Capture timestamped, minimal, redacted evidence and defensive telemetry.
5. Stop on sensitive-data access, unexpected availability impact, scope drift, or lost monitoring.
6. Report reproduction preconditions, business impact, detection result, and prioritized remediation.
7. Remove test accounts, payloads, artifacts, and access paths; ask the owner to verify cleanup.

## Rollback

Define rollback for every test action before execution. Restore changed configuration, revoke temporary credentials, remove created resources, and confirm service health. Preserve only authorized evidence according to the retention agreement. Escalate any incomplete cleanup as an incident.

## Exit Gate

Exit only when scope compliance, evidence chain, cleanup, service health, remediation ownership, and owner acceptance are documented. A successful exploit does not authorize additional movement. Return `BLOCKED` or `STOPPED` rather than improvising outside the rules of engagement.
