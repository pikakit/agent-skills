# Idea Storm Full Agent Rules

> Deterministic compilation of 3 source rules for idea-storm v3.9.224. Do not edit directly.

## Rule Index

- [Architecture Debate Process](#rule-architecture-debate) (standard, process, source: `rules/architecture-debate.md`)
- [Dynamic Question Generation and Socratic Inquiry](#rule-dynamic-questioning) (standard, reference, source: `rules/dynamic-questioning.md`)
- [Idea Storming and Requirements Discovery Gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-architecture-debate"></a>

## Architecture Debate Process

**Impact:** standard
**Kind:** process
**Source:** `rules/architecture-debate.md`

# Architecture Debate Process

## Preconditions

- Capture a clear 1-2 sentence problem statement.
- Identify known constraints: timeline, scale, infrastructure, team expertise, and budget.
- Identify at least two viable architectural alternatives before debate begins.

## Procedure

1. **Scout & Discovery:** Understand existing system state and clarify explicit requirements vs assumptions.
2. **Research & Analysis:** Evaluate technical options against YAGNI (Do we need this now?), KISS (Is there a simpler way?), and DRY (Are we repeating ourselves?).
3. **Structured Debate:** Challenge assumptions aggressively. Probe edge cases, operational overhead, failure modes, and long-term maintenance costs.
4. **Pros/Cons Matrix:** Compare candidates using weighted criteria including complexity, velocity, and lock-in.
5. **Consensus & Handoff:** Align on the recommended solution, document accepted trade-offs, and generate actionable next steps.

### Analysis Template

```markdown
## Problem Statement
[Clear 1-2 sentence description]

## Constraints
- Scale: [requests/sec, data size]
- Integration: [existing systems]

## Options Evaluated

### Option A: [Name]
| Pros | Cons |
|------|------|
| + Fast to implement | - Limited scalability |

**YAGNI:** ✅ / ❌ | **KISS:** ✅ / ❌ | **DRY:** ✅ / ❌

## Recommendation
**Selected:** Option A
**Trade-offs Accepted:** [documented concessions]
```

## Rollback

Revert to requirements gathering and reframe the problem statement if debate uncovers conflicting assumptions, insoluble trade-offs, or invalid constraints.

## Exit Gate

Pass when consensus is reached on an architecture candidate, accepted trade-offs are explicitly recorded, non-goals are defined, and the decision report is handed off to planning.

<a id="rule-dynamic-questioning"></a>

## Dynamic Question Generation and Socratic Inquiry

**Impact:** standard
**Kind:** reference
**Source:** `rules/dynamic-questioning.md`

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

<a id="rule-engineering-spec"></a>

## Idea Storming and Requirements Discovery Gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Idea Storming and Requirements Discovery Gate

## Preconditions

- Identify ambiguous product goals, missing constraints, or competing architectural options.
- Confirm user context, domain requirements, technical trade-offs, and risk boundaries.
- Formulate dynamic clarifying questions with concrete consequence assessments.

## Procedure

1. Challenge assumptions through structured debate contrasting YAGNI, KISS, and DRY principles.
2. Formulate 1-3 strategic multiple-choice questions to resolve fork decisions before implementation.
3. Compare at least three concrete architectural approaches with weighted trade-off matrices.
4. Document explicit non-goals to prevent scope creep and unnecessary infrastructure.
5. Handoff agreed specifications and decisions to planning and implementation agents.

## Rollback

Pause execution and re-enter discovery when new contradictory requirements emerge or user intent is fundamentally misaligned.

## Exit Gate

Pass when user intent is clarified, architectural alternatives are evaluated with stated trade-offs, and consensus plan is accepted.
