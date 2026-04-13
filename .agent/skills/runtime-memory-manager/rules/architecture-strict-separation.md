---
title: Strict System Separation
impact: CRITICAL
impactDescription: prevents architectural drift and hallucinations
tags: ACL, strict-separation, domains
---

## Strict System Separation (Anti-Corruption Layer)

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
