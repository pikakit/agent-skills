---
title: "ADR-002: Separation of memory.sqlite and Knowledge Wiki"
status: accepted
date: 2026-04-13
tags: [memory-sqlite, wasm, embedding, architecture, separation-of-concerns]
---

# ADR-002: Separation of memory.sqlite and Knowledge Wiki

## Context
The `.agent` directory contains both the `knowledge/` folder (Markdown files) and a `memory.sqlite` file. We needed to clarify the role of `memory.sqlite` and whether it should be treated as part of the formal knowledge compilation pipeline.

## Options Considered
1. **Merge concerns:** Treat `memory.sqlite` as the primary index or database tracking all wiki entries.
2. **Strict separation:** Define `memory.sqlite` strictly as a runtime cache, completely uncoupled from the knowledge wiki content generation.

## Decision
We chose **Strict separation**. 
The `knowledge/` directory is purely Markdown-based. It is designed to be human-readable, easily navigable in an IDE or Obsidian, and serves as text context for the LLM. 
The `memory.sqlite` file is specifically a vector cache for the Local WASM Embedding Engine (`@xenova/transformers`) used by the PikaKit Engine VS Code extension. It is a machine-only binary file.

## Consequences
- The knowledge wiki remains 100% text/markdown, allowing easy version control and auditability.
- The `knowledge-compiler` skill does not need to interact with or write to `memory.sqlite`.
- Both artifacts rightly reside under `.agent/`, but serve distinctly different consumers.

## Sources
- raw/SIG-005.md
