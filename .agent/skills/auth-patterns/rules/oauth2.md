---
title: OAuth 2.0 and OpenID Connect
kind: reference
impact: critical
tags: [oauth2, oidc, pkce]
applies_to: [web, mobile, backend]
last_reviewed: "2026-09-28"
sources:
  - title: RFC 9700 OAuth 2.0 Security Best Current Practice
    url: https://www.rfc-editor.org/rfc/rfc9700
  - title: OpenID Connect Core 1.0
    url: https://openid.net/specs/openid-connect-core-1_0.html
---

# OAuth 2.0 & OpenID Connect

> Third-party login, SSO, and delegated authorization.

## Scope

Apply to OAuth authorization, OpenID Connect authentication, PKCE, redirects, state/nonce, scopes, and token exchange.

## Guidance

---

## OAuth 2.0 Flows

### Authorization Code + PKCE (Recommended for SPA/Mobile)

```
1. Client generates code_verifier (random 43-128 chars)
2. Client creates code_challenge = SHA256(code_verifier)
3. Redirect to auth server with code_challenge
4. User authenticates → redirect back with auth code
5. Client exchanges code + code_verifier for tokens
```

```typescript
import crypto from 'crypto';

// Generate PKCE pair
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// Authorization URL
const authUrl = new URL('https://auth.example.com/authorize');
authUrl.searchParams.set('response_type', 'code');
authUrl.searchParams.set('client_id', CLIENT_ID);
authUrl.searchParams.set('redirect_uri', REDIRECT_URI);
authUrl.searchParams.set('scope', 'openid profile email');
authUrl.searchParams.set('code_challenge', codeChallenge);
authUrl.searchParams.set('code_challenge_method', 'S256');
authUrl.searchParams.set('state', crypto.randomBytes(16).toString('hex'));
```

### Flow Selection Guide

| Flow | Best For | PKCE? |
|------|----------|-------|
| Authorization Code + PKCE | SPA, Mobile, Server | ✅ Always |
| Client Credentials | Machine-to-machine | N/A |
| Device Code | TV, CLI, IoT | N/A |
| ~~Implicit~~ | **DEPRECATED** — never use | ❌ |
| ~~Password~~ | **DEPRECATED** — never use | ❌ |

---

## OpenID Connect (OIDC)

OIDC = OAuth 2.0 + Identity Layer

### ID Token Claims

| Claim | Purpose |
|-------|---------|
| `sub` | Unique user identifier |
| `iss` | Token issuer |
| `aud` | Intended audience (your client_id) |
| `exp` | Expiration time |
| `iat` | Issued at |
| `nonce` | Replay attack prevention |
| `email` | User email (with scope) |
| `name` | User display name (with scope) |

### Scopes

| Scope | Data Returned |
|-------|---------------|
| `openid` | Required — returns `sub` |
| `profile` | name, picture, locale |
| `email` | email, email_verified |
| `offline_access` | Refresh token |

---

## Provider Integration

### Popular Providers

| Provider | Docs | Notes |
|----------|------|-------|
| Google | `accounts.google.com` | OIDC compliant |
| GitHub | `github.com/login/oauth` | OAuth 2.0 only (no OIDC) |
| Microsoft | `login.microsoftonline.com` | OIDC + Azure AD |
| Apple | `appleid.apple.com` | Required for iOS apps |

### Auth Libraries (Node.js)

| Library | Use Case |
|---------|----------|
| `next-auth` / `Auth.js` | Next.js integration |
| `passport` | Express middleware |
| `arctic` | Lightweight OAuth 2.0 |
| `lucia` | Session + OAuth (modern) |
| `better-auth` | Full-featured option; verify current provider support |

---

## Security Checklist

- [ ] Always use PKCE for public clients
- [ ] Validate `state` parameter to prevent CSRF
- [ ] Verify ID token signature and claims (`iss`, `aud`, `exp`)
- [ ] Use `nonce` to prevent replay attacks
- [ ] Store tokens in httpOnly cookies, not localStorage
- [ ] Implement token refresh before expiry

---

## Verification

Test exact redirect matching, PKCE, state and nonce validation, issuer/audience, code replay, token substitution, scope reduction, logout, and provider outage. Reject malformed or incomplete responses.

## Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | Token lifecycle after OAuth login |
| [session.md](session.md) | Session-based alternative |
| [passkey.md](passkey.md) | Passwordless alternative |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224
