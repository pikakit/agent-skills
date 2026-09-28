---
title: Node.js Runtime and Modules
kind: reference
impact: high
tags: [nodejs, esm, commonjs]
applies_to: [nodejs]
last_reviewed: "2026-09-28"
sources:
  - title: Node.js ECMAScript Modules
    url: https://nodejs.org/api/esm.html
  - title: Node.js TypeScript Support
    url: https://nodejs.org/api/typescript.html
---

# Runtime & Module System

> Use ESM for new projects. Use `node:` prefixes. Match TypeScript execution to the supported Node release.

## Scope

Apply to supported Node versions, package module type, ESM/CommonJS interop, built-in imports, and native TypeScript constraints.

## Guidance

---

## Runtime Selection

| Runtime | Best For | TypeScript | Package Manager |
|---------|----------|-----------|----------------|
| **Node.js** | General purpose, largest ecosystem | Built-in type stripping where supported, or a project toolchain | npm/pnpm/yarn |
| **Bun** | Performance, scripts, built-in bundler | Native | bun |
| **Deno** | Security-first, built-in TypeScript | Native | deno/npm |

**Default recommendation:** Use an actively supported Node LTS that satisfies the package engine, dependencies, and deployment platform. Keep the CI version matrix aligned with production.

---

## Module System Decision

| Factor | ESM (`import/export`) | CJS (`require/module.exports`) |
|--------|----------------------|-------------------------------|
| **Standard** | Modern (ECMAScript) | Legacy (Node.js original) |
| **Tree-shaking** | ✅ Yes | ❌ No |
| **Top-level await** | ✅ Yes | ❌ No |
| **New projects** | ✅ Use this | ❌ Avoid |
| **Existing codebases** | Migrate gradually | Keep if migration cost high |

### ESM Setup

```json
// package.json
{
  "type": "module"
}
```

```json
// tsconfig.json
{
  "compilerOptions": {
    "module": "NodeNext",
    "moduleResolution": "NodeNext",
    "target": "ES2022",
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  }
}
```

---

## Native TypeScript

```bash
# Run erasable TypeScript directly on a supporting Node release
node src/app.ts

# With type-checking (slower, for CI)
npx tsx src/app.ts
```

Verify the exact syntax and version constraints in the Node.js TypeScript documentation. Built-in type stripping does not type-check code and does not transform every TypeScript feature.

**When to use native TS:**
- Scripts and CLIs
- Simple APIs
- Development

**When to use a build step:**
- Production (compiled JS is faster to start)
- Complex projects with path aliases
- When you need decorators (NestJS)

---

## `node:` Prefix (Always Use)

```typescript
// ❌ Ambiguous — is this npm package or built-in?
import { readFile } from 'fs/promises'
import { join } from 'path'

// ✅ Clear — this is a Node.js built-in
import { readFile } from 'node:fs/promises'
import { join } from 'node:path'
import { Worker } from 'node:worker_threads'
import { createServer } from 'node:http'
```

**Why?** Prevents name conflicts with npm packages. Makes imports instantly recognizable.

---

## Interop Gotchas

### Importing CJS from ESM

```typescript
// ✅ Default imports usually work
import express from 'express' // CJS library

// ⚠️ Named imports may fail
import { Router } from 'express' // May error in some setups

// ✅ Safe alternative
import express from 'express'
const { Router } = express
```

### `__dirname` / `__filename` in ESM

```typescript
// ❌ Not available in ESM
console.log(__dirname) // ReferenceError

// ✅ ESM equivalent
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __filename = fileURLToPath(import.meta.url)
const __dirname = dirname(__filename)

// Or use import.meta directly (Node.js 21+)
const configPath = new URL('./config.json', import.meta.url)
```

### `require()` in ESM

```typescript
// ❌ Not available in ESM
const pkg = require('./package.json')

// ✅ Use createRequire or import assertion
import { createRequire } from 'node:module'
const require = createRequire(import.meta.url)
const pkg = require('./package.json')

// ✅ Or import with assertion (Node.js 22+)
import pkg from './package.json' with { type: 'json' }
```

---

## Anti-Patterns

| ❌ Don't | ✅ Do |
|---------|-------|
| Start new projects with CJS | Use ESM (`"type": "module"`) |
| Import built-ins without `node:` | Always `import from 'node:fs'` |
| Mix ESM and CJS in same package | Pick one, migrate fully |
| Use `__dirname` in ESM | Use `import.meta.url` |
| Skip tsconfig `"strict": true` | Always enable strict mode |

---

## Verification

Test clean install, typecheck, package exports, direct execution, tests, and built output on every supported Node version. Verify ESM/CommonJS interop from an actual consumer package and keep a rollback-compatible build artifact.

## Related

| File | When to Read |
|------|-------------|
| [framework-selection.md](framework-selection.md) | Framework TypeScript support |
| [async-patterns.md](async-patterns.md) | node: built-in async APIs |
| [testing-strategy.md](testing-strategy.md) | node:test built-in runner |

---

⚡ PikaKit v3.9.224
