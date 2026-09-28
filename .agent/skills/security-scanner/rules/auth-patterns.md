---
title: Authentication Security Review
kind: reference
impact: critical
tags: [authentication, review, security]
applies_to: [web, api, backend]
last_reviewed: "2026-09-28"
sources:
  - title: OWASP Authentication Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html
  - title: OWASP Password Storage Cheat Sheet
    url: https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html
---

# Authentication Security Review

## Scope

Review implemented password storage, authentication, sessions, tokens, MFA, authorization, recovery, and abuse controls. Route architecture design to `auth-patterns`; keep this rule focused on verification and findings.

## Guidance

### Password and Account Controls

- Use a password-specific KDF and work factor that follow current OWASP guidance and are calibrated on deployment hardware.
- Store the algorithm and parameters with each hash so parameters can be upgraded after successful authentication.
- Return equivalent responses for unknown accounts and invalid credentials; avoid timing and content-based enumeration.
- Apply abuse controls to login, registration, recovery, verification, and factor-enrollment paths.
- Require recent authentication before changing credentials, recovery methods, or privileged identity data.

### Session and Token Controls

- Generate opaque session identifiers with a cryptographically secure generator and rotate them after authentication and privilege changes.
- Set `Secure`, `HttpOnly`, and an appropriate `SameSite` policy on authentication cookies; implement CSRF defenses where cookies authenticate state-changing requests.
- Enforce idle and absolute expiry, logout revocation, credential-change revocation, and server-side invalidation.
- For JWTs, pin accepted algorithms and validate signature, issuer, audience, type, lifetime, and required claims. Never trust an unverified payload.
- Store refresh credentials in a revocable record, rotate on use, and detect replay. Never log bearer credentials.

### MFA and Recovery Controls

- Prefer phishing-resistant authenticators for high-risk users and actions.
- Confirm possession before completing factor enrollment; notify users of enrollment, removal, and recovery events.
- Store recovery codes as one-way verifiers, reveal them once, and invalidate each code after use.
- Make recovery no weaker than primary authentication. Do not rely on knowledge questions.
- Define support escalation, identity evidence, cooling periods, and audit review for exceptional recovery.

### Authorization Controls

- Enforce authorization server-side for every protected operation and resource identifier.
- Deny when identity, tenant, ownership, policy, or resource context is missing.
- Derive permissions from trusted server-side state rather than client-supplied roles or identifiers.
- Test horizontal and vertical privilege changes, tenant boundaries, bulk operations, and stale permissions.

### Findings

Report file or endpoint, evidence, preconditions, affected identity boundary, exploit impact, confidence, remediation, and regression test. Redact credentials and personal data. Mark unavailable runtime evidence or failed tooling as incomplete, not clean.

## Verification

Test unknown and locked accounts, password verification, session fixation, CSRF, token substitution, expiry, revocation, MFA replay, recovery abuse, cross-tenant access, privilege downgrade, rate limits, and identity-provider outage. Confirm audit events are correlated and redacted, then re-run each failed control after remediation.
