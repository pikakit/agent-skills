---
"title": "Decision Trees: Authentication Pattern Selection through 8. Decision Checklist"
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
  - "title": "Android User Authentication"
    "url": "https://developer.android.com/privacy-and-security/authenticating"
---

# Decision Trees: Authentication Pattern Selection through 8. Decision Checklist

## Decision

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 6. Authentication Pattern Selection

```
WHAT AUTH TYPE NEEDED?
        │
        ├── Simple email/password
        │   │
        │   └── Token-based (JWT)
        │       ├── Store refresh token securely
        │       ├── Access token in memory
        │       └── Silent refresh flow
        │
        ├── Social login (Google, Apple, etc.)
        │   │
        │   └── OAuth 2.0 + PKCE
        │       ├── Use platform SDKs
        │       ├── Deep link callback
        │       └── Apple Sign-In required for iOS
        │
        ├── Enterprise/SSO
        │   │
        │   └── OIDC / SAML
        │       ├── Web view or system browser
        │       └── Handle redirect properly
        │
        └── Biometric (FaceID, fingerprint)
            │
            └── Local auth + secure token
                ├── Biometrics unlock stored token
                ├── Not a replacement for server auth
                └── Fallback to PIN/password
```

### Auth Token Storage

```
❌ NEVER store tokens in:
├── AsyncStorage (plain text)
├── Redux/state (not persisted correctly)
├── Local storage equivalent
└── Logs or debug output

✅ ALWAYS store tokens in:
├── iOS: Keychain
├── Android: EncryptedSharedPreferences
├── Expo: SecureStore
├── Biometric-protected if available
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 7. Project Type Templates

### E-Commerce App

```
RECOMMENDED STACK:
├── Framework: React Native + Expo (OTA for pricing)
├── Navigation: Tab bar (Home, Search, Cart, Account)
├── State: TanStack Query (products) + Zustand (cart)
├── Storage: SecureStore (auth) + SQLite (cart cache)
├── Offline: Cache products, queue cart actions
└── Auth: Email/password + Social + Apple Pay

KEY DECISIONS:
├── Product images: Lazy load, cache aggressively
├── Cart: Sync across devices via API
├── Checkout: Secure, minimal steps
└── Deep links: Product shares, marketing
```

### Social/Content App

```
RECOMMENDED STACK:
├── Framework: React Native or Flutter
├── Navigation: Tab bar (Feed, Search, Create, Notifications, Profile)
├── State: TanStack Query (feed) + Zustand (UI)
├── Storage: SQLite (feed cache, drafts)
├── Offline: Cache feed, queue posts
└── Auth: Social login primary, Apple required

KEY DECISIONS:
├── Feed: Infinite scroll, memoized items
├── Media: Upload queuing, background upload
├── Push: Deep link to content
└── Real-time: WebSocket for notifications
```

### Productivity/SaaS App

```
RECOMMENDED STACK:
├── Framework: Flutter (consistent UI) or RN
├── Navigation: Drawer or Tab bar
├── State: Riverpod/BLoC or Redux Toolkit
├── Storage: SQLite (offline), SecureStore (auth)
├── Offline: Full offline editing, sync
└── Auth: SSO/OIDC for enterprise

KEY DECISIONS:
├── Data sync: Conflict resolution strategy
├── Collaborative: Real-time or eventual?
├── Files: Large file handling
└── Enterprise: MDM, compliance
```

---

> Framework selection, state management, storage strategy, and context-based decisions.
> **These are THINKING guides, not copy-paste answers.**

---

## 8. Decision Checklist

### Before Starting ANY Project

- [ ] Target platforms defined (iOS/Android/both)?
- [ ] Framework selected based on criteria?
- [ ] State management approach chosen?
- [ ] Navigation pattern selected?
- [ ] Storage strategy for each data type?
- [ ] Offline requirements defined?
- [ ] Auth flow designed?
- [ ] Deep linking planned from start?

### Questions to Ask User

```
If project details are vague, ASK:

1. "Will this need OTA updates without app store review?"
   → Affects framework choice (Expo = yes)

2. "Do iOS and Android need identical UI?"
   → Affects framework (Flutter = identical)

3. "What's the offline requirement?"
   → Affects architecture complexity

4. "Is there an existing backend/auth system?"
   → Affects auth and API approach

5. "What devices? Phone only, or tablet?"
   → Affects navigation and layout

6. "Enterprise or consumer?"
   → Affects auth (SSO), security, compliance
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
