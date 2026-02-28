---
name: lifecycle-orchestrator
description: >-
  End-to-end task lifecycle management with state rollback capability. Coordinates
  full task lifecycle from input to completion with checkpoint/restore safety.
  Triggers on: complex multi-phase requests, /autopilot, /build workflows, rollback.
  Coordinates with: smart-router, multi-agent, problem-checker.
metadata:
  category: "core"
  version: "2.0.0"
  triggers: "complex multi-phase requests, /autopilot, /build, rollback, undo"
  coordinates_with: "smart-router, multi-agent, problem-checker"
  success_metrics: "all phases complete, 100% restore accuracy"
---

# Lifecycle Orchestrator

> Coordinate full task lifecycle with safe state rollback

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Complex task | Use full lifecycle |
| /autopilot | Coordinate all phases |
| Rollback needed | Restore checkpoint |
| Multi-agent | Monitor handoffs |

---

## Safety Philosophy

```
Safety > Recoverability > Correctness > Cleanliness > Convenience
```

---

## Lifecycle Phases

```
Input → Plan → Execute → Verify → Deploy → Learn → Complete
         ↓       ↓        ↓        ↓
      [Checkpoint saved before each phase]
```

| Phase | Owner | Success |
|-------|-------|---------|
| **Plan** | project-planner | PLAN.md approved |
| **Execute** | multi-agent | Code complete |
| **Verify** | problem-checker | 0 errors |
| **Recover** | this skill | State restored |

---

## State Rollback

| Trigger | Action |
|---------|--------|
| Before >3 file changes | Save state |
| Before risky refactoring | Save state |
| User says "rollback", "undo" | Restore state |

```bash
# Quick commands
node state_manager.js save --files "file1.tsx,file2.tsx"
node state_manager.js restore --latest
node state_manager.js list
```

**Storage:** `.agent/state/`

---

## Context Optimization

| Metric | Target | Action |
|--------|--------|--------|
| Token warning | 70% | Start compressing |
| Optimization trigger | 80% | Mandatory optimization |

**Four-Bucket Strategy:** WRITE → SELECT → COMPRESS → ISOLATE

---

## Success Metrics

| Metric | Target |
|--------|--------|
| All phases complete | 100% |
| Restore accuracy | 100% |
| State save time | <1s |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `execution-reporter` | Skill | Task visibility |
| `problem-checker` | Skill | Error handling |
| `/autopilot` | Workflow | Auto execution |

---

⚡ PikaKit v3.9.66
