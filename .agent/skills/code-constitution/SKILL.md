---
name: code-constitution-skills-governance
description: >-
  Constitutional governance for PikaKit. Enforces non-negotiable laws for correctness,
  trust, and durability. Fail-closed: ambiguity = refuse. Zero-trust agent mode.
  Triggers on: architecture review, critical data, breaking change, governance, doctrine.
  Coordinates with: code-review, review-automation, security-scanner.
metadata:
  version: "3.0.0"
  type: "constitutional-skill"
  authority: "supreme"
  enforcement: "strict"
  category: "core"
  triggers: "architecture review, critical data, breaking change, governance, doctrine"
  success_metrics: "doctrine validation passed, zero constitutional violations, fail-closed enforced"
  coordinates_with: "code-review, review-automation, security-scanner"
---

# PikaKit Governance — Code Constitution

> Supreme authority. Zero-trust agents. Fail-closed enforcement. Doctrine-first decisions.

**Status:** OFFICIAL · LOCKED | **Authority:** SUPREME | **Override:** NONE

---

## Prerequisites

**Required:** None — Code Constitution is a governance framework with no external dependencies.

**Doctrine library:** 16 rule files in `rules/` directory (required for evaluation).

---

## When to Use

| Scope | Activation | Default |
|-------|-----------|---------|
| System architecture or boundaries | **Mandatory** — always load | — |
| Data ownership or persistence | **Mandatory** | — |
| Critical business logic | **Mandatory** | — |
| Breaking changes or commercial risk | **Mandatory** | — |
| AI agent behavior or autonomy | **Mandatory** | — |
| Ambiguous intent | **Mandatory** — load by default | Refuse |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Agent operating mode (STRICT/PROPOSAL_ONLY/ZERO_TRUST) | Agent implementation |
| Doctrine library (16 rules in `rules/`) | Rule execution in other skills |
| Enforcement behavior (Stop → Cite → Refuse) | Automated remediation |
| Authority hierarchy definition | Skill priority in GEMINI.md |
| Change Proposal review | Proposal tooling |

**Pure decision skill:** Produces governance decisions (approve/refuse/escalate). Zero side effects.

---

## Authority Hierarchy

```
Code Constitution (SUPREME)
  └── GEMINI.md (P0)
        └── Agent .md files (P1)
              └── Skill .md files (P2)
```

No skill, agent, or workflow may override a constitutional decision.

---

## Agent Operating Mode

| Setting | Value | Meaning |
|---------|-------|---------|
| POLICY_MODE | STRICT | All rules enforced without exception |
| AUTONOMY | PROPOSAL_ONLY | Agents propose; never self-approve |
| TRUST_LEVEL | ZERO | Agent declarations are inputs, not truth |

**Agents MAY:** Propose actions, explain trade-offs, identify risks, cite doctrines.

**Agents MUST NOT:** Approve without user consent, merge automatically, bypass enforcement.

---

## Enforcement Behavior

When violation detected:

1. **Stop** execution immediately
2. **Cite** specific violated doctrine (file + rule)
3. **Explain** systemic risk of the violation
4. **Refuse** the request

**Fail-closed invariant:** Partial compliance = enforcement failure. Ambiguity = refuse or escalate.

---

## Error Taxonomy

| Code | Recoverable | Default Action |
|------|-------------|----------------|
| `ERR_INVALID_REQUEST_TYPE` | No | Refuse |
| `ERR_MISSING_CONTEXT` | Yes | Refuse |
| `ERR_DOCTRINE_NOT_FOUND` | No | Refuse |
| `ERR_AMBIGUOUS_SCOPE` | Yes | Escalate |
| `ERR_TRUST_VIOLATION` | No | Refuse + restrict |
| `ERR_INVALID_PROPOSAL` | Yes | Refuse |
| `ERR_EVALUATION_FAILED` | No | Refuse |

**All failures default to refuse.** No silent approvals. Zero internal retries.

---

## Change Policy

| Allowed | Forbidden |
|---------|-----------|
| General reasoning improvements | Code style overrides |
| Better risk judgment | Naming convention exceptions |
| New doctrine via Change Proposal | Project-specific hacks |
| — | Direct doctrine modification without proposal |

**This skill is LOCKED.** Changes require an approved Change Proposal (stored in `proposals/`).

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Self-approve agent actions | Propose and wait for user consent |
| Ignore governance for "quick fix" | Load constitution; validate first |
| Override constitution from another skill | Respect authority hierarchy |
| Assume no violation = safe | Explicitly check applicable doctrines |
| Modify doctrines directly | Submit Change Proposal |

---

## 📑 Content Map

| Folder | Content | When to Read |
|--------|---------|--------------|
| [rules/](rules/) | 16 domain-specific governance rules | Doctrine evaluation |
| [rules/engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |
| [metadata/](metadata/) | Routing & intent configuration | Skill routing |
| [resources/](resources/) | Templates & reference materials | Building governance artifacts |
| [scripts/](scripts/) | Validation & enforcement scripts | Automated checking |
| [examples/](examples/) | Governance usage examples | Learning patterns |
| [knowledge/](knowledge/) | Accumulated governance knowledge | Context building |
| [proposals/](proposals/) | Change Proposals for doctrine updates | Modifying constitution |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality review |
| `security-scanner` | Skill | Security vulnerability detection |
| `code-craft` | Skill | Code standards enforcement |
| `skill-generator` | Skill | Skill file validation |

---

⚡ PikaKit v3.9.70
