# 🏛️ Governance Doctrine Pack v1.0  
**Supreme Engineering Constitution · PikaKit Skill**

**Status:** OFFICIAL · LOCKED  
**Skill Type:** Constitutional Skill (Progressive Disclosure)  
**Audience:** Engineers · Tech Leads · Reviewers · AI Agents  
**Platform:** PikaKit / Gemini / Claude / GPT

---

## 1. What Is This?

The **Governance Doctrine Pack** is the **constitutional governance system** for PikaKit.

It defines **how PikaKit is allowed to think, design, build, review, scale, and learn**.

This is **not documentation**.  
This is **not best practices**.  
This is **binding law**.

If a solution violates this pack,  
**it is invalid — even if it works**.

---

## 2. Why This Exists

PikaKit is a **data-trust financial platform**, not a feature-driven app.

At scale:
- Small technical shortcuts become systemic failures
- UX inconsistency destroys trust
- Unbounded AI "helpfulness" causes architectural drift
- Performance regressions hide behind "optimizations"

This pack exists to prevent:
- Silent data corruption
- Gesture and scroll fragmentation
- Realtime data contaminating history
- Performance regressions that erode trust
- AI agents exceeding their authority

---

## 3. PikaKit Skill Model (Critical)

This pack is implemented as a **single PikaKit Skill** using  
**Progressive Disclosure**.

### Progressive Disclosure Mapping

| PikaKit Level | PikaKit Content | When Loaded |
|---------------|------------------|-------------|
| **Level 1 – Metadata** | `SKILL.md`, `metadata/*.yaml` | Always (router) |
| **Level 2 – Instructions** | `constitution/`, `doctrines/` | When skill is equipped |
| **Level 3 – Resources** | `enforcement/`, `playbooks/`, `proposals/` | On-demand |

This ensures:
- No context saturation
- No tool bloat
- Deterministic agent behavior
- Lower latency and cost

---

## 4. Constitutional Hierarchy (READ THIS FIRST)

All decisions are resolved in **strict order**:

1. 👑 **PikaKit Master Constitution**
2. Architecture & System Doctrines
3. Commercial Guardrails
4. Performance Doctrine
5. Review Checklists
6. Agent Enforcement Protocol
7. Developer or Agent Preference

Anything lower **cannot override** anything higher.  
There are **no exceptions**.

---

## 5. Repository Structure

code-constitution/
├── SKILL.md                  # PikaKit entry point (router)
├── README.md                 # Onboarding (human + AI)
├── VERSION
├── CHANGELOG.md
│
├── rules/
│   ├── constitution/         # 👑 Supreme authority
│   │   └── master-constitution.md
│   ├── doctrines/            # 🏛️ System laws (by domain)
│   │   ├── architecture/architecture-doctrine.md
│   │   ├── backend/backend-data-engine-doctrine.md
│   │   ├── data/data-integrity-doctrine.md
│   │   ├── frontend/frontend-mobile-doctrine.md
│   │   ├── frontend/interaction-patterns-doctrine.md
│   │   ├── performance/performance-doctrine.md
│   │   ├── commercial/commercial-guardrails-doctrine.md
│   │   ├── review/code-review-doctrine.md
│   │   └── learning/learning-engine-doctrine.md
│   └── enforcement/          # 🛡️ Checklists, agent control, playbooks
│       ├── checklists/backend-api-review-checklist.md
│       ├── checklists/chart-component-review-checklist.md
│       ├── checklists/frontend-review-checklist.md
│       ├── agents/agent-enforcement-protocol.md
│       ├── agents/agent-system-prompt.md
│       └── playbooks/doctrine-violation-playbook.md
│
├── scripts/                  # 🔧 Validation & enforcement
│   ├── validate_doctrine.js
│   ├── audit_pr.js
│   └── learn.js
│
├── proposals/                # 🏷️ Controlled evolution (v1.1+)
│   └── v1.1-change-proposal-template.md
│
├── metadata/                 # 🔍 Machine-readable routing & precedence
│   ├── precedence.yaml
│   └── scope-map.yaml
│
├── resources/                # 📚 Reference materials
│   ├── AUTHORITY_MODEL.md
│   ├── ENFORCEMENT_GUIDE.md
│   └── LOAD_ORDER.md
│
├── examples/                 # 📝 Governance violation examples
│   ├── violation-backend-mutation/
│   └── violation-chart-injection/
│
└── knowledge/                # 🧠 Learned governance lessons
    └── lessons-learned.yaml

---

## 6. What's Inside (High Level)

### 👑 Constitution
- `master-constitution.md`  
Defines Prime Directives, System Laws, and decision precedence.

---

### 🏛️ Doctrines
- Architecture
- Backend data engine
- Chart & financial truth
- Frontend mobile & gestures
- Performance
- Commercial guardrails
- Code review
- Learning & self-improvement

These define **what is allowed and forbidden**.

---

### 🛡️ Enforcement
- Review checklists
- Agent enforcement protocol
- Agent system prompt
- Doctrine violation playbook

These ensure **rules are actually followed**.

---

### 🤖 AI Governance
AI agents are:
- Proposal-only
- Zero-trust by default
- Constitution-bound
- Fully auditable

Agents may assist —  
they may **never decide**.

---

## 7. Who Must Follow This?

This pack applies to:

- All engineers (junior → principal)
- Reviewers and tech leads
- AI coding assistants
- Automated refactor or audit agents
- Future contributors

**Experience level does not grant exemption.**

---

## 8. How To Use This Pack

### For Humans
1. Read `constitution/master-constitution.md`
2. Identify applicable doctrines
3. Design **within the laws**
4. Expect rejection if violations exist

---

### For Reviewers
- Enforce doctrines before reviewing style
- Cite violated laws explicitly
- Reject early and confidently
- Approval = responsibility, not politeness

---

### For AI / PikaKit Agents
- Index only `SKILL.md` initially
- Equip the skill when intent matches
- Cite doctrines in every non-trivial response
- Refuse requests that violate higher authority

---

## 9. Change Policy

This pack is **LOCKED**.

Changes require:
- A formal Change Proposal
- Constitutional justification
- Explicit version bump
- Architectural review

Silent edits are **governance violations**.

---

## 10. Final Principle

PikaKit optimizes for:
- Long-term trust
- Predictability
- System correctness
- Enterprise durability

Not for:
- Short-term velocity
- Clever hacks
- Feature-driven architecture

If this pack feels "too strict",  
it means it is working.

---

**Welcome to PikaKit.**  
**Protect the Constitution.**

---

⚡ PikaKit v3.9.98
