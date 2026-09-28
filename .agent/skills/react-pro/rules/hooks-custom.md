---
"title": "Custom Hooks Patterns"
"kind": "reference"
"impact": "standard"
"tags":
  - "hooks"
  - "useDebounce"
  - "useLocalStorage"
  - "custom"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

# Custom Hooks Patterns

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Custom Hooks Patterns

> Reusable hooks for common patterns: debounce, localStorage, and more.

---

## useDebounce

```tsx
function useDebounce<T>(value: T, delay = 300): T {
  const [debounced, setDebounced] = useState(value)
  useEffect(() => {
    const timer = setTimeout(() => setDebounced(value), delay)
    return () => clearTimeout(timer)
  }, [value, delay])
  return debounced
}
```

## useLocalStorage

```tsx
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
```

## Usage

```tsx
function SearchPage() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 500)
  const [theme, setTheme] = useLocalStorage('theme', 'dark')
  // ...
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
