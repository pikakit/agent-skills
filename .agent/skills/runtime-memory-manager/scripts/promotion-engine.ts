import Database from 'better-sqlite3';
import { setTimeout } from 'timers/promises';

interface Pattern {
  id: string;
  signal_count: number;
  confidence_score: number;
  decay_weight: number;
  status: string;
  dominant_error_pattern: string;
}

// Configuration
const DB_PATH = '../../../.agent/memory.sqlite';
const PROMOTION_THRESHOLD = 0.75; // Score required to become knowledge
const MAX_PROMOTIONS_PER_RUN = 5; // Anti-spam cooldown

export async function runPromotionEngine() {
  console.log('[Promotion Engine] Initializing The Learning Act...');
  const db = new Database(DB_PATH);

  // 1. Fetch potential candidates that pass the Bounded Influence & Threshold check
  // Decay weight lowers the effective score over time if it stops occurring
  const candidates = db.prepare(`
    SELECT * FROM patterns 
    WHERE status = 'candidate' 
    AND (confidence_score * decay_weight) >= ?
    ORDER BY (confidence_score * decay_weight) DESC
    LIMIT ?
  `).all(PROMOTION_THRESHOLD, MAX_PROMOTIONS_PER_RUN) as Pattern[];

  if (candidates.length === 0) {
    console.log('[Promotion Engine] Gating check: No candidates passed the threshold.');
    return;
  }

  console.log(`[Promotion Engine] Found ${candidates.length} knowledge candidates.`);

  for (const candidate of candidates) {
    console.log(`[Promotion Engine] Gating check passed for ${candidate.id}. Promoting to Knowledge layer...`);

    // 2. Adjust score based on past feedback (AI Learning from mistakes)
    const feedbacks = db.prepare(`SELECT feedback_type FROM pattern_feedback WHERE pattern_id = ?`).all(candidate.id);
    const negativeFeedbackCount = feedbacks.filter(f => (f as any).feedback_type === 'incorrect').length;
    const positiveFeedbackCount = feedbacks.filter(f => (f as any).feedback_type === 'correct').length;

    // Strict self-correction
    if (negativeFeedbackCount > positiveFeedbackCount) {
      console.log(`[Promotion Engine] ABORT: Feedback system rejected ${candidate.id}. Downgrading pattern.`);
      db.prepare(`UPDATE patterns SET status = 'discarded', confidence_score = confidence_score * 0.5 WHERE id = ?`).run(candidate.id);
      continue;
    }

    // 3. Mark as Promoted
    db.prepare(`UPDATE patterns SET status = 'promoted' WHERE id = ?`).run(candidate.id);

    // 4. Emit the compilation signal to 'knowledge-compiler' system abstractly
    // In actual implementation, this creates a 'promoted_signals' json dump that triggers
    // the PikaKit CLI auto-compiler loop to generate the Markdown file.
    console.log(`[Promotion Engine] Succeeded. Emitted Synthesize Request for error context: ${candidate.dominant_error_pattern.substring(0, 30)}...`);
    
    // Simulate compilation delay overhead
    await setTimeout(500); 
  }

  console.log('[Promotion Engine] Cycle Complete.');
}

if (require.main === module) {
  runPromotionEngine().catch(console.error);
}
