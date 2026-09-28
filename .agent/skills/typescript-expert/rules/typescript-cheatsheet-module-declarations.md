---
"title": "Typescript Cheatsheet: Module Declarations"
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

# Typescript Cheatsheet: Module Declarations

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Module Declarations

```typescript
// Declare module for untyped package
declare module 'untyped-package' {
  export function doSomething(): void
  export const value: string
}

// Augment existing module
declare module 'express' {
  interface Request {
    user?: { id: string }
  }
}

// Declare global
declare global {
  interface Window {
    myGlobal: string
  }
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
