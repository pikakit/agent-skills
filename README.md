# Agent Skill Kit

> **Transform your AI Agent into a FAANG-level engineering team with one command**

[![npm](https://img.shields.io/badge/version-3.2.0-7c3aed?style=flat&colorA=18181b)](https://www.npmjs.com/package/agentskillskit-cli)
[![Tests](https://github.com/agentskillkit/agent-skills/workflows/Tests/badge.svg)](https://github.com/agentskillkit/agent-skills/actions/workflows/test.yml)
[![Lint](https://github.com/agentskillkit/agent-skills/workflows/Lint/badge.svg)](https://github.com/agentskillkit/agent-skills/actions/workflows/lint.yml)
[![skills](https://img.shields.io/badge/skills-70-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![agents](https://img.shields.io/badge/agents-25-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![workflows](https://img.shields.io/badge/workflows-18-7c3aed?style=flat&colorA=18181b)](https://github.com/agentskillkit/agent-skills)
[![license](https://img.shields.io/badge/license-MIT-7c3aed?style=flat&colorA=18181b)](LICENSE)

---

## ⚡ Quick Install

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

**Choose your scope:**

| Scope | Location | Usage |
|-------|----------|-------|
| **Project** | `.agent/` folder | `npm run agent` |
| **Global** | `~/.gemini/` | `agent` command anywhere |

---

## 🎯 What Makes This Different

| Feature | Agent Skill Kit | Generic AI | Other Tools |
|---------|-----------------|------------|-------------|
| **Auto-Accept Workflow** | ✅ 1 approval → Full execution | ❌ | ❌ |
| **Multi-Agent Coordination** | ✅ 25 specialists in parallel | 1 generic | 1-3 |
| **Self-Learning** | ✅ Learns from mistakes | ❌ | ❌ |
| **Measurable Metrics** | ✅ SLOs, benchmarks | ❌ | ❌ |
| **Project-Specific Skills** | ✅ Create your own | ❌ | Partial |
| **Safety Protocol** | ✅ TIER -1 (no data loss) | ❌ | ❌ |
| **Token Efficiency** | ✅ 80% reduction | Baseline | 30% |

### 3 Unique Selling Points

1. **🤖 Auto-Accept Execution** - Approve plan once, agent runs to completion without interruptions
2. **🧠 Self-Learning Memory** - AI remembers mistakes and never repeats them
3. **🛠️ Project-Specific Skills** - Create custom skills that teach AI YOUR project's conventions

---

## 🚀 Quick Start (3 Steps)

### Step 1: Install

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

### Step 2: Launch Dashboard

```bash
# Local install
npm run agent

# Global install
agent
```

### Step 3: Use Workflows

```bash
/think authentication system    # Brainstorm 3+ approaches
/architect                      # Generate detailed plan
/build                          # Implement with multi-agent
/validate                       # Run tests automatically
```

---

## 🤖 Auto-Accept Workflow (Zero Interruption)

> **User approves PLAN.md once → Agent executes everything automatically**

### Concept

Traditional AI workflow:
```
User → Command → AI asks permission → User approves → AI runs → AI asks again → ...
```

Agent Skill Kit with Auto-Accept:
```
User → /autopilot → PLAN.md → ⛔ ONE APPROVAL → Agent runs ALL → ✅ DONE
```

### Real Example: Building TodoList App

**User Request:**
```
/autopilot Build FAANG-quality TodoList with Zustand + TypeScript + Tailwind

AUTO-APPROVE: After PLAN.md, proceed automatically.
```

**Execution Timeline:**

```
┌───────────────────────────────────────────────────────────────────────────┐
│ TIME    │ PHASE                    │ ACTION                              │
├─────────┼──────────────────────────┼─────────────────────────────────────┤
│ 0:00    │ Request                  │ User sends /autopilot command       │
│ 0:30    │ Planning                 │ PLAN.md generated with all details  │
│ 0:45    │ ⛔ CHECKPOINT            │ User approves PLAN.md (ONLY ONCE)   │
├─────────┼──────────────────────────┼─────────────────────────────────────┤
│ 1:00    │ AUTO: Scaffold           │ Next.js + deps + folder structure   │
│ 2:00    │ AUTO: Types              │ TypeScript interfaces               │
│ 2:30    │ AUTO: Store              │ Zustand store implementation        │
│ 3:30    │ AUTO: Components (5)     │ TodoItem, TodoList, AddTodo, etc.   │
│ 5:00    │ AUTO: Pages              │ Main page + layout                  │
│ 6:00    │ AUTO: Tests (12)         │ Unit + integration tests            │
│ 7:00    │ AUTO: Verification       │ Lint + Security scan + Type check   │
│ 8:00    │ ✅ COMPLETE              │ Preview at http://localhost:3000    │
└─────────┴──────────────────────────┴─────────────────────────────────────┘
```

**Result:** 
- **1 user approval** → **15+ auto-executed operations** → **Complete app in 8 minutes**

### How to Enable Auto-Accept

**Method 1: Use `// turbo-all` annotation in workflow**

```markdown
// turbo-all

# My Workflow

1. Create project structure
2. Install dependencies
3. Run tests
```

**Method 2: Add AUTO-APPROVE to your request**

```
/build my-feature

AUTO-APPROVE: After PLAN.md, proceed automatically.
```

### Auto-Accept Rules

| Command Type | Auto-Accept? | Example |
|--------------|--------------|---------|
| `npm run *` | ✅ Yes | `npm run test`, `npm run build` |
| `npm test` | ✅ Yes | Test execution |
| `git status/diff/log` | ✅ Yes | Read-only git commands |
| `node .agent/*` | ✅ Yes | Agent scripts |
| File creation | ✅ Yes | Creating new files |
| **`rm -rf`** | ❌ **NEVER** | Destructive operations |
| **`git push`** | ❌ No | Requires explicit approval |
| **Config modification** | ❌ No | Critical changes |

---

## 📊 Measurable Results

### Performance Benchmarks (Real Data)

| App Type | Agents Used | Execution Time | Files Created | Success Rate |
|----------|-------------|----------------|---------------|--------------|
| **Simple** (Landing page) | 2-3 | < 3 min | < 10 | 98% |
| **Standard** (TodoList, Blog) | 3-4 | 3-5 min | 10-20 | 95% |
| **Complex** (E-commerce, Dashboard) | 5+ | 5-10 min | 20-50 | 90% |
| **Enterprise** (Full SaaS) | 7+ | 10-20 min | 50+ | 85% |

### TodoList Benchmark (Verified)

```
┌─────────────────────────────────────────────────────────────┐
│ TodoList App Execution Metrics (Actual Run)                 │
├─────────────────────────────────────────────────────────────┤
│ Total Time:        8 minutes 12 seconds                     │
│ Files Created:     11 files                                 │
│ Test Cases:        12 passing                               │
│ IDE Problems:      0 (after auto-fix)                       │
│ Security Scan:     ✅ Clean                                 │
│ Lint Errors:       0                                        │
│ Agents Used:       4 (planner, frontend, backend, tester)   │
│ User Approvals:    1 (PLAN.md only)                         │
└─────────────────────────────────────────────────────────────┘
```

### SLO Targets (Service Level Objectives)

| Metric | Target | Status |
|--------|--------|--------|
| IDE Problems at Completion | 0 | ✅ Enforced |
| Security Scan Pass Rate | 100% | ✅ Enforced |
| Lint Errors | 0 | ✅ Enforced |
| Test Coverage | > 80% | ✅ Recommended |
| Type Errors | 0 | ✅ Enforced |

> **Enforcement:** Agent CANNOT mark task complete if any SLO fails.

### Token Efficiency

| Operation | Without ASK | With ASK | Reduction |
|-----------|-------------|----------|-----------|
| Simple feature | 50,000 tokens | 10,000 | **80%** |
| Full application | 200,000 tokens | 45,000 | **77%** |
| Complex refactor | 300,000 tokens | 70,000 | **76%** |

**Why more efficient?**
- Skills loaded on-demand, not all at once
- Context optimized per agent
- Reusable patterns reduce repetition

### Cost Estimation Formula

```javascript
function estimateTime(complexity, agents) {
  const baseTime = {
    simple: 3,      // minutes
    standard: 5,
    complex: 10,
    enterprise: 20
  };
  
  const agentMultiplier = Math.max(1, agents / 3);
  
  return {
    optimistic: Math.round(baseTime[complexity] * 0.8),
    likely: Math.round(baseTime[complexity] * agentMultiplier),
    pessimistic: Math.round(baseTime[complexity] * 1.5 * agentMultiplier)
  };
}

// Example: Standard app with 4 agents
estimateTime('standard', 4);
// → { optimistic: 4, likely: 7, pessimistic: 10 } minutes
```

---

## 🧠 Self-Learning System

> **AI learns from every mistake and NEVER repeats it**

### How It Works

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│  Error Detected │ ──► │  auto-learner   │ ──► │ Root Cause      │
│  (or user says  │     │  skill invoked  │     │ Analysis        │
│  "that's wrong")│     │                 │     │                 │
└─────────────────┘     └─────────────────┘     └────────┬────────┘
                                                         │
┌─────────────────┐     ┌─────────────────┐     ┌────────▼────────┐
│  Future         │ ◄── │  Stored in      │ ◄── │ Lesson          │
│  Prevention     │     │  lessons-       │     │ Extracted       │
│                 │     │  learned.yaml   │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
```

### Lesson Categories

| Category | ID Pattern | Trigger | Example |
|----------|------------|---------|---------|
| **Safety** | `SAFE-XXX` | Destructive actions | "Deleted file without confirmation" |
| **Code** | `CODE-XXX` | Type/syntax errors | "JSX.Element → ReactNode in React 18+" |
| **Workflow** | `FLOW-XXX` | Process violations | "Skipped problem check before completion" |
| **Integration** | `INT-XXX` | Config/dependency issues | "@import order in Tailwind CSS" |
| **Performance** | `PERF-XXX` | Slow code patterns | "N+1 query detected in API" |

### Real Lesson Examples

**Lesson 1: React 18+ Type Pattern**

```yaml
# .agent/knowledge/lessons-learned.yaml

- id: CODE-002
  pattern: "Using JSX.Element in React 18+"
  severity: HIGH
  message: |
    Use ReactNode instead of JSX.Element.
    React 18+ doesn't expose JSX namespace globally.
  date: "2026-01-15"
  trigger: "TypeScript error: Cannot find namespace 'JSX'"
  fix_applied: true
  example_fix: |
    // ❌ Before (causes error)
    const Header = (): JSX.Element => <header>...</header>;
    
    // ✅ After (correct)
    import { ReactNode } from 'react';
    const Header = (): ReactNode => <header>...</header>;
```

**Lesson 2: Completing Task Without Problem Check**

```yaml
- id: FLOW-001
  pattern: "Completing task without checking @[current_problems]"
  severity: CRITICAL
  message: |
    MUST check @[current_problems] before ANY notify_user call.
    Never mark task complete if IDE shows errors.
  date: "2026-01-10"
  trigger: "User complaint: 'Task marked complete but has errors'"
  fix_applied: true
```

### Using the Learning System

**Teach AI from your feedback:**

```
User: "Đây là lỗi nghiêm trọng, bạn đã tạo file mới thay vì rename"

AI: 📚 Đã học: [LEARN-003] - When rebranding: copy original first, 
    don't create new simplified file
```

**View all learned lessons:**

```bash
npm run agent → Lessons → View All
```

**Recall lessons during work:**

```bash
npm run agent → Recall → Scan codebase for violations
```

### Integration with Problem Checker

```
After EVERY code modification:
    │
    ▼
┌─────────────────────┐
│  problem-checker    │  ◄── Reads IDE problems
│  skill runs         │
└──────────┬──────────┘
           │
           ▼
    Problems found?
    ┌──────┴──────┐
    │             │
   YES           NO
    │             │
    ▼             ▼
┌───────────┐  ┌───────────┐
│ Auto-fix  │  │ Continue  │
│ attempt   │  │           │
└─────┬─────┘  └───────────┘
      │
      ▼
   Fixed?
   ┌──┴──┐
   │     │
  YES    NO
   │     │
   ▼     ▼
Continue  auto-learner
          extracts lesson
```

---

## 🛠️ Create Project-Specific Skills

> **Teach AI YOUR project's patterns, conventions, and best practices**

### Why Create Custom Skills?

| Without Custom Skills | With Custom Skills |
|----------------------|-------------------|
| AI uses generic patterns | AI follows YOUR conventions |
| Inconsistent code style | Uniform codebase |
| Repeated explanations | AI remembers once, applies forever |
| Manual code review fixes | Auto-correct violations |

### Quick Start: /forge Workflow

```bash
/forge create my-project-conventions
```

This creates:

```
.agent/skills/my-project-conventions/
├── SKILL.md              # Main instruction file
├── references/           # Templates & examples
│   ├── component.tsx     # Your component template
│   └── api-pattern.ts    # Your API pattern
└── scripts/              # Optional automation
    └── check_conventions.py
```

### Example: Creating "react-conventions" Skill

**Step 1: Create SKILL.md**

```yaml
---
name: react-conventions
description: >-
  Project-specific React patterns for MyApp.
  Enforces component structure, naming, and state management.
metadata:
  category: "project-specific"
  version: "1.0.0"
  triggers: "component, hook, page, react"
  coordinates_with: "code-craft, react-architect"
---

# React Conventions for MyApp

## Component Structure (MANDATORY)

Every React component MUST follow this structure:

```tsx
// 1. Imports - external first, then internal
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

// 2. Props interface - always named {ComponentName}Props
interface ButtonProps {
  variant?: 'primary' | 'secondary';
  children: React.ReactNode;
}

// 3. Component - always use forwardRef
const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', children, ...props }, ref) => {
    return (
      <button ref={ref} className={cn('btn', `btn-${variant}`)} {...props}>
        {children}
      </button>
    );
  }
);

// 4. Display name - for debugging
Button.displayName = 'Button';

// 5. Named export - never default export
export { Button };
export type { ButtonProps };
```

## State Management Rules

| State Type | Solution | When to Use |
|------------|----------|-------------|
| Local UI | useState | Component-specific state |
| Shared | Zustand | Cross-component state |
| Server | TanStack Query | API data fetching |
| Form | React Hook Form | Form handling |

**NEVER use Redux in this project.**

## File Naming

| Type | Pattern | Example |
|------|---------|---------|
| Component | PascalCase | `Button.tsx` |
| Hook | camelCase with `use` | `useAuth.ts` |
| Utility | camelCase | `formatDate.ts` |
| Type | PascalCase with suffix | `UserTypes.ts` |
```

**Step 2: Add Component Template**

Create `references/component.tsx`:

```tsx
import { forwardRef } from 'react';
import { cn } from '@/lib/utils';

interface __COMPONENT_NAME__Props {
  className?: string;
  children?: React.ReactNode;
}

const __COMPONENT_NAME__ = forwardRef<HTMLDivElement, __COMPONENT_NAME__Props>(
  ({ className, children, ...props }, ref) => {
    return (
      <div ref={ref} className={cn('', className)} {...props}>
        {children}
      </div>
    );
  }
);

__COMPONENT_NAME__.displayName = '__COMPONENT_NAME__';

export { __COMPONENT_NAME__ };
export type { __COMPONENT_NAME__Props };
```

**Step 3: Register in registry.json**

```json
{
  "skills": {
    "react-conventions": {
      "path": ".agent/skills/react-conventions",
      "description": "Project-specific React patterns",
      "triggers": ["component", "react", "hook", "page"],
      "priority": "high"
    }
  }
}
```

**Step 4: AI Now Follows YOUR Patterns!**

```
User: "Create a Card component"

AI: [Reads react-conventions skill]
    
    ✅ Uses forwardRef (per your conventions)
    ✅ Named export (per your conventions)  
    ✅ Props interface with correct naming
    ✅ Display name set
    ✅ Uses cn() utility
```

### Skill Structure Reference

```
skill-name/
├── SKILL.md                 # (Required) Instructions for AI
│   ├── YAML frontmatter     # name, description, triggers
│   └── Markdown content     # Rules, examples, patterns
│
├── references/              # (Optional) Templates & examples
│   ├── template.tsx         # Code templates
│   ├── example.ts           # Reference implementations
│   └── patterns.md          # Pattern documentation
│
├── scripts/                 # (Optional) Automation scripts
│   ├── check.py             # Validation script
│   └── generate.js          # Code generation
│
└── assets/                  # (Optional) Images, diagrams
    └── architecture.png     # Visual references
```

### Best Practices for Custom Skills

1. **Be Specific** - Vague rules lead to inconsistent results
2. **Include Examples** - Show, don't just tell
3. **Set Priorities** - Mark what's MANDATORY vs recommended
4. **Use Templates** - Reduce variation with starter code
5. **Add Triggers** - Define when skill should activate

---

## 🤝 Multi-Agent Coordination

> **25 specialist agents working together like a FAANG engineering team**

### Agent Categories

**Meta-Agents (Runtime Control):**

| Agent | Role | When Invoked |
|-------|------|--------------|
| `orchestrator` | Strategic coordination | Complex multi-domain tasks |
| `assessor` | Risk evaluation | Before risky operations |
| `recovery` | State management | Save/restore checkpoints |
| `critic` | Conflict resolution | Agent disagreements |
| `learner` | Continuous improvement | After successes/failures |

**Domain Agents (20):**

| Domain | Agent | Skills Used |
|--------|-------|-------------|
| Web UI | `frontend-specialist` | react-architect, tailwind-kit |
| API | `backend-specialist` | api-architect, nodejs-pro |
| Database | `database-architect` | data-modeler, prisma-expert |
| Security | `security-auditor` | security-scanner, offensive-sec |
| Testing | `test-engineer` | test-architect, e2e-automation |
| DevOps | `devops-engineer` | cicd-pipeline, server-ops |
| Mobile | `mobile-developer` | mobile-first |
| Performance | `performance-optimizer` | perf-optimizer |
| Planning | `project-planner` | idea-storm, project-planner |
| Debug | `debugger` | debugging-mastery |

### Agent Selection Matrix

| Task Type | Required Agents | Verification |
|-----------|-----------------|--------------|
| **Web App** | frontend, backend, test | lint + security |
| **API** | backend, security, test | security scan |
| **UI/Design** | frontend, seo, performance | lighthouse |
| **Database** | database, backend, security | schema check |
| **Full Stack** | planner, frontend, backend, devops | all |
| **Debug** | debugger, explorer, test | reproduction test |
| **Security Audit** | security, penetration-tester, devops | all scans |

### Parallel Execution Flow

```
                    ┌─────────────────┐
                    │  Approved Plan  │
                    └────────┬────────┘
                             │
              ┌──────────────┴──────────────┐
              │                             │
              ▼                             ▼
    ┌─────────────────┐           ┌─────────────────┐
    │ database-       │           │ security-       │
    │ architect       │           │ auditor         │
    │ (Foundation)    │           │ (Foundation)    │
    └────────┬────────┘           └────────┬────────┘
             │                             │
             └──────────────┬──────────────┘
                            │
              ┌─────────────┴─────────────┐
              │                           │
              ▼                           ▼
    ┌─────────────────┐         ┌─────────────────┐
    │ backend-        │         │ frontend-       │
    │ specialist      │         │ specialist      │
    │ (Core)          │         │ (Core)          │
    └────────┬────────┘         └────────┬────────┘
             │                           │
             └─────────────┬─────────────┘
                           │
              ┌────────────┴────────────┐
              │                         │
              ▼                         ▼
    ┌─────────────────┐       ┌─────────────────┐
    │ test-engineer   │       │ devops-engineer │
    │ (Polish)        │       │ (Polish)        │
    └────────┬────────┘       └────────┬────────┘
             │                         │
             └───────────┬─────────────┘
                         │
                         ▼
               ┌─────────────────┐
               │  Verification   │
               │  & Completion   │
               └─────────────────┘
```

### Conflict Resolution (Critic Agent)

When agents disagree:

```
test-engineer: "Need 100% coverage before deploy"
devops-engineer: "Deploy now, coverage can improve later"

         ▼
    
critic agent applies hierarchy:
  Safety > Recoverability > Correctness > Cleanliness > Convenience

         ▼

Verdict: "Deploy with current coverage (85%), 
          create ticket for coverage improvement"
```

---

## 📜 Workflows Reference (18)

| Command | Description | Agents Used | Est. Time |
|---------|-------------|-------------|-----------|
| `/think` | Brainstorm 3+ approaches | project-planner | 2-3 min |
| `/architect` | Generate detailed plan.md | project-planner, explorer | 3-5 min |
| `/build` | Full-stack implementation | 3-7 agents | 5-20 min |
| `/autopilot` | Multi-agent auto-execution | 3+ agents | 5-20 min |
| `/validate` | Run test suite | test-engineer | 2-5 min |
| `/diagnose` | Root cause debugging | debugger, explorer | 5-10 min |
| `/launch` | Production deployment | devops, security | 5-10 min |
| `/inspect` | Security code review | security-auditor | 5-10 min |
| `/chronicle` | Auto-documentation | documentation-writer | 3-5 min |
| `/studio` | UI design (50+ styles) | frontend-specialist | 2-5 min |
| `/stage` | Preview server control | devops-engineer | 1-2 min |
| `/forge` | Create custom skills | - | 5-10 min |
| `/pulse` | Project health check | - | 1 min |
| `/boost` | Enhance existing code | varies | 5-15 min |
| `/flags` | Feature flag management | - | 2-5 min |
| `/api` | API development | backend, security | 10-20 min |
| `/agent` | Smart CLI dashboard | - | - |
| `/auto-accept-process` | Autonomous workflow | all | varies |

### Workflow Examples

**`/think` - Brainstorming**

```bash
/think payment integration

# AI provides:
# - Option 1: Stripe (pros/cons)
# - Option 2: PayPal (pros/cons)  
# - Option 3: Custom solution (pros/cons)
# - Recommendation with reasoning
```

**`/build` - Implementation**

```bash
/build user authentication with JWT

# Agent coordination:
# 1. project-planner → PLAN.md
# 2. security-auditor → Auth requirements
# 3. backend-specialist → API + middleware
# 4. frontend-specialist → Login/register UI
# 5. test-engineer → Auth tests
```

**`/studio` - UI Design**

```bash
/studio design dashboard for fintech app

# Uses 50+ design styles, 95+ color palettes
# Generates: design tokens, color system, typography
# Outputs: CSS variables, Tailwind config
```

---

## 🧩 Skills Catalog (51)

### AI & Agent Development

| Skill | Description |
|-------|-------------|
| `smart-router` | Auto-select specialist agents |
| `lifecycle-orchestrator` | End-to-end task management |
| `auto-learner` | Learn from failures automatically |
| `input-validator` | Validate requests before routing |
| `requirement-extractor` | Extract structured requirements |

### Frontend & Design

| Skill | Description |
|-------|-------------|
| `studio` | 50 styles, 97 palettes, 57 fonts |
| `react-architect` | React hooks, state, performance |
| `nextjs-pro` | App Router, Server Components |
| `tailwind-kit` | Tailwind CSS v4 utilities |

### Backend & API

| Skill | Description |
|-------|-------------|
| `api-architect` | REST, GraphQL, tRPC |
| `nodejs-pro` | Node.js async patterns |
| `data-modeler` | Schema design, Prisma |
| `cache-optimizer` | Redis, CDN, caching strategies |
| `database-tuner` | Query optimization, N+1 fixes |

### Testing & Quality

| Skill | Description |
|-------|-------------|
| `test-architect` | Jest, Vitest, strategies |
| `e2e-automation` | Playwright automation |
| `debugging-mastery` | 4-phase methodology |
| `integration-tester` | Contract testing, API validation |
| `load-tester` | k6/Artillery performance tests |

### Security

| Skill | Description |
|-------|-------------|
| `security-scanner` | OWASP, vulnerability detection |
| `chaos-engineer` | Resilience testing |

### Observability

| Skill | Description |
|-------|-------------|
| `observability` | OpenTelemetry setup |
| `logging` | Structured logging, aggregation |
| `metrics` | Prometheus, Golden Signals |
| `tracing` | Distributed tracing |
| `incident-response` | Alerts, runbooks, post-mortems |

### DevOps

| Skill | Description |
|-------|-------------|
| `cicd-pipeline` | CI/CD, Docker, K8s |
| `feature-flags` | A/B testing, gradual rollouts |

[See full catalog →](https://github.com/agentskillkit/agent-skills/tree/main/.agent/skills)

---

## 🛡️ Safety Protocol (TIER -1)

> **Safety > Recoverability > Correctness > Cleanliness > Convenience**

### Core Rules

| Rule | Description |
|------|-------------|
| **NO DELETE** | Never delete files without explicit user confirmation |
| **WRITE-ONLY DEFAULT** | Create new files, don't modify without approval |
| **VERSIONING** | All updates use `.v2`, `.new`, `.proposed` suffix |
| **ROLLBACK GUARANTEE** | Previous version always recoverable |
| **HUMAN CHECKPOINT** | Critical changes require explicit approval |

### Forbidden Operations (Always Blocked)

```bash
# These NEVER auto-execute, regardless of settings:
rm -rf *
git push --force
DROP DATABASE
Remove-Item -Recurse
```

---

## 📊 Master Scripts

| Script | Purpose | Command |
|--------|---------|---------|
| `checklist.js` | Core validation (lint, security, tests) | `npm run checklist` |
| `verify_all.js` | Full verification suite | `npm run verify <URL>` |
| `auto_preview.js` | Dev server management | `npm run preview:start` |
| `session_manager.js` | Project status & analytics | `npm run session:status` |
| `autopilot-runner.js` | Autopilot integration | Internal use |
| `autopilot-metrics.js` | Metrics collection (11 metrics) | Internal use |
| `skill-validator.js` | Skill compliance checker | `node .agent/scripts-js/skill-validator.js` |

### Quick Commands

```bash
# Development validation
npm run checklist

# Pre-deploy full verification  
npm run verify http://localhost:3000

# Project health
npm run session:info

# Dev server
npm run preview:start
npm run preview:stop
```

---

## 🗂️ Project Structure

**Local Install:**

```
your-project/
├── .agent/
│   ├── GEMINI.md              # AI behavior config
│   ├── ARCHITECTURE.md        # System overview
│   ├── skills/                # 51 skills + registry.json
│   ├── agents/                # 25 specialist agents
│   ├── workflows/             # 18 slash commands
│   ├── knowledge/             # Self-learning memory
│   │   └── lessons-learned.yaml
│   ├── scripts-js/            # Master validation scripts
│   └── config/                # Configuration files
├── node_modules/
│   └── agentskillskit-cli/
└── package.json
    └── "agent": "agent"       # Auto-added script
```

**Global Install:**

```
~/.gemini/
└── antigravity/
    ├── skills/                # 51 skills
    ├── agents/                # 25 agents
    ├── workflows/             # 18 workflows
    └── knowledge/             # Self-learning memory
```

---

## 📈 Version History

**v3.2.0 (Current)**
- ✅ All master scripts migrated to JavaScript
- ✅ Zero Python dependency for core features
- ✅ 143 tests passing across Studio & CLI
- ✅ TypeScript definitions for IDE support
- ✅ ~10% faster execution

**v3.1.0**
- Added SelfEvolution v4.0 (auto-learning system)
- Enhanced agent routing (SmartRouter skill)
- 49 skills total

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## 🔗 Links

- [GitHub - agent-skills](https://github.com/agentskillkit/agent-skills)
- [GitHub - add-skill-kit](https://github.com/agentskillkit/add-skill-kit)
- [npm - agentskillskit-cli](https://www.npmjs.com/package/agentskillskit-cli)
- [npm - add-skill-kit](https://www.npmjs.com/package/add-skill-kit)
- [Issues & Feature Requests](https://github.com/agentskillkit/agent-skills/issues)

---

## 📄 License

MIT - Free for all projects.

---

**⭐ Star the repo • Install now • Build something great**
