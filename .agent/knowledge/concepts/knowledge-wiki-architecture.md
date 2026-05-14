---
title: Knowledge Wiki Architecture (Karpathy Model)
created: 2026-04-13
updated: 2026-04-13
tags: [knowledge-wiki, architecture, karpathy, llm-knowledge-base]
related: [ADR-002-memory-sqlite-separation]
confidence: high
signal_count: 1
---

# Knowledge Wiki Architecture (Karpathy Model)

## Summary
The PikaKit agent ecosystem implements a Markdown-based knowledge base inspired by Andrej Karpathy's LLM wiki architecture. Raw observations (signals) are ingested, then compiled by an LLM into cross-linked concept articles, providing the agent with historical context, architectural decisions, and error patterns.

## Key Insights
- The pipeline architecture (`raw/` → `knowledge-compiler` → `concepts/` → `_index.md`) is robust and achieves ~90% alignment with Karpathy's design.
- A well-designed architecture still requires volume. The system must be actively populated with real signals from everyday coding sessions.

## Gotchas & Pitfalls
- **Stale Indexes:** Simply creating a `concepts/*.md` file isn't enough. The `_index.md` and `_graph.md` must be regenerated (reindexed) so the LLM discovers the new topics.
  - **Solution:** The `/knowledge compile` workflow includes an automated reindexing step.
- **`raw/` vs `raw-signals/` Ambiguity:** Avoid having multiple directories for ingest. Consolidation reduces agent confusion.

## Related
- [[ADR-002-memory-sqlite-separation]] — Discusses the boundary between the Markdown wiki and binary runtime caches.

## Sources
- raw/SIG-004.md — Knowledge Wiki Architecture Audit
