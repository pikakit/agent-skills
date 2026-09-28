---
"title": "Typescript Cheatsheet: Template Literal Types"
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
