---
name: architecture-diagrammer
description: >-
  C4 diagrams (Context, Container, Component), Mermaid flowcharts, ER diagrams from Prisma, sequence diagrams.
  Triggers on: diagram, architecture, C4, Mermaid, flowchart.
  Coordinates with: doc-generator, diagram-kit.
allowed-tools: Read, Write, Glob
metadata:
  category: "documentation"
  success_metrics: "Diagrams generated, auto-updated from code"
  coordinates_with: "doc-generator, diagram-kit"
---

# Architecture Diagramming

> Auto-generate C4, sequence, and ER diagrams using Mermaid

## 🎯 Purpose

Generate and maintain architecture diagrams that auto-update from code changes using C4 model and Mermaid.js.

---

## 1. C4 Context Diagram

```mermaid
C4Context
    title System Context for My SaaS App

    Person(user, "User", "SaaS customer")
    System(app, "My SaaS App", "Web application")

    System_Ext(stripe, "Stripe", "Payments")
    System_Ext(auth, "Supabase", "Auth & DB")

    Rel(user, app, "Uses", "HTTPS")
    Rel(app, stripe, "Process payments", "API")
    Rel(app, auth, "Authenticate", "API")
```

---

## 2. C4 Container Diagram

```mermaid
C4Container
    title Container Diagram

    Person(user, "User")

    Container(web, "Web App", "Next.js", "UI")
    Container(api, "API", "tRPC", "Logic")
    ContainerDb(db, "Database", "PostgreSQL", "Data")
    Container(cache, "Cache", "Redis", "Sessions")

    Rel(user, web, "Uses", "HTTPS")
    Rel(web, api, "API calls", "tRPC")
    Rel(api, db, "Reads/writes", "Prisma")
    Rel(api, cache, "Caches", "ioredis")
```

---

## 3. Sequence Diagram

```mermaid
sequenceDiagram
    participant U as User
    participant W as Web
    participant A as API
    participant D as DB
    participant S as Stripe

    U->>W: Click "Subscribe"
    W->>A: POST /subscribe
    A->>D: Create customer
    D-->>A: Customer ID
    A->>S: Create subscription
    S-->>A: Subscription ID
    A->>D: Save subscription
    A-->>W: Success
    W-->>U: Confirmation
```

---

## 4. ER Diagram (from Prisma)

### Auto-generate from schema.prisma

```typescript
import { readFileSync } from "fs";

function generateERDiagram(prismaSchema: string) {
  // Parse schema
  const models = extractModels(prismaSchema);

  return `
erDiagram
    USER ||--o{ POST : writes
    USER ||--o{ COMMENT : writes
    POST ||--o{ COMMENT : has
    
    USER {
        string id PK
        string email UK
        string name
    }
    POST {
        string id PK
        string title
        string authorId FK
    }
  `;
}
```

---

## 5. Flowchart

```mermaid
flowchart TD
    A[User Login] --> B{Authenticated?}
    B -->|Yes| C[Dashboard]
    B -->|No| D[Login Page]
    D --> E[Enter Credentials]
    E --> F{Valid?}
    F -->|Yes| C
    F -->|No| D
```

---

## 6. Infrastructure Diagram

```mermaid
graph TB
    subgraph "Production"
        LB[Load Balancer]
        APP1[App Server 1]
        APP2[App Server 2]
        DB[(PostgreSQL)]
        CACHE[(Redis)]
    end

    LB --> APP1
    LB --> APP2
    APP1 --> DB
    APP2 --> DB
    APP1 --> CACHE
    APP2 --> CACHE
```

---

> **Key Takeaway:** Diagrams explain architecture faster than 1000 words. Keep them current with auto-generation.
