# Sample PR Review - Rejected

## PR Details
- **PR**: #156 - Make charts more dynamic with realtime data
- **Author**: developer@coinpika.com
- **Reviewer**: AI Agent (coinpika-pr-reviewer)
- **Date**: 2026-01-24

## Files Changed
- `components/charts/BitcoinChart.tsx` (modified)
- `hooks/useRealtimePrice.ts` (modified)

---

## CoinPika Doctrine Review

### Applicable Doctrines
- [x] CoinPika Master Constitution
- [x] Chart Data Doctrine (Law-3, Law-4)
- [x] Frontend Mobile Doctrine

### Constitutional Compliance

#### ✅ Laws Upheld
(None applicable - violations found)

#### ❌ Laws Violated

**Law 3 (Realtime Ephemerality)** - CRITICAL
- Realtime WebSocket data injected directly into chart
- Ephemeral data being treated as historical

**Law 4 (Chart Truthfulness)** - CRITICAL
- Charts no longer represent backend-aggregated truth
- Visual data contaminated with unvalidated ticks

### Violations Found

1. **🔴 ERROR** - Law-3 Violation: Realtime Injection
   - File: `components/charts/BitcoinChart.tsx:45`
   - Issue: WebSocket ticks pushed to historical chart data
   - Code: `chartData.push(realtimePrice)`
   - Fix: Remove realtime injection, display in separate ticker
   - Doctrine: `doctrines/data/coinpika-chart-data-doctrine.md`

2. **🔴 ERROR** - Law-4 Violation: Chart Truthfulness
   - File: `components/charts/BitcoinChart.tsx:67`
   - Issue: Chart displays mixed historical + realtime data
   - Code: `const data = [...historicalData, ...realtimeTicks]`
   - Fix: Chart must only consume pre-aggregated backend data
   - Doctrine: `constitution/coinpika-master-constitution.md:68-73`

3. **🟡 WARNING** - Historical Array Mutation
   - File: `components/charts/BitcoinChart.tsx:45`
   - Issue: Using `.push()` mutates historical array
   - Fix: Create new array reference for React re-render

### Approval Decision

🚫 **REJECTED** - Constitutional violations found

### Required Changes

1. **Remove realtime injection from chart**
   ```diff
   - chartData.push(realtimePrice)
   + // Chart only displays historical data
   ```

2. **Create separate LivePriceTicker component**
   ```tsx
   // New component for realtime display
   <LivePriceTicker price={realtimePrice} />
   ```

3. **Load chart data from historical API only**
   ```tsx
   const { data } = useSWR('/api/bitcoin/historical');
   // No mixing with realtime
   ```

### Systemic Risk

If merged, this change would:
- Corrupt historical chart integrity
- Create visual inconsistency during high volatility
- Violate user trust in chart accuracy
- Potentially cause regulatory issues (displaying unverified data as historical)

### References
- Constitution: Law 3, Law 4
- Doctrine: `doctrines/data/coinpika-chart-data-doctrine.md`
- Example: `examples/violation-chart-injection/`

---

**Reviewer**: coinpika-pr-reviewer v1.1.0
**Decision**: REJECTED
**Reason**: Constitutional violations (Law-3, Law-4)
