---
name: seo-optimizer
description: >-
  SEO fundamentals, E-E-A-T, Core Web Vitals, and Google algorithm principles.
  Triggers on: SEO, meta tags, sitemap, search ranking, OpenGraph.
  Coordinates with: web-core, perf-optimizer.
metadata:
  category: "specialized"
  version: "2.0.0"
  triggers: "SEO, meta tags, sitemap, ranking, OpenGraph, schema"
  success_metrics: "SEO score improved, meta tags complete"
  coordinates_with: "web-core, perf-optimizer, geo-spatial"
---

# SEO Optimizer — Search Engine Visibility

> E-E-A-T for trust. CWV for speed. Schema for rich snippets. Content rules for ranking.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| New website | Technical SEO checklist (7 items) |
| Content pages | E-E-A-T + Content SEO rules |
| Performance issues | Core Web Vitals targets |
| AI search visibility | Use `geo-spatial` skill instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| E-E-A-T framework (4 principles) | AI search (→ geo-spatial) |
| Content SEO (char limits) | Performance profiling (→ perf-optimizer) |
| Schema routing (5 types) | Web fundamentals (→ web-core) |
| Technical SEO checklist | HTML implementation |

**Expert decision skill:** Produces SEO recommendations. Does not modify pages.

---

## E-E-A-T Framework (4 Principles — Fixed)

| Principle | Signals |
|-----------|---------|
| **Experience** | First-hand knowledge, real examples |
| **Expertise** | Credentials, depth of knowledge |
| **Authoritativeness** | Backlinks, industry recognition |
| **Trustworthiness** | HTTPS, transparency, accuracy |

---

## Core Web Vitals (Fixed Targets)

| Metric | Good | Poor | Measures |
|--------|------|------|----------|
| **LCP** | < 2.5s | > 4.0s | Loading speed |
| **INP** | < 200ms | > 500ms | Interactivity |
| **CLS** | < 0.1 | > 0.25 | Visual stability |

---

## Content SEO (Fixed Rules)

| Element | Constraint |
|---------|-----------|
| Title tag | 50-60 chars, keyword front-loaded |
| Meta description | 150-160 chars, compelling CTA |
| H1 | One per page, contains main keyword |
| Alt text | Descriptive, not keyword-stuffed |

---

## Technical SEO Checklist (7 Items)

- [ ] XML sitemap submitted
- [ ] robots.txt configured
- [ ] Canonical tags on all pages
- [ ] HTTPS enabled
- [ ] Mobile-friendly (responsive)
- [ ] Clean URLs (no query params)
- [ ] Schema markup present

---

## Schema Routing (5 Types — Deterministic)

| Page Type | Schema Type |
|-----------|------------|
| Blog posts, news | `Article` |
| Company info | `Organization` |
| Q&A content | `FAQPage` |
| E-commerce | `Product` |
| Navigation | `BreadcrumbList` |

---

## Ranking Factors (Prioritized)

| Priority | Factor |
|----------|--------|
| 1 | Quality, relevant content |
| 2 | Backlinks from authority sites |
| 3 | Page experience (Core Web Vitals) |
| 4 | Mobile-first indexing |
| 5 | Technical SEO fundamentals |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_PAGE_TYPE` | Yes | Page type not one of 5 |
| `ERR_INVALID_CWV` | Yes | CWV scores not valid numbers |

**Zero internal retries.** Same page type = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Keyword stuff title/alt text | Use natural language with keyword |
| Skip meta descriptions | Write compelling 150-160 char descriptions |
| Ignore Core Web Vitals | Meet LCP/INP/CLS targets |
| Use generic schema | Route schema by page type |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [seo_checker.js](scripts/seo_checker.js) | Static SEO audit (title, meta, canonical, schema, robots) | Automated auditing |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `geo-spatial` | Skill | AI search (GEO) |
| `perf-optimizer` | Skill | Core Web Vitals |

---

⚡ PikaKit v3.9.80
