---
"title": "CSS content-visibility for Long Lists"
"kind": "reference"
"impact": "high"
"tags":
  - "rendering"
  - "css"
  - "content-visibility"
  - "long-lists"
"applies_to":
  - "node"
  - "web"
"last_reviewed": "2026-09-28"
"sources":
  - "url": "https://nextjs.org/docs"
    "title": "Official documentation"
---

# CSS content-visibility for Long Lists

## Scope

Apply this guidance only to the declared platforms and repository-confirmed versions.

## Guidance

## CSS content-visibility for Long Lists

Apply `content-visibility: auto` to defer off-screen rendering.

**CSS:**

```css
.message-item {
  content-visibility: auto;
  contain-intrinsic-size: 0 80px;
}
```

**Example:**

```tsx
function MessageList({ messages }: { messages: Message[] }) {
  return (
    <div className="overflow-y-auto h-screen">
      {messages.map(msg => (
        <div key={msg.id} className="message-item">
          <Avatar user={msg.author} />
          <div>{msg.content}</div>
        </div>
      ))}
    </div>
  )
}
```

For 1000 messages, browser skips layout/paint for ~990 off-screen items (10× faster initial render).

## Verification

Cross-check version-sensitive details with the cited official source and verify the resulting behavior in the target environment.
