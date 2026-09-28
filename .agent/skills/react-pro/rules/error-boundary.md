---
"title": "Error Boundary Pattern"
"kind": "reference"
"impact": "high"
"tags":
  - "error"
  - "boundary"
  - "fallback"
  - "catch"
"applies_to":
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://react.dev/reference/react"
    "title": "Official documentation"
---

# Error Boundary Pattern

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

# Error Boundary Pattern

> Class-based error boundary that catches render errors and shows fallback UI.

---

## Implementation

```tsx
import { Component, type ReactNode } from 'react'

interface Props { children: ReactNode; fallback?: ReactNode }
interface State { hasError: boolean; error: Error | null }

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, info: React.ErrorInfo) {
    console.error('ErrorBoundary caught:', error, info.componentStack)
    // Send to error reporting service
  }

  render() {
    if (this.state.hasError) {
      return this.props.fallback || (
        <div role="alert">
          <h2>Something went wrong</h2>
          <button onClick={() => this.setState({ hasError: false, error: null })}>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
```

## Usage

```tsx
// Wrap at route/feature level
<ErrorBoundary fallback={<ErrorPage />}>
  <UserDashboard />
</ErrorBoundary>
```

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
