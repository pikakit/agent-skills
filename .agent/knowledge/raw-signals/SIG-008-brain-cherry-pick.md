---
type: decision
date: 2026-05-04
compiled: false
tags: [architecture, FTS5, secret-prefilter, knowledge-system]
---

## Signal
Added two hardening techniques to PikaKit's knowledge system: (1) Secret Prefilter — 12 regex patterns to block API keys/tokens from knowledge signals, and (2) FTS5 Search Index — SQLite FTS5 virtual table in memory.sqlite as a derived BM25-ranked search cache over knowledge markdown files.

## Context
As the knowledge wiki grows, the existing `_index.md` browse-only retrieval doesn't scale. Additionally, there was no automated safeguard preventing accidental secret leakage into git-tracked knowledge files.

## Resolution
Created 7 new files across knowledge-compiler (secret prefilter rule + scanner script) and runtime-memory-manager (FTS5 schema rule + indexer + search scripts). Added ADR-004 to document the FTS5 decision. Updated CLI with `pikakit search` command and enhanced `pikakit doctor` with secret scanning and FTS5 health checks.

## Lesson
Regex-based secret scanning at the knowledge ingestion boundary catches secrets before they reach git. FTS5 with BM25-weighted columns (title:10x, tags:5x, body:1x) provides sufficient retrieval quality for keyword-based lookup without requiring embedding models. Prefix query rewriting (`fast` → `fast*`) significantly improves agent search precision.
