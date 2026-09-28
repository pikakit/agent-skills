# PikaKit Production Skill Rubric

This standard defines production-grade skill quality. It does not claim affiliation with any company.

## Descriptor Contract

- Keep the public `name`, directory, command, option, and routing identity stable.
- Put schema v2 fields under `metadata`; nested skills use `parent/child` as `metadata.id`.
- State positive and negative triggers as concrete user situations.
- Declare only capabilities backed by instructions, references, or executable code.
- Keep frontmatter at or below 1 KiB and each `SKILL.md` at or below 6 KiB.

## Rule Contract

- Give each rule one concern and keep it at or below 8 KiB.
- `code`: include `## Incorrect`, `## Correct`, and `## Verification`.
- `process`: include `## Preconditions`, `## Procedure`, `## Rollback`, and `## Exit Gate`.
- `decision`: include `## Decision`, `## Use When`, `## Avoid When`, `## Trade-offs`, and `## Verification`.
- `reference`: include `## Scope`, `## Guidance`, and `## Verification`.
- Cover relevant failure modes, security, observability, performance, accessibility, rollback, and verification without inventing APIs or guarantees.

## Evidence Policy

- Cite RFCs, OWASP, W3C, standards bodies, or official platform/vendor documentation over secondary material.
- Use `internal_ref` only for tracked ADRs or standards.
- Review critical material every 90 days, high-risk material every 180 days, and standard material every 365 days.

## Progressive Disclosure

- Keep routing and non-negotiable behavior in `SKILL.md`.
- Keep concern-specific guidance in `rules/` and supporting detail in `references/`.
- Keep reference chunks at or below 16 KiB.
- Generate a compact `AGENTS.md` manifest and full deterministic `references/AGENTS.full.md`.

## Release Gate

Schema, freshness, source policy, links, routing evaluation, compilation, tests, typecheck, data integrity, secret scan, and generated-artifact checks must pass without warnings.
