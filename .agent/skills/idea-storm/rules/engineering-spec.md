---
title: Idea Storming and Requirements Discovery Gate
kind: process
impact: high
tags: [ideation, requirements, discovery, trade-offs, release-gate]
applies_to: [idea-storm]
last_reviewed: "2026-09-28"
sources:
  - title: W3C Design and Architecture Principles
    url: https://www.w3.org/wiki/ArchitecturePrinciples
  - title: NIST SP 800-160 Systems Security Engineering
    url: https://csrc.nist.gov/publications/detail/sp/800-160/vol-1/rev-1/final
---

# Idea Storming and Requirements Discovery Gate

## Preconditions

- Identify ambiguous product goals, missing constraints, or competing architectural options.
- Confirm user context, domain requirements, technical trade-offs, and risk boundaries.
- Formulate dynamic clarifying questions with concrete consequence assessments.

## Procedure

1. Challenge assumptions through structured debate contrasting YAGNI, KISS, and DRY principles.
2. Formulate 1-3 strategic multiple-choice questions to resolve fork decisions before implementation.
3. Compare at least three concrete architectural approaches with weighted trade-off matrices.
4. Document explicit non-goals to prevent scope creep and unnecessary infrastructure.
5. Handoff agreed specifications and decisions to planning and implementation agents.

## Rollback

Pause execution and re-enter discovery when new contradictory requirements emerge or user intent is fundamentally misaligned.

## Exit Gate

Pass when user intent is clarified, architectural alternatives are evaluated with stated trade-offs, and consensus plan is accepted.
