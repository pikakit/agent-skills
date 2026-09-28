---
name: auth-patterns
description: This skill should be used when the user asks to "implement login", "choose OAuth or sessions", "design authorization", "add MFA", or "support passkeys". Do not use it for vulnerability discovery, penetration testing, or general API design.
metadata:
  id: auth-patterns
  schema_version: "2.0.0"
  type: knowledge
  category: security
  risk_tier: critical
  version: "4.0.0"
  author: pikakit
  triggers: ["implement login", "choose OAuth or sessions", "design authorization", "add MFA", "support passkeys"]
  negative_triggers: ["scan for vulnerabilities", "run a penetration test", "design an unauthenticated API"]
  coordinates_with: [api-architect, security-scanner, data-modeler, offensive-sec]
  capabilities: [authentication-design, authorization-design, token-lifecycle, account-recovery]
  platforms: [web, mobile, backend]
  last_reviewed: "2026-09-28"
  review_interval_days: 90
---

# Authentication and Authorization

Design identity controls that fail closed and can be revoked, observed, and recovered safely.

## Workflow

1. Identify actors, trust boundaries, protected resources, and assurance requirements.
2. Separate authentication, session management, and authorization decisions.
3. Choose a server-side session unless stateless delegation is a demonstrated requirement.
4. Apply authorization at every resource boundary; deny when identity or policy data is missing.
5. Define enrollment, rotation, revocation, recovery, and audit events before implementation.
6. Threat-model replay, fixation, confused-deputy, recovery, and tenant-isolation paths.
7. Test negative cases and operational recovery before release.

## Routing

| Need | Read |
|---|---|
| OAuth 2.0 or OpenID Connect | [oauth2.md](rules/oauth2.md) |
| JWT validation and rotation | [jwt-deep.md](rules/jwt-deep.md) |
| Cookie and server-side sessions | [session.md](rules/session.md) |
| Roles, attributes, ownership, tenancy | [rbac-abac.md](rules/rbac-abac.md) |
| MFA and recovery | [mfa.md](rules/mfa.md) |
| WebAuthn/passkeys | [passkey.md](rules/passkey.md) |
| Cross-cutting design gate | [engineering-spec.md](rules/engineering-spec.md) |

## Non-Negotiable Gates

- Reject unregistered redirect URIs, invalid issuer/audience, expired credentials, and unknown signing algorithms.
- Keep bearer credentials out of URLs and browser persistent storage.
- Rotate session identifiers after authentication and privilege changes.
- Require recent authentication for credential, recovery, payment, and privilege changes.
- Log security outcomes without tokens, passwords, recovery codes, or unnecessary personal data.

## Output Contract

Return assumptions, mechanism, trust boundaries, credential lifecycle, authorization model, failure behavior, rollback, observability, and verification evidence. Mark unresolved security decisions as blockers.
