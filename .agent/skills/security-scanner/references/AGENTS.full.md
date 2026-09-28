# Security Scanner Full Agent Rules

> Deterministic compilation of 3 source rules for security-scanner v4.0.0. Do not edit directly.

## Rule Index

- [Authentication Security Review](#rule-auth-patterns) (critical, reference, source: `rules/auth-patterns.md`)
- [Application Security Review Checklist](#rule-checklists) (critical, reference, source: `rules/checklists.md`)
- [Fail-Closed Security Review Process](#rule-engineering-spec) (critical, process, source: `rules/engineering-spec.md`)

<a id="rule-auth-patterns"></a>

## Authentication Security Review

**Impact:** critical
**Kind:** reference
**Source:** `rules/auth-patterns.md`

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

<a id="rule-checklists"></a>

## Application Security Review Checklist

**Impact:** critical
**Kind:** reference
**Source:** `rules/checklists.md`

# Security Checklists

> Copy relevant checklists into PLAN.md or a security report. Use the bundled knowledge/source secret scanner for automated secret detection.

## Scope

Use this checklist to select applicable controls and record evidence. It does not replace threat modeling or platform-specific verification.

## Guidance

---

## OWASP Application Risk Checklist

### A01: Broken Access Control
- [ ] Authorization on all protected routes
- [ ] Deny by default (fail closed)
- [ ] Abuse controls on threat-modeled endpoints
- [ ] CORS properly configured (no wildcard + credentials)
- [ ] IDOR protection (validate resource ownership)

### A02: Security Misconfiguration
- [ ] Debug mode disabled in production
- [ ] Default credentials changed
- [ ] Error messages sanitized (no stack traces)
- [ ] Security headers configured (see below)
- [ ] Unnecessary features/ports disabled

### A03: Supply Chain 🆕
- [ ] Lock file committed (package-lock.json / pnpm-lock.yaml)
- [ ] `npm audit` or `pnpm audit` passes
- [ ] CI/CD pipeline uses pinned dependencies
- [ ] No `postinstall` scripts from untrusted packages
- [ ] Dependency integrity verified (checksums)

### A04: Cryptographic Failures
- [ ] Passwords protected with the current OWASP password-storage guidance
- [ ] Sensitive data protected with an approved, authenticated encryption scheme
- [ ] TLS 1.2+ enforced for all connections
- [ ] No secrets in code, logs, or version control
- [ ] Key rotation policy in place

### A05: Injection
- [ ] Parameterized queries (no string concat)
- [ ] Input validation on all user data
- [ ] Output encoding for XSS prevention
- [ ] No `eval()`, `exec()`, or dynamic code execution
- [ ] CSP header blocks inline scripts

### A06: Insecure Design
- [ ] Threat modeling completed
- [ ] Business logic validated
- [ ] Abuse cases documented
- [ ] Security requirements defined

### A07: Auth Failures
- [ ] MFA available for all users
- [ ] Session invalidation on logout
- [ ] Session timeout (15 min access, 7 day refresh)
- [ ] Brute force protection (lockout + rate limit)
- [ ] Password policy enforced (min 8 chars, no common passwords)

### A08: Integrity Failures
- [ ] CI/CD pipeline secured (branch protection, signed commits)
- [ ] Dependency integrity verified
- [ ] Update mechanism uses signatures
- [ ] Build artifacts are reproducible

### A09: Logging & Alerting
- [ ] Security events logged (login, failed auth, access denied)
- [ ] Logs protected from tampering
- [ ] No sensitive data in logs (passwords, tokens, PII)
- [ ] Alerting configured for suspicious activity
- [ ] Audit trail for admin actions

### A10: Exceptional Conditions 🆕
- [ ] All errors handled gracefully
- [ ] No internal details exposed in error responses
- [ ] Unhandled exceptions don't crash the application
- [ ] Error monitoring configured (Sentry, etc.)

---

## Security Headers Implementation

### Next.js (next.config.js)

```javascript
const securityHeaders = [
  { key: 'Content-Security-Policy', value: "default-src 'self'; script-src 'self'; style-src 'self' 'unsafe-inline'" },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-XSS-Protection', value: '1; mode=block' },
  { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
]

module.exports = {
  async headers() {
    return [{ source: '/(.*)', headers: securityHeaders }]
  },
}
```

### Express Middleware

```typescript
import helmet from 'helmet'

app.use(helmet())  // Sets all security headers automatically

// Or manual:
app.use((req, res, next) => {
  res.setHeader('Content-Security-Policy', "default-src 'self'")
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.setHeader('X-Frame-Options', 'DENY')
  res.setHeader('Strict-Transport-Security', 'max-age=31536000; includeSubDomains')
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin')
  next()
})
```

### Header Reference

| Header | Purpose | Value |
|--------|---------|-------|
| `Content-Security-Policy` | XSS prevention | `default-src 'self'` |
| `X-Content-Type-Options` | MIME sniffing | `nosniff` |
| `X-Frame-Options` | Clickjacking | `DENY` |
| `Strict-Transport-Security` | Force HTTPS | `max-age=31536000; includeSubDomains` |
| `Referrer-Policy` | Referrer control | `strict-origin-when-cross-origin` |
| `Permissions-Policy` | Feature access | `camera=(), microphone=()` |

---

## Quick Audit Commands

```bash
# Dependencies
npm audit                             # Node.js vulnerabilities
npm audit --audit-level=high          # Only high+ severity
pnpm audit                            # pnpm equivalent
pip-audit                             # Python dependencies

# Secrets
npx secretlint "**/*"                 # Scan for secrets
git log --all -p | grep -i "password\|api_key\|secret"  # Git history

# Code patterns
npx eslint --rule 'no-eval: error' .  # Detect eval()
grep -rn "dangerouslySetInnerHTML" src/  # XSS vectors

# Repository secret scan
npx tsx .agent/skills/knowledge-compiler/scripts/secret-scanner.ts .

# HTTPS/TLS
openssl s_client -connect example.com:443  # Check TLS version
curl -I https://example.com | grep -i "strict\|content-security\|x-frame"  # Headers
```

---

## CI/CD Security Checklist

- [ ] Branch protection on `main` (require PR + approvals)
- [ ] Secrets stored in CI/CD variables (not in repo)
- [ ] Dependencies scanned on every PR (`npm audit`)
- [ ] SAST (Static Analysis) runs on every commit
- [ ] No `--force` push to protected branches
- [ ] Build environment isolated (ephemeral containers)
- [ ] Deployment requires manual approval for production
- [ ] Artifact signing enabled

---

## Verification

Record each applicable control as pass, finding, or incomplete with evidence. Fail the release when a required check cannot execute, a finding remains unowned, or a scanner reports timeout, read failure, or parse failure.

## Related

| File | When to Read |
|------|-------------|
| [auth-patterns.md](auth-patterns.md) | Auth implementation |
| [secret-scanner.ts](../../knowledge-compiler/scripts/secret-scanner.ts) | Automated secret scanning |
| [SKILL.md](../SKILL.md) | Security review workflow and risk prioritization |

---

⚡ PikaKit v3.9.224

<a id="rule-engineering-spec"></a>

## Fail-Closed Security Review Process

**Impact:** critical
**Kind:** process
**Source:** `rules/engineering-spec.md`

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
