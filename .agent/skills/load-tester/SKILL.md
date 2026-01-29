---
name: load-tester
description: >-
  k6/Artillery load test scripts, realistic user scenarios, performance benchmarking (throughput, latency, errors), scalability analysis.
  Triggers on: load test, k6, Artillery, performance test, stress test, scalability.
  Coordinates with: perf-optimizer, database-tuner, cache-optimizer.
allowed-tools: Read, Write, Glob, Bash
metadata:
  category: "devops"
  success_metrics: "10K+ concurrent users, p95 <200ms, error rate <1%"
  coordinates_with: "perf-optimizer, database-tuner, cache-optimizer"
---

# Load Testing

> Validate performance at scale with k6 or Artillery

## 🎯 Purpose

Run realistic load tests to validate application can handle production traffic (10K+ concurrent users) with acceptable latency and error rates.

---

## 1. Install k6

```bash
# macOS
brew install k6

# Windows
choco install k6

# Linux
sudo gpg -k
sudo gpg --no-default-keyring --keyring /usr/share/keyrings/k6-archive-keyring.gpg --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys C5AD17C747E3415A3642D57D77C6C491D6AC1D69
echo "deb [signed-by=/usr/share/keyrings/k6-archive-keyring.gpg] https://dl.k6.io/deb stable main" | sudo tee /etc/apt/sources.list.d/k6.list
sudo apt-get update
sudo apt-get install k6
```

---

## 2. Basic Load Test

```javascript
// tests/load/api-test.js
import http from "k6/http";
import { check, sleep } from "k6";
import { Rate } from "k6/metrics";

const errorRate = new Rate("errors");

export const options = {
  stages: [
    { duration: "2m", target: 100 }, // Ramp to 100 users
    { duration: "5m", target: 1000 }, // Stay at 1000
    { duration: "2m", target: 5000 }, // Spike to 5000
    { duration: "5m", target: 5000 }, // Sustain
    { duration: "2m", target: 0 }, // Ramp down
  ],
  thresholds: {
    http_req_duration: ["p(95)<200"], // 95% < 200ms
    errors: ["rate<0.01"], // < 1% errors
  },
};

export default function () {
  const res = http.get("https://api.example.com/users");

  check(res, {
    "status 200": (r) => r.status === 200,
    "response time OK": (r) => r.timings.duration < 200,
  }) || errorRate.add(1);

  sleep(1);
}
```

**Run:**

```bash
k6 run --out json=results.json tests/load/api-test.js
```

---

## 3. Realistic User Scenarios

```javascript
export default function () {
  // 1. Login
  let loginRes = http.post("https://api.example.com/auth/login", JSON.stringify({ email: `user-${__VU}@example.com`, password: "test123" }), { headers: { "Content-Type": "application/json" } });

  check(loginRes, { "login OK": (r) => r.status === 200 }) || errorRate.add(1);

  const token = loginRes.json("token");
  sleep(1);

  // 2. Browse products
  let productsRes = http.get("https://api.example.com/products", {
    headers: { Authorization: `Bearer ${token}` },
  });

  check(productsRes, { "products OK": (r) => r.status === 200 }) || errorRate.add(1);
  sleep(2);

  // 3. Add to cart
  let cartRes = http.post("https://api.example.com/cart", JSON.stringify({ productId: 123, quantity: 1 }), { headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" } });

  check(cartRes, { "cart OK": (r) => r.status === 200 }) || errorRate.add(1);
  sleep(1);
}
```

---

## 4. Load Test Patterns

### Spike Test

```javascript
export const options = {
  stages: [
    { duration: "10s", target: 100 },
    { duration: "1m", target: 10000 }, // Sudden spike!
    { duration: "3m", target: 10000 },
    { duration: "10s", target: 0 },
  ],
};
```

### Soak Test (Endurance)

```javascript
export const options = {
  stages: [
    { duration: "2m", target: 400 },
    { duration: "3h", target: 400 }, // Sustain 3 hours
    { duration: "2m", target: 0 },
  ],
};
```

### Stress Test (Find Breaking Point)

```javascript
export const options = {
  stages: [
    { duration: "2m", target: 100 },
    { duration: "5m", target: 200 },
    { duration: "2m", target: 300 },
    { duration: "5m", target: 400 }, // Incrementally increase until break
  ],
};
```

---

## 5. Interpreting Results

```
✅ PASS: p95 latency < 200ms
✅ PASS: Error rate < 1%
❌ FAIL: p99 latency > 500ms (database bottleneck)
```

**Sample Output:**

```
execution: local
   script: api-test.js
   output: json (results.json)

scenarios: (100.00%) 1 scenario, 5000 max VUs

checks.........................: 99.8% ✓ 1242500  ✗ 2500
data_received..................: 15 GB  25 MB/s
data_sent......................: 2.5 GB  4.2 MB/s
errors.........................: 0.2%   2500
http_req_blocked...............: avg=1.2ms    min=0s      med=0s      max=150ms   p(95)=5ms
http_req_duration..............: avg=85ms     min=10ms    med=75ms    max=1.2s    p(95)=180ms ✅
http_req_failed................: 0.2%   2500
http_reqs......................: 1245000 4150/s
iteration_duration.............: avg=2.5s     min=2s      med=2.4s    max=4s      p(95)=3s
iterations.....................: 1245000 4150/s
vus............................: 5000    max=5000
vus_max........................: 5000    min=5000
```

---

## 6. Performance Targets

| Metric               | Target    | Critical |
| -------------------- | --------- | -------- |
| **p95 latency**      | <200ms    | <500ms   |
| **Error rate**       | <0.5%     | <1%      |
| **Throughput**       | 1000+ rps | 500+ rps |
| **Concurrent users** | 10,000+   | 5,000+   |

---

## 7. Bottleneck Identification

### Common Bottlenecks

| Symptom                       | Likely Cause              | Fix                  |
| ----------------------------- | ------------------------- | -------------------- |
| **High latency at low load**  | Slow queries              | Add indexes          |
| **Latency spikes under load** | Connection pool exhausted | Increase pool size   |
| **Memory leaks**              | Unclosed connections      | Fix resource cleanup |
| **Timeout errors**            | Database locks            | Optimize queries     |
| **500 errors**                | Resource limits           | Scale horizontally   |

---

## 8. Cloud Load Testing

### k6 Cloud

```bash
k6 cloud tests/load/api-test.js
```

### Artillery

```bash
npm install -g artillery

# artillery.yml
config:
  target: "https://api.example.com"
  phases:
    - duration: 60
      arrivalRate: 5
      rampTo: 50
    - duration: 600
      arrivalRate: 50
  scenarios:
    - name: "User flow"
      flow:
        - post:
            url: "/auth/login"
            json:
              email: "test@example.com"
              password: "test123"
        - get:
            url: "/users/me"

# Run
artillery run artillery.yml
```

---

> **Key Takeaway:** Test under realistic load BEFORE going to production. A 5-minute load test can prevent hours of downtime.
