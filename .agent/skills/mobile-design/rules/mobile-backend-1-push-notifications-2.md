---
"title": "Mobile Backend: Push Notifications"
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
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Backend: Push Notifications

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 1. Push Notifications

### Platform Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                    YOUR BACKEND                                  │
├─────────────────────────────────────────────────────────────────┤
│                         │                                        │
│              ┌──────────┴──────────┐                            │
│              ▼                     ▼                            │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │   FCM (Google)  │   │  APNs (Apple)   │                    │
│    │   Firebase      │   │  Direct or FCM  │                    │
│    └────────┬────────┘   └────────┬────────┘                    │
│             │                     │                              │
│             ▼                     ▼                              │
│    ┌─────────────────┐   ┌─────────────────┐                    │
│    │ Android Device  │   │   iOS Device    │                    │
│    └─────────────────┘   └─────────────────┘                    │
└─────────────────────────────────────────────────────────────────┘
```

### Push Types

| Type | Use Case | User Sees |
|------|----------|-----------|
| **Display** | New message, order update | Notification banner |
| **Silent** | Background sync, content update | Nothing (background) |
| **Data** | Custom handling by app | Depends on app logic |

### Anti-Patterns

| ❌ NEVER | ✅ ALWAYS |
|----------|----------|
| Send sensitive data in push | Push says "New message", app fetches content |
| Overload with pushes | Batch, dedupe, respect quiet hours |
| Same message to all | Segment by user preference, timezone |
| Ignore failed tokens | Clean up invalid tokens regularly |
| Skip APNs for iOS | FCM alone doesn't guarantee iOS delivery |

### Token Management

```
TOKEN LIFECYCLE:
├── App registers → Get token → Send to backend
├── Token can change → App must re-register on start
├── Token expires → Clean from database
├── User uninstalls → Token becomes invalid (detect via error)
└── Multiple devices → Store multiple tokens per user
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
