---
name: auto-learned
description: >-
  Hierarchical skill containing all auto-learned patterns from IDE errors and code analysis.
  Organizes patterns by category (import, type, syntax, etc.) with subskills in patterns/
  folder. Writable by authorized agents only. Triggers on: auto-learn, pattern, learned, error
  fix.
metadata:
  author: pikakit
  version: "3.9.107"
---

# Auto-Learned â€” Pattern Repository

> Living repository of patterns learned from IDE errors. Append-only. Agents read to prevent; agents write to record.

---

## Prerequisites

**Required:** None â€” patterns are stored as local markdown and JSON files.

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
| Pattern storage (categorized markdown) | Error detection (â†’ problem-checker) |
| Pattern lookup by category + context | Pattern extraction (â†’ auto-learner) |
| JSON index maintenance (patterns.json) | Skill generation from patterns (â†’ skill-generator) |
| Deduplication on ingest | Dashboard rendering (â†’ external tooling) |

**Writable skill:** Authorized agents write patterns into `patterns/*.md` and update `patterns.json`. The skill is read-only when consulted by other agents.

---

## Execution Model

### Lookup (Read) â€” 3 Phases

| Phase | Action | Side Effects |
|-------|--------|-------------|
| **Parse** | Validate category and context | None |
| **Search** | Read category file(s), match error signature | None |
| **Emit** | Return matches sorted by occurrence count | None |

### Ingest (Write) â€” 4 Phases

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

## ðŸ“‘ Content Map

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

| âŒ Don't | âœ… Do |
|---------|-------|
| Ignore pattern matches before coding | Always check relevant category before writing code |
| Apply low-confidence patterns blindly | Verify solution in pattern context matches current context |
| Write patterns from unauthorized agents | Only use problem-checker â†’ auto-learner â†’ skill-generator pipeline |
| Edit patterns.json directly | Let ingest update JSON automatically |
| Delete patterns without user approval | Patterns are append-only; deletion requires explicit approval |

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `problem-checker` | Skill | Detects IDE errors for pattern extraction |
| `skill-generator` | Skill | Generates/updates patterns in this skill |
| `auto-learner` | Agent | Extracts patterns from errors and fixes |

---

âš¡ PikaKit v3.9.107
