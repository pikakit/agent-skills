# Agent Skill Kit - New Architecture

> **Status:** 🚧 In Progress - Migrating to FAANG-style layered architecture

## Overview

This directory contains the new **layered architecture** for Agent Skill Kit, following FAANG best practices for maintainability, testability, and scalability.

---

## Architecture Principles

### 1. **Layered Architecture** (Clean Architecture)
```
┌─────────────────────────────────────┐
│       Presentation Layer            │  (CLI, UI)
├─────────────────────────────────────┤
│       Service Layer                 │  (Orchestration)
├─────────────────────────────────────┤
│       Core Domain Layer             │  (Business Logic)
├─────────────────────────────────────┤
│       Data Layer                    │  (Persistence)
├─────────────────────────────────────┤
│       Infrastructure Layer          │  (Config, DI, Logging)
└─────────────────────────────────────┘
```

### 2. **Dependency Rule**
- **Core** has ZERO external dependencies (pure business logic)
- **Data** implements interfaces defined in Core
- **Services** orchestrate Core + Data
- **Presentation** uses Services
- **Infrastructure** provides cross-cutting concerns

### 3. **Single Responsibility Principle**
Each class/module has ONE clear purpose:
- ✅ `EvolutionSignal` - Represents a signal
- ✅ `ThresholdChecker` - Checks evolution readiness
- ✅ `SignalRepository` - Persists signals
- ✅ `SignalDetector` - Orchestrates signal workflow

---

## Folder Structure

```
src/
├── core/                    # Domain Layer (Pure Business Logic)
│   ├── learning/
│   │   ├── lesson-manager.js
│   │   ├── cognitive-enhancer.js
│   │   ├── lesson-merger.js
│   │   └── index.js
│   ├── evolution/           [✅ COMPLETE]
│   │   ├── evolution-signal.js
│   │   ├── threshold-checker.js
│   │   ├── review-gate.js
│   │   ├── signal-detector.js
│   │   └── index.js
│   ├── scanning/
│   │   ├── file-scanner.js
│   │   ├── pattern-matcher.js
│   │   ├── violation-tracker.js
│   │   └── index.js
│   └── index.js
│
├── services/                # Application Services (Orchestration)
│   ├── auto-learning-service.js
│   ├── stats-service.js
│   ├── backup-service.js
│   ├── export-service.js
│   └── index.js
│
├── data/                    # Data Access Layer
│   ├── repositories/        [✅ COMPLETE]
│   │   ├── signal-repository.js
│   │   ├── lesson-repository.js
│   │   ├── settings-repository.js
│   │   └── index.js
│   ├── storage/             [✅ COMPLETE]
│   │   ├── json-storage.js
│   │   ├── yaml-storage.js
│   │   ├── file-storage.js
│   │   └── index.js
│   └── index.js
│
├── presentation/            # Presentation Layer (UI/CLI)
│   └── cli/
│       ├── commands/
│       ├── menus/
│       └── views/
│
├── infrastructure/          # Cross-cutting Concerns
│   ├── config/
│   ├── di/                  # Dependency Injection
│   └── logging/
│
└── shared/                  # Shared Utilities
    ├── utils/
    └── types/
```

---

## Migration Status

### ✅ Completed Modules

#### Evolution Module (100%)
- [x] `EvolutionSignal` - Domain model
- [x] `ThresholdChecker` - Business rules
- [x] `ReviewGate` - Decision logic
- [x] `SignalRepository` - Data access
- [x] `JsonStorage` - Storage adapter
- [x] `SignalDetector` - Service orchestration

**Files:** 7 new files, avg 70 lines each
**Test Status:** ✅ Passing

### 🚧 In Progress

#### Learning Module (0%)
- [ ] `LessonManager`
- [ ] `CognitiveEnhancer`
- [ ] `LessonMerger`
- [ ] `LessonRepository`

#### Scanning Module (0%)
- [ ] `FileScanner`
- [ ] `PatternMatcher`
- [ ] `ViolationTracker`

---

## How to Use New Architecture

### Example: Using SignalDetector

```javascript
// 1. Import components
import { SignalDetector } from './src/core/evolution/signal-detector.js';
import { SignalRepository } from './src/data/repositories/signal-repository.js';
import { JsonStorage } from './src/data/storage/json-storage.js';
import { KNOWLEDGE_DIR } from './lib/config.js';

// 2. Create instances (Dependency Injection)
const storage = new JsonStorage(KNOWLEDGE_DIR);
const repository = new SignalRepository(storage);
const detector = new SignalDetector(repository, { updateThreshold: 10 });

// 3. Use async API
const stats = await detector.getStats();
console.log(`Pending: ${stats.pending}`);

const pending = await detector.getPending();
pending.forEach(signal => {
    console.log(`${signal.lessonId}: ${signal.reason}`);
});

// 4. Approve signals
await detector.approve(signalId);
```

### Testing with Mocks

```javascript
import { SignalDetector } from './src/core/evolution/signal-detector.js';

// Create mock repository
const mockRepo = {
    findAll: async () => [mockSignal1, mockSignal2],
    findPending: async () => [mockSignal1],
    save: async (signal) => signal
};

// Inject mock
const detector = new SignalDetector(mockRepo);

// Test easily!
const pending = await detector.getPending();
expect(pending).toHaveLength(1);
```

---

## Benefits of New Architecture

### Before (Flat Structure)
```javascript
// lib/evolution-signal.js (343 lines)
export class EvolutionSignal { ... }
export class SignalQueue { 
    constructor() {
        this.signals = [];
        this.signalFilePath = path.join(...);  // ❌ Tight coupling
    }
    
    load() {
        fs.readFileSync(...);  // ❌ Direct filesystem access
    }
}
```

**Problems:**
- ❌ SignalQueue mixes business logic + persistence
- ❌ Hard to test (can't mock filesystem)
- ❌ Tight coupling
- ❌ Violates Single Responsibility

### After (Layered Architecture)
```javascript
// Domain Model (core/evolution/evolution-signal.js)
export class EvolutionSignal {
    approve() { this.status = 'approved'; }  // ✅ Pure business logic
}

// Repository (data/repositories/signal-repository.js)
export class SignalRepository {
    constructor(storage) {
        this.storage = storage;  // ✅ Dependency injection
    }
    
    async findAll() {
        return this.storage.read('signals');  // ✅ Uses abstraction
    }
}

// Storage Adapter (data/storage/json-storage.js)
export class JsonStorage {
    async read(key) {
        return JSON.parse(fs.readFileSync(...));  // ✅ Isolated I/O
    }
}

// Service (core/evolution/signal-detector.js)
export class SignalDetector {
    constructor(repository) {
        this.repository = repository;  // ✅ Dependency injection
    }
    
    async approve(id) {
        const signal = await this.repository.findById(id);
        signal.approve();  // ✅ Uses domain model
        await this.repository.save(signal);
    }
}
```

**Benefits:**
- ✅ Single Responsibility (each class has ONE job)
- ✅ Easy to test (inject mocks)
- ✅ Loose coupling (swap storage without touching logic)
- ✅ Clear ownership (know where each responsibility lives)

---

## Design Patterns Used

### 1. Repository Pattern
**Purpose:** Separate data access from business logic

**Implementation:**
- `SignalRepository` for evolution signals
- `LessonRepository` for lessons
- All repositories use storage abstraction

### 2. Dependency Injection
**Purpose:** Enable testability and flexibility

**Implementation:**
```javascript
class SignalDetector {
    constructor(signalRepository, settings) {
        this.signalRepository = signalRepository;  // Injected!
        this.settings = settings;
    }
}
```

### 3. Strategy Pattern (Storage)
**Purpose:** Swap storage implementations

**Implementation:**
- `JsonStorage` for JSON files
- `YamlStorage` for YAML files  
- All implement same interface (`read`, `write`, `delete`)

---

## Testing Strategy

### Unit Tests (Core Layer)
```javascript
// Test pure business logic
describe('ThresholdChecker', () => {
    it('should detect hitCountThreshold', () => {
        const lesson = { hitCount: 10 };
        const result = ThresholdChecker.check(lesson, 10);
        
        expect(result.ready).toBe(true);
        expect(result.reason).toBe('hitCountThreshold');
    });
});
```

### Integration Tests (Service Layer)
```javascript
// Test with real repository + mock storage
describe('SignalDetector', () => {
    it('should queue signal when threshold reached', async () => {
        const mockStorage = {
            read: async () => ({ signals: [] }),
            write: async () => {}
        };
        
        const repository = new SignalRepository(mockStorage);
        const detector = new SignalDetector(repository);
        
        const result = await detector.queue('LESSON-1', {
            ready: true,
            reason: 'hitCountThreshold',
            confidence: 0.9
        });
        
        expect(result.lessonId).toBe('LESSON-1');
    });
});
```

---

## Migration Guide

See [MIGRATION.md](./MIGRATION.md) for detailed migration instructions.

**Quick Start:**
1. New code → Use new architecture
2. Existing code → Gradually migrate
3. Backward compatibility maintained in `lib/` folder

---

## Next Steps

1. **Complete Learning Module** - Extract from `cognitive-lesson.js`, `learn.js`
2. **Complete Scanning Module** - Extract from `recall.js`
3. **Create DI Container** - Centralize dependency management
4. **Migrate UI Layer** - Extract to `presentation/cli/`
5. **Full Test Coverage** - Unit + integration tests

---

## Contributing

When adding new features:
1. **Core logic** → `src/core/`
2. **Data access** → `src/data/repositories/`
3. **Orchestration** → `src/services/`
4. **UI** → `src/presentation/`

**Remember:** Core layer has ZERO dependencies!

---

## Questions?

See [ARCHITECTURE.md](../../../.gemini/antigravity/brain/.../architecture_refactoring_plan.md) for full architecture details.
