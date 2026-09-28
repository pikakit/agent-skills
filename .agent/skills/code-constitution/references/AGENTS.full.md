# Code Constitution Full Agent Rules

> Deterministic compilation of 1 source rules for code-constitution v3.9.224. Do not edit directly.

## Rule Index

- [Constitution Governance Gate](#rule-engineering-spec) (critical, process, source: `rules/engineering-spec.md`)

<a id="rule-engineering-spec"></a>

## Constitution Governance Gate

**Impact:** critical
**Kind:** process
**Source:** `rules/engineering-spec.md`

# Constitution Governance Gate

## Preconditions

- Identify change scope, risk tier, affected owners, and data classification.
- Document proposed invariants, blast radius, backward-compatibility impact, and rollback strategy.
- Confirm required approvals before proposing high-risk or architectural mutations.

## Procedure

1. Classify the change against constitutional doctrines and determine precedence.
2. Verify backwards compatibility, trust boundaries, and data invariant preservation.
3. Prohibit unauthorized destructive operations, unreviewed schema breaks, and hidden assumptions.
4. Require explicit checkpointing, test verification, and audit trail generation.
5. Execute the enforcement checklist and record evidence of compliance.

## Rollback

Restore the prior stable commit or state checkpoint immediately if an invariant is violated, authority is exceeded, or unreviewed breaking changes occur. Re-verify system consistency post-rollback.

## Exit Gate

Pass when all applicable constitutional rules pass, documentation and tests are verified, rollback is executable, and approval evidence is logged.
