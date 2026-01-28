// Test new architecture directly
import { SignalRepository } from './packages/cli/src/data/repositories/signal-repository.js';
import { JsonStorage } from './packages/cli/src/data/storage/json-storage.js';
import { SignalDetector } from './packages/cli/src/core/evolution/signal-detector.js';
import { KNOWLEDGE_DIR } from './packages/cli/lib/config.js';

console.log('📊 Testing New Architecture\n');

// Create instances
const storage = new JsonStorage(KNOWLEDGE_DIR);
const repository = new SignalRepository(storage);
const detector = new SignalDetector(repository);

// 1. Get stats
const stats = await detector.getStats();
console.log('Initial Stats:');
console.log(`  Pending: ${stats.pending}`);
console.log(`  Approved: ${stats.approved}`);
console.log(`  Rejected: ${stats.rejected}`);
console.log(`  Executed: ${stats.executed}\n`);

// 2. Get pending signals
const pending = await detector.getPending();
console.log(`📡 Pending Signals (${pending.length}):`);
pending.forEach(s => {
    console.log(`  - ${s.lessonId}: ${s.reason} (confidence: ${(s.confidence * 100).toFixed(0)}%)`);
});

console.log('\n✅ New Architecture Test Complete!');
