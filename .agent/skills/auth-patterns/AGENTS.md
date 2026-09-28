# Auth Patterns Agent Rules

> Generated from 7 source rules for auth-patterns v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| critical | decision | [Authentication Architecture Decision](references/AGENTS.full.md#rule-engineering-spec) | Separate identity proofing, authentication, session/token lifecycle, authorization, and recovery. Prefer an authorization-code flow with PKCE for delegated browser/mobile login and a revocable server- |
| critical | reference | [JWT Validation and Lifecycle](references/AGENTS.full.md#rule-jwt-deep) | Token design, signing, rotation, and refresh patterns. |
| critical | reference | [Multi-Factor Authentication and Recovery](references/AGENTS.full.md#rule-mfa) | TOTP, WebAuthn, backup codes, and recovery flows. |
| critical | reference | [OAuth 2.0 and OpenID Connect](references/AGENTS.full.md#rule-oauth2) | Third-party login, SSO, and delegated authorization. |
| critical | reference | [WebAuthn Passkeys](references/AGENTS.full.md#rule-passkey) | Passwordless authentication using public-key cryptography. |
| critical | reference | [RBAC and ABAC Authorization](references/AGENTS.full.md#rule-rbac-abac) | Role-Based and Attribute-Based authorization patterns. |
| critical | reference | [Session Management](references/AGENTS.full.md#rule-session) | Cookie-based sessions, Redis store, stateless vs stateful trade-offs. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
