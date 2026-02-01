# PikaKit

> **Transform your AI Agent into a FAANG-level engineering team with one command**

[![npm](https://img.shields.io/badge/version-3.7.1-7c3aed?style=flat&colorA=18181b)](https://www.npmjs.com/package/pikakit)
[![skills](https://img.shields.io/badge/skills-50-7c3aed?style=flat&colorA=18181b)](https://github.com/pikakit/agent-skills)
[![agents](https://img.shields.io/badge/agents-25-7c3aed?style=flat&colorA=18181b)](https://github.com/pikakit/agent-skills)
[![workflows](https://img.shields.io/badge/workflows-25-7c3aed?style=flat&colorA=18181b)](https://github.com/pikakit/agent-skills)
[![JavaScript](https://img.shields.io/badge/100%25-JavaScript-F7DF1E?style=flat&colorA=18181b&logo=javascript)](https://github.com/pikakit/agent-skills)
[![license](https://img.shields.io/badge/license-UNLICENSED-7c3aed?style=flat&colorA=18181b)](LICENSE)

---

## ⚡ Quick Install

```bash
npx pikakit
```

**What gets installed:**

| Component | Count | Description |
|-----------|-------|-------------|
| **Skills** | 50 | FAANG-grade coding skills |
| **Workflows** | 25 | `/think`, `/build`, `/autopilot`, etc. |
| **Agents** | 25 | Specialist AI agents |
| **Rules** | GEMINI.md | AI behavior configuration |
| **Scripts** | 25 | JavaScript automation scripts |
| **Commands** | `kit` | CLI management tool |
| **Commands** | `agent` (optional) | Interactive learning dashboard |

---

## 🎯 What Makes This Different

| Feature | PikaKit | Generic AI | Other Tools |
|---------|-----------------|------------|-------------|
| **Auto-Accept Workflow** | ✅ 1 approval → Full execution | ❌ | ❌ |
| **Multi-Agent Coordination** | ✅ 25 specialists in parallel | 1 generic | 1-3 |
| **Self-Learning** | ✅ Learns from mistakes | ❌ | ❌ |
| **100% JavaScript** | ✅ No Python required | Mixed | Python |
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
npx pikakit
```

**During installation:**
- Choose **Project** (local `.agent/`) or **Global** (`~/.gemini/`)
- Choose **Yes/No** for AutoLearn CLI (optional - does not affect core functionality)

### Step 2: Use Commands

```bash
# Manage skills
kit list                    # List all skills
kit validate                # Validate skill structure
kit info <skill-name>       # Show skill details

# Interactive dashboard (if AutoLearn installed)
agent                       # Launch Smart CLI
```

### Step 3: Use Workflows

```bash
/think authentication system    # Brainstorm 3+ approaches
/architect                      # Generate detailed plan
/build                          # Implement with multi-agent
/autopilot                      # Full autonomous execution
/validate                       # Run tests automatically
```

---

## 📦 Complete Installation Contents

When you run `npx -y pikakit pikakit-agent-skills`, you get:

```
your-project/
├── .agent/
│   ├── GEMINI.md                      # AI Rules (Supreme Law)
│   ├── ARCHITECTURE.md                # System Architecture
│   ├── CONTINUOUS_EXECUTION_POLICY.md # Autopilot Rules
│   ├── WORKFLOW_CHAINS.md             # Workflow Patterns
│   │
│   ├── skills/                        # 50 Skills
│   │   ├── auto-learner/              # Learn from mistakes
│   │   ├── react-architect/           # React best practices
│   │   ├── typescript-expert/         # TypeScript mastery
│   │   ├── debug-pro/                 # Advanced debugging
│   │   ├── studio/                    # 50+ design styles
│   │   └── ...
│   │
│   ├── workflows/                     # 25 Workflows
│   │   ├── think.md                   # /think
│   │   ├── build.md                   # /build
│   │   ├── autopilot.md               # /autopilot
│   │   └── ...
│   │
│   ├── agents/                        # 25 Specialist Agents
│   │   ├── frontend-specialist.md
│   │   ├── backend-specialist.md
│   │   ├── security-auditor.md
│   │   └── ...
│   │
│   ├── knowledge/                     # Self-Learning Memory
│   │   └── lessons-learned.yaml
│   │
│   ├── config/                        # Configuration
│   ├── scripts-js/                    # 25 JS Scripts
│   └── metrics/                       # Performance Tracking
│
├── kit.cmd / kit                      # CLI wrapper
├── agent.cmd / agent                  # AutoLearn wrapper (optional)
└── package.json                       # npm scripts added
```

---

## 🤖 Auto-Accept Workflow (Zero Interruption)

> **User approves PLAN.md once → Agent executes everything automatically**

### Concept

Traditional AI workflow:
```
User → Command → AI asks permission → User approves → AI runs → AI asks again → ...
```

PikaKit with Auto-Accept:
```
User → /autopilot → PLAN.md → ⛔ ONE APPROVAL → Agent runs ALL → ✅ DONE
```

### Real Example

**User Request:**
```
/autopilot Build FAANG-quality TodoList with Zustand + TypeScript + Tailwind

AUTO-APPROVE: After PLAN.md, proceed automatically.
```

**Result:** 
- **1 user approval** → **15+ auto-executed operations** → **Complete app in 8 minutes**

---

## 📜 Workflows Reference (25)

| Command | Description | Agents Used |
|---------|-------------|-------------|
| `/think` | Brainstorm 3+ approaches | project-planner |
| `/architect` | Generate detailed plan.md | project-planner, explorer |
| `/build` | Full-stack implementation | 3-7 agents |
| `/autopilot` | Multi-agent auto-execution | 3+ agents |
| `/validate` | Run test suite | test-engineer |
| `/diagnose` | Root cause debugging | debugger, explorer |
| `/launch` | Production deployment | devops, security |
| `/inspect` | Security code review | security-auditor |
| `/chronicle` | Auto-documentation | documentation-writer |
| `/studio` | UI design (50+ styles) | frontend-specialist |
| `/stage` | Preview server control | devops-engineer |
| `/forge` | Create custom skills | - |
| `/pulse` | Project health check | - |
| `/api` | API development | backend, security |
| `/mobile` | Mobile app development | mobile-developer |
| `/game` | Game development | game-engine |
| `/monitor` | Observability setup | observability |
| `/optimize` | Performance optimization | performance-optimizer |
| `/benchmark` | Load testing | - |
| `/diagram` | Auto-generate diagrams | - |
| `/flags` | Feature flag management | - |
| `/alert` | Alert configuration | - |
| `/boost` | Enhance existing code | varies |
| `/auto-accept-process` | Autonomous workflow | all |
| `/agent` | Smart CLI dashboard | - |

---

## 🧩 Skills Catalog (50)

### 🏗️ Architecture & Planning

| Skill | Description |
|-------|-------------|
| `app-scaffold` | Full-stack app scaffolding |
| `project-planner` | Task planning, breakdown |
| `idea-storm` | Socratic questioning, brainstorming |
| `lifecycle-orchestrator` | End-to-end task management |

### 🎨 Frontend & UI

| Skill | Description |
|-------|-------------|
| `react-architect` | React hooks, state, performance |
| `nextjs-pro` | App Router, Server Components |
| `tailwind-kit` | Tailwind CSS utilities |
| `studio` | 50+ styles, 97 palettes, 57 fonts |

### ⚙️ Backend & API

| Skill | Description |
|-------|-------------|
| `api-architect` | REST, GraphQL, tRPC |
| `nodejs-pro` | Node.js async patterns |
| `data-modeler` | Schema design, Prisma |

### 🔐 Security

| Skill | Description |
|-------|-------------|
| `security-scanner` | OWASP, vulnerability detection |
| `offensive-sec` | Offensive security, pentesting |
| `code-constitution` | Core code rules (SUPREME LAW) |

### 🧪 Testing & Quality

| Skill | Description |
|-------|-------------|
| `test-architect` | Jest, Vitest, strategies |
| `e2e-automation` | Playwright automation |
| `code-quality` | Linting, validation |
| `problem-checker` | IDE problem detection |

### 🐛 Debugging & Recovery

| Skill | Description |
|-------|-------------|
| `debug-pro` | 4-phase debugging + frameworks |
| `state-rollback` | Save/restore checkpoints |

### 🤖 AI & Agents

| Skill | Description |
|-------|-------------|
| `agent-patterns` | Multi-agent design patterns |
| `auto-learner` | Learning from failures |
| `self-evolution` | Knowledge evolution |
| `execution-reporter` | Agent routing transparency |

### ☁️ DevOps & Infra

| Skill | Description |
|-------|-------------|
| `cicd-pipeline` | CI/CD, Docker, K8s |
| `gitops-workflow` | ArgoCD/Flux GitOps |
| `observability` | OpenTelemetry, monitoring |
| `vercel-deploy` | 1-click Vercel deployment |

### 📱 Specialized

| Skill | Description |
|-------|-------------|
| `mobile-design` | Mobile UI/UX patterns |
| `mobile-developer` | React Native, Flutter |
| `mobile-security-coder` | Mobile security |
| `game-development` | Game logic, mechanics |
| `typescript-expert` | Type-level programming |

[See full catalog →](https://github.com/pikakit/agent-skills/tree/main/.agent/skills)

---

## 🤝 Multi-Agent Coordination

> **25 specialist agents working together like a FAANG engineering team**

### Agent Categories

**Meta-Agents (Runtime Control):**

| Agent | Role |
|-------|------|
| `orchestrator` | Strategic coordination |
| `assessor` | Risk evaluation |
| `recovery` | State management |
| `critic` | Conflict resolution |
| `learner` | Continuous improvement |

**Domain Agents (20):**

| Domain | Agent | Skills Used |
|--------|-------|-------------|
| Web UI | `frontend-specialist` | react-architect, tailwind-kit |
| API | `backend-specialist` | api-architect, nodejs-pro |
| Database | `database-architect` | data-modeler, prisma-expert |
| Security | `security-auditor` | security-scanner, offensive-sec |
| Testing | `test-engineer` | test-architect, e2e-automation |
| DevOps | `devops-engineer` | cicd-pipeline, server-ops |
| Mobile | `mobile-developer` | mobile-design |
| Debug | `debugger` | debug-pro |

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

## 🧠 Self-Learning System

> **AI learns from every mistake and NEVER repeats it**

### How It Works

```
Error Detected → auto-learner skill → Root Cause Analysis → Lesson Extracted
                                                                    ↓
Future Prevention ← Stored in lessons-learned.yaml ← Pattern Documented
```

### Using the Learning System

**Teach AI from your feedback:**

```
User: "Đây là lỗi nghiêm trọng, bạn đã tạo file mới thay vì rename"

AI: 📚 Đã học: [LEARN-003] - When rebranding: copy original first, 
    don't create new simplified file
```

**View all learned lessons (if AutoLearn CLI installed):**

```bash
agent → Learn → View All
```

---

## 🗂️ CLI Commands

### `kit` Command (Always Installed)

```bash
kit list                    # List all installed skills
kit info <skill-name>       # Show skill details
kit validate                # Validate skill structure
kit doctor                  # Check system health
kit cache status            # View cache usage
```

### `agent` Command (Optional - AutoLearn)

```bash
agent                       # Launch interactive dashboard
agent learn                 # Teach new patterns
agent recall                # Scan for violations
agent stats                 # View statistics
agent watch                 # Real-time monitoring
```

> **Note:** Not installing AutoLearn does NOT affect workflows, skills, or agents. The `agent` command is purely a convenience tool for interactive learning.

---

## 📈 Version History

**v3.7.1 (Current)**
- ✅ FAANG-Grade Structure Optimization
- ✅ Removed duplicate CLI (lib/agent-cli)
- ✅ Fixed all package counts
- ✅ 50 skills, 25 workflows, 25 agents
- ✅ Kit CLI dependencies fixed

**v3.7.0**
- ✅ Added vercel-deploy skill (1-click Vercel deployment)

**v3.2.5**

**v3.2.0**
- All master scripts migrated to JavaScript
- TypeScript definitions for IDE support
- ~10% faster execution

**v3.1.0**
- Added SelfEvolution v4.0 (auto-learning system)
- Enhanced agent routing (SmartRouter skill)

See [CHANGELOG.md](CHANGELOG.md) for full history.

---

## 🔗 Links

- [GitHub - agent-skills](https://github.com/pikakit/agent-skills)
- [GitHub - pikakit](https://github.com/pikakit/pikakit)
- [npm - pikakit](https://www.npmjs.com/package/pikakit)
- [Issues & Feature Requests](https://github.com/pikakit/agent-skills/issues)

---

## 📄 License

UNLICENSED - Commercial use only. See [LICENSE](LICENSE) for details.

---

**⚡ PikaKit v3.7.1**
*Composable Skills. Coordinated Agents. Intelligent Execution.*

---

**⭐ Star the repo • Install now • Build something great**
