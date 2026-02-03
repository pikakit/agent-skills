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
  coordinates_with: "code-review, cicd-pipeline, api-architect"
  success_metrics: "no critical vulnerabilities, OWASP passed"
---

# Security Scanner

> **Purpose:** Think like an attacker, defend like an expert

---

## Quick Reference

| Script | Command |
|--------|---------|
| Security scan | `node scripts/security_scan.js <path>` |

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Pre-deployment | Run security scan |
| New dependencies | Check supply chain |
| Code review | Check for high-risk patterns |
| Secret detection | Scan for exposed secrets |

---

## Core Principles

| Principle | Application |
|-----------|-------------|
| **Assume Breach** | Design as if attacker inside |
| **Zero Trust** | Never trust, always verify |
| **Defense in Depth** | Multiple layers |
| **Least Privilege** | Minimum access only |
| **Fail Secure** | On error, deny access |

---

## OWASP Top 10:2025

| Rank | Category | Think About |
|------|----------|-------------|
| A01 | Broken Access Control | IDOR, SSRF |
| A02 | Security Misconfiguration | Headers, defaults |
| A03 | Supply Chain 🆕 | Dependencies, CI/CD |
| A04 | Cryptographic Failures | Weak crypto, secrets |
| A05 | Injection | User input → commands |
| A06 | Insecure Design | Flawed architecture |
| A07 | Auth Failures | Session, credentials |
| A08 | Integrity Failures | Unsigned updates |
| A09 | Logging & Alerting | Blind spots |
| A10 | Exceptional Conditions 🆕 | Error handling |

---

## Risk Prioritization

```
Is it actively exploited (EPSS >0.5)?
├── YES → CRITICAL: Immediate
└── NO → Check CVSS
         ├── ≥9.0 → HIGH
         ├── 7.0-8.9 → Check asset value
         └── <7.0 → Schedule later
```

---

## High-Risk Code Patterns

| Pattern | Risk |
|---------|------|
| String concat in queries | Injection |
| `eval()`, `exec()` | RCE |
| `pickle.loads()` | Deserialization |
| User input in file paths | Traversal |
| `verify=False` | Security disabled |

---

## Secret Patterns

| Type | Look For |
|------|----------|
| API Keys | `api_key`, high entropy |
| Tokens | `bearer`, `jwt` |
| Credentials | `password`, `secret` |
| Cloud | `AWS_`, `AZURE_`, `GCP_` |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Scan without understanding | Map attack surface first |
| Alert on every CVE | Prioritize by exploitability |
| Fix symptoms only | Address root causes |
| Trust deps blindly | Verify integrity |

---

## References

- [references/owasp-checklists.md](references/owasp-checklists.md)
- [references/supply-chain.md](references/supply-chain.md)

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `cicd-pipeline` | Skill | Pre-deploy integration |
| `code-review` | Skill | Manual review |
| `offensive-sec` | Skill | Red team tactics |

---

> **Remember:** Vulnerability scanning finds issues. Expert thinking prioritizes what matters.

---

⚡ PikaKit v3.2.0
