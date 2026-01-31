/**
 * Evolution Module - Core Domain
 * 
 * Business logic for evolution signal detection and management.
 * 
 * Exported:
 * - SignalDetector: Detect evolution opportunities
 * - SignalQueue: Manage signal lifecycle
 * - ThresholdChecker: Check if lesson ready for evolution
 * - ReviewGate: Determine auto vs manual evolution
 */

export { SignalDetector } from './signal-detector.js';
export { SignalQueue } from './signal-queue.js';
export { ThresholdChecker } from './threshold-checker.js';
export { ReviewGate } from './review-gate.js';
export { EvolutionSignal } from './evolution-signal.js';
