---
name: offensive-sec
description: >-
  Red team tactics principles based on MITRE ATT&CK. Attack phases, detection evasion, reporting.
  Triggers on: pentest, red team, exploit, vulnerability, hacking.
  Coordinates with: security-scanner, code-review.
metadata:
  category: "devops"
  version: "2.0.0"
  triggers: "pentest, red team, exploit, vulnerability, hacking"
  success_metrics: "phases covered, scope enforced, report complete"
  coordinates_with: "security-scanner, code-review"
---

# Offensive Security — Red Team Tactics (MITRE ATT&CK)

> 13 phases. 4 access vectors. Authorization mandatory. Guidance only — no execution.

**Remember:** Red team simulates attackers to improve defenses, not to cause harm.

---

## Prerequisites

- **Authorization confirmed** (`authorized: true`)
- **Scope defined** (engagement boundaries documented)

---

## When to Use

| Situation | Action |
|-----------|--------|
| Plan red team engagement | Use MITRE ATT&CK methodology |
| Select initial access vector | Use vector decision tree |
| Privilege escalation | Use platform-specific checklist |
| Active Directory testing | Use AD attack paths |
| Write pentest report | Use report structure |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| ATT&CK phase guidance (13 phases) | Vulnerability scanning (→ security-scanner) |
| Initial access vectors (4) | Code security review (→ code-review) |
| Priv esc checklists (Win + Linux) | Mobile security (→ mobile-security-coder) |
| AD attack paths (3) | Exploit development |

**Expert decision skill:** Produces methodology and checklists. Does NOT execute exploits.

---

## MITRE ATT&CK Phases (13 — Fixed Order)

```
RECON → INITIAL ACCESS → EXECUTION → PERSISTENCE
   ↓          ↓              ↓            ↓
PRIV ESC → DEFENSE EVASION → CRED ACCESS → DISCOVERY
   ↓          ↓              ↓            ↓
LATERAL → COLLECTION → C2 → EXFILTRATION → IMPACT
```

| Phase | Objective |
|-------|-----------|
| Recon | Map attack surface |
| Initial Access | First foothold |
| Execution | Run code on target |
| Persistence | Survive reboots |
| Privilege Escalation | Gain admin/root |
| Defense Evasion | Avoid detection |
| Lateral Movement | Spread to other systems |

---

## Initial Access Vectors (4 — Fixed)

| Vector | When to Use |
|--------|-------------|
| Phishing | Human target, email access |
| Public exploits | Vulnerable exposed services |
| Valid credentials | Leaked or cracked |
| Supply chain | Third-party access |

---

## Privilege Escalation (Platform-Specific)

| Platform | Check | Opportunity |
|----------|-------|-------------|
| **Windows** | Unquoted service paths | Write to path |
| **Windows** | Weak service permissions | Modify service |
| **Windows** | Stored credentials | Harvest |
| **Linux** | SUID binaries | Execute as owner |
| **Linux** | Sudo misconfig | Command execution |
| **Linux** | Cron jobs | Writable scripts |

---

## AD Attacks (3 — Fixed)

| Attack | Target |
|--------|--------|
| Kerberoasting | Service account passwords |
| DCSync | Domain credentials |
| Golden Ticket | Persistent domain access |

---

## Ethical Boundaries (Non-Negotiable)

| ✅ Always | ❌ Never |
|----------|---------|
| Stay within scope | Destroy production data |
| Minimize impact | Access beyond proof of concept |
| Report real threats immediately | Retain sensitive data |
| Document all actions | Create or distribute malware |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_NOT_AUTHORIZED` | No | Engagement not authorized |
| `ERR_MISSING_SCOPE` | Yes | Scope not defined |
| `ERR_UNKNOWN_PHASE` | Yes | Phase not in ATT&CK |
| `ERR_UNKNOWN_PLATFORM` | Yes | Platform not recognized |
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |

**Zero internal retries.** `authorized: false` → hard block, no output.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Rush to exploitation | Follow MITRE ATT&CK phases in order |
| Cause damage | Minimize impact to production |
| Skip documentation | Document every action with timestamps |
| Test beyond scope | Verify scope before each phase |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `security-scanner` | Skill | Vulnerability scanning |
| `code-review` | Skill | Code security review |
| `mobile-security-coder` | Skill | Mobile security |

---

⚡ PikaKit v3.9.77
