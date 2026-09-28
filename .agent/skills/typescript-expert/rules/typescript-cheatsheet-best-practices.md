---
"title": "Typescript Cheatsheet: Best Practices"
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

# Typescript Cheatsheet: Best Practices

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Best Practices

```typescript
// ✅ Prefer interface for objects
interface User {
  name: string
}

// ✅ Use const assertions
const routes = ['home', 'about'] as const

// ✅ Use satisfies for validation
const config = {
  api: 'https://api.example.com'
} satisfies Record<string, string>

// ✅ Use unknown over any
function parse(input: unknown) {
  if (typeof input === 'string') {
    return JSON.parse(input)
  }
}

// ✅ Explicit return types for public APIs
export function getUser(id: string): User | null {
  // ...
}

// ❌ Avoid
const data: any = fetchData()
data.anything.goes.wrong  // No type safety
```

---

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
