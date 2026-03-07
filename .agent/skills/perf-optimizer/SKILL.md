---
name: perf-optimizer
summary: >-
  Performance profiling principles. Core Web Vitals, bundle analysis, runtime profiling.
  Triggers on: performance, slow, Lighthouse, bundle size, Core Web Vitals.
  Coordinates with: e2e-automation, web-core.
metadata:
  version: "2.0.0"
  category: "devops"
  triggers: "performance, slow, Lighthouse, bundle, Core Web Vitals"
  success_metrics: "LCP <2.5s, INP <200ms, CLS <0.1"
  coordinates_with: "e2e-automation, web-core"
---

# Performance Profiler — Core Web Vitals & Profiling

> Measure first. Profile second. Fix third. Validate last.

---

## When to Use

| Situation | Approach |
|-----------|----------|
| Slow page load | Run Lighthouse audit |
| Large bundle size | Use bundle analyzer |
| Runtime lag / jank | DevTools Performance tab |
| Memory growth | DevTools Memory tab |
| N+1 queries, caching | Read `backend-patterns.md` |

---

## System Boundaries

| Owned by This Skill | NOT Owned |
|---------------------|-----------|
| Core Web Vitals targets | Measurement execution |
| Tool selection (symptom → tool) | Tool installation |
| Bundle analysis guidance | Bundle build |
| Quick win prioritization | Code modification |

**Expert decision skill:** Produces profiling methodology. Does not run tools.

---

## Core Web Vitals (Fixed Targets)

| Metric | Good | Poor | Measures |
|--------|------|------|----------|
| **LCP** | < 2.5s | > 4.0s | Loading speed |
| **INP** | < 200ms | > 500ms | Interactivity |
| **CLS** | < 0.1 | > 0.25 | Visual stability |

| Stage | Tool |
|-------|------|
| Development | Local Lighthouse |
| CI/CD | Lighthouse CI |
| Production | RUM (Real User Monitoring) |

---

## 4-Step Profiling Workflow (Fixed)

```
1. BASELINE  → Measure current state
2. IDENTIFY  → Find the bottleneck
3. FIX       → Make targeted change
4. VALIDATE  → Confirm improvement
```

---

## Tool Selection (Deterministic)

| Symptom | Tool |
|---------|------|
| Page load speed | Lighthouse |
| Bundle size | Bundle analyzer |
| Runtime performance | DevTools Performance |
| Memory issues | DevTools Memory |
| Network latency | DevTools Network |

---

## Bundle Analysis (4 Issues → 4 Actions)

| Issue | Indicator | Action |
|-------|-----------|--------|
| Large dependency | Top of bundle | Import specific modules |
| Duplicate deps | Multiple chunks | Dedupe, update versions |
| Unused code | Low coverage | Tree shake |
| Missing code split | Single large chunk | Split by route |

---

## Runtime Profiling Patterns

| Pattern | Meaning |
|---------|---------|
| Long tasks (> 50ms) | UI blocking |
| Many small tasks | Batching opportunity |
| Layout/paint | Rendering bottleneck |
| Growing heap | Possible memory leak |
| Detached DOM | Not cleaned up |

---

## Quick Win Priorities (Ranked)

| Priority | Action | Impact |
|----------|--------|--------|
| 1 | Enable compression (gzip/brotli) | High |
| 2 | Lazy load images | High |
| 3 | Code split routes | High |
| 4 | Cache static assets | Medium |
| 5 | Use modern image formats (WebP/AVIF) | Medium |

---

## Error Taxonomy

| Code | Recoverable | Trigger |
|------|-------------|---------|
| `ERR_INVALID_REQUEST_TYPE` | No | Request type not supported |
| `ERR_UNKNOWN_SYMPTOM` | Yes | Symptom not in known set |
| `ERR_UNKNOWN_FRAMEWORK` | Yes | Framework not recognized |

**Zero internal retries.** Same symptom = same recommendation.

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Guess at bottlenecks | Profile first, then fix |
| Micro-adjust non-critical paths | Fix the biggest issue |
| Skip baseline measurement | Always measure before/after |
| Ignore real user data | Use RUM in production |

---

## 📑 Content Map

| File | Description | When to Read |
|------|-------------|--------------|
| [backend-patterns.md](backend-patterns.md) | N+1, caching, DB tuning | Backend performance |
| [scripts/lighthouse_audit.js](scripts/lighthouse_audit.js) | Lighthouse runner | Automated audit |
| [engineering-spec.md](references/engineering-spec.md) | Full spec | Architecture review |

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `/optimize` | Workflow | Performance workflow |
| `e2e-automation` | Skill | Performance testing |

---

⚡ PikaKit v3.9.100
