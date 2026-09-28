---
"title": "Mobile Design Thinking: ?? DEEP MOBILE THINKING PROTOCOL through ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)"
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

# Mobile Design Thinking: ?? DEEP MOBILE THINKING PROTOCOL through ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? DEEP MOBILE THINKING PROTOCOL

### This Process is Mandatory Before Every Mobile Project

```
+-----------------------------------------------------------------+
|                    DEEP MOBILE THINKING                         |
+-----------------------------------------------------------------|
|                                                                 |
|  1️? CONTEXT SCAN                                               |
|     +-- What are my assumptions for this project?               |
|         +-- QUESTION these assumptions                          |
|                                                                 |
|  2️? ANTI-DEFAULT ANALYSIS                                      |
|     +-- Am I applying a memorized pattern?                      |
|         +-- Is this pattern REALLY the best for THIS project?   |
|                                                                 |
|  3️? PLATFORM DECOMPOSITION                                     |
|     +-- Did I think about iOS and Android separately?           |
|         +-- What are the platform-specific patterns?            |
|                                                                 |
|  4️? TOUCH INTERACTION BREAKDOWN                                |
|     +-- Did I analyze each interaction individually?            |
|         +-- Did I apply Fitts' Law, Thumb Zone?                 |
|                                                                 |
|  5️? PERFORMANCE IMPACT ANALYSIS                                |
|     +-- Did I consider performance impact of each component?    |
|         +-- Is the default solution performant?                 |
|                                                                 |
+-----------------------------------------------------------------+
```

---

> **This file prevents AI from using memorized patterns and forces genuine thinking.**
> Mechanisms to prevent standard AI training defaults in mobile development.
> **The mobile equivalent of frontend's layout decomposition approach.**

---

## ?? AI MOBILE DEFAULTS (FORBIDDEN LIST)

### Using These Patterns Automatically is FORBIDDEN!

The following patterns are "defaults" that AIs learned from training data.
Before using any of these, **QUESTION them and CONSIDER ALTERNATIVES!**

```
+-----------------------------------------------------------------+
|                 ?? AI MOBILE SAFE HARBOR                        |
|           (Default Patterns - Never Use Without Questioning)    |
+-----------------------------------------------------------------|
|                                                                 |
|  NAVIGATION DEFAULTS:                                           |
|  +-- Tab bar for every project (Would drawer be better?)        |
|  +-- Fixed 5 tabs (Are 3 enough? For 6+, drawer?)               |
|  +-- "Home" tab on left (What does user behavior say?)          |
|  +-- Hamburger menu (Is it outdated now?)                       |
|                                                                 |
|  STATE MANAGEMENT DEFAULTS:                                     |
|  +-- Redux everywhere (Is Zustand/Jotai sufficient?)            |
|  +-- Global state for everything (Isn't local state enough?)   |
|  +-- Context Provider hell (Is atom-based better?)              |
|  +-- BLoC for every Flutter project (Is Riverpod more modern?)  |
|                                                                 |
|  LIST IMPLEMENTATION DEFAULTS:                                  |
|  +-- FlatList as default (Is FlashList more performant?)        |
|  +-- windowSize=21 (Is it really needed?)                       |
|  +-- removeClippedSubviews (Always?)                            |
|  +-- ListView.builder (Is ListView.separated better?)           |
|                                                                 |
|  UI PATTERN DEFAULTS:                                           |
|  +-- FAB bottom-right (Is bottom-left more accessible?)         |
|  +-- Pull-to-refresh on every list (Is it needed everywhere?)   |
|  +-- Swipe-to-delete from left (Is right better?)               |
|  +-- Bottom sheet for every modal (Is full screen better?)      |
|                                                                 |
+-----------------------------------------------------------------+
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
