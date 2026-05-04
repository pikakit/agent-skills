# 🧠 Runtime Memory Manager

**Version 1.1.0**
Engineering
April 2026

> **Note:**
> This document is for agents and LLMs to follow when interacting with the `.agent/memory.sqlite` execution layer.

---

## Abstract

This skill defines the PikaKit Anti-Corruption Layer (ACL) regarding system telemetry and runtimes. `memory.sqlite` is heavily restricted to acting as a binary cache for the VS Code extension runtime. It explicitly maps IDE errors, fix templates, and telemetry signals. It is completely isolated from the human-readable Markdown `knowledge/` store.

---

## Table of Contents

1. [Architecture](#1-architecture) — **CRITICAL**
   - 1.1 [Strict System Separation](#11-strict-system-separation)
2. [Schema](#2-schema) — **CRITICAL**
   - 2.1 [Fix Learning Infrastructure](#21-fix-learning-infrastructure)

---

## 1. Architecture

**Impact: CRITICAL**

### 1.1 Strict System Separation (Anti-Corruption Layer)

**Impact: CRITICAL (prevents architectural drift and hallucinations)**

The system must obey a strict boundary between the Execution Layer (`memory.sqlite`) and the Semantic Layer (`knowledge/`). You must ensure a single-direction data flow.

**Incorrect (what's wrong):**
```typescript
// Breaking the semantic boundary by injecting knowledge into the runtime DB
async function updateRAG() {
  const markdownFiles = readDir('.agent/knowledge');
  const vectors = embedMarkdown(markdownFiles);
  db.prepare('INSERT INTO memories (doc) VALUES (?)').run(vectors); // FATAL: treating DB as a generic RAG
}
```

**Correct (what's right):**
```typescript
// Emitting signals upstream, keeping the DB strictly as an execution sink
async function reportError() {
   // Allowed: runtime -> emit signal -> knowledge compiler
   db.prepare('INSERT INTO signals (content, source) VALUES (?, ?)').run(errorLog, 'ide_linter');
}
```

---

## 2. Schema

**Impact: CRITICAL**

### 2.1 Fix Learning Infrastructure

**Impact: CRITICAL (prevents hallucinated tables)**

Do not invent or assume abstract tables. Interact strictly within the verified bounds of the PikaKit auto-fix schema.

**Incorrect (what's wrong):**
```typescript
// Assuming a generic state memory table
db.prepare('INSERT INTO scratchpad (task_id, data) VALUES (?, ?)').run(...);
```

**Correct (what's right):**
```typescript
// Using the genuine schema designed for error pattern matching
db.prepare(`
   INSERT INTO lessons (id, error_pattern, fix_patch, language) 
   VALUES (?, ?, ?, ?)
`).run(lessonId, "TypeError: undefined is not an object", "+ if(obj) {", "javascript");
```

---

## 3. FTS5 Knowledge Search Index

**Impact: CRITICAL (derived cache — NOT a source of truth)**

The `knowledge_fts` virtual table provides sub-millisecond BM25-ranked search over the `knowledge/**/*.md` markdown files. It is a **derived, read-only cache**.

### Tables

| Table | Purpose | Rebuild |
|-------|---------|---------|
| `knowledge_fts` | FTS5 virtual table with weighted columns (title:10x, tags:5x, body:1x) | Delete → `knowledge-indexer.js --rebuild` |
| `knowledge_watermark` | Tracks file mtime and content hash for incremental indexing | Delete → full re-index on next run |

### Scripts

| Script | Purpose | Usage |
|--------|---------|-------|
| `scripts/knowledge-indexer.js` | Index markdown → FTS5 | `node knowledge-indexer.js [--rebuild]` |
| `scripts/knowledge-search.js` | Search FTS5 with prefix rewriting | `node knowledge-search.js "query"` |

### Anti-Corruption Layer (FTS5-specific)

**Incorrect (what's wrong):**
```typescript
// Treating FTS5 body as the canonical article content
const article = db.prepare('SELECT body FROM knowledge_fts WHERE file_path = ?').get(path);
return article.body; // WRONG: FTS5 body may be stale
```

**Correct (what's right):**
```typescript
// FTS5 for discovery, markdown for reading
const hits = db.prepare('SELECT file_path FROM knowledge_fts WHERE knowledge_fts MATCH ?').all(query);
const content = fs.readFileSync(hits[0].file_path, 'utf-8'); // RIGHT: read the source of truth
```
