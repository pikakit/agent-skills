/**
 * Signal Queue - Service Facade
 * 
 * Backward compatible wrapper around SignalDetector.
 * Provides singleton-style access for legacy code.
 */

import { SignalRepository } from '../data/repositories/signal-repository.js';
import { JsonStorage } from '../data/storage/json-storage.js';
import { SignalDetector } from './signal-detector.js';
import path from 'path';

// Lazy initialization
let _instance = null;

async function getInstance() {
    if (!_instance) {
        // Get KNOWLEDGE_DIR from old config
        const { KNOWLEDGE_DIR } = await import('../../lib/config.js');

        // Create storage and repository
        const storage = new JsonStorage(KNOWLEDGE_DIR);
        const repository = new SignalRepository(storage);

        // Create detector
        _instance = new SignalDetector(repository);
    }
    return _instance;
}

/**
 * SignalQueue - Facade for backward compatibility
 * 
 * Provides same interface as old evolution-signal.js
 */
export class SignalQueue {
    static async add(signal) {
        const detector = await getInstance();
        return detector.queue(signal.lessonId, {
            ready: true,
            reason: signal.reason,
            confidence: signal.confidence
        }, signal.metadata);
    }

    static async getPending() {
        const detector = await getInstance();
        return detector.getPending();
    }

    static async getByLesson(lessonId) {
        const detector = await getInstance();
        return detector.getByLesson(lessonId);
    }

    static async approve(signalId) {
        const detector = await getInstance();
        return detector.approve(signalId);
    }

    static async reject(signalId) {
        const detector = await getInstance();
        return detector.reject(signalId);
    }

    static async execute(signalId) {
        const detector = await getInstance();
        return detector.execute(signalId);
    }

    static async cleanup() {
        const detector = await getInstance();
        const repository = detector.signalRepository;
        await repository.cleanup();
    }
}

// Export singleton instance for compatibility
export const signalQueue = SignalQueue;
