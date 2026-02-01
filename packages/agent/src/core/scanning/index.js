/**
 * Scanning Module - Core Domain
 * 
 * Business logic for code scanning and violation detection.
 * 
 * Exported:
 * - FileScanner: Scan files for pattern violations
 * - PatternMatcher: Match patterns against code
 * - ViolationTracker: Track violation statistics
 */

export { FileScanner } from './file-scanner.js';
export { PatternMatcher } from './pattern-matcher.js';
export { ViolationTracker } from './violation-tracker.js';
