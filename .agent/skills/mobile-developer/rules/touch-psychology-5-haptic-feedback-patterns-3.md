---
"title": "Touch Psychology: Haptic Feedback Patterns through 6. Mobile Cognitive Load"
"kind": "reference"
"impact": "high"
"tags":
  - "mobile-developer"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Apple HIG Haptics"
    "url": "https://developer.apple.com/design/human-interface-guidelines/playing-haptics"
  - "title": "Material Design Accessibility Foundations"
    "url": "https://developer.android.com/design/ui/mobile/guides/foundations/accessibility"
---

# Touch Psychology: Haptic Feedback Patterns through 6. Mobile Cognitive Load

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 5. Haptic Feedback Patterns

### Why Haptics Matter

```
Haptics provide:
+-- Confirmation without looking
+-- Richer, more premium feel
+-- Accessibility (blind users)
+-- Reduced error rate
+-- Emotional satisfaction

Without haptics:
+-- Feels "cheap" or web-like
+-- User unsure if action registered
+-- Missed opportunity for delight
```

### iOS Haptic Types

| Type | Intensity | Use Case |
|------|-----------|----------|
| `selection` | Light | Picker scroll, toggle, selection |
| `light` | Light | Minor actions, hover equivalent |
| `medium` | Medium | Standard tap confirmation |
| `heavy` | Strong | Important completed, drop |
| `success` | Pattern | Task completed successfully |
| `warning` | Pattern | Warning, attention needed |
| `error` | Pattern | Error occurred |

### Android Haptic Types

| Type | Use Case |
|------|----------|
| `CLICK` | Standard tap feedback |
| `HEAVY_CLICK` | Important actions |
| `DOUBLE_CLICK` | Confirm actions |
| `TICK` | Scroll/scrub feedback |
| `LONG_PRESS` | Long press activation |
| `REJECT` | Error/invalid action |

### Haptic Usage Guidelines

```
? DO use haptics for:
+-- Button taps
+-- Toggle switches
+-- Picker/slider values
+-- Pull to refresh trigger
+-- Successful action completion
+-- Errors and warnings
+-- Swipe action thresholds
+-- Important state changes

? DON'T use haptics for:
+-- Every scroll position
+-- Every list item
+-- Background events
+-- Passive displays
+-- Too frequently (haptic fatigue)
```

### Haptic Intensity Mapping

| Action Importance | Haptic Level | Example |
|-------------------|--------------|---------|
| Minor/Browsing | Light / None | Scrolling, hovering |
| Standard Action | Medium / Selection | Tap, toggle |
| Significant Action | Heavy / Success | Complete, confirm |
| Critical/Destructive | Heavy / Warning | Delete, payment |
| Error | Error pattern | Failed action |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 6. Mobile Cognitive Load

### How Mobile Differs from Desktop

| Factor | Desktop | Mobile | Implication |
|--------|---------|--------|-------------|
| **Attention** | Focused sessions | Interrupted constantly | Design for micro-sessions |
| **Context** | Controlled environment | Anywhere, any condition | Handle bad lighting, noise |
| **Multitasking** | Multiple windows | One app visible | Complete task in-app |
| **Input speed** | Fast (keyboard) | Slow (touch typing) | Minimize input, smart defaults |
| **Error recovery** | Easy (undo, back) | Harder (no keyboard shortcuts) | Prevent errors, easy recovery |

### Reducing Mobile Cognitive Load

```
1. ONE PRIMARY ACTION per screen
   +-- Clear what to do next
   
2. PROGRESSIVE DISCLOSURE
   +-- Show only what's needed now
   
3. SMART DEFAULTS
   +-- Pre-fill what you can
   
4. CHUNKING
   +-- Break long forms into steps
   
5. RECOGNITION over RECALL
   +-- Show options, don't make user remember
   
6. CONTEXT PERSISTENCE
   +-- Save state on interrupt/background
```

### Miller's Law for Mobile

```
Desktop: 7 × 2 items in working memory
Mobile: Reduce to 5 × 1 (more distractions)

Navigation: Max 5 tab bar items
Options: Max 5 per menu level
Steps: Max 5 visible steps in progress
```

### Hick's Law for Mobile

```
More choices = slower decisions

Mobile impact: Even worse than desktop
+-- Smaller screen = less overview
+-- Scrolling required = items forgotten
+-- Interruptions = lost context
+-- Decision fatigue faster

Solution: Progressive disclosure
+-- Start with 3-5 options
+-- "More" for additional
+-- Smart ordering (most used first)
+-- Previous selections remembered
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
