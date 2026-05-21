---
title: "ADR-003: The Epistemic Clustering Membrane"
status: accepted
date: 2026-04-14
tags: [architecture, clustering, knowledge-synthesis, learning-engine, memory-sqlite]
---

# ADR-003: The Epistemic Clustering Membrane

## Context
PikaKit's transition from a logging system to a "True Learning Engine" required introducing an intermediate layer to prevent knowledge degradation (Wiki Bloat) caused by injecting raw runtime signals directly into the semantic knowledge wiki. 

## Decision
We introduce the **Epistemic Clustering Membrane** as the sole bridging mechanism between `memory.sqlite` (Execution Layer) and `.agent/knowledge/` (Semantic Layer). This membrane operates under the following refined principles:

1. **Lossy Compression with Semantic Retention:** Raw signals must be grouped by Cosine Similarity using `@xenova/transformers`. Random noise is discarded.
2. **Dynamic Thresholding:** Clusters are promoted using a dual-weighted equation ensuring **Bounded Influence**:
   > `final_score = (embedding_similarity * 0.7) + (knowledge_prior * 0.3)`
   This balances Data-driven reality (70%) with Knowledge-guided experience (30%), preventing the LLM from completely overwriting the clustering matrix.
3. **Database Intermediate Layer Schema:** The PikaKit v3.9.195x execution database (`memory.sqlite`) officially adapts the 4-tier learning pipeline:
   - `signals` (raw input stream)
   - `patterns` (clustering and threshold evaluation layer)
   - `lessons` (final knowledge, metadata mapped to `.md` files)
   - `embeddings` (the raw vector engine cache)

### Proposed `patterns` Schema
```sql
CREATE TABLE patterns (
  id TEXT PRIMARY KEY,
  centroid_vector BLOB,         -- average concept vector
  signal_count INTEGER,         -- signal count mass
  confidence_score REAL,        -- the dynamic final_score
  first_seen_at DATETIME,
  last_seen_at DATETIME,
  decay_weight REAL,            -- time decay influence tracker
  status TEXT,                  -- 'candidate' | 'promoted' | 'discarded'
  dominant_error_pattern TEXT,  -- normalized error string
  language TEXT                 -- scope (js, ts, python, etc)
);
```

### Advanced System Governance

4. **Pattern Evolution Tracking:** Implement a robust history using `pattern_versions` to monitor Concept Drift over extensive execution contexts.
5. **Failed Knowledge System:** The introduction of `pattern_feedback` allows the overarching AI to learn from incorrect clustering promotions (AI learning from its own mistakes).
6. **"Do Not Learn" Guardrails:** Typos, transient network glitches, and user-specific configurations are forcefully excluded from vector clustering.

## Consequences
- Prevents structural degradation of the Knowledge Wiki (Over/Under-clustering and Explosion).
- Solidifies PikaKit as an autonomous Intelligence Accumulator rather than a static AI Assistant.
- Defines the exact v4.x migration path for `memory.sqlite`.

## Sources
- Architectural Concept: True Learning Engine (April 2026 Audit)
- PikaKit OS FAANG-Level System Design Reviews.
