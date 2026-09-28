---
"title": "Mobile Design Thinking: PATTERN QUESTIONING MATRIX through ANTI-MEMORIZATION TEST"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile"
  - "design"
  - "thinking"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Mobile Design Thinking: PATTERN QUESTIONING MATRIX through ANTI-MEMORIZATION TEST

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🎯 PATTERN QUESTIONING MATRIX

Ask these questions for every default pattern:

### Navigation Pattern Questioning

| Assumption | Question | Alternative |
|------------|----------|-------------|
| "I'll use tab bar" | How many destinations? | 3 → minimal tabs, 6+ → drawer |
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

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## 🧪 ANTI-MEMORIZATION TEST

### Ask Yourself Before Every Solution

```
┌─────────────────────────────────────────────────────────────────┐
│                    ANTI-MEMORIZATION CHECKLIST                  │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  □ Did I pick this solution "because I always do it this way"?  │
│    → If YES: STOP. Consider alternatives.                       │
│                                                                 │
│  □ Is this a pattern I've seen frequently in training data?     │
│    → If YES: Is it REALLY suitable for THIS project?            │
│                                                                 │
│  □ Did I write this solution automatically without thinking?    │
│    → If YES: Step back, do decomposition.                       │
│                                                                 │
│  □ Did I consider an alternative approach?                      │
│    → If NO: Think of at least 2 alternatives, then decide.      │
│                                                                 │
│  □ Did I think platform-specifically?                           │
│    → If NO: Analyze iOS and Android separately.                 │
│                                                                 │
│  □ Did I consider performance impact of this solution?          │
│    → If NO: What is the memory, CPU, battery impact?            │
│                                                                 │
│  □ Is this solution suitable for THIS project's CONTEXT?        │
│    → If NO: Customize based on context.                         │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
