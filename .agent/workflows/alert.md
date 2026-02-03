---
description: Configure alert rules and test incident response. Slack/PagerDuty integration with runbook automation.
---

# /alert - Alert Configuration

$ARGUMENTS

---

## Purpose

This workflow configures:

- Custom alert rules for your application
- Notification channels (Slack, PagerDuty, email)
- Alert thresholds based on your SLAs
- Runbook templates
- Test alert delivery

## 🤖 Meta-Agents Integration

| Phase | Agent | Action |
| ----- | ----- | ------ |
| **Alert Analysis** | `learner` | Learn from past incident patterns |
| **Threshold Tuning** | `assessor` | Evaluate alert sensitivity vs noise |
| **Response Planning** | `orchestrator` | Coordinate multi-team response |

```
Flow:
configure alerts → learner.analyze(past_incidents)
       ↓
assessor.tune(thresholds) → reduce noise
       ↓
incident? → orchestrator.coordinate(runbook)
```

---

## 🔗 Chain: monitoring-production

**Primary Skill:** `observability`

**Coordinates with:** `observability`, `observability`, `observability`

## 📖 Usage

```bash
/alert <configuration>
```

### Examples

```bash
# Configure standard alerts
/alert configure for production

# High-traffic scenario
/alert configure for high-traffic (10K+ users)

# Custom thresholds
/alert configure with thresholds:
- Error rate: 0.5%
- Latency p95: 300ms
- CPU: 80%

# Test existing alerts
/alert test all notifications
```

## 📁„ Workflow Steps

This workflow automatically:

1. **Analyze Application**
   - Detect service type (API, web app, microservice)
   - Review current traffic patterns
   - Identify critical endpoints

2. **Configure Alert Rules**
   - Error rate alerts
   - Latency alerts
   - Infrastructure alerts (CPU, memory, disk)
   - Custom business metric alerts
   - Health check alerts

3. **Setup Notification Channels**
   - Slack webhook configuration
   - PagerDuty integration
   - Email notifications
   - SMS (via PagerDuty)

4. **Test Alert Delivery**
   - Send test alerts to Slack
   - Verify PagerDuty routing
   - Check escalation policies

5. **Generate Runbooks**
   - Create playbooks for each alert
   - Document investigation steps
   - Define escalation procedures

## 🎨 Alert Types

### Application Alerts (P0 - Critical)

```yaml
- High Error Rate (>1%)
- API Down (health check failed)
- Database Connection Failed
- Authentication Service Down
```

### Performance Alerts (P1 - High)

```yaml
- High Latency (p95 >500ms)
- Slow Database Queries (>1s)
- High Memory Usage (>90%)
- Cache Miss Rate High (>30%)
```

### Infrastructure Alerts (P2 - Medium)

```yaml
- CPU Usage High (>80%)
- Disk Usage High (>85%)
- High Network Latency
- SSL Certificate Expiring
```

## ✅ Success Criteria

After running `/alert`, you will have:

✓ **Alert Rules** - Configured in your monitoring platform
✓ **Slack Integration** - Test alert delivered successfully
✓ **PagerDuty Integration** - On-call routing configured
✓ **Runbooks** - Documentation for each alert type
✓ **Escalation Policy** - Clear escalation path defined
✓ **Alert Testing** - All channels verified working

## 📊 Recommended Thresholds

### By Service Type

**API Services:**

```yaml
error_rate: >0.5%
latency_p95: >200ms
latency_p99: >500ms
```

**Web Applications:**

```yaml
error_rate: >1%
latency_p95: >300ms
page_load_time: >3s
```

**Background Jobs:**

```yaml
queue_length: >1000
processing_time: >30
failure_rate: >5
```

### By Environment

| Environment | Error Threshold | Latency Threshold |
| ----------- | --------------- | ----------------- |
| Development | N/A (no alerts) | N/A               |
| Staging     | >5%             | >1000ms           |
| Production  | >0.5%           | >200ms            |

## 📁 Notification Routing

### Severity-Based Routing

| Severity          | Notify               | Escalate After |
| ----------------- | -------------------- | -------------- |
| **Critical (P0)** | Slack + PagerDuty    | 15 minutes     |
| **High (P1)**     | Slack only           | 30 minutes     |
| **Medium (P2)**   | Slack (low-priority) | Never          |

### Time-Based Routing

**Business Hours (9am-6pm):**

- All alerts → Slack engineering channel
- P0 alerts → Page on-call engineer

**Off Hours (6pm-9am, weekends):**

- P0 alerts → Page on-call engineer immediately
- P1 alerts → Slack only, review next day
- P2 alerts → Batched daily summary

## 💡 Tips

**Alert Fatigue Prevention:**

- Start with conservative thresholds, tighten gradually
- Use anomaly detection (not just static thresholds)
- Group related alerts (don't page for every instance)
- Auto-resolve when issue clears
- Weekly alert review and tuning

**Good Alert Properties:**

- **Actionable** - Clear what to do
- **Specific** - Not "something is wrong"
- **Timely** - Catch issues before users notice
- **Documented** - Runbook exists

**Bad Alerts (avoid):**

- Alerts that fire constantly (tune thresholds)
- Alerts with no runbook
- Alerts that auto-resolve in <1 min
- "Just FYI" alerts (use reports instead)

## 📚 Example Output

```bash
You: "/alert configure for high-traffic"

Agent: Analyzing application requirements...
       ↓

[1/4] 🎯 Alert Rules Configuration
   ✅ High Error Rate (>0.5%)
   ✅ Critical Latency (p95 >300ms)
   ✅ Database Timeouts
   ✅ Memory Usage (>85%)
   ✅ Health Check Failures
   ✅ Certificate Expiry (30 days)

   Created: alerts.yml (15 rules)

[2/4] 📢 Notification Channels
   ✅ Slack webhook: https://hooks.slack.com/...
   ✅ Channel: #oncall
   ✅ PagerDuty service: production-alerts
   ✅ Escalation: on-call → manager (15min)
   ✅ Email: oncall@example.com

[3/4] 🧪 Test Alerts
   ✅ Sent test alert to Slack ✓
   ✅ Verified webhook delivery
   ✅ PagerDuty integration working
   ✅ Escalation policy tested

[4/4] 📖 Runbooks Generated
   ✅ docs/runbooks/high-error-rate.md
   ✅ docs/runbooks/high-latency.md
   ✅ docs/runbooks/database-timeout.md
   ✅ docs/runbooks/memory-leak.md
   ✅ docs/runbooks/health-check-failure.md
   ✅ Post-mortem template

✅ Alerting configured!

📊 Alert Dashboard: https://app.datadoghq.com/monitors
📁” Slack channel: #oncall
📞 PagerDuty: https://example.pagerduty.com

Next steps:
1. Review alerts.yml and adjust thresholds
2. Add team members to PagerDuty rotation
3. Test alerts in staging first
4. Update runbooks with team-specific procedures
```

## 🚨 Alert Rule Examples

### High Error Rate

```yaml
name: HighErrorRate
condition: |
  (sum(rate(http_errors_total[5m])) / 
   sum(rate(http_requests_total[5m]))) > 0.005
severity: critical
description: Error rate exceeded 0.5% in last 5 minutes
notify:
  - slack: "#oncall"
  - pagerduty: "production-alerts"
runbook: docs/runbooks/high-error-rate.md
```

### High Latency

```yaml
name: HighLatency
condition: |
  histogram_quantile(0.95, 
    http_request_duration_ms_bucket) > 300
severity: high
description: p95 latency above 300ms
notify:
  - slack: "#engineering"
runbook: docs/runbooks/high-latency.md
```

### Database Connection Pool Exhausted

```yaml
name: DatabasePoolExhausted
condition: |
  db_connection_pool_active / 
  db_connection_pool_max > 0.9
severity: critical
description: Database connection pool at 90%+ capacity
notify:
  - slack: "#oncall"
  - pagerduty: "production-alerts"
runbook: docs/runbooks/database-pool.md
```

## Output Format

```markdown
## 🚨 Alert Configuration Complete

### Configuration Summary
| Aspect | Value |
|--------|-------|
| Alert Rules | [X] configured |
| Channels | Slack + PagerDuty |
| Runbooks | [X] generated |

### Next Steps
- [ ] Review alert thresholds
- [ ] Add team to PagerDuty rotation
- [ ] Test in staging first
```

---

## 🔗 Workflow Chain

```mermaid
graph LR
    A["/monitor"] --> B["/alert"]
    B --> C["/diagnose"]
    style B fill:#10b981
```

| After /alert | Run | Purpose |
|--------------|-----|---------|
| Need monitoring first | `/monitor` | Setup full stack |
| Alert fires | `/diagnose` | Investigate issue |
| Ready to ship | `/launch` | Deploy with alerts |

**Handoff:**
```markdown
✅ Alerting configured! Run `/launch` when ready to deploy.
```

---

**Version:** 1.0.0  
**Chain:** monitoring-production (observability skill)  
**Added:** v3.4.0 (FAANG upgrade)

