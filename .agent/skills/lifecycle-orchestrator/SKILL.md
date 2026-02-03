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

> **Purpose:** Coordinate full task lifecycle with safe state rollback

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
          ↓       ↓        ↓        ↓
       [On failure: Rollback to checkpoint]
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
| **Recover** | this skill | State restored |

---

## State Rollback Protocol

### When to Save State

| Trigger | Action |
|---------|--------|
| Before modifying >3 files | Save state |
| Before risky refactoring | Save state |
| User says "rollback", "undo" | Restore state |

### Save State

```javascript
const saveState = async (files) => {
  const state = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    files: files.map(f => ({ path: f, content: fs.readFileSync(f, 'utf8') }))
  };
  saveToStateStore(state);
  return state.id;
};
```

### Restore State

```javascript
const restoreState = async (stateId) => {
  const state = loadState(stateId);
  for (const file of state.files) {
    fs.writeFileSync(file.path, file.content, 'utf8');
  }
  console.log(`✅ Restored ${state.files.length} files`);
};
```

---

## State Storage

Location: `.agent/state/`

```
.agent/state/
├── current.json      # Current state ID
├── states/           # Saved states
└── history.json      # State history
```

---

## Failure Handling

```
Phase fails?
├── Retry (max 2)
├── Restore checkpoint
├── Notify user
└── Log to auto-learner
```

---

## Quick Reference

```bash
# Save state
node state_manager.js save --files "file1.tsx,file2.tsx"

# Restore latest
node state_manager.js restore --latest

# List states
node state_manager.js list
```

---

## Success Metrics

| Metric | Target |
|--------|--------|
| All phases complete | 100% |
| State save time | <1s |
| Restore accuracy | 100% |
| State retention | 10 recent |

---

## Context Engineering Metrics

> Optimize token usage and prevent context degradation.

### Key Thresholds

| Metric | Target | Action |
|--------|--------|--------|
| Token warning | 70% | Start compressing |
| Optimization trigger | 80% | Mandatory optimization |
| Compaction target | 50-70% | After compression |
| Cache hit rate | 70%+ | Optimal caching |
| Multi-agent cost | ~15x baseline | Expected overhead |

### Four-Bucket Strategy

```
1. WRITE  - Save context externally (files, artifacts)
2. SELECT - Only pull relevant context
3. COMPRESS - Reduce tokens, preserve information
4. ISOLATE - Split across sub-agents
```

### Optimization Actions

| Trigger | Action |
|---------|--------|
| > 70% tokens | Summarize previous work to artifacts |
| > 80% tokens | Compress conversation, remove duplicates |
| Complex task | Delegate to sub-agents |
| Repeated context | Cache in files |

---

## Integration

```
/autopilot → lifecycle-orchestrator → coordinates all skills
                                   → saves checkpoints
                                   → restores on failure
                                   → monitors context usage
```


---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `execution-reporter` | Skill | Task visibility |
| `problem-checker` | Skill | Error handling |
| `/autopilot` | Workflow | Auto execution |

---

⚡ PikaKit v3.2.0
