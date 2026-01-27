/**
 * ThresholdChecker - Core Business Logic
 * 
 * Determines if a lesson is ready for evolution based on:
 * - Hit count threshold
 * - Cognitive confidence
 * - Pattern stability
 * 
 * Pure function with NO side effects.
 */

export class ThresholdChecker {
    /**
     * Check if a lesson is ready for evolution
     * @param {object} lesson - Cognitive lesson with hitCount, confidence, etc.
     * @param {number} threshold - Hit count threshold from settings
     * @returns {{ ready: boolean, reason?: string, confidence?: number }}
     */
    static check(lesson, threshold = 10) {
        const hitCount = lesson.hitCount || 0;
        const cognitiveConfidence = lesson.cognitive?.confidence || 0.3;

        // Rule 1: Hit count threshold reached
        if (hitCount >= threshold) {
            return {
                ready: true,
                reason: 'hitCountThreshold',
                confidence: Math.min(0.9, 0.7 + (hitCount - threshold) * 0.02)
            };
        }

        // Rule 2: High cognitive confidence even with lower hits
        if (cognitiveConfidence >= 0.85 && hitCount >= threshold * 0.5) {
            return {
                ready: true,
                reason: 'highConfidence',
                confidence: cognitiveConfidence
            };
        }

        // Rule 3: Pattern stability (if we have violation history)
        if (lesson.metadata?.stabilityScore && lesson.metadata.stabilityScore > 0.9) {
            return {
                ready: true,
                reason: 'patternStable',
                confidence: lesson.metadata.stabilityScore
            };
        }

        // Not ready for evolution
        return { ready: false };
    }

    /**
     * Calculate pattern stability from violation history
     * @param {Array} violationHistory - Array of { timestamp, file, line }
     * @returns {number} - Stability score 0.0 to 1.0
     */
    static calculateStability(violationHistory = []) {
        if (violationHistory.length < 3) return 0.0;

        // Check if violations are consistent (same files, similar patterns)
        const uniqueFiles = new Set(violationHistory.map(v => v.file)).size;
        const totalViolations = violationHistory.length;

        // High stability = violations come from same files (not random)
        const fileConsistency = 1 - (uniqueFiles / totalViolations);

        // Time-based stability: violations spread over time (not one-off)
        const timestamps = violationHistory.map(v => v.timestamp).sort();
        const timeSpan = timestamps[timestamps.length - 1] - timestamps[0];
        const daySpan = timeSpan / (1000 * 60 * 60 * 24);

        const timeStability = daySpan > 1 ? Math.min(1.0, daySpan / 7) : 0.2;

        // Combined stability
        return (fileConsistency * 0.6 + timeStability * 0.4);
    }
}
