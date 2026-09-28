---
title: Fail-Closed Security Review Process
kind: process
impact: critical
tags: [security-review, triage, verification]
applies_to: [repository, web, api, cloud]
last_reviewed: "2026-09-28"
sources:
  - title: OWASP Application Security Verification Standard
    url: https://owasp.org/www-project-application-security-verification-standard/
  - title: OWASP Web Security Testing Guide
    url: https://owasp.org/www-project-web-security-testing-guide/
---

# Fail-Closed Security Review Process

## Preconditions

Define the target revision, assets, trust boundaries, data classification, deployment context, applicable verification level, and authorized tools. Record tool versions and confirm secrets can be redacted. Mark the review incomplete if source, configuration, generated artifacts, or required runtime evidence is unavailable.

## Procedure

1. Map entry points, identities, privileged operations, storage, and outbound integrations.
2. Select applicable ASVS, API, supply-chain, and platform controls.
3. Run local static, dependency, secret, configuration, and test checks with bounded timeouts.
4. Trace input-to-sink paths and confirm required exploit preconditions.
5. Deduplicate findings by root cause and rank likelihood, exposure, privilege, and impact.
6. Attach a primary source, minimal remediation, and regression test to every finding.
7. Re-run affected checks after remediation and record residual coverage gaps.

## Rollback

Keep review tooling read-only by default. If a proof fixture or temporary configuration is required, snapshot original bytes, constrain writes to the project root, and restore them after validation. Revoke test credentials and delete temporary resources. Do not retain captured secrets.

## Exit Gate

Return `PASS` only when every applicable required check executed successfully and no finding remains. Return `FINDINGS` for confirmed issues, `INCOMPLETE` for missing coverage, and `ERROR` for scanner failure. Never convert timeout, parse error, read error, or missing checker into a clean result.
