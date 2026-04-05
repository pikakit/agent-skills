# Import Patterns

> Subskill of `auto-learned` - Contains import-related patterns

---

## 📋 Learned Patterns

### 1. Missing Variable Import

**Pattern:** `Cannot find name '<identifier>'`

**Context:**
- Source: TypeScript compiler (ts)
- Common in: `.ts`, `.tsx` files
- Occurrences: 2+

**Solution:**
```typescript
// Add import for the missing symbol
import { <identifier> } from '<module>';
```

---

### 2. Missing ReactNode Import

**Pattern:** `Cannot find name 'ReactNode'`

**Context:**
- Framework: React
- Source: TypeScript compiler

**Solution:**
```typescript
import { ReactNode } from 'react';
// or
import type { ReactNode } from 'react';
```

---

### 3. Missing JSX Element Import

**Pattern:** `Cannot find name 'div'` (or other HTML elements in JSX context)

**Context:**
- Framework: React
- Issue: JSX not configured or missing React import

**Solution:**
```typescript
// Ensure tsconfig.json has jsx: "react-jsx"
// Or add React import for older configs:
import React from 'react';
```

---

### 4. Missing Component Import

**Pattern:** `Cannot find name '<ComponentName>'`

**Context:**
- Custom components not imported
- Source: TypeScript compiler

**Solution:**
```typescript
import { <ComponentName> } from './<component-path>';
```

---

## Quick Fixes

| Error | Fix |
|-------|-----|
| `Cannot find name 'X'` | Add import for X |
| `Cannot find name 'ReactNode'` | `import { ReactNode } from 'react'` |
| `Cannot find namespace 'JSX'` | `import type { JSX } from 'react'` |
| `Module not found` | Check path or install package |

---

## Statistics

- **Patterns:** 4
- **Category:** import
- **Last Updated:** 2026-02-03
| IMPO-001 | '<identifier>' expressions are only allowed within async fun | See error message for details | ts | mjs file, line 185 | 2026-03-05 |

---

⚡ PikaKit v3.9.116
