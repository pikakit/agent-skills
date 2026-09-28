---
title: Dynamic Question Generation and Socratic Inquiry
kind: reference
impact: standard
tags: [inquiry, discovery, decision-trees, trade-offs]
applies_to: [idea-storm]
last_reviewed: "2026-09-28"
sources:
  - title: W3C Architecture Principles
    url: https://www.w3.org/wiki/ArchitecturePrinciples
  - title: NIST SP 800-160 Systems Security Engineering
    url: https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/rev-1/final
---

# Dynamic Question Generation and Socratic Inquiry

## Scope

Applies to requirements discovery, ambiguity resolution, and decision-tree pruning across greenfield projects, feature additions, architectural refactors, and systems integration.

## Guidance

### 1. Core Principles

- **Questions Reveal Consequences:** Never ask generic preference questions. Connect every inquiry to concrete cost, complexity, performance, or security outcomes.
- **Context Precedes Content:** Classify the task context first (greenfield, feature addition, refactoring, or bug investigation) before formulating inquiries.
- **Minimum Viable Questions (MVQ):** Ask at most 1–3 focused questions per round. If a question does not eliminate at least one candidate implementation path, omit it.
- **Actionable Options:** Always provide distinct, structured alternatives explaining trade-offs rather than open-ended queries.

### 2. Inquiry Formulation Pattern

```markdown
❌ BAD: "What authentication do you want?"
✅ GOOD: "How should users authenticate?
   1. Email/Password (Recommended) → Simple, standard UX, requires reset flows and secure hashing.
   2. OAuth / Social Login → Fast onboarding, lower friction, delegates credential storage.
   3. Magic Links / Passwordless → High security, relies on email delivery latency."
```

### 3. Domain Question Banks

#### Authentication & Authorization
- **Session Model:** JWT stateless tokens (horizontal scaling, immediate revocation requires blocklist) vs server sessions (instant revocation, database state lookup).
- **RBAC vs ABAC:** Simple static role checks vs dynamic attribute-based permissions.

#### Data Storage & Persistence
- **Relational vs Document:** Strict relational schemas with migrations (PostgreSQL) vs schemaless document stores (MongoDB) for unstructured telemetry.
- **Caching Layer:** In-memory caching (Redis) vs edge KV cache vs direct database reads with query indexes.

#### Real-Time Communication
- **Transport Mechanism:** Server-Sent Events (unidirectional, HTTP/2 native) vs WebSockets (bidirectional, stateful connection management) vs long-polling.

### 4. Question Generation Algorithm

1. **Parse Intent:** Extract technical nouns, constraints, and implicit assumptions from user prompt.
2. **Detect Uncertainty:** Identify unspecified architectural forks (database, hosting, authentication, integration).
3. **Draft Alternatives:** Produce 2–4 mutually exclusive choices with quantified trade-offs.
4. **Prune Trivial Questions:** Delete questions answerable from existing codebase conventions.

## Verification

Validate that every question eliminates at least one architectural path, presents quantified trade-offs, adheres to the maximum 3-question limit, and avoids trivial aesthetic inquiries.
