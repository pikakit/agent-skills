---
name: incident-response
description: >-
  Alert rules, notification channels (Slack, PagerDuty), runbooks, post-mortem templates.
  Triggers on: alerts, incident response, PagerDuty, runbooks, on-call.
  Coordinates with: logging, metrics, observability.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "Alert rules configured, notifications working, runbooks created"
  coordinates_with: "logging, metrics, observability"
---

# Incident Response

> Alerting, runbooks, and incident management

## 🎯 Purpose

Configure automated alerting for critical issues, route notifications to on-call engineers, and provide runbooks for rapid response.

---

## 1. Alert Rules

### Critical Alerts (P0)

```yaml
# alerts.yml
alerts:
  - name: HighErrorRate
    condition: "error_rate_5m > 1%"
    severity: critical
    description: "Error rate exceeded 1% in last 5 minutes"
    notify:
      - slack: "#oncall"
      - pagerduty: "production-alerts"
    runbook: "docs/runbooks/high-error-rate.md"

  - name: HealthCheckFailed
    condition: "health_check_success_rate < 100%"
    severity: critical
    description: "Health check failing"
    notify:
      - slack: "#oncall"
      - pagerduty: "production-alerts"
    runbook: "docs/runbooks/health-check-failure.md"

  - name: HighLatency
    condition: "p95_latency > 500ms"
    severity: high
    description: "p95 latency above 500ms"
    notify:
      - slack: "#engineering"
    runbook: "docs/runbooks/high-latency.md"
```

---

## 2. Slack Notifications

```typescript
// lib/alerts/slack.ts
import { WebClient } from "@slack/web-api";

const slack = new WebClient(process.env.SLACK_TOKEN);

export interface Alert {
  name: string;
  severity: "critical" | "high" | "medium";
  description: string;
  service: string;
  runbookUrl: string;
  dashboardUrl: string;
}

export async function sendAlert(alert: Alert) {
  const emoji = {
    critical: "🚨",
    high: "⚠️",
    medium: "ℹ️",
  };

  await slack.chat.postMessage({
    channel: "#oncall",
    text: `${emoji[alert.severity]} *${alert.severity.toUpperCase()}*: ${alert.name}`,
    blocks: [
      {
        type: "header",
        text: {
          type: "plain_text",
          text: `${emoji[alert.severity]} ${alert.name}`,
        },
      },
      {
        type: "section",
        text: {
          type: "mrkdwn",
          text: alert.description,
        },
      },
      {
        type: "section",
        fields: [
          {
            type: "mrkdwn",
            text: `*Severity*\n${alert.severity}`,
          },
          {
            type: "mrkdwn",
            text: `*Service*\n${alert.service}`,
          },
        ],
      },
      {
        type: "actions",
        elements: [
          {
            type: "button",
            text: { type: "plain_text", text: "View Runbook" },
            url: alert.runbookUrl,
            style: "primary",
          },
          {
            type: "button",
            text: { type: "plain_text", text: "View Dashboard" },
            url: alert.dashboardUrl,
          },
        ],
      },
    ],
  });
}
```

---

## 3. PagerDuty Integration

```typescript
// lib/alerts/pagerduty.ts
import fetch from "node-fetch";

export async function triggerIncident(alert: Alert) {
  await fetch("https://api.pagerduty.com/incidents", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Token token=${process.env.PAGERDUTY_API_KEY}`,
      From: process.env.PAGERDUTY_FROM_EMAIL,
    },
    body: JSON.stringify({
      incident: {
        type: "incident",
        title: alert.name,
        service: {
          id: process.env.PAGERDUTY_SERVICE_ID,
          type: "service_reference",
        },
        urgency: alert.severity === "critical" ? "high" : "low",
        body: {
          type: "incident_body",
          details: alert.description,
        },
        escalation_policy: {
          id: process.env.PAGERDUTY_ESCALATION_POLICY_ID,
          type: "escalation_policy_reference",
        },
      },
    }),
  });
}
```

---

## 4. Runbook Template

````markdown
# Runbook: High Error Rate

## Symptoms

- Error rate > 1% for 5+ minutes
- Users reporting 500 errors
- Slack alert in #oncall

## Investigation Steps

1. **Check recent deployments**
   ```bash
   git log --since="1 hour ago"
   ```
````

2. **Check error logs**
   - Datadog: `service:my-app status:error`
   - Look for error patterns

3. **Check external dependencies**
   - Database connection pool
   - Redis availability
   - External APIs (Stripe, SendGrid)

4. **Check resource usage**
   - CPU: `top` or Datadog dashboard
   - Memory: Check for memory leaks
   - Disk: `df -h`

## Common Causes

| Cause                      | Solution                             |
| -------------------------- | ------------------------------------ |
| Recent deployment with bug | Rollback to previous version         |
| Database timeout           | Scale database, optimize queries     |
| External API down          | Enable circuit breaker, use fallback |
| Memory leak                | Restart service, investigate leak    |

## Resolution

### If deployment issue:

```bash
# Rollback
kubectl rollout undo deployment/my-app

# Or via Vercel
vercel rollback
```

### If database issue:

```sql
-- Check slow queries
SELECT * FROM pg_stat_statements
ORDER BY mean_exec_time DESC LIMIT 10;

-- Check connections
SELECT count(*) FROM pg_stat_activity;
```

## Escalation

- **< 15 min**: Handled by on-call engineer
- **15-30 min**: Page engineering manager
- **> 30 min or > 50% users affected**: Page CTO

## Post-Resolution

1. Create post-mortem doc
2. Update runbook with new learnings
3. Schedule follow-up to prevent recurrence

````

---

## 5. Post-Mortem Template

```markdown
# Post-Mortem: [Incident Title]

**Date:** 2026-01-29
**Duration:** 45 minutes
**Impact:** 20% of users (500 requests failed)
**Severity:** High

## Timeline

| Time  | Event |
| ----- | ----- |
| 14:00 | Deployment v2.3.0 |
| 14:15 | Error rate spike detected |
| 14:20 | On-call engineer paged |
| 14:25 | Root cause identified (database connection leak) |
| 14:35 | Rollback initiated |
| 14:45 | Service restored |

## Root Cause

Database connection pool exhausted due to missing `.close()` in new payment handler.

## What Went Well

- Alerts fired within 5 minutes
- Runbook was accurate
- Rollback was quick

## What Went Wrong

- Code review missed the bug
- No unit test for connection cleanup
- Staging didn't catch it (lower load)

## Action Items

| Action | Owner | Due Date | Status |
| ------ | ----- | -------- | ------ |
| Add linter rule for unclosed connections | @eng | 2026-02-01 | ✅ Done |
| Add integration test for high load | @qa | 2026-02-05 | In Progress |
| Update deployment checklist | @devops | 2026-02-01 | ✅ Done |
````

---

## 6. Alert Thresholds

| Metric       | Warning | Critical |
| ------------ | ------- | -------- |
| Error rate   | > 0.5%  | > 1%     |
| p95 latency  | > 300ms | > 500ms  |
| CPU usage    | > 70%   | > 90%    |
| Memory usage | > 80%   | > 95%    |
| Disk usage   | > 80%   | > 90%    |

---

## 7. On-Call Rotation

### Best Practices

- **Rotation:** Weekly or bi-weekly
- **Handoff:** Document active issues
- **Response time:** < 15 min for critical
- **Compensation:** Time off or pay
- **Support:** 24/7 backup escalation

---

> **Key Takeaway:** Good runbooks turn midnight pages into 10-minute fixes. Keep them up to date with every incident.
