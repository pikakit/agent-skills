---
"title": "Typescript Cheatsheet: Type Aliases & Interfaces"
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

# Typescript Cheatsheet: Type Aliases & Interfaces

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Type Aliases & Interfaces

```typescript
// Type Alias
type Point = {
  x: number
  y: number
}

// Interface (preferred for objects)
interface User {
  id: string
  name: string
  email?: string  // Optional
  readonly createdAt: Date  // Readonly
}

// Extending
interface Admin extends User {
  permissions: string[]
}

// Intersection
type AdminUser = User & { permissions: string[] }
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
