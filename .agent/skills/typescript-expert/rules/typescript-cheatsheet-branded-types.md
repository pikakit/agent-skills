---
"title": "Typescript Cheatsheet: Branded Types"
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
