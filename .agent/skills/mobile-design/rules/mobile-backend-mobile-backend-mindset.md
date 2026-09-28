---
"title": "Mobile Backend: MOBILE BACKEND MINDSET through AI MOBILE BACKEND ANTI-PATTERNS"
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

# Mobile Backend: MOBILE BACKEND MINDSET through AI MOBILE BACKEND ANTI-PATTERNS

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🧠 MOBILE BACKEND MINDSET

```
Mobile clients are DIFFERENT from web clients:
├── Unreliable network (2G, subway, elevator)
├── Battery constraints (minimize wake-ups)
├── Limited storage (can't cache everything)
├── Interrupted sessions (calls, notifications)
├── Diverse devices (old phones to flagships)
└── Binary updates are slow (App Store review)
```

**Your backend must compensate for ALL of these.**

---

> **This file covers backend/API patterns SPECIFIC to mobile clients.**
> Generic backend patterns are in `nodejs-best-practices` and `api-patterns`.
> **Mobile backend is NOT the same as web backend. Different constraints, different patterns.**

---

## 🚫 AI MOBILE BACKEND ANTI-PATTERNS

### These are common AI mistakes when building mobile backends:

| ❌ AI Default | Why It's Wrong | ✅ Mobile-Correct |
|---------------|----------------|-------------------|
| Same API for web and mobile | Mobile needs compact responses | Separate mobile endpoints OR field selection |
| Full object responses | Wastes bandwidth, battery | Partial responses, pagination |
| No offline consideration | App crashes without network | Offline-first design, sync queues |
| WebSocket for everything | Battery drain | Push notifications + polling fallback |
| No app versioning | Can't force updates, breaking changes | Version headers, minimum version check |
| Generic error messages | Users can't fix issues | Mobile-specific error codes + recovery actions |
| Session-based auth | Mobile apps restart | Token-based with refresh |
| Ignore device info | Can't debug issues | Device ID, app version in headers |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
