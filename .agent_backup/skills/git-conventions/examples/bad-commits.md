# Bad Commit Message Examples

## Anti-Pattern: Vague Messages

### ❌ Too Short
```
fix: bug
```
**Problem**: What bug? Where? Why?

**Should Be**:
```
fix(chart): correct Y-axis scaling for high volatility periods [doctrine: Law-4]

Chart Y-axis was clipping during 50%+ price swings.
Now dynamically adjusts with 10% padding.
```

---

### ❌ Generic Message
```
update: stuff
```
**Problem**: Meaningless. No type, no scope, no content.

**Should Be**:
```
feat(api): add rate limiting to coin endpoints [doctrine: Performance]
```

---

### ❌ WIP Commits
```
wip
```
**Problem**: Never ship WIP to main branch. Squash before merge.

---

## Anti-Pattern: Missing Critical Info

### ❌ No Scope for Critical Changes
```
feat: add caching
```
**Problem**: Caching where? API? Frontend? What layer?

**Should Be**:
```
feat(cache): implement Redis layer for coin metadata [doctrine: Performance]
```

---

### ❌ No Doctrine Tags
```
refactor: change chart data loading
```
**Problem**: Chart changes affect Laws 3 & 4. Tags required!

**Should Be**:
```
refactor(chart): load data from historical API [doctrine: Law-3, Law-4]

Separates realtime from historical data flow.
```

---

### ❌ Breaking Change Without Marking
```
feat(api): change price response format
```
**Problem**: This IS a breaking change but not marked!

**Should Be**:
```
feat(api)!: change price response format [doctrine: Commercial]

BREAKING CHANGE: Response now includes timestamp and source.

Before: { price: 50000 }
After: { currentPrice: 50000, timestamp: "...", source: "..." }
```

---

## Anti-Pattern: Wrong Format

### ❌ Past Tense
```
feat(api): added caching layer
```
**Problem**: Should be imperative mood - "add", not "added"

**Should Be**:
```
feat(api): add caching layer
```

---

### ❌ Capital First Letter
```
feat(api): Add caching layer
```
**Problem**: Description should be lowercase

**Should Be**:
```
feat(api): add caching layer
```

---

### ❌ Period at End
```
feat(api): add caching layer.
```
**Problem**: No trailing punctuation

**Should Be**:
```
feat(api): add caching layer
```

---

## Anti-Pattern: Multiple Changes

### ❌ Kitchen Sink Commit
```
feat: add chart, fix login, update deps
```
**Problem**: Three unrelated changes. Split into 3 commits!

**Should Be**:
```
# Commit 1
feat(chart): add sparkline component [doctrine: Law-4]

# Commit 2
fix(auth): correct session timeout handling

# Commit 3
chore(deps): upgrade react to 18.2
```

---

## Anti-Pattern: Constitutional Violations

### ❌ Describes Violation as Feature
```
feat(chart): inject realtime data to make charts more dynamic
```
**Problem**: This VIOLATES Law-3 and Law-4!

**What Actually Happened**:
- Developer didn't know the doctrine
- PR reviewer should have caught this
- Commit message reveals the violation

**Correct Approach**:
```
feat(ui): add separate LivePriceTicker component [doctrine: Law-3]

Shows realtime prices separately from historical charts.
Charts remain honest representations of past data.
```

---

### ❌ Frontend Managing Truth
```
feat(state): add Redux store for portfolio value calculation
```
**Problem**: Violates Law-1! Backend owns financial truth.

**Should Be**:
```
feat(api): add portfolio value endpoint [doctrine: Law-1]

Backend calculates portfolio value with authoritative prices.
Frontend only displays the result.
```

---

## Summary

| Anti-Pattern | Why It's Bad | Fix |
|--------------|--------------|-----|
| Vague | No traceability | Be specific |
| No scope | Can't identify affected area | Add scope |
| No doctrine | Constitutional violation risk | Add tags |
| Past tense | Violates Conventional Commits | Use imperative |
| Multiple changes | Hard to revert, review | Split commits |
| Describes violation | PR merger doesn't notice | Follow doctrines |
