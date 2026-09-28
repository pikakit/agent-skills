---
"title": "Mobile Design Thinking: ?? INTERACTION BREAKDOWN through ?? MANDATORY: Before Every Mobile Work"
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

# Mobile Design Thinking: ?? INTERACTION BREAKDOWN through ?? MANDATORY: Before Every Mobile Work

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? INTERACTION BREAKDOWN

### Analysis for Every Gesture

Before adding any gesture:

```
GESTURE: [Gesture Type]
+-- DISCOVERABILITY:
|   +-- How will users discover this gesture?
|       +-- Is there a visual hint?
|       +-- Will it be shown in onboarding?
|       +-- Is there a button alternative? (MANDATORY)
|
+-- PLATFORM CONVENTION:
|   +-- What does this gesture mean on iOS?
|   +-- What does this gesture mean on Android?
|   +-- Am I deviating from platform convention?
|
+-- ACCESSIBILITY:
|   +-- Can motor-impaired users perform this gesture?
|   +-- Is there a VoiceOver/TalkBack alternative?
|   +-- Does it work with switch control?
|
+-- CONFLICT CHECK:
|   +-- Does it conflict with system gestures?
|   |   +-- iOS: Edge swipe back
|   |   +-- Android: Back gesture
|   |   +-- Home indicator swipe
|   +-- Is it consistent with other app gestures?
|
+-- FEEDBACK:
    +-- Is haptic feedback defined?
    +-- Is visual feedback sufficient?
    +-- Is audio feedback needed?
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? SPIRIT OVER CHECKLIST (Mobile Edition)

### Passing the Checklist is Not Enough!

| ? Self-Deception | ? Honest Assessment |
|-------------------|----------------------|
| "Touch target is 44px" (but on edge, unreachable) | "Can user reach it one-handed?" |
| "I used FlatList" (but didn't memoize) | "Is scroll smooth?" |
| "Platform-specific nav" (but only icons differ) | "Does iOS feel like iOS, Android like Android?" |
| "Offline support exists" (but error message is generic) | "What can user actually do offline?" |
| "Loading state exists" (but just a spinner) | "Does user know how long to wait?" |

> ?? **Passing the checklist is NOT the goal. Creating great mobile UX IS the goal.**

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? MOBILE DESIGN COMMITMENT

### Fill This at the Start of Every Mobile Project

```
?? MOBILE DESIGN COMMITMENT

Project: _______________
Platform: iOS / Android / Both

1. Default pattern I will NOT use in this project:
   +-- _______________
   
2. Context-specific focus for this project:
   +-- _______________

3. Platform-specific differences I will implement:
   +-- iOS: _______________
   +-- Android: _______________

4. Area I will specifically optimize for performance:
   +-- _______________

5. Unique challenge of this project:
   +-- _______________

?? If I can't fill this commitment ? I don't understand the project well enough.
   ? Go back, understand context better, ask the user.
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? MANDATORY: Before Every Mobile Work

```
+-----------------------------------------------------------------+
|                    PRE-WORK VALIDATION                          |
+-----------------------------------------------------------------|
|                                                                 |
|  ? Did I complete Component Decomposition?                      |
|  ? Did I fill the Pattern Questioning Matrix?                   |
|  ? Did I pass the Anti-Memorization Test?                       |
|  ? Did I make context-based decisions?                          |
|  ? Did I analyze Interaction Breakdown?                         |
|  ? Did I fill the Mobile Design Commitment?                     |
|                                                                 |
|  ?? Do not write code without completing these!                 |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **Remember:** If you chose a solution "because that's how it's always done," you chose WITHOUT THINKING. Every project is unique. Every context is different. Every user behavior is specific. **THINK, then code.**

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
