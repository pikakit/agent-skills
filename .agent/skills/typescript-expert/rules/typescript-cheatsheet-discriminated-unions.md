---
"title": "Typescript Cheatsheet: Discriminated Unions"
"kind": "reference"
"impact": "standard"
"tags":
  - "typescript"
  - "cheatsheet"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://www.typescriptlang.org/docs/"
    "title": "Official documentation"
---

# Typescript Cheatsheet: Discriminated Unions

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Discriminated Unions

```typescript
// With type discriminant
type Success<T> = { type: 'success'; data: T }
type Error = { type: 'error'; message: string }
type Loading = { type: 'loading' }

type State<T> = Success<T> | Error | Loading

function handle<T>(state: State<T>) {
  switch (state.type) {
    case 'success':
      return state.data  // T
    case 'error':
      return state.message  // string
    case 'loading':
      return null
  }
}

// Exhaustive check
function assertNever(value: never): never {
  throw new Error(`Unexpected value: ${value}`)
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
