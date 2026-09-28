---
name: knowledge-linter
description: This skill should be used when the user asks to audit project knowledge for stale claims, broken links, contradictions, or missing evidence.
metadata:
  id: knowledge-linter
  schema_version: "2.0.0"
  type: knowledge
  category: knowledge
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["lint the knowledge base", "find stale project knowledge", "check knowledge links", "audit knowledge evidence"]
  negative_triggers: ["compile new knowledge", "create a reusable skill", "lint source code"]
  coordinates_with: [knowledge-compiler, problem-checker]
  capabilities: ["staleness detection", "link integrity review", "contradiction reporting", "evidence coverage review"]
  platforms: [cross-platform]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Knowledge Linter

Audit durable project knowledge without silently rewriting it. Report evidence, severity, and a proposed remediation for each finding.

## Procedure

1. Inventory concepts, patterns, decisions, raw signals, and indexes.
2. Validate required metadata and relative links.
3. Flag a claim as stale from its declared review policy or superseding evidence, not from a universal age threshold.
4. Detect orphans, duplicate concepts, conflicting claims, and references to missing evidence.
5. Separate errors from advisory gaps and emit a machine-readable summary when requested.
6. Route accepted repairs to `knowledge-compiler` and rerun the audit.

## Exit Gate

Pass only when required metadata and links are valid and no unresolved contradiction invalidates a published claim. Never auto-delete knowledge or treat an empty/unreadable knowledge root as healthy.
