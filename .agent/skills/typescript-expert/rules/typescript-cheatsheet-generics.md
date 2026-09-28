---
"title": "Typescript Cheatsheet: Generics"
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

# Typescript Cheatsheet: Generics

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Generics

```typescript
// Generic function
function identity<T>(value: T): T {
  return value
}

// Generic with constraint
function getLength<T extends { length: number }>(item: T): number {
  return item.length
}

// Generic interface
interface ApiResponse<T> {
  data: T
  status: number
  message: string
}

// Generic with default
type Container<T = string> = {
  value: T
}

// Multiple generics
function merge<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 }
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
