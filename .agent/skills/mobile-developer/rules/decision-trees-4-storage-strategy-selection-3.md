---
"title": "Decision Trees: Storage Strategy Selection through 5. Offline Strategy Selection"
"kind": "decision"
"impact": "high"
"tags":
  - "decision"
  - "trees"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Android Data Storage"
    "url": "https://developer.android.com/training/data-storage"
---

# Decision Trees: Storage Strategy Selection through 5. Offline Strategy Selection

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 4. Storage Strategy Selection

```
WHAT TYPE OF DATA?
        │
        ├── Sensitive (tokens, passwords, keys)
        │   │
        │   └── ✅ Secure Storage
        │       ├── iOS: Keychain
        │       ├── Android: EncryptedSharedPreferences
        │       └── RN: expo-secure-store / react-native-keychain
        │
        ├── User preferences (settings, theme)
        │   │
        │   └── ✅ Key-Value Storage
        │       ├── iOS: UserDefaults
        │       ├── Android: SharedPreferences
        │       └── RN: AsyncStorage / MMKV
        │
        ├── Structured data (entities, relationships)
        │   │
        │   └── ✅ Database
        │       ├── SQLite (expo-sqlite, sqflite)
        │       ├── WatermelonDB (large datasets, RN)
        │       ├── Drift (SQLite wrapper, Flutter)
        │       └── ~~Realm~~ (❌ deprecated for new projects, consider alternatives)
        │
        ├── Large files (images, documents)
        │   │
        │   └── ✅ File System
        │       ├── iOS: Documents / Caches directory
        │       ├── Android: Internal/External storage
        │       └── RN: react-native-fs / expo-file-system
        │
        └── Cached API data
            │
            └── ✅ Query Library Cache
                ├── TanStack Query (RN)
                ├── Riverpod async (Flutter)
                └── Automatic invalidation
```

### Storage Comparison

| Storage | Speed | Security | Capacity | Use Case |
|---------|-------|----------|----------|----------|
| Secure Storage | Medium | 🔒 High | Small | Tokens, secrets |
| Key-Value | Fast | Low | Medium | Settings |
| SQLite | Fast | Low | Large | Structured data |
| File System | Medium | Low | Very Large | Media, documents |
| Query Cache | Fast | Low | Medium | API responses |

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 5. Offline Strategy Selection

```
HOW CRITICAL IS OFFLINE?
        │
        ├── Nice to have (works when possible)
        │   │
        │   └── Cache last data + show stale
        │       ├── Simple implementation
        │       ├── TanStack Query with staleTime
        │       └── Show "last updated" timestamp
        │
        ├── Essential (core functionality offline)
        │   │
        │   └── Offline-first architecture
        │       ├── Local database as source of truth
        │       ├── Sync to server when online
        │       ├── Conflict resolution strategy
        │       └── Queue actions for later sync
        │
        └── Real-time critical (collaboration, chat)
            │
            └── WebSocket + local queue
                ├── Optimistic updates
                ├── Eventual consistency
                └── Complex conflict handling
```

### Offline Implementation Patterns

```
1. CACHE-FIRST (Simple)
   Request → Check cache → If stale, fetch → Update cache
   
2. STALE-WHILE-REVALIDATE
   Request → Return cached → Fetch update → Update UI
   
3. OFFLINE-FIRST (Complex)
   Action → Write to local DB → Queue sync → Sync when online
   
4. SYNC ENGINE
   Use: Firebase, Realm Sync, Supabase realtime
   Handles conflict resolution automatically
```

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
