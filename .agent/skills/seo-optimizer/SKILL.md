---
name: seo-optimizer
description: This skill should be used when the user asks to audit technical SEO, improve search snippets, design structured data, or diagnose indexing and crawling issues.
metadata:
  id: seo-optimizer
  schema_version: "2.0.0"
  type: knowledge
  category: content
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: ["audit technical SEO", "improve search snippets", "design structured data", "diagnose indexing and crawling issues"]
  negative_triggers: ["profile runtime performance", "write long-form marketing content", "guarantee a search ranking"]
  coordinates_with: [perf-optimizer, copywriting, nextjs-pro]
  capabilities: ["crawlability review", "indexing diagnostics", "metadata review", "structured data design"]
  platforms: [web, Google Search]
  last_reviewed: "2026-09-28"
  review_interval_days: 180
---

# SEO Optimizer

Improve search accessibility and presentation without promising ranking outcomes.

## Workflow

1. Establish site purpose, audience, canonical hosts, rendering model, target markets, and measured baseline.
2. Verify crawl access, status codes, canonicalization, redirects, robots controls, sitemaps, internal links, and rendered content.
3. Make titles, descriptions, headings, link text, and visible content descriptive and page-specific.
4. Add structured data only when it represents visible content and follows the relevant schema and search feature policy.
5. Evaluate mobile usability and Core Web Vitals from field data when available; keep lab results distinct.
6. Validate with official testing tools and monitor coverage, enhancements, traffic, and regressions after release.

## Boundaries

Do not use hidden text, doorway pages, fabricated authority, review markup for nonexistent reviews, or automated content intended primarily to manipulate rankings. Route copy work to `copywriting` and runtime diagnosis to `perf-optimizer`.

Read `rules/production-gates.md` for evidence, rollout, and rollback criteria.
