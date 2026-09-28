# Seo Optimizer Full Agent Rules

> Deterministic compilation of 1 source rules for seo-optimizer v3.9.224. Do not edit directly.

## Rule Index

- [Technical SEO and Structured Data Quality Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Technical SEO and Structured Data Quality Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Technical SEO and Structured Data Quality Gate

## Preconditions

- Identify page hierarchy, primary keywords, target locale, canonical URLs, and indexation policy.
- Confirm robots.txt, sitemap.xml, and meta robots tags configuration.
- Identify required structured data types (Organization, Article, Product, BreadcrumbList).

## Procedure

1. Verify unique title tags and descriptive meta descriptions within length budgets (title ≤ 60 chars, description ≤ 160 chars).
2. Validate semantic heading hierarchy: single `<h1>` per page, sequential `<h2>`-`<h6>` tags without skipping levels.
3. Validate Open Graph and Twitter card meta tags, including canonical URL and absolute image paths.
4. Verify Schema.org JSON-LD markup conforms to schema validator criteria with zero syntax errors.
5. Check Core Web Vitals readiness: image alt attributes, responsive viewport tags, and prerendering considerations.

## Rollback

Revert metadata or indexing configuration changes if crawl errors, indexing de-listings, or structured data validation failures occur.

## Exit Gate

Pass when pages include verified canonical tags, structured data passes schema validation, title/meta tags fit length budgets, and sitemap entries resolve with 200 OK.
