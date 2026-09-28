---
"title": "Mobile Navigation: Drawer Navigation through 6. Deep Linking"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "navigation"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Navigation: Drawer Navigation through 6. Deep Linking

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 4. Drawer Navigation

### When to Use

```
✅ USE Drawer when:
├── More than 5 top-level destinations
├── Less frequently accessed destinations
├── Complex app with many features
├── Need for branding/user info in nav
└── Tablet/large screen with persistent drawer

❌ AVOID Drawer when:
├── 5 or fewer destinations (use tabs)
├── All destinations equally important
├── Mobile-first simple app
└── Discoverability is critical (drawer is hidden)
```

### Drawer Patterns

```
Modal Drawer:
├── Opens over content (scrim behind)
├── Swipe to open from edge
├── Hamburger icon ( ☰ ) triggers
└── Most common on mobile

Permanent Drawer:
├── Always visible (large screens)
├── Content shifts over
├── Good for productivity apps
└── Tablets, desktops

Navigation Rail (Android):
├── Narrow vertical strip
├── Icons + optional labels
├── For tablets in portrait
└── 80dp width
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 5. Modal Navigation

### Modal vs Push

```
PUSH (Stack):                    MODAL:
├── Horizontal slide             ├── Vertical slide up (sheet)
├── Part of hierarchy            ├── Separate task
├── Back returns                 ├── Dismiss (X) returns
├── Same navigation context      ├── Own navigation context
└── "Drill in"                   └── "Focus on task"

USE MODAL for:
├── Creating new content
├── Settings/preferences
├── Completing a transaction
├── Self-contained workflows
├── Quick actions
```

### Modal Types

| Type | iOS | Android | Use Case |
|------|-----|---------|----------|
| **Sheet** | `.sheet` | Bottom Sheet | Quick tasks |
| **Full Screen** | `.fullScreenCover` | Full Activity | Complex forms |
| **Alert** | Alert | Dialog | Confirmations |
| **Action Sheet** | Action Sheet | Menu/Bottom Sheet | Choose from options |

### Modal Dismissal

```
Users expect to dismiss modals by:
├── Tapping X / Close button
├── Swiping down (sheet)
├── Tapping scrim (non-critical)
├── System back (Android)
├── Hardware back (old Android)

RULE: Only block dismissal for unsaved data.
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 6. Deep Linking

### Why Deep Links from Day One

```
Deep links enable:
├── Push notification navigation
├── Sharing content
├── Marketing campaigns
├── Spotlight/Search integration
├── Widget navigation
├── External app integration

Building later is HARD:
├── Requires navigation refactor
├── Screen dependencies unclear
├── Parameter passing complex
└── Always plan deep links at start
```

### URL Structure

```
Scheme://host/path?params

Examples:
├── myapp://product/123
├── https://myapp.com/product/123 (Universal/App Link)
├── myapp://checkout?promo=SAVE20
├── myapp://tab/profile/settings

Hierarchy should match navigation:
├── myapp://home
├── myapp://home/product/123
├── myapp://home/product/123/reviews
└── URL path = navigation path
```

### Deep Link Navigation Rules

```
1. FULL STACK CONSTRUCTION
   Deep link to myapp://product/123 should:
   ├── Put Home at root of stack
   ├── Push Product screen on top
   └── Back button returns to Home

2. AUTHENTICATION AWARENESS
   If deep link requires auth:
   ├── Save intended destination
   ├── Redirect to login
   ├── After login, navigate to destination

3. INVALID LINKS
   If deep link target doesn't exist:
   ├── Navigate to fallback (home)
   ├── Show error message
   └── Never crash or blank screen

4. STATEFUL NAVIGATION
   Deep link during active session:
   ├── Don't blow away current stack
   ├── Push on top OR
   ├── Ask user if should navigate away
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
