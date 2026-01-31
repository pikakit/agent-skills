# Migration Guide - Old → New Architecture

This guide helps you migrate code from the old flat structure to the new layered architecture.

---

## Quick Reference

| Old Location | New Location | Layer |
|--------------|--------------|-------|
| `lib/evolution-signal.js` | `src/core/evolution/*` | Core + Data |
| `lib/cognitive-lesson.js` | `src/core/learning/*` | Core |
| `lib/recall.js` | `src/core/scanning/*` | Core |
| `lib/settings.js` | `src/data/repositories/settings-repository.js` | Data |
| `lib/ui/` | `src/presentation/cli/` | Presentation |

---

## Migration Patterns

### Pattern 1: Evolution Signals

#### Old Code
```javascript
// lib/some-file.js
import { signalQueue, checkEvolutionThreshold } from './evolution-signal.js';

function doSomething(lesson) {
    const check = checkEvolutionThreshold(lesson, 10);
    if (check.ready) {
        signalQueue.add(new EvolutionSignal(...));
    }
}
```

#### New Code
```javascript
// src/services/some-service.js
import { SignalDetector } from '../core/evolution/signal-detector.js';
import { ThresholdChecker } from '../core/evolution/threshold-checker.js';

export class SomeService {
    constructor(signalDetector) {
        this.signalDetector = signalDetector;
    }
    
    async doSomething(lesson) {
        const check = ThresholdChecker.check(lesson, 10);
        if (check.ready) {
            await this.signalDetector.queue(lesson.id, check, metadata);
        }
    }
}
```

**Key Changes:**
- ✅ Use dependency injection
- ✅ Use async/await
- ✅ Static methods for pure functions

---

### Pattern 2: Direct File Access

#### Old Code
```javascript
// lib/some-file.js
import fs from 'fs';
import path from 'path';

function saveData(data) {
    const filePath = path.join(KNOWLEDGE_DIR, 'data.json');
    fs.writeFileSync(filePath, JSON.stringify(data));
}
```

#### New Code
```javascript
// src/data/repositories/some-repository.js
export class SomeRepository {
    constructor(storage) {
        this.storage = storage;
    }
    
    async save(data) {
        await this.storage.write('data', data);
    }
}

// Usage
const storage = new JsonStorage(KNOWLEDGE_DIR);
const repository = new SomeRepository(storage);
await repository.save(data);
```

**Key Changes:**
- ✅ Use repository pattern
- ✅ Abstract storage layer
- ✅ Testable with mock storage

---

### Pattern 3: Mixed Business Logic + Data

#### Old Code
```javascript
// lib/some-file.js
export class SomeManager {
    constructor() {
        this.dataPath = path.join(...);
    }
    
    processItem(item) {
        // Business logic
        if (item.count > 10) {
            item.status = 'ready';
        }
        
        // Persistence
        fs.writeFileSync(this.dataPath, JSON.stringify(item));
    }
}
```

#### New Code
```javascript
// Core - Pure business logic
// src/core/some-domain/item-manager.js
export class ItemManager {
    processItem(item) {
        if (item.count > 10) {
            item.status = 'ready';
        }
        return item;
    }
}

// Data - Persistence
// src/data/repositories/item-repository.js
export class ItemRepository {
    constructor(storage) {
        this.storage = storage;
    }
    
    async save(item) {
        await this.storage.write('items', item);
    }
}

// Service - Orchestration
// src/services/item-service.js
export class ItemService {
    constructor(itemManager, itemRepository) {
        this.itemManager = itemManager;
        this.itemRepository = itemRepository;
    }
    
    async processAndSave(item) {
        const processed = this.itemManager.processItem(item);
        await this.itemRepository.save(processed);
        return processed;
    }
}
```

**Key Changes:**
- ✅ Separate business logic (Core)
- ✅ Separate persistence (Data)
- ✅ Coordinate with service (Service)

---

## Step-by-Step Migration

### Step 1: Identify Layer
Ask: "What is this code's primary responsibility?"
- **Business rule?** → `src/core/`
- **Data access?** → `src/data/`
- **Orchestration?** → `src/services/`
- **UI?** → `src/presentation/`

### Step 2: Extract Domain Models
Move pure data structures to Core:
```javascript
// Before: mixed with other code
class Lesson { ... }

// After: src/core/learning/lesson.js
export class Lesson {
    constructor(id, pattern, message) {
        this.id = id;
        this.pattern = pattern;
        this.message = message;
    }
    
    // Business logic methods only
    isValid() {
        return this.pattern && this.message;
    }
}
```

### Step 3: Extract Repositories
Move data access to Data layer:
```javascript
// src/data/repositories/lesson-repository.js
export class LessonRepository {
    constructor(storage) {
        this.storage = storage;
    }
    
    async findAll() {
        const data = await this.storage.read('lessons');
        return data.lessons || [];
    }
    
    async save(lesson) {
        const all = await this.findAll();
        const updated = [...all.filter(l => l.id !== lesson.id), lesson];
        await this.storage.write('lessons', { lessons: updated });
    }
}
```

### Step 4: Create Services
Orchestrate Core + Data:
```javascript
// src/services/lesson-service.js
export class LessonService {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;
    }
    
    async getAllLessons() {
        return this.lessonRepository.findAll();
    }
    
    async addLesson(lesson) {
        if (!lesson.isValid()) {
            throw new Error('Invalid lesson');
        }
        return this.lessonRepository.save(lesson);
    }
}
```

### Step 5: Update Imports
```javascript
// Old
import { loadKnowledge } from './recall.js';

// New
import { LessonRepository } from './src/data/repositories/lesson-repository.js';
import { JsonStorage } from './src/data/storage/json-storage.js';
```

---

## Common Pitfalls

### ❌ Pitfall 1: Core depends on Data
```javascript
// WRONG - Core importing from Data
// src/core/learning/lesson-manager.js
import { LessonRepository } from '../../data/repositories/lesson-repository.js';
```

**Fix:** Use dependency injection
```javascript
// CORRECT
export class LessonManager {
    constructor(lessonRepository) {
        this.lessonRepository = lessonRepository;  // Injected!
    }
}
```

### ❌ Pitfall 2: Sync when should be Async
```javascript
// WRONG - Repository should be async
findAll() {
    return JSON.parse(fs.readFileSync(...));
}
```

**Fix:** Make async
```javascript
// CORRECT
async findAll() {
    const content = await this.storage.read('lessons');
    return content.lessons;
}
```

### ❌ Pitfall 3: God Class
```javascript
// WRONG - One class does everything
export class LessonManager {
    validate(lesson) { ... }         // Validation
    transform(lesson) { ... }        // Business logic
    save(lesson) { ... }             // Persistence
    display(lesson) { ... }          // Presentation
}
```

**Fix:** Split responsibilities
```javascript
// CORRECT
class LessonValidator {          // Core - Validation
    validate(lesson) { ... }
}

class LessonTransformer {        // Core - Business logic
    transform(lesson) { ... }
}

class LessonRepository {         // Data - Persistence
    save(lesson) { ... }
}

class LessonView {               // Presentation - UI
    display(lesson) { ... }
}
```

---

## Testing After Migration

### Before
```javascript
// Hard to test - filesystem access
function saveLesson(lesson) {
    fs.writeFileSync('/path/to/lessons.json', ...);
}

// Test requires actual filesystem
test('saves lesson', () => {
    saveLesson(mockLesson);
    const saved = fs.readFileSync('/path/to/lessons.json');
    // ...
});
```

### After
```javascript
// Easy to test - dependency injection
class LessonRepository {
    constructor(storage) {
        this.storage = storage;
    }
    
    async save(lesson) {
        await this.storage.write('lessons', lesson);
    }
}

// Test with mock storage
test('saves lesson', async () => {
    const mockStorage = {
        write: jest.fn()
    };
    
    const repository = new LessonRepository(mockStorage);
    await repository.save(mockLesson);
    
    expect(mockStorage.write).toHaveBeenCalledWith('lessons', mockLesson);
});
```

---

## Gradual Migration Strategy

### Week 1-2: New Features Only
- All new code uses new architecture
- Existing code unchanged

### Week 3-4: Extract One Module
- Pick smallest module (e.g., Evolution)
- Extract to new architecture
- Add backward compatibility layer
- Test thoroughly

### Week 5-6: Extract Next Module
- Apply lessons learned
- Repeat pattern

### Week 7+: Continue Until Complete
- One module at a time
- Always maintain backward compatibility
- Test after each extraction

---

## Checklist

Before marking migration complete:

- [ ] Business logic moved to `src/core/`
- [ ] Data access moved to `src/data/repositories/`
- [ ] Storage abstracted to `src/data/storage/`
- [ ] Services created in `src/services/`
- [ ] All classes use dependency injection
- [ ] All file I/O is async
- [ ] Unit tests added
- [ ] Integration tests added
- [ ] Backward compatibility layer exists (if needed)
- [ ] Documentation updated

---

## Need Help?

See examples in:
- `src/core/evolution/` - Complete example
- `src/data/repositories/signal-repository.js` - Repository pattern
- `src/data/storage/json-storage.js` - Storage adapter
