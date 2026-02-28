# Architecture Debate Process

> 8-phase process for technical decisions. YAGNI + KISS + DRY = holy trinity.

---

## Phase Overview

| Phase | Purpose | Output |
|-------|---------|--------|
| **1. Scout** | Understand project state | Project context |
| **2. Discovery** | Clarify requirements | Requirements list |
| **3. Research** | Gather information | Technical options |
| **4. Analysis** | Evaluate approaches | Pros/cons matrix |
| **5. Debate** | Challenge assumptions | Refined options |
| **6. Consensus** | Align on solution | Decision made |
| **7. Documentation** | Create summary | Decision report |
| **8. Finalize** | Handoff to planner | Implementation plan |

---

## Holy Trinity Principles

| Principle | Question | Apply When |
|-----------|----------|------------|
| **YAGNI** | Do we need this now? | Adding features |
| **KISS** | Is there a simpler way? | Choosing approach |
| **DRY** | Are we repeating ourselves? | Code structure |

---

## Analysis Template

```markdown
## Problem Statement
[Clear 1-2 sentence description]

## Constraints
- Budget: [time/resources]
- Scale: [users/data size]
- Integration: [existing systems]

## Options Evaluated

### Option A: [Name]
**Approach:** [Brief description]
| Pros | Cons |
|------|------|
| + Fast to implement | - Limited scalability |
| + Team familiar | - Vendor lock-in |

**YAGNI:** ✅ / ❌
**KISS:** ✅ / ❌
**DRY:** ✅ / ❌

### Option B: [Name]
...

## Recommendation
**Selected:** Option A
**Rationale:** [1-2 sentences]
**Trade-offs Accepted:** [what we're giving up]

## Next Steps
1. [Immediate action]
2. [Follow-up task]
```

---

## Debate Tactics

### Challenge Assumptions

```markdown
❓ "Why do we need [X]?"
❓ "What if we don't do [Y]?"
❓ "Is the complexity worth it?"
❓ "Who asked for this feature?"
```

### Brutally Honest Questions

| If They Say | Ask |
|-------------|-----|
| "We might need..." | "Do we need it NOW?" |
| "It would be nice..." | "Is it must-have or nice-to-have?" |
| "Everyone does it..." | "Does it solve OUR problem?" |
| "Future-proof..." | "YAGNI - real requirement or speculation?" |

---

## Example Prompts

- "Should we use microservices or modular monolith?"
- "Help me evaluate these 3 database options"
- "Is adding this feature worth the complexity?"
- "What's the best approach for real-time notifications?"

---

⚡ PikaKit v3.9.66
