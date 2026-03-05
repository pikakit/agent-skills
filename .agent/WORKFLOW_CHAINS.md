# Workflow Chains Guide

> Pre-configured multi-skill sequences for complex development workflows

---

## 📚 Overview

**Workflow Chains** are pre-configured combinations of multiple skills that work together to accomplish complex tasks. They provide a higher-level abstraction than individual skills, enabling sophisticated workflows with a single command.

**Schema Version:** 2.0 (FAANG-compliant)

**What's New in v2.0:**

- ✅ **Error Handling**: Retry policies, fallback chains, fail-fast strategies
- ✅ **Dependency Management**: DAG execution, parallel processing, explicit dependencies
- ✅ **Success Criteria**: Required and optional metrics for validation
- ✅ **Versioning**: Semantic versioning, changelog tracking, deprecation support

**Total Chains:** 8 production-ready workflows  
**Total Skills:** 36 unique skills across all chains  
**Coverage:** Web development, security, debugging, deployment, API development, production monitoring, performance optimization, documentation

---

## 🔗 The 8 Workflow Chains

### 1️⃣ build-web-app

**Purpose:** Full-stack web application development

**Skills Loaded (7):**

```
app-scaffold       → Create project structure
project-planner    → Break down tasks
frontend-design    → Web UI patterns
design-system      → UI/UX patterns
tailwind-kit       → Styling utilities
test-architect     → Testing strategy
code-craft         → Code quality
```

**Triggered by:** `/build`, `/boost`, `/autopilot`

**Use When:**

- Creating a new web application
- Adding major features to existing app
- Need multi-agent collaboration

**Example:**

```
You: "/build a todo app with Next.js and Tailwind"

Agent: Loads build-web-app chain
       ↓
       Activates 7 skills in sequence
       ↓
       Creates: Project structure, components, tests, styles
```

**What You Get:**

- ✅ Complete project scaffold
- ✅ Design system applied
- ✅ Testing setup
- ✅ Best practices enforced

---

### 2️⃣ security-audit

**Purpose:** Comprehensive security review

**Skills Loaded (4):**

```
security-scanner   → Scan for vulnerabilities
code-review        → Code quality audit
offensive-sec      → Penetration testing perspective
cicd-pipeline      → Deployment security
```

**Triggered by:** `/inspect`

**Use When:**

- Pre-release security check
- Compliance audit (OWASP, etc.)
- After adding authentication/payment features

**Example:**

```
You: "/inspect for security vulnerabilities"

Agent: Loads security-audit chain
       ↓
       Runs: Vulnerability scan → Code review → Threat modeling
       ↓
       Reports: Issues by severity (Critical, High, Medium)
```

**What You Get:**

- ✅ Vulnerability report
- ✅ OWASP Top 10 check
- ✅ Secure code recommendations
- ✅ CI/CD security validation

---

### 3️⃣ debug-complex

**Purpose:** Deep debugging with systematic methodology

**Skills Loaded (4):**

```
debug-pro          → 4-phase debugging methodology
code-review        → Code quality analysis
knowledge-graph    → Impact analysis
test-architect     → Test-based verification
```

**Triggered by:** `/diagnose`

**Use When:**

- Bug is hard to reproduce
- Root cause is unclear
- Need evidence-based debugging

**Example:**

```
You: "/diagnose why login fails on iOS"

Agent: Loads debug-complex chain
       ↓
       Phase 1: Reproduce → Phase 2: Isolate → Phase 3: Analyze → Phase 4: Verify
       ↓
       Finds: iOS-specific cookie handling issue
```

**What You Get:**

- ✅ Root cause analysis
- ✅ Hypothesis-driven investigation
- ✅ Evidence log
- ✅ Fix verification

---

### 4️⃣ deploy-production

**Purpose:** Safe production deployment with checks

**Skills Loaded (4):**

```
cicd-pipeline      → Deployment workflow
security-scanner   → Pre-deploy security check
perf-optimizer     → Performance audit
e2e-automation     → End-to-end tests
```

**Triggered by:** `/launch`

**Use When:**

- Deploying to staging/production
- Need zero-downtime release
- Gradual rollout required

**Example:**

```
You: "/launch to production with gradual rollout"

Agent: Loads deploy-production chain
       ↓
       Security scan → Performance audit → E2E tests → Deploy with flags
       ↓
       Deploys: 10% users → Monitor → 50% → 100%
```

**What You Get:**

- ✅ Pre-deploy validation
- ✅ Performance benchmarks
- ✅ Health checks
- ✅ Rollback plan

---

### 5️⃣ api-development

**Purpose:** API design and implementation

**Skills Loaded (5):**

```
api-architect      → REST/GraphQL design
data-modeler       → Schema design
nodejs-pro         → Node.js best practices
test-architect     → API testing
security-scanner   → API security
```

**Triggered by:** `/api`

**Use When:**

- Building REST/GraphQL APIs
- Need schema design
- API testing automation

**Example:**

```
You: "Build API for user management with GraphQL"

Agent: Loads api-development chain
       ↓
       Schema design → Resolvers → Tests → Security
       ↓
       Creates: GraphQL API with auth, tests, docs
```

**What You Get:**

- ✅ API schema
- ✅ Resolvers/controllers
- ✅ API tests
- ✅ Security validation

---

### 6️⃣ monitoring-production

**Purpose:** Production monitoring and incident response

**Skills Loaded (3):**

```
observability      → OpenTelemetry SDK, logs, metrics, tracing, alerts
server-ops         → Server management
cicd-pipeline      → Deployment pipelines
```

**Triggered by:** `/monitor`, `/alert`

**Use When:**

- Setting up production monitoring
- Need observability stack
- Configuring alerts and on-call
- Post-deployment monitoring

**Example:**

```
You: "/monitor production app with Datadog"

Agent: Loads monitoring-production chain
       ↓
       OpenTelemetry → Logs → Metrics → Tracing → Alerts
       ↓
       Creates: Dashboard, alerts, runbooks
```

**What You Get:**

- ✅ OpenTelemetry SDK configured
- ✅ Structured logging (JSON, PII masked)
- ✅ Metrics dashboard (Golden Signals)
- ✅ Distributed tracing (APM)
- ✅ Alerts + Slack/PagerDuty integration
- ✅ Runbooks for incidents

---

### 7️⃣ performance-audit

**Purpose:** Performance profiling, optimization, and load testing

**Skills Loaded (3):**

```
perf-optimizer     → Performance profiling, Core Web Vitals
data-modeler       → Query optimization, indexes
caching-strategy   → Redis caching, CDN, HTTP headers
```

**Triggered by:** `/optimize`, `/benchmark`

**Use When:**

- API latency >500ms
- Preparing for production launch
- High database load
- Need to handle 10K+ users

**Example:**

```
You: "/optimize my-slow-api"

Agent: Loads performance-audit chain
       ↓
       Profile → Database → Cache → Load Test
       ↓
       Optimizes: 850ms → 180ms (79% faster)
```

**What You Get:**

- ✅ Bottlenecks identified (slow queries, N+1)
- ✅ Database optimized (indexes, connection pool)
- ✅ Caching implemented (Redis 85%+ hit rate)
- ✅ Load test passed (10K+ concurrent users)
- ✅ Performance report (p50, p95, p99 latency)

---

### 8️⃣ documentation

**Purpose:** Auto-generate comprehensive documentation

**Skills Loaded (3 - Parallel):**

```
doc-templates      → README, CONTRIBUTING, code comments
api-architect      → OpenAPI specs, endpoint docs
system-design      → C4 diagrams, architecture docs
```

**Triggered by:** `/chronicle`, `/diagram`

**Use When:**

- New project needs documentation
- Onboarding new developers
- API documentation required
- Architecture needs visualization

**Example:**

```
You: "/chronicle my-saas-app"

Agent: Loads documentation chain
       ↓
       README + API Docs + Diagrams (parallel)
       ↓
       Complete documentation suite
```

**What You Get:**

- ✅ README.md with quickstart guide
- ✅ CONTRIBUTING.md for developers
- ✅ API docs (Swagger UI + Postman)
- ✅ Architecture diagrams (C4, Mermaid)
- ✅ Code comments (JSDoc/TSDoc)

---

## 🎯 How to Use Workflow Chains

### Method 1: Slash Commands (Recommended)

**Easiest way** - Use slash commands that automatically trigger chains:

```bash
# Build web app
/build todo app with Next.js

# Security audit
/inspect for vulnerabilities

# Debug issue
/diagnose login failure

# Deploy
/launch to production
```

### Method 2: Natural Language

Mention trigger keywords in your request:

```bash
# Triggers build-web-app
"Help me build an e-commerce app"

# Triggers security-audit
"Run a security audit on my codebase"

# Triggers debug-complex
"Deep debug this React rendering issue"

# Triggers deploy-production
"I want to deploy to production safely"
```

### Method 3: Explicit Chain Request

Directly reference the chain:

```bash
"Use the api-development chain to build a payments API"
```

---

## 📊 Workflow Chains vs Skills

| Aspect      | Individual Skill  | Workflow Chain  |
| ----------- | ----------------- | --------------- |
| **Scope**   | Single domain     | Multi-domain    |
| **Skills**  | 1                 | 4-7             |
| **Example** | `react-architect` | `build-web-app` |
| **Use**     | Specific task     | Complex goal    |
| **Loading** | Manual            | Auto            |

**When to use individual skills:**

- Quick fix or refactor
- Single-domain work (e.g., just styling)

**When to use workflow chains:**

- Building features end-to-end
- Need multiple perspectives
- Complex workflows

---

## 🔍 Chain Execution Flow

```
User Request
     ↓
Detect trigger keyword or slash command
     ↓
Load workflow chain from registry.json
     ↓
Activate skills in sequence
     ↓
Execute with all skills' knowledge
     ↓
Deliver complete solution
```

**Example: Build Web App Flow**

```
/build dashboard app
     ↓
build-web-app chain
     ↓
1. app-scaffold    → Creates src/, components/, tests/
2. project-planner → Breaks down tasks (auth, charts, etc.)
3. frontend-design → Adds routing, state management
4. design-system   → Applies UI patterns
5. tailwind-kit    → Configures styling
6. test-architect  → Sets up Jest/Vitest
7. code-craft      → Enforces code quality
     ↓
Complete dashboard with all pieces
```

---

## 💡 Real-World Examples

### Example 1: E-commerce App

```bash
You: "/build e-commerce store with Next.js"

Chain: build-web-app

Skills activated:
1. app-scaffold    → Next.js 15 structure
2. project-planner → Product list, cart, checkout tasks
3. design-system   → E-commerce UI patterns
4. tailwind-kit    → Product cards, checkout styles
5. test-architect  → E2E checkout tests
6. code-craft      → TypeScript strict mode

Result:
✓ Next.js 15 app with App Router
✓ Product catalog pages
✓ Shopping cart functionality
✓ Checkout flow with tests
✓ Responsive design
```

### Example 2: Security Review

```bash
You: "/inspect codebase for security issues"

Chain: security-audit

Skills activated:
1. security-scanner → OWASP Top 10 scan
2. code-review      → SQL injection check
3. offensive-sec    → Auth bypass attempts
4. cicd-pipeline    → Secrets in code check

Result:
⚠ Found 3 issues:
  - CRITICAL: SQL injection in search
  - HIGH: Exposed API keys
  - MEDIUM: Missing CSRF protection
✓ Remediation steps provided
```

### Example 3: Production Deploy

```bash
You: "/launch API to production"

Chain: deploy-production

Skills activated:
1. security-scanner → Pre-deploy vuln scan
2. perf-optimizer   → Load time check
3. e2e-automation   → Critical path tests
4. feature-flags    → 10% → 50% → 100% rollout (manual)
5. cicd-pipeline    → Blue-green deployment

Result:
✓ Security: 0 critical issues
✓ Performance: 98ms avg response
✓ E2E: 45/45 tests passed
✓ Deployed: 10% canary → monitoring
```

---

## 🛠️ Customizing Chains

Workflow chains are defined in `.agent/skills/registry.json`:

```json
{
  "chains": {
    "chain-name": {
      "description": "What this chain does",
      "skills": ["skill1", "skill2", "skill3"],
      "trigger": "keyword phrase",
      "workflows": ["/slash-command"]
    }
  }
}
```

**To create a custom chain:**

1. Open `.agent/skills/registry.json`
2. Add new chain under `"chains"` section
3. Specify skills in desired order
4. Set trigger keywords
5. Associate with workflows (optional)

**Example custom chain:**

```json
"mobile-app-dev": {
  "description": "React Native app development",
  "skills": [
    "mobile-first",
    "react-architect",
    "test-architect",
    "perf-optimizer"
  ],
  "trigger": "build mobile app",
  "workflows": ["/build"]
}
```

---

## 📚 FAQ

**Q: Can I use multiple chains in one request?**
A: No, only one chain is activated per request. For complex work, break into multiple requests.

**Q: What if I only need some skills from a chain?**
A: Request individual skills explicitly: "Use react-architect skill to..."

**Q: Are chains executed in parallel or sequence?**
A: Skills within a chain are loaded together and their knowledge is combined. Execution depends on the task.

**Q: Can I see which chain was activated?**
A: Agent will typically announce: "Engaging build-web-app workflow" or similar.

**Q: How do I add a new chain?**
A: Edit `.agent/skills/registry.json` and add to the `chains` object.

---

## 🎓 Best Practices

### 1. **Use the Right Chain**

```bash
✅ Building feature: /build or build-web-app
✅ Security review: /inspect or security-audit
✅ Debugging: /diagnose or debug-complex
✅ Deploying: /launch or deploy-production
```

### 2. **Be Specific in Requests**

```bash
❌ "Build something"
✅ "Build a blog with Next.js and Tailwind"

❌ "Check security"
✅ "Security audit focusing on authentication"
```

### 3. **Combine with Context**

```bash
"Build API for user management (chain: api-development)
Requirements:
- GraphQL
- PostgreSQL
- JWT auth
- Rate limiting"
```

### 4. **Verify Chain Activation**

Look for agent confirmation:

```
🤖 Engaging build-web-app chain
→ 7 skills loaded: app-scaffold, project-planner...
```

---

## 📊 Chain Performance

| Chain                 | Avg Skills | Avg Time | Complexity |
| --------------------- | ---------- | -------- | ---------- |
| build-web-app         | 7          | 5-10 min | High       |
| security-audit        | 4          | 3-5 min  | Medium     |
| debug-complex         | 4          | 5-15 min | High       |
| deploy-production     | 5          | 5-10 min | High       |
| api-development       | 5          | 5-10 min | Medium     |
| monitoring-production | 5          | 3-5 min  | Medium     |
| performance-audit     | 4          | 5-8 min  | Medium     |
| documentation         | 3          | 2-3 min  | Low        |

---

## 🔗 Related Documentation

- [Workflows Guide](../workflows/README.md) - Slash commands
- [Skills Registry](../skills/registry.json) - All skills and chains
- [ARCHITECTURE.md](ARCHITECTURE.md) - System overview
- [GEMINI.md](GEMINI.md) - Agent protocols

---

**Version:** 2.0.0  
**Last Updated:** 2026-03-05  
**Maintained by:** PikaKit Team
