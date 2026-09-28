---
"title": "Do not wrap a simple expression with a primitive result type in useMemo"
"kind": "code"
"impact": "standard"
"tags":
  - "rerender"
  - "useMemo"
  - "optimization"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

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
