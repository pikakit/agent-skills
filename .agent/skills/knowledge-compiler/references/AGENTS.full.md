# Knowledge Compiler Full Agent Rules

> Deterministic compilation of 1 source rules for knowledge-compiler v3.9.224. Do not edit directly.

## Rule Index

- [Secret Prefilter Gate](#rule-secret-prefilter) (critical, process, source: `rules/secret-prefilter.md`)

<a id="rule-secret-prefilter"></a>

## Secret Prefilter Gate

**Impact:** critical
**Kind:** process
**Source:** `rules/secret-prefilter.md`

# Secret Prefilter Gate

Run the repository secret scanner before writing raw signals, compiled concepts, patterns, indexes, or ADRs. Keep detection logic in the tested scanner rather than duplicating regex tables in documentation.

## Preconditions

- Identify every candidate file and the project root.
- Keep the original content in memory until scanning succeeds.
- Confirm the local TypeScript runner and scanner path without network installation.

## Procedure

1. Normalize content using the scanner's supported Unicode handling.
2. Scan the complete candidate content and path, including hidden project knowledge directories.
3. Collect every match, redact the sensitive value, and preserve only type and location in diagnostics.
4. Treat read, stat, parse, and scanner execution failures as errors.
5. Block the write on any match and request genuinely redacted source content.
6. Write only after a clean result, then scan the resulting project knowledge path again.

Do not add broad allowlists. Exempt only unmistakable placeholders already covered by scanner tests. Never print a discovered value, even in debug or JSON output.

## Rollback

If a post-write scan fails, restore the exact previous bytes or remove the newly created file, then rotate any credential that may have reached durable storage or logs.

## Exit Gate

Pass only when both candidate and persisted content scan cleanly and the scanner completed without I/O errors. Findings return validation failure; scanner or filesystem errors return an operational error.

Invoke through the repository's local validation command:

```bash
npm run validate:secrets
```
