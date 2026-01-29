---
name: doc-generator
description: >-
  README generation, CONTRIBUTING guide, JSDoc/TSDoc code comments, runbook templates.
  Triggers on: document, README, docs, documentation.
  Coordinates with: api-doc-builder, architecture-diagrammer.
allowed-tools: Read, Write, Glob
metadata:
  category: "documentation"
  success_metrics: "README generated, CONTRIBUTING created, code commented"
  coordinates_with: "api-doc-builder, architecture-diagrammer"
---

# Documentation Generator

> Auto-generate README, CONTRIBUTING, and code documentation

## 🎯 Purpose

Generate comprehensive, always-up-to-date documentation including README with quickstart, CONTRIBUTING guide, JSDoc/TSDoc comments, and operational runbooks.

---

## 1. README.md Generation

### Structure

```markdown
# {Project Name}

> {One-line description}

## 🚀 Quick Start

\`\`\`bash
npm install
cp .env.example .env
npm run dev
\`\`\`

## 📚 Documentation

- [API Docs](./docs/api.md)
- [Architecture](./docs/architecture.md)

## 🏗️ Tech Stack

- Frontend: Next.js, TypeScript
- Backend: tRPC, Prisma
- Database: PostgreSQL

## 📦 Project Structure

\`\`\`
src/
├── app/
├── components/
└── lib/
\`\`\`

## 🧪 Testing

\`\`\`bash
npm test
npm run test:e2e
\`\`\`
```

---

## 2. Contributing Guide

### CONTRIBUTING.md Template

```markdown
# Contributing Guide

## Development Setup

1. Fork the repository
2. Clone: \`git clone ...\`
3. Install: \`npm install\`
4. Branch: \`git checkout -b feature/my-feature\`

## Code Standards

- TypeScript required
- Run \`npm run lint\` before commit
- Add tests for new features
- Use conventional commits

## Pull Request Process

1. Update README if needed
2. Run tests: \`npm test\`
3. Push to fork
4. Create PR to \`main\`

## Code Review

- Requires 1 approval
- CI must pass
- Squash merge preferred
```

---

## 3. Code Comments (JSDoc/TSDoc)

### Function Documentation

````typescript
/**
 * Fetches user by ID with caching
 *
 * @param userId - Unique user identifier
 * @param options - Fetch options
 * @returns User object or null
 *
 * @example
 * ```typescript
 * const user = await getUser('user-123');
 * ```
 *
 * @throws {DatabaseError} If connection fails
 */
export async function getUser(userId: string, options: { skipCache?: boolean } = {}): Promise<User | null> {
  // Implementation
}
````

---

## 4. Runbook Templates

### Incident Response Runbook

```markdown
# Runbook: High Error Rate

## Symptoms

- Error rate \u003e 1%
- 500 errors in logs

## Investigation Steps

1. Check logs: \`tail -f /var/log/app.log\`
2. Check database connections
3. Check external service status

## Resolution

1. Restart application: \`pm2 restart app\`
2. Scale horizontally if needed
3. Roll back if issue persists

## Prevention

- Add alerts for error rate
- Implement circuit breakers
```

---

## 5. Auto-Generation Rules

### What to Document

| Element            | Auto-document? | Why                   |
| ------------------ | -------------- | --------------------- |
| Public functions   | ✅ Yes         | Part of API           |
| Internal helpers   | ❌ No          | Self-documenting code |
| Complex algorithms | ✅ Yes         | Needs explanation     |
| Types/interfaces   | ✅ Yes         | Schema reference      |

---

> **Key Takeaway:** Good documentation reduces onboarding time from days to hours. Auto-generate to keep it current.
