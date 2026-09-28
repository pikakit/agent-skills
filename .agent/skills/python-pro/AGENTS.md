# Python Pro Agent Rules

> Generated from 8 source rules for python-pro v4.0.0. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | reference | [Python Async and Cancellation Patterns](references/AGENTS.full.md#rule-async-patterns) | I/O-bound → async. CPU-bound → sync + multiprocessing. Never mix carelessly. |
| high | reference | [Django Service Patterns](references/AGENTS.full.md#rule-django-patterns) | Fat models, thin views. Use managers for queries. DRF for APIs. |
| high | decision | [Python Service Architecture Decision](references/AGENTS.full.md#rule-engineering-spec) | Choose Django for an integrated data-backed product, FastAPI for a typed ASGI API, and a smaller library or standard-library entry point for bounded utilities. Separate transport, domain, persistence, |
| high | reference | [FastAPI Service Patterns](references/AGENTS.full.md#rule-fastapi-patterns) | Dependency injection for testability. Pydantic at boundaries. Async by default. |
| high | reference | [Python Framework Selection](references/AGENTS.full.md#rule-framework-selection) | Pick the right tool. Don't default to one framework for everything. |
| standard | reference | [Python Project Structure](references/AGENTS.full.md#rule-project-structure) | Structure by size. Feature-based for large apps. Layer-based for small. |
| high | reference | [Python Testing Patterns](references/AGENTS.full.md#rule-testing-patterns) | pytest for everything. Fixtures for setup. Mock at boundaries. Test behavior, not implementation. |
| high | reference | [Python Type Contracts and Validation](references/AGENTS.full.md#rule-type-hints) | Type all public APIs. Use Pydantic at boundaries. No `Any` in public signatures. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
