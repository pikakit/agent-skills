# Workflow Chains - HÆ°á»›ng Dáº«n Sá»­ Dá»¥ng

> 5 workflow chains vá»›i execution modes khÃ¡c nhau cho tá»«ng use case

---

## ðŸ“š Workflow Chains LÃ  GÃ¬?

**Workflow Chain** = Chuá»—i skills Ä‘Æ°á»£c cáº¥u hÃ¬nh sáºµn Ä‘á»ƒ giáº£i quyáº¿t cÃ¡c tÃ¡c vá»¥ phá»©c táº¡p.

**Analogy:** Giá»‘ng nhÆ° "combo" trong game - 1 command kÃ­ch hoáº¡t cáº£ chuá»—i hÃ nh Ä‘á»™ng.

**VÃ­ dá»¥:**

```bash
/build todo app
```

â†’ Tá»± Ä‘á»™ng cháº¡y 7 skills: `app-scaffold` â†’ `project-planner` â†’ `web-core` â†’ `design-system` â†’ `tailwind-kit` â†’ `test-architect` â†’ `code-craft`

---

## ðŸŽ¯ 5 Workflow Chains

| Chain                 | Workflows                        | Skills | Má»¥c ÄÃ­ch                     |
| --------------------- | -------------------------------- | ------ | ---------------------------- |
| **build-web-app**     | `/build`, `/boost`, `/autopilot` | 7      | Full-stack web development   |
| **security-audit**    | `/inspect`                       | 4      | Security review & pentesting |
| **debug-complex**     | `/diagnose`                      | 4      | Systematic debugging         |
| **deploy-production** | `/launch`                        | 5      | Production deployment        |
| **api-development**   | `/api`                           | 5      | API design & implementation  |

---

## ðŸ¤– Meta-Agents (Runtime Control)

All 22 workflows are integrated with **5 meta-agents** for enhanced autonomy:

| Agent | Role | When Invoked |
|-------|------|--------------|
| `orchestrator` | Runtime Control | Parallel execution, retry logic, health monitoring |
| `assessor` | Risk Analysis | Before risky operations, evaluate impact |
| `recovery` | State Safety | Save/restore state, auto-rollback on failure |
| `critic` | Conflict Resolution | Arbitrate agent disagreements (QA vs Speed) |
| `learner` | Continuous Learning | Extract lessons from failures, log patterns |

### Integration Example

```
/launch workflow:
orchestrator.init() â†’ assessor.evaluate(deployment_risk)
       â†“
recovery.save(current_state) â†’ deploy
       â†“
health_check_failed? â†’ recovery.restore()
       â†“
success â†’ learner.log(deployment_patterns)
```

### Meta-Agent Coverage (22/22 Workflows)

All workflows now include `## ðŸ¤– Meta-Agents Integration` section with:
- Phase-based agent invocation table
- Flow diagram showing agent coordination
- Rollback and learning hooks

## 1ï¸âƒ£ build-web-app Chain

> **Má»¥c Ä‘Ã­ch:** XÃ¢y dá»±ng hoáº·c nÃ¢ng cáº¥p á»©ng dá»¥ng web full-stack

### ðŸ”§ Skills (7)

```mermaid
graph LR
    A[app-scaffold] --> B[project-planner]
    B --> C[web-core]
    C --> D[design-system]
    D --> E[tailwind-kit]
    C --> F[test-architect]
    F --> G[code-craft]
```

**Skill Sequence:**

1. `app-scaffold` - Táº¡o cáº¥u trÃºc project
2. `project-planner` - Plan architecture
3. `web-core` - Implement core logic
4. `design-system` - Setup design system
5. `tailwind-kit` - Configure Tailwind (optional)
6. `test-architect` - Setup testing
7. `code-craft` - Validate code quality

---

### ðŸš€ 3 Workflows (Execution Modes)

#### `/build` - Interactive Build (Cho NgÆ°á»i Má»›i)

**Äáº·c Ä‘iá»ƒm:**

- âœ… User control 100%
- âœ… Agent há»i 10-15 cÃ¢u
- âœ… Step-by-step, giáº£i thÃ­ch tá»«ng bÆ°á»›c
- â±ï¸ 10-15 phÃºt

**Khi nÃ o dÃ¹ng:**

- Láº§n Ä‘áº§u build app
- Muá»‘n há»c cÃ¡ch agent lÃ m viá»‡c
- Cáº§n customize chi tiáº¿t

**Example:**

```bash
/build blog app with authentication

Agent:
â“ Framework?
   1. Next.js 15
   2. Vite + React
   3. Remix
â†’ Báº¡n chá»n: 1

â“ Database?
   1. PostgreSQL + Prisma
   2. MongoDB
   3. Supabase
â†’ Báº¡n chá»n: 3

â“ Styling?
   1. Tailwind CSS
   2. Styled Components
â†’ Báº¡n chá»n: 1

... (10 more questions)

âœ… Created: blog-app/
   â”œâ”€â”€ app/ (Next.js 15)
   â”œâ”€â”€ components/
   â”œâ”€â”€ lib/supabase/
   â””â”€â”€ tests/
```

**Output:**

- Next.js 15 vá»›i App Router
- Supabase auth + database
- Tailwind CSS styling
- TypeScript setup
- Basic tests

---

#### `/boost` - Enhancement Mode (Cho Project CÃ³ Sáºµn)

**Äáº·c Ä‘iá»ƒm:**

- âœ… Context-aware (Ä‘á»c code hiá»‡n táº¡i)
- âœ… Agent há»i 2-3 cÃ¢u xÃ¡c nháº­n
- âœ… KhÃ´ng phÃ¡ code cÅ©
- â±ï¸ 5-7 phÃºt

**Khi nÃ o dÃ¹ng:**

- ÄÃ£ cÃ³ project
- ThÃªm features má»›i
- NÃ¢ng cáº¥p existing code

**Example:**

```bash
cd my-existing-blog
/boost add comment system with moderation

Agent:
ðŸ” Detected:
   - Framework: Next.js 14
   - Database: Supabase
   - Styling: Tailwind CSS

ðŸ“ Plan:
   1. Add Comment model to Supabase
   2. Create CommentList component
   3. Add moderation API routes
   4. Setup admin panel

â“ Proceed? (Y/n) â†’ Y

âœ… Updated: my-existing-blog/
   â”œâ”€â”€ lib/supabase/schema.sql (UPDATED)
   â”œâ”€â”€ components/CommentList.tsx (NEW)
   â”œâ”€â”€ components/CommentForm.tsx (NEW)
   â”œâ”€â”€ app/api/comments/ (NEW)
   â””â”€â”€ app/admin/comments/ (NEW)
```

**Output:**

- Integrated seamlessly
- Matches existing code style
- No breaking changes

---

#### `/autopilot` - Fully Autonomous (Cho Prototype/Demo)

**Äáº·c Ä‘iá»ƒm:**

- âœ… Zero user input
- âœ… 3+ agents collaboration
- âœ… Best practices tá»± Ä‘á»™ng
- â±ï¸ 3-5 phÃºt

**Khi nÃ o dÃ¹ng:**

- Demo nhanh cho client
- Rapid prototyping
- POC (Proof of Concept)

**Example:**

```bash
/autopilot e-commerce with Stripe and admin dashboard

Agent (autonomous):
[00:00] ðŸ¤– Orchestrator: Planning architecture
[00:01] ðŸ“ Frontend: Next.js 15 + TypeScript
[00:02] ðŸ—„ï¸ Backend: tRPC + Prisma
[00:03] ðŸŽ¨ Design: Tailwind + Shadcn UI
[00:04] ðŸ’³ Stripe: Payment integration
[00:05] ðŸ‘¨â€ðŸ’¼ Admin: Dashboard with RBAC
[00:06] ðŸ§ª Tests: E2E with Playwright

âœ… DONE - Ready to deploy

Created: ecommerce-store/
   â”œâ”€â”€ app/ (Products, Cart, Checkout, Admin)
   â”œâ”€â”€ server/ (tRPC routers)
   â”œâ”€â”€ prisma/ (Product, Order, User models)
   â”œâ”€â”€ components/ (ProductCard, CartItem, etc.)
   â”œâ”€â”€ lib/stripe/ (Payment processing)
   â”œâ”€â”€ tests/e2e/ (Full user journey)
   â””â”€â”€ vercel.json (Deploy config)
```

**Output:**

- Full-stack production-ready app
- Stripe payments configured
- Admin dashboard included
- E2E tests written

---

### ðŸ“Š So SÃ¡nh 3 Modes

| Aspect            | /build    | /boost            | /autopilot |
| ----------------- | --------- | ----------------- | ---------- |
| **Questions**     | 10-15     | 2-3               | 0          |
| **Control**       | 100%      | 60%               | 20%        |
| **Speed**         | 10-15 min | 5-7 min           | 3-5 min    |
| **Best For**      | Learning  | Existing projects | Demos      |
| **Agents**        | 1         | 1-2               | 3+         |
| **Customization** | High      | Medium            | Low        |

---

## 2ï¸âƒ£ security-audit Chain

> **Má»¥c Ä‘Ã­ch:** Comprehensive security review

### ðŸ”§ Skills (4)

1. `security-scanner` - Vulnerability scanning
2. `code-review` - Security-focused code review
3. `offensive-sec` - Penetration testing
4. `cicd-pipeline` - CI/CD security integration

### ðŸš€ Workflow

#### `/inspect` - Security Audit

**Example:**

```bash
/inspect my-web-app

Agent:
ðŸ” Running security audit...

[1/4] ðŸ›¡ï¸ Vulnerability Scan
   âœ… Dependencies: 0 critical, 2 high
   âš ï¸ Found: Outdated express 4.17.1

[2/4] ðŸ‘€ Code Review
   âŒ SQL injection risk in /api/users
   âš ï¸ No input validation in auth routes

[3/4] ðŸŽ¯ Penetration Test
   âŒ XSS vulnerability in comments
   âœ… CSRF protection enabled

[4/4] ðŸ”§ CI/CD Integration
   âœ… Added security checks to GitHub Actions

ðŸ“Š Report:
   - Critical: 1 (SQL injection)
   - High: 3 (XSS, outdated deps)
   - Medium: 5
   - Recommendations: 12

âœ… Generated: security-report.md
```

**Use Cases:**

- Pre-deployment security check
- Regular security audits
- Compliance requirements (OWASP)

---

## 3ï¸âƒ£ debug-complex Chain

> **Má»¥c Ä‘Ã­ch:** Systematic debugging vá»›i root cause analysis

### ðŸ”§ Skills (4)

1. `debug-pro` - Initial analysis
2. `debug-pro` - Deep investigation
3. `idea-storm` - Hypothesis generation
4. `test-architect` - Fix verification

### ðŸš€ Workflow

#### `/diagnose` - Deep Debug

**Example:**

```bash
/diagnose users can't login after deployment

Agent:
[1/4] ðŸ” Analysis Phase
   ðŸ“‹ Symptoms:
      - Login fails with 500 error
      - Started after deploy v2.1
      - Only affects production

[2/4] ðŸ› ï¸ Investigation
   ðŸ”Ž Checked:
      - âœ… Database connection OK
      - âœ… API routes accessible
      - âŒ Environment variables mismatch

   ðŸŽ¯ Found: AUTH_SECRET not set in production

[3/4] ðŸ§  Hypothesis
   ðŸ’¡ Root Cause:
      - AUTH_SECRET missing in .env.production
      - JWT tokens can't be verified
      - Login fails silently

[4/4] âœ… Verification
   ðŸ§ª Test Plan:
      1. Add AUTH_SECRET to production
      2. Test login flow
      3. Add monitoring alert

   âœ… Fix applied and verified

ðŸ“ Created: debug-report.md
   - Root cause
   - Fix applied
   - Prevention suggestions
```

**Use Cases:**

- Hard-to-reproduce bugs
- Production issues
- Performance problems

---

## 4ï¸âƒ£ deploy-production Chain

> **Má»¥c Ä‘Ã­ch:** Safe production deployment vá»›i pre-flight checks

### ðŸ”§ Skills (5)

1. `security-scanner` - Security pre-check
2. `perf-optimizer` - Performance optimization
3. `e2e-automation` - E2E tests
4. `cicd-pipeline` - Deployment execution
5. `cicd-pipeline` - Gradual rollout (optional)

### ðŸš€ Workflow

#### `/launch` - Production Deploy

**Example:**

```bash
/launch to production

Agent:
[1/5] ðŸ›¡ï¸ Security Pre-Check
   âœ… No critical vulnerabilities
   âœ… Dependencies up to date
   âœ… Secrets properly configured

[2/5] âš¡ Performance Optimization
   âœ… Bundle size: 245KB (optimized from 380KB)
   âœ… Lighthouse score: 95/100
   âœ… Core Web Vitals: PASS

[3/5] ðŸ§ª E2E Tests
   âœ… User flows: 15/15 passed
   âœ… Payment flow: PASS
   âœ… Admin panel: PASS

[4/5] ðŸš€ Deployment
   âœ… Built successfully
   âœ… Deployed to Vercel
   âœ… Health check: PASS
   ðŸŒ Live: https://app.example.com

[5/5] ðŸš© Feature Flags (optional)
   âœ… New checkout: 10% rollout
   âœ… Monitoring enabled

ðŸ“Š Deployment Summary:
   - Version: v2.2.0
   - Deploy time: 3m 42s
   - Status: SUCCESS
   - Rollback available: Yes
```

**Use Cases:**

- Production deployments
- Staging deployments
- Hotfix releases

---

## 5ï¸âƒ£ api-development Chain

> **Má»¥c Ä‘Ã­ch:** API design & implementation

### ðŸ”§ Skills (5)

1. `api-architect` - API design (REST/GraphQL/tRPC)
2. `data-modeler` - Database schema
3. `nodejs-pro` - Node.js implementation
4. `test-architect` - API testing
5. `security-scanner` - API security

### ðŸš€ Workflow

#### `/api` - API Development

**Example:**

```bash
/api user management with RBAC

Agent:
[1/5] ðŸ“ API Design
   âœ… Designed RESTful endpoints:
      - POST /api/auth/register
      - POST /api/auth/login
      - GET /api/users (admin only)
      - PATCH /api/users/:id
      - DELETE /api/users/:id

[2/5] ðŸ—„ï¸ Database Schema
   âœ… Created Prisma models:
      - User (id, email, role, createdAt)
      - Role (id, name, permissions)
      - Session (id, userId, token)

[3/5] ðŸ’» Implementation
   âœ… Implemented with Express.js
   âœ… JWT authentication
   âœ… Role-based middleware
   âœ… Input validation with Zod

[4/5] ðŸ§ª Testing
   âœ… Unit tests: 24/24 passed
   âœ… Integration tests: 12/12 passed
   âœ… API docs generated (Swagger)

[5/5] ðŸ›¡ï¸ Security
   âœ… Rate limiting enabled
   âœ… CORS configured
   âœ… SQL injection prevention
   âœ… XSS protection

ðŸ“¦ Created: api/
   â”œâ”€â”€ routes/
   â”œâ”€â”€ middleware/
   â”œâ”€â”€ controllers/
   â”œâ”€â”€ tests/
   â”œâ”€â”€ prisma/
   â””â”€â”€ swagger.yaml
```

**Use Cases:**

- Backend API development
- Microservices
- Mobile app backends

---

## ðŸŽ¯ Chá»n Chain NÃ o?

### Decision Tree

```
Báº¡n muá»‘n lÃ m gÃ¬?
â”‚
â”œâ”€ XÃ¢y web app?
â”‚  â”œâ”€ New project? â†’ /build
â”‚  â”œâ”€ Add features? â†’ /boost
â”‚  â””â”€ Quick demo? â†’ /autopilot
â”‚
â”œâ”€ Check security? â†’ /inspect
â”‚
â”œâ”€ Debug issue? â†’ /diagnose
â”‚
â”œâ”€ Deploy app? â†’ /launch
â”‚
â””â”€ Build API? â†’ /api
```

---

## ðŸ’¡ Best Practices

### 1. Workflow Progression (Recommended)

**Week 1:** Learning

```bash
/build my-first-app
â†’ Há»c cÃ¡ch agent work
â†’ Hiá»ƒu tech decisions
```

**Week 2-4:** Development

```bash
cd my-first-app
/boost add feature 1
/boost add feature 2
/boost add feature 3
â†’ Incremental improvements
```

**Week 5:** QA & Deploy

```bash
/inspect  # Security check
/diagnose # Fix any issues
/launch   # Deploy to production
```

### 2. Combine Workflows

```bash
# Build backend
/api user management

# Build frontend
/build admin dashboard

# Security check
/inspect both projects

# Deploy
/launch to staging
```

### 3. Iterative Development

```bash
# Iteration 1: MVP
/autopilot basic todo app

# Iteration 2: Enhancements
/boost add categories
/boost add due dates
/boost add notifications

# Iteration 3: Polish
/inspect             # Security
/diagnose slow queries  # Performance
/launch              # Deploy
```

---

## ðŸ”§ Advanced Usage

### Chain Customization

Chains cÃ³ thá»ƒ customize qua:

**1. Execution Strategy:**

```json
{
  "execution": {
    "strategy": "dag", // or "sequential"
    "parallelism": {
      "enabled": true,
      "maxConcurrent": 3
    }
  }
}
```

**2. Success Criteria:**

```json
{
  "successCriteria": {
    "required": ["all-skills-completed", "tests-passing"],
    "optional": ["performance-benchmark"]
  }
}
```

**3. Retry Policy:**

```json
{
  "retryPolicy": {
    "maxRetries": 2,
    "backoffMs": 1000
  }
}
```

---

## â“ FAQ

**Q: /build vs /autopilot - Khi nÃ o dÃ¹ng gÃ¬?**

A:

- `/build`: Khi báº¡n muá»‘n LEARN vÃ  CONTROL
- `/autopilot`: Khi báº¡n cáº§n SPEED vÃ  TRUST agent

**Q: /boost cÃ³ thá»ƒ dÃ¹ng cho project khÃ´ng pháº£i Next.js?**

A: CÃ³! Agent detect framework vÃ  adapt:

```bash
cd my-vue-app
/boost add authentication
â†’ Agent sáº½ dÃ¹ng Vue patterns
```

**Q: Chain cÃ³ thá»ƒ cháº¡y parallel khÃ´ng?**

A: CÃ³ (tÃ¹y chain):

- `build-web-app`: DAG (parallel skills)
- `deploy-production`: DAG (parallel pre-checks)
- `debug-complex`: Sequential only

**Q: LÃ m sao rollback khi /launch fail?**

A: Agent tá»± Ä‘á»™ng:

```bash
/launch
âŒ Deployment failed

ðŸ”™ Rollback options:
   1. Auto-rollback to previous version
   2. Manual rollback
   3. Debug and retry

â†’ Choose: 1
âœ… Rolled back to v2.1.0
```

---

## ðŸ“š TÃ i Liá»‡u ThÃªm

- [Workflow Chains Schema v2.0](./workflow-chains-schema-v2.md)
- [ARCHITECTURE.md](../ARCHITECTURE.md) - System overview
- [CHANGELOG.md](../../CHANGELOG.md) - Recent updates

---

**Version:** 1.0.0  
**Last Updated:** 2026-01-29  
**Schema:** v2.0 (FAANG-compliant)

