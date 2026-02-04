---
title: Greenfield Projects
description: Create new projects from scratch with PikaKit's AI-powered development
section: guides
category: workflows
order: 2
---

# Greenfield Projects

Create new projects from scratch with **PikaKit**'s AI-powered development workflow. Transform ideas into production-ready applications quickly with intelligent agents.

## Installation

```bash
npm i -g pikakit@latest
```

## Quick Start

### Method 1: Bootstrap New Project

```bash
# Initialize project with PikaKit
npx pikakit
```

### Method 2: Manual Setup

```bash
mkdir my-awesome-project
cd my-awesome-project
git init
# Start your AI IDE session
```

## The `/build` Command (Application Factory)

```bash
/build "description of your idea"
```

This is the **most powerful command** for greenfield projects. It:
1.  Asks clarifying questions for context.
2.  **Provides detailed implementation plan** (review carefully!).
3.  After approval, starts implementing.
4.  Writes tests automatically.
5.  Performs code reviews.
6.  Creates initial specs and roadmap.

### Example: Simple Project

```bash
/build "A CLI tool that converts markdown files to PDF with custom styling"
```

**PikaKit will ask**:
- Target platform? (Node.js, Deno, Bun?)
- PDF library? (pdfkit, puppeteer?)
- Distribution? (npm, binary?)

### Example: Web Application

```bash
/build "A real-time collaborative todo app with team workspaces and permissions"
```

**PikaKit will ask**:
- Frontend? (React, Vue, Svelte?)
- Backend? (Node.js, Python?)
- Database? (PostgreSQL, Supabase?)
- Real-time? (WebSocket, SSE?)

### Autonomous Mode (`/autopilot`)

```bash
/autopilot "your idea"
```

Runs full autonomous mode without step-by-step plan review. PikaKit will:
- Make all technical decisions.
- Implement entire project.
- Run tests and fix issues.
- Generate documentation.

**Recommendation**: Only use for simple, well-defined projects or prototypes.

## After Bootstrap

### Project Structure

PikaKit creates a standard project structure:

```
my-project/
├── .agent/            # PikaKit configuration (skills, workflows)
├── docs/              # Generated documentation
├── src/               # Source code
├── tests/             # Test files
├── package.json       # Dependencies
└── README.md          # Project readme
```

### Continue Development

Use all PikaKit commands for further development:

#### Add New Features
```bash
/cook "Add user authentication with email verification"
```

#### Fix Issues
```bash
/fix "Button click handler not responding on mobile"
```

#### Plan Enhancements
```bash
/plan "Add payment processing with Stripe"
```

#### Run Tests
```bash
/validate
```

## Common Project Types

### Web API Server

```bash
/build "REST API for e-commerce platform with products, cart, orders, and payments"
```

### Full-Stack Application

```bash
/build "Full-stack task management app with kanban boards and time tracking"
```

### Chrome Extension

```bash
/build "Chrome extension that summarizes web articles and saves highlights to Notion"
```

## Advanced Workflows

### Iterative Development

```bash
# 1. Start with MVP
/build "Minimal viable product for habit tracking app"

# 2. After MVP completion, add features
/cook "Add social sharing features"
/cook "Add streak tracking and notifications"

# 3. Optimize and refine
/fix "Performance issues with large datasets"
/plan "Add premium features with subscription"
```

### Documentation-Driven Development

```bash
# 1. Create detailed plan first
/plan "Complete SaaS platform with multi-tenancy, billing, and admin dashboard"

# 2. Review and refine plan

# 3. Implement in phases
/cook "Implement phase 1 of the plan"
/validate
/cook "Implement phase 2 of the plan"
/validate
```

## Best Practices

### 1. Clear Description

**Good:**
```bash
/build "Real-time chat application with rooms, direct messages, file sharing, and presence indicators. Target 1000 concurrent users."
```

**Bad:**
```bash
/build "Chat app"
```

### 2. Review Plans Carefully

**IMPORTANT:** Always review implementation plans before approval. Check:
- Architecture decisions.
- Technology choices.
- Security considerations.
- Testing strategy.

### 3. Start Small, Iterate

```bash
# Phase 1: Core MVP
/build "Basic blogging platform with posts and comments"

# Phase 2: Enhancements
/cook "Add rich text editor"
/cook "Add image uploads"

# Phase 3: Advanced Features
/cook "Add search functionality"
```

## Troubleshooting

### Bootstrap Stalls or Fails
```bash
# Restart with more specific description
/build "more detailed description with tech stack preferences"
```

### Generated Code Has Issues
```bash
/fix "describe the issue"
```

## Next Steps

After bootstrapping your project:
1.  **Continuous Development**: Use `/cook` for new features.
2.  **Testing**: Regular `/validate` runs.
3.  **Documentation**: Use `/chronicle`.
4.  **Deployment**: Use `/launch`.

---

**Ready to build?** Start with `/build` and let AI agents handle the heavy lifting. Remember to **review plans carefully** before approval!
