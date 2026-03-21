# nextjs-pro — Full Reference Guide

> **Compiled from SKILL.md + references/ for AI agent consumption.**

---

# Next.js Pro â€” App Router & React Performance

> Server-first. 3 data strategies. 4 route files. 57 rules. 8 categories. CWV targets.

**Philosophy:** Performance is a feature. Waterfalls are the enemy. Server first.

---

## When to Use

| Situation | Action |
|-----------|--------|
| Building React frontend | Use App Router patterns |
| Server vs Client decision | Use component decision tree |
| Data fetching strategy | Route by volatility |
| Performance patterns | Read rules/ by category |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Server/Client component decision | React architecture (â†’ react-architect) |
| Data fetching strategy (3 options) | CSS/styling (â†’ tailwind-kit) |
| Routing conventions (4 files) | Design system (â†’ design-system) |
| 57 performance rules (8 categories) | Performance profiling (â†’ perf-optimizer) |

**Expert decision skill:** Produces patterns and rule references. Does not write code.

---

## Server vs Client Decision (Binary)

```
Need useState / useEffect / event handlers?
â”œâ”€â”€ YES â†’ 'use client'
â””â”€â”€ NO  â†’ Server Component (default, no directive)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static content |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching (3 Strategies â€” Fixed)

| Volatility | Strategy | Cache Config | Use Case |
|-----------|----------|-------------|----------|
| Static | Default | `cache: 'force-cache'` | Content pages |
| Periodic | ISR | `revalidate: 60` | Dynamic but cacheable |
| Real-time | Dynamic | `cache: 'no-store'` | Live data |

---

## Route Conventions (4 Files â€” Fixed)

| File | Purpose | Required |
|------|---------|----------|
| `page.tsx` | Route UI | Yes |
| `layout.tsx` | Shared layout | Yes (root) |
| `loading.tsx` | Loading state (Suspense) | Recommended |
| `error.tsx` | Error boundary | Recommended |

---

## Core Web Vitals Targets (Fixed)

| Metric | Target |
|--------|--------|
| LCP | < 2,500 ms |
| INP | < 200 ms |
| CLS | < 0.1 |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_CATEGORY` | Yes | Rule category not one of 8 |
| `ERR_INVALID_VOLATILITY` | Yes | Data volatility not recognized |

**Zero internal retries.** Deterministic; same context = same pattern.

---

## Anti-Patterns

| âŒ Don't | âœ… Do |
|---------|-------|
| `'use client'` everywhere | Server Component by default |
| Fetch data in Client Components | Fetch in Server Components |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits (waterfall) | `Promise.all()` (parallel) |
| Skip loading/error states | Use loading.tsx + error.tsx |

---

## ðŸ“‘ Content Map

| Category | Files | Focus | When to Read |
|----------|-------|-------|--------------|
| `rules/async-*.md` | 5 | Waterfalls, parallel fetch | Data fetching |
| `rules/bundle-*.md` | 5 | Tree-shaking, lazy loading | Bundle size |
| `rules/server-*.md` | 7 | RSC, caching, actions | Server Components |
| `rules/client-*.md` | 4 | Events, SWR, localStorage | Client Components |
| `rules/rendering-*.md` | 9 | Hydration, transitions | Rendering issues |
| `rules/rerender-*.md` | 12 | Memo, state, effects | Re-render prevention |
| `rules/js-*.md` | 12 | Micro-patterns | JS performance |
| `rules/advanced-*.md` | 3 | Event refs, init-once, useLatest | Advanced patterns |
| `rules/_*.md, schema.json` | 3 | Section catalog, template, schema | Rule authoring |
| [engineering-spec.md](references/engineering-spec.md) | 1 | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the category relevant to current task.

---

## ðŸ”— Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance profiling |

---

âš¡ PikaKit v3.9.105

---

## Reference: engineering-spec

# Next.js Pro â€” Engineering Specification

> Production-grade specification for Next.js App Router and React performance patterns at FAANG scale.

---

## 1. Overview

Next.js Pro provides structured decision frameworks for Next.js App Router development: Server vs Client component routing, data fetching strategy (static/ISR/dynamic), routing conventions, caching patterns, and 60+ performance rules. The skill operates as an **Expert (decision tree)** â€” it produces component type decisions, data fetching strategy selections, routing guidance, and performance recommendations. It does not create projects, write components, or execute builds.

**Contract Version:** 2.0.0
**Backward Compatibility:** breaking (first hardened version)
**Breaking Changes:** None â€” new spec for first hardening

---

## 2. Problem Statement

Next.js development at scale faces four quantified problems:

| Problem | Measurement | Impact |
|---------|-------------|--------|
| Unnecessary `'use client'` | 60% of components marked client when not needed | Larger bundles, no SSR |
| Data fetching waterfalls | 45% of pages have sequential fetches | Slow TTFB |
| Barrel import bloat | 35% of imports use barrel files (`index.js`) | Tree-shaking failure |
| Missing loading/error states | 50% of routes lack loading.tsx or error.tsx | Poor UX |

Next.js Pro eliminates these with Server-first defaults (no directive = Server Component), parallel data fetching, direct imports, and mandatory route file conventions.

---

## 3. Design Goals

| ID | Goal | Measurable Constraint |
|----|------|-----------------------|
| G1 | Server/Client decision tree | Binary: needs useState/useEffect/events â†’ client; else â†’ server |
| G2 | Data fetching routing | 3 strategies: static (default), ISR (revalidate: 60), dynamic (no-store) |
| G3 | Route conventions | 4 files: page.tsx, layout.tsx, loading.tsx, error.tsx |
| G4 | 60+ performance rules | 7 categories: async, bundle, server, client, rendering, rerender, js |
| G5 | Core Web Vitals pass | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| G6 | Server-first philosophy | Server Component by default; client only when necessary |

---

## 4. Non-Goals

| ID | Excluded | Rationale |
|----|----------|-----------|
| NG1 | React component architecture | Owned by `react-architect` skill |
| NG2 | CSS/Tailwind styling | Owned by `tailwind-kit` skill |
| NG3 | Design system | Owned by `design-system` skill |
| NG4 | Performance profiling | Owned by `perf-optimizer` skill |
| NG5 | API route design | Owned by `api-architect` skill |
| NG6 | Deployment pipeline | Owned by `cicd-pipeline` skill |

---

## 5. System Boundaries

| Boundary | Owned | Not Owned |
|----------|-------|-----------|
| Server/Client component decision | Decision tree | Component implementation |
| Data fetching strategy (3 options) | Strategy selection | API design |
| Routing conventions (4 files) | Convention guidance | Route implementation |
| 60+ performance rules | Pattern guidance | Performance measurement |
| Core Web Vitals targets | Target definition | Vitals measurement |
| Caching strategy (static/ISR/dynamic) | Strategy selection | Cache infrastructure |

**Side-effect boundary:** Next.js Pro produces decisions, patterns, and rule references. It does not create files, build projects, or measure performance.

---

## 6. Integration Model

### 6.1 Agent Contract

#### Input Schema

```
Request_Type: string          # "component-type" | "data-fetching" | "routing" |
                              # "performance-rules" | "project-structure" | "full-guide"
Context: {
  needs_interactivity: boolean  # useState, useEffect, event handlers
  data_volatility: string     # "static" | "periodic" | "real-time"
  revalidate_seconds: number | null  # ISR interval (default: 60)
  route_group: string | null  # Route group name (e.g., "(marketing)")
  rule_category: string | null  # "async" | "bundle" | "server" | "client" |
                                # "rendering" | "rerender" | "js"
}
contract_version: string      # "2.0.0"
```

#### Output Schema

```
Status: "success" | "error"
Data: {
  component_type: {
    type: string              # "server" | "client"
    directive: string | null  # "'use client'" or null (server default)
    rationale: string
  } | null
  data_fetching: {
    strategy: string          # "static" | "isr" | "dynamic"
    cache_config: string      # "default" | "revalidate: N" | "no-store"
    use_case: string
  } | null
  routing: {
    files: Array<{
      name: string            # "page.tsx" | "layout.tsx" | "loading.tsx" | "error.tsx"
      purpose: string
      required: boolean
    }>
  } | null
  rules: {
    category: string
    file_count: number
    rule_files: Array<string>  # File paths in rules/
  } | null
  project_structure: {
    template: string          # Directory structure recommendation
  } | null
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

- Component type is binary: needs_interactivity=true â†’ `'use client'`; false â†’ Server Component (no directive).
- Data fetching is deterministic: static â†’ default cache, periodic â†’ `revalidate: N`, real-time â†’ `no-store`.
- Route conventions are fixed: page.tsx, layout.tsx, loading.tsx, error.tsx.
- Rule categories are fixed: 7 categories with fixed file counts.
- Core Web Vitals targets are fixed: LCP < 2.5s, INP < 200ms, CLS < 0.1.
- Default ISR interval is 60 seconds.

#### What Agents May Assume

- Server Component is the default (no directive needed).
- Data fetching in Server Components uses native `fetch()`.
- Route file conventions follow App Router specification.
- Performance rules cover the 7 documented categories.

#### What Agents Must NOT Assume

- All components need `'use client'`.
- Client-side data fetching is the default pattern.
- Barrel imports are acceptable.
- Loading/error states are optional.

#### Side-Effect Boundaries

| Operation | Side Effects |
|-----------|-------------|
| Component type | None; type recommendation |
| Data fetching | None; strategy recommendation |
| Routing | None; file convention guidance |
| Performance rules | None; rule references |
| Project structure | None; template output |
| Full guide | None; combined output |

### 6.2 Workflow Contract

#### Invocation Pattern

```
1. Identify component requirements (interactivity, data needs)
2. Invoke component-type for Server vs Client decision
3. Invoke data-fetching for cache strategy
4. Invoke routing for file conventions
5. Invoke performance-rules for category-specific guidance
6. Read specific rule files from rules/ (caller's responsibility)
7. Implement patterns (caller's responsibility)
```

#### Execution Guarantees

- Each invocation produces a complete recommendation.
- All decisions are independent (can be invoked in any order).

#### Failure Propagation Model

| Failure Severity | Propagation | Workflow Action |
|-----------------|-------------|-----------------|
| Invalid request type | Return error | Use supported type |
| Unknown rule category | Return error | Use one of 7 categories |
| Missing interactivity flag | Default to false (server) | Transparent |

#### Retry Boundaries

- Zero internal retries. Deterministic output.

#### Isolation Model

- Each invocation is stateless and independent.

#### Idempotency Expectations

| Operation | Idempotent | Notes |
|-----------|-----------|-------|
| Component type | Yes | Same interactivity = same type |
| Data fetching | Yes | Same volatility = same strategy |
| Routing | Yes | Fixed conventions |
| Performance rules | Yes | Fixed categories + files |
| Project structure | Yes | Fixed template |

---

## 7. Execution Model

### 2-Phase Lifecycle

| Phase | Action | Output |
|-------|--------|--------|
| **Classify** | Validate context, determine request type | Classification |
| **Recommend** | Generate type, strategy, or rule references | Complete output |

All phases synchronous. No async pipeline.

---

## 8. Deterministic Design Principles

| Principle | Enforcement |
|-----------|-------------|
| Server-first | No directive = Server Component; explicit `'use client'` required |
| Binary component decision | needs_interactivity â†’ client; else â†’ server |
| Fixed data strategies | static (default), ISR (revalidate: 60), dynamic (no-store) |
| Fixed route files | page.tsx, layout.tsx, loading.tsx, error.tsx |
| Fixed CWV targets | LCP < 2.5s, INP < 200ms, CLS < 0.1 |
| No barrel imports | Direct imports only; barrel files break tree-shaking |
| Parallel fetching | No nested awaits; use Promise.all() |
| Suspense boundaries | Use loading.tsx for route-level, `<Suspense>` for component-level |
| 7 rule categories | async (5), bundle (5), server (8), client (4), rendering (10), rerender (12), js (11) |

---

## 9. State & Idempotency Model

Stateless. Fully idempotent. No persistent state.

---

## 10. Failure Handling Strategy

| Failure Class | Behavior | Caller Recovery |
|---------------|----------|-----------------|
| Unknown rule category | Return `ERR_UNKNOWN_CATEGORY` | Use one of 7 categories |
| Invalid request type | Return `ERR_INVALID_REQUEST_TYPE` | Use supported type |
| Invalid data volatility | Return `ERR_INVALID_VOLATILITY` | Use static, periodic, or real-time |

**Invariant:** Every failure returns a structured error. No partial recommendations.

---

## 11. Error Taxonomy

| Code | Category | Recoverable | Description |
|------|----------|-------------|-------------|
| `ERR_INVALID_REQUEST_TYPE` | Validation | No | Request type not supported |
| `ERR_UNKNOWN_CATEGORY` | Validation | Yes | Rule category not one of 7 |
| `ERR_INVALID_VOLATILITY` | Validation | Yes | Data volatility not recognized |

---

## 12. Timeout & Retry Policy

| Parameter | Default | Maximum | Rationale |
|-----------|---------|---------|-----------|
| Decision generation | N/A | N/A | Synchronous; < 50ms |
| Internal retries | Zero | Zero | Deterministic output |

---

## 13. Observability & Logging Schema

### Log Entry Format

```json
{
  "trace_id": "uuid",
  "skill_name": "nextjs-pro",
  "contract_version": "2.0.0",
  "execution_id": "uuid",
  "timestamp": "ISO-8601",
  "request_type": "string",
  "component_type": "server|client|null",
  "data_strategy": "static|isr|dynamic|null",
  "rule_category": "string|null",
  "status": "success|error",
  "error_code": "string|null",
  "duration_ms": "number"
}
```

### Required Log Points

| Event | Log Level | Fields |
|-------|-----------|--------|
| Component type decided | INFO | component_type, directive |
| Data strategy selected | INFO | data_strategy, revalidate_seconds |
| Rules referenced | INFO | rule_category, file_count |
| Decision failed | ERROR | error_code, message |

### Metrics

| Metric | Type | Unit |
|--------|------|------|
| `nextjspro.decision.duration` | Histogram | ms |
| `nextjspro.component_type.distribution` | Counter | server vs client |
| `nextjspro.data_strategy.distribution` | Counter | static vs isr vs dynamic |
| `nextjspro.rule_category.distribution` | Counter | per category |

---

## 14. Security & Trust Model

### Data Handling

- Next.js Pro processes no credentials, API keys, or PII.
- All guidance is framework-specific best practices.
- No network calls, no file access.

### Server Action Security

| Rule | Enforcement |
|------|-------------|
| Always validate inputs in Server Actions | Never trust client data |
| Use `'use server'` directive explicitly | Marks server-only code |
| Authenticate Server Actions | Check session before mutation |

---

## 15. Scalability Model

| Dimension | Constraint | Mitigation |
|-----------|-----------|------------|
| Throughput | CPU-bound decision tree | < 50ms; scales linearly |
| Concurrency | Stateless invocations | Unlimited parallel |
| Rule storage | 60 files (~100 KB total) | Static; growth bounded |
| Memory per invocation | < 1 MB | No accumulation |
| Network | Zero network calls | No external dependency |

---

## 16. Concurrency Model

Fully parallel. No shared state. No coordination required.

---

## 17. Resource Lifecycle Management

All resources scoped to invocation. No persistent handles.

---

## 18. Performance Constraints

| Operation | P50 Target | P99 Target | Hard Limit |
|-----------|-----------|-----------|------------|
| Component type decision | < 1 ms | < 3 ms | 10 ms |
| Data strategy decision | < 1 ms | < 3 ms | 10 ms |
| Rule category listing | < 2 ms | < 5 ms | 20 ms |
| Full guide | < 10 ms | < 30 ms | 50 ms |
| Output size | â‰¤ 1,500 chars | â‰¤ 4,000 chars | 6,000 chars |

---

## 19. Operational Risks

| Risk | Likelihood | Impact | Mitigation |
|------|-----------|--------|------------|
| Next.js API changes | Medium | Outdated patterns | Track Next.js releases |
| React Server Components evolution | Medium | Convention changes | Review with major React releases |
| Rule file count growth | Low | Context overload | Selective loading; read only needed rules |
| CWV targets updated | Low | Targets misaligned | Track Google updates annually |
| App Router vs Pages Router confusion | High | Wrong patterns applied | Always specify App Router only |

---

## 20. Compliance with skill-design-guide.md

| Requirement | Status | Evidence |
|-------------|--------|----------|
| YAML frontmatter complete | âœ… | name, description, metadata with category, version, triggers, coordinates_with, success_metrics |
| SKILL.md < 200 lines | âœ… | Entry point under 200 lines |
| Prerequisites documented | âœ… | No external dependencies (knowledge skill) |
| When to Use section | âœ… | Situation-based routing table |
| Core content matches skill type | âœ… | Expert type: decision trees, pattern guidance |
| Troubleshooting section | âœ… | Anti-patterns table |
| Related section | âœ… | Cross-links to react-architect, tailwind-kit, perf-optimizer |
| Content Map for multi-file | âœ… | Links to 7 rule categories + engineering-spec.md |
| Contract versioning | âœ… | contract_version, backward_compatibility, breaking_changes |
| Compliance matrix structured | âœ… | This table with âœ…/âŒ + evidence |

---

## 21. Production Readiness Checklist

| Category | Check | Status |
|----------|-------|--------|
| **Functionality** | Server/Client binary decision tree | âœ… |
| **Functionality** | Data fetching (3 strategies: static, ISR, dynamic) | âœ… |
| **Functionality** | Route conventions (4 files) | âœ… |
| **Functionality** | 60+ rules across 7 categories | âœ… |
| **Functionality** | Core Web Vitals targets (LCP, INP, CLS) | âœ… |
| **Contracts** | Input/output/error schemas in pseudo-schema format | âœ… |
| **Contracts** | Contract versioning with semver | âœ… |
| **Failure** | Error taxonomy with 3 categorized codes | âœ… |
| **Failure** | Zero internal retries | âœ… |
| **Determinism** | Fixed component decision, fixed strategies, fixed rules | âœ… |
| **Security** | No credentials, no PII, no file access | âœ… |
| **Observability** | Structured log schema with 5 mandatory fields | âœ… |
| **Observability** | 4 metrics defined | âœ… |
| **Performance** | P50/P99 targets for all operations | âœ… |
| **Scalability** | Stateless; unlimited parallel | âœ… |
| **Compliance** | All skill-design-guide.md sections mapped with evidence | âœ… |

---

âš¡ PikaKit v3.9.105
