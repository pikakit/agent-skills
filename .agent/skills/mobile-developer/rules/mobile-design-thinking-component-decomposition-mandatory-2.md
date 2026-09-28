---
"title": "Mobile Design Thinking: ?? COMPONENT DECOMPOSITION (MANDATORY) through ?? PATTERN QUESTIONING MATRIX"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Material Design 3 Mobile"
    "url": "https://developer.android.com/design/ui/mobile"
  - "title": "Apple Human Interface Guidelines"
    "url": "https://developer.apple.com/design/human-interface-guidelines"
---

# Mobile Design Thinking: ?? COMPONENT DECOMPOSITION (MANDATORY) through ?? PATTERN QUESTIONING MATRIX

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? COMPONENT DECOMPOSITION (MANDATORY)

### Decomposition Analysis for Every Screen

Before designing any screen, perform this analysis:

```
SCREEN: [Screen Name]
+-- PRIMARY ACTION: [What is the main action?]
|   +-- Is it in thumb zone? [Yes/No ? Why?]
|
+-- TOUCH TARGETS: [All tappable elements]
|   +-- [Element 1]: [Size]pt ? Sufficient?
|   +-- [Element 2]: [Size]pt ? Sufficient?
|   +-- Spacing: [Gap]pt ? Accidental tap risk?
|
+-- SCROLLABLE CONTENT:
|   +-- Is it a list? ? FlatList/FlashList [Why this choice?]
|   +-- Item count: ~[N] ? Performance consideration?
|   +-- Fixed height? ? Is getItemLayout needed?
|
+-- STATE REQUIREMENTS:
|   +-- Is local state sufficient?
|   +-- Do I need to lift state?
|   +-- Is global required? [Why?]
|
+-- PLATFORM DIFFERENCES:
|   +-- iOS: [Anything different needed?]
|   +-- Android: [Anything different needed?]
|
+-- OFFLINE CONSIDERATION:
|   +-- Should this screen work offline?
|   +-- Cache strategy: [Yes/No/Which one?]
|
+-- PERFORMANCE IMPACT:
    +-- Any heavy components?
    +-- Is memoization needed?
    +-- Animation performance?
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? PATTERN QUESTIONING MATRIX

Ask these questions for every default pattern:

### Navigation Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "I'll use tab bar" | How many destinations? | 3 ? minimal tabs, 6+ ? drawer |
| "5 tabs" | Are all equally important? | "More" tab? Drawer hybrid? |
| "Bottom nav" | iPad/tablet support? | Navigation rail alternative |
| "Stack navigation" | Did I consider deep links? | URL structure = navigation structure |

### State Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "I'll use Redux" | How complex is the app? | Simple: Zustand, Server: TanStack |
| "Global state" | Is this state really global? | Local lift, Context selector |
| "Context Provider" | Will re-render be an issue? | Zustand, Jotai (atom-based) |
| "BLoC pattern" | Is the boilerplate worth it? | Riverpod (less code) |

### List Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "FlatList" | Is performance critical? | FlashList (faster) |
| "Standard renderItem" | Is it memoized? | useCallback + React.memo |
| "Index key" | Does data order change? | Use item.id |
| "ListView" | Are there separators? | ListView.separated |

### UI Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "FAB bottom-right" | User handedness? | Accessibility settings |
| "Pull-to-refresh" | Does this list need refresh? | Only when necessary |
| "Modal bottom sheet" | How much content? | Full screen modal might be better |
| "Swipe actions" | Discoverability? | Visible button alternative |

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
