---
description: Run k6/Artillery load tests with realistic scenarios. Measure throughput, latency, and error rates.
---

# Performance Benchmark Workflow

Run load tests to validate application can handle production scale.

## ðŸŽ¯ Purpose

This workflow uses the **perf-optimizer** skill to:

- Run realistic load tests (k6/Artillery)
- Measure performance under load
- Identify bottlenecks at scale
- Generate performance reports

## ðŸ¤– Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Test** | `recovery` | Save current performance baseline |
| **During Test** | `orchestrator` | Coordinate parallel load scenarios |
| **Post-Test** | `learner` | Learn bottleneck patterns |
| **Analysis** | `assessor` | Evaluate production-readiness risk |

```
Flow:
recovery.save(baseline) â†’ orchestrator.run(load_test)
       â†“
results â†’ learner.log(bottlenecks)
       â†“
assessor.evaluate(production_risk) â†’ go/no-go
```

---

## ðŸ”— Chain: performance-audit (perf-optimizer skill only)

**Skills Loaded (1):**

- `perf-optimizer` - k6/Artillery load testing, performance benchmarking

## ðŸ“– Usage

```bash
/benchmark <description>
```

### Examples

```bash
# Basic benchmark
/benchmark my-api

# With specific target
/benchmark 10,000 concurrent users

# Production validation
/benchmark production checkout flow
```

## ðŸ”„ Workflow Steps

This workflow automatically:

1. **Generate Load Test Script**
   - Realistic user scenarios
   - Staged ramp-up (100 â†’ 1K â†’ 5K â†’ 10K users)
   - Performance thresholds

2. **Run Load Test**
   - Execute k6/Artillery
   - Monitor observability in real-time
   - Capture bottlenecks

3. **Analyze Results**
   - p50, p95, p99 latency
   - Error rate
   - Throughput (requests/sec)
   - Resource usage

4. **Generate Report**
   - Performance summary
   - Bottleneck identification
   - Recommendations

## âœ… Success Criteria

After running `/benchmark`, you will have:

âœ“ **Load Test Completed** - At target scale
âœ“ **observability Captured** - Latency, errors, throughput
âœ“ **Bottlenecks Identified** - Database, memory, network
âœ“ **Report Generated** - HTML + JSON results

## ðŸ“Š Load Test Scenarios

### Spike Test

Rapid increase to validate burst handling

```
100 users â†’ 10,000 users (1 minute)
```

### Soak Test

Sustained load to detect memory leaks

```
1,000 users (3 hours)
```

### Stress Test

Find breaking point

```
Incrementally increase until failure
```

## ðŸŽ¨ Performance observability

| Metric          | Measured        | Target     |
| --------------- | --------------- | ---------- |
| **p95 Latency** | Response time   | <200ms     |
| **Error Rate**  | Failed requests | <1%        |
| **Throughput**  | Requests/sec    | 1,000+ rps |
| **Max Users**   | Concurrent      | 10,000+    |

## ðŸ” Related Workflows

- `/optimize` - Auto-optimize before benchmarking
- `/monitor` - Setup monitoring for production
- `/launch` - Deploy after validation

## ðŸ’¡ Tips

**When to use `/benchmark`:**

- Before going to production
- After optimizations (validate improvements)
- Regular performance regression testing
- Capacity planning

**Best practices:**

- Test realistic user scenarios
- Gradually ramp up load
- Monitor infrastructure during test
- Run multiple times for consistency

## ðŸ“š Example Output

```bash
You: "/benchmark my-api 10K users"

Agent: Loading performance-audit chain (perf-optimizer only)
       â†“

[1/1] ðŸ§ª Running Load Test...

   Scenario: Ramp to 10,000 concurrent users
   Duration: 16 minutes
   Tool: k6

   âœ… Test complete!

ðŸ“Š Results:

   Requests:
   âœ… Total: 1,245,000
   âœ… Success: 1,242,500 (99.8%)
   âŒ Failed: 2,500 (0.2%)

   Response Time:
   âœ… p50: 85ms
   âœ… p95: 180ms
   âš ï¸ p99: 450ms
   âœ… Max: 1.2s

   Throughput:
   âœ… 4,150 requests/sec
   âœ… 15 GB data received

   Errors:
   âœ… Error rate: 0.2% (target: <1% âœ“)
   âš ï¸ Timeout errors: 1,500 (database)

ðŸŽ¯ Bottlenecks Detected:
   âŒ Database connections maxed (20/20)
   âš ï¸ Memory usage: 90%
   âœ… CPU usage: 45%

ðŸ’¡ Recommendations:
   1. Increase DB pool: 20 â†’ 50
   2. Add horizontal scaling (2 â†’ 4 instances)
   3. Implement request queuing

âœ… Benchmark complete!

   Report: performance-report.html
   Raw data: results.json
```

## ðŸš¨ Common Bottlenecks

| Symptom              | Cause                     | Fix                  |
| -------------------- | ------------------------- | -------------------- |
| **Timeouts at load** | Connection pool exhausted | Increase pool size   |
| **Memory spikes**    | Memory leak               | Fix resource cleanup |
| **High latency**     | Slow queries              | Add indexes          |
| **500 errors**       | Resource limits           | Scale horizontally   |

---

**Version:** 1.0.0  
**Chain:** performance-audit (perf-optimizer)  
**Added:** v3.5.0 (FAANG upgrade - Phase 2)

