---
name: studio
description: >-
  Searches validated design datasets and generates design-system recommendations. Use for palette, typography, chart, landing, icon, interface, or framework guidance. NOT for visual theory review or direct component implementation.
metadata:
  id: studio
  schema_version: "2.0.0"
  type: executable
  category: design
  risk_tier: high
  version: "3.9.224"
  author: pikakit
  triggers: [studio design search, design dataset query, studio palette recommendation]
  negative_triggers: [implement UI components, critique design theory]
  coordinates_with: [design-system, ai-artist, tailwind-kit]
  capabilities: [BM25 search, stack guidance, design recommendation]
  platforms: [node, windows, linux, macos]
  last_reviewed: 2026-09-28
  review_interval_days: 180
---

# Studio

Studio loads 24 strict CSV sources, ranks validated rows, and can compose a design-system recommendation. Data, schema, and configuration failures throw structured `StudioError` values; an empty result is valid only after a successful load.

## Workflow

1. Select a search domain or stack.
2. Validate the query and result limit.
3. Load the configured CSV with strict headers and row widths.
4. Rank matching rows and return the stable `SearchResult` shape.
5. For design-system generation, parse reasoning JSON with file/category context and combine product, style, color, typography, and landing results.

## CLI

```bash
npx tsx .agent/skills/studio/scripts/search.ts "fintech dashboard" --domain chart --json
npx tsx .agent/skills/studio/scripts/search.ts "SaaS" --stack nextjs
npx tsx .agent/skills/studio/scripts/search.ts "healthcare portal" --design-system --format markdown
```

Supported options remain `--domain`, `--stack`, `--max-results`, `--json`, `--design-system`, `--project-name`, `--format`, `--persist`, `--page`, and `--output-dir`.

## Boundaries

- Studio recommends; it does not claim that a palette passes contrast checks or that generated UI has been tested.
- Persistence writes only the requested design-system output directory.
- Cache clear/stats and search use one process-local singleton. Failed loads are never cached.

## Release Gate

Require strict validation of all 24 CSV files, representative searches across repaired domains/stacks, reasoning regression tests, structured CLI errors, and TypeScript strict mode.

## References

- [CLI](scripts/search.ts)
- [Data validation](scripts/validate_data.ts)
- [Executable contract](rules/engineering-spec.md)
