# React Advanced Patterns

> Extended patterns from react-architect skill.

---

## React 19 Patterns

### New Hooks

| Hook               | Purpose                  |
| ------------------ | ------------------------ |
| **useActionState** | Form submission state    |
| **useOptimistic**  | Optimistic UI updates    |
| **use**            | Read resources in render |

### Compiler Benefits

- Automatic memoization
- Less manual useMemo/useCallback
- Focus on pure components

---

## Composition Patterns

### Compound Components

- Parent provides context
- Children consume context
- Flexible slot-based composition
- Example: Tabs, Accordion, Dropdown

### Render Props vs Hooks

| Use Case           | Prefer                 |
| ------------------ | ---------------------- |
| Reusable logic     | Custom hook            |
| Render flexibility | Render props           |
| Cross-cutting      | Higher-order component |

---

## Performance Deep Dive

### Priority Categories (Vercel Engineering)

| Priority | Category | Impact |
|----------|----------|--------|
| 1 | Eliminating Waterfalls | CRITICAL |
| 2 | Bundle Size | CRITICAL |
| 3 | Server Performance | HIGH |
| 4 | Client Data Fetching | MEDIUM-HIGH |
| 5 | Re-render Optimization | MEDIUM |

### Critical: Waterfalls

- Move `await` into branches where used
- Use `Promise.all()` for independent ops
- Start promises early, await late
- Use Suspense to stream

### Critical: Bundle Size

- Import directly, avoid barrel files
- Use `next/dynamic` for heavy components
- Load analytics after hydration
- Preload on hover for perceived speed

### Optimization Order

1. Check if actually slow
2. Profile with DevTools
3. Identify bottleneck
4. Apply targeted fix

---

## Error Handling

### Error Boundary Usage

| Scope     | Placement              |
| --------- | ---------------------- |
| App-wide  | Root level             |
| Feature   | Route/feature level    |
| Component | Around risky component |

### Error Recovery

- Show fallback UI
- Log error
- Offer retry option
- Preserve user data

---

## TypeScript Patterns

### Props Typing

| Pattern   | Use                 |
| --------- | ------------------- |
| Interface | Component props     |
| Type      | Unions, complex     |
| Generic   | Reusable components |

### Common Types

| Need          | Type               |
| ------------- | ------------------ |
| Children      | ReactNode          |
| Event handler | MouseEventHandler  |
| Ref           | RefObject<Element> |

---

## Testing Principles

| Level       | Focus                 |
| ----------- | --------------------- |
| Unit        | Pure functions, hooks |
| Integration | Component behavior    |
| E2E         | User flows            |

### Test Priorities

- User-visible behavior
- Edge cases
- Error states
- Accessibility

---

## Anti-Patterns

| ❌ Don't                 | ✅ Do             |
| ------------------------ | ----------------- |
| Prop drilling deep       | Use context       |
| Giant components         | Split smaller     |
| useEffect for everything | Server components |
| Premature optimization   | Profile first     |
| Index as key             | Stable unique ID  |

---

⚡ PikaKit v3.9.74
