# Nodejs Pro Agent Rules

> Generated from 8 source rules for nodejs-pro v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | reference | [Node.js Service Boundaries](references/AGENTS.full.md#rule-architecture-patterns) | Layered separation is not bureaucracy — it's testability, swappability, and clarity. |
| high | reference | [Node.js Async and Cancellation Patterns](references/AGENTS.full.md#rule-async-patterns) | Node.js is async-first. **The event loop is everything.** Block it and your entire server stops. |
| high | decision | [Node.js Service Architecture Decision](references/AGENTS.full.md#rule-engineering-spec) | Use the smallest maintained framework that satisfies transport, plugin, lifecycle, and deployment requirements. Keep domain logic independent of HTTP objects. Validate at boundaries, propagate cancell |
| high | reference | [Node.js Error Handling](references/AGENTS.full.md#rule-error-handling) | Every error must be caught, classified, and communicated. **No silent failures.** |
| high | reference | [Node.js Framework Selection](references/AGENTS.full.md#rule-framework-selection) | Choose framework by deployment target and team context. **Never default to Express for new projects.** |
| high | reference | [Node.js Runtime and Modules](references/AGENTS.full.md#rule-runtime-modules) | Use ESM for new projects. Use `node:` prefixes. Match TypeScript execution to the supported Node release. |
| high | reference | [Node.js Testing Strategy](references/AGENTS.full.md#rule-testing-strategy) | Test the right things: critical paths, edge cases, error handling. **Don't test framework code.** |
| critical | reference | [Node.js Validation and Security](references/AGENTS.full.md#rule-validation-security) | Validate at boundary. Trust nothing. **Every input is hostile until proven otherwise.** |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
