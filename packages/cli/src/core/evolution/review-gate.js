/**
 * ReviewGate - Core Business Logic
 * 
 * Determines if a signal should auto-evolve or require manual review.
 * Pure function based on signal confidence and settings.
 */

export class ReviewGate {
    /**
     * Determine if a signal should auto-evolve or require manual review
     * @param {object} signal - Evolution signal
     * @param {object} settings - { autoUpdating: boolean, confidenceThreshold: number }
     * @returns {{ shouldAuto: boolean, reason: string }}
     */
    static evaluate(signal, settings = {}) {
        const { autoUpdating = false, confidenceThreshold = 0.8 } = settings;

        // If auto-updating is disabled, always require review
        if (!autoUpdating) {
            return {
                shouldAuto: false,
                reason: 'autoUpdatingDisabled'
            };
        }

        // If confidence is below threshold, require review
        if (signal.confidence < confidenceThreshold) {
            return {
                shouldAuto: false,
                reason: 'lowConfidence'
            };
        }

        // High confidence + auto-updating enabled = auto-evolve
        return {
            shouldAuto: true,
            reason: 'highConfidenceAutoApproved'
        };
    }
}
