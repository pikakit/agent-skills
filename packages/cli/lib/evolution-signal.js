/**
 * Evolution Signal Layer - Backward Compatibility Adapter
 * 
 * This file maintains the old API while delegating to the new architecture.
 * Allows gradual migration without breaking existing code.
 * 
 * OLD LOCATION: lib/evolution-signal.js
 * NEW LOCATION: src/core/evolution/* + src/data/repositories/*
 * 
 * @deprecated Use new architecture: import from 'src/core/evolution'
 */

// Import new architecture components
import { EvolutionSignal } from '../src/core/evolution/evolution-signal.js';
import { ThresholdChecker } from '../src/core/evolution/threshold-checker.js';
import { ReviewGate } from '../src/core/evolution/review-gate.js';
import { SignalRepository } from '../src/data/repositories/signal-repository.js';
import { JsonStorage } from '../src/data/storage/json-storage.js';
import { SignalDetector as SignalService } from '../src/core/evolution/signal-detector.js';
import { KNOWLEDGE_DIR } from './config.js';

// ============================================================================
// BACKWARD COMPATIBLE EXPORTS
// ============================================================================

// Re-export EvolutionSignal class
export { EvolutionSignal };

// Lazy-initialized singleton instances
let _storage = null;
let _repository = null;
let _detector = null;

function getDetector() {
    if (!_detector) {
        _storage = new JsonStorage(KNOWLEDGE_DIR);
        _repository = new SignalRepository(_storage);
        _detector = new SignalService(_repository);
    }
    return _detector;
}

// ============================================================================
// THRESHOLD CHECKER (Backward Compatible)
// ============================================================================

/**
 * @deprecated Use ThresholdChecker.check() from src/core/evolution
 */
export function checkEvolutionThreshold(lesson, threshold = 10) {
    return ThresholdChecker.check(lesson, threshold);
}

/**
 * @deprecated Use ThresholdChecker.calculateStability() from src/core/evolution
 */
export function calculatePatternStability(violationHistory = []) {
    return ThresholdChecker.calculateStability(violationHistory);
}

// ============================================================================
// SIGNAL QUEUE (Backward Compatible)
// ============================================================================

/**
 * SignalQueue - Backward compatible class
 * @deprecated Use SignalRepository + SignalDetector from new architecture
 */
class SignalQueueCompat {
    get signals() {
        // Return cached signals (sync access)
        if (!this._cachedSignals) {
            // Synchronous fallback - load on first access
            this._cachedSignals = [];
            this.load().then(signals => {
                this._cachedSignals = signals;
            });
        }
        return this._cachedSignals;
    }

    async load() {
        const detector = getDetector();
        const all = await detector.signalRepository.findAll();
        this._cachedSignals = all;
        return all;
    }

    async save() {
        // Auto-save through repository (no-op for compatibility)
        return;
    }

    async add(signal) {
        const detector = getDetector();
        const result = await detector.queue(
            signal.lessonId,
            { ready: true, reason: signal.reason, confidence: signal.confidence },
            signal.metadata
        );
        await this.load(); // Refresh cache
        return result;
    }

    getPending() {
        return this.signals.filter(s => s.status === 'pending');
    }

    getByLesson(lessonId) {
        return this.signals.filter(s => s.lessonId === lessonId);
    }

    async approve(signalId) {
        const detector = getDetector();
        const result = await detector.approve(signalId);
        await this.load(); // Refresh cache
        return result;
    }

    async reject(signalId) {
        const detector = getDetector();
        const result = await detector.reject(signalId);
        await this.load(); // Refresh cache
        return result;
    }

    async execute(signalId) {
        const detector = getDetector();
        const result = await detector.execute(signalId);
        await this.load(); // Refresh cache
        return result;
    }

    async cleanup() {
        const detector = getDetector();
        await detector.signalRepository.cleanup();
        await this.load(); // Refresh cache
    }
}

// Singleton instance for backward compatibility
const signalQueueInstance = new SignalQueueCompat();

// Initialize on module load
signalQueueInstance.load().catch(err => {
    console.error('Failed to initialize signal queue:', err);
});

export { signalQueueInstance as signalQueue };

// ============================================================================
// REVIEW GATE (Backward Compatible)
// ============================================================================

/**
 * @deprecated Use ReviewGate.evaluate() from src/core/evolution
 */
export function reviewGate(signal, settings = {}) {
    return ReviewGate.evaluate(signal, settings);
}

// ============================================================================
// HELPER FUNCTIONS (Backward Compatible)
// ============================================================================

/**
 * @deprecated Use SignalDetector.queue() from new architecture
 */
export async function queueEvolutionSignal(lessonId, checkResult, metadata = {}) {
    if (!checkResult.ready) return null;

    const signal = new EvolutionSignal(
        lessonId,
        checkResult.reason,
        checkResult.confidence,
        metadata
    );

    return signalQueueInstance.add(signal);
}

/**
 * @deprecated Use SignalDetector.getStats() from new architecture
 */
export async function getEvolutionStats() {
    const detector = getDetector();
    return detector.getStats();
}

// ============================================================================
// MIGRATION GUIDE
// ============================================================================

/**
 * HOW TO MIGRATE TO NEW ARCHITECTURE:
 * 
 * OLD CODE:
 * ```
 * import { signalQueue, checkEvolutionThreshold } from './evolution-signal.js';
 * 
 * const check = checkEvolutionThreshold(lesson, 10);
 * await signalQueue.add(signal);
 * ```
 * 
 * NEW CODE:
 * ```
 * import { ThresholdChecker } from '../src/core/evolution/threshold-checker.js';
 * import { SignalRepository } from '../src/data/repositories/signal-repository.js';
 * import { SignalDetector } from '../src/core/evolution/signal-detector.js';
 * 
 * const check = ThresholdChecker.check(lesson, 10);
 * const detector = new SignalDetector(repository);
 * await detector.queue(lessonId, check, metadata);
 * ```
 */
