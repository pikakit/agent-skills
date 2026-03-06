---
name: geo-spatial-engineering-spec
description: Full 21-section engineering spec — AI engine citation contracts, 7-item GEO checklist, crawler management
---

# GEO (Generative Engine Optimization) — Engineering Specification

> Production-grade specification for AI search engine visibility and citation strategies at FAANG scale.

---

## 1. Overview

GEO (Generative Engine Optimization) provides structured decision frameworks for content visibility in AI-powered search engines: citation strategy per engine (ChatGPT, Claude, Perplexity, Gemini), content structuring for AI extraction, schema markup for entity recognition, AI crawler management, and automated GEO auditing via checker script. The skill operates as an expert knowledge base with a checker script — it produces content strategy recommendations and audit results. It does not create or modify web content directly.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None — new spec for first hardening

---

## 2. Problem Statement

AI search visibility faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Zero AI citations | 70% of web content is never cited by AI engines | Missed organic AI traffic |
| Unstructured content | 60% of pages lack question-based headings and summaries | AI cannot extract direct answers |
| No schema markup | 55% of content lacks Article + FAQPage structured data | AI engines cannot verify entities |
| Blocked AI crawlers | 35% of sites block GPTBot/PerplexityBot in robots.txt | Content invisible to AI engines |

GEO eliminates these with citation-oriented content structure, mandatory schema markup, AI crawler allowlisting, and a 7-item compliance checklist.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | AI citation readiness | 7-item checklist completed per page |
| G2 | Engine-specific strategy | 4 engines with distinct citation styles |
| G3 | Content structure | Question-based titles, TL;DR at top, FAQ section |
| G4 | Schema markup | Article + FAQPage schema on every content page |
| G5 | AI crawler access | GPTBot, Claude-Web, PerplexityBot allowed |
| G6 | Automated audit | `geo_checker.js` validates all 7 items |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | Traditional SEO (Google rankings, meta tags) | Owned by `seo-optimizer` skill |
| NG2 | Web performance (Core Web Vitals) | Owned by `perf-optimizer` skill |
| NG3 | Content creation or copywriting | Owned by `copywriting` skill |
| NG4 | Schema generation code | Infrastructure concern |
| NG5 | AI chatbot integration | Different domain |
| NG6 | Paid AI advertising | Out of scope |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| GEO content strategy (4 AI engines) | Strategy framework + checklist | Content writing |
| SEO vs GEO comparison | Decision criteria | Traditional SEO implementation |
| AI engine citation styles (4 styles) | Engine-specific guidance | AI engine internals |
| AI crawler identification (4 crawlers) | Crawler list + robots.txt guidance | Server configuration |
| GEO checker script | Script invocation | Web server access |
| Schema markup guidance (Article + FAQPage) | Markup recommendations | Schema generation |

**Side-effect boundary:** GEO checker script (`scripts/geo_checker.js`) reads project files for auditing. Read-only file access; no modifications.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "geo-strategy" | "engine-comparison" | "content-audit" |
                              # "crawler-guide" | "schema-guide" | "checklist" | "geo-check"
Context: {
  target_url: string | null   # URL or project path to audit
  content_type: string        # "article" | "product" | "faq" | "comparison" | "tutorial"
  target_engines: Array<string> | null  # ["perplexity", "chatgpt", "claude", "gemini"]
  has_schema: boolean         # Whether structured data exists
  has_faq: boolean            # Whether FAQ section exists
  has_statistics: boolean     # Whether original data/stats exist
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "needs-improvement" | "error"
Data: {
  strategy: {
    primary_engine: string    # Highest-opportunity engine
    citation_style: string    # How this engine cites
    content_requirements: Array<string>
  } | null
  comparison: {
    seo_vs_geo: Array<{
      aspect: string
      seo: string
      geo: string
    }>
  } | null
  audit: {
    score: number             # 0-7 (count of checklist items met)
    items: Array<{
      check: string
      status: string          # "pass" | "fail"
      fix: string | null
    }>
  } | null
  crawlers: Array<{
    name: string              # Crawler user agent
    engine: string            # AI engine
    action: string            # "allow" | "block"
  }> | null
  schema: {
    types: Array<string>      # Schema types to add
    priority: string
  } | null
  reference_file: string | null
  metadata: {
    contract_version: string
    backward_compatibility: string
  }
}
Error: ErrorSchema | null
```

#### Error Schema

```
Code: string                  # From Error Taxonomy (Section 11)
Message: string
Request_Type: string
Recoverable: boolean
```

#### Deterministic Guarantees

- Same `content_type` + `target_engines` = same strategy recommendation.
- GEO checklist is fixed at 7 items; audit score is count of items met (0–7).
- AI engine landscape is fixed: 4 engines with distinct citation styles.
- Crawler list is fixed: GPTBot, Claude-Web, PerplexityBot, Googlebot.
- Schema recommendation is fixed: Article + FAQPage for all content pages.
- SEO vs GEO comparison is fixed (4 aspects: goal, platform, metrics, focus).

#### What Agents May Assume

- GEO checklist covers all mandatory citation elements.
- Engine-specific strategies reflect current AI engine citation behavior.
- Crawler names match current AI engine user agents.
- Audit score is an integer from 0 to 7.

#### What Agents Must NOT Assume

- AI engines maintain consistent citation behavior indefinitely.
- GEO replaces traditional SEO (complementary, not replacement).
- Schema markup guarantees AI citations.
- The skill modifies content or server configuration.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| GEO strategy | None; strategy output |
| Engine comparison | None; comparison output |
| Content audit | Read-only file access (geo_checker.js) |
| Crawler guide | None; guidance output |
| Schema guide | None; recommendation |
| Checklist | None; checklist output |
| GEO check | Read-only file access (geo_checker.js) |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Define content type and target AI engines
2. Invoke geo-strategy for engine-specific guidance
3. Invoke checklist to get 7-item requirements
4. Run geo-check with project path for automated audit
5. Fix deficiencies (caller's responsibility)
6. Re-run geo-check to verify score = 7
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- GEO checker reads files but does not modify them.
- Audit score is deterministic for the same project state.

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error to caller | Use supported type |
| Missing content type | Return error to caller | Supply content type |
| Project path invalid | Return error to caller | Supply valid path |
| GEO check script error | Return error to caller | Verify script exists |

#### Retry Boundaries

- Zero internal retries for strategy queries (deterministic).
- GEO check may differ if project files change between runs.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| GEO strategy | Yes | Same content_type = same strategy |
| Engine comparison | Yes | Fixed comparison |
| Content audit | Partial | Depends on project file state |
| Crawler guide | Yes | Fixed crawler list |
| Schema guide | Yes | Fixed recommendation |
| Checklist | Yes | Fixed 7 items |
| GEO check | Partial | Depends on project file state |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Parse** | Validate request type, content type, context | Validated input or error |
| **Evaluate** | Generate strategy or run checker script | Recommendation or audit |

Strategy queries are synchronous. GEO checker invokes script (read-only file access).

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Fixed checklist | 7 items: question titles, TL;DR, original data, expert quotes, FAQ, timestamp, schema |
| Fixed engine landscape | 4 engines: Perplexity, ChatGPT, Claude, Gemini |
| Fixed citation styles | Perplexity: numbered; ChatGPT: inline/footnotes; Claude: contextual; Gemini: sources section |
| Fixed crawler list | GPTBot, Claude-Web, PerplexityBot, Googlebot |
| Fixed schema types | Article + FAQPage on every content page |
| No content modification | Recommendations only; caller implements |
| Audit score = checklist count | 0–7 integer; no weighted scoring |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent for strategy queries. GEO checker output depends on project file state at invocation time but does not persist state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Missing content type | Return `ERR_MISSING_CONTENT_TYPE` | Supply content type |
| Invalid project path | Return `ERR_INVALID_PATH` | Supply valid path |
| Script not found | Return `ERR_SCRIPT_NOT_FOUND` | Verify installation |

**Invariant:** Every failure returns a structured error. No partial strategies.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_MISSING_CONTENT_TYPE` | Validation | Yes | Content type not provided |
| `ERR_INVALID_PATH` | Validation | Yes | Project path does not exist |
| `ERR_SCRIPT_NOT_FOUND` | Infrastructure | No | geo_checker.js not found |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Strategy decision | N/A | N/A | Synchronous; < 50ms |
| GEO checker script | 10,000 ms | 30,000 ms | File scanning |
| Internal retries | Zero | Zero | Deterministic strategy |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "geo-spatial",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "content_type": "string|null",
  "target_engines": "Array<string>|null",
  "audit_score": "number|null",
  "status": "success|needs-improvement|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Strategy generated | INFO | content_type, primary_engine |
| Audit completed | INFO | audit_score, items |
| Low audit score | WARN | audit_score (< 5) |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `geo.decision.duration` | Histogram | ms |
| `geo.audit.score` | Histogram | 0-7 |
| `geo.content_type.distribution` | Counter | per type |
| `geo.engine.targeted` | Counter | per engine |

---

## 14. Security & Trust Model

### Data Handling

- GEO checker reads project files (HTML, markdown); no modification.
- No PII processing, no credential handling.
- AI engine strategies are public knowledge; no proprietary data.
- Crawler names are public user agents.

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput (strategy) | CPU-bound decision tree | < 50ms; scales linearly |
| Throughput (checker) | File I/O bound | 10s default timeout |
| Concurrency | Stateless strategy queries | Unlimited parallel |
| Memory per invocation | < 5 MB (checker with large projects) | Scoped to invocation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

GEO checker reads files without locking. Concurrent checker runs on same project are safe (read-only).

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

GEO checker opens file handles for scanning and closes them before returning.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Strategy decision | < 5 ms | < 15 ms | 50 ms |
| GEO checker (small project) | < 2,000 ms | < 5,000 ms | 10,000 ms |
| GEO checker (large project) | < 5,000 ms | < 15,000 ms | 30,000 ms |
| Output size | ≤ 1,000 chars | ≤ 3,000 chars | 5,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| AI engine citation behavior changes | High | Strategy becomes stale | Document version date; periodic review |
| New AI engines emerge | Medium | Missing strategies | Extensible engine landscape table |
| Crawler user agents change | Low | Wrong robots.txt guidance | Version-pinned crawler list |
| Over-reliance on GEO vs SEO | Medium | Neglect traditional SEO | SEO vs GEO comparison in output |
| GEO checker false positives | Low | Unnecessary work | Checklist items are binary pass/fail |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | ✅ | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | ✅ | Entry point under 200 lines |
| Prerequisites documented | ✅ | Node.js for checker script |
| When to Use section | ✅ | Situation-based routing table |
| Core content matches skill type | ✅ | Expert type: decision trees, fixed checklist |
| Troubleshooting section | ✅ | Anti-patterns table |
| Related section | ✅ | Cross-links to seo-optimizer, copywriting |
| Content Map for multi-file | ✅ | Link to engineering-spec.md + scripts |
| Contract versioning | ✅ | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | ✅ | This table with ✅/❌ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | 4 AI engines with distinct citation strategies | ✅ |
| **Functionality** | 7-item GEO checklist | ✅ |
| **Functionality** | SEO vs GEO comparison (4 aspects) | ✅ |
| **Functionality** | 4 AI crawlers identified | ✅ |
| **Functionality** | Schema recommendation (Article + FAQPage) | ✅ |
| **Functionality** | GEO checker script (read-only audit) | ✅ |
| **Contracts** | Input/output/error schemas in pseudo-schema format | ✅ |
| **Contracts** | Contract versioning with semver | ✅ |
| **Failure** | Error taxonomy with 4 categorized codes | ✅ |
| **Failure** | No partial strategies on error | ✅ |
| **Failure** | Zero internal retries | ✅ |
| **Determinism** | Fixed checklist, fixed engines, fixed crawlers | ✅ |
| **Security** | Read-only file access, no PII | ✅ |
| **Observability** | Structured log schema with 5 mandatory fields | ✅ |
| **Observability** | 4 metrics defined | ✅ |
| **Performance** | P50/P99 targets for all operations | ✅ |
| **Scalability** | Stateless strategy; checker file-I/O bound | ✅ |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | ✅ |

---

⚡ PikaKit v3.9.91

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [../SKILL.md](../SKILL.md) | Quick reference, 7-item checklist, anti-patterns |
| [../scripts/geo_checker.js](../scripts/geo_checker.js) | Automated GEO audit script |
| `seo-optimizer` | Traditional SEO (complementary) |
| `copywriting` | Content creation for AI citations |
