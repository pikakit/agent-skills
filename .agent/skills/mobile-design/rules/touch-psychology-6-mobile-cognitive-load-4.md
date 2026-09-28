---
"title": "Touch Psychology: Mobile Cognitive Load through 8. Emotion in Touch"
"kind": "reference"
"impact": "high"
"tags":
  - "touch"
  - "psychology"
"applies_to":
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Touch Psychology: Mobile Cognitive Load through 8. Emotion in Touch

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

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
   └── Clear what to do next
   
2. PROGRESSIVE DISCLOSURE
   └── Show only what's needed now
   
3. SMART DEFAULTS
   └── Pre-fill what you can
   
4. CHUNKING
   └── Break long forms into steps
   
5. RECOGNITION over RECALL
   └── Show options, don't make user remember
   
6. CONTEXT PERSISTENCE
   └── Save state on interrupt/background
```

### Miller's Law for Mobile

```
Desktop: 7±2 items in working memory
Mobile: Reduce to 5±1 (more distractions)

Navigation: Max 5 tab bar items
Options: Max 5 per menu level
Steps: Max 5 visible steps in progress
```

### Hick's Law for Mobile

```
More choices = slower decisions

Mobile impact: Even worse than desktop
├── Smaller screen = less overview
├── Scrolling required = items forgotten
├── Interruptions = lost context
└── Decision fatigue faster

Solution: Progressive disclosure
├── Start with 3-5 options
├── "More" for additional
├── Smart ordering (most used first)
└── Previous selections remembered
```

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 7. Touch Accessibility

### Motor Impairment Considerations

```
Users with motor impairments may:
├── Have tremors (need larger targets)
├── Use assistive devices (different input method)
├── Have limited reach (one-handed necessity)
├── Need more time (avoid timeouts)
└── Make accidental touches (need confirmation)

Design responses:
├── Generous touch targets (48dp+)
├── Adjustable timing for gestures
├── Undo for destructive actions
├── Switch control support
└── Voice control support
```

### Touch Target Spacing (A11y)

```
WCAG 2.2 Success Criterion 2.5.8:

Touch targets MUST have:
├── Width: ≥ 44px
├── Height: ≥ 44px
├── Spacing: ≥ 8px from adjacent targets

OR the target is:
├── Inline (within text)
├── User-controlled (user can resize)
├── Essential (no alternative design)
```

### Accessible Touch Patterns

| Pattern | Accessible Implementation |
|---------|---------------------------|
| Swipe actions | Provide menu alternative |
| Drag and drop | Provide select + move option |
| Pinch zoom | Provide zoom buttons |
| Force touch | Provide long press alternative |
| Shake gesture | Provide button alternative |

---

> Deep dive into mobile touch interaction, Fitts' Law for touch, thumb zone anatomy, gesture psychology, and haptic feedback.
> **This is the mobile equivalent of ux-psychology.md - CRITICAL for all mobile work.**

---

## 8. Emotion in Touch

### The Premium Feel

```
What makes touch feel "premium":
├── Instant response (< 50ms)
├── Appropriate haptic feedback
├── Smooth 60fps animations
├── Correct resistance/physics
├── Sound feedback (when appropriate)
└── Attention to spring physics
```

### Emotional Touch Feedback

| Emotion | Touch Response |
|---------|----------------|
| Success | Haptic success + confetti/check |
| Error | Haptic error + shake animation |
| Warning | Haptic warning + attention color |
| Delight | Unexpected smooth animation |
| Power | Heavy haptic on significant action |

### Trust Building Through Touch

```
Trust signals in touch interactions:
├── Consistent behavior (same action = same response)
├── Reliable feedback (never fails silently)
├── Secure feel for sensitive actions
├── Professional animations (not janky)
└── No accidental actions (confirmation for destructive)
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
