import Database from 'better-sqlite3';
import { pipeline } from '@xenova/transformers';

interface Signal {
  id: string;
  content: string;
  source: string;
  created_at: string;
}

interface Pattern {
  id: string;
  centroid_vector: Float32Array;
  signal_count: number;
  confidence_score: number;
  decay_weight: number;
  status: string;
  last_seen_at: string;
}

// Configuration
const DB_PATH = '../../../.agent/memory.sqlite';
const SIMILARITY_THRESHOLD = 0.85; // Bounded influence
const DATA_WEIGHT = 0.7; // From ADR-003 Formula
const KNOWLEDGE_WEIGHT = 0.3; 
const DECAY_LAMBDA = 0.05; // 5% decay per day

function computeCosineSimilarity(vecA: Float32Array, vecB: Float32Array): number {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

function calculateExponentialDecay(lastSeenAt: string): number {
  const lastSeenDate = new Date(lastSeenAt);
  const now = new Date();
  const diffTime = Math.abs(now.getTime() - lastSeenDate.getTime());
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 
  
  // Exponential decay: e^(-λ * t)
  return Math.exp(-DECAY_LAMBDA * diffDays);
}

export async function runClusteringJob() {
  console.log('[Clustering Job] Initializing Runtime Pattern Analyzer...');
  
  const db = new Database(DB_PATH);
  const embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');

  // 1. Fetch unprocessed signals
  const signals = db.prepare(`SELECT * FROM signals`).all() as Signal[];
  if (signals.length === 0) {
    console.log('[Clustering Job] No new signals to process.');
    return;
  }

  // 2. Fetch existing pattern centroids
  const patterns = db.prepare(`SELECT * FROM patterns WHERE status != 'discarded'`).all() as Pattern[];
  
  for (const signal of signals) {
    // Basic "Do Not Learn" Guardrail (Typos, transient local paths)
    if (signal.content.includes('ENOTFOUND') || signal.content.length < 10) {
      db.prepare(`DELETE FROM signals WHERE id = ?`).run(signal.id);
      continue;
    }

    // Embed current signal
    const tensor = await embedder(signal.content, { pooling: 'mean', normalize: true });
    // Make sure we type-cast the tensor array correctly
    const signalVector = new Float32Array(tensor.data);

    let matchedPatternId: string | null = null;
    let maxSimilarity = 0;

    // 3. Cluster Matching using Cosine Similarity
    for (const pattern of patterns) {
      if (!pattern.centroid_vector) continue;
      const centroid = new Float32Array(pattern.centroid_vector.buffer);
      const sim = computeCosineSimilarity(signalVector, centroid);

      if (sim > maxSimilarity) {
        maxSimilarity = sim;
        matchedPatternId = pattern.id;
      }
    }

    if (maxSimilarity >= SIMILARITY_THRESHOLD && matchedPatternId) {
      // It belongs to an existing cluster -> Update Centroid dynamically
      console.log(`[Clustering Job] Signal ${signal.id} merged into Pattern ${matchedPatternId} (Sim: ${maxSimilarity.toFixed(2)})`);
      
      const p = patterns.find(x => x.id === matchedPatternId)!;
      const decay = calculateExponentialDecay(p.last_seen_at);
      
      // Calculate Bounded Influence Confidence Score
      // Final = (sim * 0.7) + (prior_score * 0.3)
      const newConfidence = (maxSimilarity * DATA_WEIGHT) + (Math.max(p.confidence_score, 0.1) * KNOWLEDGE_WEIGHT);

      db.prepare(`
        UPDATE patterns 
        SET signal_count = signal_count + 1,
            confidence_score = ?,
            decay_weight = ?,
            last_seen_at = CURRENT_TIMESTAMP
        WHERE id = ?
      `).run(newConfidence, decay, matchedPatternId);

      // Remove the raw signal after it's been clustered
      db.prepare(`DELETE FROM signals WHERE id = ?`).run(signal.id);

    } else {
      // Create a brand new pattern candidate
      console.log(`[Clustering Job] Spawning new pattern candidate from Signal ${signal.id}`);
      
      const newId = `PAT-${Date.now()}`;
      db.prepare(`
        INSERT INTO patterns (
          id, centroid_vector, signal_count, confidence_score, status, dominant_error_pattern
        ) VALUES (?, ?, 1, ?, 'candidate', ?)
      `).run(newId, Buffer.from(signalVector.buffer), maxSimilarity || 0.5, signal.content);

      db.prepare(`DELETE FROM signals WHERE id = ?`).run(signal.id);
    }
  }

  console.log('[Clustering Job] Membrane scan complete.');
}

if (require.main === module) {
  runClusteringJob().catch(console.error);
}
