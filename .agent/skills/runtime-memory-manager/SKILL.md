---
name: runtime-memory-manager
description: >-
  Execution layer SQLite memory cache (binary runtime vectors, fix learning).
  Use when agent needs to store execution signals, code-fix templates, and runtime embedding caches.
  NOT for markdown parsing or unified LLM semantic semantic bases (use knowledge-compiler).
metadata:
  author: pikakit
  version: "3.9.147"
  category: core
  triggers: "runtime sqlite, execution layer, cache binary, fix templates, signals, memory.sqlite"
  coordinates_with: ""
---

# 🧠 Runtime Memory Manager

**NON-NEGOTIABLE ARCHITECTURAL LAW: Strict Separation between Runtime DB and Knowledge System.**

## When to Apply

Reference these guidelines when:
- Interacting with `memory.sqlite`
- Caching localized, binary vector embeddings for the extension runtime.
- Storing IDE code diagnostics, error signals, and fix lessons (`fix_templates`, `lessons`).

## System Boundaries (Anti-Corruption Layer)

| Owned by This Skill (Runtime Memory) | NOT Owned (Knowledge Wiki) |
|-------------------------------------|----------------------------|
| `memory.sqlite` (Execution Layer)    | `knowledge/` (Semantic Layer) |
| Binary vector cache & SQL queries    | Human-readable Markdown |
| Code fix-patterns & `signals`        | Domain Concepts, ADRs, Patterns |

**❌ FORBIDDEN ACTIONS:**
- NEVER parse `.md` files to insert them into the Runtime DB.
- NEVER treat `memory.sqlite` as a Knowledge Base.
- NEVER use the `embeddings` table as an LLM RAG store for markdown context.

## Rule Categories by Priority

| Priority | Category         | Impact   | Prefix           |
| -------- | ---------------- | -------- | ---------------- |
| 1        | Architecture     | CRITICAL | `architecture-`  |
| 2        | Schema           | CRITICAL | `schema-`        |

## Quick Reference

### 1. Architecture (CRITICAL)
- `architecture-strict-separation` - The Anti-Corruption Layer rule enforcing isolated domains.

### 2. Schema (CRITICAL)
- `schema-fix-learning` - Interact only with the real tables (`lessons`, `signals`, `fix_templates`).

## How to Use

Read individual rule files for detailed explanations:
```
rules/architecture-strict-separation.md
rules/schema-fix-learning.md
```

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`
