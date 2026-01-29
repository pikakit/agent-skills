---
name: lifecycle-orchestrator
description: >-
  End-to-end task lifecycle management across phases. Coordinates full task lifecycle
  from input to completion. Triggers on: complex multi-phase requests, /autopilot,
  /build workflows. Coordinates with: smart-router, multi-agent, problem-checker.
metadata:
  category: "core"
  version: "1.0.0"
  triggers: "complex multi-phase requests, /autopilot, /build workflows"
  coordinates_with: "smart-router, multi-agent, problem-checker"
  success_metrics: "all phases complete, no stuck states"
---

# lifecycle-orchestrator

> **Purpose:** Coordinate full task lifecycle from input to completion

---

## Lifecycle Phases

```mermaid
graph LR
    A[Input] --> B[Plan]
    B --> C[Execute]
    C --> D[Verify]
    D --> E[Deploy]
    E --> F[Learn]
    F --> G[Complete]
    
    D -->|Errors| C
    E -->|Failure| F
    F --> H[Recover]
    H --> C
```

---

## Phase Management

| Phase | Owner | Success Criteria |
|-------|-------|------------------|
| **Input** | input-validator | Request validated |
| **Plan** | project-planner | PLAN.md approved |
| **Execute** | multi-agent | Code complete |
| **Verify** | problem-checker | 0 errors |
| **Deploy** | cicd-pipeline | Preview running |
| **Learn** | auto-learner | Lessons captured |
| **Recover** | state-rollback | State restored |

---

## Checkpoint Protocol

After each phase:

1. Log phase completion
2. Update TaskSummary
3. Check for blockers
4. Proceed or escalate

---

## Failure Handling

```
Phase fails?
├── Retry (max 2)
├── Recover state
├── Notify user
└── Log to auto-learner
```

---

## Integration

Activated by /autopilot and /build:

```
/autopilot → lifecycle-orchestrator → coordinates all skills
```
