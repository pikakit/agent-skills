---
"title": "Decision Trees: How to Use This File through 2. Audience Decision Tree"
"kind": "decision"
"impact": "high"
"tags":
  - "decision"
  - "trees"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Decision Trees: How to Use This File through 2. Audience Decision Tree

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## ⚠️ How to Use This File

This file helps you DECIDE, not copy.

- Decision trees → Help you THINK through options
- Templates → Show STRUCTURE and PRINCIPLES, not exact values
- **Always ask user preferences** before applying
- **Generate fresh palettes** based on context, don't copy hex codes
- **Apply UX laws** from ux-psychology.md to validate decisions

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 1. Master Decision Tree

```
┌─────────────────────────────────────────────────────────────┐
│                     WHAT ARE YOU BUILDING?                   │
└─────────────────────────────────────────────────────────────┘
                              │
        ┌─────────────────────┼─────────────────────┐
        │                     │                     │
        ▼                     ▼                     ▼
   E-COMMERCE            SaaS/APP              CONTENT
   - Product pages       - Dashboard           - Blog
   - Checkout            - Tools               - Portfolio
   - Catalog             - Admin               - Landing
        │                     │                     │
        ▼                     ▼                     ▼
   PRINCIPLES:           PRINCIPLES:           PRINCIPLES:
   - Trust               - Functionality       - Storytelling
   - Action              - Clarity             - Emotion
   - Urgency             - Efficiency          - Creativity
```

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 2. Audience Decision Tree

### Who is your target user?

```
TARGET AUDIENCE
      │
      ├── Gen Z (18-25)
      │   ├── Colors: Bold, vibrant, unexpected combinations
      │   ├── Type: Large, expressive, variable
      │   ├── Layout: Mobile-first, vertical, snackable
      │   ├── Effects: Motion, gamification, interactive
      │   └── Approach: Authentic, fast, no corporate feel
      │
      ├── Millennials (26-41)
      │   ├── Colors: Muted, earthy, sophisticated
      │   ├── Type: Clean, readable, functional
      │   ├── Layout: Responsive, card-based, organized
      │   ├── Effects: Subtle, purposeful only
      │   └── Approach: Value-driven, transparent, sustainable
      │
      ├── Gen X (42-57)
      │   ├── Colors: Professional, trusted, conservative
      │   ├── Type: Familiar, clear, no-nonsense
      │   ├── Layout: Traditional hierarchy, predictable
      │   ├── Effects: Minimal, functional feedback
      │   └── Approach: Direct, efficient, reliable
      │
      ├── Boomers (58+)
      │   ├── Colors: High contrast, simple, clear
      │   ├── Type: Large sizes, high readability
      │   ├── Layout: Simple, linear, uncluttered
      │   ├── Effects: None or very minimal
      │   └── Approach: Clear, detailed, trustworthy
      │
      └── B2B / Enterprise
          ├── Colors: Professional palette, muted
          ├── Type: Clean, data-friendly, scannable
          ├── Layout: Grid-based, organized, efficient
          ├── Effects: Professional, subtle
          └── Approach: Expert, solution-focused, ROI-driven
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
