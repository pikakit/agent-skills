---
title: Implementing Authentication
description: Implement secure, production-ready authentication with PikaKit
section: guides
category: workflows
order: 9
---

# Implementing Authentication

Learn how to implement secure authentication systems with **PikaKit** - from basic JWT authentication to OAuth2, 2FA, and passwordless login.

## Overview

- **Goal**: Implement secure, production-ready authentication.
- **Time**: 20-40 minutes (vs 4-8 hours manually).
- **Agents Used**: `project-planner`, `backend-specialist`, `security-auditor`, `test-engineer`.
- **Workflows**: `/plan`, `/cook`, `/validate`.

## Prerequisites

- Existing API or web application.
- Database configured (PostgreSQL, MongoDB, etc.).
- Email service for verification (optional).
- OAuth provider accounts (optional: Google, GitHub).

## Authentication Methods

| Method | Use Case | Security | Complexity | Time |
|--------|----------|----------|------------|------|
| JWT | API authentication | High | Low | 15 min |
| Session-based | Traditional web apps | High | Medium | 20 min |
| OAuth2 | Social login | Very High | Medium | 30 min |
| Passwordless | Magic links, OTP | High | Medium | 25 min |
| 2FA | Additional security | Very High | Medium | 20 min |

## Step-by-Step Workflow

### Step 1: Plan Authentication Strategy

Choose authentication method and plan implementation:

```bash
/plan "implement JWT authentication with email/password and password reset"
```

**Generated plan includes**:
- **User Model**: Email, password hash, verification status.
- **Endpoints**: Register, Login, Logout, Verify Email, Reset Password.
- **Security**: Bcrypt hashing, JWT (Access + Refresh), Rate Limiting.
- **Testing**: Security tests for brute force and token theft.

### Step 2: Implement Basic JWT Authentication

Execute the implementation using `/cook`:

```bash
/cook "implement JWT authentication with registration and login using bcrypt and jsonwebtoken"
```

**Implementation Details**:
- **Model**: Creates User schema with password hashing hooks.
- **Service**: Implements token generation and verification.
- **Middleware**: Adds `authenticateJWT` middleware.
- **Validation**: Adds Zod/Joi schemas for login/register.

### Step 3: Add Email Verification

```bash
/cook "add email verification to registration process using nodemailer"
```

**Workflow**:
1.  User registers -> Token generated.
2.  Email sent with verification link.
3.  Middleware stops unverified users.

### Step 4: Implement Password Reset

```bash
/cook "implement password reset flow with secure one-time tokens"
```

**Safety Checks**:
- Tokens expire in 15 minutes.
- Rate limiting (3 requests/hour).
- Secure token storage (hashed).

### Step 5: Add OAuth2 (Social Login)

```bash
/cook "add OAuth2 login with Google and GitHub using Passport.js"
```

**Features**:
- Account linking (merges social account with existing email).
- Auto-registration for new users.
- Secure callback handling.

### Step 6: Add Two-Factor Authentication (2FA)

```bash
/cook "implement TOTP-based 2FA with QR code setup (Google Authenticator compatible)"
```

**Flow**:
1.  User enables 2FA -> QR code generated.
2.  User scans and enters code to verify.
3.  Login requires password + OTP.
4.  Backup codes generated for emergency.

### Step 7: Add Passwordless Authentication

```bash
/cook "implement passwordless login with magic links"
```

### Step 8: Security Hardening

Secure your authentication system:

```bash
# Account Lockout
/cook "add account lockout after 5 failed login attempts"

# Session Management
/cook "implement session management with active session tracking"
```

### Step 9: Testing

Run comprehensive security and functional tests:

```bash
/validate
```

**Test Suite Coverage**:
- **Functional**: Registration, Login, Reset Flow.
- **Security**:
    - Brute force protection checks.
    - SQL Injection attempts.
    - XSS vulnerability scans.
    - Token expiration verification.

### Step 10: Security Review

Use `/inspect` to audit your security posture:

```bash
/inspect
```

**Security Checklist**:
- [x] Passwords hashed (bcrypt/argon2).
- [x] JWT secrets compliant (min 32 chars).
- [x] Rate limiting active.
- [x] HTTPS enforced.
- [x] No sensitive data in logs.

### Step 11: Documentation

Generate auth documentation for your team:

```bash
/chronicle
```

## Complete Example: E-Commerce Authentication

**Requirements**:
- User auth + Social Login.
- Guest Checkout.
- GDPR Compliance (Download/Delete data).

**Workflow**:
1.  **Plan**: `/plan "auth system for e-commerce with social login and guest checkout"`
2.  **Core**: `/cook "implement JWT auth with email verification"`
3.  **Social**: `/cook "add Google and Facebook login"`
4.  **Privacy**: `/cook "implement GDPR data export and account deletion"`
5.  **Verify**: `/validate`

## Best Practices

1.  **Secure Storage**: Never store passwords in plain text. Use bcrypt or Argon2.
2.  **Token Safety**: Store JWTs in `httpOnly` cookies, not `localStorage` (XSS risk).
3.  **Rate Limiting**: Apply strict limits to `/login` and `/register`.
4.  **Audit Logs**: Log all auth events (success/failure) for security monitoring.

## Troubleshooting

### Issue: Emails Not Sending
**Solution**:
```bash
/fix --quick "emails failing to send via nodemailer"
```

### Issue: OAuth Callback 400 Error
**Solution**:
```bash
/fix "Google OAuth callback returning 400 bad request"
```

## Next Steps

- **[Building a REST API](./building-rest-api.md)**: Integrate auth into your API.
- **[Code Review & Security](./code-review.md)**: Deep dive into security auditing.
- **[Debugging](./debugging-workflow.md)**: Fix auth issues.

---

**Key Takeaway**: PikaKit simplifies complex auth flows into safe, verified steps, reducing security risks and implementation time by 80%.
