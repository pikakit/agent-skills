---
name: react-patterns
description: React advanced patterns — React 19 hooks, composition, state management (Zustand/React Query), Error Boundary, custom hooks, performance, testing
---

# React Advanced Patterns

> Code-first patterns for modern React. React 19 + TypeScript + composition.

---

## React 19 Patterns

### useActionState (Form Submissions)

```tsx
import { useActionState } from 'react'

async function createUser(prev: State, formData: FormData) {
  const name = formData.get('name') as string
  const res = await fetch('/api/users', {
    method: 'POST',
    body: JSON.stringify({ name }),
    headers: { 'Content-Type': 'application/json' },
  })
  if (!res.ok) return { error: 'Failed to create user' }
  return { error: null, success: true }
}

type State = { error: string | null; success?: boolean }

function CreateUserForm() {
  const [state, action, isPending] = useActionState(createUser, { error: null })

  return (
    <form action={action}>
      <input name="name" required disabled={isPending} />
      <button type="submit" disabled={isPending}>
        {isPending ? 'Creating...' : 'Create User'}
      </button>
      {state.error && <p className="error">{state.error}</p>}
      {state.success && <p className="success">User created!</p>}
    </form>
  )
}
```

### useOptimistic (Instant UI Updates)

```tsx
import { useOptimistic } from 'react'

function TodoList({ todos }: { todos: Todo[] }) {
  const [optimisticTodos, addOptimistic] = useOptimistic(
    todos,
    (current, newTodo: Todo) => [...current, newTodo]
  )

  async function handleAdd(formData: FormData) {
    const title = formData.get('title') as string
    const tempTodo = { id: crypto.randomUUID(), title, completed: false }

    addOptimistic(tempTodo)  // Instant UI update
    await createTodo(title)  // Server call (may fail → reverts automatically)
  }

  return (
    <div>
      <form action={handleAdd}>
        <input name="title" required />
        <button type="submit">Add</button>
      </form>
      <ul>
        {optimisticTodos.map(todo => (
          <li key={todo.id}>{todo.title}</li>
        ))}
      </ul>
    </div>
  )
}
```

---

## Composition Patterns

### Compound Components

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

// Context for internal state
const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

// Parent — provides context
function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// Child — consumes context
function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs()
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs()
  if (active !== id) return null
  return <div role="tabpanel">{children}</div>
}

// Attach sub-components
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel

// Usage — flexible, slot-based
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview">Overview content</Tabs.Panel>
  <Tabs.Panel id="settings">Settings content</Tabs.Panel>
</Tabs>
```

---

## State Management

### Zustand (Global State)

```tsx
import { create } from 'zustand'
import { persist } from 'zustand/middleware'

interface AuthStore {
  user: User | null
  token: string | null
  login: (email: string, password: string) => Promise<void>
  logout: () => void
}

const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      login: async (email, password) => {
        const res = await fetch('/api/auth/login', {
          method: 'POST',
          body: JSON.stringify({ email, password }),
          headers: { 'Content-Type': 'application/json' },
        })
        const { user, token } = await res.json()
        set({ user, token })
      },
      logout: () => set({ user: null, token: null }),
    }),
    { name: 'auth-storage' }
  )
)

// Usage — auto re-renders on change
function NavBar() {
  const { user, logout } = useAuthStore()
  if (!user) return <LoginButton />
  return <button onClick={logout}>{user.name}</button>
}
```

### React Query (Server State)

```tsx
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'

function UserList() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: () => fetch('/api/users').then(r => r.json()),
    staleTime: 5 * 60 * 1000, // 5 min cache
  })

  const queryClient = useQueryClient()
  const createUser = useMutation({
    mutationFn: (data: UserCreate) =>
      fetch('/api/users', { method: 'POST', body: JSON.stringify(data) }).then(r => r.json()),
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ['users'] }),
  })

  if (isLoading) return <Skeleton />
  if (error) return <ErrorMessage error={error} />

  return (
    <div>
      {users.map((u: User) => <UserCard key={u.id} user={u} />)}
      <button onClick={() => createUser.mutate({ name: 'New User' })}>
        {createUser.isPending ? 'Creating...' : 'Add User'}
      </button>
    </div>
  )
}
```

---

## Error Boundary

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}

// Usage — wrap at route/feature level
<ErrorBoundary fallback={<ErrorPage />}>
  <UserDashboard />
</ErrorBoundary>
```

---

## Custom Hooks

```tsx
// useDebounce — delay value updates
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}

// useLocalStorage — persist state
function useLocalStorage<T>(key: string, initial: T) {
  const [value, setValue] = useState<T>(() => {
    try {
      const stored = localStorage.getItem(key)
      return stored ? JSON.parse(stored) : initial
    } catch {
      return initial
    }
  })

  useEffect(() => {
    localStorage.setItem(key, JSON.stringify(value))
  }, [key, value])

  return [value, setValue] as const
}

// Usage
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  // ...
}
```

---

## Performance

| Priority | Category | Action |
|:--------:|----------|--------|
| 1 | Eliminate waterfalls | `Promise.all()`, parallel fetch, Suspense streaming |
| 2 | Bundle size | Direct imports (no barrels), `dynamic()`, lazy load |
| 3 | Re-renders | React Compiler (19), then `useMemo`/`useCallback` |
| 4 | Large lists | Virtualize with `@tanstack/react-virtual` |

```tsx
// Virtualized list for 10K+ items
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualList({ items }: { items: Item[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  const virtualizer = useVirtualizer({
    count: items.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 50,
  })

  return (
    <div ref={parentRef} style={{ height: 400, overflow: 'auto' }}>
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map(row => (
          <div key={row.key} style={{
            position: 'absolute',
            top: row.start,
            height: row.size,
            width: '100%',
          }}>
            {items[row.index].name}
          </div>
        ))}
      </div>
    </div>
  )
}
```

---

## Testing

```tsx
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

test('creates user on form submit', async () => {
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/user created/i)).toBeInTheDocument()
})

test('shows error on failed submission', async () => {
  server.use(http.post('/api/users', () => HttpResponse.json({}, { status: 500 })))
  const user = userEvent.setup()
  render(<CreateUserForm />)

  await user.type(screen.getByRole('textbox', { name: /name/i }), 'John')
  await user.click(screen.getByRole('button', { name: /create/i }))

  expect(await screen.findByText(/failed/i)).toBeInTheDocument()
})
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Prop drill > 3 levels | Compound components or Zustand |
| `useEffect` for data fetching | React Query / use() / Server Components |
| Index as key in dynamic lists | Stable unique ID |
| God components (> 300 lines) | Split at 150 lines |
| Premature `useMemo`/`useCallback` | Profile first (React Compiler handles most) |
| Barrel file re-exports | Direct imports for smaller bundles |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [engineering-spec.md](engineering-spec.md) | Full architecture spec |
| SKILL.md | Component types, state routing |
