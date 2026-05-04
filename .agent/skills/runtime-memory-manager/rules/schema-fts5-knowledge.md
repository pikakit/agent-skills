---
title: FTS5 Knowledge Search Index Schema
impact: CRITICAL
impactDescription: Defines the derived search index schema — read-only cache, NOT a source of truth
tags: FTS5, SQLite, search, schema, BM25
---

# ⚡ FTS5 Knowledge Search Index

**Impact: CRITICAL — defines the boundary between derived search cache and source-of-truth markdown.**

> Derived search cache using SQLite FTS5 — adapted for PikaKit's markdown-first architecture.

---

## Architectural Position

```
knowledge/**/*.md  →  [Indexer]  →  memory.sqlite (knowledge_fts)  →  [Search]  →  Ranked results
   (TRUTH)              ↑               (CACHE)                         ↑
                   Rebuild anytime                                Prefix rewriting
```

**This index is a DERIVED CACHE.** Delete it and `pikakit doctor` rebuilds from markdown. The `knowledge/` directory is the sole source of truth (ADR-002).

---

## Schema

### Table: `knowledge_fts` (FTS5 Virtual Table)

```sql
CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(
  file_path UNINDEXED,
  title,
  tags,
  body,
  tokenize = 'unicode61 remove_diacritics 2',
  prefix = '2 3 4'
);
```

**Column weights for BM25 ranking:**
- `title` — 10x weight (highest signal)
- `tags` — 5x weight
- `body` — 1x weight (baseline)

BM25 query: `SELECT file_path, title, snippet(knowledge_fts, 3, '<b>', '</b>', '…', 32) AS snippet, bm25(knowledge_fts, 0.0, 10.0, 5.0, 1.0) AS score FROM knowledge_fts WHERE knowledge_fts MATCH ? ORDER BY score LIMIT 5`

### Table: `knowledge_watermark` (Change Tracking)

```sql
CREATE TABLE IF NOT EXISTS knowledge_watermark (
  file_path  TEXT PRIMARY KEY,
  mtime_ms   INTEGER NOT NULL,
  content_hash TEXT NOT NULL
);
```

Used for incremental indexing — only re-index files whose `mtime` or content hash changed.

---

## Anti-Corruption Rules

| ✅ Allowed | ❌ Forbidden |
|-----------|-------------|
| Read `knowledge_fts` for search results | Write to `knowledge_fts` from agent code |
| Rebuild `knowledge_fts` from markdown files | Use `knowledge_fts` as the canonical store |
| Query `knowledge_watermark` for staleness checks | Modify markdown based on FTS5 data |
| Delete and recreate both tables for full rebuild | Treat FTS5 results as authoritative over markdown |

---

## Correct Usage

**Incorrect (what's wrong):**
```typescript
// Treating FTS5 as the source of truth
const article = db.prepare('SELECT body FROM knowledge_fts WHERE file_path = ?').get(path);
fs.writeFileSync(outputPath, article.body); // WRONG: FTS5 body may be stale
```

**Correct (what's right):**
```typescript
// FTS5 for discovery, markdown for reading
const results = db.prepare('SELECT file_path FROM knowledge_fts WHERE knowledge_fts MATCH ?').all(query);
const content = fs.readFileSync(results[0].file_path, 'utf-8'); // RIGHT: read the actual file
```

---

⚡ PikaKit v3.9.169
