---
title: "API Security Testing"
kind: process
impact: critical
tags: [api, security, testing]
applies_to: [api-architect]
last_reviewed: "2026-09-28"
sources:
  - title: OWASP API Security Top 10
    url: https://owasp.org/API-Security/editions/2023/en/0x11-t10/
---

# API Security Testing

> Principles for testing API security. OWASP API Top 10, authentication, authorization testing.

---

## OWASP API Security Top 10

| Vulnerability | Test Focus |
|---------------|------------|
| **API1: BOLA** | Access other users' resources |
| **API2: Broken Auth** | JWT, session, credentials |
| **API3: Property Auth** | Mass assignment, data exposure |
| **API4: Resource Consumption** | Rate limiting, DoS |
| **API5: Function Auth** | Admin endpoints, role bypass |
| **API6: Business Flow** | Logic abuse, automation |
| **API7: SSRF** | Internal network access |
| **API8: Misconfiguration** | Debug endpoints, CORS |
| **API9: Inventory** | Shadow APIs, old versions |
| **API10: Unsafe Consumption** | Third-party API trust |

---

## Authentication Testing

### JWT Testing

| Check | What to Test |
|-------|--------------|
| Algorithm | None, algorithm confusion |
| Secret | Weak secrets, brute force |
| Claims | Expiration, issuer, audience |
| Signature | Manipulation, key injection |

### Session Testing

| Check | What to Test |
|-------|--------------|
| Generation | Predictability |
| Storage | Client-side security |
| Expiration | Timeout enforcement |
| Invalidation | Logout effectiveness |

---

## Authorization Testing

| Test Type | Approach |
|-----------|----------|
| **Horizontal** | Access peer users' data |
| **Vertical** | Access higher privilege functions |
| **Context** | Access outside allowed scope |

### BOLA/IDOR Testing

1. Identify resource IDs in requests
2. Capture request with user A's session
3. Replay with user B's session
4. Check for unauthorized access

---

## Input Validation Testing

| Injection Type | Test Focus |
|----------------|------------|
| SQL | Query manipulation |
| NoSQL | Document queries |
| Command | System commands |
| LDAP | Directory queries |

**Approach:** Test all parameters, try type coercion, test boundaries, check error messages.

---

## Rate Limiting Testing

| Aspect | Check |
|--------|-------|
| Existence | Is there any limit? |
| Bypass | Headers, IP rotation |
| Scope | Per-user, per-IP, global |

**Bypass techniques:** X-Forwarded-For, different HTTP methods, case variations, API versioning.

---

## GraphQL Security

| Test | Focus |
|------|-------|
| Introspection | Schema disclosure |
| Batching | Query DoS |
| Nesting | Depth-based DoS |
| Authorization | Field-level access |

---

## Security Testing Checklist

**Authentication:**
- [ ] Test for bypass
- [ ] Check credential strength
- [ ] Verify token security

**Authorization:**
- [ ] Test BOLA/IDOR
- [ ] Check privilege escalation
- [ ] Verify function access

**Input:**
- [ ] Test all parameters
- [ ] Check for injection

**Config:**
- [ ] Check CORS
- [ ] Verify headers
- [ ] Test error handling

---

> **Remember:** APIs are the backbone of modern apps. Test them like attackers will.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [auth.md](auth.md) | Auth patterns to test |
| [rate-limiting.md](rate-limiting.md) | Rate limit bypass testing |
| [graphql.md](graphql.md) | GraphQL-specific security |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Preconditions

Obtain authorization, define scope and rate limits, use isolated accounts and data, and prepare monitoring and an abort contact.

## Procedure

1. Inventory operations, versions, identities, objects, properties, and business flows.
2. Test authentication and token lifecycle.
3. Test object, property, and function authorization across tenants and roles.
4. Test resource consumption, SSRF boundaries, unsafe upstream data, inventory drift, and misconfiguration.
5. Record reproducible evidence with secrets and personal data redacted.

## Rollback

Stop on instability, remove test data and accounts, restore changed configuration, and notify the owner of any residual effect.

## Exit Gate

Pass only when critical paths have negative authorization tests, limits are enforced, findings have owners and severity, and retests verify remediation.
