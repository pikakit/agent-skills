# Knowledge Graph Full Agent Rules

> Deterministic compilation of 1 source rules for knowledge-graph v3.9.224. Do not edit directly.

## Rule Index

- [Semantic Impact Analysis Gate](#rule-engineering-spec) (standard, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Semantic Impact Analysis Gate

**Impact:** standard
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Semantic Impact Analysis Gate

## Preconditions

- Fix the repository revision, language, build configuration, and analysis scope.
- Identify the symbol by semantic identity, not name alone.
- Confirm generated sources, vendored code, and excluded paths.

## Procedure

1. Load the language-aware index or build graph and report incomplete projects.
2. Resolve definitions, aliases, imports, re-exports, calls, inheritance, and test references.
3. Store each edge with source location, relationship type, and analysis method.
4. Classify direct, transitive, runtime-only, generated, and uncertain impact.
5. Corroborate representative edges with source inspection and targeted text search.
6. Select tests and owners from affected graph regions.

Static analysis cannot prove dynamic dispatch, reflection, configuration lookup, generated behavior, or runtime data flow. Mark these gaps explicitly.

## Rollback

Analysis is read-only. Discard the graph and rebuild from the pinned revision when configuration, generated sources, or the repository revision changes during analysis.

## Exit Gate

Pass when every reported edge has provenance, index errors are surfaced, uncertainty is quantified qualitatively, and representative affected tests or runtime checks confirm the graph.
