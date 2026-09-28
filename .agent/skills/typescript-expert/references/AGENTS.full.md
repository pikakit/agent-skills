# Typescript Expert Full Agent Rules

> Deterministic compilation of 15 source rules for typescript-expert v4.0.0. Do not edit directly.

## Rule Index

- [Production verification gates](#rule-production-gates) (high, process, source: `rules/production-gates.md`)
- [Typescript Cheatsheet: Best Practices](#rule-typescript-cheatsheet-best-practices) (standard, reference, source: `rules/typescript-cheatsheet-best-practices.md`)
- [Typescript Cheatsheet: Branded Types](#rule-typescript-cheatsheet-branded-types) (standard, reference, source: `rules/typescript-cheatsheet-branded-types.md`)
- [Typescript Cheatsheet: Conditional Types](#rule-typescript-cheatsheet-conditional-types) (standard, reference, source: `rules/typescript-cheatsheet-conditional-types.md`)
- [Typescript Cheatsheet: Discriminated Unions](#rule-typescript-cheatsheet-discriminated-unions) (standard, reference, source: `rules/typescript-cheatsheet-discriminated-unions.md`)
- [Typescript Cheatsheet: Generics](#rule-typescript-cheatsheet-generics) (standard, reference, source: `rules/typescript-cheatsheet-generics.md`)
- [Typescript Cheatsheet: Mapped Types](#rule-typescript-cheatsheet-mapped-types) (standard, reference, source: `rules/typescript-cheatsheet-mapped-types.md`)
- [Typescript Cheatsheet: Module Declarations](#rule-typescript-cheatsheet-module-declarations) (standard, reference, source: `rules/typescript-cheatsheet-module-declarations.md`)
- [Typescript Cheatsheet: Related](#rule-typescript-cheatsheet-related) (standard, reference, source: `rules/typescript-cheatsheet-related.md`)
- [Typescript Cheatsheet: Template Literal Types](#rule-typescript-cheatsheet-template-literal-types) (standard, reference, source: `rules/typescript-cheatsheet-template-literal-types.md`)
- [Typescript Cheatsheet: TSConfig Essentials](#rule-typescript-cheatsheet-tsconfig-essentials) (standard, reference, source: `rules/typescript-cheatsheet-tsconfig-essentials.md`)
- [Typescript Cheatsheet: Type Aliases & Interfaces](#rule-typescript-cheatsheet-type-aliases-interfaces) (standard, reference, source: `rules/typescript-cheatsheet-type-aliases-interfaces.md`)
- [Typescript Cheatsheet: Type Basics](#rule-typescript-cheatsheet-type-basics) (standard, reference, source: `rules/typescript-cheatsheet-type-basics.md`)
- [Typescript Cheatsheet: Type Guards](#rule-typescript-cheatsheet-type-guards) (standard, reference, source: `rules/typescript-cheatsheet-type-guards.md`)
- [Typescript Cheatsheet: Utility Types](#rule-typescript-cheatsheet-utility-types) (standard, reference, source: `rules/typescript-cheatsheet-utility-types.md`)

<a id="rule-production-gates"></a>

## Production verification gates

**Impact:** high
**Kind:** process
**Source:** `rules/production-gates.md`

# Production verification gates

## Preconditions

- Confirm the target platform and dependency versions from the repository.
- Capture a reproducible baseline and define observable acceptance criteria.
- Identify a recoverable rollback point before changing code or configuration.

## Procedure

1. Apply the smallest change that satisfies the documented requirement.
2. Exercise the affected success and failure paths with the narrowest reliable check.
3. Run the repository typecheck, tests, and policy checks that cover the changed surface.
4. Inspect diagnostics for redacted, actionable evidence; a missing or failed checker is not success.

## Rollback

Restore the recorded baseline when a required check errors, the result is inconclusive, or a new regression appears. Re-run the baseline check after restoration.

## Exit Gate

Finish only when required checks execute and pass, acceptance behavior is reproduced, rollback remains available, and residual risks are reported explicitly.

<a id="rule-typescript-cheatsheet-best-practices"></a>

## Typescript Cheatsheet: Best Practices

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-best-practices.md`

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

<a id="rule-typescript-cheatsheet-branded-types"></a>

## Typescript Cheatsheet: Branded Types

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-branded-types.md`

# Typescript Cheatsheet: Branded Types

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Branded Types

```typescript
// Create branded type
type Brand<K, T> = K & { __brand: T }

type UserId = Brand<string, 'UserId'>
type OrderId = Brand<string, 'OrderId'>

// Constructor functions
function createUserId(id: string): UserId {
  return id as UserId
}

function createOrderId(id: string): OrderId {
  return id as OrderId
}

// Usage - prevents mixing
function getOrder(orderId: OrderId, userId: UserId) {}

const userId = createUserId('user-123')
const orderId = createOrderId('order-456')

getOrder(orderId, userId)  // ✅ OK
// getOrder(userId, orderId)  // ❌ Error - types don't match
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-conditional-types"></a>

## Typescript Cheatsheet: Conditional Types

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-conditional-types.md`

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

<a id="rule-typescript-cheatsheet-discriminated-unions"></a>

## Typescript Cheatsheet: Discriminated Unions

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-discriminated-unions.md`

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

<a id="rule-typescript-cheatsheet-generics"></a>

## Typescript Cheatsheet: Generics

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-generics.md`

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

<a id="rule-typescript-cheatsheet-mapped-types"></a>

## Typescript Cheatsheet: Mapped Types

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-mapped-types.md`

# Typescript Cheatsheet: Mapped Types

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Mapped Types

```typescript
// Basic mapped type
type Optional<T> = {
  [K in keyof T]?: T[K]
}

// With key remapping
type Getters<T> = {
  [K in keyof T as `get${Capitalize<string & K>}`]: () => T[K]
}

// Filter keys
type OnlyStrings<T> = {
  [K in keyof T as T[K] extends string ? K : never]: T[K]
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-module-declarations"></a>

## Typescript Cheatsheet: Module Declarations

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-module-declarations.md`

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

<a id="rule-typescript-cheatsheet-related"></a>

## Typescript Cheatsheet: Related

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-related.md`

# Typescript Cheatsheet: Related

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## 🔗 Related

| File | When to Read |
|------|-------------|
| [tsconfig-strict.json](tsconfig-strict.json) | Copy-paste strict config |
| [utility-types.ts](utility-types.ts) | Strict TypeScript utility helpers |
| [SKILL.md](../SKILL.md) | Error routing, patterns |

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-template-literal-types"></a>

## Typescript Cheatsheet: Template Literal Types

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-template-literal-types.md`

# Typescript Cheatsheet: Template Literal Types

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Template Literal Types

```typescript
type Color = 'red' | 'green' | 'blue'
type Size = 'small' | 'medium' | 'large'

// Combine
type ColorSize = `${Color}-${Size}`
// 'red-small' | 'red-medium' | 'red-large' | ...

// Event handlers
type EventName = 'click' | 'focus' | 'blur'
type EventHandler = `on${Capitalize<EventName>}`
// 'onClick' | 'onFocus' | 'onBlur'
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-tsconfig-essentials"></a>

## Typescript Cheatsheet: TSConfig Essentials

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-tsconfig-essentials.md`

# Typescript Cheatsheet: TSConfig Essentials

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## TSConfig Essentials

```json
{
  "compilerOptions": {
    // Strictness
    "strict": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,

    // Modules
    "module": "ESNext",
    "moduleResolution": "bundler",
    "esModuleInterop": true,

    // Output
    "target": "ES2022",
    "lib": ["ES2022", "DOM"],

    // Performance
    "skipLibCheck": true,
    "incremental": true,

    // Paths
    "baseUrl": ".",
    "paths": {
      "@/*": ["./src/*"]
    }
  }
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-type-aliases-interfaces"></a>

## Typescript Cheatsheet: Type Aliases & Interfaces

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-type-aliases-interfaces.md`

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

<a id="rule-typescript-cheatsheet-type-basics"></a>

## Typescript Cheatsheet: Type Basics

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-type-basics.md`

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

<a id="rule-typescript-cheatsheet-type-guards"></a>

## Typescript Cheatsheet: Type Guards

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-type-guards.md`

# Typescript Cheatsheet: Type Guards

## Scope

This reference applies only to the platforms declared in metadata and the versions confirmed in the target repository.

## Guidance

## Type Guards

```typescript
// typeof guard
function process(value: string | number) {
  if (typeof value === 'string') {
    return value.toUpperCase()  // string
  }
  return value.toFixed(2)  // number
}

// instanceof guard
class Dog { bark() {} }
class Cat { meow() {} }

function makeSound(animal: Dog | Cat) {
  if (animal instanceof Dog) {
    animal.bark()
  } else {
    animal.meow()
  }
}

// in guard
interface Bird { fly(): void }
interface Fish { swim(): void }

function move(animal: Bird | Fish) {
  if ('fly' in animal) {
    animal.fly()
  } else {
    animal.swim()
  }
}

// Custom type guard
function isString(value: unknown): value is string {
  return typeof value === 'string'
}

// Assertion function
function assertIsString(value: unknown): asserts value is string {
  if (typeof value !== 'string') {
    throw new Error('Not a string')
  }
}
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.

<a id="rule-typescript-cheatsheet-utility-types"></a>

## Typescript Cheatsheet: Utility Types

**Impact:** standard
**Kind:** reference
**Source:** `rules/typescript-cheatsheet-utility-types.md`

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
