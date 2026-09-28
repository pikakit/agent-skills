---
name: copywriting
description: This skill should be used when the user asks to write conversion copy, revise a landing-page message, create an email campaign, or evaluate a call to action.
metadata:
  id: copywriting
  schema_version: "2.0.0"
  type: knowledge
  category: content
  risk_tier: standard
  version: "3.9.224"
  author: pikakit
  triggers: ["write conversion copy", "revise a landing-page message", "create an email campaign", "evaluate a call to action"]
  negative_triggers: ["write technical documentation", "perform keyword research", "draft legal or medical claims"]
  coordinates_with: [seo-optimizer, studio, ai-artist]
  capabilities: ["message hierarchy", "conversion copy drafting", "claim review", "call-to-action design"]
  platforms: [web, email, advertising]
  last_reviewed: "2026-09-28"
  review_interval_days: 365
---

# Copywriting

Write accurate, audience-specific copy that makes the offer and next action clear.

## Workflow

1. Establish audience, job to be done, awareness level, offer, proof, channel, voice, constraints, and one primary action.
2. Build a message hierarchy: outcome, differentiator, evidence, objections, risk reversal, and action.
3. Select a structure such as problem-solution or attention-interest-action only when it fits the journey.
4. Draft specific language in the audience's vocabulary; keep claims within supplied evidence.
5. Review accessibility, consent, privacy, platform policy, and regulated-claim risks.
6. Test meaningful variants against a defined metric and guardrail; do not infer causality from uncontrolled results.

## Quality Gate

- Make the product, audience, outcome, evidence, and action identifiable.
- Remove fabricated testimonials, urgency, scarcity, rankings, and performance guarantees.
- Keep headings descriptive, links understandable out of context, and form instructions explicit.
- Separate marketing optimization from factual approval by the accountable owner.

Read `rules/production-gates.md` for review and release criteria. Route search discoverability to `seo-optimizer` and visual production to `studio` or `ai-artist`.
