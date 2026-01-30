/**
 * @fileoverview Tests for Evolution Signals functionality
 */
import { describe, it, expect, vi } from 'vitest';
import { signalQueue, getEvolutionStats } from '../../lib/evolution-signal.js';

describe('Evolution Signals - Signal Queue', () => {
    it('should get evolution stats', async () => {
        const stats = await getEvolutionStats();

        expect(stats).toBeDefined();
        expect(typeof stats.pending).toBe('number');
        expect(typeof stats.approved).toBe('number');
        expect(typeof stats.rejected).toBe('number');
        expect(typeof stats.executed).toBe('number');
    });

    it('should get pending signals', () => {
        const pending = signalQueue.getPending();

        expect(Array.isArray(pending)).toBe(true);
        pending.forEach(signal => {
            expect(signal.id).toBeDefined();
            expect(signal.lessonId).toBeDefined();
            expect(signal.reason).toBeDefined();
            expect(typeof signal.confidence).toBe('number');
        });
    });

    it('should handle signal approval', async () => {
        const pending = signalQueue.getPending();

        if (pending.length > 0) {
            const firstSignal = pending[0];
            const result = await signalQueue.approve(firstSignal.id);
            expect(result).toBeDefined();
        }
    });

    it('should handle signal rejection', async () => {
        const pending = signalQueue.getPending();

        if (pending.length > 1) {
            const secondSignal = pending[1];
            const result = await signalQueue.reject(secondSignal.id);
            expect(result).toBeDefined();
        }
    });
});
