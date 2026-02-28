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
  coordinates_with: "security-scanner, code-review"
  success_metrics: "vulnerabilities found, report complete"
---

# Red Team Tactics

> **Purpose:** Adversary simulation based on MITRE ATT&CK

---

## MITRE ATT&CK Phases

```
RECON → INITIAL ACCESS → EXECUTION → PERSISTENCE
   ↓          ↓              ↓            ↓
PRIV ESC → DEFENSE EVASION → CRED ACCESS → DISCOVERY
   ↓          ↓              ↓            ↓
LATERAL → COLLECTION → C2 → EXFILTRATION → IMPACT
```

---

## Phase Objectives

| Phase | Objective |
|-------|-----------|
| Recon | Map attack surface |
| Initial Access | Get first foothold |
| Execution | Run code on target |
| Persistence | Survive reboots |
| Privilege Escalation | Get admin/root |
| Defense Evasion | Avoid detection |
| Lateral Movement | Spread to other systems |

---

## Initial Access Vectors

| Vector | When to Use |
|--------|-------------|
| Phishing | Human target, email access |
| Public exploits | Vulnerable services exposed |
| Valid credentials | Leaked or cracked |
| Supply chain | Third-party access |

---

## Privilege Escalation

### Windows
| Check | Opportunity |
|-------|-------------|
| Unquoted service paths | Write to path |
| Weak service permissions | Modify service |
| Stored credentials | Harvest |

### Linux
| Check | Opportunity |
|-------|-------------|
| SUID binaries | Execute as owner |
| Sudo misconfig | Command execution |
| Cron jobs | Writable scripts |

---

## Defense Evasion

| Technique | Purpose |
|-----------|---------|
| LOLBins | Use legitimate tools |
| Obfuscation | Hide malicious code |
| Timestomping | Hide file modifications |

---

## AD Attacks

| Attack | Target |
|--------|--------|
| Kerberoasting | Service account passwords |
| DCSync | Domain credentials |
| Golden Ticket | Persistent domain access |

---

## Ethical Boundaries

### Always
- Stay within scope
- Minimize impact
- Report immediately if real threat found
- Document all actions

### Never
- Destroy production data
- Access beyond proof of concept
- Retain sensitive data

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Rush to exploitation | Follow methodology |
| Cause damage | Minimize impact |
| Skip reporting | Document everything |

---

> **Remember:** Red team simulates attackers to improve defenses, not to cause harm.

---

⚡ PikaKit v3.9.66
