/**
 * Core - Domain Layer
 * 
 * Pure business logic with ZERO external dependencies.
 * This layer defines the business rules and domain models.
 * 
 * Exported modules:
 * - learning: Lesson management, cognitive enhancements, lesson merging
 * - evolution: Signal detection, threshold checking, review gate
 * - scanning: File scanning, pattern matching, violation tracking
 */

export * from './learning/index.js';
export * from './evolution/index.js';
export * from './scanning/index.js';
