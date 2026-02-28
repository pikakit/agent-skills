---
name: web-design-guidelines
description: >-
  Review UI code for Web Interface Guidelines compliance and accessibility.
  WCAG, semantic HTML, UX patterns, visual design standards.
  Triggers on: UI review, accessibility, design audit, UX, WCAG.
  Coordinates with: design-system, frontend-design, code-review.
metadata:
  version: "1.0.0"
  category: "quality"
  triggers: "UI review, accessibility, design audit, UX, WCAG"
  success_metrics: "violations found, actionable fixes"
  coordinates_with: "design-system, frontend-design, code-review"
---

# Web Design Guidelines

> UI code review for accessibility and UX compliance.

---

## When to Use

| Request | Action |
|---------|--------|
| "Review my UI" | Audit components |
| "Check accessibility" | WCAG compliance |
| "Audit design" | UX patterns |
| "Review UX" | Interaction design |

---

## Check Categories

### Accessibility (WCAG)

| Check | Requirement |
|-------|-------------|
| Alt text | All `<img>` need `alt` |
| Labels | Forms need `<label>` |
| Contrast | Min 4.5:1 for text |
| Focus | Visible focus indicators |
| ARIA | Proper roles and states |

### Semantic HTML

| Instead of | Use |
|------------|-----|
| `<div onclick>` | `<button>` |
| `<div class="nav">` | `<nav>` |
| `<div class="header">` | `<header>` |
| `<span>` for heading | `<h1>`-`<h6>` |

### UX Patterns

| Pattern | Requirement |
|---------|-------------|
| Loading | Show loading state |
| Empty state | Handle no data |
| Error state | Clear error messages |
| Touch targets | Min 44x44px |

### Visual Design

| Check | Standard |
|-------|----------|
| Typography | Readable sizes (16px+ body) |
| Spacing | Consistent rhythm |
| Color | Sufficient contrast |
| Responsive | Mobile-first |

---

## Output Format

```markdown
file:line - Issue description

components/Header.tsx:42 - Missing alt text on <img>
pages/signup.tsx:78 - Form missing <label> elements
components/Button.tsx:23 - Insufficient contrast (3.2:1)
```

---

## Quick Audit

```bash
# Check for missing alt
grep -rn "<img" --include="*.tsx" | grep -v "alt="

# Check for div buttons
grep -rn "onClick" --include="*.tsx" | grep "<div"

# Find forms without labels
grep -rn "<input" --include="*.tsx" | grep -v "aria-label\|<label"
```

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design tokens |
| `frontend-design` | Skill | Visual design |
| `code-review` | Skill | Code quality |

---

⚡ PikaKit v3.9.67
