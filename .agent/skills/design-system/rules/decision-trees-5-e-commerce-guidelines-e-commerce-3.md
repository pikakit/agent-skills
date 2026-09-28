---
"title": "Decision Trees: E-commerce Guidelines {#e-commerce} through 6. SaaS Dashboard Guidelines {#saas}"
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

# Decision Trees: E-commerce Guidelines {#e-commerce} through 6. SaaS Dashboard Guidelines {#saas}

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 5. E-commerce Guidelines {#e-commerce}

### Key Principles (Not Fixed Rules)
- **Trust first:** How will you show security?
- **Action-oriented:** Where are the CTAs?
- **Scannable:** Can users compare quickly?

### Color Thinking:
```
E-commerce typically needs:
├── Trust color (often blue family) → ASK preference
├── Clean background (white/neutral) → depends on brand
├── Action accent (for CTAs, sales) → depends on urgency level
├── Success/error semantics → standard conventions work
└── Brand integration → ASK about existing colors
```

### Layout Principles:
```
┌────────────────────────────────────────────────────┐
│  HEADER: Brand + Search + Cart                      │
│  (Keep essential actions visible)                   │
├────────────────────────────────────────────────────┤
│  TRUST ZONE: Why trust this site?                   │
│  (Shipping, returns, security - if applicable)      │
├────────────────────────────────────────────────────┤
│  HERO: Primary message or offer                     │
│  (Clear CTA, single focus)                          │
├────────────────────────────────────────────────────┤
│  CATEGORIES: Easy navigation                        │
│  (Visual, filterable, scannable)                    │
├────────────────────────────────────────────────────┤
│  PRODUCTS: Easy comparison                          │
│  (Price, rating, quick actions visible)             │
├────────────────────────────────────────────────────┤
│  SOCIAL PROOF: Why others trust                     │
│  (Reviews, testimonials - if available)             │
├────────────────────────────────────────────────────┤
│  FOOTER: All the details                            │
│  (Policies, contact, trust badges)                  │
└────────────────────────────────────────────────────┘
```

### Psychology to Apply:
- Hick's Law: Limit navigation choices
- Fitts' Law: Size CTAs appropriately
- Social proof: Show where relevant
- Scarcity: Use honestly if at all

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 6. SaaS Dashboard Guidelines {#saas}

### Key Principles
- **Functional first:** Data clarity over decoration
- **Calm UI:** Reduce cognitive load
- **Consistent:** Predictable patterns

### Color Thinking:
```
Dashboard typically needs:
├── Background: Light OR dark (ASK preference)
├── Surface: Slight contrast from background
├── Primary accent: For key actions
├── Data colors: Success/warning/danger semantics
└── Muted: For secondary information
```

### Layout Principles:
```
Consider these patterns (not mandated):

OPTION A: Sidebar + Content
├── Fixed sidebar for navigation
└── Main area for content

OPTION B: Top nav + Content
├── Horizontal navigation
└── More horizontal content space

OPTION C: Collapsed + Expandable
├── Icon-only sidebar expands
└── Maximum content area

→ ASK user about their navigation preference
```

### Psychology to Apply:
- Hick's Law: Group navigation items
- Miller's Law: Chunk information
- Cognitive Load: Whitespace, consistency

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
