# Studio Full Agent Rules

> Deterministic compilation of 1 source rules for studio v3.9.224. Do not edit directly.

## Rule Index

- [Studio data and recommendation release gate](#rule-engineering-spec) (high, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Studio data and recommendation release gate

**Impact:** high
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Studio Data and Recommendation Release Gate

## Preconditions

- Keep the 24-file data manifest, expected row counts, and all `CSV_CONFIG` columns explicit.
- Use `types.ts` as the shared public type source.
- Resolve data files from the Studio data root, independent of the caller's working directory.

## Procedure

1. Parse every CSV in strict mode and reject duplicate/empty headers, wrong column widths, missing configured columns, or row-count drift.
2. Throw `ERR_DATABASE_LOAD` with source context for read, parse, schema, and malformed reasoning JSON failures.
3. Validate query/domain/stack/result-limit inputs before search.
4. Cache only successful results through the singleton used by search, clear, and stats.
5. Keep search output fields and CLI option names stable.
6. Present accessibility guidance as a verification requirement, not as an automatic guarantee of the generated recommendation.

## Rollback

Do not serialize repaired or tolerant parser output at runtime. If a data migration fails validation, restore the last byte-valid CSV set and keep generated recommendations unpublished. If persistence fails, report the write failure and do not claim all requested files were created.

## Exit Gate

- Strictly parse all 24 CSV sources and verify the complete configured inventory.
- Load every domain and stack without fallback.
- Return representative results for chart, landing, icons, web interface, and repaired stack sources.
- Verify the Micro SaaS reasoning regression and malformed JSON failure context.
- Pass Studio tests and strict TypeScript without suppressions or double casts.
