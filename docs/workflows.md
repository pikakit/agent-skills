---
title: Workflows
description: Task-oriented guides for common development scenarios with PikaKit
section: workflows
category: overview
---

# Workflows

Task-oriented guides for common development scenarios using **PikaKit**'s slash commands and agents.

## Popular Workflows

### Feature Development
[**Feature Development Guide**](./guides/feature-development.md) - Complete feature lifecycle from planning to deployment.
```bash
/plan "add user authentication with OAuth"
/cook "Implement user authentication with OAuth as planned"
/validate
```

### Bug Fixing
[**Debugging & Fixing Guide**](./guides/debugging-workflow.md) - Systematic approach to debugging and fixing issues.
```bash
/diagnose "Login button not working, please investigate"
/fix "Implement the fix based on diagnosis"
/validate
```

### Documentation
[**Documentation Workflow**](./guides/documentation-workflow.md) - Keep docs in sync with code changes.
```bash
/chronicle
```

## Quick Workflows

### Setup New Project
```bash
npx pikakit
/plan "set up project structure"
/build "scaffold the project based on plan"
```

### Add New Feature
```bash
/plan "add [feature description]"
/cook "Implement [feature description] as planned"
/validate
```

### Code Review
```bash
/inspect
/fix "Implement suggested improvements"
```

### Deploy to Production
```bash
/launch
```

## By Use Case

### Frontend Development
- **UI/UX Design**: `/studio` for design system and mockups.
- **Component Development**: `/plan → /cook → /validate`.

### Backend Development
- **API Development**: `/plan → /cook → /validate`.
- **Database Changes**: `/plan "add user table" → /cook`.
- **Performance**: `/diagnose` issue then `/fix`.

### Full Stack
- **Complete Features**: See [Feature Development](./guides/feature-development.md).
- **Authentication**: See [Implementing Authentication](./guides/implementing-authentication.md).
- **Payments**: See [Integrating Payments](./guides/integrating-payments.md).

### DevOps & Infrastructure
- **Docker Setup**: `/cook "add Docker configuration"`.
- **CI/CD**: `/fix` for CI issues.
- **Deployment**: `/launch`.

## Advanced Workflows

### Multi-agent Collaboration
```bash
/autopilot "complex feature with multiple components"
# Spawns: planner → researcher → frontend dev → backend dev → tester
```

### Code Quality
```bash
/inspect   # Security-First Code Review
/validate  # Comprehensive Testing
```

### Integration Workflows
```bash
/cook "integrate Polar billing"
/cook "integrate Stripe payments"
/cook "integrate SePay payment gateway"
```

## Getting Started

New to PikaKit? Start with:
1.  [Developer Guides](./guides/README.md) - All available guides.
2.  [Feature Development](./guides/feature-development.md) - Complete workflow example.
3.  [Building a REST API](./guides/building-rest-api.md) - API development.

## Reference

- [Available Workflows](../.agent/workflows/) - All slash commands.
- [Skills Library](../.agent/skills/) - Built-in knowledge modules.

---

**Key Takeaway**: PikaKit workflows combine slash commands with intelligent agents to accelerate every stage of development.
