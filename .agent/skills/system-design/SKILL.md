---
name: system-design
description: >-
  Architectural decision-making framework. Requirements analysis, trade-off evaluation, ADR documentation.
  Use when making architecture decisions or analyzing system design.
  Triggers on: architecture, system design, scalability, microservices.
  Coordinates with: api-architect, data-modeler.
allowed-tools: Read, Glob, Grep
metadata:
  version: "1.0.0"
  category: "architecture"
  triggers: "architecture, system design, scalability, microservices, ADR"
  success_metrics: "architecture documented, scalability validated"
  coordinates_with: "api-architect, data-modeler"
---

# Architecture Decision Framework

> "Requirements drive architecture. Trade-offs inform decisions. ADRs capture rationale."

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Starting architecture | Read context-discovery.md |
| Documenting decisions | Use ADR template |
| Choosing patterns | Check pattern-selection.md |
| Examples | See examples.md |

---

## 🎯 Selective Reading Rule

**Read ONLY files relevant to the request!** Check the content map, find what you need.

| File                    | Description                              | When to Read                 |
| ----------------------- | ---------------------------------------- | ---------------------------- |
| `context-discovery.md`  | Questions to ask, project classification | Starting architecture design |
| `trade-off-analysis.md` | ADR templates, trade-off framework       | Documenting decisions        |
| `pattern-selection.md`  | Decision trees, anti-patterns            | Choosing patterns            |
| `examples.md`           | MVP, SaaS, Enterprise examples           | Reference implementations    |
| `patterns-reference.md` | Quick lookup for patterns                | Pattern comparison           |

---

## 🔗 Related Skills

| Skill                             | Use For                 |
| --------------------------------- | ----------------------- |
| `@[skills/database-design]`       | Database schema design  |
| `@[skills/api-patterns]`          | API design patterns     |
| `@[skills/deployment-procedures]` | Deployment architecture |

---

## Core Principle

**"Simplicity is the ultimate sophistication."**

- Start simple
- Add complexity ONLY when proven necessary
- You can always add patterns later
- Removing complexity is MUCH harder than adding it

---

## Validation Checklist

Before finalizing architecture:

- [ ] Requirements clearly understood
- [ ] Constraints identified
- [ ] Each decision has trade-off analysis
- [ ] Simpler alternatives considered
- [ ] ADRs written for significant decisions
- [ ] Team expertise matches chosen patterns

---

 PikaKit v3.9.66
