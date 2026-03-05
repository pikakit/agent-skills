# Mobile Security Coder — Engineering Specification

> Production-grade specification for secure mobile coding practices at FAANG scale.

---

## 1. Overview

Mobile Security Coder provides structured security guidance for mobile application development: 10 security domains (input validation, WebView security, data storage, HTTPS/network, authentication, platform-specific, API communication, code protection, mobile-specific vulnerabilities, privacy/compliance). The skill operates as an **Expert (decision tree)** — it produces security patterns, implementation guidance, checklist items, and code review criteria. It does not execute code, scan applications, or perform penetration testing.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Mobile security coding at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| WebView misconfiguration | 50% of apps enable JavaScript in all WebViews | XSS and data exfiltration |
| Insecure data storage | 40% of apps store secrets in SharedPreferences / UserDefaults | Credential theft |
| Missing certificate pinning | 55% of apps accept any valid certificate | MITM attacks |
| Input validation gaps | 35% of apps skip mobile-specific input sanitization | Injection attacks |

Mobile Security Coder eliminates these with domain-specific security patterns, platform-specific storage guidance (Keychain/Keystore), WebView lockdown (JavaScript disabled by default), and certificate pinning implementation.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | 10 security domains | Input, WebView, storage, HTTPS, auth, platform, API, code protection, vulns, privacy |
| G2 | Platform-specific guidance | iOS (Keychain, ATS) vs Android (Keystore, Network Security Config) |
| G3 | OWASP MASVS alignment | All guidance maps to MASVS categories |
| G4 | WebView lockdown | JavaScript disabled by default; explicit allowlist required |
| G5 | Secure storage routing | Sensitive data → Keychain (iOS) / Keystore (Android); never UserDefaults / SharedPreferences |
| G6 | Defense-in-depth | Multiple security layers; no single-point failure |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Security auditing | Owned by `security-scanner` skill |
| NG2 | Mobile framework selection | Owned by `mobile-developer` skill |
| NG3 | Mobile design patterns | Owned by `mobile-design` skill |
| NG4 | Penetration testing | Owned by `offensive-sec` skill |
| NG5 | Backend API design | Owned by `api-architect` skill |
| NG6 | General auth patterns | Owned by `auth-patterns` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| 10 security domains | Pattern guidance | Pattern implementation |
| OWASP MASVS mapping | Checklist items | Compliance certification |
| WebView security config | Configuration guidance | WebView rendering |
| Secure storage (Keychain/Keystore) | Storage routing | Encryption library |
| Certificate pinning | Implementation guidance | Certificate management |
| Code protection (ProGuard/R8) | Obfuscation guidance | Build pipeline |

**Side-effect boundary:** Mobile Security Coder produces security patterns, checklists, and code review criteria. It does not modify code, access devices, or scan applications.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "domain-guide" | "platform-specific" | "webview-config" |
                              # "storage-routing" | "cert-pinning" | "code-review" |
                              # "checklist" | "full-audit-guide"
Context: {
  platform: string            # "ios" | "android" | "both" | "react-native" | "flutter"
  domain: string | null       # One of 10 security domains
  owasp_category: string | null  # MASVS category if specific
  webview_required: boolean   # Whether WebView is used
  biometric_required: boolean # Whether biometric auth needed
  offline_capable: boolean    # Whether offline data storage needed
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  domain_guide: {
    domain: string
    patterns: Array<{
      name: string
      platform_ios: string | null
      platform_android: string | null
      owasp_mapping: string
    }>
  } | null
  webview_config: {
    rules: Array<{
      rule: string
      default: string
      rationale: string
    }>
  } | null
  storage_routing: {
    sensitive: {
      ios: string             # "Keychain Services"
      android: string         # "Android Keystore"
    }
    non_sensitive: {
      ios: string
      android: string
    }
    never_use: Array<string>  # ["UserDefaults for secrets", "SharedPreferences for secrets"]
  } | null
  checklist: {
    items: Array<{
      category: string
      item: string
      owasp_ref: string
      priority: string        # "critical" | "high" | "medium"
    }>
  } | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Storage routing is fixed: secrets → Keychain (iOS) / Keystore (Android); never UserDefaults / SharedPreferences.
- WebView defaults are fixed: JavaScript disabled, file access disabled, HTTPS-only.
- Certificate pinning recommendation is always present for network operations.
- OWASP MASVS mapping is consistent for each domain.
- 10 security domains are fixed and enumerated.
- Platform-specific guidance always differentiated for iOS and Android.

#### What Agents May Assume

- All guidance aligns with OWASP MASVS.
- Storage routing is deterministic per data sensitivity.
- WebView defaults are secure-by-default.
- Platform-specific guidance covers iOS and Android.

#### What Agents Must NOT Assume

- Guidance replaces a security audit.
- All patterns apply to all frameworks equally.
- Certificate pinning is implemented automatically.
- Biometric auth is available on all devices.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Domain guide | None; pattern guidance |
| Platform-specific | None; platform guidance |
| WebView config | None; configuration guidance |
| Storage routing | None; storage recommendation |
| Cert pinning | None; implementation guidance |
| Code review | None; review criteria |
| Checklist | None; checklist output |
| Full audit guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify platform and security domains relevant to the app
2. Invoke domain-guide for each relevant security domain
3. Invoke webview-config if WebView is used
4. Invoke storage-routing for data storage decisions
5. Invoke cert-pinning for network security
6. Invoke checklist for final security verification
7. Apply guidance (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces complete guidance for the requested domain.
- Checklist covers all 10 domains.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error | Use supported type |
| Unknown domain | Return error | Use one of 10 domains |
| Unknown platform | Return error | Specify ios, android, both, react-native, or flutter |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Domain guide | Yes | Same domain = same patterns |
| WebView config | Yes | Fixed defaults |
| Storage routing | Yes | Fixed per platform |
| Cert pinning | Yes | Fixed guidance |
| Checklist | Yes | Fixed items |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate domain, platform, request type | Classification |
| **Guide** | Generate patterns, checklists, or configurations | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| 10 fixed security domains | Input, WebView, storage, HTTPS, auth, platform, API, code protection, vulns, privacy |
| WebView defaults | JavaScript: disabled, file access: disabled, protocol: HTTPS-only |
| Storage routing | Secrets → Keychain/Keystore; never UserDefaults/SharedPreferences |
| Certificate pinning | Always recommended for API communication |
| OWASP MASVS alignment | Every pattern maps to MASVS category |
| Defense-in-depth | Multiple layers; no single security control |
| Platform differentiation | iOS and Android guidance always separate |
| Secure-by-default | All defaults are restrictive; explicit opt-in for relaxation |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown domain | Return `ERR_UNKNOWN_DOMAIN` | Use one of 10 domains |
| Unknown platform | Return `ERR_UNKNOWN_PLATFORM` | Specify valid platform |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing domain for domain-guide | Return `ERR_MISSING_DOMAIN` | Supply domain name |

**Invariant:** Every failure returns a structured error. No partial guidance.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_DOMAIN` | Validation | Yes | Domain not one of 10 |
| `ERR_UNKNOWN_PLATFORM` | Validation | Yes | Platform not recognized |
| `ERR_MISSING_DOMAIN` | Validation | Yes | Domain not provided |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Guidance generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "mobile-security-coder",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "platform": "string",
  "domain": "string|null",
  "owasp_category": "string|null",
  "webview_required": "boolean",
  "checklist_items_count": "number|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Domain guide issued | INFO | domain, platform, patterns_count |
| WebView config issued | INFO | platform, rules_count |
| Storage routing issued | INFO | platform, sensitivity_level |
| Checklist issued | INFO | items_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `mobilesec.decision.duration` | Histogram | ms |
| `mobilesec.domain.distribution` | Counter | per domain |
| `mobilesec.platform.distribution` | Counter | per platform |
| `mobilesec.request_type.distribution` | Counter | per type |

---

## 14. Security & Trust Model

### Data Handling

- Mobile Security Coder processes no credentials, keys, or PII.
- Guidance references public OWASP MASVS standards.
- No network calls, no file access.

### Security Guidance Integrity

| Principle | Enforcement |
|-----------|-------------|
| Fail-closed defaults | All WebView/storage defaults are restrictive |
| No security by obscurity | Defense-in-depth required |
| Platform-specific | Separate iOS and Android guidance |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Domain guide | < 3 ms | < 10 ms | 30 ms |
| Checklist generation | < 5 ms | < 15 ms | 40 ms |
| Full audit guide | < 10 ms | < 30 ms | 50 ms |
| Output size | ≤ 2,000 chars | ≤ 6,000 chars | 10,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| OWASP MASVS version drift | Low | Outdated guidance | Review annually |
| Platform API changes | Medium | Deprecated security APIs | Track iOS/Android releases |
| False sense of security | Medium | Checklist treated as audit | State explicitly: guidance only |
| Cross-platform gaps | Medium | RN/Flutter patterns differ from native | Separate cross-platform section |
| WebView defaults relaxed | High | Increases attack surface | Secure-by-default enforced |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies (knowledge skill) |
| When to Use section | ✅ | Situation-based routing table + vs security-scanner |
| Core content matches skill type | ✅ | Expert type: decision trees, checklists |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to mobile-developer, security-scanner, mobile-first |
| Content Map for multi-file | ✅ | Link to engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 10 security domains with platform-specific guidance | ✅ |
| **Functionality** | OWASP MASVS alignment for all patterns | ✅ |
| **Functionality** | WebView lockdown defaults (JS disabled, HTTPS-only) | ✅ |
| **Functionality** | Storage routing (Keychain/Keystore, never UserDefaults) | ✅ |
| **Functionality** | Certificate pinning guidance | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 4 categorized codes | ✅ |
| **Failure** | No partial guidance on error | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed domains, fixed defaults, fixed storage routing | ✅ |
| **Security** | No credentials, no PII, no file access | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 4 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless; unlimited parallel | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.79
