---
"title": "Compound Components Pattern"
"kind": "reference"
"impact": "high"
"tags":
  - "composition"
  - "compound"
  - "context"
  - "slots"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

# Compound Components Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Compound Components Pattern

> Context-based compound components for flexible, slot-based APIs.

---

## Implementation

```tsx
import { createContext, useContext, useState, type ReactNode } from 'react'

// Context for internal state
const TabsContext = createContext<{
  active: string
  setActive: (id: string) => void
} | null>(null)

function useTabs() {
  const ctx = useContext(TabsContext)
  if (!ctx) throw new Error('Tabs components must be used within <Tabs>')
  return ctx
}

// Parent — provides context
function Tabs({ defaultTab, children }: { defaultTab: string; children: ReactNode }) {
  const [active, setActive] = useState(defaultTab)
  return (
    <TabsContext.Provider value={{ active, setActive }}>
      <div className="tabs">{children}</div>
    </TabsContext.Provider>
  )
}

// Child — consumes context
function TabList({ children }: { children: ReactNode }) {
  return <div className="tab-list" role="tablist">{children}</div>
}

function Tab({ id, children }: { id: string; children: ReactNode }) {
  const { active, setActive } = useTabs()
  return (
    <button role="tab" aria-selected={active === id} onClick={() => setActive(id)}>
      {children}
    </button>
  )
}

function TabPanel({ id, children }: { id: string; children: ReactNode }) {
  const { active } = useTabs()
  if (active !== id) return null
  return <div role="tabpanel">{children}</div>
}

// Attach sub-components
Tabs.List = TabList
Tabs.Tab = Tab
Tabs.Panel = TabPanel
```

## Usage

```tsx
<Tabs defaultTab="overview">
  <Tabs.List>
    <Tabs.Tab id="overview">Overview</Tabs.Tab>
    <Tabs.Tab id="settings">Settings</Tabs.Tab>
  </Tabs.List>
  <Tabs.Panel id="overview">Overview content</Tabs.Panel>
  <Tabs.Panel id="settings">Settings content</Tabs.Panel>
</Tabs>
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
