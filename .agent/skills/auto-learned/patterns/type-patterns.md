# Type Patterns

> Subskill of `auto-learned` - Contains type-related patterns

---

## 📋 Learned Patterns

### 1. Property Does Not Exist

**Pattern:** `Property '<name>' does not exist on type '<type>'`

**Context:**
- Source: TypeScript compiler (ts)
- Occurrences: 2+

**Solutions:**

```typescript
// Option 1: Add property to type definition
interface MyType {
  existingProp: string;
  newProp: number;  // Add missing property
}

// Option 2: Use type assertion (if sure it exists)
(obj as any).propertyName

// Option 3: Use optional chaining
obj?.propertyName
```

---

### 2. Type Mismatch (String to Number)

**Pattern:** `Type 'string' is not assignable to type 'number'`

**Context:**
- Source: TypeScript compiler
- Common in: Variable assignments, function arguments

**Solutions:**

```typescript
// Option 1: Convert string to number
const num = parseInt(stringValue, 10);
// or
const num = Number(stringValue);
// or
const num = +stringValue;

// Option 2: Update type definition
let value: string | number = "123";
```

---

### 3. Wrong Argument Type

**Pattern:** `Argument of type '<type1>' is not assignable to parameter of type '<type2>'`

**Context:**
- Source: TypeScript compiler
- Common in: Function calls

**Solutions:**

```typescript
// Option 1: Check function signature
function myFunc(param: string) { ... }
myFunc(value.toString());  // Convert if needed

// Option 2: Use type assertion
myFunc(value as string);

// Option 3: Make parameter accept multiple types
function myFunc(param: string | number) { ... }
```

---

## Quick Fixes

| Error | Fix |
|-------|-----|
| `Property 'X' does not exist` | Add X to type or use optional chaining |
| `Type 'string' not assignable to 'number'` | Use `parseInt()` or `Number()` |
| `Type 'number' not assignable to 'string'` | Use `.toString()` or template literal |
| `Wrong argument type` | Check function signature, convert type |

---

## Statistics

- **Patterns:** 3
- **Category:** type
- **Last Updated:** 2026-02-03
