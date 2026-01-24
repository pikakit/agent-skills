<p align="center">
  <img src="https://raw.githubusercontent.com/agentskillkit/agent-skills/main/.github/logo.svg" height="96">
</p>

<h1 align="center">Agent Skills Kit</h1>

<p align="center">
  <strong>Turn any AI agent into a 10x developer</strong>
</p>

<p align="center">
  <a href="https://github.com/agentskillkit/agent-skills"><img src="https://img.shields.io/github/stars/agentskillkit/agent-skills?style=flat&colorA=18181b&colorB=7c3aed" alt="stars"></a>
  <a href="https://github.com/agentskillkit/agent-skills/blob/main/LICENSE"><img src="https://img.shields.io/badge/license-Proprietary-7c3aed?style=flat&colorA=18181b" alt="license"></a>
  <img src="https://img.shields.io/badge/version-1.0.0-7c3aed?style=flat&colorA=18181b" alt="version">
</p>

<p align="center">
  <a href="#install">Install</a> •
  <a href="#whats-inside">What's Inside</a> •
  <a href="#self-learning">Self-Learning</a> •
  <a href="#cli">CLI</a>
</p>

---

## Install

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

That's it. Your AI agent now has enterprise-grade skills.

---

## What's Inside

| Component | Count | What it does |
|-----------|-------|--------------|
| **Skills** | 40+ | Domain expertise (React, API, Testing, Security...) |
| **Workflows** | 11 | Slash commands (`/debug`, `/plan`, `/deploy`...) |
| **Agents** | 20 | Specialist personas (Frontend, Backend, DevOps...) |

### Skill Highlights

```
.agent/skills/
├── react-patterns       # Hooks, composition, performance
├── api-patterns         # REST, GraphQL, tRPC design
├── testing-patterns     # Unit, integration, E2E
├── clean-code           # Pragmatic coding standards
├── systematic-debugging # 4-phase debug methodology
├── vulnerability-scanner # OWASP security audit
└── 34 more...
```

---

## Self-Learning

Your agent learns from mistakes and remembers them forever.

```bash
# Teach it something new
npx ag-smart learn --pattern "console\.log" --message "No console.log in production"

# It will never make that mistake again
```

**How it works:**
1. You identify a pattern to avoid
2. Agent stores it in `knowledge/lessons-learned.yaml`
3. Every future audit checks against learned lessons

---

## CLI

```bash
# Audit compliance
npx ag-smart audit

# Teach a lesson
npx ag-smart learn --pattern "any" --message "Avoid 'any' type in TypeScript"

# Check memory
npx ag-smart recall src/utils.ts
```

---

## Why This Exists

| Problem | Solution |
|---------|----------|
| Agents give inconsistent advice | 40 curated, versioned skill modules |
| No memory between sessions | Self-learning engine persists knowledge |
| Manual prompt engineering | Pre-built workflows for common tasks |
| Security blindspots | Built-in vulnerability scanning |

---

## Requirements

- Node.js 18+
- AI agent that supports `.agent/skills/` (Antigravity, Claude Code coming soon)

---

## Install Now

```bash
npx -y add-skill-kit agentskillkit/agent-skills
```

<p align="center">
  <sub>© 2026 Agent Skill Kit. Proprietary License.</sub>
</p>

<p align="center">
  <a href="https://github.com/agentskillkit/agent-skills">GitHub</a> •
  <a href="https://github.com/agentskillkit/agent-skills/issues">Issues</a>
</p>
