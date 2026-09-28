# Knowledge Compiler Agent Rules

> Generated from 1 source rules for knowledge-compiler v3.9.224. Do not edit directly.

## Mandatory Rules

| Impact | Kind | Rule | Requirement |
|---|---|---|---|
| critical | process | [Secret Prefilter Gate](references/AGENTS.full.md#rule-secret-prefilter) | Run the repository secret scanner before writing raw signals, compiled concepts, patterns, indexes, or ADRs. Keep detection logic in the tested scanner rather than duplicating regex tables in document |

## Use

Apply every relevant rule. Open the linked full rule before implementation, review, or release decisions.
