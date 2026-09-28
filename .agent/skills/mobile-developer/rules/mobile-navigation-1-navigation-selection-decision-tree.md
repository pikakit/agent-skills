---
"title": "Mobile Navigation: Navigation Selection Decision Tree through 3. Stack Navigation"
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
  - "title": "Android Navigation Component"
    "url": "https://developer.android.com/guide/navigation"
  - "title": "Apple HIG Navigation"
    "url": "https://developer.apple.com/design/human-interface-guidelines/navigation"
---

# Mobile Navigation: Navigation Selection Decision Tree through 3. Stack Navigation

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 1. Navigation Selection Decision Tree

```
WHAT TYPE OF APP?
        │
        ├── 3-5 top-level sections (equal importance)
        │   └── ✅ Tab Bar / Bottom Navigation
        │       Examples: Social, E-commerce, Utility
        │
        ├── Deep hierarchical content (drill down)
        │   └── ✅ Stack Navigation
        │       Examples: Settings, Email folders
        │
        ├── Many destinations (>5 top-level)
        │   └── ✅ Drawer Navigation
        │       Examples: Gmail, complex enterprise
        │
        ├── Single linear flow
        │   └── ✅ Stack only (wizard/onboarding)
        │       Examples: Checkout, Setup flow
        │
        └── Tablet/Foldable
            └── ✅ Navigation Rail + List-Detail
                Examples: Mail, Notes on iPad
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 2. Tab Bar Navigation

### When to Use

```
✅ USE Tab Bar when:
├── 3-5 top-level destinations
├── Destinations are of equal importance
├── User frequently switches between them
├── Each tab has independent navigation stack
└── App is used in short sessions

❌ AVOID Tab Bar when:
├── More than 5 destinations
├── Destinations have clear hierarchy
├── Tabs would be used very unequally
└── Content flows in a sequence
```

### Tab Bar Best Practices

```
iOS Tab Bar:
├── Height: 49pt (83pt with home indicator)
├── Max items: 5
├── Icons: SF Symbols, 25×25pt
├── Labels: Always show (accessibility)
├── Active indicator: Tint color

Android Bottom Navigation:
├── Height: 80dp
├── Max items: 5 (3-5 ideal)
├── Icons: Material Symbols, 24dp
├── Labels: Always show
├── Active indicator: Pill shape + filled icon
```

### Tab State Preservation

```
RULE: Each tab maintains its own navigation stack.

User journey:
1. Home tab → Drill into item → Add to cart
2. Switch to Profile tab
3. Switch back to Home tab
→ Should return to "Add to cart" screen, NOT home root

Implementation:
├── React Navigation: Each tab has own navigator
├── Flutter: IndexedStack for state preservation
└── Never reset tab stack on switch
```

---

> Navigation patterns, deep linking, back handling, and tab/stack/drawer decisions.
> **Navigation is the skeleton of your app—get it wrong and everything feels broken.**

---

## 3. Stack Navigation

### Core Concepts

```
Stack metaphor: Cards stacked on top of each other

Push: Add screen on top
Pop: Remove top screen (back)
Replace: Swap current screen
Reset: Clear stack, set new root

Visual: New screen slides in from right (LTR)
Back: Screen slides out to right
```

### Stack Navigation Patterns

| Pattern | Use Case | Implementation |
|---------|----------|----------------|
| **Simple Stack** | Linear flow | Push each step |
| **Nested Stack** | Sections with sub-navigation | Stack inside tab |
| **Modal Stack** | Focused tasks | Present modally |
| **Auth Stack** | Login vs Main | Conditional root |

### Back Button Handling

```
iOS:
├── Edge swipe from left (system)
├── Back button in nav bar (optional)
├── Interactive pop gesture
└── Never override swipe back without good reason

Android:
├── System back button/gesture
├── Up button in toolbar (optional, for drill-down)
├── Predictive back animation (Android 14+)
└── Must handle back correctly (Activity/Fragment)

Cross-Platform Rule:
├── Back ALWAYS navigates up the stack
├── Never hijack back for other purposes
├── Confirm before discarding unsaved data
└── Deep links should allow full back traversal
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
