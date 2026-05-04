#!/usr/bin/env node
/**
 * @fileoverview Knowledge FTS5 Search for PikaKit
 *
 * Searches the FTS5 index in memory.sqlite for knowledge articles.
 * Returns top-5 BM25-ranked results with prefix query rewriting.
 *
 * Usage:
 *   node knowledge-search.js "auth patterns"     Search for articles
 *   node knowledge-search.js "fast"               Prefix match → fast*
 *   node knowledge-search.js --json "query"       Output as JSON
 *
 * Requires: better-sqlite3
 *
 * @version 3.9.169
 * @author PikaKit Runtime Memory Manager
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Query Rewriting ────────────────────────────────────────────────────────

/**
 * Rewrite a raw query string for FTS5 compatibility.
 *
 * Rules:
 * - If query has explicit operators (*, ", AND, OR, NOT, (), :), pass through
 * - Otherwise, split on non-alphanumeric boundaries and append * for prefix matching
 * - Unbalanced quotes get escaped
 *
 * @param {string} raw - The raw user query
 * @returns {string} FTS5-safe query string
 */
export function rewriteQuery(raw) {
  if (!raw || raw.trim().length === 0) return "";

  const trimmed = raw.trim();

  // Check for explicit FTS5 operators
  const hasOperator =
    /[*"():]/.test(trimmed) ||
    trimmed.split(/\s+/).some((w) => ["AND", "OR", "NOT"].includes(w));

  if (hasOperator) {
    // Check for balanced quotes
    const quoteCount = (trimmed.match(/"/g) || []).length;
    if (quoteCount % 2 === 0) {
      return trimmed; // Pass through as-is
    }
    // Unbalanced quotes — double them for safety
    return trimmed.replace(/"/g, '""');
  }

  // No operators — split on tokenizer boundaries and append * for prefix matching
  const tokens = [];
  let current = "";

  for (const ch of trimmed) {
    if (/[A-Za-z0-9_]/.test(ch)) {
      current += ch;
    } else if (current.length > 0) {
      tokens.push(current + "*");
      current = "";
    }
  }

  if (current.length > 0) {
    tokens.push(current + "*");
  }

  return tokens.join(" ");
}

// ─── Search ─────────────────────────────────────────────────────────────────

/**
 * Search the FTS5 knowledge index.
 * @param {import('better-sqlite3').Database} db
 * @param {string} query - Raw query string
 * @param {number} [limit=5] - Max results
 * @returns {Array<{ filePath: string, title: string, snippet: string, score: number }>}
 */
export function searchKnowledge(db, query, limit = 5) {
  const ftsQuery = rewriteQuery(query);
  if (!ftsQuery) return [];

  try {
    const stmt = db.prepare(`
      SELECT
        file_path AS filePath,
        title,
        snippet(knowledge_fts, 3, '→ ', ' ←', '…', 48) AS snippet,
        bm25(knowledge_fts, 0.0, 10.0, 5.0, 1.0) AS score
      FROM knowledge_fts
      WHERE knowledge_fts MATCH ?
      ORDER BY score
      LIMIT ?
    `);

    return stmt.all(ftsQuery, limit);
  } catch (err) {
    // FTS5 parse errors (stray operators from user input) → return empty
    if (err.message.includes("fts5")) {
      return [];
    }
    throw err;
  }
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const jsonMode = args.includes("--json");
  const queryArgs = args.filter((a) => !a.startsWith("--"));
  const query = queryArgs.join(" ");

  if (!query) {
    console.log("Usage: node knowledge-search.js [--json] <query>");
    console.log('  e.g.: node knowledge-search.js "auth patterns"');
    console.log('  e.g.: node knowledge-search.js "fast"');
    process.exit(2);
  }

  // Dynamic import for better-sqlite3
  let Database;
  try {
    const betterSqlite3 = await import("better-sqlite3");
    Database = betterSqlite3.default;
  } catch {
    console.error(
      "Error: better-sqlite3 not installed. Run: npm install better-sqlite3",
    );
    process.exit(2);
  }

  const dbPath = path.resolve(__dirname, "..", "..", "..", "memory.sqlite");

  if (!fs.existsSync(dbPath)) {
    if (jsonMode) {
      console.log(JSON.stringify({ results: [], error: "No memory.sqlite found" }));
    } else {
      console.error("No memory.sqlite found. Run the indexer first:");
      console.error("  node knowledge-indexer.js");
    }
    process.exit(1);
  }

  const db = new Database(dbPath, { readonly: true });

  // Check if FTS5 table exists
  const tableExists = db
    .prepare(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='knowledge_fts'",
    )
    .get();

  if (!tableExists) {
    if (jsonMode) {
      console.log(JSON.stringify({ results: [], error: "FTS5 index not built" }));
    } else {
      console.error("FTS5 index not built. Run the indexer first:");
      console.error("  node knowledge-indexer.js");
    }
    db.close();
    process.exit(1);
  }

  const results = searchKnowledge(db, query);
  db.close();

  if (jsonMode) {
    console.log(JSON.stringify({ query, ftsQuery: rewriteQuery(query), results }));
    return;
  }

  console.log(`🔍 Knowledge Search — PikaKit`);
  console.log(`   Query: "${query}" → FTS5: "${rewriteQuery(query)}"\n`);

  if (results.length === 0) {
    console.log("   No results found.\n");
    return;
  }

  for (let i = 0; i < results.length; i++) {
    const r = results[i];
    const relPath = path.relative(process.cwd(), r.filePath);
    console.log(`   ${i + 1}. ${r.title || "(untitled)"}`);
    console.log(`      📄 ${relPath}`);
    console.log(`      📊 Score: ${Math.abs(r.score).toFixed(4)}`);
    if (r.snippet) {
      console.log(`      💬 ${r.snippet.replace(/\n/g, " ").trim()}`);
    }
    console.log();
  }
}

// Run CLI if executed directly
const isMain =
  process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith("knowledge-search.js"));

if (isMain) {
  main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}
