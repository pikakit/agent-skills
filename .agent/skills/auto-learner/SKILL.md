---
name: auto-learner
description: >-
  Autonomous learning agent that extracts patterns from IDE errors, user corrections, and agent
  failures. Writes structured patterns to auto-learned skill. Triggers on: auto-learn, mistake,
  error fix, pattern extraction.
metadata:
  author: pikakit
  version: "1.0.0"
---

# Auto-Learner

Autonomous learning engine that extracts patterns from errors, corrections, and failures.

## Scope

| In Scope | Out of Scope |
|----------|-------------|
| Pattern extraction from errors | Pattern storage (→ auto-learned) |
| Root cause analysis | IDE integration (→ problem-checker) |
| Lesson categorization (LEARN-XXX) | Skill generation (→ skill-generator) |
| Severity classification | Agent routing |

## Protocol

```
1. DETECT → Error or user correction detected
2. ANALYZE → Extract root cause (5 Whys)
3. CATEGORIZE → Assign category + severity + ID
4. WRITE → Store pattern in auto-learned/patterns/
5. CONFIRM → Output: 📚 Learned: [LEARN-XXX]
```

## Trigger Words

| Language | Keywords |
|----------|----------|
| EN | "mistake", "wrong", "fix this", "broken" |
| VI | "lỗi", "sai", "hỏng", "sửa lại" |

## Lesson Schema

```yaml
- id: LEARN-XXX          # Auto-incremented
  pattern: "string"      # Error signature
  severity: CRITICAL|HIGH|MEDIUM|LOW
  message: "string"      # Fix instruction
  date: "YYYY-MM-DD"
  trigger: "string"      # What caused this
  fix_applied: boolean
```

## Category IDs

| Category | Pattern |
|----------|---------|
| Safety | `SAFE-XXX` |
| Code | `CODE-XXX` |
| Workflow | `FLOW-XXX` |
| Integration | `INT-XXX` |

## Integration

| Dependency | Type | Direction | Purpose |
|-----------|------|-----------|---------|
| `auto-learned` | Skill | Writes to | Pattern storage |
| `problem-checker` | Skill | Receives from | IDE error signals |
| `skill-generator` | Skill | Feeds into | High-confidence patterns → new skills |
| `learner` agent | Agent | Implements | This skill's primary executor |

## Enforcement (P2 — Advisory)

| Occurrence | Level | Action |
|-----------|-------|--------|
| 1st ignore | 💡 Log | Note, increment count |
| 2nd same | ⚠️ Warn | Re-read patterns, apply if applicable |
| 3+ same | 📊 Flag | Mark high-frequency, prioritize for skill gen |

> **Note:** This skill codifies the auto-learning protocol from GEMINI.md § Auto-Learn Protocol.
> The `learner` agent is its primary executor. Patterns are stored in `auto-learned/patterns/`.
