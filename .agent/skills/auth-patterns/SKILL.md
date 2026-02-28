---
name: auth-patterns
description: >-
  Authentication and authorization patterns for production applications.
  OAuth2, JWT, RBAC/ABAC, MFA, Passkeys, session management.
  Triggers on: auth, login, OAuth, JWT, RBAC, permissions, MFA, passkey.
  Coordinates with: api-architect, security-scanner, data-modeler.
allowed-tools: Read, Write, Edit, Glob, Grep
metadata:
  version: "1.0.0"
  category: "security"
  triggers: "auth, login, OAuth, JWT, RBAC, permissions, MFA, passkey, SSO"
  success_metrics: "auth flow secure, tokens rotated, permissions enforced"
  coordinates_with: "api-architect, security-scanner, data-modeler"
---

# Auth Patterns

> Authentication & authorization principles for FAANG-grade applications.
> **Learn to THINK about auth, not copy patterns blindly.**

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Choosing auth strategy | Check decision tree below |
| OAuth2 / SSO integration | Read `references/oauth2.md` |
| JWT implementation | Read `references/jwt-deep.md` |
| Permission system | Read `references/rbac-abac.md` |
| Multi-factor auth | Read `references/mfa.md` |
| Session management | Read `references/session.md` |
| Passwordless / Passkey | Read `references/passkey.md` |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check content map, find what you need.

---

## Auth Strategy Decision Tree

```
What type of application?
├── SPA / Mobile App
│   ├── First-party only → JWT (short-lived) + Refresh Token
│   └── Third-party login → OAuth 2.0 + PKCE
├── Traditional Web (SSR)
│   └── Session-based (httpOnly cookies)
├── API / Microservices
│   ├── Service-to-service → mTLS or API Keys + HMAC
│   └── User-facing → JWT with gateway validation
├── Enterprise / B2B
│   └── SAML 2.0 or OIDC (SSO)
└── Modern Passwordless
    └── Passkeys (WebAuthn/FIDO2)
```

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| `references/oauth2.md` | OAuth 2.0 + OIDC flows, PKCE, scopes, providers | Third-party login, SSO |
| `references/jwt-deep.md` | JWT signing, rotation, claims, refresh patterns | Token-based auth |
| `references/rbac-abac.md` | Role-Based + Attribute-Based access control | Permission systems |
| `references/mfa.md` | TOTP, WebAuthn, backup codes, recovery | Multi-factor auth |
| `references/session.md` | Cookie sessions, Redis store, stateless vs stateful | Session design |
| `references/passkey.md` | WebAuthn/FIDO2 implementation guide | Passwordless auth |

### Also See (existing skills)

| File | Skill | What It Covers |
|------|-------|----------------|
| `rules/auth.md` | `api-architect` | Auth pattern selection guide (JWT vs Session vs OAuth) |
| `auth-patterns.md` | `security-scanner` | 2FA TOTP, account lockout, password reset token |

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Defense in Depth** | Auth + Authz + Rate Limit + Monitoring |
| **Least Privilege** | Grant minimum permissions needed |
| **Fail Closed** | On auth error → deny access |
| **Token Hygiene** | Short-lived access, rotated refresh |
| **Zero Trust** | Verify every request, even internal |

---

## ✅ Decision Checklist

- [ ] **Auth strategy chosen for THIS context?** (JWT / Session / OAuth / Passkey)
- [ ] **Token storage decided?** (httpOnly cookie, NOT localStorage)
- [ ] **Refresh token rotation configured?**
- [ ] **Permission model chosen?** (RBAC / ABAC / hybrid)
- [ ] **MFA considered for sensitive operations?**
- [ ] **Session invalidation on password change?**
- [ ] **Rate limiting on auth endpoints?**

---

## ❌ Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Store JWT in localStorage | Use httpOnly secure cookies |
| Long-lived access tokens (hours+) | Short-lived (15 min) + refresh |
| Roll your own crypto | Use battle-tested libraries |
| Same secret for all services | Per-service signing keys |
| Skip PKCE for public clients | Always use PKCE for SPA/mobile |
| Hardcode roles in code | Store permissions in database |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API auth integration |
| `security-scanner` | Skill | Auth vulnerability scanning |
| `data-modeler` | Skill | Users/roles schema design |
| `offensive-sec` | Skill | Auth attack vectors |

---

⚡ PikaKit v3.9.66
