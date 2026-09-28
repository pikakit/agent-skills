---
"title": "Use SWR for Automatic Deduplication"
"kind": "code"
"impact": "standard"
"tags":
  - "client"
  - "swr"
  - "deduplication"
  - "data-fetching"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# Use SWR for Automatic Deduplication

## Use SWR for Automatic Deduplication

SWR enables request deduplication, caching, and revalidation across component instances.

## Incorrect
```tsx
function UserList() {
  const [users, setUsers] = useState([])
  useEffect(() => {
    fetch('/api/users')
      .then(r => r.json())
      .then(setUsers)
  }, [])
}
```

## Correct
```tsx
import useSWR from 'swr'

function UserList() {
  const { data: users } = useSWR('/api/users', fetcher)
}
```

**For immutable data:**

```tsx
import { useImmutableSWR } from '@/lib/swr'

function StaticContent() {
  const { data } = useImmutableSWR('/api/config', fetcher)
}
```

**For mutations:**

```tsx
import { useSWRMutation } from 'swr/mutation'

function UpdateButton() {
  const { trigger } = useSWRMutation('/api/user', updateUser)
  return <button onClick={() => trigger()}>Update</button>
}
```

Reference: [https://swr.vercel.app](https://swr.vercel.app)

## Verification

Run the repository typecheck and the narrowest behavioral tests that exercise this rule. Confirm error paths and observable output, not only successful compilation.
