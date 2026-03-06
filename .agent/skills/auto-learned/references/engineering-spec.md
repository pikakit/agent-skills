# Auto-Learned — Engineering Specification

> Production-grade specification for the hierarchical auto-learned pattern repository at FAANG scale.

---

## 1. Overview

Auto-Learned is a hierarchical skill that serves as the living repository for all patterns automatically learned from IDE errors, code analysis, and agent corrections. Unlike static knowledge skills, Auto-Learned is a **writable** skill — other agents (`problem-checker`, `auto-learner`, `skill-generator`) write patterns into it during normal operation.

The skill organizes patterns by category (import, type, syntax, logic, style) with subskill files in the `patterns/` directory. It also maintains structured data files (`patterns.json`, `config.json`) for dashboard consumption and configuration.

---

## 2. Problem Statement

Agent-based development systems face four quantified problems with repeated errors:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Repeated identical errors | Same import/type error recurs 3–5 times per session | 40–60% wasted fix cycles |
| No institutional memory | Fixes are session-local; lost after conversation ends | Zero learning accumulation |
| Pattern fragmentation | Error fixes scattered across conversations | No queryable knowledge base |
| No error prevention | Agents react to errors instead of preventing them | Higher iteration count per task |

Auto-Learned eliminates these by providing a persistent, categorized, queryable pattern repository that agents consult before making errors.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Zero repeated errors | Once a pattern is recorded, the same error class is prevented in future sessions |
| G2 | Category-organized patterns | Every pattern is assigned to exactly one category file |
| G3 | Machine-readable + human-readable | Both markdown (patterns/*.md) and JSON (patterns.json) representations maintained |
| G4 | Append-only growth | New patterns are added; existing patterns are never deleted without explicit user approval |
| G5 | Sub-50ms lookup | Pattern consultation adds < 50ms to agent decision time |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Error detection | Owned by `problem-checker` skill |
| NG2 | Pattern extraction from errors | Owned by `auto-learner` agent |
| NG3 | Skill generation from patterns | Owned by `skill-generator` skill |
| NG4 | Pattern quality evaluation | Patterns are accepted as-is from trusted agents |
| NG5 | Cross-project pattern sharing | Patterns are workspace-scoped |
| NG6 | Pattern versioning / rollback | Patterns are append-only; removal requires user approval |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Pattern storage | Categorized markdown files + JSON index | Error detection (→ problem-checker) |
| Pattern lookup | Category-based file reading | Pattern extraction logic (→ auto-learner) |
| Pattern indexing | patterns.json maintenance | Dashboard rendering (→ external tooling) |
| Configuration | config.json for auto-learn settings | Extension settings (→ PikaKit extension) |
| Category management | Category file creation/maintenance | Skill generation from patterns (→ skill-generator) |

**Side-effect boundary:** Auto-Learned is a **writable** skill. External agents write new patterns into `patterns/*.md` and update `patterns.json`. The skill itself (when consulted) is read-only. Write operations are always initiated by authorized agents, never by the skill itself.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Read Contract (Pattern Lookup)

##### Input Schema

```
Operation: "lookup"
Category: string | null    # "import" | "type" | "syntax" | "logic" | "style" | null (all)
Context: {
  error_message: string | null  # IDE error text to match against
  file_type: string | null      # ".ts" | ".tsx" | ".js" | ".py" | etc.
  framework: string | null      # "react" | "nextjs" | "express" | etc.
}
contract_version: string   # "2.0.0"
```

##### Output Schema

```
Status: "success" | "error"
Data: {
  matches: Array<{
    id: string              # Pattern ID (e.g., "IMP-001")
    category: string        # Pattern category
    error_signature: string # Error message pattern
    solution: string        # Fix description
    confidence: string      # "high" | "medium" | "low"
    occurrences: number     # Times this pattern has been recorded
    source_file: string     # Path to category file
  }>
  total_patterns: number
  categories_searched: Array<string>
  metadata: {
    version: string
    last_updated: string    # ISO-8601
    contract_version: string    # "2.0.0"
    backward_compatibility: string  # "breaking"
  }
}
Error: ErrorSchema | null
```

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

#### Write Contract (Pattern Ingestion)

##### Input Schema

```
Operation: "ingest"
Authorized_Agent: string   # Must be one of: "problem-checker" | "auto-learner" | "skill-generator"
Pattern: {
  category: string          # "import" | "type" | "syntax" | "logic" | "style"
  error_signature: string   # Error message pattern (regex or literal)
  solution: string          # Fix description
  confidence: string        # "high" | "medium" | "low"
  context: {
    file_type: string
    framework: string | null
    example_error: string   # Concrete error example
    example_fix: string     # Concrete fix applied
  }
}
contract_version: string   # "2.0.0"
```

##### Output Schema (Write)

```
Status: "success" | "error"
Data: {
  pattern_id: string        # Assigned ID (e.g., "IMP-005")
  category_file: string     # File the pattern was written to
  total_patterns: number    # Category total after ingestion
  duplicate: boolean        # Whether pattern already existed (merged, not duplicated)
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string          # From Error Taxonomy (Section 11)
Message: string       # Human-readable, single line
Operation: string     # "lookup" | "ingest"
Recoverable: boolean
```

#### Deterministic Guarantees

- **Lookup:** Same `Category` + `Context` = same `matches` if underlying pattern files have not changed.
- **Ingest:** Same `Pattern` ingested twice = second call returns `duplicate: true`, no data mutation.
- Pattern IDs are assigned sequentially per category (IMP-001, IMP-002, ...).
- Category assignment is deterministic: one pattern belongs to exactly one category.

#### What Agents May Assume

- Pattern files exist in `patterns/` for all defined categories.
- `patterns.json` is a valid JSON index of all patterns.
- Lookup returns all matching patterns ordered by occurrence count (descending).
- Ingested patterns persist across sessions and conversations.

#### What Agents Must NOT Assume

- Patterns are 100% accurate (they are learned heuristically; confidence field indicates reliability).
- Patterns cover all possible errors (coverage grows over time).
- Pattern solutions apply universally (context fields constrain applicability).
- Write operations can be performed by any agent (only authorized agents may ingest).

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Lookup | None; read-only file access |
| Ingest | **Writes** to `patterns/{category}-patterns.md` |
| Ingest | **Updates** `patterns.json` index |
| Ingest | **Updates** statistics in SKILL.md (pattern counts) |

### 6.2 Workflow Contract

#### Invocation Pattern (Lookup)

```
1. Agent encounters error or pre-checks before code modification
2. Query auto-learned with category + context
3. Receive matching patterns
4. Apply matching solution if confidence sufficient
5. If no match: proceed with standard fix; pattern may be ingested later
```

#### Invocation Pattern (Ingest)

```
1. problem-checker detects IDE error
2. auto-learner extracts pattern from error + fix
3. skill-generator calls ingest with categorized pattern
4. Auto-learned validates and stores pattern
5. Pattern available for future lookups
```

#### Execution Guarantees

- Lookup is synchronous and read-only.
- Ingest is synchronous and atomic per pattern (one write per call).
- No background processes, no deferred writes.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Category file missing | Return error to caller | Create category file or verify installation |
| patterns.json corrupted | Return error to caller | Regenerate from markdown files |
| Duplicate pattern | Return success with `duplicate: true` | No action needed |
| Unauthorized agent | Return error to caller | Only authorized agents may ingest |
| Invalid category | Return error to caller | Use supported category |

#### Retry Boundaries

- Lookup: zero retries (read-only; same result on retry).
- Ingest: zero retries (atomic write; caller retries if needed).
- File corruption: zero retries; return error with regeneration guidance.

#### Isolation Model

- Lookups are fully isolated; no state mutation.
- Ingestions are serialized per category file (one write at a time per file).
- No cross-category locking.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Lookup | Yes | Read-only; same query = same result (if files unchanged) |
| Ingest (new pattern) | No | Adds new pattern; changes file state |
| Ingest (duplicate pattern) | Yes | Returns `duplicate: true`; no file mutation |

---

## 7. Execution Model

### Lookup: 3-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate category and context | Validated input or error |
| **Search** | Read category file(s), match error_signature | Matching patterns |
| **Emit** | Return matches sorted by occurrence count | Complete output schema |

### Ingest: 4-Phase Lifecycle

| Phase | Action | Side Effects |
|-------|--------|-------------|
| **Authorize** | Verify calling agent is authorized | None |
| **Validate** | Check category, deduplicate | None |
| **Write** | Append pattern to category file, update JSON | File writes |
| **Confirm** | Return pattern_id and updated stats | None |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Sequential IDs | Pattern IDs assigned in order per category; no gaps |
| Fixed categories | 5 categories: import, type, syntax, logic, style |
| Append-only writes | New patterns appended; existing patterns never modified by ingest |
| Deduplication by signature | Identical `error_signature` = duplicate; merged occurrence count |
| Sorted output | Lookup results sorted by occurrence count descending |

---

## 9. State & Idempotency Model

### State Machine

```
States: IDLE, READING, WRITING
Transitions:
  IDLE    → READING  (lookup invoked)
  IDLE    → WRITING  (ingest invoked)
  READING → IDLE     (results returned)
  WRITING → IDLE     (write confirmed)
```

### Persistent State

Auto-Learned maintains persistent state across sessions:
- `patterns/*.md` — categorized pattern files (authoritative source)
- `patterns.json` — JSON index (derived from markdown files)
- `config.json` — configuration (auto-learn enabled, categories, thresholds)

`patterns.json` is a derived artifact. If corrupted, it can be regenerated from `patterns/*.md`.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Recovery |
|---------------|----------|----------|
| Category file missing | Return `ERR_CATEGORY_NOT_FOUND` | Create file or verify installation |
| patterns.json corrupted | Return `ERR_INDEX_CORRUPTED` | Regenerate from patterns/*.md |
| Unauthorized agent | Return `ERR_UNAUTHORIZED` | Only authorized agents may write |
| Invalid category | Return `ERR_INVALID_CATEGORY` | Use: import, type, syntax, logic, style |
| Write failure (disk) | Return `ERR_WRITE_FAILED` | Retry from caller; file state unchanged |
| Duplicate pattern | Return success with `duplicate: true` | No action needed |
| No matches found | Return success with empty `matches` array | Normal operation |

**Invariant:** Every failure returns a structured error. Lookup never fails silently. Write failures leave file in previous consistent state.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_CATEGORY` | Validation | No | Category not one of: import, type, syntax, logic, style |
| `ERR_CATEGORY_NOT_FOUND` | Infrastructure | Yes | Category markdown file missing from patterns/ |
| `ERR_INDEX_CORRUPTED` | Infrastructure | Yes | patterns.json is invalid JSON or inconsistent with markdown |
| `ERR_UNAUTHORIZED` | Authorization | No | Calling agent not in authorized list |
| `ERR_WRITE_FAILED` | IO | Yes | File write operation failed |
| `ERR_INVALID_PATTERN` | Validation | No | Pattern missing required fields |
| `ERR_CONFIG_INVALID` | Infrastructure | Yes | config.json is invalid or missing |

---

## 12. Timeout & Retry Policy

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Lookup timeout | N/A | File read; < 50ms for all categories |
| Ingest timeout | 5,000 ms | Single file write; fail if disk is unresponsive |
| Internal retries | Zero | Callers own retry logic |
| Index regeneration | 10,000 ms | Full scan of patterns/*.md |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "auto-learned",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "operation": "lookup|ingest",
  "category": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "matches_found": "number",
  "pattern_id": "string|null",
  "duplicate": "boolean|null",
  "agent": "string",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Lookup executed | INFO | category, matches_found, duration_ms |
| Pattern ingested | INFO | pattern_id, category, confidence |
| Duplicate detected | DEBUG | error_signature, existing pattern_id |
| Unauthorized write attempt | WARN | agent name, operation |
| Write failed | ERROR | error_code, category, message |
| Index regenerated | WARN | trigger reason, patterns_recovered |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `autolearn.lookup.duration` | Histogram | ms |
| `autolearn.lookup.matches` | Histogram | count |
| `autolearn.ingest.count` | Counter | per category |
| `autolearn.ingest.duplicate_rate` | Counter | duplicates/total |
| `autolearn.category.size` | Gauge | patterns per category |
| `autolearn.total.patterns` | Gauge | total count |

---

## 14. Security & Trust Model

### Authorization

- Only three agents may write patterns: `problem-checker`, `auto-learner`, `skill-generator`.
- Unauthorized write attempts return `ERR_UNAUTHORIZED` and are logged at WARN level.
- Read access (lookup) is unrestricted for all agents.

### Pattern Integrity

- Patterns are append-only; no deletion without explicit user approval.
- Pattern content is stored as-is; no code execution from pattern data.
- Error signatures are matched as literal strings or regex; no eval.

### File Integrity

- `patterns/*.md` files are the authoritative source of truth.
- `patterns.json` is a derived index; corruption triggers regeneration, not data loss.
- `config.json` is read-only during operation; changes require manual edit.

### Input Sanitization

- Pattern solutions and error signatures are stored as literal text.
- No template evaluation, no code execution from stored patterns.
- File paths in patterns are relative to workspace root.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Pattern count | Linear growth; ~10–50 patterns per project | Category files remain small (< 10 KB each) |
| Lookup throughput | File read; < 50ms | OS-level file caching |
| Write throughput | Sequential per category | Low write frequency (1–5 per session) |
| Category count | Fixed at 5 | New categories require schema change |
| Storage | < 100 KB total (all files) | Negligible disk footprint |

---

## 16. Concurrency Model

| Scope | Model | Behavior |
|-------|-------|----------|
| Lookup | Fully parallel | Read-only; no contention |
| Ingest | Serialized per category | One write per category file at a time |
| Cross-category ingest | Parallel | Different category files can be written concurrently |
| Lookup during ingest | Safe | Read returns pre-write or post-write state; no partial reads |

**Race condition:** Two concurrent ingests to the same category file. Mitigated by sequential write processing. If both succeed, both patterns are stored.

---

## 17. Resource Lifecycle Management

| Resource | Created By | Destroyed By | Max Lifetime |
|----------|-----------|-------------|--------------|
| Category files (patterns/*.md) | First ingest to category | Never (append-only) | Indefinite |
| patterns.json | First ingest | Regenerated on corruption | Indefinite |
| config.json | Skill installation | Manual edit only | Indefinite |
| Pattern data | Ingest operation | User-approved deletion only | Indefinite |

**Leak prevention:** All files are bounded by category count (5). Growth is linear and slow. No temporary files created.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Single category lookup | < 5 ms | < 20 ms | 50 ms |
| All-category lookup | < 25 ms | < 50 ms | 200 ms |
| Pattern ingest | < 50 ms | < 200 ms | 5,000 ms |
| Index regeneration | < 500 ms | < 2,000 ms | 10,000 ms |
| Pattern file size | ≤ 5 KB | ≤ 10 KB | 50 KB |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Low-quality patterns ingested | Medium | Incorrect fixes suggested | Confidence field; agents apply only high-confidence patterns |
| patterns.json drift from markdown | Low | Lookup returns stale results | Regeneration on detection; JSON is derived, not authoritative |
| Category file grows large | Low | Slower lookups | Monitor file size; split at 50 KB threshold |
| Unauthorized write attempts | Low | Pattern injection | `ERR_UNAUTHORIZED`; logged at WARN |
| Pattern staleness | Medium | Outdated fixes for updated frameworks | Occurrence count tracks relevance; low-occurrence patterns deprioritized |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | No external dependencies |
| When to Use section | ✅ | Lookup/ingest decision matrix |
| Quick Reference | ✅ | Pattern categories table |
| Core content matches skill type | ✅ | Repository type: pattern storage, lookup, ingestion |
| Troubleshooting section | ✅ | Error taxonomy table |
| Related section | ✅ | Cross-links to problem-checker, skill-generator, auto-learner |
| Content Map | ✅ | Links to patterns/, config.json, patterns.json |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 5 pattern categories defined | ✅ |
| **Functionality** | Read (lookup) and write (ingest) contracts defined | ✅ |
| **Functionality** | Dual format: markdown + JSON index | ✅ |
| **Contracts** | Input/output/error schemas for both operations | ✅ |
| **Contracts** | Agent assumptions and non-assumptions documented | ✅ |
| **Contracts** | Workflow invocation patterns for lookup and ingest | ✅ |
| **Failure** | Error taxonomy with 7 categorized error codes | ✅ |
| **Failure** | Append-only writes; no silent data loss | ✅ |
| **Failure** | Index regeneration from authoritative markdown | ✅ |
| **Determinism** | Sequential IDs, deduplication, sorted output | ✅ |
| **Security** | 3-agent authorization list for writes | ✅ |
| **Security** | No code execution from stored patterns | ✅ |
| **Observability** | Structured log schema with 6 log points | ✅ |
| **Observability** | 6 metrics defined with types and units | ✅ |
| **Performance** | P50/P99 targets for lookup and ingest | ✅ |
| **Scalability** | Linear growth bounded by category count | ✅ |
| **Concurrency** | Parallel reads; serialized writes per category | ✅ |
| **Resources** | Append-only files; no temporary resources | ✅ |
| **Idempotency** | Lookups idempotent; duplicate ingests return `duplicate: true` | ✅ |
| **Compliance** | All skill-design-guide.md sections present | ✅ |

---

⚡ PikaKit v3.9.89
