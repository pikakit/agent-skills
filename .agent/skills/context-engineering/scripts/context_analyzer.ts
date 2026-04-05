#!/usr/bin/env node
// @ts-nocheck
import * as fs from 'node:fs';
import * as path from 'node:path';

const VERSION = '1.0.1';
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo']);

// Rough token estimate: ~4 chars per token for English code
const CHARS_PER_TOKEN = 4;

const SIGNAL_MAP = {
  high: new Set(['.ts', '.tsx', '.js', '.jsx', '.py', '.go', '.rs', '.java', '.cs']),
  medium: new Set(['.json', '.yaml', '.yml', '.toml', '.env', '.md']),
  low: new Set(['.lock', '.svg', '.csv', '.log', '.txt', '.map'])
};

function classifySignal(ext) {
  if (SIGNAL_MAP.high.has(ext)) return 'high';
  if (SIGNAL_MAP.medium.has(ext)) return 'medium';
  if (SIGNAL_MAP.low.has(ext)) return 'low';
  return 'unknown';
}

function scanDirectory(dir, results) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, results);
    } else {
      try {
        const stat = fs.statSync(fullPath);
        const ext = path.extname(entry.name).toLowerCase();
        const signal = classifySignal(ext);
        const charCount = stat.size;
        const tokenEstimate = Math.ceil(charCount / CHARS_PER_TOKEN);

        results.push({
          file: path.relative(process.cwd(), fullPath),
          ext,
          signal,
          chars: charCount,
          tokens: tokenEstimate
        });
      } catch { /* skip unreadable files */ }
    }
  }
}

function main() {
  const args = process.argv.slice(2);
  let targetPath = process.cwd();
  let windowSize = 128000; // Default: 128K tokens (GPT-4 Turbo)

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) targetPath = path.resolve(args[i + 1]);
    if (args[i] === '--window' && args[i + 1]) windowSize = parseInt(args[i + 1]);
  }

  if (!fs.existsSync(targetPath)) {
    console.log(JSON.stringify({
      status: 'error', data: null,
      error: { code: 'ERR_TARGET_NOT_FOUND', message: `Target not found: ${targetPath}` }
    }, null, 2));
    process.exit(1);
  }

  const results = [];
  scanDirectory(targetPath, results);

  const totalTokens = results.reduce((sum, r) => sum + r.tokens, 0);
  const utilization = totalTokens / windowSize;
  const utilizationPct = (utilization * 100).toFixed(1);

  // Group by signal quality
  const bySignal = { high: 0, medium: 0, low: 0, unknown: 0 };
  for (const r of results) bySignal[r.signal] += r.tokens;

  // Top 10 largest files
  const topFiles = [...results].sort((a, b) => b.tokens - a.tokens).slice(0, 10).map(r => ({
    file: r.file, tokens: r.tokens, signal: r.signal
  }));

  const status = utilization >= 0.8 ? 'critical' : utilization >= 0.7 ? 'warning' : 'healthy';

  const data = {
    version: VERSION,
    scannedPath: targetPath,
    timestamp: new Date().toISOString(),
    contextWindow: windowSize,
    totalFiles: results.length,
    totalTokens,
    utilization: utilizationPct + '%',
    status,
    tokensBySignal: bySignal,
    topFiles,
    recommendation: status === 'critical'
      ? 'CRITICAL: Apply Compress or Isolate strategy immediately.'
      : status === 'warning'
        ? 'WARNING: Apply Write or Select strategy to reduce context.'
        : 'Healthy: Token utilization within safe thresholds.'
  };

  if (status === 'critical') {
    console.log(JSON.stringify({
      status: 'error', data,
      error: { code: 'ERR_CONTEXT_CRITICAL', message: `Token utilization at ${utilizationPct}% (>= 80% threshold).` }
    }, null, 2));
    process.exit(1);
  } else {
    console.log(JSON.stringify({ status: 'success', data, error: null }, null, 2));
    process.exit(0);
  }
}

try { main(); } catch (e) {
  console.log(JSON.stringify({
    status: 'error', data: null,
    error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
  }, null, 2));
  process.exit(1);
}
