---
"title": "Mobile Backend: Offline Sync & Conflict Resolution through 4. App Versioning"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "backend"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android WorkManager"
    "url": "https://developer.android.com/topic/libraries/architecture/workmanager"
---

# Mobile Backend: Offline Sync & Conflict Resolution through 4. App Versioning

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 2. Offline Sync & Conflict Resolution

### Sync Strategy Selection

```
WHAT TYPE OF DATA?
        │
        ├── Read-only (news, catalog)
        │   └── Simple cache + TTL
        │       └── ETag/Last-Modified for invalidation
        │
        ├── User-owned (notes, todos)
        │   └── Last-write-wins (simple)
        │       └── Or timestamp-based merge
        │
        ├── Collaborative (shared docs)
        │   └── CRDT or OT required
        │       └── Consider Firebase/Supabase
        │
        └── Critical (payments, inventory)
            └── Server is source of truth
                └── Optimistic UI + server confirmation
```

### Conflict Resolution Strategies

| Strategy | How It Works | Best For |
|----------|--------------|----------|
| **Last-write-wins** | Latest timestamp overwrites | Simple data, single user |
| **Server-wins** | Server always authoritative | Critical transactions |
| **Client-wins** | Offline changes prioritized | Offline-heavy apps |
| **Merge** | Combine changes field-by-field | Documents, rich content |
| **CRDT** | Mathematically conflict-free | Real-time collaboration |

### Sync Queue Pattern

```
CLIENT SIDE:
├── User makes change → Write to local DB
├── Add to sync queue → { action, data, timestamp, retries }
├── Network available → Process queue FIFO
├── Success → Remove from queue
├── Failure → Retry with backoff (max 5 retries)
└── Conflict → Apply resolution strategy

SERVER SIDE:
├── Accept change with client timestamp
├── Compare with server version
├── Apply conflict resolution
├── Return merged state
└── Client updates local with server response
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 3. Mobile API Optimization

### Response Size Reduction

| Technique | Savings | Implementation |
|-----------|---------|----------------|
| **Field selection** | 30-70% | `?fields=id,name,thumbnail` |
| **Compression** | 60-80% | gzip/brotli (automatic) |
| **Pagination** | Varies | Cursor-based for mobile |
| **Image variants** | 50-90% | `/image?w=200&q=80` |
| **Delta sync** | 80-95% | Only changed records since timestamp |

### Pagination: Cursor vs Offset

```
OFFSET (Bad for mobile):
├── Page 1: OFFSET 0 LIMIT 20
├── Page 2: OFFSET 20 LIMIT 20
├── Problem: New item added → duplicates!
└── Problem: Large offset = slow query

CURSOR (Good for mobile):
├── First: ?limit=20
├── Next: ?limit=20&after=cursor_abc123
├── Cursor = encoded (id + sort values)
├── No duplicates on data changes
└── Consistent performance
```

### Batch Requests

```
Instead of:
GET /users/1
GET /users/2  
GET /users/3
(3 round trips, 3x latency)

Use:
POST /batch
{ requests: [
    { method: "GET", path: "/users/1" },
    { method: "GET", path: "/users/2" },
    { method: "GET", path: "/users/3" }
]}
(1 round trip)
```

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 4. App Versioning

### Version Check Endpoint

```
GET /api/app-config
Headers:
  X-App-Version: 2.1.0
  X-Platform: ios
  X-Device-ID: abc123

Response:
{
  "minimum_version": "2.0.0",
  "latest_version": "2.3.0",
  "force_update": false,
  "update_url": "https://apps.apple.com/...",
  "feature_flags": {
    "new_player": true,
    "dark_mode": true
  },
  "maintenance": false,
  "maintenance_message": null
}
```

### Version Comparison Logic

```
CLIENT VERSION vs MINIMUM VERSION:
├── client >= minimum → Continue normally
├── client < minimum → Show force update screen
│   └── Block app usage until updated
└── client < latest → Show optional update prompt

FEATURE FLAGS:
├── Enable/disable features without app update
├── A/B testing by version/device
└── Gradual rollout (10% → 50% → 100%)
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
