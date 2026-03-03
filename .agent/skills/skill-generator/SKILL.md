---
name: skill-generator
description: >-
  Autonomous skill generation from patterns, lessons, and feedback.
  Converts high-confidence patterns into validated, production-ready skills.
  Triggers on: generate skill, create skill, pattern to skill, learn.
  Coordinates with: problem-checker, code-constitution.
metadata:
  category: "evolution"
  version: "2.0.0"
  triggers: "generate skill, create skill, pattern to skill, auto-generate"
  success_metrics: "≥80% generated skills pass validation"
  coordinates_with: "problem-checker, code-constitution"
---

# Skill Generator — Autonomous Skill Creation

> Pattern (≥ 3 occurrences) → Candidate → 5-check validation → Promote → Registry.

---

## When to Use

| Situation | Action |
|-----------|--------|
| High-confidence pattern (≥ 3 occurrences) | Generate candidate skill |
| New candidate needs review | Use `validate` command |
| Validated candidate ready | Use `promote` command |
| Promoted skill has issues | Use `rollback` command |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Pattern analysis + occurrence threshold | Error detection (→ problem-checker) |
| SKILL.md generation from template | Code standards (→ code-constitution) |
| 5-check validation gate | Pattern detection (→ auto-learned) |
| Promotion/rollback lifecycle | Runtime skill execution |

**Orchestrator skill:** Creates files, modifies registry. Has side effects.

---

## Pipeline (6 Stages — Fixed)

```
INIT → ANALYZING           [pattern received]
ANALYZING → REJECTED       [< 3 occurrences OR failure-only OR hotfix-only]
ANALYZING → GENERATING     [context valid]
GENERATING → CANDIDATE     [SKILL.md created]
CANDIDATE → VALIDATED      [all 5 checks pass]
CANDIDATE → VALIDATION_FAILED  [any check fails]
VALIDATED → PROMOTED       [promote invoked]
PROMOTED → ROLLED_BACK     [rollback invoked]
```

Terminal states: `REJECTED`, `VALIDATION_FAILED`, `PROMOTED`, `ROLLED_BACK`.

---

## CLI Commands (5)

```bash
# Generate candidate
agent skill-gen generate --from-pattern "pattern-name"
agent skill-gen generate --from-lesson LEARN-001

# Validate & promote
agent skill-gen validate <skill-id>
agent skill-gen promote <skill-id>
agent skill-gen rollback <skill-id>

# List skills
agent skill-gen list                     # All
agent skill-gen list --status candidate  # Pending
agent skill-gen list --status approved   # In registry
```

---

## Validation Checks (5 — Fixed)

| Check | Criteria |
|-------|----------|
| Interface | Input/Output defined, testable |
| Naming | kebab-case, valid ID |
| Idempotency | Reproducible output |
| Side-effects | No destructive operations |
| Guide compliance | Valid frontmatter, < 200 lines |

---

## Rejection Rules (3 — Fixed)

Pattern rejected if:
- Occurrence count < 3
- Pattern only in failure path
- Pattern only from hotfix/user correction

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_BELOW_THRESHOLD` | Yes | Pattern < 3 occurrences |
| `ERR_INVALID_SOURCE` | Yes | Source pattern/lesson not found |
| `ERR_SKILL_NOT_FOUND` | Yes | Skill ID not in registry |
| `ERR_ALREADY_PROMOTED` | No | Skill already approved |
| `ERR_VALIDATION_FAILED` | Yes | One or more checks failed |
| `ERR_REGISTRY_WRITE` | Yes | Registry file write failed |

**Retry:** 1 retry for registry writes (promote/rollback). Zero retries for all other operations.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Generate from single occurrence | Wait for ≥ 3 occurrences |
| Promote without validation | Run all 5 checks first |
| Skip human review | Review candidate before promote |
| Delete rolled-back skills | Archive for future reference |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [scripts/](scripts/) | CLI (generate.js, dashboard-server.js) | Running commands |
| [lib/](lib/) | Core logic (analyzer, validator, template) | Implementation |
| [tests/](tests/) | Golden tests | Validation |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `problem-checker` | Skill | Error detection |
| `code-constitution` | Skill | Code standards |
| `/autopilot` | Workflow | Auto execution |

---

⚡ PikaKit v3.9.71
