---
name: knowledge-compiler
description: >-
  Compile raw signals (errors, corrections, decisions) into a cross-linked
  knowledge wiki with concept articles, ADRs, and auto-maintained indexes.
  Use when "compile knowledge", "update wiki", "ingest lesson", or after
  significant multi-file fixes. NOT for pattern matching (use auto-learned)
  or skill generation (use skill-generator).
category: autonomous-learning
triggers: ["compile", "knowledge", "wiki", "ingest", "lessons", "tribal knowledge"]
coordinates_with: ["auto-learner", "auto-learned", "skill-generator", "knowledge-linter"]
success_metrics: ["Signal Compilation Rate", "Article Cross-Link Density", "Knowledge Reuse Rate"]
metadata:
  author: pikakit
  version: "1.0.0"
---

# Knowledge Compiler — LLM-Maintained Knowledge Wiki

> Raw signals compound into cross-linked articles. Agent reads before coding. Knowledge never lost.

---

## Prerequisites

**Required:** `.agent/knowledge/` directory with `_index.md`, `raw/`, `concepts/`, `decisions/`.
**Created by:** PikaKit installer (`npx pikakit@latest`).

---

## When to Use

| Situation | Operation | Approach |
|-----------|-----------|----------|
| After fixing a significant bug | **Ingest** | Record signal in `raw/` |
| After user corrects agent | **Ingest** | Record correction signal |
| After making architectural decision | **Ingest** | Record decision signal |
| Uncompiled signals in `raw/` | **Compile** | Synthesize into `concepts/` articles |
| Agent needs project-specific knowledge | **Query** | Read `_index.md` → find relevant article |
| Updating wiki after code changes | **Reindex** | Regenerate `_index.md` and `_graph.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Signal ingestion (raw/ writes) | Error detection (→ problem-checker) |
| Article compilation (concepts/ writes) | Pattern extraction (→ auto-learner) |
| Index maintenance (_index.md, _graph.md) | Skill generation (→ skill-generator) |
| ADR creation (decisions/ writes) | Wiki health checks (→ knowledge-linter) |
| Cross-link management | Pattern storage (→ auto-learned) |

---

## Operations (4)

### 1. Ingest — Record a Raw Signal

**When:** After every significant fix, user correction, or architectural decision.
**Auto-trigger:** Multi-file changes, user says "sai"/"wrong", explicit `/knowledge ingest`.

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

### 2. Compile — Synthesize Signals into Articles

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

### 3. Query — Ask the Wiki

**When:** Agent needs project-specific knowledge before coding.

```
1. Read _index.md for article summaries
2. Identify relevant concept articles by topic match
3. Read full article(s)
4. Synthesize answer with citations: "According to [[concept-name]]..."
5. If no match → answer from general knowledge, suggest ingesting signal
```

### 4. Reindex — Regenerate Index Files

**When:** After manual article edits or periodic maintenance.

```
1. Scan all .md files in concepts/ and decisions/
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

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Record every typo fix as signal | Only ingest significant/multi-file fixes |
| Compile without reading existing articles | Always read _index.md + related articles first |
| Create one article per signal | Cluster related signals into unified articles |
| Edit concept articles manually | Let the compiler maintain articles |
| Ignore uncompiled signal count | Compile when count > 5 |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `knowledge-linter` | Skill | Wiki health checks |
| `auto-learner` | Skill | Pattern extraction (feeds signals) |
| `auto-learned` | Skill | Pattern storage (reads from wiki) |
| `skill-generator` | Skill | Generates skills from mature knowledge |
| `/knowledge` | Workflow | CLI interface for all operations |

---

⚡ PikaKit v3.9.125
