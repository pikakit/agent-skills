---
"title": "Decision Trees: Color Selection Decision Tree through 4. Typography Decision Tree"
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

# Decision Trees: Color Selection Decision Tree through 4. Typography Decision Tree

## Decision

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 3. Color Selection Decision Tree

### Instead of fixed hex codes, use this process:

```
WHAT EMOTION/ACTION DO YOU WANT?
            │
            ├── Trust & Security
            │   └── Consider: Blue family, professional neutrals
            │       → ASK user for specific shade preference
            │
            ├── Growth & Health
            │   └── Consider: Green family, natural tones
            │       → ASK user if eco/nature/wellness focus
            │
            ├── Urgency & Action
            │   └── Consider: Warm colors (orange/red) as ACCENTS
            │       → Use sparingly, ASK if appropriate
            │
            ├── Luxury & Premium
            │   └── Consider: Deep darks, metallics, restrained palette
            │       → ASK about brand positioning
            │
            ├── Creative & Playful
            │   └── Consider: Multi-color, unexpected combinations
            │       → ASK about brand personality
            │
            └── Calm & Minimal
                └── Consider: Neutrals with single accent
                    → ASK what accent color fits brand
```

### The Process:
1. Identify the emotion needed
2. Narrow to color FAMILY
3. ASK user for preference within family
4. Generate fresh palette using HSL principles

---

> Context-based design THINKING, not fixed solutions.
> **These are decision GUIDES, not copy-paste templates.**
> **For UX psychology principles (Hick's, Fitts', etc.) see:** [ux-psychology.md](ux-psychology-1-core-ux-laws.md)

---

## 4. Typography Decision Tree

```
WHAT'S THE CONTENT TYPE?
          │
          ├── Data-Heavy (Dashboard, SaaS)
          │   ├── Style: Sans-serif, clear, compact
          │   ├── Scale: Tighter ratio (1.125-1.2)
          │   └── Priority: Scannability, density
          │
          ├── Editorial (Blog, Magazine)
          │   ├── Style: Serif heading + Sans body works well
          │   ├── Scale: More dramatic (1.333+)
          │   └── Priority: Reading comfort, hierarchy
          │
          ├── Modern Tech (Startup, SaaS Marketing)
          │   ├── Style: Geometric or humanist sans
          │   ├── Scale: Balanced (1.25)
          │   └── Priority: Modern feel, clarity
          │
          ├── Luxury (Fashion, Premium)
          │   ├── Style: Elegant serif or thin sans
          │   ├── Scale: Dramatic (1.5-1.618)
          │   └── Priority: Sophistication, whitespace
          │
          └── Playful (Kids, Games, Casual)
              ├── Style: Rounded, friendly fonts
              ├── Scale: Varied, expressive
              └── Priority: Fun, approachable, readable
```

### Selection Process:
1. Identify content type
2. Choose style DIRECTION
3. ASK user if they have brand fonts
4. Select fonts that match direction

---

## Use When

Use when the documented constraints match observed repository and runtime evidence.

## Avoid When

Avoid when a simpler option satisfies the same constraints or evidence is unavailable.

## Trade-offs

Compare correctness, accessibility, operations, performance, migration cost, and reversibility.

## Verification

Test a representative scenario and the most important failure mode.
