---
name: auto-learner
description: >-
  Autonomous learning: extracts patterns from IDE errors, user corrections, and agent failures.
  Use when user indicates a mistake ("wrong", "fix this", "loi", "sai") to capture lessons.
  NOT for applying existing patterns (use auto-learned) or debugging (use debug-pro).
category: autonomous-learning
triggers: ["auto-learn", "mistake", "error fix", "pattern extraction"]
coordinates_with: ["auto-learned", "problem-checker", "skill-generator"]
success_metrics: ["Actionable Lesson Rate", "Lesson Extraction Speed", "False Positive Rate"]
metadata:
  author: pikakit
  version: "3.9.122"
---

# Auto-Learner

Autonomous learning engine that extracts patterns from errors, corrections, and failures.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Exact Error Message? | Raw IDE error / User correction text |
| 2 | Component Context? | File type / Framework / Language |
| 3 | Attempted Fix? | What was changed to correct the error? |
| 4 | Fix Success Status? | Verified working / Still failing |
| 5 | Core Lesson Learned? | The underlying pattern to prevent this |

---

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
5. CONFIRM → Output: ⚕ Learned: [LEARN-XXX]
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

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `lesson_extraction_started` | `{"trigger": "user_correction", "error_type": "type_mismatch"}` | `INFO` |
| `lesson_extracted_successfully` | `{"lesson_id": "LEARN-001", "severity": "HIGH"}` | `INFO` |
| `lesson_extraction_failed` | `{"reason": "ambiguous_fix", "error_signature": "unknown"}` | `WARN` |

All auto-learner outputs MUST emit `lesson_extraction_started` and either `lesson_extracted_successfully` or `lesson_extraction_failed`.

---

⚡ PikaKit v3.9.122
