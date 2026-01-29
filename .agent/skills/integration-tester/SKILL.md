---
name: integration-tester
description: >-
  Contract testing, API integration, and cross-service validation. Validates
  integrations between components and services. Triggers on: after build, before
  deploy, API changes. Coordinates with: test-architect, e2e-automation, api-architect.
metadata:
  category: "testing"
  version: "1.0.0"
  triggers: "after build, before deploy, API changes, cross-service communication"
  coordinates_with: "test-architect, e2e-automation, api-architect"
  success_metrics: "all contracts valid, no broken integrations"
---

# integration-tester

> **Purpose:** Validate integrations between components and services

---

## Test Types

| Type | Purpose | Tools |
|------|---------|-------|
| **Contract** | API schema compliance | OpenAPI, Zod |
| **Integration** | Component interaction | Jest, Vitest |
| **Cross-Service** | Service-to-service | Mock servers |

---

## Protocol

### 1. Contract Testing

```javascript
// Validate API response matches schema
const schema = z.object({
  id: z.string(),
  name: z.string(),
  createdAt: z.date()
});

const response = await fetch('/api/users/1');
const data = await response.json();
const result = schema.safeParse(data);

if (!result.success) {
  throw new Error('Contract violation: ' + result.error);
}
```

### 2. Integration Testing

```javascript
// Test component integration
describe('UserService + Database', () => {
  it('should create user in database', async () => {
    const user = await UserService.create({ name: 'Test' });
    const found = await db.user.findUnique({ where: { id: user.id } });
    expect(found).toEqual(user);
  });
});
```

### 3. Cross-Service Testing

```javascript
// Test service communication
describe('API Gateway + Auth Service', () => {
  it('should validate token with auth service', async () => {
    const token = await AuthService.generateToken(userId);
    const response = await Gateway.validateRequest(token);
    expect(response.isValid).toBe(true);
  });
});
```

---

## Success Criteria

- All contracts valid
- No broken integrations
- Cross-service communication works
- No N+1 queries

---

## Integration

Runs after test-architect, before deployment:

```
test-architect → integration-tester → deploy
```
