---
name: knowledge-graph
description: This skill should be used when the user asks to trace symbol usage, map code dependencies, assess refactoring impact, or model repository relationships.
metadata:
  id: knowledge-graph
  schema_version: "2.0.0"
  type: knowledge
  category: architecture
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["find all usages of a symbol", "map repository dependencies", "assess refactoring impact", "build a code relationship graph"]
  negative_triggers: ["search for a literal string", "perform an automated refactor", "design a greenfield architecture"]
  coordinates_with: [code-review, system-design, typescript-expert]
  capabilities: ["semantic dependency analysis", "impact analysis", "graph modeling", "evidence-backed architecture mapping"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Knowledge Graph

Use language-aware indexes for symbol identity and text search for corroboration. Report uncertainty when dynamic dispatch, generated code, reflection, or incomplete indexing prevents a complete result.

## Workflow

1. Define the symbol, repository scope, revision, and relationship types.
2. Confirm language and build configuration.
3. Resolve definitions, aliases, imports, calls, inheritance, tests, and generated boundaries with available semantic tooling.
4. Build a directed graph with provenance for every edge.
5. Classify direct, transitive, runtime, and uncertain impact.
6. Verify representative edges with source inspection and relevant tests.

## Boundaries

Do not claim universal language support or complete runtime behavior from static analysis alone. Route architecture decisions to `system-design` and code changes to the implementation skill.

Read `rules/engineering-spec.md` for evidence and verification requirements.
