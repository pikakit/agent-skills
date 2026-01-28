// Test script for evolution signals
import { signalQueue, getEvolutionStats } from './packages/cli/lib/evolution-signal.js';

console.log('📊 Testing Evolution Signal Layer\n');

// 1. Get stats
const stats = getEvolutionStats();
console.log('Initial Stats:');
console.log(`  Pending: ${stats.pending}`);
console.log(`  Approved: ${stats.approved}`);
console.log(`  Rejected: ${stats.rejected}`);
console.log(`  Executed: ${stats.executed}\n`);

// 2. Get pending signals
const pending = signalQueue.getPending();
console.log(`📡 Pending Signals (${pending.length}):`);
pending.forEach(s => {
    console.log(`  - ${s.lessonId}: ${s.reason} (confidence: ${(s.confidence * 100).toFixed(0)}%)`);
});

// 3. Test approve first signal
if (pending.length > 0) {
    const firstSignal = pending[0];
    console.log(`\n✅ Approving signal: ${firstSignal.lessonId}`);
    signalQueue.approve(firstSignal.id);

    const statsAfter = getEvolutionStats();
    console.log('\nStats After Approval:');
    console.log(`  Pending: ${statsAfter.pending}`);
    console.log(`  Approved: ${statsAfter.approved}`);
}

// 4. Test reject second signal
if (pending.length > 1) {
    const secondSignal = pending[1];
    console.log(`\n❌ Rejecting signal: ${secondSignal.lessonId}`);
    signalQueue.reject(secondSignal.id);

    const statsAfter = getEvolutionStats();
    console.log('\nStats After Rejection:');
    console.log(`  Pending: ${statsAfter.pending}`);
    console.log(`  Approved: ${statsAfter.approved}`);
    console.log(`  Rejected: ${statsAfter.rejected}`);
}

console.log('\n✅ Signal Layer Test Complete!');
