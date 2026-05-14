---
title: "ADR-004: FTS5 Search Index for Knowledge System"
status: accepted
date: 2026-05-04
tags: [FTS5, SQLite, search, BM25, knowledge-system, architecture]
---

# ADR-004: FTS5 Search Index for Knowledge System

## Context

PikaKit's knowledge system stores articles as markdown files in `.agent/knowledge/`. Retrieval relies on the LLM reading `_index.md` and manually selecting articles — a process that scales poorly as the wiki grows and provides no ranking.

SQLite FTS5 with BM25 ranking provides sub-millisecond, quality retrieval for <100,000 articles without requiring embeddings or model dependencies.

## Options Considered

1. **Embedding-based search (cosine similarity):** Already partially implemented via `memory.sqlite` embeddings table and `@xenova/transformers`. Accurate but slow, model-dependent, and overkill for the current scale (<100 articles).
2. **FTS5 with BM25 ranking:** SQLite built-in full-text search with weighted columns. Fast, zero model dependency, prefix matching, and sufficient retrieval quality for keyword-based lookup at current scale.
3. **Keep `_index.md` browse-only:** Zero effort but doesn't scale. No ranking, no prefix matching, no structured search.

## Decision

We chose **FTS5 with BM25 ranking** as a derived search index inside `memory.sqlite`.

Key design decisions:
- **Derived, not authoritative:** The FTS5 index is a cache rebuilt from markdown. Delete `knowledge_fts` table → `pikakit doctor` rebuilds it.
- **Three weighted columns:** `title` (10x), `tags` (5x), `body` (1x) — matching proven BM25 weighting for document retrieval.
- **Prefix query rewriting:** Bare queries like `fast` become `fast*`, enabling prefix matching without user knowledge of FTS5 syntax.
- **Incremental updates:** `knowledge_watermark` table tracks file mtimes and content hashes to avoid re-indexing unchanged files.

This decision respects:
- **ADR-002:** `memory.sqlite` remains the execution layer (machine-readable cache). `knowledge/` remains the semantic layer (human-readable truth).
- **ADR-003:** FTS5 does not replace the Epistemic Clustering Membrane. Clustering = learning pipeline. FTS5 = retrieval acceleration. Orthogonal concerns.

## Consequences

- Knowledge retrieval becomes sub-millisecond ranked search instead of LLM-driven browsing.
- `pikakit search <query>` CLI command enables human knowledge lookup.
- VS Code extension can query FTS5 for context-aware suggestions.
- `better-sqlite3` becomes a runtime dependency (already used by `pattern-clustering.ts`).
