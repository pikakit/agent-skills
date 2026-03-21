---
name: security-scanner
description: >-
  Advanced vulnerability analysis principles. OWASP 2025, Supply Chain Security, risk prioritization.
  Triggers on: security, vulnerability, OWASP, pentest, threat modeling.
  Coordinates with: code-review, cicd-pipeline, api-architect.
metadata:
  category: "devops"
  version: "2.0.0"
  triggers: "security, vulnerability, OWASP, pentest, threat modeling"
  success_metrics: "no critical vulnerabilities, OWASP passed"
  coordinates_with: "code-review, cicd-pipeline, api-architect"
---

# Security Scanner â€” Vulnerability Analysis & OWASP

> Think like an attacker. Prioritize by exploitability (EPSS), not just severity (CVSS).

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Pre-deployment | Run security scan |
| New dependencies | Check supply chain (A03) |
| Code review | Check 5 high-risk patterns |
| Secret detection | Scan 4 secret categories |
| Auth implementation | Read `auth-patterns.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| OWASP Top 10:2025 mapping | Red team execution (â†’ offensive-sec) |
| Risk prioritization (EPSS + CVSS) | CI/CD configuration (â†’ cicd-pipeline) |
| High-risk code patterns (5) | Authentication design (â†’ auth-patterns) |
| Secret detection guidance (4 types) | Code fixes |

**Expert decision skill:** Produces vulnerability assessments. Does not run scans.

---

## Core Principles (5 â€” Fixed)

| Principle | Application |
|-----------|-------------|
| **Assume Breach** | Design as if attacker is already inside |
| **Zero Trust** | Never trust, always verify |
| **Defense in Depth** | Multiple independent layers |
| **Least Privilege** | Minimum access required |
| **Fail Secure** | On error, deny access (fail closed) |

---

## Risk Prioritization (Deterministic)

```
Is it actively exploited (EPSS > 0.5)?
â”œâ”€â”€ YES â†’ CRITICAL: Immediate remediation
â””â”€â”€ NO  â†’ Check CVSS score:
         â”œâ”€â”€ â‰¥ 9.0        â†’ HIGH
         â”œâ”€â”€ 7.0 - 8.9    â†’ Check asset value â†’ MEDIUM or HIGH
         â””â”€â”€ < 7.0        â†’ LOW: Schedule later
```

---

## OWASP Top 10:2025 (Fixed)

| Rank | Category | Key Indicators |
|------|----------|---------------|
| A01 | Broken Access Control | IDOR, SSRF, privilege escalation |
| A02 | Security Misconfiguration | Default creds, missing headers |
| A03 | Supply Chain ðŸ†• | Compromised deps, CI/CD tampering |
| A04 | Cryptographic Failures | Weak crypto, exposed secrets |
| A05 | Injection | String concat in queries, userâ†’commands |
| A06 | Insecure Design | Missing threat model |
| A07 | Auth Failures | Broken sessions, weak credentials |
| A08 | Integrity Failures | Unsigned updates, untrusted pipelines |
| A09 | Logging & Alerting | Missing audit trail |
| A10 | Exceptional Conditions ðŸ†• | Unhandled errors exposing internals |

---

## High-Risk Code Patterns (5 â€” Fixed)

| Pattern | Risk | Fix |
|---------|------|-----|
| String concat in SQL/queries | Injection | Parameterized queries |
| `eval()`, `exec()` | Remote Code Execution | Remove or sandbox |
| `pickle.loads()` | Deserialization attack | Use JSON |
| User input in file paths | Path traversal | Sanitize + allowlist |
| `verify=False` (SSL) | Security bypass | Enable verification |

---

## Secret Detection (4 Categories)

| Type | Indicators |
|------|-----------|
| API Keys | `api_key`, `apikey`, high entropy strings |
| Tokens | `bearer`, `jwt`, `token` |
| Credentials | `password`, `secret`, `passwd` |
| Cloud | `AWS_`, `AZURE_`, `GCP_`, `GOOGLE_` |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_SCORES` | Yes | CVSS/EPSS required for risk |
| `ERR_INVALID_OWASP` | Yes | Category not A01-A10 |
| `ERR_INVALID_CVSS` | Yes | CVSS outside 0.0-10.0 |

**Zero internal retries.** Same vulnerability = same classification.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Scan without understanding | Map attack surface first |
| Alert on every CVE | Prioritize by EPSS exploitability |
| Fix symptoms only | Address root causes |
| Trust dependencies blindly | Verify integrity + audit |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [auth-patterns.md](auth-patterns.md) | Authentication patterns | Auth implementation |
| [checklists.md](checklists.md) | Security checklists | Pre-deployment |
| [scripts/security_scan.js](scripts/security_scan.js) | Scan script | Automated scanning |
| [engineering-spec.md](rules/engineering-spec.md) | Full spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Pre-deploy integration |
| `code-review` | Skill | Manual review |
| `offensive-sec` | Skill | Red team tactics |

---

âš¡ PikaKit v3.9.105
