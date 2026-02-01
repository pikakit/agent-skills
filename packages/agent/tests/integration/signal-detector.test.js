/**
 * @fileoverview Tests for Signal Detector functionality
 */
import { describe, it, expect, beforeAll } from 'vitest';
import { SignalRepository } from '../../src/data/repositories/signal-repository.js';
import { JsonStorage } from '../../src/data/storage/json-storage.js';
import { SignalDetector } from '../../src/core/evolution/signal-detector.js';
import { KNOWLEDGE_DIR } from '../../lib/config.js';

describe('Signal Detector - New Architecture', () => {
    let storage;
    let repository;
    let detector;

    beforeAll(() => {
        storage = new JsonStorage(KNOWLEDGE_DIR);
        repository = new SignalRepository(storage);
        detector = new SignalDetector(repository);
    });

    it('should get initial stats', async () => {
        const stats = await detector.getStats();
        
        expect(stats).toBeDefined();
        expect(typeof stats.pending).toBe('number');
        expect(typeof stats.approved).toBe('number');
        expect(typeof stats.rejected).toBe('number');
        expect(typeof stats.executed).toBe('number');
    });

    it('should get pending signals', async () => {
        const pending = await detector.getPending();
        
        expect(Array.isArray(pending)).toBe(true);
        pending.forEach(signal => {
            expect(signal.lessonId).toBeDefined();
            expect(signal.reason).toBeDefined();
            expect(typeof signal.confidence).toBe('number');
        });
    });
});
