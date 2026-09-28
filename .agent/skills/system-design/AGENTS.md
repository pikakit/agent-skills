# System Design Agent Rules

> Generated from 6 source rules for system-design v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | process | [Architecture Context Discovery](references/AGENTS.full.md#rule-context-discovery) | Before suggesting any architecture, gather context. Never assume scale, team, or constraints. |
| high | process | [Architecture Decision Gate](references/AGENTS.full.md#rule-engineering-spec) | - Name the decision owner, stakeholders, scope, deadline, and review trigger. |
| standard | reference | [Architecture Examples](references/AGENTS.full.md#rule-examples) | Real-world architecture decisions by project type. Each with rationale and migration paths. |
| high | decision | [Architecture Pattern Selection](references/AGENTS.full.md#rule-pattern-selection) | Decision trees for choosing architectural patterns. Always ask: Is there a simpler solution? |
| standard | reference | [Architecture Patterns Reference](references/AGENTS.full.md#rule-patterns-reference) | Quick lookup for common patterns. Check When to Use vs When NOT to Use before adopting. |
| high | decision | [Trade-off Analysis and ADR](references/AGENTS.full.md#rule-trade-off-analysis) | Document every architectural decision with trade-offs. Future-you will thank present-you. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
