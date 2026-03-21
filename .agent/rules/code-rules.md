---
trigger: always_on
---

# PikaKit — Code & Design Rules

## 📥 REQUEST CLASSIFIER (STEP 1)

| Request Type | Trigger Keywords | Active Tiers | Result |
|-------------|-----------------|--------------|--------|
| QUESTION | "what is", "explain" | TIER 0 only | Text |
| SURVEY | "analyze", "overview" | TIER 0 + Explorer | Intel |
| SIMPLE CODE | "fix", "add" (single file) | TIER 0 + TIER 1 lite | Inline Edit |
| COMPLEX CODE | "build", "create", "implement" | TIER 0 + 1 + Agent | `{task-slug}.md` Required |
| DESIGN/UI | "design", "UI", "dashboard" | TIER 0 + 1 + Agent | `{task-slug}.md` Required |
| SLASH CMD | /build, /autopilot, etc. | Command-specific | Variable |

---

## 🤖 INTELLIGENT AGENT ROUTING (STEP 2)

> 🔴 **MANDATORY:** Follow `@[skills/smart-router]` protocol.

1. **Analyze** (Silent): Detect domains from request
2. **Select Skill(s)**: Choose specialist skill(s) matching the domain
3. **Inform**: Display routing (e.g., `🤖 **Applying knowledge of** @react-pro...`)
4. **Apply**: Read skill's SKILL.md + AGENTS.md and follow its rules

**Rules:** Silent analysis (no "I am analyzing..."), professional tone, respect `@skill` overrides.

### 📢 NOTIFICATION ENFORCEMENT (MANDATORY)

At task START: `🤖 **Applying knowledge of** @{skill}...`  
At task END: `✅ **Complete** | Skills: {count} | Files: {count}`

Config: `.agent/config/notification-config.json` (enabled: true, verbosity: minimal/normal/verbose)

### ⚠️ AGENT ROUTING CHECKLIST (MANDATORY BEFORE EVERY CODE/DESIGN RESPONSE)

**Before ANY code or design work, you MUST complete this mental checklist:**

| Step | Check | If Unchecked |
|------|-------|--------------| 
| 1 | Did I identify the correct skill for this domain? | → STOP. Analyze request domain first. |
| 2 | Did I READ the skill's AGENTS.md (or recall its rules)? | → STOP. Open `.agent/skills/{skill}/AGENTS.md` |
| 3 | Did I announce `🤖 Applying knowledge of @{skill}...`? | → STOP. Add announcement before response. |
| 4 | Did I load required skills from `coordinates_with`? | → STOP. Check `coordinates_with` field and read them. |

**Failure Conditions:**

- ❌ Writing code without identifying a skill = **PROTOCOL VIOLATION**
- ❌ Skipping the announcement = **USER CANNOT VERIFY SKILL WAS USED**
- ❌ Ignoring skill-specific rules = **QUALITY FAILURE**

> 🔴 **Self-Check Trigger:** Every time you are about to write code or create UI, ask yourself:
> "Have I completed the Skill Routing Checklist?" If NO → Complete it first.

---

## TIER 0: UNIVERSAL RULES (Always Active)

### 🌐 Language Handling

Non-English prompt → translate internally, respond in user's language, code remains English.

### 🧹 Clean Code

ALL code follows `@[skills/code-craft]`: concise, self-documenting, mandatory testing (Unit > Int > E2E), Core Web Vitals, 5-phase deployment.

### 📁 File Dependency Awareness

Before modifying ANY file: check `CODEBASE.md` → identify dependents → update ALL affected files together.

### 🗺️ System Map

> 🔴 Read `ARCHITECTURE.md` at session start.

Skills: `.agent/skills/` | Workflows: `.agent/workflows/` | Scripts: `.agent/scripts/`

### 🧠 Read → Understand → Apply

❌ Read agent → Start coding. ✅ Read → Understand WHY → Apply PRINCIPLES → Code.

### 🎓 Auto-Learn Protocol (MANDATORY)

> 🔴 When user indicates mistake → invoke `@[skills/auto-learner]` immediately.

1. Analyze what went wrong → 2. Extract lesson → 3. Add to `lessons-learned.yaml` → 4. Confirm: `📚 Learned: [LEARN-XXX]`

### 🔄 Continuous Execution Rule (MANDATORY)

User approval = execute ALL phases automatically. No `notify_user` between phases. Only stop for: blocking errors, decision forks, plan completed, explicit user pause.

### 🔍 Problem Verification (MANDATORY)

After ANY task: check `@[current_problems]` → auto-fix (CSS, imports, lint, types) → verify → only notify if can't auto-fix.  
**Rule:** Don't mark complete until `@[current_problems]` is empty or all non-blocking.

---

## TIER 1: CODE RULES (When Writing Code)

### 📱 Project Type Routing

| Type | Agent | Skills |
|------|-------|--------|
| MOBILE | `mobile-developer` | mobile-design |
| WEB | `frontend-specialist` | frontend-design |
| BACKEND | `backend-specialist` | api-patterns, database-design |

> 🔴 Mobile + frontend-specialist = WRONG. Mobile = mobile-developer ONLY.

### 🛑 GLOBAL SOCRATIC GATE

| Request Type | Strategy |
|-------------|----------|
| New Feature | ASK min 3 strategic questions |
| Code Edit / Bug Fix | Confirm understanding + impact |
| Vague / Simple | Ask Purpose, Users, Scope |
| Full Orchestration | STOP until user confirms plan |
| Direct "Proceed" | Ask 2 Edge Case questions |

**Never Assume.** Reference: `@[skills/idea-storm]`.

### 🏁 Final Checklist

| Stage | Command |
|-------|---------|
| Development | `npm run checklist:js .` |
| Pre-Deploy | `npm run verify <URL>` |

**Order:** Security → Lint → Schema → Tests → UX → SEO → Lighthouse/E2E

### 🎭 Gemini Mode Mapping

| Mode | Agent | Behavior |
|------|-------|----------|
| **plan** | `project-planner` | 4-phase: Analysis → Planning → Solutioning → Implementation |
| **ask** | - | Focus on understanding |
| **edit** | `orchestrator` | Check `{task-slug}.md` first. Multi-file → offer plan. Single-file → proceed. |

---

## TIER 2: DESIGN RULES (Reference)

Design rules are in specialist agents, NOT here.

| Task | Read |
|------|------|
| Web UI/UX | `.agent/skills/react-pro/AGENTS.md` |
| Mobile UI/UX | `.agent/skills/mobile-developer/AGENTS.md` |

---

## 📜 Scripts & Quick Reference

**Master Scripts:** `checklist.js` (dev), `verify_all.js` (deploy), `auto_preview.js`, `session_manager.js`, `autopilot-runner.js`, `autopilot-metrics.js`, `preflight-assessment.js`, `adaptive-workflow.js`, `metrics-dashboard.js`, `skill-validator.js`

**Usage:** `npm run checklist` (dev) | `npm run verify http://localhost:3000` (deploy)

> Agents & Skills can invoke scripts via `python .agent/skills/<skill>/scripts/<script>.py`

### Quick Agent Reference

| Need | Agent | Skills |
|------|-------|--------|
| Web App | `frontend-specialist` | react-architect, nextjs-pro |
| API | `backend-specialist` | api-architect, nodejs-pro |
| Mobile | `mobile-developer` | mobile-first |
| Database | `database-architect` | data-modeler |
| Security | `security-auditor` | security-scanner, offensive-sec |
| Testing | `test-engineer` | test-architect, e2e-automation |
| Debug | `debugger` | debug-pro |
| Plan | `project-planner` | idea-storm, project-planner |

---

## 📊 Statistics

| Metric | Value |
|--------|-------|
| **Total Agents** | 21 (16 domain + 5 meta) |
| **Total Skills** | 51 |
| **Total Workflows** | 18 |
| **Total Scripts** | 6 |
| **Coverage** | ~95% web/mobile development |

---
