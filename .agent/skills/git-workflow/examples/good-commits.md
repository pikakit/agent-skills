# Good Commit Message Examples

## Feature Commits

### API Feature
```
feat(api): add caching layer for coin price endpoints [doctrine: Performance]

Implements Redis caching with 5-minute TTL for /api/coins/[id]/price
to reduce external API load and improve response time.

- P95 latency: 800ms → 50ms
- External API calls reduced 80%

Backend owns truth (Law-1) verified - cache is read-through only.
```

### Chart Feature
```
feat(chart): implement proper separation of historical and realtime data [doctrine: Law-3, Law-4]

- Historical chart loads from /api/bitcoin/historical (immutable)
- Realtime price shown in separate ticker component
- Clear visual distinction for users

Charts now represent truthful historical data without realtime noise.
```

### Mobile Feature
```
feat(mobile): implement swipe navigation for portfolio tabs [doctrine: Frontend-Mobile]

Follows coinpika-swipe-tabs-doctrine:
- Native scroll precedence maintained
- No gesture conflicts
- Predictable 60fps animations

Ref: #234
```

## Fix Commits

### Backend Fix
```
fix(api): prevent historical data mutation in price updates [doctrine: Law-2]

Changed .push() to append-only insert to maintain immutability of
historical price records.

Before: priceHistory.push(newPrice) - mutates existing array
After: INSERT INTO price_history - append only

Fixes #456
```

### Chart Fix
```
fix(chart): remove realtime injection from BitcoinChart [doctrine: Law-3, Law-4]

Charts must represent historical truth, not realtime excitement.
Moved realtime price to separate LiveTicker component.

Before: Chart received WebSocket ticks directly
After: Chart loads from /api/historical, ticker shows live

Fixes #789
```

### Mobile Fix
```
fix(mobile): restore native scroll on coin list [doctrine: Frontend-Mobile]

Removed custom scroll implementation that blocked native gestures.
Users can now scroll naturally without conflicts.

Tested on: iOS 16, Android 13
```

## Refactor Commits

### Data Refactor
```
refactor(data): separate realtime buffer from historical storage [doctrine: Law-3]

Realtime WebSocket ticks now stored in Redis with 5-minute TTL.
Backend aggregates ticks to OHLCV candles before persisting to Postgres.

This enforces Law-3 (Realtime Ephemerality) and prevents contamination
of historical data with individual ticks.

Before: All ticks written directly to coinPrices table
After: Ticks → Redis → Aggregation → Postgres history

Related: #123
```

## Breaking Change Commits

### API Breaking Change
```
feat(api)!: change price endpoint response format [doctrine: Commercial]

BREAKING CHANGE: /api/coins/[id]/price now returns object instead of number

Before: { price: 50000 }
After: { currentPrice: 50000, timestamp: "...", source: "..." }

Rationale: Commercial Guardrails require timestamp and source tracking.

Migration:
1. Deploy v2 endpoint at /api/v2/coins/[id]/price
2. Update all client consumers
3. Deprecate v1 after 30 days
4. Remove v1 at day 60

Rollback plan: Revert to commit abc123, redeploy

Ref: COIN-1234
```

## Doctrine Commits

### Constitutional Enforcement
```
doctrine: add validation script for Law-3 compliance

Created scripts/validate_doctrine.js to automatically detect
realtime injection into charts.

- Pattern matching for WebSocket -> chart flows
- CI/CD integration ready
- JSON output for automation

Can be used in pre-commit hooks for enforcement.
```
