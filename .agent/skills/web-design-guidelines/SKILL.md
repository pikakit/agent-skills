---
name: web-design-guidelines
description: >-
  Review UI code for Web Interface Guidelines compliance and accessibility.
  WCAG, semantic HTML, UX patterns, visual design standards.
  Triggers on: UI review, accessibility, design audit, UX, WCAG.
  Coordinates with: design-system, frontend-design, code-review.
metadata:
  version: "2.0.0"
  category: "quality"
  triggers: "UI review, accessibility, design audit, UX, WCAG"
  success_metrics: "violations found, actionable fixes"
  coordinates_with: "design-system, frontend-design, code-review"
---

# Web Design Guidelines — UI Accessibility & UX Review

> 4 audit categories. 17 checks. WCAG 2.1 AA. file:line output.

---

## When to Use

| Request | Action |
|---------|--------|
| "Review my UI" | Full audit (4 categories) |
| "Check accessibility" | WCAG compliance (5 checks) |
| "Audit design" | Visual design standards |
| "Review UX" | UX pattern coverage |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| WCAG compliance (5 checks) | Design tokens (→ design-system) |
| Semantic HTML (4 replacements) | Visual design creation (→ frontend-design) |
| UX state coverage (4 states) | Code quality (→ code-review) |
| Visual design standards (4) | Automated scanning (axe/Lighthouse) |

**Expert decision skill:** Produces audit findings. Does not modify code.

---

## Accessibility / WCAG (5 Checks — Fixed)

| Check | Requirement | WCAG |
|-------|-------------|------|
| Alt text | All `<img>` need `alt` | 1.1.1 |
| Labels | Forms need `<label>` or `aria-label` | 1.3.1 |
| Contrast | Text ≥ 4.5:1, large text ≥ 3:1 | 1.4.3 |
| Focus | Visible focus indicators | 2.4.7 |
| ARIA | Proper roles and states | 4.1.2 |

---

## Semantic HTML (4 Replacements — Fixed)

| ❌ Instead of | ✅ Use |
|--------------|-------|
| `<div onClick>` | `<button>` |
| `<div class="nav">` | `<nav>` |
| `<div class="header">` | `<header>` |
| `<span>` for heading | `<h1>`-`<h6>` |

---

## UX Patterns (4 Required States)

| Pattern | Requirement |
|---------|-------------|
| Loading | Show loading state for async |
| Empty state | Handle no data |
| Error state | Clear error messages |
| Touch targets | ≥ 44×44px (WCAG 2.5.5) |

---

## Visual Design (4 Standards — Quantified)

| Check | Threshold |
|-------|-----------|
| Typography | Body text ≥ 16px |
| Spacing | Consistent rhythm |
| Color contrast | ≥ 4.5:1 |
| Responsive | Mobile-first breakpoints |

---

## Output Format

```
file:line - [severity] Issue description
components/Header.tsx:42 - [critical] Missing alt text on <img>
pages/signup.tsx:78 - [major] Form missing <label> elements
components/Button.tsx:23 - [major] Insufficient contrast (3.2:1)
```

---

## Quick Audit (3 Commands)

```bash
# Missing alt text
grep -rn "<img" --include="*.tsx" | grep -v "alt="

# Div used as button
grep -rn "onClick" --include="*.tsx" | grep "<div"

# Inputs without labels
grep -rn "<input" --include="*.tsx" | grep -v "aria-label\|<label"
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_NO_FILES` | Yes | No file paths provided |
| `ERR_UNSUPPORTED_FILE` | Yes | Not .tsx/.jsx/.vue/.svelte/.html |

**Zero internal retries.** Same code = same findings.

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `design-system` | Skill | Design tokens |
| `frontend-design` | Skill | Visual design |
| `code-review` | Skill | Code quality |

---

⚡ PikaKit v3.9.82
