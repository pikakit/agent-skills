# Commit Message Best Practices

## CoinPika-Specific Guidelines

### 1. Always Include Context

For fintech applications, context is critical:

```
# ❌ Bad - No context
fix: update price

# ✅ Good - Clear context
fix(api): correct BTC price rounding to 2 decimals [doctrine: Law-1]

Fixes floating-point precision issue that caused 0.01% price drift.
Affects display only, not stored values.
```

### 2. Doctrine Tags Are Mandatory

When changing critical areas, ALWAYS include doctrine tags:

| Change Type | Required Tags |
|-------------|---------------|
| Price/balance logic | `[doctrine: Law-1]` |
| Historical data | `[doctrine: Law-2]` |
| Chart components | `[doctrine: Law-3, Law-4]` |
| Mobile gestures | `[doctrine: Frontend-Mobile]` |
| API endpoints | `[doctrine: Architecture]` |
| Caching | `[doctrine: Performance]` |

### 3. Breaking Changes

Breaking changes in fintech are HIGH RISK:

```
feat(api)!: change price response format [doctrine: Commercial]

BREAKING CHANGE: /api/coins/[id]/price now returns object

Before: { price: 50000 }
After: { currentPrice: 50000, timestamp: "...", source: "..." }

Migration:
1. Deploy v2 endpoint alongside v1
2. Update all consumers
3. Deprecate v1 after 30 days

Rollback: Revert to commit abc123
```

### 4. Document WHY, Not What

```
# ❌ Bad - Describes WHAT
refactor(chart): change data loading

# ✅ Good - Explains WHY
refactor(chart): separate realtime from historical data loading

Historical chart data was contaminated by WebSocket ticks,
causing visual artifacts during high-frequency trading.
Realtime price now displays in separate ticker component.

[doctrine: Law-3, Law-4]
```

## Anti-Patterns to Avoid

### ❌ Vague Messages
```
fix: bug
update: stuff
changes
wip
```

### ❌ Missing Scope for Critical Changes
```
feat: add caching  # Which caching? Where?
```

### ❌ Multiple Unrelated Changes
```
feat: add chart, fix login, update deps  # Split into 3 commits
```

### ❌ Past Tense
```
feat(api): added caching  # Should be "add caching"
```

### ❌ Period at End
```
feat(api): add caching.  # No period needed
```

## Quick Reference

### Commit Types
| Type | Description | Bump |
|------|-------------|------|
| feat | New feature | MINOR |
| fix | Bug fix | PATCH |
| perf | Performance | PATCH |
| refactor | Code restructure | - |
| docs | Documentation | - |
| style | Formatting | - |
| test | Tests | - |
| chore | Maintenance | - |
| doctrine | Constitutional | - |

### Commit Template
```
<type>(<scope>): <description> [doctrine: <tags>]

<body - explain WHY>

<footer - breaking changes, issue refs>
```
