---
title: Architecture Debate Process
kind: process
impact: standard
tags: [architecture, debate, trade-offs, yagni, kiss]
applies_to: [idea-storm]
last_reviewed: "2026-09-28"
sources:
  - title: W3C Architecture Principles
    url: https://www.w3.org/wiki/ArchitecturePrinciples
  - title: NIST SP 800-160 Systems Security Engineering
    url: https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/rev-1/final
---

# Architecture Debate Process

## Preconditions

- Capture a clear 1-2 sentence problem statement.
- Identify known constraints: timeline, scale, infrastructure, team expertise, and budget.
- Identify at least two viable architectural alternatives before debate begins.

## Procedure

1. **Scout & Discovery:** Understand existing system state and clarify explicit requirements vs assumptions.
2. **Research & Analysis:** Evaluate technical options against YAGNI (Do we need this now?), KISS (Is there a simpler way?), and DRY (Are we repeating ourselves?).
3. **Structured Debate:** Challenge assumptions aggressively. Probe edge cases, operational overhead, failure modes, and long-term maintenance costs.
4. **Pros/Cons Matrix:** Compare candidates using weighted criteria including complexity, velocity, and lock-in.
5. **Consensus & Handoff:** Align on the recommended solution, document accepted trade-offs, and generate actionable next steps.

### Analysis Template

```markdown
## Problem Statement
[Clear 1-2 sentence description]

## Constraints
- Scale: [requests/sec, data size]
- Integration: [existing systems]

## Options Evaluated

### Option A: [Name]
| Pros | Cons |
|------|------|
| + Fast to implement | - Limited scalability |

**YAGNI:** ✅ / ❌ | **KISS:** ✅ / ❌ | **DRY:** ✅ / ❌

## Recommendation
**Selected:** Option A
**Trade-offs Accepted:** [documented concessions]
```

## Rollback

Revert to requirements gathering and reframe the problem statement if debate uncovers conflicting assumptions, insoluble trade-offs, or invalid constraints.

## Exit Gate

Pass when consensus is reached on an architecture candidate, accepted trade-offs are explicitly recorded, non-goals are defined, and the decision report is handed off to planning.
