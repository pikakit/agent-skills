---
"title": "Use Activity Component for Show/Hide"
"kind": "reference"
"impact": "standard"
"tags":
  - "rendering"
  - "activity"
  - "visibility"
  - "state-preservation"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Use Activity Component for Show/Hide

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## Use Activity Component for Show/Hide

Use React's `<Activity>` to preserve state/DOM for expensive components that frequently toggle visibility.

**Usage:**

```tsx
import { Activity } from 'react'

function Dropdown({ isOpen }: Props) {
  return (
    <Activity mode={isOpen ? 'visible' : 'hidden'}>
      <ExpensiveMenu />
    </Activity>
  )
}
```

Avoids expensive re-renders and state loss.

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
