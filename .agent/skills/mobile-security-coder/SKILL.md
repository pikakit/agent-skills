---
name: mobile-security-coder
description: >-
  Expert in secure mobile coding practices specializing in input validation,
  WebView security, and mobile-specific security patterns. Use PROACTIVELY
  for mobile security implementations or mobile security code reviews.
  Triggers on: mobile security, OWASP MASVS, WebView, biometric, certificate pinning.
  Coordinates with: mobile-developer, security-scanner, mobile-first.
metadata:
  version: "2.0.0"
  category: "mobile-games"
  triggers: "mobile security, OWASP MASVS, WebView, biometric, certificate pinning"
  success_metrics: "MASVS aligned, WebView locked, secrets in Keychain/Keystore"
  coordinates_with: "mobile-developer, security-scanner, mobile-first"
---

# Mobile Security Coder — Secure Mobile Development Expert

> 10 domains. OWASP MASVS. WebView locked. Keychain/Keystore. Defense-in-depth.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Mobile security implementation | Use domain-specific patterns |
| WebView security config | Lock down with defaults |
| Secure data storage | Route to Keychain/Keystore |
| Certificate pinning | Apply pinning guidance |
| Mobile code review | Use security checklist |

### vs Security Scanner

| This Skill | Security Scanner |
|-----------|-----------------|
| Writes secure mobile code | Audits existing code |
| Implementation patterns | Compliance assessment |
| Platform-specific guidance | General security scanning |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| 10 security domain patterns | Security auditing (→ security-scanner) |
| OWASP MASVS alignment | Penetration testing (→ offensive-sec) |
| WebView lockdown guidance | Mobile framework (→ mobile-developer) |
| Keychain/Keystore routing | Auth patterns (→ auth-patterns) |

**Expert decision skill:** Produces security patterns and checklists. Does not scan or test.

---

## 10 Security Domains

| # | Domain | Key Concern |
|---|--------|-------------|
| 1 | Input Validation | Touch/gesture/sensor sanitization |
| 2 | WebView Security | JS disabled by default, HTTPS-only |
| 3 | Data Storage | Keychain (iOS) / Keystore (Android) |
| 4 | HTTPS/Network | Certificate pinning, TLS enforcement |
| 5 | Authentication | Biometric, MFA, OAuth/PKCE |
| 6 | Platform-Specific | iOS (ATS, Keychain) / Android (NSC, Keystore) |
| 7 | API Communication | Request validation, secure headers |
| 8 | Code Protection | ProGuard/R8, anti-tampering, RASP |
| 9 | Mobile Vulnerabilities | Deep links, data leakage, screenshot protection |
| 10 | Privacy/Compliance | GDPR, CCPA, data minimization |

---

## WebView Defaults (Fixed — Secure-by-Default)

| Setting | Default | Rationale |
|---------|---------|-----------|
| JavaScript | **Disabled** | Enable only per-domain allowlist |
| File access | **Disabled** | Prevents local file exfiltration |
| Protocol | **HTTPS-only** | No HTTP, no file:// |
| CSP | **Enforced** | script-src restrictions |

---

## Storage Routing (Fixed)

| Data Type | iOS | Android |
|-----------|-----|---------|
| Secrets/credentials | **Keychain Services** | **Android Keystore** |
| Non-sensitive config | UserDefaults | SharedPreferences |
| **NEVER** for secrets | UserDefaults | SharedPreferences |

---

## Security Checklist (OWASP MASVS — Top Items)

- [ ] Certificate pinning for all API endpoints
- [ ] Biometric auth with secure fallback
- [ ] Keychain/Keystore for all secrets
- [ ] WebView: JS disabled, HTTPS-only, CSP enforced
- [ ] Root/jailbreak detection
- [ ] Code obfuscation (ProGuard/R8)
- [ ] Log sanitization (no PII in logs)
- [ ] Screenshot/screen recording protection
- [ ] Deep link URL validation + parameter sanitization
- [ ] GDPR/CCPA consent management

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_DOMAIN` | Yes | Domain not one of 10 |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not recognized |
| `ERR_MISSING_DOMAIN` | Yes | Domain not provided |

**Zero internal retries.** Deterministic; same context = same guidance.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Store secrets in UserDefaults/SharedPrefs | Use Keychain (iOS) / Keystore (Android) |
| Enable JS in all WebViews | Disable by default, allowlist per domain |
| Skip certificate pinning | Pin for all API endpoints |
| Rely on single security layer | Defense-in-depth (multiple layers) |
| Log sensitive data | Sanitize all log output |
| Trust client-side validation only | Server-side validation required |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `mobile-developer` | Skill | Mobile implementation |
| `security-scanner` | Skill | Security auditing |
| `mobile-first` | Skill | Mobile orchestrator |
| `auth-patterns` | Skill | Authentication patterns |

---

⚡ PikaKit v3.9.79
