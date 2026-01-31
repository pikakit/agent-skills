/**
 * EvolutionSignal - Domain Model
 * 
 * Represents a detected evolution opportunity.
 * Pure domain object with NO external dependencies.
 */

export class EvolutionSignal {
    constructor(lessonId, reason, confidence, metadata = {}) {
        this.id = `signal_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
        this.lessonId = lessonId;
        this.reason = reason; // 'hitCountThreshold', 'patternStable', 'highConfidence'
        this.confidence = confidence; // 0.0 to 1.0
        this.status = 'pending'; // 'pending', 'approved', 'rejected', 'executed'
        this.metadata = metadata; // Additional context
        this.createdAt = Date.now();
        this.resolvedAt = null;
    }

    approve() {
        this.status = 'approved';
        this.resolvedAt = Date.now();
    }

    reject() {
        this.status = 'rejected';
        this.resolvedAt = Date.now();
    }

    execute() {
        this.status = 'executed';
        this.resolvedAt = Date.now();
    }

    isPending() {
        return this.status === 'pending';
    }

    isResolved() {
        return this.status !== 'pending';
    }
}
