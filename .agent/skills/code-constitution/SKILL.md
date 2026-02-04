---
name: code-constitution-skills-governance
description: >-
  Constitutional governance for PikaKit. Enforces non-negotiable laws for correctness, 
  trust, and durability. Use when designing system architecture, reviewing pull requests, 
  modifying backend data pipelines, or evaluating risky/breaking changes.
  Triggers on: architecture review, critical data, breaking change, governance, doctrine.
  Coordinates with: code-review, review-automation, security-scanner.
metadata:
  version: "3.0.0"
  type: "constitutional-skill"
  authority: "supreme"
  enforcement: "strict"
  category: "core"
  triggers: "architecture review, critical data, breaking change, governance, doctrine"
  success_metrics: "doctrine validation passed, no constitutional violations"
  coordinates_with: "code-review, review-automation, security-scanner"
---

# PikaKit Governance

**(Supreme Constitutional Skill)**

This skill defines the **binding constitutional authority** governing how PikaKit projects are designed, built, reviewed, scaled, and evolved.

> If any output violates this skill, the output is **invalid — even if it works**.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Architecture decisions | Load constitution |
| Breaking changes | Check doctrine |
| Data modifications | Validate compliance |
| Agent governance | Follow agent rules |

---

## 1. Activation Triggers

This skill MUST be activated when request involves:
- System architecture or boundaries
- Data ownership or persistence
- Critical business logic
- Breaking changes or commercial risk
- AI agent behavior or autonomy

If intent is ambiguous, this skill MUST be loaded by default.

---

## 2. Authority Model

This skill has **SUPREME AUTHORITY**. It overrides:
- All other skills
- Framework defaults
- Agent preferences
- Developer convenience

---

## 3. Agent Operating Mode

| Setting | Value |
|---------|-------|
| POLICY_MODE | STRICT |
| AUTONOMY | PROPOSAL_ONLY |
| TRUST_LEVEL | ZERO |

**Agents MAY:** Propose, explain trade-offs, identify risks, cite doctrines.

**Agents MUST NOT:** Approve without consent, merge automatically, bypass enforcement.

---

## 4. Enforcement Behavior

When violation detected:
1. **Stop** execution
2. **Cite** violated doctrine
3. **Explain** systemic risk
4. **Refuse** request

> Partial compliance = enforcement failure.

---

## 5. Learning & Change Policy

| Learning Allowed | Learning Forbidden |
|-----------------|-------------------|
| General reasoning | Code style overrides |
| Better judgment | Naming exceptions |
|  | Project hacks |

**Change Policy:** This skill is LOCKED. Changes require approved Change Proposal.

---

## 6. Failure Handling

If agent violates doctrine:
- Output MUST be rejected
- Agent MUST be restricted
- Past outputs MAY require audit

> **Safety overrides productivity.**

---

## 📑 Content Map

| Folder | Content |
|--------|---------|
| `rules/` | Domain-specific rules |
| `metadata/` | Routing & intent |
| `resources/` | Templates |
| `scripts/` | Validation scripts |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `code-review` | Skill | Code quality |
| `security-scanner` | Skill | Security |
| `code-craft` | Skill | Code standards |

---

**Status:** OFFICIAL · LOCKED | **Authority:** SUPREME | **Override:** NONE

---

⚡ PikaKit v3.2.0
