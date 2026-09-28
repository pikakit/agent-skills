# Api Architect Agent Rules

> Generated from 11 source rules for api-architect v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| high | decision | [API Style Selection](references/AGENTS.full.md#rule-api-style) | Choose API style for THIS project's context — don't default to REST. |
| high | decision | [Authentication Patterns](references/AGENTS.full.md#rule-auth) | Choose auth pattern based on consumers and security requirements. |
| standard | reference | [API Documentation Principles](references/AGENTS.full.md#rule-documentation) | Good docs = happy developers = API adoption. |
| high | process | [API Contract Release Gate](references/AGENTS.full.md#rule-engineering-spec) | - Identify consumers, owners, data classification, trust boundaries, and compatibility policy. |
| high | decision | [GraphQL Principles](references/AGENTS.full.md#rule-graphql) | Flexible queries for complex, interconnected data. |
| high | decision | [Rate Limiting Principles](references/AGENTS.full.md#rule-rate-limiting) | Protect your API from abuse and overload. |
| high | decision | [Response Format Principles](references/AGENTS.full.md#rule-response) | One envelope pattern for ALL endpoints — consistency is key. |
| high | reference | [REST Principles](references/AGENTS.full.md#rule-rest) | Resource-based API design — nouns not verbs. |
| critical | process | [API Security Testing](references/AGENTS.full.md#rule-security-testing) | Principles for testing API security. OWASP API Top 10, authentication, authorization testing. |
| standard | decision | [tRPC Principles](references/AGENTS.full.md#rule-trpc) | End-to-end type safety for TypeScript monorepos — zero code generation. |
| high | decision | [Versioning Strategies](references/AGENTS.full.md#rule-versioning) | Plan for API evolution from day one. |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
