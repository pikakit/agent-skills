---
name: auto-learned
description: >-
  Repository of auto-learned patterns from past errors organized by category.
  Use before writing code or running commands to check for known mistake patterns.
  NOT for learning new patterns (use auto-learner) or debugging (use debug-pro).
category: autonomous-learning
triggers: ["auto-learn", "pattern", "learned", "error fix"]
coordinates_with: ["problem-checker", "auto-learner", "skill-generator"]
success_metrics: ["Pattern Ingestion Rate", "Duplicate Prevention Accuracy", "Pattern Match Rate"]
metadata:
  author: pikakit
  version: "3.9.123"
---

# Auto-Learned — Pattern Repository

> Living repository of patterns learned from IDE errors. Append-only. Agents read to prevent; agents write to record.

---

## 5 Must-Ask Questions (Socratic Gate)

| # | Question | Options |
|---|----------|---------|
| 1 | Pattern Category? | Import / Type / Syntax / Logic / Style |
| 2 | Error Signature? | Exact Match / Regex Match |
| 3 | Confidence Level? | High / Medium / Low |
| 4 | Current Context? | React / Node / Next.js / Static |
| 5 | Proposed Solution? | Clear Fix / Workaround |

---

## Prerequisites

**Required:** None — patterns are stored as local markdown and JSON files.

**Write access:** Restricted to authorized agents: `problem-checker`, `auto-learner`, `skill-generator`.

---

## When to Use

| Situation | Operation | Approach |
|-----------|-----------|----------|
| Before writing code that may cause known errors | **Lookup** | Query matching category for preventive patterns |
| IDE error detected and fix applied | **Ingest** | Record pattern via authorized agent pipeline |
| Reviewing learned patterns | **Lookup** | Read category files directly |
| Checking pattern coverage | **Lookup** | Read patterns.json for statistics |

**Selective Reading Rule:** Query ONLY the category matching the current error type.

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Pattern storage (categorized markdown) | Error detection (→ problem-checker) |
| Pattern lookup by category + context | Pattern extraction (→ auto-learner) |
| JSON index maintenance (patterns.json) | Skill generation from patterns (→ skill-generator) |
| Deduplication on ingest | Dashboard rendering (→ external tooling) |

**Writable skill:** Authorized agents write patterns into `patterns/*.md` and update `patterns.json`. The skill is read-only when consulted by other agents.

---

## Execution Model

### Lookup (Read) — 3 Phases

| Phase | Action | Side Effects |
|-------|--------|-------------|
| **Parse** | Validate category and context | None |
| **Search** | Read category file(s), match error signature | None |
| **Emit** | Return matches sorted by occurrence count | None |

### Ingest (Write) — 4 Phases

| Phase | Action | Side Effects |
|-------|--------|-------------|
| **Authorize** | Verify calling agent is in authorized list | None |
| **Validate** | Check category, deduplicate by error_signature | None |
| **Write** | Append pattern to `patterns/{category}-patterns.md`, update JSON | File writes |
| **Confirm** | Return pattern_id and updated stats | None |

All phases synchronous. Append-only writes. Deduplication returns `duplicate: true` without mutation.

---

## Pattern Categories

| Category | File | Description | ID Prefix |
|----------|------|-------------|-----------|
| `import` | `patterns/import-patterns.md` | Missing imports, module resolution | IMP- |
| `type` | `patterns/type-patterns.md` | Type mismatches, property errors | TYP- |
| `syntax` | `patterns/syntax-patterns.md` | Syntax errors, parsing issues | SYN- |
| `logic` | `patterns/logic-patterns.md` | Logical errors, undefined values | LOG- |
| `style` | `patterns/style-patterns.md` | Code style, formatting | STY- |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_CATEGORY` | No | Category not one of: import, type, syntax, logic, style |
| `ERR_CATEGORY_NOT_FOUND` | Yes | Category markdown file missing from patterns/ |
| `ERR_INDEX_CORRUPTED` | Yes | patterns.json invalid; regenerate from markdown |
| `ERR_UNAUTHORIZED` | No | Calling agent not in authorized list |
| `ERR_WRITE_FAILED` | Yes | File write operation failed |
| `ERR_INVALID_PATTERN` | No | Pattern missing required fields |
| `ERR_CONFIG_INVALID` | Yes | config.json is invalid or missing |

**Zero internal retries.** Callers own retry logic.

---

## Agent Pipeline

| Phase | Agent | Action |
|-------|-------|--------|
| **Detection** | `problem-checker` | Detects IDE errors and linting issues |
| **Learning** | `auto-learner` | Extracts error signature and fix into structured pattern |
| **Storage** | `skill-generator` | Ingests pattern into this skill |
| **Prevention** | Any agent | Looks up patterns before code modification |

---

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `pattern_lookup_executed` | `{"category": "type", "matches_found": 2}` | `INFO` |
| `pattern_ingested_successfully` | `{"pattern_id": "TYP-005", "confidence": "high"}` | `INFO` |
| `duplicate_pattern_rejected` | `{"category": "import", "error_signature": "React not defined"}` | `WARN` |

All auto-learned outputs MUST emit `pattern_lookup_executed`, `pattern_ingested_successfully`, or `duplicate_pattern_rejected` events when applicable.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [patterns/import-patterns.md](patterns/import-patterns.md) | Import resolution patterns | Import errors |
| [patterns/type-patterns.md](patterns/type-patterns.md) | Type mismatch patterns | Type errors |
| [patterns/syntax-patterns.md](patterns/syntax-patterns.md) | Syntax/parsing patterns | Syntax errors |
| [patterns/logic-patterns.md](patterns/logic-patterns.md) | Logic error patterns | Logic errors |
| [patterns/style-patterns.md](patterns/style-patterns.md) | Code style patterns | Style issues |
| [patterns.json](patterns.json) | JSON index of all patterns | Dashboard, statistics |
| [config.json](config.json) | Auto-learn configuration | Settings review |
| [engineering-spec.md](rules/engineering-spec.md) | Full engineering spec: contracts, security, scalability | Architecture review |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Ignore pattern matches before coding | Always check relevant category before writing code |
| Apply low-confidence patterns blindly | Verify solution in pattern context matches current context |
| Write patterns from unauthorized agents | Only use problem-checker → auto-learner → skill-generator pipeline |
| Edit patterns.json directly | Let ingest update JSON automatically |
| Delete patterns without user approval | Patterns are append-only; deletion requires explicit approval |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `problem-checker` | Skill | Detects IDE errors for pattern extraction |
| `skill-generator` | Skill | Generates/updates patterns in this skill |
| `auto-learner` | Agent | Extracts patterns from errors and fixes |

---

⚡ PikaKit v3.9.123
