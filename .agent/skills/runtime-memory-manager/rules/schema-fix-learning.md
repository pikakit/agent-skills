---
title: Fix Learning Infrastructure
impact: CRITICAL
impactDescription: prevents hallucinated tables
tags: sqlite, schema, lessons, automated-fixes
---

## Fix Learning Infrastructure

**Impact: CRITICAL (prevents hallucinated tables)**

Do not invent or assume abstract tables. Interact strictly within the verified bounds of the PikaKit auto-fix schema.
Valid physical tables include: `lessons`, `fix_templates`, `signals`, `embeddings(lesson_id, vector)`.

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
