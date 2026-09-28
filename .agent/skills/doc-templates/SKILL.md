---
name: doc-templates
description: This skill should be used when the user asks to draft a README, document an API, record an architecture decision, create a changelog, or structure a Mermaid diagram.
metadata:
  id: doc-templates
  schema_version: "2.0.0"
  type: knowledge
  category: content
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["draft a README", "document an API", "record an architecture decision", "create a changelog", "structure a Mermaid diagram"]
  negative_triggers: ["write marketing copy", "design an API contract", "implement a documentation website"]
  coordinates_with: [project-planner, api-architect, system-design]
  capabilities: ["README structure", "API documentation", "ADR authoring", "changelog structure", "diagram documentation"]
  platforms: [markdown, OpenAPI, Mermaid]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Doc Templates

Create maintainable documentation from verified project facts and audience needs.

## Workflow

1. Identify the audience, task, source of truth, owner, lifecycle, and required format.
2. Inspect commands, APIs, configuration, and behavior before documenting them.
3. Choose the smallest applicable template from `rules/doc.md`; remove irrelevant sections rather than leaving placeholders.
4. Use stable headings, descriptive links, accessible diagrams, and copy-pasteable examples with explicit prerequisites.
5. Exclude secrets and redact private operational data.
6. Verify commands, relative links, code fences, diagram syntax, and consistency with the implementation.

## Boundaries

Use `api-architect` to design contracts and `system-design` to decide architecture. This skill documents accepted decisions; it does not manufacture them. Do not advertise preview, editor, or rendering capabilities unless the repository contains and validates the corresponding executable.

Read `rules/doc.md` for focused templates and `rules/production-gates.md` for the publication gate.
