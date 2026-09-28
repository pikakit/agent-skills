---
title: Authentication Architecture Decision
kind: decision
impact: critical
tags: [authentication, authorization, architecture]
applies_to: [web, mobile, backend]
last_reviewed: "2026-09-28"
sources:
  - title: NIST Digital Identity Guidelines
    url: https://pages.nist.gov/800-63-4/
  - title: OWASP Authentication Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
---

# Authentication Architecture Decision

## Decision

Separate identity proofing, authentication, session/token lifecycle, authorization, and recovery. Prefer an authorization-code flow with PKCE for delegated browser/mobile login and a revocable server-side session for first-party web applications. Use short-lived access tokens only where a bearer-token boundary is necessary. Enforce authorization at each resource boundary and deny on missing context.

## Use When

- Designing or changing login, SSO, service identity, recovery, MFA, or permissions.
- Introducing tenant boundaries, sensitive actions, or delegated third-party access.
- Replacing an identity provider or changing token/session storage.

## Avoid When

- The task is vulnerability discovery; route to `security-scanner`.
- The task is an authorized adversary exercise; route to `offensive-sec`.
- The caller has not supplied identity, threat, data, and recovery requirements.

## Trade-offs

- Server-side sessions simplify revocation but require a highly available session store.
- Bearer tokens reduce shared lookup state but widen replay risk and complicate immediate revocation.
- Passkeys improve phishing resistance but require account-recovery and device-transition design.
- Fine-grained policy improves least privilege but increases policy testing and audit complexity.

## Verification

Test invalid and expired credentials, issuer/audience mismatch, algorithm confusion, replay, session fixation, cross-tenant access, object ownership, privilege downgrade, recovery abuse, rate limits, revocation, and key rotation. Verify logs contain outcome and correlation data but no credential material. Exercise identity-provider outage and rollback before release.
