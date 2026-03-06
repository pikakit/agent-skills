---
name: system-design
description: >-
  Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation.
  Use when making architecture decisions or analyzing system design.
  Triggers on: architecture, system design, scalability, microservices.
  Coordinates with: api-architect, data-modeler.
metadata:
  version: "2.0.0"
  category: "architecture"
  triggers: "architecture, system design, scalability, microservices, ADR"
  success_metrics: "architecture documented, scalability validated"
  coordinates_with: "api-architect, data-modeler"
---

# System Design — Architecture Decision Framework

> Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Starting architecture | Read context-discovery.md |
| Documenting decisions | Use ADR template |
| Choosing patterns | Check pattern-selection.md |
| Reference examples | See examples.md |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Context discovery (project classification) | API design (→ api-architect) |
| Trade-off analysis (ADR format) | Database design (→ data-modeler) |
| Pattern selection (decision trees) | Deployment (→ cicd-pipeline) |
| Architecture validation (6-item checklist) | Code implementation |

**Expert decision skill:** Produces architecture recommendations. Does not write code.

---

## Core Principle (Fixed)

**"Simplicity is the ultimate sophistication."**

1. Start simple
2. Add complexity ONLY when proven necessary
3. You can always add patterns later
4. Removing complexity is MUCH harder than adding it

---

## ADR Format (6 Sections — Fixed)

| Section | Purpose |
|---------|---------|
| Title | Decision being made |
| Status | proposed / accepted / deprecated |
| Context | Why this decision is needed |
| Options | Each option with pros and cons |
| Decision | Selected option with rationale |
| Consequences | Impact of the decision |

---

## Validation Checklist (6 Items — Fixed)

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PROJECT_TYPE` | Yes | Project type not one of 3 |
| `ERR_MISSING_TOPIC` | Yes | Trade-off requires decision topic |
| `ERR_UNKNOWN_SCALE` | Yes | Scale not startup, growth, or enterprise |

**Zero internal retries.** Same project type + constraints = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Over-engineer from day one | Start simple, add complexity when needed |
| Skip trade-off analysis | Document pros/cons for every option |
| Copy architecture from tutorials | Match patterns to actual constraints |
| Ignore team expertise | Choose patterns team can maintain |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [context-discovery.md](context-discovery.md) | Project classification questions | Starting architecture |
| [trade-off-analysis.md](trade-off-analysis.md) | ADR templates, trade-off framework | Documenting decisions |
| [pattern-selection.md](pattern-selection.md) | Decision trees, anti-patterns | Choosing patterns |
| [patterns-reference.md](patterns-reference.md) | Quick pattern lookup | Pattern comparison |
| [examples.md](examples.md) | MVP, SaaS, Enterprise examples | Reference implementations |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `api-architect` | Skill | API design patterns |
| `data-modeler` | Skill | Database schema design |
| `cicd-pipeline` | Skill | Deployment architecture |

---

⚡ PikaKit v3.9.93
