# Skill Generator — Engineering Specification

> Production-grade specification for autonomous skill generation at FAANG scale.

---

## 1. Overview

Skill Generator converts high-confidence patterns into validated, production-ready skills. It operates as an **Orchestrator** with a 6-stage pipeline: Pattern Analysis → Context Validation → Candidate Generation → Validation → Promotion → Registry. The skill has side effects: it creates SKILL.md files, registers skills, and modifies the skill registry. It provides CLI commands for generation (`--from-pattern`, `--from-lesson`), validation, promotion, rollback, and listing. Generated skills must satisfy 5 validator checks (interface, naming, idempotency, side-effects, SKILL_DESIGN_GUIDE compliance). Skills are rejected if pattern occurrence count < 3, pattern is only in failure path, or pattern is only from hotfix.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

Skill creation at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Manual skill creation | 100% of skills are hand-authored | Slow skill evolution |
| No pattern detection | 0% of recurring fixes become skills | Lost institutional knowledge |
| No validation gate | 35% of manually created skills have incomplete frontmatter | Inconsistent quality |
| No rollback mechanism | 0% of skill promotions are reversible | Risk of breaking changes |

Skill Generator eliminates these with automated pattern analysis (≥ 3 occurrence threshold), 5-check validation gate, deterministic promotion pipeline, and rollback support.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Pattern → skill conversion | ≥ 80% of generated skills pass validation |
| G2 | Occurrence threshold | ≥ 3 occurrences required |
| G3 | Validation coverage | 5 checks (interface, naming, idempotency, side-effects, guide) |
| G4 | Pipeline stages | 6 stages: analyze → validate context → generate → validate → promote → register |
| G5 | Rollback support | Every promotion is reversible |
| G6 | Skill design guide compliance | < 200 lines, valid frontmatter, kebab-case naming |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Error detection in code | Owned by `problem-checker` skill |
| NG2 | Code standards enforcement | Owned by `code-constitution` skill |
| NG3 | Skill execution | Generated skills execute independently |
| NG4 | Pattern detection from code | Owned by `auto-learned` skill |
| NG5 | Skill marketplace | External distribution concern |
| NG6 | Natural language skill authoring | Manual creation process |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Pattern analysis | Occurrence counting, confidence scoring | Pattern detection (→ auto-learned) |
| Skill generation | SKILL.md creation from template | Skill content authoring |
| Validation | 5-check gate | Runtime testing |
| Promotion | Registry insertion | Skill deployment |
| Rollback | Registry removal + archive | Git operations |

**Side-effect boundary:** Skill Generator creates files (SKILL.md), modifies the skill registry, and can rollback promotions. All mutations are logged.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "generate" | "validate" | "promote" | "rollback" | "list"
Context: {
  source: string | null       # "pattern" | "lesson"
  source_id: string | null    # Pattern name or lesson ID (e.g., "LEARN-001")
  skill_id: string | null     # Skill ID for validate/promote/rollback
  status_filter: string | null  # "candidate" | "approved" | "rejected" | null (for list)
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  generated: {
    skill_id: string
    skill_path: string        # Path to generated SKILL.md
    source: string
    status: string            # "candidate"
  } | null
  validation: {
    skill_id: string
    passed: boolean
    checks: Array<{
      name: string            # "interface" | "naming" | "idempotency" | "side-effects" | "guide"
      passed: boolean
      message: string | null
    }>
  } | null
  promotion: {
    skill_id: string
    status: string            # "approved" | "rolled-back"
    registry_path: string | null
  } | null
  list: Array<{
    skill_id: string
    status: string
    source: string
    created_at: string
  }> | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Pattern with < 3 occurrences → rejected (no skill generated).
- Pattern only in failure path → rejected.
- Pattern only from hotfix/user correction → rejected.
- Same pattern input = same candidate SKILL.md structure.
- Validation checks are fixed: 5 checks, deterministic pass/fail.
- Promotion is reversible via rollback.

#### What Agents May Assume

- Pattern/lesson input is pre-validated by source skill.
- Auto-learned patterns include occurrence count.
- Skill registry is accessible and writable.
- Generated skills follow skill-design-guide.md structure.

#### What Agents Must NOT Assume

- Generated skill will pass all validation checks.
- Promoted skill will work correctly at runtime.
- Rollback erases all effects (registry only, not runtime).
- Pattern text contains complete implementation.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Generate | Creates SKILL.md file in candidate directory |
| Validate | None; read-only checks |
| Promote | Writes to skill registry, moves from candidate to approved |
| Rollback | Removes from registry, archives to rolled-back |
| List | None; read-only query |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify patterns with ≥ 3 occurrences (auto-learned provides data)
2. Invoke generate with pattern or lesson source
3. Review generated SKILL.md (human checkpoint)
4. Invoke validate to run 5-check gate
5. If all checks pass: invoke promote
6. If issues found: fix and re-validate, or rollback
```

#### Execution Guarantees

- Generation produces a complete SKILL.md or returns an error.
- Validation runs all 5 checks (no partial validation).
- Promotion is atomic (registered or not).
- Rollback restores pre-promotion state.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Pattern below threshold | Return error | Accumulate more occurrences |
| Validation failure | Return check results | Fix and re-validate |
| Promotion failure | Return error | Retry or rollback |
| Invalid skill ID | Return error | Specify valid ID |

#### Retry Boundaries

- Generate: zero retries (deterministic).
- Validate: zero retries (deterministic).
- Promote: 1 retry on registry write failure.
- Rollback: 1 retry on registry write failure.

#### Isolation Model

- Each invocation operates on a single skill ID.
- No cross-skill mutations during any operation.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Generate | Yes | Same pattern → same candidate structure |
| Validate | Yes | Same skill → same check results |
| Promote | No | First call moves to registry; second call errors (already promoted) |
| Rollback | No | First call removes; second call errors (not in registry) |
| List | Yes | Read-only query |

---

## 7. Execution Model

### 6-Stage Pipeline

```
INIT → ANALYZING [pattern received]
ANALYZING → REJECTED [occurrence < 3 OR failure-only OR hotfix-only]  // terminal state
ANALYZING → GENERATING [context valid]
GENERATING → CANDIDATE [SKILL.md created]
CANDIDATE → VALIDATING [validate invoked]
VALIDATING → VALIDATION_FAILED [any check fails]  // terminal state (fixable)
VALIDATING → VALIDATED [all 5 checks pass]
VALIDATED → PROMOTED [promote invoked]  // terminal state
PROMOTED → ROLLED_BACK [rollback invoked]  // terminal state
```

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Occurrence threshold | ≥ 3 occurrences required; < 3 → reject |
| Rejection rules | Failure-path-only → reject; Hotfix-only → reject |
| Validation checks | 5 fixed checks: interface (I/O defined), naming (kebab-case), idempotency (reproducible), side-effects (no destructive ops), guide (frontmatter + < 200 lines) |
| Skill contract | 4 properties: deterministic, reusable, measurable, registrable |
| CLI commands | generate (--from-pattern, --from-lesson), validate, promote, rollback, list (--status) |
| Naming convention | kebab-case, valid ID characters only |

---

## 9. State & Idempotency Model

### State Machine

```
INIT → ANALYZING → GENERATING → CANDIDATE → VALIDATING → VALIDATED → PROMOTED
                                                           ↓
                                                    VALIDATION_FAILED
PROMOTED → ROLLED_BACK
ANALYZING → REJECTED
```

Terminal states: `REJECTED`, `VALIDATION_FAILED`, `PROMOTED`, `ROLLED_BACK`.

### Persistence

- Candidate skills stored in `.agent/skills/<skill-id>/` directory.
- Registry state stored in skill registry file.
- Pipeline state is transient (not persisted across sessions).

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Insufficient occurrences | Return `ERR_BELOW_THRESHOLD` | Wait for more occurrences |
| Invalid pattern source | Return `ERR_INVALID_SOURCE` | Provide valid pattern |
| Validation failure | Return check details | Fix and re-validate |
| Registry write failure | Retry once, then error | Manual registry update |
| Skill not found | Return `ERR_SKILL_NOT_FOUND` | Specify valid skill ID |

**Invariant:** No partial mutations. Generate is atomic (full SKILL.md or nothing). Promote is atomic (registered or not).

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_BELOW_THRESHOLD` | Validation | Yes | Pattern occurrence < 3 |
| `ERR_INVALID_SOURCE` | Validation | Yes | Source pattern/lesson not found |
| `ERR_SKILL_NOT_FOUND` | Validation | Yes | Skill ID not in registry |
| `ERR_ALREADY_PROMOTED` | State | No | Skill already in approved state |
| `ERR_VALIDATION_FAILED` | Gate | Yes | One or more checks failed |
| `ERR_REGISTRY_WRITE` | Infrastructure | Yes | Registry file write failed |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Pattern analysis | 5 seconds | 10 seconds | Pattern file reads |
| Skill generation | 5 seconds | 10 seconds | Template expansion + file write |
| Validation | 3 seconds | 5 seconds | 5 checks read-only |
| Promotion | 2 seconds | 5 seconds | Registry write |
| Rollback | 2 seconds | 5 seconds | Registry write |
| Promote retry | 1 | 1 | On registry write failure only |
| Rollback retry | 1 | 1 | On registry write failure only |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "skill-generator",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "skill_id": "string|null",
  "source": "string|null",
  "pipeline_stage": "string",
  "validation_checks_passed": "number|null",
  "validation_checks_total": "number|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Pattern analyzed | INFO | source, occurrence_count |
| Candidate generated | INFO | skill_id, skill_path |
| Validation complete | INFO | skill_id, checks_passed, checks_total |
| Skill promoted | INFO | skill_id, registry_path |
| Skill rolled back | WARN | skill_id |
| Pattern rejected | INFO | source, rejection_reason |
| Pipeline failed | ERROR | error_code, pipeline_stage |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `skillgen.pipeline.duration` | Histogram | ms |
| `skillgen.generation.count` | Counter | per source type |
| `skillgen.validation.pass_rate` | Gauge | percentage |
| `skillgen.promotion.count` | Counter | total |
| `skillgen.rollback.count` | Counter | total |
| `skillgen.rejection.count` | Counter | per reason |

---

## 14. Security & Trust Model

### Data Handling

- Skill Generator reads pattern files and lesson YAML.
- Generated SKILL.md files are plain text (Markdown + YAML frontmatter).
- No credentials, no PII, no network calls.
- Registry modifications are file-system-local.

### Authorization

- Only authorized agents may invoke generate and promote.
- Rollback requires same authorization level as promote.
- List and validate are read-only (no authorization required).

### File System Safety

- Generate writes only to `.agent/skills/<id>/SKILL.md`.
- Promote modifies only the skill registry file.
- Rollback archives to `.agent/skills/<id>/.rolled-back/`.
- No destructive file operations (delete requires explicit rollback).

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | I/O-bound (file reads/writes) | < 10s per pipeline |
| Concurrent generations | 1 at a time (sequential) | Pipeline queue |
| Registry size | Max 200 skills | Pagination for list |
| Pattern files | Max 1,000 patterns | Index by occurrence count |
| Memory per invocation | < 10 MB | Template-based generation |

---

## 16. Concurrency Model

Sequential pipeline execution. One skill generation at a time.

**Locking:** Registry file is locked during promote and rollback to prevent concurrent mutations.

**Parallel operations:** List and validate are read-only and can run in parallel with each other (but not with promote/rollback).

---

## 17. Resource Lifecycle Management

| Resource | Creation | Destruction | Owner |
|----------|----------|-------------|-------|
| Candidate SKILL.md | Generate command | Promotion (moved) or rejection (archived) | skill-generator |
| Registry entry | Promote command | Rollback command | skill-generator |
| Rolled-back archive | Rollback command | Manual cleanup only | user |

**Cleanup policy:** Rejected candidates archived after 30 days. Rolled-back skills archived indefinitely.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Pattern analysis | < 500 ms | < 2 s | 10 s |
| Skill generation | < 1 s | < 3 s | 10 s |
| Validation (5 checks) | < 500 ms | < 2 s | 5 s |
| Promotion | < 200 ms | < 1 s | 5 s |
| Rollback | < 200 ms | < 1 s | 5 s |
| List | < 100 ms | < 500 ms | 2 s |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Registry corruption | Low | Broken skill loading | File-level backup before write |
| Generated skill has bugs | Medium | Runtime errors in promoted skill | 5-check validation gate |
| Rapid pattern changes | Medium | Stale generated skills | Re-validate before promote |
| Disk space from candidates | Low | Storage exhaustion | 30-day archive cleanup |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Pattern or lesson source required |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Orchestrator type: pipeline, side effects, rollback |
| Troubleshooting section | ✅ | Anti-pattern rules / rejection criteria |
| Related section | ✅ | Cross-links to problem-checker, code-constitution, /autopilot |
| Content Map for multi-file | ✅ | Links to scripts/, lib/, tests/, engineering-spec.md |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 6-stage pipeline (analyze→validate→generate→validate→promote→register) | ✅ |
| **Functionality** | 5 CLI commands (generate/validate/promote/rollback/list) | ✅ |
| **Functionality** | 5 validation checks | ✅ |
| **Functionality** | ≥ 3 occurrence threshold | ✅ |
| **Functionality** | 3 rejection rules | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 7 categorized codes | ✅ |
| **Failure** | Retry policy (1 retry for registry writes) | ✅ |
| **State** | Pipeline state machine with terminal states | ✅ |
| **State** | Resource lifecycle (candidate, registry, archive) | ✅ |
| **Security** | Authorization for generate/promote, file-system-only scope | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 6 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Concurrency** | Sequential pipeline, registry locking | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.85
