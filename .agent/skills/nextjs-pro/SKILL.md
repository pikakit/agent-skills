---
name: nextjs-pro
description: >-
  Next.js App Router patterns, Server Components, data fetching, routing, and caching.
  Use when working with Next.js projects, SSR/SSG/ISR, App Router files, or server actions.
  NOT for plain React SPA (use react-pro) or CSS styling (use tailwind-kit).
category: frontend-architect
triggers: ["Next.js", "App Router", "RSC", "React", "frontend", "SSR"]
coordinates_with: ["react-architect", "tailwind-kit", "perf-optimizer", "problem-checker", "code-craft"]
success_metrics: ["100% CWV Targets Met", "0 Server/Client Boundaries Errors", "0 IDE/Lint Errors"]
metadata:
  author: pikakit
  version: "3.9.119"
---

# Next.js Pro — App Router & React Performance

> Server-first. 3 data strategies. 4 route files. 57 rules. 8 categories. CWV targets.

**Philosophy:** Performance is a feature. Waterfalls are the enemy. Server first.

---

## 5 Must-Ask Questions (Before Any Development)

| # | Question | Options |
|---|----------|---------|
| 1 | Rendering Strategy? | SSR, SSG, ISR, CSR |
| 2 | Data Volatility? | Static, Periodic, Real-time |
| 3 | Authentication? | Middleware, Server Actions, Client |
| 4 | SEO/Metadata? | Dynamic metadata, sitemap |
| 5 | Interactivity Level? | Mostly static vs Highly interactive |

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
| Server/Client component decision | React architecture (→ react-architect) |
| Data fetching strategy (3 options) | CSS/styling (→ tailwind-kit) |
| Routing conventions (4 files) | Design system (→ design-system) |
| 57 performance rules (8 categories) | Performance profiling (→ perf-optimizer) |

**Expert decision skill:** Produces patterns and rule references. Does not write code.

---

## Server vs Client Decision (Binary)

```
Need useState / useEffect / event handlers?
├── YES → 'use client'
└── NO  → Server Component (default, no directive)
```

| Type | Use For |
|------|---------|
| **Server** | Data fetching, layouts, static content |
| **Client** | Forms, buttons, interactive UI |

---

## Data Fetching (3 Strategies — Fixed)

| Volatility | Strategy | Cache Config | Use Case |
|-----------|----------|-------------|----------|
| Static | Default | `cache: 'force-cache'` | Content pages |
| Periodic | ISR | `revalidate: 60` | Dynamic but cacheable |
| Real-time | Dynamic | `cache: 'no-store'` | Live data |

---

## Route Conventions (4 Files — Fixed)

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

## Audit Logging (OpenTelemetry)

| Event | Metadata Payload | Severity |
|-------|------------------|----------|
| `architecture_decision` | `{"component_type": "server|client", "reason": "..."}` | `INFO` |
| `data_fetching_audit` | `{"strategy": "static|isr|dynamic", "volatility": "..."}` | `INFO` |
| `build_verification` | `{"status": "pass|fail", "cwv_metrics_met": true}` | `INFO` |

All executions MUST emit the `build_verification` span before reporting completion.

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

| ❌ Don't | ✅ Do |
|---------|-------|
| `'use client'` everywhere | Server Component by default |
| Fetch data in Client Components | Fetch in Server Components |
| Barrel imports (`index.js`) | Direct imports |
| Nested awaits (waterfall) | `Promise.all()` (parallel) |
| Skip loading/error states | Use loading.tsx + error.tsx |
| Ignore IDE warnings/errors | Call `problem-checker` to auto-fix |

---

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | JavaScript Performance | HIGH | `js-` |
| 2 | Re-render Optimization | HIGH | `rerender-` |
| 3 | Rendering Performance | HIGH | `rendering-` |
| 4 | Server-Side Performance | HIGH | `server-` |
| 5 | Eliminating Waterfalls | MEDIUM | `async-` |
| 6 | Bundle Size Optimization | MEDIUM | `bundle-` |
| 7 | Client-Side Data Fetching | MEDIUM | `client-` |
| 8 | Advanced Patterns | MEDIUM | `advanced-` |
| 9 | Engineering Spec | LOW | `engineering-` |

## Quick Reference

### 1. JavaScript Performance (HIGH)

- `js-batch-dom-css` - Avoid interleaving style writes with layout reads.
- `js-cache-function-results` - Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.
- `js-cache-property-access` - Cache object property lookups in hot paths.
- `js-cache-storage` - localStorage, sessionStorage, and document.cookie are synchronous and expensive.
- `js-combine-iterations` - Multiple .filter() or .map() calls iterate the array multiple times.
- `js-early-exit` - Return early when result is determined to skip unnecessary processing.
- `js-hoist-regexp` - Don't create RegExp inside render.
- `js-index-maps` - Multiple .find() calls by the same key should use a Map.
- `js-length-check-first` - When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first.
- `js-min-max-loop` - Finding the smallest or largest element only requires a single pass through the array.
- `js-set-map-lookups` - Convert arrays to Set/Map for repeated membership checks.
- `js-tosorted-immutable` - .sort() mutates the array in place, which can cause bugs with React state and props.

### 2. Re-render Optimization (HIGH)

- `rerender-defer-reads` - Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.
- `rerender-dependencies` - Specify primitive dependencies instead of objects to minimize effect re-runs.
- `rerender-derived-state-no-effect` - If a value can be computed from current props/state, do not store it in state or update it in an effect.
- `rerender-derived-state` - Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.
- `rerender-functional-setstate` - When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable.
- `rerender-lazy-state-init` - Pass a function to useState for expensive initial values.
- `rerender-memo-with-default-value` - To address this issue, extract the default value into a constant.
- `rerender-memo` - Extract expensive work into memoized components to enable early returns before computation.
- `rerender-move-effect-to-event` - If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler.
- `rerender-simple-expression-in-memo` - Calling useMemo and comparing hook dependencies may consume more resources than the expression itself.
- `rerender-transitions` - Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.
- `rerender-use-ref-transient-values` - When a value changes frequently and you don't want a re-render on every update (e.g., mouse trackers, intervals, transient flags), store it in useRef instead of useState.

### 3. Rendering Performance (HIGH)

- `rendering-activity` - Use React's <Activity> to preserve state/DOM for expensive components that frequently toggle visibility.
- `rendering-animate-svg-wrapper` - Many browsers don't have hardware acceleration for CSS3 animations on SVG elements.
- `rendering-conditional-render` - Use explicit ternary operators (?
- `rendering-content-visibility` - Apply content-visibility: auto to defer off-screen rendering.
- `rendering-hoist-jsx` - Extract static JSX outside components to avoid re-creation.
- `rendering-hydration-no-flicker` - When rendering content that depends on client-side storage (localStorage, cookies), avoid both SSR breakage and post-hydration flickering by injecting a synchronous script that updates the DOM before React hydrates.
- `rendering-hydration-suppress-warning` - In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting).
- `rendering-svg-precision` - Reduce SVG coordinate precision to decrease file size.
- `rendering-usetransition-loading` - Use useTransition instead of manual useState for loading states.

### 4. Server-Side Performance (HIGH)

- `server-after-nonblocking` - Use Next.js's after() to schedule work that should execute after a response is sent.
- `server-auth-actions` - Always verify auth inside Server Actions — they are public endpoints like API routes
- `server-cache-lru` - React.cache() only works within one request.
- `server-cache-react` - Use React.cache() for server-side request deduplication.
- `server-dedup-props` - Do array/object transforms in client, not server — RSC deduplicates by reference, not value
- `server-parallel-fetching` - React Server Components execute sequentially within a tree.
- `server-serialization` - The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests.

### 5. Eliminating Waterfalls (MEDIUM)

- `async-api-routes` - In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.
- `async-defer-await` - Move await operations into the branches where they're actually used to avoid blocking code paths that don't need them.
- `async-dependencies` - For operations with partial dependencies, use better-all to maximize parallelism.
- `async-parallel` - When async operations have no interdependencies, execute them concurrently using Promise.all().
- `async-suspense-boundaries` - Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

### 6. Bundle Size Optimization (MEDIUM)

- `bundle-barrel-imports` - Import directly from source files instead of barrel files to avoid loading thousands of unused modules.
- `bundle-conditional` - Load large data or modules only when a feature is activated.
- `bundle-defer-third-party` - Analytics, logging, and error tracking don't block user interaction.
- `bundle-dynamic-imports` - Use next/dynamic to lazy-load large components not needed on initial render.
- `bundle-preload` - Preload heavy bundles before they're needed to reduce perceived latency.

### 7. Client-Side Data Fetching (MEDIUM)

- `client-event-listeners` - Use useSWRSubscription() to share global event listeners across component instances.
- `client-localstorage-schema` - Add version prefix to keys and store only needed fields.
- `client-passive-event-listeners` - Add { passive: true } to touch and wheel event listeners to enable immediate scrolling.
- `client-swr-dedup` - SWR enables request deduplication, caching, and revalidation across component instances.

### 8. Advanced Patterns (MEDIUM)

- `advanced-event-handler-refs` - Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.
- `advanced-init-once` - Do not put app-wide initialization that must run once per app load inside useEffect([]) of a component.
- `advanced-use-latest` - Access latest values in callbacks without adding them to dependency arrays.

### 9. Engineering Spec (LOW)

- `engineering-spec` - Next.js Pro — Engineering Specification

## How to Use

Read individual rule files for detailed explanations and code examples:

```
rules/advanced-event-handler-refs.md
rules/advanced-init-once.md
```

Each rule file contains:
- Brief explanation of why it matters
- Incorrect code example with explanation
- Correct code example with explanation
- Additional context and references

## Full Compiled Document

For the complete guide with all rules expanded: `AGENTS.md`


## 📑 Content Map

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
| [engineering-spec.md](rules/engineering-spec.md) | 1 | Full engineering spec | Architecture review |

**Selective reading:** Read ONLY the category relevant to current task.

---

## 🔗 Related

| Item | Type | Purpose |
|------|------|---------|
| `react-architect` | Skill | React patterns |
| `tailwind-kit` | Skill | Styling |
| `perf-optimizer` | Skill | Performance profiling |

---

⚡ PikaKit v3.9.119
