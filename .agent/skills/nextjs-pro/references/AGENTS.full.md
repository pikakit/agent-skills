# Nextjs Pro Full Agent Rules

> Deterministic compilation of 58 source rules for nextjs-pro v4.0.0. Do not edit directly.

## Rule Index

- [Store Event Handlers in Refs](#rule-advanced-event-handler-refs) (standard, code, source: `rules/advanced-event-handler-refs.md`)
- [Initialize App Once, Not Per Mount](#rule-advanced-init-once) (standard, code, source: `rules/advanced-init-once.md`)
- [useEffectEvent for Stable Callback Refs](#rule-advanced-use-latest) (standard, code, source: `rules/advanced-use-latest.md`)
- [Prevent Waterfall Chains in API Routes](#rule-async-api-routes) (critical, code, source: `rules/async-api-routes.md`)
- [Defer Await Until Needed](#rule-async-defer-await) (high, code, source: `rules/async-defer-await.md`)
- [Dependency-Based Parallelization](#rule-async-dependencies) (critical, code, source: `rules/async-dependencies.md`)
- [Promise.all() for Independent Operations](#rule-async-parallel) (critical, code, source: `rules/async-parallel.md`)
- [Strategic Suspense Boundaries](#rule-async-suspense-boundaries) (high, code, source: `rules/async-suspense-boundaries.md`)
- [Avoid Barrel File Imports](#rule-bundle-barrel-imports) (critical, code, source: `rules/bundle-barrel-imports.md`)
- [Conditional Module Loading](#rule-bundle-conditional) (high, reference, source: `rules/bundle-conditional.md`)
- [Defer Non-Critical Third-Party Libraries](#rule-bundle-defer-third-party) (standard, code, source: `rules/bundle-defer-third-party.md`)
- [Dynamic Imports for Heavy Components](#rule-bundle-dynamic-imports) (critical, code, source: `rules/bundle-dynamic-imports.md`)
- [Preload Based on User Intent](#rule-bundle-preload) (standard, reference, source: `rules/bundle-preload.md`)
- [Deduplicate Global Event Listeners](#rule-client-event-listeners) (standard, code, source: `rules/client-event-listeners.md`)
- [Version and Minimize localStorage Data](#rule-client-localstorage-schema) (standard, code, source: `rules/client-localstorage-schema.md`)
- [Use Passive Event Listeners for Scrolling Performance](#rule-client-passive-event-listeners) (standard, code, source: `rules/client-passive-event-listeners.md`)
- [Use SWR for Automatic Deduplication](#rule-client-swr-dedup) (standard, code, source: `rules/client-swr-dedup.md`)
- [Avoid Layout Thrashing](#rule-js-batch-dom-css) (standard, code, source: `rules/js-batch-dom-css.md`)
- [Cache Repeated Function Calls](#rule-js-cache-function-results) (standard, code, source: `rules/js-cache-function-results.md`)
- [Cache Property Access in Loops](#rule-js-cache-property-access) (standard, code, source: `rules/js-cache-property-access.md`)
- [Cache Storage API Calls](#rule-js-cache-storage) (standard, code, source: `rules/js-cache-storage.md`)
- [Combine Multiple Array Iterations](#rule-js-combine-iterations) (standard, code, source: `rules/js-combine-iterations.md`)
- [Early Return from Functions](#rule-js-early-exit) (standard, code, source: `rules/js-early-exit.md`)
- [Hoist RegExp Creation](#rule-js-hoist-regexp) (standard, code, source: `rules/js-hoist-regexp.md`)
- [Build Index Maps for Repeated Lookups](#rule-js-index-maps) (standard, code, source: `rules/js-index-maps.md`)
- [Early Length Check for Array Comparisons](#rule-js-length-check-first) (standard, code, source: `rules/js-length-check-first.md`)
- [Use Loop for Min/Max Instead of Sort](#rule-js-min-max-loop) (standard, code, source: `rules/js-min-max-loop.md`)
- [Use Set/Map for O(1) Lookups](#rule-js-set-map-lookups) (standard, code, source: `rules/js-set-map-lookups.md`)
- [Use toSorted() Instead of sort() for Immutability](#rule-js-tosorted-immutable) (standard, code, source: `rules/js-tosorted-immutable.md`)
- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Use Activity Component for Show/Hide](#rule-rendering-activity) (standard, reference, source: `rules/rendering-activity.md`)
- [Animate SVG Wrapper Instead of SVG Element](#rule-rendering-animate-svg-wrapper) (standard, code, source: `rules/rendering-animate-svg-wrapper.md`)
- [Use Explicit Conditional Rendering](#rule-rendering-conditional-render) (standard, code, source: `rules/rendering-conditional-render.md`)
- [CSS content-visibility for Long Lists](#rule-rendering-content-visibility) (high, reference, source: `rules/rendering-content-visibility.md`)
- [Hoist Static JSX Elements](#rule-rendering-hoist-jsx) (standard, code, source: `rules/rendering-hoist-jsx.md`)
- [Prevent Hydration Mismatch Without Flickering](#rule-rendering-hydration-no-flicker) (standard, code, source: `rules/rendering-hydration-no-flicker.md`)
- [Suppress Expected Hydration Mismatches](#rule-rendering-hydration-suppress-warning) (standard, code, source: `rules/rendering-hydration-suppress-warning.md`)
- [Optimize SVG Precision](#rule-rendering-svg-precision) (standard, code, source: `rules/rendering-svg-precision.md`)
- [Use useTransition Over Manual Loading States](#rule-rendering-usetransition-loading) (standard, code, source: `rules/rendering-usetransition-loading.md`)
- [Defer State Reads to Usage Point](#rule-rerender-defer-reads) (standard, code, source: `rules/rerender-defer-reads.md`)
- [Narrow Effect Dependencies](#rule-rerender-dependencies) (standard, code, source: `rules/rerender-dependencies.md`)
- [Calculate Derived State During Rendering](#rule-rerender-derived-state-no-effect) (standard, code, source: `rules/rerender-derived-state-no-effect.md`)
- [Subscribe to Derived State](#rule-rerender-derived-state) (standard, code, source: `rules/rerender-derived-state.md`)
- [Use Functional setState Updates](#rule-rerender-functional-setstate) (standard, code, source: `rules/rerender-functional-setstate.md`)
- [Use Lazy State Initialization](#rule-rerender-lazy-state-init) (standard, code, source: `rules/rerender-lazy-state-init.md`)
- [Extract Default Non-primitive Parameter Value from Memoized Component to Constant](#rule-rerender-memo-with-default-value) (standard, code, source: `rules/rerender-memo-with-default-value.md`)
- [Extract to Memoized Components](#rule-rerender-memo) (standard, code, source: `rules/rerender-memo.md`)
- [Put Interaction Logic in Event Handlers](#rule-rerender-move-effect-to-event) (standard, code, source: `rules/rerender-move-effect-to-event.md`)
- [Do not wrap a simple expression with a primitive result type in useMemo](#rule-rerender-simple-expression-in-memo) (standard, code, source: `rules/rerender-simple-expression-in-memo.md`)
- [Use Transitions for Non-Urgent Updates](#rule-rerender-transitions) (standard, code, source: `rules/rerender-transitions.md`)
- [Use useRef for Transient Values](#rule-rerender-use-ref-transient-values) (standard, code, source: `rules/rerender-use-ref-transient-values.md`)
- [Use after() for Non-Blocking Operations](#rule-server-after-nonblocking) (standard, code, source: `rules/server-after-nonblocking.md`)
- [Authenticate Server Actions Like API Routes](#rule-server-auth-actions) (critical, code, source: `rules/server-auth-actions.md`)
- [Cross-Request LRU Caching](#rule-server-cache-lru) (high, reference, source: `rules/server-cache-lru.md`)
- [Per-Request Deduplication with React.cache()](#rule-server-cache-react) (standard, code, source: `rules/server-cache-react.md`)
- [Avoid Duplicate Serialization in RSC Props](#rule-server-dedup-props) (standard, code, source: `rules/server-dedup-props.md`)
- [Parallel Data Fetching with Component Composition](#rule-server-parallel-fetching) (critical, code, source: `rules/server-parallel-fetching.md`)
- [Minimize Serialization at RSC Boundaries](#rule-server-serialization) (high, code, source: `rules/server-serialization.md`)

<a id="rule-advanced-event-handler-refs"></a>

## Store Event Handlers in Refs

**Impact:** standard
**Kind:** code
**Source:** `rules/advanced-event-handler-refs.md`

# Store Event Handlers in Refs

## Store Event Handlers in Refs

Store callbacks in refs when used in effects that shouldn't re-subscribe on callback changes.

## Incorrect
```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  useEffect(() => {
    window.addEventListener(event, handler)
    return () => window.removeEventListener(event, handler)
  }, [event, handler])
}
```

## Correct
```tsx
function useWindowEvent(event: string, handler: (e) => void) {
  const handlerRef = useRef(handler)
  useEffect(() => {
    handlerRef.current = handler
  }, [handler])

  useEffect(() => {
    const listener = (e) => handlerRef.current(e)
    window.addEventListener(event, listener)
    return () => window.removeEventListener(event, listener)
  }, [event])
}
```

**Alternative: use `useEffectEvent` if you're on latest React:**

```tsx
import { useEffectEvent } from 'react'

function useWindowEvent(event: string, handler: (e) => void) {
  const onEvent = useEffectEvent(handler)

  useEffect(() => {
    window.addEventListener(event, onEvent)
    return () => window.removeEventListener(event, onEvent)
  }, [event])
}
```

`useEffectEvent` provides a cleaner API for the same pattern: it creates a stable function reference that always calls the latest version of the handler.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-advanced-init-once"></a>

## Initialize App Once, Not Per Mount

**Impact:** standard
**Kind:** code
**Source:** `rules/advanced-init-once.md`

# Initialize App Once, Not Per Mount

## Initialize App Once, Not Per Mount

Do not put app-wide initialization that must run once per app load inside `useEffect([])` of a component. Components can remount and effects will re-run. Use a module-level guard or top-level init in the entry module instead.

## Incorrect
```tsx
function Comp() {
  useEffect(() => {
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

## Correct
```tsx
let didInit = false

function Comp() {
  useEffect(() => {
    if (didInit) return
    didInit = true
    loadFromStorage()
    checkAuthToken()
  }, [])

  // ...
}
```

Reference: [Initializing the application](https://react.dev/learn/you-might-not-need-an-effect#initializing-the-application)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-advanced-use-latest"></a>

## useEffectEvent for Stable Callback Refs

**Impact:** standard
**Kind:** code
**Source:** `rules/advanced-use-latest.md`

# useEffectEvent for Stable Callback Refs

## useEffectEvent for Stable Callback Refs

Access latest values in callbacks without adding them to dependency arrays. Prevents effect re-runs while avoiding stale closures.

## Incorrect
```tsx
function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')

  useEffect(() => {
    const timeout = setTimeout(() => onSearch(query), 300)
    return () => clearTimeout(timeout)
  }, [query, onSearch])
}
```

## Correct
```tsx
import { useEffectEvent } from 'react';

function SearchInput({ onSearch }: { onSearch: (q: string) => void }) {
  const [query, setQuery] = useState('')
  const onSearchEvent = useEffectEvent(onSearch)

  useEffect(() => {
    const timeout = setTimeout(() => onSearchEvent(query), 300)
    return () => clearTimeout(timeout)
  }, [query])
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-async-api-routes"></a>

## Prevent Waterfall Chains in API Routes

**Impact:** critical
**Kind:** code
**Source:** `rules/async-api-routes.md`

# Prevent Waterfall Chains in API Routes

## Prevent Waterfall Chains in API Routes

In API routes and Server Actions, start independent operations immediately, even if you don't await them yet.

## Incorrect
```typescript
export async function GET(request: Request) {
  const session = await auth()
  const config = await fetchConfig()
  const data = await fetchData(session.user.id)
  return Response.json({ data, config })
}
```

## Correct
```typescript
export async function GET(request: Request) {
  const sessionPromise = auth()
  const configPromise = fetchConfig()
  const session = await sessionPromise
  const [config, data] = await Promise.all([
    configPromise,
    fetchData(session.user.id)
  ])
  return Response.json({ data, config })
}
```

For operations with more complex dependency chains, use `better-all` to automatically maximize parallelism (see Dependency-Based Parallelization).

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-async-defer-await"></a>

## Defer Await Until Needed

**Impact:** high
**Kind:** code
**Source:** `rules/async-defer-await.md`

# Defer Await Until Needed

## Defer Await Until Needed

Move `await` operations into the branches where they're actually used to avoid blocking code paths that don't need them.

## Incorrect
```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  const userData = await fetchUserData(userId)

  if (skipProcessing) {
    // Returns immediately but still waited for userData
    return { skipped: true }
  }

  // Only this branch uses userData
  return processUserData(userData)
}
```

## Correct
```typescript
async function handleRequest(userId: string, skipProcessing: boolean) {
  if (skipProcessing) {
    // Returns immediately without waiting
    return { skipped: true }
  }

  // Fetch only when needed
  const userData = await fetchUserData(userId)
  return processUserData(userData)
}
```

**Another example (early return optimization):**

```typescript
// Incorrect: always fetches permissions
async function updateResource(resourceId: string, userId: string) {
  const permissions = await fetchPermissions(userId)
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}

// Correct: fetches only when needed
async function updateResource(resourceId: string, userId: string) {
  const resource = await getResource(resourceId)

  if (!resource) {
    return { error: 'Not found' }
  }

  const permissions = await fetchPermissions(userId)

  if (!permissions.canEdit) {
    return { error: 'Forbidden' }
  }

  return await updateResourceData(resource, permissions)
}
```

This optimization is especially valuable when the skipped branch is frequently taken, or when the deferred operation is expensive.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-async-dependencies"></a>

## Dependency-Based Parallelization

**Impact:** critical
**Kind:** code
**Source:** `rules/async-dependencies.md`

# Dependency-Based Parallelization

## Dependency-Based Parallelization

For operations with partial dependencies, use `better-all` to maximize parallelism. It automatically starts each task at the earliest possible moment.

## Incorrect
```typescript
const [user, config] = await Promise.all([
  fetchUser(),
  fetchConfig()
])
const profile = await fetchProfile(user.id)
```

## Correct
```typescript
import { all } from 'better-all'

const { user, config, profile } = await all({
  async user() { return fetchUser() },
  async config() { return fetchConfig() },
  async profile() {
    return fetchProfile((await this.$.user).id)
  }
})
```

**Alternative without extra dependencies:**

We can also create all the promises first, and do `Promise.all()` at the end.

```typescript
const userPromise = fetchUser()
const profilePromise = userPromise.then(user => fetchProfile(user.id))

const [user, config, profile] = await Promise.all([
  userPromise,
  fetchConfig(),
  profilePromise
])
```

Reference: [https://github.com/shuding/better-all](https://github.com/shuding/better-all)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-async-parallel"></a>

## Promise.all() for Independent Operations

**Impact:** critical
**Kind:** code
**Source:** `rules/async-parallel.md`

# Promise.all() for Independent Operations

## Promise.all() for Independent Operations

When async operations have no interdependencies, execute them concurrently using `Promise.all()`.

## Incorrect
```typescript
const user = await fetchUser()
const posts = await fetchPosts()
const comments = await fetchComments()
```

## Correct
```typescript
const [user, posts, comments] = await Promise.all([
  fetchUser(),
  fetchPosts(),
  fetchComments()
])
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-async-suspense-boundaries"></a>

## Strategic Suspense Boundaries

**Impact:** high
**Kind:** code
**Source:** `rules/async-suspense-boundaries.md`

# Strategic Suspense Boundaries

## Strategic Suspense Boundaries

Instead of awaiting data in async components before returning JSX, use Suspense boundaries to show the wrapper UI faster while data loads.

## Incorrect
```tsx
async function Page() {
  const data = await fetchData() // Blocks entire page

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <DataDisplay data={data} />
      </div>
      <div>Footer</div>
    </div>
  )
}
```

The entire layout waits for data even though only the middle section needs it.

## Correct
```tsx
function Page() {
  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <div>
        <Suspense fallback={<Skeleton />}>
          <DataDisplay />
        </Suspense>
      </div>
      <div>Footer</div>
    </div>
  )
}

async function DataDisplay() {
  const data = await fetchData() // Only blocks this component
  return <div>{data.content}</div>
}
```

Sidebar, Header, and Footer render immediately. Only DataDisplay waits for data.

**Alternative (share promise across components):**

```tsx
function Page() {
  // Start fetch immediately, but don't await
  const dataPromise = fetchData()

  return (
    <div>
      <div>Sidebar</div>
      <div>Header</div>
      <Suspense fallback={<Skeleton />}>
        <DataDisplay dataPromise={dataPromise} />
        <DataSummary dataPromise={dataPromise} />
      </Suspense>
      <div>Footer</div>
    </div>
  )
}

function DataDisplay({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Unwraps the promise
  return <div>{data.content}</div>
}

function DataSummary({ dataPromise }: { dataPromise: Promise<Data> }) {
  const data = use(dataPromise) // Reuses the same promise
  return <div>{data.summary}</div>
}
```

Both components share the same promise, so only one fetch occurs. Layout renders immediately while both components wait together.

**When NOT to use this pattern:**

- Critical data needed for layout decisions (affects positioning)
- SEO-critical content above the fold
- Small, fast queries where suspense overhead isn't worth it
- When you want to avoid layout shift (loading → content jump)

**Trade-off:** Faster initial paint vs potential layout shift. Choose based on your UX priorities.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-bundle-barrel-imports"></a>

## Avoid Barrel File Imports

**Impact:** critical
**Kind:** code
**Source:** `rules/bundle-barrel-imports.md`

# Avoid Barrel File Imports

## Avoid Barrel File Imports

Import directly from source files instead of barrel files to avoid loading thousands of unused modules. **Barrel files** are entry points that re-export multiple modules (e.g., `index.js` that does `export * from './module'`).

Popular icon and component libraries can have **up to 10,000 re-exports** in their entry file. For many React packages, **it takes 200-800ms just to import them**, affecting both development speed and production cold starts.

**Why tree-shaking doesn't help:** When a library is marked as external (not bundled), the bundler can't optimize it. If you bundle it to enable tree-shaking, builds become substantially slower analyzing the entire module graph.

## Incorrect
```tsx
import { Check, X, Menu } from 'lucide-react'
// Loads 1,583 modules, takes ~2.8s extra in dev
// Runtime cost: 200-800ms on every cold start

import { Button, TextField } from '@mui/material'
// Loads 2,225 modules, takes ~4.2s extra in dev
```

## Correct
```tsx
import Check from 'lucide-react/dist/esm/icons/check'
import X from 'lucide-react/dist/esm/icons/x'
import Menu from 'lucide-react/dist/esm/icons/menu'
// Loads only 3 modules (~2KB vs ~1MB)

import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
// Loads only what you use
```

**Alternative (Next.js 13.5+):**

```js
// next.config.js - use optimizePackageImports
module.exports = {
  experimental: {
    optimizePackageImports: ['lucide-react', '@mui/material']
  }
}

// Then you can keep the ergonomic barrel imports:
import { Check, X, Menu } from 'lucide-react'
// Automatically transformed to direct imports at build time
```

Direct imports provide 15-70% faster dev boot, 28% faster builds, 40% faster cold starts, and significantly faster HMR.

Libraries commonly affected: `lucide-react`, `@mui/material`, `@mui/icons-material`, `@tabler/icons-react`, `react-icons`, `@headlessui/react`, `@radix-ui/react-*`, `lodash`, `ramda`, `date-fns`, `rxjs`, `react-use`.

Reference: [How we optimized package imports in Next.js](https://vercel.com/blog/how-we-optimized-package-imports-in-next-js)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-bundle-conditional"></a>

## Conditional Module Loading

**Impact:** high
**Kind:** reference
**Source:** `rules/bundle-conditional.md`

# Conditional Module Loading

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## Conditional Module Loading

Load large data or modules only when a feature is activated.

**Example (lazy-load animation frames):**

```tsx
function AnimationPlayer({ enabled, setEnabled }: { enabled: boolean; setEnabled: React.Dispatch<React.SetStateAction<boolean>> }) {
  const [frames, setFrames] = useState<Frame[] | null>(null)

  useEffect(() => {
    if (enabled && !frames && typeof window !== 'undefined') {
      import('./animation-frames.js')
        .then(mod => setFrames(mod.frames))
        .catch(() => setEnabled(false))
    }
  }, [enabled, frames, setEnabled])

  if (!frames) return <Skeleton />
  return <Canvas frames={frames} />
}
```

The `typeof window !== 'undefined'` check prevents bundling this module for SSR, optimizing server bundle size and build speed.

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-bundle-defer-third-party"></a>

## Defer Non-Critical Third-Party Libraries

**Impact:** standard
**Kind:** code
**Source:** `rules/bundle-defer-third-party.md`

# Defer Non-Critical Third-Party Libraries

## Defer Non-Critical Third-Party Libraries

Analytics, logging, and error tracking don't block user interaction. Load them after hydration.

## Incorrect
```tsx
import { Analytics } from '@vercel/analytics/react'

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Correct
```tsx
import dynamic from 'next/dynamic'

const Analytics = dynamic(
  () => import('@vercel/analytics/react').then(m => m.Analytics),
  { ssr: false }
)

export default function RootLayout({ children }) {
  return (
    <html>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  )
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-bundle-dynamic-imports"></a>

## Dynamic Imports for Heavy Components

**Impact:** critical
**Kind:** code
**Source:** `rules/bundle-dynamic-imports.md`

# Dynamic Imports for Heavy Components

## Dynamic Imports for Heavy Components

Use `next/dynamic` to lazy-load large components not needed on initial render.

## Incorrect
```tsx
import { MonacoEditor } from './monaco-editor'

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

## Correct
```tsx
import dynamic from 'next/dynamic'

const MonacoEditor = dynamic(
  () => import('./monaco-editor').then(m => m.MonacoEditor),
  { ssr: false }
)

function CodePanel({ code }: { code: string }) {
  return <MonacoEditor value={code} />
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-bundle-preload"></a>

## Preload Based on User Intent

**Impact:** standard
**Kind:** reference
**Source:** `rules/bundle-preload.md`

# Preload Based on User Intent

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## Preload Based on User Intent

Preload heavy bundles before they're needed to reduce perceived latency.

**Example (preload on hover/focus):**

```tsx
function EditorButton({ onClick }: { onClick: () => void }) {
  const preload = () => {
    if (typeof window !== 'undefined') {
      void import('./monaco-editor')
    }
  }

  return (
    <button
      onMouseEnter={preload}
      onFocus={preload}
      onClick={onClick}
    >
      Open Editor
    </button>
  )
}
```

**Example (preload when feature flag is enabled):**

```tsx
function FlagsProvider({ children, flags }: Props) {
  useEffect(() => {
    if (flags.editorEnabled && typeof window !== 'undefined') {
      void import('./monaco-editor').then(mod => mod.init())
    }
  }, [flags.editorEnabled])

  return <FlagsContext.Provider value={flags}>
    {children}
  </FlagsContext.Provider>
}
```

The `typeof window !== 'undefined'` check prevents bundling preloaded modules for SSR, optimizing server bundle size and build speed.

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-client-event-listeners"></a>

## Deduplicate Global Event Listeners

**Impact:** standard
**Kind:** code
**Source:** `rules/client-event-listeners.md`

# Deduplicate Global Event Listeners

## Deduplicate Global Event Listeners

Use `useSWRSubscription()` to share global event listeners across component instances.

## Incorrect
```tsx
function useKeyboardShortcut(key: string, callback: () => void) {
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && e.key === key) {
        callback()
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [key, callback])
}
```

When using the `useKeyboardShortcut` hook multiple times, each instance will register a new listener.

## Correct
```tsx
import useSWRSubscription from 'swr/subscription'

// Module-level Map to track callbacks per key
const keyCallbacks = new Map<string, Set<() => void>>()

function useKeyboardShortcut(key: string, callback: () => void) {
  // Register this callback in the Map
  useEffect(() => {
    if (!keyCallbacks.has(key)) {
      keyCallbacks.set(key, new Set())
    }
    keyCallbacks.get(key)!.add(callback)

    return () => {
      const set = keyCallbacks.get(key)
      if (set) {
        set.delete(callback)
        if (set.size === 0) {
          keyCallbacks.delete(key)
        }
      }
    }
  }, [key, callback])

  useSWRSubscription('global-keydown', () => {
    const handler = (e: KeyboardEvent) => {
      if (e.metaKey && keyCallbacks.has(e.key)) {
        keyCallbacks.get(e.key)!.forEach(cb => cb())
      }
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  })
}

function Profile() {
  // Multiple shortcuts will share the same listener
  useKeyboardShortcut('p', () => { /* ... */ })
  useKeyboardShortcut('k', () => { /* ... */ })
  // ...
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-client-localstorage-schema"></a>

## Version and Minimize localStorage Data

**Impact:** standard
**Kind:** code
**Source:** `rules/client-localstorage-schema.md`

# Version and Minimize localStorage Data

## Version and Minimize localStorage Data

Add version prefix to keys and store only needed fields. Prevents schema conflicts and accidental storage of sensitive data.

## Incorrect
```typescript
// No version, stores everything, no error handling
localStorage.setItem('userConfig', JSON.stringify(fullUserObject))
const data = localStorage.getItem('userConfig')
```

## Correct
```typescript
const VERSION = 'v2'

function saveConfig(config: { theme: string; language: string }) {
  try {
    localStorage.setItem(`userConfig:${VERSION}`, JSON.stringify(config))
  } catch {
    // Throws in incognito/private browsing, quota exceeded, or disabled
  }
}

function loadConfig() {
  try {
    const data = localStorage.getItem(`userConfig:${VERSION}`)
    return data ? JSON.parse(data) : null
  } catch {
    return null
  }
}

// Migration from v1 to v2
function migrate() {
  try {
    const v1 = localStorage.getItem('userConfig:v1')
    if (v1) {
      const old = JSON.parse(v1)
      saveConfig({ theme: old.darkMode ? 'dark' : 'light', language: old.lang })
      localStorage.removeItem('userConfig:v1')
    }
  } catch {}
}
```

**Store minimal fields from server responses:**

```typescript
// User object has 20+ fields, only store what UI needs
function cachePrefs(user: FullUser) {
  try {
    localStorage.setItem('prefs:v1', JSON.stringify({
      theme: user.preferences.theme,
      notifications: user.preferences.notifications
    }))
  } catch {}
}
```

**Always wrap in try-catch:** `getItem()` and `setItem()` throw in incognito/private browsing (Safari, Firefox), when quota exceeded, or when disabled.

**Benefits:** Schema evolution via versioning, reduced storage size, prevents storing tokens/PII/internal flags.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-client-passive-event-listeners"></a>

## Use Passive Event Listeners for Scrolling Performance

**Impact:** standard
**Kind:** code
**Source:** `rules/client-passive-event-listeners.md`

# Use Passive Event Listeners for Scrolling Performance

## Use Passive Event Listeners for Scrolling Performance

Add `{ passive: true }` to touch and wheel event listeners to enable immediate scrolling. Browsers normally wait for listeners to finish to check if `preventDefault()` is called, causing scroll delay.

## Incorrect
```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch)
  document.addEventListener('wheel', handleWheel)

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

## Correct
```typescript
useEffect(() => {
  const handleTouch = (e: TouchEvent) => console.log(e.touches[0].clientX)
  const handleWheel = (e: WheelEvent) => console.log(e.deltaY)

  document.addEventListener('touchstart', handleTouch, { passive: true })
  document.addEventListener('wheel', handleWheel, { passive: true })

  return () => {
    document.removeEventListener('touchstart', handleTouch)
    document.removeEventListener('wheel', handleWheel)
  }
}, [])
```

**Use passive when:** tracking/analytics, logging, any listener that doesn't call `preventDefault()`.

**Don't use passive when:** implementing custom swipe gestures, custom zoom controls, or any listener that needs `preventDefault()`.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-client-swr-dedup"></a>

## Use SWR for Automatic Deduplication

**Impact:** standard
**Kind:** code
**Source:** `rules/client-swr-dedup.md`

# Use SWR for Automatic Deduplication

## Use SWR for Automatic Deduplication

SWR enables request deduplication, caching, and revalidation across component instances.

## Incorrect
```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

## Correct
```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**For immutable data:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**For mutations:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Reference: [https://swr.vercel.app](https://swr.vercel.app)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-batch-dom-css"></a>

## Avoid Layout Thrashing

**Impact:** standard
**Kind:** code
**Source:** `rules/js-batch-dom-css.md`

# Avoid Layout Thrashing

## Avoid Layout Thrashing

Avoid interleaving style writes with layout reads. When you read a layout property (like `offsetWidth`, `getBoundingClientRect()`, or `getComputedStyle()`) between style changes, the browser is forced to trigger a synchronous reflow.

**This is OK (browser batches style changes):**
```typescript
function updateElementStyles(element: HTMLElement) {
  // Each line invalidates style, but browser batches the recalculation
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'
}
```

## Incorrect
```typescript
function layoutThrashing(element: HTMLElement) {
  element.style.width = '100px'
  const width = element.offsetWidth  // Forces reflow
  element.style.height = '200px'
  const height = element.offsetHeight  // Forces another reflow
}
```

## Correct
```typescript
function updateElementStyles(element: HTMLElement) {
  // Batch all writes together
  element.style.width = '100px'
  element.style.height = '200px'
  element.style.backgroundColor = 'blue'
  element.style.border = '1px solid black'

  // Read after all writes are done (single reflow)
  const { width, height } = element.getBoundingClientRect()
}
```

## Correct
```typescript
function avoidThrashing(element: HTMLElement) {
  // Read phase - all layout queries first
  const rect1 = element.getBoundingClientRect()
  const offsetWidth = element.offsetWidth
  const offsetHeight = element.offsetHeight

  // Write phase - all style changes after
  element.style.width = '100px'
  element.style.height = '200px'
}
```

**Better: use CSS classes**
```css
.highlighted-box {
  width: 100px;
  height: 200px;
  background-color: blue;
  border: 1px solid black;
}
```
```typescript
function updateElementStyles(element: HTMLElement) {
  element.classList.add('highlighted-box')

  const { width, height } = element.getBoundingClientRect()
}
```

**React example:**
```tsx
// Incorrect: interleaving style changes with layout queries
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (ref.current && isHighlighted) {
      ref.current.style.width = '100px'
      const width = ref.current.offsetWidth // Forces layout
      ref.current.style.height = '200px'
    }
  }, [isHighlighted])

  return <div ref={ref}>Content</div>
}

// Correct: toggle class
function Box({ isHighlighted }: { isHighlighted: boolean }) {
  return (
    <div className={isHighlighted ? 'highlighted-box' : ''}>
      Content
    </div>
  )
}
```

Prefer CSS classes over inline styles when possible. CSS files are cached by the browser, and classes provide better separation of concerns and are easier to maintain.

See [this gist](https://gist.github.com/paulirish/5d52fb081b3570c81e3a) and [CSS Triggers](https://csstriggers.com/) for more information on layout-forcing operations.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-cache-function-results"></a>

## Cache Repeated Function Calls

**Impact:** standard
**Kind:** code
**Source:** `rules/js-cache-function-results.md`

# Cache Repeated Function Calls

## Cache Repeated Function Calls

Use a module-level Map to cache function results when the same function is called repeatedly with the same inputs during render.

## Incorrect
```typescript
function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // slugify() called 100+ times for same project names
        const slug = slugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

## Correct
```typescript
// Module-level cache
const slugifyCache = new Map<string, string>()

function cachedSlugify(text: string): string {
  if (slugifyCache.has(text)) {
    return slugifyCache.get(text)!
  }
  const result = slugify(text)
  slugifyCache.set(text, result)
  return result
}

function ProjectList({ projects }: { projects: Project[] }) {
  return (
    <div>
      {projects.map(project => {
        // Computed only once per unique project name
        const slug = cachedSlugify(project.name)

        return <ProjectCard key={project.id} slug={slug} />
      })}
    </div>
  )
}
```

**Simpler pattern for single-value functions:**

```typescript
let isLoggedInCache: boolean | null = null

function isLoggedIn(): boolean {
  if (isLoggedInCache !== null) {
    return isLoggedInCache
  }

  isLoggedInCache = document.cookie.includes('auth=')
  return isLoggedInCache
}

// Clear cache when auth changes
function onAuthChange() {
  isLoggedInCache = null
}
```

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

Reference: [How we made the Vercel Dashboard twice as fast](https://vercel.com/blog/how-we-made-the-vercel-dashboard-twice-as-fast)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-cache-property-access"></a>

## Cache Property Access in Loops

**Impact:** standard
**Kind:** code
**Source:** `rules/js-cache-property-access.md`

# Cache Property Access in Loops

## Cache Property Access in Loops

Cache object property lookups in hot paths.

## Incorrect
```typescript
for (let i = 0; i < arr.length; i++) {
  process(obj.config.settings.value)
}
```

## Correct
```typescript
const value = obj.config.settings.value
const len = arr.length
for (let i = 0; i < len; i++) {
  process(value)
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-cache-storage"></a>

## Cache Storage API Calls

**Impact:** standard
**Kind:** code
**Source:** `rules/js-cache-storage.md`

# Cache Storage API Calls

## Cache Storage API Calls

`localStorage`, `sessionStorage`, and `document.cookie` are synchronous and expensive. Cache reads in memory.

## Incorrect
```typescript
function getTheme() {
  return localStorage.getItem('theme') ?? 'light'
}
// Called 10 times = 10 storage reads
```

## Correct
```typescript
const storageCache = new Map<string, string | null>()

function getLocalStorage(key: string) {
  if (!storageCache.has(key)) {
    storageCache.set(key, localStorage.getItem(key))
  }
  return storageCache.get(key)
}

function setLocalStorage(key: string, value: string) {
  localStorage.setItem(key, value)
  storageCache.set(key, value)  // keep cache in sync
}
```

Use a Map (not a hook) so it works everywhere: utilities, event handlers, not just React components.

**Cookie caching:**

```typescript
let cookieCache: Record<string, string> | null = null

function getCookie(name: string) {
  if (!cookieCache) {
    cookieCache = Object.fromEntries(
      document.cookie.split('; ').map(c => c.split('='))
    )
  }
  return cookieCache[name]
}
```

**Important (invalidate on external changes):**

If storage can change externally (another tab, server-set cookies), invalidate cache:

```typescript
window.addEventListener('storage', (e) => {
  if (e.key) storageCache.delete(e.key)
})

document.addEventListener('visibilitychange', () => {
  if (document.visibilityState === 'visible') {
    storageCache.clear()
  }
})
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-combine-iterations"></a>

## Combine Multiple Array Iterations

**Impact:** standard
**Kind:** code
**Source:** `rules/js-combine-iterations.md`

# Combine Multiple Array Iterations

## Combine Multiple Array Iterations

Multiple `.filter()` or `.map()` calls iterate the array multiple times. Combine into one loop.

## Incorrect
```typescript
const admins = users.filter(u => u.isAdmin)
const testers = users.filter(u => u.isTester)
const inactive = users.filter(u => !u.isActive)
```

## Correct
```typescript
const admins: User[] = []
const testers: User[] = []
const inactive: User[] = []

for (const user of users) {
  if (user.isAdmin) admins.push(user)
  if (user.isTester) testers.push(user)
  if (!user.isActive) inactive.push(user)
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-early-exit"></a>

## Early Return from Functions

**Impact:** standard
**Kind:** code
**Source:** `rules/js-early-exit.md`

# Early Return from Functions

## Early Return from Functions

Return early when result is determined to skip unnecessary processing.

## Incorrect
```typescript
function validateUsers(users: User[]) {
  let hasError = false
  let errorMessage = ''

  for (const user of users) {
    if (!user.email) {
      hasError = true
      errorMessage = 'Email required'
    }
    if (!user.name) {
      hasError = true
      errorMessage = 'Name required'
    }
    // Continues checking all users even after error found
  }

  return hasError ? { valid: false, error: errorMessage } : { valid: true }
}
```

## Correct
```typescript
function validateUsers(users: User[]) {
  for (const user of users) {
    if (!user.email) {
      return { valid: false, error: 'Email required' }
    }
    if (!user.name) {
      return { valid: false, error: 'Name required' }
    }
  }

  return { valid: true }
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-hoist-regexp"></a>

## Hoist RegExp Creation

**Impact:** standard
**Kind:** code
**Source:** `rules/js-hoist-regexp.md`

# Hoist RegExp Creation

## Hoist RegExp Creation

Don't create RegExp inside render. Hoist to module scope or memoize with `useMemo()`.

## Incorrect
```tsx
function Highlighter({ text, query }: Props) {
  const regex = new RegExp(`(${query})`, 'gi')
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

## Correct
```tsx
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

function Highlighter({ text, query }: Props) {
  const regex = useMemo(
    () => new RegExp(`(${escapeRegex(query)})`, 'gi'),
    [query]
  )
  const parts = text.split(regex)
  return <>{parts.map((part, i) => ...)}</>
}
```

**Warning (global regex has mutable state):**

Global regex (`/g`) has mutable `lastIndex` state:

```typescript
const regex = /foo/g
regex.test('foo')  // true, lastIndex = 3
regex.test('foo')  // false, lastIndex = 0
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-index-maps"></a>

## Build Index Maps for Repeated Lookups

**Impact:** standard
**Kind:** code
**Source:** `rules/js-index-maps.md`

# Build Index Maps for Repeated Lookups

## Build Index Maps for Repeated Lookups

Multiple `.find()` calls by the same key should use a Map.

## Incorrect
```typescript
function processOrders(orders: Order[], users: User[]) {
  return orders.map(order => ({
    ...order,
    user: users.find(u => u.id === order.userId)
  }))
}
```

## Correct
```typescript
function processOrders(orders: Order[], users: User[]) {
  const userById = new Map(users.map(u => [u.id, u]))

  return orders.map(order => ({
    ...order,
    user: userById.get(order.userId)
  }))
}
```

Build map once (O(n)), then all lookups are O(1).
For 1000 orders × 1000 users: 1M ops → 2K ops.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-length-check-first"></a>

## Early Length Check for Array Comparisons

**Impact:** standard
**Kind:** code
**Source:** `rules/js-length-check-first.md`

# Early Length Check for Array Comparisons

## Early Length Check for Array Comparisons

When comparing arrays with expensive operations (sorting, deep equality, serialization), check lengths first. If lengths differ, the arrays cannot be equal.

In real-world applications, this optimization is especially valuable when the comparison runs in hot paths (event handlers, render loops).

## Incorrect
```typescript
function hasChanges(current: string[], original: string[]) {
  // Always sorts and joins, even when lengths differ
  return current.sort().join() !== original.sort().join()
}
```

Two O(n log n) sorts run even when `current.length` is 5 and `original.length` is 100. There is also overhead of joining the arrays and comparing the strings.

## Correct
```typescript
function hasChanges(current: string[], original: string[]) {
  // Early return if lengths differ
  if (current.length !== original.length) {
    return true
  }
  // Only sort when lengths match
  const currentSorted = current.toSorted()
  const originalSorted = original.toSorted()
  for (let i = 0; i < currentSorted.length; i++) {
    if (currentSorted[i] !== originalSorted[i]) {
      return true
    }
  }
  return false
}
```

This new approach is more efficient because:
- It avoids the overhead of sorting and joining the arrays when lengths differ
- It avoids consuming memory for the joined strings (especially important for large arrays)
- It avoids mutating the original arrays
- It returns early when a difference is found

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-min-max-loop"></a>

## Use Loop for Min/Max Instead of Sort

**Impact:** standard
**Kind:** code
**Source:** `rules/js-min-max-loop.md`

# Use Loop for Min/Max Instead of Sort

## Use Loop for Min/Max Instead of Sort

Finding the smallest or largest element only requires a single pass through the array. Sorting is wasteful and slower.

## Incorrect
```typescript
interface Project {
  id: string
  name: string
  updatedAt: number
}

function getLatestProject(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => b.updatedAt - a.updatedAt)
  return sorted[0]
}
```

Sorts the entire array just to find the maximum value.

## Incorrect
```typescript
function getOldestAndNewest(projects: Project[]) {
  const sorted = [...projects].sort((a, b) => a.updatedAt - b.updatedAt)
  return { oldest: sorted[0], newest: sorted[sorted.length - 1] }
}
```

Still sorts unnecessarily when only min/max are needed.

## Correct
```typescript
function getLatestProject(projects: Project[]) {
  if (projects.length === 0) return null

  let latest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt > latest.updatedAt) {
      latest = projects[i]
    }
  }

  return latest
}

function getOldestAndNewest(projects: Project[]) {
  if (projects.length === 0) return { oldest: null, newest: null }

  let oldest = projects[0]
  let newest = projects[0]

  for (let i = 1; i < projects.length; i++) {
    if (projects[i].updatedAt < oldest.updatedAt) oldest = projects[i]
    if (projects[i].updatedAt > newest.updatedAt) newest = projects[i]
  }

  return { oldest, newest }
}
```

Single pass through the array, no copying, no sorting.

**Alternative (Math.min/Math.max for small arrays):**

```typescript
const numbers = [5, 2, 8, 1, 9]
const min = Math.min(...numbers)
const max = Math.max(...numbers)
```

This works for small arrays, but can be slower or just throw an error for very large arrays due to spread operator limitations. Maximal array length is approximately 124000 in Chrome 143 and 638000 in Safari 18; exact numbers may vary - see [the fiddle](https://jsfiddle.net/qw1jabsx/4/). Use the loop approach for reliability.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-set-map-lookups"></a>

## Use Set/Map for O(1) Lookups

**Impact:** standard
**Kind:** code
**Source:** `rules/js-set-map-lookups.md`

# Use Set/Map for O(1) Lookups

## Use Set/Map for O(1) Lookups

Convert arrays to Set/Map for repeated membership checks.

## Incorrect
```typescript
const allowedIds = ['a', 'b', 'c', ...]
items.filter(item => allowedIds.includes(item.id))
```

## Correct
```typescript
const allowedIds = new Set(['a', 'b', 'c', ...])
items.filter(item => allowedIds.has(item.id))
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-js-tosorted-immutable"></a>

## Use toSorted() Instead of sort() for Immutability

**Impact:** standard
**Kind:** code
**Source:** `rules/js-tosorted-immutable.md`

# Use toSorted() Instead of sort() for Immutability

## Use toSorted() Instead of sort() for Immutability

`.sort()` mutates the array in place, which can cause bugs with React state and props. Use `.toSorted()` to create a new sorted array without mutation.

## Incorrect
```typescript
function UserList({ users }: { users: User[] }) {
  // Mutates the users prop array!
  const sorted = useMemo(
    () => users.sort((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

## Correct
```typescript
function UserList({ users }: { users: User[] }) {
  // Creates new sorted array, original unchanged
  const sorted = useMemo(
    () => users.toSorted((a, b) => a.name.localeCompare(b.name)),
    [users]
  )
  return <div>{sorted.map(renderUser)}</div>
}
```

**Why this matters in React:**

1. Props/state mutations break React's immutability model - React expects props and state to be treated as read-only
2. Causes stale closure bugs - Mutating arrays inside closures (callbacks, effects) can lead to unexpected behavior

**Browser support (fallback for older browsers):**

`.toSorted()` is available in all modern browsers (Chrome 110+, Safari 16+, Firefox 115+, Node.js 20+). For older environments, use spread operator:

```typescript
// Fallback for older browsers
const sorted = [...items].sort((a, b) => a.value - b.value)
```

**Other immutable array methods:**

- `.toSorted()` - immutable sort
- `.toReversed()` - immutable reverse
- `.toSpliced()` - immutable splice
- `.with()` - immutable element replacement

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-rendering-activity"></a>

## Use Activity Component for Show/Hide

**Impact:** standard
**Kind:** reference
**Source:** `rules/rendering-activity.md`

# Use Activity Component for Show/Hide

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

**Usage:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Avoids expensive re-renders and state loss.

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-rendering-animate-svg-wrapper"></a>

## Animate SVG Wrapper Instead of SVG Element

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-animate-svg-wrapper.md`

# Animate SVG Wrapper Instead of SVG Element

## Animate SVG Wrapper Instead of SVG Element

Many browsers don't have hardware acceleration for CSS3 animations on SVG elements. Wrap SVG in a `<div>` and animate the wrapper instead.

## Incorrect
```tsx
function LoadingSpinner() {
  return (
    <svg
      className="animate-spin"
      width="24"
      height="24"
      viewBox="0 0 24 24"
    >
      <circle cx="12" cy="12" r="10" stroke="currentColor" />
    </svg>
  )
}
```

## Correct
```tsx
function LoadingSpinner() {
  return (
    <div className="animate-spin">
      <svg
        width="24"
        height="24"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" stroke="currentColor" />
      </svg>
    </div>
  )
}
```

This applies to all CSS transforms and transitions (`transform`, `opacity`, `translate`, `scale`, `rotate`). The wrapper div allows browsers to use GPU acceleration for smoother animations.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rendering-conditional-render"></a>

## Use Explicit Conditional Rendering

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-conditional-render.md`

# Use Explicit Conditional Rendering

## Use Explicit Conditional Rendering

Use explicit ternary operators (`? :`) instead of `&&` for conditional rendering when the condition can be `0`, `NaN`, or other falsy values that render.

## Incorrect
```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count && <span className="badge">{count}</span>}
    </div>
  )
}

// When count = 0, renders: <div>0</div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

## Correct
```tsx
function Badge({ count }: { count: number }) {
  return (
    <div>
      {count > 0 ? <span className="badge">{count}</span> : null}
    </div>
  )
}

// When count = 0, renders: <div></div>
// When count = 5, renders: <div><span class="badge">5</span></div>
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rendering-content-visibility"></a>

## CSS content-visibility for Long Lists

**Impact:** high
**Kind:** reference
**Source:** `rules/rendering-content-visibility.md`

# CSS content-visibility for Long Lists

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## CSS content-visibility for Long Lists

Apply `content-visibility: auto` to defer off-screen rendering.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Example:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-rendering-hoist-jsx"></a>

## Hoist Static JSX Elements

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-hoist-jsx.md`

# Hoist Static JSX Elements

## Hoist Static JSX Elements

Extract static JSX outside components to avoid re-creation.

## Incorrect
```tsx
function LoadingSkeleton() {
  return <div className="animate-pulse h-20 bg-gray-200" />
}

function Container() {
  return (
    <div>
      {loading && <LoadingSkeleton />}
    </div>
  )
}
```

## Correct
```tsx
const loadingSkeleton = (
  <div className="animate-pulse h-20 bg-gray-200" />
)

function Container() {
  return (
    <div>
      {loading && loadingSkeleton}
    </div>
  )
}
```

This is especially helpful for large and static SVG nodes, which can be expensive to recreate on every render.

**Note:** If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler automatically hoists static JSX elements and optimizes component re-renders, making manual hoisting unnecessary.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rendering-hydration-no-flicker"></a>

## Prevent Hydration Mismatch Without Flickering

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-hydration-no-flicker.md`

# Prevent Hydration Mismatch Without Flickering

## Prevent Hydration Mismatch Without Flickering

Render preference-dependent markup from request data when possible. When a preference exists only in browser storage, use a reviewed pre-hydration bootstrap that complies with the application's Content Security Policy (CSP). Never use this presentation technique for authentication or authorization state.

## Incorrect
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  // localStorage is not available on server - throws error
  const theme = localStorage.getItem('theme') || 'light'

  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

Server-side rendering will fail because `localStorage` is undefined.

## Incorrect
```tsx
function ThemeWrapper({ children }: { children: ReactNode }) {
  const [theme, setTheme] = useState('light')

  useEffect(() => {
    // Runs after hydration - causes visible flash
    const stored = localStorage.getItem('theme')
    if (stored) {
      setTheme(stored)
    }
  }, [])

  return (
    <div className={theme}>
      {children}
    </div>
  )
}
```

Component first renders with default value (`light`), then updates after hydration, causing a visible flash of incorrect content.

## Correct
```tsx
// app/layout.tsx
import { cookies } from 'next/headers'

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const storedTheme = (await cookies()).get('theme')?.value
  const theme = storedTheme === 'dark' ? 'dark' : 'light'

  return (
    <html data-theme={theme}>
      <body>{children}</body>
    </html>
  )
}
```

The server and first client render now agree because both receive the same theme value. Update the cookie when the user changes theme so the next request remains consistent.

If the preference must remain in `localStorage`, place a small audited script in `public/theme-init.js`, load it from the root layout with `next/script` and `strategy="beforeInteractive"`, and limit `suppressHydrationWarning` to the single element whose attribute the script changes. Prefer an external same-origin script under a `script-src 'self'` policy; when the application uses nonce-based CSP, pass the request nonce through the documented Next.js CSP integration. Do not add `unsafe-inline` for this feature.

## Verification

Run the repository typecheck and a production browser test with JavaScript enabled, disabled, and storage unavailable. Verify the initial DOM has the intended theme, hydration emits no warning, and the production CSP reports no violation.

<a id="rule-rendering-hydration-suppress-warning"></a>

## Suppress Expected Hydration Mismatches

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-hydration-suppress-warning.md`

# Suppress Expected Hydration Mismatches

## Suppress Expected Hydration Mismatches

In SSR frameworks (e.g., Next.js), some values are intentionally different on server vs client (random IDs, dates, locale/timezone formatting). For these *expected* mismatches, wrap the dynamic text in an element with `suppressHydrationWarning` to prevent noisy warnings. Do not use this to hide real bugs. Don’t overuse it.

## Incorrect
```tsx
function Timestamp() {
  return <span>{new Date().toLocaleString()}</span>
}
```

## Correct
```tsx
function Timestamp() {
  return (
    <span suppressHydrationWarning>
      {new Date().toLocaleString()}
    </span>
  )
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rendering-svg-precision"></a>

## Optimize SVG Precision

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-svg-precision.md`

# Optimize SVG Precision

## Optimize SVG Precision

Reduce SVG coordinate precision to decrease file size. The optimal precision depends on the viewBox size, but in general reducing precision should be considered.

## Incorrect
```svg
<path d="M 10.293847 20.847362 L 30.938472 40.192837" />
```

## Correct
```svg
<path d="M 10.3 20.8 L 30.9 40.2" />
```

**Automate with SVGO:**

```bash
npx svgo --precision=1 --multipass icon.svg
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rendering-usetransition-loading"></a>

## Use useTransition Over Manual Loading States

**Impact:** standard
**Kind:** code
**Source:** `rules/rendering-usetransition-loading.md`

# Use useTransition Over Manual Loading States

## Use useTransition Over Manual Loading States

Use `useTransition` instead of manual `useState` for loading states. This provides built-in `isPending` state and automatically manages transitions.

## Incorrect
```tsx
function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = async (value: string) => {
    setIsLoading(true)
    setQuery(value)
    const data = await fetchResults(value)
    setResults(data)
    setIsLoading(false)
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isLoading && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

## Correct
```tsx
import { useTransition, useState } from 'react'

function SearchResults() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isPending, startTransition] = useTransition()

  const handleSearch = (value: string) => {
    setQuery(value) // Update input immediately

    startTransition(async () => {
      // Fetch and update results
      const data = await fetchResults(value)
      setResults(data)
    })
  }

  return (
    <>
      <input onChange={(e) => handleSearch(e.target.value)} />
      {isPending && <Spinner />}
      <ResultsList results={results} />
    </>
  )
}
```

**Benefits:**

- **Automatic pending state**: No need to manually manage `setIsLoading(true/false)`
- **Error resilience**: Pending state correctly resets even if the transition throws
- **Better responsiveness**: Keeps the UI responsive during updates
- **Interrupt handling**: New transitions automatically cancel pending ones

Reference: [useTransition](https://react.dev/reference/react/useTransition)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-defer-reads"></a>

## Defer State Reads to Usage Point

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-defer-reads.md`

# Defer State Reads to Usage Point

## Defer State Reads to Usage Point

Don't subscribe to dynamic state (searchParams, localStorage) if you only read it inside callbacks.

## Incorrect
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const searchParams = useSearchParams()

  const handleShare = () => {
    const ref = searchParams.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

## Correct
```tsx
function ShareButton({ chatId }: { chatId: string }) {
  const handleShare = () => {
    const params = new URLSearchParams(window.location.search)
    const ref = params.get('ref')
    shareChat(chatId, { ref })
  }

  return <button onClick={handleShare}>Share</button>
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-dependencies"></a>

## Narrow Effect Dependencies

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-dependencies.md`

# Narrow Effect Dependencies

## Narrow Effect Dependencies

Specify primitive dependencies instead of objects to minimize effect re-runs.

## Incorrect
```tsx
useEffect(() => {
  console.log(user.id)
}, [user])
```

## Correct
```tsx
useEffect(() => {
  console.log(user.id)
}, [user.id])
```

**For derived state, compute outside effect:**

```tsx
// Incorrect: runs on width=767, 766, 765...
useEffect(() => {
  if (width < 768) {
    enableMobileMode()
  }
}, [width])

// Correct: runs only on boolean transition
const isMobile = width < 768
useEffect(() => {
  if (isMobile) {
    enableMobileMode()
  }
}, [isMobile])
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-derived-state-no-effect"></a>

## Calculate Derived State During Rendering

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-derived-state-no-effect.md`

# Calculate Derived State During Rendering

## Calculate Derived State During Rendering

If a value can be computed from current props/state, do not store it in state or update it in an effect. Derive it during render to avoid extra renders and state drift. Do not set state in effects solely in response to prop changes; prefer derived values or keyed resets instead.

## Incorrect
```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const [fullName, setFullName] = useState('')

  useEffect(() => {
    setFullName(firstName + ' ' + lastName)
  }, [firstName, lastName])

  return <p>{fullName}</p>
}
```

## Correct
```tsx
function Form() {
  const [firstName, setFirstName] = useState('First')
  const [lastName, setLastName] = useState('Last')
  const fullName = firstName + ' ' + lastName

  return <p>{fullName}</p>
}
```

References: [You Might Not Need an Effect](https://react.dev/learn/you-might-not-need-an-effect)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-derived-state"></a>

## Subscribe to Derived State

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-derived-state.md`

# Subscribe to Derived State

## Subscribe to Derived State

Subscribe to derived boolean state instead of continuous values to reduce re-render frequency.

## Incorrect
```tsx
function Sidebar() {
  const width = useWindowWidth()  // updates continuously
  const isMobile = width < 768
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

## Correct
```tsx
function Sidebar() {
  const isMobile = useMediaQuery('(max-width: 767px)')
  return <nav className={isMobile ? 'mobile' : 'desktop'} />
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-functional-setstate"></a>

## Use Functional setState Updates

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-functional-setstate.md`

# Use Functional setState Updates

## Use Functional setState Updates

When updating state based on the current state value, use the functional update form of setState instead of directly referencing the state variable. This prevents stale closures, eliminates unnecessary dependencies, and creates stable callback references.

## Incorrect
```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Callback must depend on items, recreated on every items change
  const addItems = useCallback((newItems: Item[]) => {
    setItems([...items, ...newItems])
  }, [items])  // ❌ items dependency causes recreations

  // Risk of stale closure if dependency is forgotten
  const removeItem = useCallback((id: string) => {
    setItems(items.filter(item => item.id !== id))
  }, [])  // ❌ Missing items dependency - will use stale items!

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

The first callback is recreated every time `items` changes, which can cause child components to re-render unnecessarily. The second callback has a stale closure bug—it will always reference the initial `items` value.

## Correct
```tsx
function TodoList() {
  const [items, setItems] = useState(initialItems)

  // Stable callback, never recreated
  const addItems = useCallback((newItems: Item[]) => {
    setItems(curr => [...curr, ...newItems])
  }, [])  // ✅ No dependencies needed

  // Always uses latest state, no stale closure risk
  const removeItem = useCallback((id: string) => {
    setItems(curr => curr.filter(item => item.id !== id))
  }, [])  // ✅ Safe and stable

  return <ItemsEditor items={items} onAdd={addItems} onRemove={removeItem} />
}
```

**Benefits:**

1. **Stable callback references** - Callbacks don't need to be recreated when state changes
2. **No stale closures** - Always operates on the latest state value
3. **Fewer dependencies** - Simplifies dependency arrays and reduces memory leaks
4. **Prevents bugs** - Eliminates the most common source of React closure bugs

**When to use functional updates:**

- Any setState that depends on the current state value
- Inside useCallback/useMemo when state is needed
- Event handlers that reference state
- Async operations that update state

**When direct updates are fine:**

- Setting state to a static value: `setCount(0)`
- Setting state from props/arguments only: `setName(newName)`
- State doesn't depend on previous value

**Note:** If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, the compiler can automatically optimize some cases, but functional updates are still recommended for correctness and to prevent stale closure bugs.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-lazy-state-init"></a>

## Use Lazy State Initialization

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-lazy-state-init.md`

# Use Lazy State Initialization

## Use Lazy State Initialization

Pass a function to `useState` for expensive initial values. Without the function form, the initializer runs on every render even though the value is only used once.

## Incorrect
```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs on EVERY render, even after initialization
  const [searchIndex, setSearchIndex] = useState(buildSearchIndex(items))
  const [query, setQuery] = useState('')

  // When query changes, buildSearchIndex runs again unnecessarily
  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs on every render
  const [settings, setSettings] = useState(
    JSON.parse(localStorage.getItem('settings') || '{}')
  )

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

## Correct
```tsx
function FilteredList({ items }: { items: Item[] }) {
  // buildSearchIndex() runs ONLY on initial render
  const [searchIndex, setSearchIndex] = useState(() => buildSearchIndex(items))
  const [query, setQuery] = useState('')

  return <SearchResults index={searchIndex} query={query} />
}

function UserProfile() {
  // JSON.parse runs only on initial render
  const [settings, setSettings] = useState(() => {
    const stored = localStorage.getItem('settings')
    return stored ? JSON.parse(stored) : {}
  })

  return <SettingsForm settings={settings} onChange={setSettings} />
}
```

Use lazy initialization when computing initial values from localStorage/sessionStorage, building data structures (indexes, maps), reading from the DOM, or performing heavy transformations.

For simple primitives (`useState(0)`), direct references (`useState(props.value)`), or cheap literals (`useState({})`), the function form is unnecessary.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-memo-with-default-value"></a>

## Extract Default Non-primitive Parameter Value from Memoized Component to Constant

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-memo-with-default-value.md`

# Extract Default Non-primitive Parameter Value from Memoized Component to Constant

## Extract Default Non-primitive Parameter Value from Memoized Component to Constant

When memoized component has a default value for some non-primitive optional parameter, such as an array, function, or object, calling the component without that parameter results in broken memoization. This is because new value instances are created on every rerender, and they do not pass strict equality comparison in `memo()`.

To address this issue, extract the default value into a constant.

## Incorrect
```tsx
const UserAvatar = memo(function UserAvatar({ onClick = () => {} }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

## Correct
```tsx
const NOOP = () => {};

const UserAvatar = memo(function UserAvatar({ onClick = NOOP }: { onClick?: () => void }) {
  // ...
})

// Used without optional onClick
<UserAvatar />
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-memo"></a>

## Extract to Memoized Components

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-memo.md`

# Extract to Memoized Components

## Extract to Memoized Components

Extract expensive work into memoized components to enable early returns before computation.

## Incorrect
```tsx
function Profile({ user, loading }: Props) {
  const avatar = useMemo(() => {
    const id = computeAvatarId(user)
    return <Avatar id={id} />
  }, [user])

  if (loading) return <Skeleton />
  return <div>{avatar}</div>
}
```

## Correct
```tsx
const UserAvatar = memo(function UserAvatar({ user }: { user: User }) {
  const id = useMemo(() => computeAvatarId(user), [user])
  return <Avatar id={id} />
})

function Profile({ user, loading }: Props) {
  if (loading) return <Skeleton />
  return (
    <div>
      <UserAvatar user={user} />
    </div>
  )
}
```

**Note:** If your project has [React Compiler](https://react.dev/learn/react-compiler) enabled, manual memoization with `memo()` and `useMemo()` is not necessary. The compiler automatically optimizes re-renders.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-move-effect-to-event"></a>

## Put Interaction Logic in Event Handlers

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-move-effect-to-event.md`

# Put Interaction Logic in Event Handlers

## Put Interaction Logic in Event Handlers

If a side effect is triggered by a specific user action (submit, click, drag), run it in that event handler. Do not model the action as state + effect; it makes effects re-run on unrelated changes and can duplicate the action.

## Incorrect
```tsx
function Form() {
  const [submitted, setSubmitted] = useState(false)
  const theme = useContext(ThemeContext)

  useEffect(() => {
    if (submitted) {
      post('/api/register')
      showToast('Registered', theme)
    }
  }, [submitted, theme])

  return <button onClick={() => setSubmitted(true)}>Submit</button>
}
```

## Correct
```tsx
function Form() {
  const theme = useContext(ThemeContext)

  function handleSubmit() {
    post('/api/register')
    showToast('Registered', theme)
  }

  return <button onClick={handleSubmit}>Submit</button>
}
```

Reference: [Should this code move to an event handler?](https://react.dev/learn/removing-effect-dependencies#should-this-code-move-to-an-event-handler)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-simple-expression-in-memo"></a>

## Do not wrap a simple expression with a primitive result type in useMemo

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-simple-expression-in-memo.md`

# Do not wrap a simple expression with a primitive result type in useMemo

## Do not wrap a simple expression with a primitive result type in useMemo

When an expression is simple (few logical or arithmetical operators) and has a primitive result type (boolean, number, string), do not wrap it in `useMemo`.
Calling `useMemo` and comparing hook dependencies may consume more resources than the expression itself.

## Incorrect
```tsx
function Header({ user, notifications }: Props) {
  const isLoading = useMemo(() => {
    return user.isLoading || notifications.isLoading
  }, [user.isLoading, notifications.isLoading])

  if (isLoading) return <Skeleton />
  // return some markup
}
```

## Correct
```tsx
function Header({ user, notifications }: Props) {
  const isLoading = user.isLoading || notifications.isLoading

  if (isLoading) return <Skeleton />
  // return some markup
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-transitions"></a>

## Use Transitions for Non-Urgent Updates

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-transitions.md`

# Use Transitions for Non-Urgent Updates

## Use Transitions for Non-Urgent Updates

Mark frequent, non-urgent state updates as transitions to maintain UI responsiveness.

## Incorrect
```tsx
function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

## Correct
```tsx
import { startTransition } from 'react'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  useEffect(() => {
    const handler = () => {
      startTransition(() => setScrollY(window.scrollY))
    }
    window.addEventListener('scroll', handler, { passive: true })
    return () => window.removeEventListener('scroll', handler)
  }, [])
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-rerender-use-ref-transient-values"></a>

## Use useRef for Transient Values

**Impact:** standard
**Kind:** code
**Source:** `rules/rerender-use-ref-transient-values.md`

# Use useRef for Transient Values

## Use useRef for Transient Values

When a value changes frequently and you don't want a re-render on every update (e.g., mouse trackers, intervals, transient flags), store it in `useRef` instead of `useState`. Keep component state for UI; use refs for temporary DOM-adjacent values. Updating a ref does not trigger a re-render.

## Incorrect
```tsx
function Tracker() {
  const [lastX, setLastX] = useState(0)

  useEffect(() => {
    const onMove = (e: MouseEvent) => setLastX(e.clientX)
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      style={{
        position: 'fixed',
        top: 0,
        left: lastX,
        width: 8,
        height: 8,
        background: 'black',
      }}
    />
  )
}
```

## Correct
```tsx
function Tracker() {
  const lastXRef = useRef(0)
  const dotRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      lastXRef.current = e.clientX
      const node = dotRef.current
      if (node) {
        node.style.transform = `translateX(${e.clientX}px)`
      }
    }
    window.addEventListener('mousemove', onMove)
    return () => window.removeEventListener('mousemove', onMove)
  }, [])

  return (
    <div
      ref={dotRef}
      style={{
        position: 'fixed',
        top: 0,
        left: 0,
        width: 8,
        height: 8,
        background: 'black',
        transform: 'translateX(0px)',
      }}
    />
  )
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-after-nonblocking"></a>

## Use after() for Non-Blocking Operations

**Impact:** standard
**Kind:** code
**Source:** `rules/server-after-nonblocking.md`

# Use after() for Non-Blocking Operations

## Use after() for Non-Blocking Operations

Use Next.js's `after()` to schedule work that should execute after a response is sent. This prevents logging, analytics, and other side effects from blocking the response.

## Incorrect
```tsx
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Logging blocks the response
  const userAgent = request.headers.get('user-agent') || 'unknown'
  await logUserAction({ userAgent })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

## Correct
```tsx
import { after } from 'next/server'
import { headers, cookies } from 'next/headers'
import { logUserAction } from '@/app/utils'

export async function POST(request: Request) {
  // Perform mutation
  await updateDatabase(request)

  // Log after response is sent
  after(async () => {
    const userAgent = (await headers()).get('user-agent') || 'unknown'
    const sessionCookie = (await cookies()).get('session-id')?.value || 'anonymous'

    await logUserAction({ sessionCookie, userAgent })
  })

  return new Response(JSON.stringify({ status: 'success' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  })
}
```

The response is sent without waiting for the callback, while the callback itself awaits and returns its asynchronous work so the runtime can track completion and failures.

**Common use cases:**

- Analytics tracking
- Audit logging
- Sending notifications
- Cache invalidation
- Cleanup tasks

**Important notes:**

- `after()` runs even if rendering throws, or a redirect or not-found response occurs
- Works in Server Actions, Route Handlers, and Server Components
- Await or return every Promise created inside the callback; do not start detached work

Reference: [https://nextjs.org/docs/app/api-reference/functions/after](https://nextjs.org/docs/app/api-reference/functions/after)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-auth-actions"></a>

## Authenticate Server Actions Like API Routes

**Impact:** critical
**Kind:** code
**Source:** `rules/server-auth-actions.md`

# Authenticate Server Actions Like API Routes

## Authenticate Server Actions Like API Routes

**Impact: CRITICAL (prevents unauthorized access to server mutations)**

Server Actions (functions with `"use server"`) are exposed as public endpoints, just like API routes. Always verify authentication and authorization **inside** each Server Action—do not rely solely on middleware, layout guards, or page-level checks, as Server Actions can be invoked directly.

Next.js documentation explicitly states: "Treat Server Actions with the same security considerations as public-facing API endpoints, and verify if the user is allowed to perform a mutation."

## Incorrect
```typescript
'use server'

export async function deleteUser(userId: string) {
  // Anyone can call this! No auth check
  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

## Correct
```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { unauthorized } from '@/lib/errors'

export async function deleteUser(userId: string) {
  // Always check auth inside the action
  const session = await verifySession()

  if (!session) {
    throw unauthorized('Must be logged in')
  }

  // Check authorization too
  if (session.user.role !== 'admin' && session.user.id !== userId) {
    throw unauthorized('Cannot delete other users')
  }

  await db.user.delete({ where: { id: userId } })
  return { success: true }
}
```

**With input validation:**

```typescript
'use server'

import { verifySession } from '@/lib/auth'
import { z } from 'zod'

const updateProfileSchema = z.object({
  userId: z.string().uuid(),
  name: z.string().min(1).max(100),
  email: z.string().email()
})

export async function updateProfile(data: unknown) {
  // Validate input first
  const validated = updateProfileSchema.parse(data)

  // Then authenticate
  const session = await verifySession()
  if (!session) {
    throw new Error('Unauthorized')
  }

  // Then authorize
  if (session.user.id !== validated.userId) {
    throw new Error('Can only update own profile')
  }

  // Finally perform the mutation
  await db.user.update({
    where: { id: validated.userId },
    data: {
      name: validated.name,
      email: validated.email
    }
  })

  return { success: true }
}
```

Reference: [https://nextjs.org/docs/app/guides/authentication](https://nextjs.org/docs/app/guides/authentication)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-cache-lru"></a>

## Cross-Request LRU Caching

**Impact:** high
**Kind:** reference
**Source:** `rules/server-cache-lru.md`

# Cross-Request LRU Caching

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## Cross-Request LRU Caching

`React.cache()` only works within one request. For data shared across sequential requests (user clicks button A then button B), use an LRU cache.

**Implementation:**

```typescript
import { LRUCache } from 'lru-cache'

const cache = new LRUCache<string, any>({
  max: 1000,
  ttl: 5 * 60 * 1000  // 5 minutes
})

export async function getUser(id: string) {
  const cached = cache.get(id)
  if (cached) return cached

  const user = await db.user.findUnique({ where: { id } })
  cache.set(id, user)
  return user
}

// Request 1: DB query, result cached
// Request 2: cache hit, no DB query
```

Use when sequential user actions hit multiple endpoints needing the same data within seconds.

**With Vercel's [Fluid Compute](https://vercel.com/docs/fluid-compute):** LRU caching is especially effective because multiple concurrent requests can share the same function instance and cache. This means the cache persists across requests without needing external storage like Redis.

**In traditional serverless:** Each invocation runs in isolation, so consider Redis for cross-process caching.

Reference: [https://github.com/isaacs/node-lru-cache](https://github.com/isaacs/node-lru-cache)

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-server-cache-react"></a>

## Per-Request Deduplication with React.cache()

**Impact:** standard
**Kind:** code
**Source:** `rules/server-cache-react.md`

# Per-Request Deduplication with React.cache()

## Per-Request Deduplication with React.cache()

Use `React.cache()` for server-side request deduplication. Authentication and database queries benefit most.

**Usage:**

```typescript
import { cache } from 'react'

export const getCurrentUser = cache(async () => {
  const session = await auth()
  if (!session?.user?.id) return null
  return await db.user.findUnique({
    where: { id: session.user.id }
  })
})
```

Within a single request, multiple calls to `getCurrentUser()` execute the query only once.

**Avoid inline objects as arguments:**

`React.cache()` uses shallow equality (`Object.is`) to determine cache hits. Inline objects create new references each call, preventing cache hits.

## Incorrect
```typescript
const getUser = cache(async (params: { uid: number }) => {
  return await db.user.findUnique({ where: { id: params.uid } })
})

// Each call creates new object, never hits cache
getUser({ uid: 1 })
getUser({ uid: 1 })  // Cache miss, runs query again
```

## Correct
```typescript
const getUser = cache(async (uid: number) => {
  return await db.user.findUnique({ where: { id: uid } })
})

// Primitive args use value equality
getUser(1)
getUser(1)  // Cache hit, returns cached result
```

If you must pass objects, pass the same reference:

```typescript
const params = { uid: 1 }
getUser(params)  // Query runs
getUser(params)  // Cache hit (same reference)
```

**Next.js-Specific Note:**

In Next.js, the `fetch` API is automatically extended with request memoization. Requests with the same URL and options are automatically deduplicated within a single request, so you don't need `React.cache()` for `fetch` calls. However, `React.cache()` is still essential for other async tasks:

- Database queries (Prisma, Drizzle, etc.)
- Heavy computations
- Authentication checks
- File system operations
- Any non-fetch async work

Use `React.cache()` to deduplicate these operations across your component tree.

Reference: [React.cache documentation](https://react.dev/reference/react/cache)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-dedup-props"></a>

## Avoid Duplicate Serialization in RSC Props

**Impact:** standard
**Kind:** code
**Source:** `rules/server-dedup-props.md`

# Avoid Duplicate Serialization in RSC Props

## Avoid Duplicate Serialization in RSC Props

**Impact: LOW (reduces network payload by avoiding duplicate serialization)**

RSC→client serialization deduplicates by object reference, not value. Same reference = serialized once; new reference = serialized again. Do transformations (`.toSorted()`, `.filter()`, `.map()`) in client, not server.

## Incorrect
```tsx
// RSC: sends 6 strings (2 arrays × 3 items)
<ClientList usernames={usernames} usernamesOrdered={usernames.toSorted()} />
```

## Correct
```tsx
// RSC: send once
<ClientList usernames={usernames} />

// Client: transform there
'use client'
const sorted = useMemo(() => [...usernames].sort(), [usernames])
```

**Nested deduplication behavior:**

Deduplication works recursively. Impact varies by data type:

- `string[]`, `number[]`, `boolean[]`: **HIGH impact** - array + all primitives fully duplicated
- `object[]`: **LOW impact** - array duplicated, but nested objects deduplicated by reference

```tsx
// string[] - duplicates everything
usernames={['a','b']} sorted={usernames.toSorted()} // sends 4 strings

// object[] - duplicates array structure only
users={[{id:1},{id:2}]} sorted={users.toSorted()} // sends 2 arrays + 2 unique objects (not 4)
```

**Operations breaking deduplication (create new references):**

- Arrays: `.toSorted()`, `.filter()`, `.map()`, `.slice()`, `[...arr]`
- Objects: `{...obj}`, `Object.assign()`, `structuredClone()`, `JSON.parse(JSON.stringify())`

**More examples:**

```tsx
// ❌ Bad
<C users={users} active={users.filter(u => u.active)} />
<C product={product} productName={product.name} />

// ✅ Good
<C users={users} />
<C product={product} />
// Do filtering/destructuring in client
```

**Exception:** Pass derived data when transformation is expensive or client doesn't need original.

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-parallel-fetching"></a>

## Parallel Data Fetching with Component Composition

**Impact:** critical
**Kind:** code
**Source:** `rules/server-parallel-fetching.md`

# Parallel Data Fetching with Component Composition

## Parallel Data Fetching with Component Composition

React Server Components execute sequentially within a tree. Restructure with composition to parallelize data fetching.

## Incorrect
```tsx
export default async function Page() {
  const header = await fetchHeader()
  return (
    <div>
      <div>{header}</div>
      <Sidebar />
    </div>
  )
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}
```

## Correct
```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

export default function Page() {
  return (
    <div>
      <Header />
      <Sidebar />
    </div>
  )
}
```

**Alternative with children prop:**

```tsx
async function Header() {
  const data = await fetchHeader()
  return <div>{data}</div>
}

async function Sidebar() {
  const items = await fetchSidebarItems()
  return <nav>{items.map(renderItem)}</nav>
}

function Layout({ children }: { children: ReactNode }) {
  return (
    <div>
      <Header />
      {children}
    </div>
  )
}

export default function Page() {
  return (
    <Layout>
      <Sidebar />
    </Layout>
  )
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.

<a id="rule-server-serialization"></a>

## Minimize Serialization at RSC Boundaries

**Impact:** high
**Kind:** code
**Source:** `rules/server-serialization.md`

# Minimize Serialization at RSC Boundaries

## Minimize Serialization at RSC Boundaries

The React Server/Client boundary serializes all object properties into strings and embeds them in the HTML response and subsequent RSC requests. This serialized data directly impacts page weight and load time, so **size matters a lot**. Only pass fields that the client actually uses.

## Incorrect
```tsx
async function Page() {
  const user = await fetchUser()  // 50 fields
  return <Profile user={user} />
}

'use client'
function Profile({ user }: { user: User }) {
  return <div>{user.name}</div>  // uses 1 field
}
```

## Correct
```tsx
async function Page() {
  const user = await fetchUser()
  return <Profile name={user.name} />
}

'use client'
function Profile({ name }: { name: string }) {
  return <div>{name}</div>
}
```

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
