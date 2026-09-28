---
"title": "Ux Psychology: Core UX Laws"
"kind": "reference"
"impact": "high"
"tags":
  - "ux"
  - "psychology"
"applies_to":
  - "web"
  - "android"
  - "ios"
"last_reviewed": "2026-09-28"
"sources":
  - "title": "Official documentation"
    "url": "https://www.w3.org/WAI/standards-guidelines/wcag/"
---

# Ux Psychology: Core UX Laws

## Scope

Apply only to the declared platforms and repository-confirmed versions.

## Guidance

> Deep dive into UX laws, emotional design, trust building, and behavioral psychology.

---

## 1. Core UX Laws

### Hick's Law

**Principle:** The time to make a decision increases logarithmically with the number of choices.

```
Decision Time = a + b × log₂(n + 1)
Where n = number of choices
```

**Application:**
- Navigation: Max 5-7 top-level items
- Forms: Break into steps (progressive disclosure)
- Options: Default selections when possible
- Filters: Prioritize most-used, hide advanced

**Example:**
```
❌ Bad: 15 menu items in one nav
✅ Good: 5 main categories + "More" 

❌ Bad: 20 form fields at once
✅ Good: 3-step wizard with 5-7 fields each
```

---

### Fitts' Law

**Principle:** Time to reach a target = function of distance and size.

```
MT = a + b × log₂(1 + D/W)
Where D = distance, W = width
```

**Application:**
- CTAs: Make primary buttons larger (min 44px height)
- Touch targets: 44×44px minimum on mobile
- Placement: Important actions near natural cursor position
- Corners: "Magic corners" (infinite edge = easy to hit)

**Button Sizing:**
```css
/* Size by importance */
.btn-primary { height: 48px; padding: 0 24px; }
.btn-secondary { height: 40px; padding: 0 16px; }
.btn-tertiary { height: 36px; padding: 0 12px; }

/* Mobile touch targets */
@media (hover: none) {
  .btn { min-height: 44px; min-width: 44px; }
}
```

---

### Miller's Law

**Principle:** Average person can hold 7±2 chunks in working memory.

**Application:**
- Lists: Group into chunks of 5-7 items
- Navigation: Max 7 menu items
- Content: Break long content with headings
- Phone numbers: 555-123-4567 (chunked)

**Chunking Example:**
```
❌ 5551234567
✅ 555-123-4567

❌ Long paragraph of text without breaks
✅ Short paragraphs
   With bullet points
   And subheadings
```

---

### Von Restorff Effect (Isolation Effect)

**Principle:** An item that stands out is more likely to be remembered.

**Application:**
- CTA buttons: Distinct color from other elements
- Pricing: Highlight recommended plan
- Important info: Visual differentiation
- New features: Badge or callout

**Example:**
```css
/* All buttons gray, primary stands out */
.btn { background: #E5E7EB; }
.btn-primary { background: #3B82F6; }

/* Recommended plan highlighted */
.pricing-card { border: 1px solid #E5E7EB; }
.pricing-card.popular { 
  border: 2px solid #3B82F6;
  box-shadow: var(--shadow-lg);
}
```

---

### Serial Position Effect

**Principle:** Items at the beginning (primacy) and end (recency) of a list are remembered best.

**Application:**
- Navigation: Most important items first and last
- Lists: Key info at top and bottom
- Forms: Most critical fields at start
- CTAs: Repeat at top and bottom of long pages

**Example:**
```
Navigation: Home | [key items] | Contact

Long landing page:
- CTA at hero (top)
- Content sections
- CTA repeated at bottom
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify behavior in the target environment.
