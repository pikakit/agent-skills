---
"title": "Backend Patterns: Anti-Patterns"
"kind": "reference"
"impact": "high"
"tags":
  - "backend-patterns-anti-patterns"
"applies_to":
  - "web"
  - "node"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://web.dev/articles/vitals"
    "title": "Official documentation"
---

# Backend Patterns: Anti-Patterns

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

> Database and caching optimization patterns for backend performance. **Profile first, optimize second.**

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `SELECT *` in production | Select only needed columns |
| Query inside loops | Batch or eager load |
| Cache without TTL | Always set expiry |
| Infinite cache size | Set maxmemory + eviction policy |
| Skip connection pooling | Always pool in production |
| Offset paginate large datasets | Use cursor pagination |
| Ignore slow query logs | Monitor and index |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
