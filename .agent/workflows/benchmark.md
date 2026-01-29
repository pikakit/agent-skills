---
description: Run k6/Artillery load tests with realistic scenarios. Measure throughput, latency, and error rates.
---

# Performance Benchmark Workflow

Run load tests to validate application can handle production scale.

## 🎯 Purpose

This workflow uses the **load-tester** skill to:

- Run realistic load tests (k6/Artillery)
- Measure performance under load
- Identify bottlenecks at scale
- Generate performance reports

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Pre-Test** | `recovery` | Save current performance baseline |
| **During Test** | `orchestrator` | Coordinate parallel load scenarios |
| **Post-Test** | `learner` | Learn bottleneck patterns |
| **Analysis** | `assessor` | Evaluate production-readiness risk |

```
Flow:
recovery.save(baseline) → orchestrator.run(load_test)
       ↓
results → learner.log(bottlenecks)
       ↓
assessor.evaluate(production_risk) → go/no-go
```

---

## 🔗 Chain: performance-audit (load-tester skill only)

**Skills Loaded (1):**

- `load-tester` - k6/Artillery load testing, performance benchmarking

## 📖 Usage

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

## 🔄 Workflow Steps

This workflow automatically:

1. **Generate Load Test Script**
   - Realistic user scenarios
   - Staged ramp-up (100 → 1K → 5K → 10K users)
   - Performance thresholds

2. **Run Load Test**
   - Execute k6/Artillery
   - Monitor metrics in real-time
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

## ✅ Success Criteria

After running `/benchmark`, you will have:

✓ **Load Test Completed** - At target scale
✓ **Metrics Captured** - Latency, errors, throughput
✓ **Bottlenecks Identified** - Database, memory, network
✓ **Report Generated** - HTML + JSON results

## 📊 Load Test Scenarios

### Spike Test

Rapid increase to validate burst handling

```
100 users → 10,000 users (1 minute)
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

## 🎨 Performance Metrics

| Metric          | Measured        | Target     |
| --------------- | --------------- | ---------- |
| **p95 Latency** | Response time   | <200ms     |
| **Error Rate**  | Failed requests | <1%        |
| **Throughput**  | Requests/sec    | 1,000+ rps |
| **Max Users**   | Concurrent      | 10,000+    |

## 🔍 Related Workflows

- `/optimize` - Auto-optimize before benchmarking
- `/monitor` - Setup monitoring for production
- `/launch` - Deploy after validation

## 💡 Tips

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

## 📚 Example Output

```bash
You: "/benchmark my-api 10K users"

Agent: Loading performance-audit chain (load-tester only)
       ↓

[1/1] 🧪 Running Load Test...

   Scenario: Ramp to 10,000 concurrent users
   Duration: 16 minutes
   Tool: k6

   ✅ Test complete!

📊 Results:

   Requests:
   ✅ Total: 1,245,000
   ✅ Success: 1,242,500 (99.8%)
   ❌ Failed: 2,500 (0.2%)

   Response Time:
   ✅ p50: 85ms
   ✅ p95: 180ms
   ⚠️ p99: 450ms
   ✅ Max: 1.2s

   Throughput:
   ✅ 4,150 requests/sec
   ✅ 15 GB data received

   Errors:
   ✅ Error rate: 0.2% (target: <1% ✓)
   ⚠️ Timeout errors: 1,500 (database)

🎯 Bottlenecks Detected:
   ❌ Database connections maxed (20/20)
   ⚠️ Memory usage: 90%
   ✅ CPU usage: 45%

💡 Recommendations:
   1. Increase DB pool: 20 → 50
   2. Add horizontal scaling (2 → 4 instances)
   3. Implement request queuing

✅ Benchmark complete!

   Report: performance-report.html
   Raw data: results.json
```

## 🚨 Common Bottlenecks

| Symptom              | Cause                     | Fix                  |
| -------------------- | ------------------------- | -------------------- |
| **Timeouts at load** | Connection pool exhausted | Increase pool size   |
| **Memory spikes**    | Memory leak               | Fix resource cleanup |
| **High latency**     | Slow queries              | Add indexes          |
| **500 errors**       | Resource limits           | Scale horizontally   |

---

**Version:** 1.0.0  
**Chain:** performance-audit (load-tester)  
**Added:** v3.5.0 (FAANG upgrade - Phase 2)
