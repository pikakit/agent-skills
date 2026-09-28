# Api Architect Full Agent Rules

> Deterministic compilation of 11 source rules for api-architect v3.9.224. Do not edit directly.

## Rule Index

- [API Style Selection](#rule-api-style) (high, decision, source: `rules/api-style.md`)
- [Authentication Patterns](#rule-auth) (high, decision, source: `rules/auth.md`)
- [API Documentation Principles](#rule-documentation) (standard, reference, source: `rules/documentation.md`)
- [API Contract Release Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)
- [GraphQL Principles](#rule-graphql) (high, decision, source: `rules/graphql.md`)
- [Rate Limiting Principles](#rule-rate-limiting) (high, decision, source: `rules/rate-limiting.md`)
- [Response Format Principles](#rule-response) (high, decision, source: `rules/response.md`)
- [REST Principles](#rule-rest) (high, reference, source: `rules/rest.md`)
- [API Security Testing](#rule-security-testing) (critical, process, source: `rules/security-testing.md`)
- [tRPC Principles](#rule-trpc) (standard, decision, source: `rules/trpc.md`)
- [Versioning Strategies](#rule-versioning) (high, decision, source: `rules/versioning.md`)

<a id="rule-api-style"></a>

## API Style Selection

**Impact:** high
**Kind:** decision
**Source:** `rules/api-style.md`

# API Style Selection

> Choose API style for THIS project's context — don't default to REST.

---

## Decision Tree

```
Who are the API consumers?
│
├── Public API / Multiple platforms
│   └── REST + OpenAPI (widest compatibility)
│
├── Complex data needs / Multiple frontends
│   └── GraphQL (flexible queries)
│
├── TypeScript frontend + backend (monorepo)
│   └── tRPC (end-to-end type safety)
│
├── Real-time / Event-driven
│   └── WebSocket + AsyncAPI
│
└── Internal microservices
    └── gRPC (performance) or REST (simplicity)
```

## Comparison

| Factor | REST | GraphQL | tRPC |
|--------|------|---------|------|
| **Best for** | Public APIs | Complex apps | TS monorepos |
| **Learning curve** | Low | Medium | Low (if TS) |
| **Over/under fetching** | Common | Solved | Solved |
| **Type safety** | Manual (OpenAPI) | Schema-based | Automatic |
| **Caching** | HTTP native | Complex | Client-based |
| **File uploads** | Native | Complex | Needs adapter |
| **Versioning** | URI/Header | Schema evolution | Type inference |
| **Tooling maturity** | Excellent | Good | Growing |

## Code Comparison — Same Endpoint

### REST

```typescript
// GET /api/users/123
app.get('/api/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  res.json({ data: user });
});
```

### GraphQL

```typescript
// query { user(id: "123") { name email } }
const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }) =>
      db.user.findUnique({ where: { id } }),
  },
};
```

### tRPC

```typescript
// client.user.getById.query("123")
export const userRouter = router({
  getById: publicProcedure
    .input(z.string())
    .query(({ input }) => db.user.findUnique({ where: { id: input } })),
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Default to REST for every project | Evaluate consumers + context first |
| Mix API styles without justification | Pick one, document reasoning |
| Choose GraphQL for simple CRUD | Use REST or tRPC for simple cases |
| Use tRPC for public APIs | Use REST + OpenAPI for public APIs |

## Selection Questions

1. Who are the API consumers? (web, mobile, third-party, internal)
2. Is the frontend TypeScript?
3. How complex are the data relationships?
4. Is HTTP caching critical?
5. Public or internal API?

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | REST endpoint design |
| [graphql.md](graphql.md) | GraphQL schema design |
| [trpc.md](trpc.md) | tRPC for TS monorepos |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Select an API style from consumer diversity, contract needs, query shape, ownership, and compatibility constraints. Keep public interoperability separate from internal implementation convenience.

## Use When

Use REST with an OpenAPI contract for broadly interoperable HTTP APIs. Consider GraphQL for consumer-selected graph projections with mature query controls. Consider tRPC only inside a tightly coupled TypeScript trust and release boundary.

## Avoid When

Avoid defaulting to one style, exposing database shape directly, or mixing styles without explicit ownership and gateway policy.

## Trade-offs

REST favors HTTP interoperability, GraphQL favors query flexibility with added operational controls, and tRPC favors compile-time coupling within TypeScript systems.

## Verification

Prototype the highest-risk consumer flow and verify contract generation, authorization, caching, observability, compatibility, and failure behavior.

<a id="rule-auth"></a>

## Authentication Patterns

**Impact:** high
**Kind:** decision
**Source:** `rules/auth.md`

# Authentication Patterns

> Choose auth pattern based on consumers and security requirements.

---

## Selection Guide

| Pattern | Best For | Security Level |
|---------|----------|:--------------:|
| **JWT** | Stateless APIs, microservices | Medium |
| **Session** | Traditional web, server-rendered | High |
| **OAuth 2.0 PKCE** | Third-party login, SPA/mobile | High |
| **API Keys** | Server-to-server, public APIs | Low-Medium |
| **Passkey** | Modern passwordless (2025+) | Very High |

## JWT Pattern

```typescript
import jwt from 'jsonwebtoken';

// Sign — keep payload minimal
function signTokens(userId: string) {
  const accessToken = jwt.sign(
    { sub: userId, type: 'access' },
    process.env.JWT_SECRET!,
    { expiresIn: '15m' }   // Short-lived
  );

  const refreshToken = jwt.sign(
    { sub: userId, type: 'refresh' },
    process.env.JWT_REFRESH_SECRET!,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
}

// Verify middleware
function authMiddleware(req: Request, res: Response, next: NextFunction) {
  const token = req.headers.authorization?.replace('Bearer ', '');
  if (!token) return res.status(401).json({ error: 'Missing token' });

  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET!);
    req.user = payload as JwtPayload;
    next();
  } catch {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}
```

## Token Refresh Flow

```
Client                        Server
  │                              │
  ├── Request + Access Token ──→ │
  │                              ├── Verify token
  │ ←── 401 Token Expired ──────┤
  │                              │
  ├── POST /auth/refresh ──────→ │
  │    { refreshToken }          ├── Verify refresh token
  │                              ├── Issue new access + refresh
  │ ←── { accessToken,          │
  │       refreshToken } ───────┤
  │                              │
  ├── Retry original request ──→ │
```

## OAuth 2.0 PKCE (for SPAs/Mobile)

```typescript
// 1. Generate PKCE challenge
const codeVerifier = crypto.randomBytes(32).toString('base64url');
const codeChallenge = crypto
  .createHash('sha256')
  .update(codeVerifier)
  .digest('base64url');

// 2. Redirect to provider
const authUrl = `https://provider.com/authorize?` +
  `client_id=${CLIENT_ID}&` +
  `code_challenge=${codeChallenge}&` +
  `code_challenge_method=S256&` +
  `redirect_uri=${REDIRECT_URI}&` +
  `response_type=code&scope=openid+email`;

// 3. Exchange code for tokens (server-side)
const tokens = await fetch('https://provider.com/token', {
  method: 'POST',
  body: new URLSearchParams({
    grant_type: 'authorization_code',
    code: authorizationCode,
    code_verifier: codeVerifier,
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
  }),
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Store sensitive data in JWT payload | Include only `sub`, `type`, `exp` |
| Use long-lived access tokens (>1h) | Short access (15m) + refresh (7d) |
| Send tokens in URL query params | Use `Authorization: Bearer` header |
| Use OAuth implicit flow | Use PKCE for SPAs and mobile |
| Skip token revocation | Maintain a revocation list for refresh tokens |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [security-testing.md](security-testing.md) | Auth testing patterns |
| [rate-limiting.md](rate-limiting.md) | Rate limit auth endpoints |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Separate authentication, session management, token delegation, and authorization. Prefer established identity protocols and platform libraries over custom token formats.

## Use When

Use server sessions for same-origin applications when revocation and centralized control matter. Use OAuth/OIDC flows for delegated or federated identity and PKCE for public clients where required.

## Avoid When

Avoid storing bearer tokens in exposed browser storage, using API keys as end-user identity, or treating a valid token as sufficient object authorization.

## Trade-offs

Central sessions simplify revocation but require shared state. Self-contained access tokens reduce lookup coupling but complicate revocation, key rotation, audience control, and leakage response.

## Verification

Test expiry, revocation, rotation, audience and issuer validation, replay, CSRF where relevant, and object/function authorization for every protected operation.

<a id="rule-documentation"></a>

## API Documentation Principles

**Impact:** standard
**Kind:** reference
**Source:** `rules/documentation.md`

# API Documentation Principles

> Good docs = happy developers = API adoption.

---

## OpenAPI 3.1 Example

```yaml
openapi: 3.1.0
info:
  title: Users API
  version: 1.0.0
  description: User management endpoints

paths:
  /users:
    get:
      summary: List users
      operationId: listUsers
      parameters:
        - name: page
          in: query
          schema: { type: integer, default: 1 }
        - name: limit
          in: query
          schema: { type: integer, default: 20, maximum: 100 }
      responses:
        '200':
          description: Paginated user list
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/UserListResponse'

    post:
      summary: Create user
      operationId: createUser
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/CreateUserInput'
      responses:
        '201':
          description: User created
        '422':
          description: Validation error
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/ErrorResponse'

components:
  schemas:
    User:
      type: object
      properties:
        id: { type: string, format: uuid }
        name: { type: string }
        email: { type: string, format: email }
      required: [id, name, email]

    ErrorResponse:
      type: object
      properties:
        success: { type: boolean, enum: [false] }
        error:
          type: object
          properties:
            code: { type: string }
            message: { type: string }
            requestId: { type: string }
```

## Swagger UI Setup (Express)

```typescript
import swaggerUi from 'swagger-ui-express';
import spec from './openapi.json';

app.use('/docs', swaggerUi.serve, swaggerUi.setup(spec, {
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: 'API Documentation',
}));
```

## Good Documentation Includes

| Section | Purpose |
|---------|---------|
| **Quick Start** | Get running in 5 minutes |
| **Authentication** | How to get and use tokens |
| **API Reference** | Every endpoint with examples |
| **Error Handling** | Error codes and recovery |
| **Rate Limits** | Limits and headers |
| **Changelog** | Breaking changes and deprecations |
| **Code Examples** | Multiple languages (curl, JS, Python) |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Write docs after shipping | Generate from OpenAPI spec |
| Skip request/response examples | Include full JSON examples |
| Documentation-only errors | Use consistent error schema |
| Outdated examples | Auto-generate from tests |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [response.md](response.md) | Response format for docs |
| [versioning.md](versioning.md) | Documenting API versions |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Scope

Cover machine-readable operations, schemas, authentication requirements, errors, pagination, compatibility, examples, and lifecycle metadata for an HTTP API.

## Guidance

Generate or validate OpenAPI from the same contract used by implementation tests. Keep examples synthetic, define reusable schemas, document authorization per operation, and publish deprecation and contact information.

## Verification

Validate the document against the declared OpenAPI version, resolve every reference, run example and contract tests, and confirm generated clients handle documented success and error responses.

<a id="rule-engineering-spec"></a>

## API Contract Release Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# API Contract Release Gate

## Preconditions

- Identify consumers, owners, data classification, trust boundaries, and compatibility policy.
- Record latency, availability, consistency, and lifecycle requirements.
- Define authorization at object, property, and operation levels.

## Procedure

1. Select an API style from consumer and change requirements.
2. Define operations, schemas, validation, errors, pagination, concurrency, and idempotency.
3. Publish a machine-readable contract and examples with no secrets or production data.
4. Threat-model authentication, authorization, resource consumption, SSRF, inventory, and unsafe upstream consumption.
5. Verify contract behavior with positive, negative, compatibility, authorization, and load tests.
6. Roll out additively, monitor consumer errors, and publish deprecation and sunset information when applicable.

## Rollback

Restore the previous compatible implementation and contract. Keep additive fields tolerant during rollback and preserve required idempotency records or migrations.

## Exit Gate

Pass when implementation and contract agree, unauthorized access is denied, limits are enforced, compatibility checks pass, documentation resolves, and rollback has a compatible target.

<a id="rule-graphql"></a>

## GraphQL Principles

**Impact:** high
**Kind:** decision
**Source:** `rules/graphql.md`

# GraphQL Principles

> Flexible queries for complex, interconnected data.

---

## When to Use

```
✅ Good fit:
├── Complex, interconnected data
├── Multiple frontend platforms
├── Clients need flexible queries
├── Evolving data requirements
└── Reducing over-fetching matters

❌ Poor fit:
├── Simple CRUD operations
├── File upload heavy
├── HTTP caching important
└── Team unfamiliar with GraphQL
```

## Schema Design

```graphql
# Think in graphs, not endpoints
type User {
  id: ID!
  name: String!
  email: String!
  posts(first: Int = 10, after: String): PostConnection!
  createdAt: DateTime!
}

type Post {
  id: ID!
  title: String!
  content: String!
  author: User!
}

# Relay-style pagination (recommended)
type PostConnection {
  edges: [PostEdge!]!
  pageInfo: PageInfo!
  totalCount: Int!
}

type PostEdge {
  node: Post!
  cursor: String!
}

type PageInfo {
  hasNextPage: Boolean!
  hasPreviousPage: Boolean!
  startCursor: String
  endCursor: String
}
```

## Resolver Pattern

```typescript
const resolvers = {
  Query: {
    user: (_: unknown, { id }: { id: string }, ctx: Context) =>
      ctx.dataSources.users.getById(id),

    users: (_: unknown, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.users.getConnection(args),
  },

  // Field resolver — handles N+1 via DataLoader
  User: {
    posts: (parent: User, args: PaginationArgs, ctx: Context) =>
      ctx.dataSources.posts.getByAuthor(parent.id, args),
  },
};
```

## N+1 Prevention — DataLoader

```typescript
import DataLoader from 'dataloader';

// Batch function: receives array of IDs, returns array of results
const userLoader = new DataLoader<string, User>(async (ids) => {
  const users = await db.user.findMany({ where: { id: { in: [...ids] } } });
  const map = new Map(users.map(u => [u.id, u]));
  return ids.map(id => map.get(id)!);
});

// In resolver — automatically batched
const resolvers = {
  Post: {
    author: (post: Post) => userLoader.load(post.authorId),
  },
};
```

## Security

| Threat | Mitigation |
|--------|-----------|
| Query depth attack | Set max depth (e.g., 7) |
| Query complexity | Calculate cost per field, set max |
| Batching abuse | Limit batch size |
| Introspection leak | Disable in production |
| Field-level auth | Check permissions per resolver |

```typescript
// Query depth + complexity limits
const server = new ApolloServer({
  validationRules: [
    depthLimit(7),
    costAnalysis({ maximumCost: 1000 }),
  ],
  introspection: process.env.NODE_ENV !== 'production',
});
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Expose database schema directly | Design schema for clients |
| One mega-query resolver | Keep resolvers small + composable |
| Skip DataLoader | Always use DataLoader for relations |
| Allow unlimited query depth | Set max depth (7) + cost limits |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |
| [security-testing.md](security-testing.md) | GraphQL security testing |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Adopt GraphQL when consumers need controlled graph-shaped projections and the team can operate schema evolution, field-level authorization, batching, cost controls, and observability.

## Use When

Use it for multiple consumers with materially different but related data needs and a governed schema owned independently from persistence.

## Avoid When

Avoid it for simple resource APIs, uncontrolled public query execution, bulk file transfer, or teams without resolver and query-cost operations.

## Trade-offs

Client flexibility can reduce endpoint proliferation, but shifts complexity to schema governance, cache strategy, resolver performance, authorization, and abuse prevention.

## Verification

Test field and object authorization, depth/complexity limits, batching, pagination, nullability, schema compatibility, introspection policy, and sensitive error redaction.

<a id="rule-rate-limiting"></a>

## Rate Limiting Principles

**Impact:** high
**Kind:** decision
**Source:** `rules/rate-limiting.md`

# Rate Limiting Principles

> Protect your API from abuse and overload.

## Why Rate Limit

```
Protect against:
├── Brute force attacks
├── Resource exhaustion
├── Cost overruns (if pay-per-use)
└── Unfair usage
```

## Strategy Selection

| Type | How | When |
|------|-----|------|
| **Token bucket** | Burst allowed, refills over time | Most APIs |
| **Sliding window** | Smooth distribution | Strict limits |
| **Fixed window** | Simple counters per window | Basic needs |

## Response Headers

```
Include in headers:
├── X-RateLimit-Limit (max requests)
├── X-RateLimit-Remaining (requests left)
├── X-RateLimit-Reset (when limit resets)
└── Return 429 when exceeded
```

## Redis Implementation Pattern

```typescript
// Sliding window with Redis
const key = `ratelimit:${userId}:${endpoint}`;
const current = await redis.incr(key);
if (current === 1) {
  await redis.expire(key, windowSeconds);
}
if (current > maxRequests) {
  throw new RateLimitError();
}
```

**Recommended Limits:**
| Endpoint Type | Limit | Window |
|---------------|-------|--------|
| Public API | 100 | 1 min |
| Authenticated | 1000 | 1 min |
| Auth endpoints | 5 | 15 min |
| File uploads | 10 | 1 hour |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [security-testing.md](security-testing.md) | Rate limit bypass testing |
| [auth.md](auth.md) | Auth endpoint limits |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Select a limiter from the protected resource, abuse model, fairness unit, burst tolerance, and distributed consistency needs. Derive limits from capacity tests and product policy, not universal numbers.

## Use When

Apply limits to authentication, expensive queries, third-party calls, write bursts, and tenant-scoped resources. Combine request counts with concurrency, payload, and cost limits where needed.

## Avoid When

Avoid one global counter, client-supplied identity keys, silent drops, or in-memory-only enforcement across an independently scaled fleet.

## Trade-offs

Stricter distributed accuracy costs latency and availability; approximate local enforcement is faster but permits bounded overshoot.

## Verification

Load-test steady, burst, distributed, retry, and failover behavior. Verify `429` responses and retry metadata without leaking account existence.

<a id="rule-response"></a>

## Response Format Principles

**Impact:** high
**Kind:** decision
**Source:** `rules/response.md`

# Response Format Principles

> One envelope pattern for ALL endpoints — consistency is key.

---

## Envelope Pattern (Recommended)

```typescript
// Success response
interface ApiResponse<T> {
  success: true;
  data: T;
  meta?: PaginationMeta;
}

// Error response
interface ApiError {
  success: false;
  error: {
    code: string;         // Machine-readable: "VALIDATION_ERROR"
    message: string;      // Human-readable: "Email is invalid"
    details?: Record<string, string[]>; // Field-level errors
    requestId: string;    // For support: "req_abc123"
  };
}

type ApiResult<T> = ApiResponse<T> | ApiError;
```

### Usage Example

```typescript
// Express middleware helper
function ok<T>(res: Response, data: T, meta?: PaginationMeta) {
  res.json({ success: true, data, meta });
}

function fail(res: Response, status: number, code: string, message: string) {
  res.status(status).json({
    success: false,
    error: { code, message, requestId: res.locals.requestId },
  });
}

// In route handler
app.get('/users/:id', async (req, res) => {
  const user = await db.user.findUnique({ where: { id: req.params.id } });
  if (!user) return fail(res, 404, 'NOT_FOUND', 'User not found');
  ok(res, user);
});
```

## Error Response Standards

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": {
      "email": ["Must be a valid email"],
      "age": ["Must be at least 18"]
    },
    "requestId": "req_abc123"
  }
}
```

**Never expose:** stack traces, SQL queries, internal paths, dependency versions.

## Pagination

| Type | Best For | Trade-offs |
|------|----------|------------|
| **Offset** | Simple, jumpable pages | Slow on large datasets, skip drift |
| **Cursor** | Large datasets, infinite scroll | Can't jump to page N |
| **Keyset** | Performance critical, sorted data | Requires sortable unique key |

### Pagination Response

```typescript
interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// Cursor-based alternative
interface CursorMeta {
  cursor: string | null;  // null = no more pages
  hasMore: boolean;
  limit: number;
}
```

### Selection Guide

1. Dataset < 10K rows → Offset pagination
2. Dataset > 10K, infinite scroll → Cursor pagination
3. Performance critical → Keyset pagination
4. Data frequently changing → Cursor (avoids skip drift)

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Different formats per endpoint | One envelope for all endpoints |
| Expose stack traces in errors | Map to safe client-facing codes |
| Return `200 OK` with error body | Use proper HTTP status codes |
| No request ID in errors | Always include for debugging/support |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | HTTP methods + status codes |
| [rate-limiting.md](rate-limiting.md) | 429 response format |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Use native HTTP status and headers plus a stable media-type-specific body. Use RFC 9457 problem details for HTTP API errors when it fits the contract; do not wrap every response solely to repeat success state.

## Use When

Define shared error, pagination, correlation, and field-selection conventions across independently implemented operations.

## Avoid When

Avoid returning `200` for failures, exposing stack traces, inventing unstable error strings as identifiers, or mixing pagination schemes without versioned contracts.

## Trade-offs

Uniform envelopes simplify some clients but add nesting and may duplicate HTTP semantics. Native responses improve interoperability but require clients to handle status and media types correctly.

## Verification

Contract-test success, validation, authorization, conflict, throttling, and server errors; verify headers, content types, redaction, pagination boundaries, and correlation.

<a id="rule-rest"></a>

## REST Principles

**Impact:** high
**Kind:** reference
**Source:** `rules/rest.md`

# REST Principles

> Resource-based API design — nouns not verbs.

---

## Resource Naming Rules

```
Principles:
├── Use NOUNS, not verbs (resources, not actions)
├── Use PLURAL forms (/users not /user)
├── Use lowercase with hyphens (/user-profiles)
├── Nest for relationships (/users/123/posts)
└── Keep shallow (max 3 levels deep)
```

### Endpoint Examples

```
✅ Good:
GET    /users              → List users
GET    /users/123          → Get user 123
POST   /users              → Create user
PUT    /users/123          → Replace user 123
PATCH  /users/123          → Partial update user 123
DELETE /users/123          → Delete user 123
GET    /users/123/posts    → User 123's posts

❌ Bad:
GET    /getUsers           → Verb in URL
POST   /createUser         → Verb in URL
GET    /user               → Singular
GET    /users/123/posts/456/comments/789/likes  → Too deep (>3 levels)
```

## HTTP Method Selection

| Method | Purpose | Idempotent? | Body? |
|--------|---------|-------------|-------|
| **GET** | Read resource(s) | Yes | No |
| **POST** | Create new resource | No | Yes |
| **PUT** | Replace entire resource | Yes | Yes |
| **PATCH** | Partial update | No | Yes |
| **DELETE** | Remove resource | Yes | No |

## Status Code Selection

| Situation | Code | When |
|-----------|------|------|
| Success (read) | 200 | GET returning data |
| Created | 201 | POST success, include Location header |
| No content | 204 | DELETE success, PUT with no response body |
| Bad request | 400 | Malformed JSON, missing required field |
| Unauthorized | 401 | Missing or invalid auth token |
| Forbidden | 403 | Valid auth, insufficient permissions |
| Not found | 404 | Resource doesn't exist |
| Conflict | 409 | Duplicate key, state conflict |
| Validation error | 422 | Valid syntax, invalid semantics |
| Rate limited | 429 | Too many requests, include Retry-After |
| Server error | 500 | Unhandled exception |

## Filtering, Sorting & Search

```typescript
// Filtering — use query params
GET /users?role=admin&status=active

// Sorting — prefix with - for descending
GET /users?sort=-created_at,name

// Search — use q parameter
GET /users?q=john

// Fields projection (sparse fieldsets)
GET /users?fields=id,name,email

// Combined
GET /users?role=admin&sort=-created_at&fields=id,name&page=2&limit=20
```

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| `/getUsers`, `/deleteUser/123` | `GET /users`, `DELETE /users/123` |
| `/user` (singular) | `/users` (plural) |
| Return 200 for errors | Use semantic HTTP status codes |
| Nest beyond 3 levels | Use flat endpoints with filters |
| Ignore idempotency | Design PUT/DELETE as idempotent |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [response.md](response.md) | Response envelope + pagination |
| [versioning.md](versioning.md) | API versioning strategy |
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |

## Scope

Apply HTTP semantics to resource-oriented APIs, including methods, status codes, conditional requests, caching, content negotiation, and links.

## Guidance

Model stable resources rather than database tables. Use safe and idempotent methods according to RFC 9110, validate media types, define concurrency behavior, and keep authorization independent from predictable identifiers.

## Verification

Run contract tests for method semantics, status codes, headers, caching, conditional requests, repeated idempotent calls, content negotiation, and authorization across resource identifiers.

<a id="rule-security-testing"></a>

## API Security Testing

**Impact:** critical
**Kind:** process
**Source:** `rules/security-testing.md`

# API Security Testing

> Principles for testing API security. OWASP API Top 10, authentication, authorization testing.

---

## OWASP API Security Top 10

| Vulnerability | Test Focus |
|---------------|------------|
| **API1: BOLA** | Access other users' resources |
| **API2: Broken Auth** | JWT, session, credentials |
| **API3: Property Auth** | Mass assignment, data exposure |
| **API4: Resource Consumption** | Rate limiting, DoS |
| **API5: Function Auth** | Admin endpoints, role bypass |
| **API6: Business Flow** | Logic abuse, automation |
| **API7: SSRF** | Internal network access |
| **API8: Misconfiguration** | Debug endpoints, CORS |
| **API9: Inventory** | Shadow APIs, old versions |
| **API10: Unsafe Consumption** | Third-party API trust |

---

## Authentication Testing

### JWT Testing

| Check | What to Test |
|-------|--------------|
| Algorithm | None, algorithm confusion |
| Secret | Weak secrets, brute force |
| Claims | Expiration, issuer, audience |
| Signature | Manipulation, key injection |

### Session Testing

| Check | What to Test |
|-------|--------------|
| Generation | Predictability |
| Storage | Client-side security |
| Expiration | Timeout enforcement |
| Invalidation | Logout effectiveness |

---

## Authorization Testing

| Test Type | Approach |
|-----------|----------|
| **Horizontal** | Access peer users' data |
| **Vertical** | Access higher privilege functions |
| **Context** | Access outside allowed scope |

### BOLA/IDOR Testing

1. Identify resource IDs in requests
2. Capture request with user A's session
3. Replay with user B's session
4. Check for unauthorized access

---

## Input Validation Testing

| Injection Type | Test Focus |
|----------------|------------|
| SQL | Query manipulation |
| NoSQL | Document queries |
| Command | System commands |
| LDAP | Directory queries |

**Approach:** Test all parameters, try type coercion, test boundaries, check error messages.

---

## Rate Limiting Testing

| Aspect | Check |
|--------|-------|
| Existence | Is there any limit? |
| Bypass | Headers, IP rotation |
| Scope | Per-user, per-IP, global |

**Bypass techniques:** X-Forwarded-For, different HTTP methods, case variations, API versioning.

---

## GraphQL Security

| Test | Focus |
|------|-------|
| Introspection | Schema disclosure |
| Batching | Query DoS |
| Nesting | Depth-based DoS |
| Authorization | Field-level access |

---

## Security Testing Checklist

**Authentication:**
- [ ] Test for bypass
- [ ] Check credential strength
- [ ] Verify token security

**Authorization:**
- [ ] Test BOLA/IDOR
- [ ] Check privilege escalation
- [ ] Verify function access

**Input:**
- [ ] Test all parameters
- [ ] Check for injection

**Config:**
- [ ] Check CORS
- [ ] Verify headers
- [ ] Test error handling

---

> **Remember:** APIs are the backbone of modern apps. Test them like attackers will.

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [auth.md](auth.md) | Auth patterns to test |
| [rate-limiting.md](rate-limiting.md) | Rate limit bypass testing |
| [graphql.md](graphql.md) | GraphQL-specific security |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Preconditions

Obtain authorization, define scope and rate limits, use isolated accounts and data, and prepare monitoring and an abort contact.

## Procedure

1. Inventory operations, versions, identities, objects, properties, and business flows.
2. Test authentication and token lifecycle.
3. Test object, property, and function authorization across tenants and roles.
4. Test resource consumption, SSRF boundaries, unsafe upstream data, inventory drift, and misconfiguration.
5. Record reproducible evidence with secrets and personal data redacted.

## Rollback

Stop on instability, remove test data and accounts, restore changed configuration, and notify the owner of any residual effect.

## Exit Gate

Pass only when critical paths have negative authorization tests, limits are enforced, findings have owners and severity, and retests verify remediation.

<a id="rule-trpc"></a>

## tRPC Principles

**Impact:** standard
**Kind:** decision
**Source:** `rules/trpc.md`

# tRPC Principles

> End-to-end type safety for TypeScript monorepos — zero code generation.

---

## When to Use

```
✅ Perfect fit:
├── TypeScript on both ends
├── Monorepo structure
├── Internal tools / dashboards
├── Rapid development
└── Type safety is critical

❌ Poor fit:
├── Non-TypeScript clients
├── Public API (need OpenAPI docs)
├── Need REST conventions (caching)
└── Multiple language backends
```

## Router Definition

```typescript
// server/trpc.ts — Base setup
import { initTRPC, TRPCError } from '@trpc/server';
import { z } from 'zod';

const t = initTRPC.context<Context>().create();

export const router = t.router;
export const publicProcedure = t.procedure;
export const protectedProcedure = t.procedure.use(isAuthed);
```

```typescript
// server/routers/user.ts — Router with Zod validation
export const userRouter = router({
  getById: publicProcedure
    .input(z.string().uuid())
    .query(async ({ input, ctx }) => {
      const user = await ctx.db.user.findUnique({ where: { id: input } });
      if (!user) throw new TRPCError({ code: 'NOT_FOUND' });
      return user;
    }),

  create: protectedProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      email: z.string().email(),
      role: z.enum(['user', 'admin']).default('user'),
    }))
    .mutation(async ({ input, ctx }) => {
      return ctx.db.user.create({ data: input });
    }),

  list: publicProcedure
    .input(z.object({
      page: z.number().int().min(1).default(1),
      limit: z.number().int().min(1).max(100).default(20),
    }))
    .query(async ({ input, ctx }) => {
      const { page, limit } = input;
      const [data, total] = await Promise.all([
        ctx.db.user.findMany({ skip: (page - 1) * limit, take: limit }),
        ctx.db.user.count(),
      ]);
      return { data, total, totalPages: Math.ceil(total / limit) };
    }),
});
```

## Client Usage (React Query)

```typescript
// Client — fully typed, zero codegen
import { trpc } from '~/utils/trpc';

function UserProfile({ id }: { id: string }) {
  const { data: user } = trpc.user.getById.useQuery(id);
  const createUser = trpc.user.create.useMutation();

  // Autocomplete works across the full stack
  return <div>{user?.name}</div>;
}
```

## Integration Patterns

| Setup | Framework | Notes |
|-------|-----------|-------|
| Next.js + tRPC | `@trpc/next` | App Router + RSC support |
| Remix + tRPC | Custom adapter | Less common |
| Monorepo | Shared `@repo/trpc` package | Most scalable |
| Standalone | Express adapter | `@trpc/server/adapters/express` |

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Use tRPC for public APIs | Use REST + OpenAPI for public |
| Skip Zod validation | Always validate with `.input(z.object(...))` |
| Put all routes in one file | Split into domain routers (`userRouter`, `postRouter`) |
| Catch errors silently | Throw `TRPCError` with proper codes |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [api-style.md](api-style.md) | REST vs GraphQL vs tRPC decision |
| [auth.md](auth.md) | Auth middleware patterns |
| [SKILL.md](../SKILL.md) | Full decision framework |

## Decision

Use tRPC only when client and server share TypeScript contracts, release coordination, and a compatible trust boundary. Keep domain logic and authorization independent from router types.

## Use When

Use it for internal or tightly coordinated TypeScript applications where end-to-end inference materially improves delivery and runtime validation remains explicit.

## Avoid When

Avoid it for public multi-language APIs, independently versioned consumers, or contracts that require standards-based external tooling.

## Trade-offs

Inference reduces duplicated types but increases framework and release coupling. Runtime validation and compatibility planning remain necessary.

## Verification

Test runtime input validation, authorization, error mapping, serialization, cancellation, compatibility, and behavior from a built client using the published contract.

<a id="rule-versioning"></a>

## Versioning Strategies

**Impact:** high
**Kind:** decision
**Source:** `rules/versioning.md`

# Versioning Strategies

> Plan for API evolution from day one.

---

## Strategy Selection

| Strategy | Implementation | Best For | Trade-offs |
|----------|---------------|----------|------------|
| **URI** | `/v1/users` | Public APIs | Clear, easy caching; URL pollution |
| **Header** | `Accept-Version: 1` | Internal APIs | Clean URLs; harder discovery |
| **Query** | `?version=1` | Quick prototypes | Easy to add; messy, cache-unfriendly |
| **None** | Evolve carefully | GraphQL, tRPC | Simplest; risky for REST public APIs |

## Decision Guide

```
Is it a public REST API?
├── Yes → URI versioning (/v1/users)
│         Most discoverable, best tooling support
│
├── Internal REST only? → Header versioning
│         Cleaner URLs, version-aware clients
│
├── GraphQL? → No versioning (evolve schema)
│         Add fields, deprecate old ones
│
└── tRPC? → No versioning (types enforce compat)
          Breaking changes caught at compile time
```

## URI Versioning Example

```typescript
// Express — version in path
import { Router } from 'express';

const v1 = Router();
v1.get('/users', getUsersV1);
v1.get('/users/:id', getUserByIdV1);

const v2 = Router();
v2.get('/users', getUsersV2);        // Changed response format
v2.get('/users/:id', getUserByIdV2);

app.use('/api/v1', v1);
app.use('/api/v2', v2);
```

## Deprecation & Sunset

```typescript
// Deprecation headers (RFC 8594)
app.use('/api/v1', (req, res, next) => {
  res.set('Deprecation', 'true');
  res.set('Sunset', 'Sat, 01 Jun 2026 00:00:00 GMT');
  res.set('Link', '</api/v2>; rel="successor-version"');
  next();
});
```

**Sunset Policy:**
1. Announce deprecation with `Deprecation: true` header
2. Set `Sunset` date (minimum 6 months for public APIs)
3. Include `Link` header pointing to successor
4. Monitor usage — notify active consumers
5. Remove after sunset date

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Version after breaking changes | Define strategy before first endpoint |
| Remove old version without notice | Sunset with 6+ months warning |
| Mix versioning strategies | Pick one approach |
| Version internal tRPC APIs | Let TypeScript catch breaking changes |

---

## 🔗 Related

| File | When to Read |
|------|-------------|
| [rest.md](rest.md) | REST endpoint design |
| [documentation.md](documentation.md) | Documenting versions |
| [api-style.md](api-style.md) | API style decision |

## Decision

Prefer additive compatible evolution. Introduce an explicit version boundary only when semantics cannot remain compatible, and pair deprecation with measurable consumer migration.

## Use When

Version a public contract for breaking schema, behavior, authentication, or lifecycle changes that cannot be negotiated safely.

## Avoid When

Avoid version bumps for additive fields, implementation refactors, or changes that can be represented through capability negotiation.

## Trade-offs

URI versions are visible and cache-friendly but duplicate routes. Header negotiation keeps identifiers stable but is less discoverable. Every concurrent version increases testing and operational cost.

## Verification

Run consumer contract tests across supported versions, publish deprecation and sunset metadata, monitor usage, and exercise rollback before removing compatibility code.
