---
name: knowledge-compiler
description: >-
  Unified knowledge engine: captures patterns from errors/corrections,
  compiles raw signals into cross-linked wiki articles, generates fast-lookup
  patterns, and maintains indexes. Replaces knowledge-compiler + knowledge-compiler.
  Use when "compile knowledge", "update wiki", "ingest lesson", or when user
  indicates mistake ("wrong", "fix this", "broken").
  NOT for skill generation (use skill-generator) or wiki health (use knowledge-linter).
category: autonomous-learning
triggers: ["compile", "knowledge", "wiki", "ingest", "mistake", "wrong", "fix-this", "broken"]
coordinates_with: ["skill-generator", "knowledge-linter", "problem-checker"]
success_metrics: ["Signal Compilation Rate", "Article Cross-Link Density", "Pattern Match Rate"]
metadata:
  author: pikakit
  version: "3.9.141"
---

# Knowledge Compiler — Unified Knowledge Engine

> Captures → Compiles → Indexes → Queries. One skill for all knowledge operations.

---

## Prerequisites

**Required:** `.agent/knowledge/` directory with `_index.md`, `raw/`, `concepts/`, `patterns/`, `decisions/`.
**Created by:** PikaKit installer (`npx pikakit@latest`).

---

## When to Use

| Situation | Operation | Approach |
|-----------|-----------|----------|
| After fixing a significant bug | **Ingest** | Record signal in `raw/` |
| User says "wrong" or "fix this" | **Learn** | Extract pattern + record signal |
| IDE error detected and fixed | **Learn** | Auto-capture pattern via problem-checker |
| Uncompiled signals in `raw/` | **Compile** | Synthesize into `concepts/` articles |
| Before writing code that may cause known errors | **Lookup** | Check `patterns/{category}-patterns.md` |
| Agent needs project-specific knowledge | **Query** | Read `_index.md` → find relevant article |
| Updating wiki after code changes | **Reindex** | Regenerate `_index.md` and `_graph.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Signal ingestion (raw/ writes) | Error detection (→ problem-checker) |
| Pattern extraction + storage (patterns/) | Skill generation (→ skill-generator) |
| Article compilation (concepts/ writes) | Wiki health checks (→ knowledge-linter) |
| Index maintenance (_index.md, _graph.md) | |
| ADR creation (decisions/ writes) | |
| Cross-link management | |
| Fast-lookup pattern cache (patterns/) | |

---

## Operations (6)

### 1. Ingest — Record a Raw Signal

**When:** After every significant fix, user correction, or architectural decision.
**Auto-trigger:** Multi-file changes, user says "wrong", explicit `/knowledge ingest`.

```
1. Classify signal type: error_fix | correction | decision | observation
2. Extract: what happened, context, resolution, lesson
3. Write to .agent/knowledge/raw/{date}-{slug}.md
4. Update _index.md "Uncompiled signals" count
5. Output: 📥 Signal recorded: {slug}
```

**Signal Schema:**

```markdown
---
type: error_fix
date: 2026-04-11
compiled: false
tags: [cdp, process-management, windows]
---

## Signal
Antigravity restart failed because spawn child is killed when parent dies.

## Context
cdp.js restart logic using direct child_process.spawn().

## Resolution
Used .bat + .vbs launcher pattern for fully detached restart.

## Lesson
On Windows, child processes die with parent. Use intermediate .bat/.vbs for detached launch.
```

### 2. Learn — Extract Pattern from Error/Correction

**When:** User indicates mistake, or IDE error is detected and fixed.
**Trigger words:** "mistake", "wrong", "fix this", "broken"

```
1. DETECT  → Error or user correction detected
2. FILTER  → Apply Quality Gate (reject noise)
3. ANALYZE → Extract root cause
4. ENRICH  → Capture EXACT fix (before/after, import path)
5. STORE   → Write to knowledge/patterns/{category}-patterns.md
6. INGEST  → Also record as signal in knowledge/raw/
7. CONFIRM → Output: 📚 Learned: [LEARN-XXX]
```

**⛔ Quality Gate — MANDATORY Before Recording:**

| Reject If | Reason |
|-----------|--------|
| Error is a local variable out of scope | Not an import issue — refactoring artifact |
| Solution is "Add import for X" with no path | Zero actionable value |
| Error occurred during active refactoring | Temporary state, will resolve itself |
| Pattern has < 3 occurrences across sessions | Noise, not a pattern |
| Error is project-specific, not generalizable | Won't help other projects |

| Accept If | Required Fields |
|-----------|----------------|
| Error recurs across files/sessions | error_signature + solution + import_path |
| Solution includes exact fix | Before/after code |
| Pattern is framework-generalizable | context.framework + context.file_type |

**Category IDs:**

| Category | ID Pattern |
|----------|------------|
| Safety | `SAFE-XXX` |
| Code | `CODE-XXX` |
| Workflow | `FLOW-XXX` |
| Integration | `INT-XXX` |

### 3. Lookup — Check Known Patterns Before Coding

**When:** Before writing code, running commands, or fixing errors.
**Protocol (MANDATORY — see autopilot.md § 0.5-K):**

```
BEFORE executing command or writing code:
1. Check if knowledge/patterns/ exists
2. Scan relevant {category}-patterns.md for matching context
3. If match found → Apply the solution, do NOT repeat the mistake
4. If no match → Proceed normally
```

**Pattern Categories:**

| Category | File | ID Prefix |
|----------|------|-----------|
| `import` | `patterns/import-patterns.md` | IMP- |
| `type` | `patterns/type-patterns.md` | TYP- |
| `syntax` | `patterns/syntax-patterns.md` | SYN- |
| `logic` | `patterns/logic-patterns.md` | LOG- |
| `style` | `patterns/style-patterns.md` | STY- |
| `shell` | `patterns/shell-syntax-patterns.md` | SHL- |
| `typescript` | `patterns/typescript-patterns.md` | TS- |

### 4. Compile — Synthesize Signals into Articles

**When:** Raw signals exist with `compiled: false`. Max 10 signals per batch.

```
1. SCAN    → Read _index.md for current wiki state
2. DIFF    → Find signals where compiled: false (max 10)
3. CLUSTER → Group related signals by tags/domain
4. DECIDE  → For each cluster:
             a. Existing concept covers this? → UPDATE article (add insights)
             b. New topic? → CREATE concept article
             c. Architectural decision? → CREATE ADR in decisions/
5. LINK    → Add [[backlinks]] between related articles
6. MARK    → Set compiled: true on processed signals
7. INDEX   → Regenerate _index.md and _graph.md
8. OUTPUT  → 📚 Compiled: {N} signals → {M} articles updated/created
```

### 5. Query — Ask the Wiki

**When:** Agent needs project-specific knowledge before coding.

```
1. Read _index.md for article summaries
2. Identify relevant concept articles by topic match
3. Read full article(s)
4. Synthesize answer with citations: "According to [[concept-name]]..."
5. If no match → answer from general knowledge, suggest ingesting signal
```

### 6. Reindex — Regenerate Index Files

**When:** After manual article edits or periodic maintenance.

```
1. Scan all .md files in concepts/, patterns/, and decisions/
2. Extract frontmatter (title, tags, related, signal_count)
3. Rebuild _index.md with article list + statistics
4. Rebuild _graph.md Mermaid diagram from `related:` fields
5. Output: 🔄 Reindexed: {N} articles, {M} relationships
```

---

## Concept Article Template

```markdown
---
title: {Concept Name}
created: {ISO date}
updated: {ISO date}
tags: [{domain tags}]
related: [{other-concept-filename}]
confidence: high|medium|low
signal_count: {N}
---

# {Concept Name}

## Summary
{1-2 paragraph synthesis of all signals on this topic}

## Key Insights
- {Insight with evidence from signal}

## Gotchas & Pitfalls
- {Known pitfall + solution}

## Related
- [[other-concept]] — {relationship description}

## Sources
- raw/{signal-filename} — {brief description}
```

---

## ADR Template

```markdown
---
title: ADR-{NNN}: {Decision Title}
status: accepted|proposed|deprecated
date: {ISO date}
tags: [{domain tags}]
---

# ADR-{NNN}: {Decision Title}

## Context
{Why this decision was needed}

## Options Considered
1. {Option A} — Pros: ... / Cons: ...
2. {Option B} — Pros: ... / Cons: ...

## Decision
{Selected option with rationale}

## Consequences
{Impact of this decision}

## Sources
- raw/{signal-filename}
```

---

## Batch Limits

| Parameter | Value | Rationale |
|-----------|-------|-----------|
| Max signals per compile | 10 | Token budget control |
| Max article size | 200 lines | Readability + context window |
| Max related links per article | 10 | Avoid noise |
| Signal retention | Indefinite | Append-only; deletion requires approval |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_NO_KNOWLEDGE_DIR` | Yes | `.agent/knowledge/` missing → create it |
| `ERR_INDEX_CORRUPTED` | Yes | `_index.md` malformed → reindex |
| `ERR_SIGNAL_INVALID` | No | Signal missing required frontmatter fields |
| `ERR_COMPILE_BATCH_EXCEEDED` | Yes | >10 signals → split into batches |
| `ERR_ARTICLE_CONFLICT` | Yes | Two signals suggest contradicting insights → flag |
| `ERR_INVALID_CATEGORY` | No | Pattern category not recognized |
| `ERR_INVALID_PATTERN` | No | Pattern missing required fields (solution, before/after) |

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Record every typo fix as signal | Only ingest significant/multi-file fixes |
| Record "Add import for X" without path | Record exact `import { X } from 'path'` |
| Compile without reading existing articles | Always read _index.md + related articles first |
| Create one article per signal | Cluster related signals into unified articles |
| Apply low-confidence patterns blindly | Verify pattern context matches current context |
| Ignore uncompiled signal count | Compile when count > 5 |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-linter` | Skill | Wiki health checks |
| `skill-generator` | Skill | Generates skills from mature knowledge |
| `problem-checker` | Skill | Detects IDE errors for pattern extraction |
| `/knowledge` | Workflow | CLI interface for all operations |

---

⚡ PikaKit v3.9.141
