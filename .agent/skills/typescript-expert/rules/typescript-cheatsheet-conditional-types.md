---
"title": "Typescript Cheatsheet: Conditional Types"
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

# Typescript Cheatsheet: Conditional Types

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Conditional Types

```typescript
// Basic conditional
type IsString<T> = T extends string ? true : false

// Infer keyword
type UnwrapPromise<T> = T extends Promise<infer U> ? U : T

// Distributive conditional
type ToArray<T> = T extends any ? T[] : never
type Result = ToArray<string | number>  // string[] | number[]

// NonDistributive
type ToArrayNonDist<T> = [T] extends [any] ? T[] : never
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
