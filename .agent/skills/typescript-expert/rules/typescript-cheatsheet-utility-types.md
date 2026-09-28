---
"title": "Typescript Cheatsheet: Utility Types"
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

# Typescript Cheatsheet: Utility Types

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Utility Types

```typescript
interface User {
  id: string
  name: string
  email: string
  age: number
}

// Partial - all optional
type PartialUser = Partial<User>

// Required - all required
type RequiredUser = Required<User>

// Readonly - all readonly
type ReadonlyUser = Readonly<User>

// Pick - select properties
type UserName = Pick<User, 'id' | 'name'>

// Omit - exclude properties
type UserWithoutEmail = Omit<User, 'email'>

// Record - key-value map
type UserMap = Record<string, User>

// Extract - extract from union
type StringOrNumber = string | number | boolean
type OnlyStrings = Extract<StringOrNumber, string>

// Exclude - exclude from union
type NotString = Exclude<StringOrNumber, string>

// NonNullable - remove null/undefined
type MaybeString = string | null | undefined
type DefinitelyString = NonNullable<MaybeString>

// ReturnType - get function return type
function getUser() { return { name: 'John' } }
type UserReturn = ReturnType<typeof getUser>

// Parameters - get function parameters
type GetUserParams = Parameters<typeof getUser>

// Awaited - unwrap Promise
type ResolvedUser = Awaited<Promise<User>>
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
