---
title: Claude Skill Metadata Standardization
created: 2026-04-13
updated: 2026-04-13
tags: [yaml, frontmatter, skill-metadata, standardization, claude-skill-guide]
related: []
confidence: high
signal_count: 1
---

# Claude Skill Metadata Standardization

## Summary
The Claude Skill Guide enforces a strict schema for YAML frontmatter in `SKILL.md` files. Custom fields must not be placed at the top level and should instead be nested within the `metadata:` block to maintain compatibility with PikaKit and other tools parsing the skill definition.

## Key Insights
- **Valid Top-Level Fields:** Only `name`, `description`, `license`, `compatibility`, `allowed-tools`, and `metadata` are permitted.
- **Custom Mapping:** Project-specific fields like `category`, `triggers`, `coordinates_with`, and `success_metrics` must reside inside the `metadata:` map.
- Enforcing structural changes across many skills (e.g., 60+ files) should be done via automation scripts (`fix-frontmatter.mjs`) rather than manual edits to ensure consistency and prevent typos.

## Gotchas & Pitfalls
- **Legacy Knowledge:** Older skills often contain custom fields at the root of the YAML frontmatter. These will fail formal schema validation if not refactored.
  - **Solution:** Use an automated transformer script to parse the YAML, move non-standard fields to `metadata`, and write it back.

## Sources
- raw/SIG-003.md — YAML Frontmatter Non-Compliance Across 62 Skills
