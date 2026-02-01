/**
 * SignalDetector - Application Service
 * 
 * Orchestrates evolution signal detection and queuing.
 * Coordinates between core business logic and data layer.
 */

import { EvolutionSignal } from './evolution-signal.js';
import { ThresholdChecker } from './threshold-checker.js';

export class SignalDetector {
    constructor(signalRepository, settings = {}) {
        this.signalRepository = signalRepository;
        this.settings = settings;
    }

    /**
     * Check if lesson is ready for evolution
     * @param {object} lesson - Lesson to check
     * @returns {Promise<{ready: boolean, reason?: string, confidence?: number}>}
     */
    async check(lesson) {
        const threshold = this.settings.updateThreshold || 10;
        return ThresholdChecker.check(lesson, threshold);
    }

    /**
     * Queue an evolution signal
     * @param {string} lessonId
     * @param {object} checkResult - From check()
     * @param {object} metadata - Additional context
     * @returns {Promise<EvolutionSignal|null>}
     */
    async queue(lessonId, checkResult, metadata = {}) {
        if (!checkResult.ready) return null;

        // Create signal
        const signal = new EvolutionSignal(
            lessonId,
            checkResult.reason,
            checkResult.confidence,
            metadata
        );

        // Check for duplicates
        const existing = await this.signalRepository.findByLesson(lessonId);
        const duplicate = existing.find(s =>
            s.isPending() && s.reason === signal.reason
        );

        if (duplicate) {
            // Update confidence if higher
            if (signal.confidence > duplicate.confidence) {
                duplicate.confidence = signal.confidence;
                duplicate.metadata = signal.metadata;
                await this.signalRepository.save(duplicate);
            }
            return duplicate;
        }

        // Save new signal
        return await this.signalRepository.save(signal);
    }

    /**
     * Get all pending signals
     * @returns {Promise<Array<EvolutionSignal>>}
     */
    async getPending() {
        return await this.signalRepository.findPending();
    }

    /**
     * Get signals for a specific lesson
     * @param {string} lessonId
     * @returns {Promise<Array<EvolutionSignal>>}
     */
    async getByLesson(lessonId) {
        return await this.signalRepository.findByLesson(lessonId);
    }

    /**
     * Approve a signal
     * @param {string} signalId
     * @returns {Promise<EvolutionSignal>}
     */
    async approve(signalId) {
        const signal = await this.signalRepository.findById(signalId);
        if (signal) {
            signal.approve();
            await this.signalRepository.save(signal);
        }
        return signal;
    }

    /**
     * Reject a signal
     * @param {string} signalId
     * @returns {Promise<EvolutionSignal>}
     */
    async reject(signalId) {
        const signal = await this.signalRepository.findById(signalId);
        if (signal) {
            signal.reject();
            await this.signalRepository.save(signal);
        }
        return signal;
    }

    /**
     * Execute a signal
     * @param {string} signalId
     * @returns {Promise<EvolutionSignal>}
     */
    async execute(signalId) {
        const signal = await this.signalRepository.findById(signalId);
        if (signal) {
            signal.execute();
            await this.signalRepository.save(signal);
        }
        return signal;
    }

    /**
     * Get evolution statistics
     * @returns {Promise<{pending: number, approved: number, rejected: number, executed: number}>}
     */
    async getStats() {
        const all = await this.signalRepository.findAll();
        return {
            pending: all.filter(s => s.status === 'pending').length,
            approved: all.filter(s => s.status === 'approved').length,
            rejected: all.filter(s => s.status === 'rejected').length,
            executed: all.filter(s => s.status === 'executed').length
        };
    }
}
