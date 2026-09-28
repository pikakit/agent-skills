# Auth Patterns Full Agent Rules

> Deterministic compilation of 7 source rules for auth-patterns v4.0.0. Do not edit directly.

## Rule Index

- [Authentication Architecture Decision](#rule-engineering-spec) (critical, decision, source: `rules/engineering-spec.md`)
- [JWT Validation and Lifecycle](#rule-jwt-deep) (critical, reference, source: `rules/jwt-deep.md`)
- [Multi-Factor Authentication and Recovery](#rule-mfa) (critical, reference, source: `rules/mfa.md`)
- [OAuth 2.0 and OpenID Connect](#rule-oauth2) (critical, reference, source: `rules/oauth2.md`)
- [WebAuthn Passkeys](#rule-passkey) (critical, reference, source: `rules/passkey.md`)
- [RBAC and ABAC Authorization](#rule-rbac-abac) (critical, reference, source: `rules/rbac-abac.md`)
- [Session Management](#rule-session) (critical, reference, source: `rules/session.md`)

<a id="rule-engineering-spec"></a>

## Authentication Architecture Decision

**Impact:** critical
**Kind:** decision
**Source:** `rules/engineering-spec.md`

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

<a id="rule-jwt-deep"></a>

## JWT Validation and Lifecycle

**Impact:** critical
**Kind:** reference
**Source:** `rules/jwt-deep.md`

# JWT Deep Dive

> Token design, signing, rotation, and refresh patterns.

## Scope

Apply to signed JWT validation, claims, key discovery, rotation, revocation, and refresh-token boundaries. Do not treat JWT payloads as encrypted.

## Guidance

---

## JWT Structure

```
Header.Payload.Signature
```

| Part | Contains | Example |
|------|----------|---------|
| Header | Algorithm, type | `{"alg": "RS256", "typ": "JWT"}` |
| Payload | Claims (data) | `{"sub": "user123", "exp": 1700000000}` |
| Signature | Verification | HMAC or RSA signature |

---

## Signing Algorithms

| Algorithm | Type | Best For |
|-----------|------|----------|
| `RS256` | Asymmetric (RSA) | Microservices (verify without secret) |
| `ES256` | Asymmetric (ECDSA) | Mobile, performance-sensitive |
| `HS256` | Symmetric (HMAC) | Monolith (single service) |
| `EdDSA` | Asymmetric (Ed25519) | Modern, fastest asymmetric |

> **Rule:** Use asymmetric for distributed systems. Symmetric only for single-service.

---

## Claims Best Practices

### Standard Claims (use these)

| Claim | Purpose | Required? |
|-------|---------|-----------|
| `sub` | Subject (user ID) | ✅ |
| `iss` | Issuer | ✅ |
| `aud` | Audience | ✅ |
| `exp` | Expiry (Unix timestamp) | ✅ |
| `iat` | Issued at | ✅ |
| `jti` | JWT ID (unique) | For revocation |

### Custom Claims

```typescript
// ✅ Minimal claims
{
  sub: "user_abc123",
  role: "admin",        // For quick authz checks
  org: "org_xyz",       // Multi-tenant
  scope: "read write",  // API permissions
}

// ❌ Too much data
{
  sub: "user_abc123",
  email: "user@example.com",  // PII in token
  address: "...",              // Never store PII
  fullProfile: {...},          // Token too large
}
```

---

## Access + Refresh Token Pattern

```
┌──────────────┐     ┌──────────────┐     ┌──────────────┐
│    Client    │     │  Auth Server │     │   Resource   │
└──────┬───────┘     └──────┬───────┘     └──────┬───────┘
       │  Login             │                    │
       │───────────────────>│                    │
       │  Access (15min)    │                    │
       │  + Refresh (7d)    │                    │
       │<───────────────────│                    │
       │                    │                    │
       │  API call + Access Token                │
       │────────────────────────────────────────>│
       │  Response                               │
       │<────────────────────────────────────────│
       │                    │                    │
       │  (Access expired)  │                    │
       │  Refresh request   │                    │
       │───────────────────>│                    │
       │  New Access        │                    │
       │  + New Refresh     │ (rotation!)        │
       │<───────────────────│                    │
```

### Implementation

```typescript
// Token generation
function generateTokenPair(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    ACCESS_SECRET,
    { expiresIn: '15m', algorithm: 'RS256' }
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh', jti: crypto.randomUUID() },
    REFRESH_SECRET,
    { expiresIn: '7d', algorithm: 'RS256' }
  );

  return { accessToken, refreshToken };
}

// Refresh endpoint
async function refreshTokens(oldRefreshToken: string) {
  const payload = jwt.verify(oldRefreshToken, REFRESH_PUBLIC_KEY);

  // Check if token was already used (rotation detection)
  const isUsed = await redis.get(`used_refresh:${payload.jti}`);
  if (isUsed) {
    // Token reuse detected → compromise! Revoke all user sessions
    await revokeAllSessions(payload.sub);
    throw new SecurityError('Refresh token reuse detected');
  }

  // Mark old token as used
  await redis.setex(`used_refresh:${payload.jti}`, 7 * 86400, '1');

  return generateTokenPair(payload.sub);
}
```

---

## Key Rotation

### Why Rotate

- Limit blast radius of key compromise
- Compliance requirements (SOC 2, PCI)

### JWKS Endpoint Pattern

```typescript
// /.well-known/jwks.json
{
  "keys": [
    { "kid": "key-2025-01", "kty": "RSA", "use": "sig", ... },  // Current
    { "kid": "key-2024-07", "kty": "RSA", "use": "sig", ... }   // Previous (grace period)
  ]
}
```

### Rotation Schedule

| Environment | Frequency | Grace Period |
|-------------|-----------|--------------|
| Production | Every 90 days | 30 days overlap |
| High security | Every 30 days | 14 days overlap |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Store JWT in localStorage | httpOnly secure cookie |
| Long-lived access tokens | 15 min max + refresh |
| Put PII in claims | Minimal claims, lookup from DB |
| Same key for all environments | Per-env signing keys |
| Skip `exp` validation | Always check expiry |
| Trust JWT without signature check | Always verify signature |

---

## Verification

Reject tokens with an unexpected algorithm, issuer, audience, type, key, signature, lifetime, or required claim. Test expired/not-before boundaries, key rotation, revocation, refresh replay, and unavailable JWKS without falling back to acceptance.

## Related

| File | When to Read |
|------|-------------|
| [oauth2.md](oauth2.md) | OAuth2 flows that issue JWTs |
| [session.md](session.md) | Stateful alternative to JWT |
| [rbac-abac.md](rbac-abac.md) | Permission claims in JWT |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224

<a id="rule-mfa"></a>

## Multi-Factor Authentication and Recovery

**Impact:** critical
**Kind:** reference
**Source:** `rules/mfa.md`

# Multi-Factor Authentication (MFA)

> TOTP, WebAuthn, backup codes, and recovery flows.
> **See also:** `security-scanner/auth-patterns.md` for TOTP code pattern and account lockout.

## Scope

Apply to authenticator enrollment, step-up authentication, recovery codes, lost-device recovery, and factor replacement.

## Guidance

---

## MFA Strategy Selection

| Method | Security | UX | Best For |
|--------|----------|-----|---------|
| TOTP (authenticator app) | ★★★★ | ★★★ | General purpose |
| WebAuthn / Passkey | ★★★★★ | ★★★★ | Modern apps |
| SMS OTP | ★★ | ★★★★ | Legacy, low-risk |
| Email OTP | ★★ | ★★★ | Fallback only |
| Hardware key (YubiKey) | ★★★★★ | ★★ | High security |

> ⚠️ **SMS OTP is vulnerable to SIM swapping.** Avoid for high-value targets.

---

## TOTP Implementation

> **Reference:** See `security-scanner/auth-patterns.md` for base TOTP code pattern.

### Enhanced Setup Flow

```typescript
import { authenticator } from 'otplib';
import qrcode from 'qrcode';

async function enableMFA(userId: string) {
  // 1. Generate secret
  const secret = authenticator.generateSecret();

  // 2. Create otpauth URI
  const otpauthUrl = authenticator.keyuri(
    user.email,
    'YourApp',
    secret
  );

  // 3. Generate QR code
  const qrDataUrl = await qrcode.toDataURL(otpauthUrl);

  // 4. Store secret (encrypted) — NOT active yet
  await db.user.update({
    where: { id: userId },
    data: { mfaSecret: encrypt(secret), mfaPending: true },
  });

  // 5. Generate backup codes
  const backupCodes = generateBackupCodes(10);
  await storeBackupCodes(userId, backupCodes);

  return { qrDataUrl, backupCodes };
}

// 6. Verify first code to activate
async function confirmMFA(userId: string, code: string) {
  const secret = decrypt(user.mfaSecret);
  const isValid = authenticator.verify({ token: code, secret });

  if (!isValid) throw new InvalidCodeError();

  await db.user.update({
    where: { id: userId },
    data: { mfaEnabled: true, mfaPending: false },
  });
}
```

### Backup Codes

```typescript
function generateBackupCodes(count: number = 10): string[] {
  return Array.from({ length: count }, () =>
    crypto.randomBytes(4).toString('hex') // 8-char codes
  );
}

async function storeBackupCodes(userId: string, codes: string[]) {
  // Hash each code before storing
  const hashed = codes.map(code => ({
    userId,
    codeHash: crypto.createHash('sha256').update(code).digest('hex'),
    used: false,
  }));
  await db.backupCode.createMany({ data: hashed });
}

async function useBackupCode(userId: string, code: string): Promise<boolean> {
  const hash = crypto.createHash('sha256').update(code).digest('hex');
  const result = await db.backupCode.updateMany({
    where: { userId, codeHash: hash, used: false },
    data: { used: true, usedAt: new Date() },
  });
  return result.count > 0;
}
```

---

## WebAuthn / Passkey for MFA

```typescript
import { generateAuthenticationOptions, verifyAuthenticationResponse }
  from '@simplewebauthn/server';

// Challenge generation (server)
const options = await generateAuthenticationOptions({
  rpID: 'example.com',
  allowCredentials: user.credentials.map(c => ({
    id: c.credentialId,
    type: 'public-key',
  })),
  userVerification: 'required',
});

// Verify response (server)
const verification = await verifyAuthenticationResponse({
  response: clientResponse,
  expectedChallenge: storedChallenge,
  expectedOrigin: 'https://example.com',
  expectedRPID: 'example.com',
  authenticator: storedCredential,
});
```

---

## Recovery Flow

```
User cannot access MFA device?
├── Has backup codes → Enter backup code
├── Has recovery email → Email verification + admin review
├── Has trusted device → Device-based recovery
└── None of above → Manual identity verification (support)
```

### Recovery Best Practices

| Practice | Why |
|----------|-----|
| Show backup codes ONCE at setup | Prevent later access |
| Allow re-generating backup codes | When old ones run out |
| Log all recovery events | Audit trail |
| Rate limit recovery attempts | Prevent brute force |
| Notify on MFA changes | Alert user to compromise |

---

## Verification

Test enrollment confirmation, replay, throttling, factor removal, recovery-code single use, lost-device recovery, recent-authentication gates, and audit events. Verify a factor outage cannot silently downgrade protected actions.

## Related

| File | When to Read |
|------|-------------|
| [passkey.md](passkey.md) | Passkeys as MFA or passwordless |
| [jwt-deep.md](jwt-deep.md) | Token lifecycle after MFA |
| [session.md](session.md) | Session management with MFA |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224

<a id="rule-oauth2"></a>

## OAuth 2.0 and OpenID Connect

**Impact:** critical
**Kind:** reference
**Source:** `rules/oauth2.md`

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

<a id="rule-passkey"></a>

## WebAuthn Passkeys

**Impact:** critical
**Kind:** reference
**Source:** `rules/passkey.md`

# Passkeys (WebAuthn / FIDO2)

> Passwordless authentication using public-key cryptography.

## Scope

Apply to WebAuthn registration, authentication, challenge handling, relying-party validation, credential storage, and recovery.

## Guidance

---

## What Are Passkeys?

| Aspect | Detail |
|--------|--------|
| Standard | WebAuthn (W3C) + FIDO2 (FIDO Alliance) |
| Mechanism | Public-key cryptography (device holds private key) |
| Phishing resistance | ✅ Origin-bound (can't be phished) |
| UX | Biometric (fingerprint, Face ID) or PIN |
| Syncing | iCloud Keychain, Google Password Manager, 1Password |

---

## Flow Overview

```
Registration:
1. Server sends challenge + user info
2. Browser calls navigator.credentials.create()
3. User authenticates locally (biometric/PIN)
4. Browser returns public key + signed challenge
5. Server stores public key

Authentication:
1. Server sends challenge + allowed credential IDs
2. Browser calls navigator.credentials.get()
3. User authenticates locally
4. Browser returns signed challenge
5. Server verifies signature with stored public key
```

---

## Server Implementation

### Using @simplewebauthn/server

```bash
npm install @simplewebauthn/server @simplewebauthn/browser
```

### Registration

```typescript
import {
  generateRegistrationOptions,
  verifyRegistrationResponse,
} from '@simplewebauthn/server';

const rpName = 'Your App';
const rpID = 'example.com';
const origin = 'https://example.com';

// Step 1: Generate options
async function startRegistration(user: User) {
  const options = await generateRegistrationOptions({
    rpName,
    rpID,
    userID: user.id,
    userName: user.email,
    attestationType: 'none',     // Don't need hardware attestation
    authenticatorSelection: {
      residentKey: 'preferred',  // Discoverable credential (passkey)
      userVerification: 'required',
    },
    excludeCredentials: user.credentials.map(c => ({
      id: c.credentialId,
      type: 'public-key',
    })),
  });

  // Store challenge temporarily
  await redis.setex(`webauthn:${user.id}`, 300, options.challenge);

  return options;
}

// Step 2: Verify response
async function finishRegistration(user: User, response: RegistrationResponse) {
  const expectedChallenge = await redis.get(`webauthn:${user.id}`);

  const verification = await verifyRegistrationResponse({
    response,
    expectedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
  });

  if (verification.verified && verification.registrationInfo) {
    const { credentialPublicKey, credentialID, counter } =
      verification.registrationInfo;

    // Store credential
    await db.credential.create({
      data: {
        userId: user.id,
        credentialId: Buffer.from(credentialID),
        publicKey: Buffer.from(credentialPublicKey),
        counter,
        deviceType: verification.registrationInfo.credentialDeviceType,
        backedUp: verification.registrationInfo.credentialBackedUp,
      },
    });
  }
}
```

### Authentication

```typescript
import {
  generateAuthenticationOptions,
  verifyAuthenticationResponse,
} from '@simplewebauthn/server';

// Step 1: Generate challenge
async function startAuth(user?: User) {
  const options = await generateAuthenticationOptions({
    rpID,
    userVerification: 'required',
    // If user known, limit to their credentials
    ...(user && {
      allowCredentials: user.credentials.map(c => ({
        id: c.credentialId,
        type: 'public-key',
      })),
    }),
  });

  await redis.setex(`webauthn:auth:${options.challenge}`, 300, '1');
  return options;
}

// Step 2: Verify
async function finishAuth(response: AuthenticationResponse) {
  const credential = await db.credential.findUnique({
    where: { credentialId: response.id },
    include: { user: true },
  });

  if (!credential) throw new Error('Credential not found');

  const verification = await verifyAuthenticationResponse({
    response,
    expectedChallenge: storedChallenge,
    expectedOrigin: origin,
    expectedRPID: rpID,
    authenticator: {
      credentialPublicKey: credential.publicKey,
      credentialID: credential.credentialId,
      counter: credential.counter,
    },
  });

  if (verification.verified) {
    // Update counter (replay protection)
    await db.credential.update({
      where: { id: credential.id },
      data: { counter: verification.authenticationInfo.newCounter },
    });

    return credential.user;
  }
}
```

---

## Frontend (Browser)

```typescript
import {
  startRegistration,
  startAuthentication,
} from '@simplewebauthn/browser';

// Registration
const regOptions = await fetch('/api/auth/passkey/register').then(r => r.json());
const regResult = await startRegistration(regOptions);
await fetch('/api/auth/passkey/register/verify', {
  method: 'POST',
  body: JSON.stringify(regResult),
});

// Authentication
const authOptions = await fetch('/api/auth/passkey/login').then(r => r.json());
const authResult = await startAuthentication(authOptions);
await fetch('/api/auth/passkey/login/verify', {
  method: 'POST',
  body: JSON.stringify(authResult),
});
```

---

## Adoption Strategy

| Phase | Action |
|-------|--------|
| 1 | Offer passkey as optional MFA |
| 2 | Prompt existing users to add passkey |
| 3 | Allow passkey-only login (passwordless) |
| 4 | Keep password as fallback recovery |

---

## Browser Support

| Browser | Passkey Support |
|---------|-----------------|
| Chrome 108+ | ✅ Full |
| Safari 16+ | ✅ Full |
| Firefox 122+ | ✅ Full |
| Edge 108+ | ✅ Full |

---

## Verification

Verify challenge uniqueness and expiry, origin, relying-party ID, ceremony type, user verification policy, signature counter handling, duplicate credentials, factor recovery, and credential deletion. Test on each supported authenticator class.

## Related

| File | When to Read |
|------|-------------|
| [mfa.md](mfa.md) | MFA with passkeys as second factor |
| [oauth2.md](oauth2.md) | OAuth alternative to passkeys |
| [session.md](session.md) | Session after passkey auth |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224

<a id="rule-rbac-abac"></a>

## RBAC and ABAC Authorization

**Impact:** critical
**Kind:** reference
**Source:** `rules/rbac-abac.md`

# RBAC & ABAC — Access Control

> Role-Based and Attribute-Based authorization patterns.

## Scope

Apply to roles, attributes, ownership, tenant isolation, policy evaluation, default denial, and authorization auditability.

## Guidance

---

## Model Selection

```
How complex are your permissions?
├── Simple (admin/user/viewer)
│   └── RBAC (Role-Based)
├── Medium (roles + resource ownership)
│   └── RBAC + ownership checks
├── Complex (context-dependent rules)
│   └── ABAC (Attribute-Based)
└── Enterprise (multi-tenant + compliance)
    └── ABAC or hybrid RBAC+ABAC
```

---

## RBAC (Role-Based Access Control)

### Schema Design

```typescript
// Database models
interface User {
  id: string;
  roles: Role[];         // Many-to-many
}

interface Role {
  id: string;
  name: string;          // "admin", "editor", "viewer"
  permissions: Permission[];  // Many-to-many
}

interface Permission {
  id: string;
  resource: string;      // "posts", "users", "billing"
  action: string;        // "create", "read", "update", "delete"
}
```

### Prisma Schema

```prisma
model User {
  id    String     @id @default(cuid())
  roles UserRole[]
}

model Role {
  id          String           @id @default(cuid())
  name        String           @unique
  permissions RolePermission[]
  users       UserRole[]
}

model Permission {
  id       String           @id @default(cuid())
  resource String
  action   String
  roles    RolePermission[]
  @@unique([resource, action])
}

model UserRole {
  userId String
  roleId String
  user   User @relation(fields: [userId], references: [id])
  role   Role @relation(fields: [roleId], references: [id])
  @@id([userId, roleId])
}

model RolePermission {
  roleId       String
  permissionId String
  role         Role       @relation(fields: [roleId], references: [id])
  permission   Permission @relation(fields: [permissionId], references: [id])
  @@id([roleId, permissionId])
}
```

### Permission Check (Middleware)

```typescript
function requirePermission(resource: string, action: string) {
  return async (req: Request, res: Response, next: NextFunction) => {
    const user = req.user;
    const hasPermission = user.roles.some(role =>
      role.permissions.some(p =>
        p.resource === resource && p.action === action
      )
    );

    if (!hasPermission) {
      return res.status(403).json({ error: 'Insufficient permissions' });
    }
    next();
  };
}

// Usage
app.delete('/api/posts/:id', requirePermission('posts', 'delete'), deletePost);
```

---

## ABAC (Attribute-Based Access Control)

### When to Use

| Scenario | Example |
|----------|---------|
| Context-dependent | "Editors can only edit posts they authored" |
| Time-based | "Access only during business hours" |
| Location-based | "Only from corporate network" |
| Multi-tenant | "Users can only see their organization's data" |

### Policy Pattern

```typescript
interface PolicyContext {
  subject: { id: string; role: string; orgId: string; };
  resource: { type: string; ownerId: string; orgId: string; };
  action: string;
  environment: { time: Date; ip: string; };
}

function evaluatePolicy(ctx: PolicyContext): boolean {
  const policies: Policy[] = [
    // Owners can do anything to their resources
    {
      effect: 'allow',
      condition: (c) => c.subject.id === c.resource.ownerId,
    },
    // Admins can do anything in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'admin' &&
        c.subject.orgId === c.resource.orgId,
    },
    // Editors can read/update (not delete) in their org
    {
      effect: 'allow',
      condition: (c) =>
        c.subject.role === 'editor' &&
        c.subject.orgId === c.resource.orgId &&
        ['read', 'update'].includes(c.action),
    },
  ];

  // Default deny — allow only if at least one policy matches
  return policies.some(p => p.effect === 'allow' && p.condition(ctx));
}
```

---

## Libraries & Services

| Solution | Type | Best For |
|----------|------|----------|
| CASL | Library (JS) | Frontend + backend RBAC/ABAC |
| Casbin | Library (multi-lang) | Policy engine |
| Oso | Library | Application-embedded authz |
| Auth0 FGA | Service | Fine-grained authorization |
| Permit.io | Service | Managed RBAC/ABAC |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|------|
| Hardcode roles in if/else | Use permission table |
| Check role name in code | Check permission (resource + action) |
| Forget resource ownership | Always check `ownerId` |
| Skip multi-tenant isolation | Always scope queries by `orgId` |

---

## Verification

Build a deny-first policy matrix covering role, ownership, tenant, resource state, and sensitive action. Test cross-tenant identifiers, missing attributes, stale roles, privilege downgrade, policy-store outage, and audit completeness.

## Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | Role/permission claims in JWT |
| [session.md](session.md) | Session-based permission checks |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224

<a id="rule-session"></a>

## Session Management

**Impact:** critical
**Kind:** reference
**Source:** `rules/session.md`

# Session Management

> Cookie-based sessions, Redis store, stateless vs stateful trade-offs.

## Scope

Apply to session identifiers, cookies, fixation prevention, renewal, idle/absolute expiry, revocation, storage, and concurrent sessions.

## Guidance

---

## Stateless vs Stateful

| Aspect | Stateless (JWT) | Stateful (Session) |
|--------|-----------------|-------------------|
| Storage | Token contains data | Server stores data |
| Scalability | ✅ No shared state | ⚠️ Needs shared store |
| Revocation | ❌ Hard (need blocklist) | ✅ Delete from store |
| Size | Can grow large | Fixed session ID |
| Best for | Microservices, API | Traditional web SSR |

### Hybrid Approach (Recommended)

```
Use JWT for access (short-lived, stateless)
+ Session-based refresh (stateful, revocable in Redis)
```

---

## Cookie-Based Session

### Secure Cookie Configuration

```typescript
app.use(session({
  name: '__session',                    // Avoid default 'connect.sid'
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,                     // No JS access
    secure: true,                       // HTTPS only
    sameSite: 'lax',                    // CSRF protection
    maxAge: 24 * 60 * 60 * 1000,       // 24 hours
    domain: '.example.com',            // Cross-subdomain if needed
    path: '/',
  },
}));
```

### Cookie Security Flags

| Flag | Purpose | Always Set? |
|------|---------|-------------|
| `httpOnly` | Prevent XSS token theft | ✅ |
| `secure` | HTTPS only | ✅ (prod) |
| `sameSite: lax` | Basic CSRF protection | ✅ |
| `sameSite: strict` | Full CSRF protection | For sensitive ops |
| `__Host-` prefix | Origin-bound | High security |

---

## Redis Session Store

### Why Redis

| Feature | Benefit |
|---------|---------|
| In-memory speed | < 1ms session lookup |
| TTL support | Automatic expiry |
| Cluster support | Horizontal scaling |
| Pub/Sub | Session invalidation across nodes |

### Setup

```typescript
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

const redisClient = createClient({ url: process.env.REDIS_URL });
await redisClient.connect();

app.use(session({
  store: new RedisStore({ client: redisClient }),
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { httpOnly: true, secure: true, sameSite: 'lax' },
}));
```

### Session Data Structure

```typescript
// Keep session data minimal
interface SessionData {
  userId: string;
  role: string;
  orgId?: string;
  loginAt: number;
  lastActiveAt: number;
  // DON'T store: full user profile, preferences, cart items
}
```

---

## Session Lifecycle

### Login

```typescript
async function login(req: Request) {
  const user = await authenticate(req.body);

  // Regenerate session ID (prevent fixation)
  req.session.regenerate(() => {
    req.session.userId = user.id;
    req.session.role = user.role;
    req.session.loginAt = Date.now();
  });
}
```

### Logout

```typescript
async function logout(req: Request) {
  const sessionId = req.sessionID;

  // Destroy server-side session
  req.session.destroy(() => {
    // Clear cookie
    res.clearCookie('__session');
  });
}
```

### Invalidate All Sessions (password change)

```typescript
async function invalidateAllSessions(userId: string) {
  // Scan Redis for user's sessions
  const keys = await redis.keys(`sess:*`);
  for (const key of keys) {
    const data = await redis.get(key);
    if (data && JSON.parse(data).userId === userId) {
      await redis.del(key);
    }
  }
}
```

---

## Session Security Checklist

- [ ] Regenerate session ID after login
- [ ] Set `httpOnly`, `secure`, `sameSite` on cookies
- [ ] Use Redis/Memcached for distributed sessions
- [ ] Implement idle timeout (30 min) + absolute timeout (24h)
- [ ] Invalidate sessions on password change
- [ ] Log session creation/destruction for audit

---

## Verification

Test fixation prevention, cookie attributes, renewal, idle and absolute expiry, logout, credential-change revocation, concurrent sessions, CSRF defenses, store outage, and key rotation. Confirm logs never contain session identifiers.

## Related

| File | When to Read |
|------|-------------|
| [jwt-deep.md](jwt-deep.md) | JWT as stateless alternative |
| [oauth2.md](oauth2.md) | OAuth sessions |
| [mfa.md](mfa.md) | MFA with sessions |
| [SKILL.md](../SKILL.md) | Auth strategy decision tree |

---

⚡ PikaKit v3.9.224
