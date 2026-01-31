/**
 * SignalRepository - Data Access Layer
 * 
 * Manages persistence of evolution signals.
 * Provides CRUD operations with storage abstraction.
 */

import { EvolutionSignal } from '../../core/evolution/evolution-signal.js';

export class SignalRepository {
    constructor(storage) {
        this.storage = storage;
        this.storageKey = 'evolution-signals';
    }

    /**
     * Load all signals from storage
     * @returns {Promise<Array<EvolutionSignal>>}
     */
    async findAll() {
        try {
            const data = await this.storage.read(this.storageKey);

            // Restore EvolutionSignal instances with methods
            return (data?.signals || []).map(s => {
                const signal = new EvolutionSignal(s.lessonId, s.reason, s.confidence, s.metadata);
                signal.id = s.id;
                signal.status = s.status;
                signal.createdAt = s.createdAt;
                signal.resolvedAt = s.resolvedAt;
                return signal;
            });
        } catch (error) {
            console.error('Failed to load signals:', error.message);
            return [];
        }
    }

    /**
     * Find pending signals
     * @returns {Promise<Array<EvolutionSignal>>}
     */
    async findPending() {
        const all = await this.findAll();
        return all.filter(s => s.isPending());
    }

    /**
     * Find signals by lesson ID
     * @param {string} lessonId
     * @returns {Promise<Array<EvolutionSignal>>}
     */
    async findByLesson(lessonId) {
        const all = await this.findAll();
        return all.filter(s => s.lessonId === lessonId);
    }

    /**
     * Find signal by ID
     * @param {string} signalId
     * @returns {Promise<EvolutionSignal|null>}
     */
    async findById(signalId) {
        const all = await this.findAll();
        return all.find(s => s.id === signalId) || null;
    }

    /**
     * Save signal
     * @param {EvolutionSignal} signal
     * @returns {Promise<EvolutionSignal>}
     */
    async save(signal) {
        const all = await this.findAll();
        const updated = [...all.filter(s => s.id !== signal.id), signal];

        await this.storage.write(this.storageKey, {
            signals: updated,
            version: 1.0
        });

        return signal;
    }

    /**
     * Save all signals (batch operation)
     * @param {Array<EvolutionSignal>} signals
     */
    async saveAll(signals) {
        await this.storage.write(this.storageKey, {
            signals,
            version: 1.0
        });
    }

    /**
     * Delete signal
     * @param {string} signalId
     */
    async delete(signalId) {
        const all = await this.findAll();
        const updated = all.filter(s => s.id !== signalId);
        await this.saveAll(updated);
    }

    /**
     * Clean up old resolved signals (older than 30 days)
     */
    async cleanup() {
        const thirtyDaysAgo = Date.now() - (30 * 24 * 60 * 60 * 1000);
        const all = await this.findAll();

        const kept = all.filter(s =>
            s.isPending() || s.resolvedAt > thirtyDaysAgo
        );

        await this.saveAll(kept);
    }
}
