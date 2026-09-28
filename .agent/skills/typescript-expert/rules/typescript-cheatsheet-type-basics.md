---
"title": "Typescript Cheatsheet: Type Basics"
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

# Typescript Cheatsheet: Type Basics

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Type Basics

```typescript
// Primitives
const name: string = 'John'
const age: number = 30
const isActive: boolean = true
const nothing: null = null
const notDefined: undefined = undefined

// Arrays
const numbers: number[] = [1, 2, 3]
const strings: Array<string> = ['a', 'b', 'c']

// Tuple
const tuple: [string, number] = ['hello', 42]

// Object
const user: { name: string; age: number } = { name: 'John', age: 30 }

// Union
const value: string | number = 'hello'

// Literal
const direction: 'up' | 'down' | 'left' | 'right' = 'up'

// Any vs Unknown
const anyValue: any = 'anything'     // ❌ Avoid
const unknownValue: unknown = 'safe' // ✅ Prefer, requires narrowing
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
