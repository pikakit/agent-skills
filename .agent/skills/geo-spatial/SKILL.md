---
name: geo-spatial
description: >-
  Generative Engine Optimization for AI search engines (ChatGPT, Claude, Perplexity, Gemini).
  Citation strategies, content structure, schema markup, AI crawler management.
  Triggers on: GEO, AI search, citations, Perplexity, AI visibility.
  Coordinates with: seo-optimizer, copywriting.
metadata:
  version: "2.0.0"
  category: "specialized"
  triggers: "GEO, AI search, citations, Perplexity, AI visibility, RAG"
  success_metrics: "audit score 7/7, AI citation rate improved, schema markup present"
  coordinates_with: "seo-optimizer, copywriting"
---

# GEO — Generative Engine Optimization

> AI citations, not rankings. 7-item checklist. Article + FAQPage schema mandatory.

---

## Prerequisites

**Required:** Node.js (for `geo_checker.js` audit script).

---

## When to Use

| Situation | Action |
|-----------|--------|
| Want AI citations | Apply 7-item GEO checklist |
| Competing for AI visibility | Use engine-specific strategy |
| Need structured content | Add Article + FAQPage schema |
| Traditional SEO only | Use `seo-optimizer` instead |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| GEO content strategy (4 AI engines) | Traditional SEO (→ seo-optimizer) |
| 7-item GEO checklist | Content creation (→ copywriting) |
| AI crawler identification (4 crawlers) | Web performance (→ perf-optimizer) |
| Schema markup guidance | Schema code generation |
| GEO checker script (read-only audit) | Server/robots.txt configuration |

**Expert + script skill:** Produces strategies and runs read-only audits. No file modification.

---

## SEO vs GEO

| Aspect | SEO | GEO |
|--------|-----|-----|
| Goal | #1 ranking | AI citations |
| Platform | Google | ChatGPT, Perplexity, Claude, Gemini |
| Metrics | Rankings, CTR | Citation rate |
| Focus | Keywords | Entities, structured data |

---

## AI Engine Landscape

| Engine | Citation Style | Opportunity |
|--------|---------------|-------------|
| **Perplexity** | Numbered [1][2] | Highest citation rate |
| **ChatGPT** | Inline/footnotes | Custom GPTs |
| **Claude** | Contextual | Long-form content |
| **Gemini** | Sources section | SEO crossover |

---

## Content That Gets Cited

| Element | Why |
|---------|-----|
| **Original statistics** | Unique, citable data |
| **Expert quotes** | Authority transfer |
| **Clear definitions** | Easy to extract |
| **Comparison tables** | Structured information |
| **FAQ sections** | Direct answers |

---

## GEO Checklist (7 Items — Audit Score 0-7)

| # | Check |
|---|-------|
| 1 | Question-based titles |
| 2 | Summary/TL;DR at top |
| 3 | Original data with sources |
| 4 | Expert quotes (name, title) |
| 5 | FAQ section (3-5 Q&A) |
| 6 | "Last updated" timestamp |
| 7 | Article + FAQPage schema markup |

---

## AI Crawlers (Allow These)

| Crawler | Engine |
|---------|--------|
| GPTBot | ChatGPT/OpenAI |
| Claude-Web | Claude |
| PerplexityBot | Perplexity |
| Googlebot | Gemini |

---

## Quick Reference

```bash
node .agent/skills/geo-spatial/scripts/geo_checker.js <project_path>
```

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_MISSING_CONTENT_TYPE` | Yes | Content type not provided |
| `ERR_INVALID_PATH` | Yes | Project path invalid |
| `ERR_SCRIPT_NOT_FOUND` | No | geo_checker.js missing |

**Zero internal retries.** Deterministic; same content = same strategy.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Treat GEO as SEO replacement | Use GEO + SEO together |
| Skip FAQ sections | Add 3-5 Q&A per content page |
| Block AI crawlers | Allow GPTBot, PerplexityBot, Claude-Web |
| Use only keywords | Build entities with structured data |
| Skip schema markup | Article + FAQPage on every content page |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [engineering-spec.md](references/engineering-spec.md) | Full engineering spec | Architecture review |

| Script | Purpose |
|--------|---------|
| `scripts/geo_checker.js` | Automated GEO audit (read-only) |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `seo-optimizer` | Skill | Traditional SEO |
| `copywriting` | Skill | Content creation |

---

⚡ PikaKit v3.9.77
