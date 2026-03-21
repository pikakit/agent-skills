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

# Offensive Security â€” Red Team Tactics (MITRE ATT&CK)

> 13 phases. 4 access vectors. Authorization mandatory. Guidance only â€” no execution.

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
| ATT&CK phase guidance (13 phases) | Vulnerability scanning (â†’ security-scanner) |
| Initial access vectors (4) | Code security review (â†’ code-review) |
| Priv esc checklists (Win + Linux) | Mobile security (â†’ mobile-security-coder) |
| AD attack paths (3) | Exploit development |

**Expert decision skill:** Produces methodology and checklists. Does NOT execute exploits.

---

## MITRE ATT&CK Phases (13 â€” Fixed Order)

```
RECON â†’ INITIAL ACCESS â†’ EXECUTION â†’ PERSISTENCE
   â†“          â†“              â†“            â†“
PRIV ESC â†’ DEFENSE EVASION â†’ CRED ACCESS â†’ DISCOVERY
   â†“          â†“              â†“            â†“
LATERAL â†’ COLLECTION â†’ C2 â†’ EXFILTRATION â†’ IMPACT
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

## Initial Access Vectors (4 â€” Fixed)

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

## AD Attacks (3 â€” Fixed)

| Attack | Target |
|--------|--------|
| Kerberoasting | Service account passwords |
| DCSync | Domain credentials |
| Golden Ticket | Persistent domain access |

---

## Ethical Boundaries (Non-Negotiable)

| âœ… Always | âŒ Never |
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

**Zero internal retries.** `authorized: false` â†’ hard block, no output.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| Rush to exploitation | Follow MITRE ATT&CK phases in order |
| Cause damage | Minimize impact to production |
| Skip documentation | Document every action with timestamps |
| Test beyond scope | Verify scope before each phase |

---

## ðŸ“‘ Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec | Architecture review |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `security-scanner` | Skill | Vulnerability scanning |
| `code-review` | Skill | Code security review |
| `mobile-security-coder` | Skill | Mobile security |

---

âš¡ PikaKit v3.9.105
