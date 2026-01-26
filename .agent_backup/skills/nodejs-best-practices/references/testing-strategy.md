# Testing Strategy

## Test Strategy Selection

| Type | Purpose | Tools |
|------|---------|-------|
| **Unit** | Business logic | node:test, Vitest |
| **Integration** | API endpoints | Supertest |
| **E2E** | Full flows | Playwright |

## What to Test (Priorities)

1. **Critical paths**: Auth, payments, core business
2. **Edge cases**: Empty inputs, boundaries
3. **Error handling**: What happens when things fail?
4. **Not worth testing**: Framework code, trivial getters

## Built-in Test Runner (Node.js 22+)

```bash
node --test src/**/*.test.ts
├── No external dependency
├── Good coverage reporting
└── Watch mode available
```
