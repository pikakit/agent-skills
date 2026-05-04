#!/usr/bin/env node
/**
 * @fileoverview Knowledge FTS5 Indexer for PikaKit
 *
 * Indexes all markdown files under the knowledge directory into a
 * SQLite FTS5 virtual table inside memory.sqlite. This is a DERIVED
 * CACHE — delete it and rebuild from the source markdown files.
 *
 * Usage:
 *   node knowledge-indexer.js                Incremental index (only changed files)
 *   node knowledge-indexer.js --rebuild      Full rebuild (drop + recreate)
 *   node knowledge-indexer.js --stats        Show index statistics
 *
 * Requires: better-sqlite3
 *
 * @version 3.9.169
 * @author PikaKit Runtime Memory Manager
 */

import fs from "fs";
import path from "path";
import crypto from "crypto";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// ─── Paths ──────────────────────────────────────────────────────────────────

/**
 * Resolve paths relative to the .agent directory.
 * @param {string} [baseDir] - Optional base directory override
 * @returns {{ knowledgeDir: string, dbPath: string }}
 */
function resolvePaths(baseDir) {
  const agentDir = baseDir || path.resolve(__dirname, "..", "..", "..");
  return {
    knowledgeDir: path.join(agentDir, "knowledge"),
    dbPath: path.join(agentDir, "memory.sqlite"),
  };
}

// ─── YAML Frontmatter Parser (zero-dep) ─────────────────────────────────────

/**
 * Extract YAML frontmatter fields from markdown content.
 * @param {string} content - Full markdown file content
 * @returns {{ title: string, tags: string[], body: string }}
 */
function parseFrontmatter(content) {
  const fmMatch = content.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  let title = "";
  let tags = [];
  let body = content;

  if (fmMatch) {
    const fmBlock = fmMatch[1];
    body = content.substring(fmMatch[0].length).trim();

    // Extract title
    const titleMatch = fmBlock.match(/^title:\s*["']?(.+?)["']?\s*$/m);
    if (titleMatch) title = titleMatch[1].trim();

    // Extract tags
    const tagsMatch = fmBlock.match(/^tags:\s*\[(.+?)\]\s*$/m);
    if (tagsMatch) {
      tags = tagsMatch[1].split(",").map((t) => t.trim().replace(/['"]/g, ""));
    }
  }

  // Fallback: extract title from first H1
  if (!title) {
    const h1Match = body.match(/^#\s+(.+)$/m);
    if (h1Match) title = h1Match[1].trim();
  }

  return { title, tags, body };
}

// ─── Schema ─────────────────────────────────────────────────────────────────

const SCHEMA_SQL = `
  CREATE VIRTUAL TABLE IF NOT EXISTS knowledge_fts USING fts5(
    file_path UNINDEXED,
    title,
    tags,
    body,
    tokenize = 'unicode61 remove_diacritics 2',
    prefix = '2 3 4'
  );

  CREATE TABLE IF NOT EXISTS knowledge_watermark (
    file_path  TEXT PRIMARY KEY,
    mtime_ms   INTEGER NOT NULL,
    content_hash TEXT NOT NULL
  );
`;

/**
 * Initialize the FTS5 schema in the database.
 * @param {import('better-sqlite3').Database} db
 */
function initSchema(db) {
  db.exec(SCHEMA_SQL);
}

/**
 * Drop and recreate the FTS5 tables.
 * @param {import('better-sqlite3').Database} db
 */
function dropSchema(db) {
  db.exec("DROP TABLE IF EXISTS knowledge_fts;");
  db.exec("DROP TABLE IF EXISTS knowledge_watermark;");
}

// ─── File Discovery ─────────────────────────────────────────────────────────

/**
 * Recursively find all .md files in a directory.
 * @param {string} dir
 * @returns {string[]}
 */
function findMarkdownFiles(dir) {
  const files = [];

  function walk(d) {
    if (!fs.existsSync(d)) return;
    for (const entry of fs.readdirSync(d)) {
      if (entry.startsWith(".")) continue;
      const full = path.join(d, entry);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) {
        walk(full);
      } else if (entry.endsWith(".md")) {
        files.push(full);
      }
    }
  }

  walk(dir);
  return files;
}

/**
 * Compute SHA-256 hash of file content.
 * @param {string} content
 * @returns {string}
 */
function contentHash(content) {
  return crypto.createHash("sha256").update(content).digest("hex").slice(0, 16);
}

// ─── Indexer ────────────────────────────────────────────────────────────────

/**
 * Run incremental indexing — only re-index changed files.
 * @param {import('better-sqlite3').Database} db
 * @param {string} knowledgeDir
 * @returns {{ indexed: number, skipped: number, removed: number }}
 */
function indexIncremental(db, knowledgeDir) {
  const files = findMarkdownFiles(knowledgeDir);
  let indexed = 0;
  let skipped = 0;
  let removed = 0;

  const getWatermark = db.prepare(
    "SELECT mtime_ms, content_hash FROM knowledge_watermark WHERE file_path = ?",
  );
  const upsertWatermark = db.prepare(
    "INSERT OR REPLACE INTO knowledge_watermark (file_path, mtime_ms, content_hash) VALUES (?, ?, ?)",
  );
  const deleteFts = db.prepare(
    "DELETE FROM knowledge_fts WHERE file_path = ?",
  );
  const insertFts = db.prepare(
    "INSERT INTO knowledge_fts (file_path, title, tags, body) VALUES (?, ?, ?, ?)",
  );
  const deleteWatermark = db.prepare(
    "DELETE FROM knowledge_watermark WHERE file_path = ?",
  );

  const currentPaths = new Set(files);

  // Remove entries for deleted files
  const allWatermarks = db
    .prepare("SELECT file_path FROM knowledge_watermark")
    .all();
  for (const row of allWatermarks) {
    if (!currentPaths.has(row.file_path)) {
      deleteFts.run(row.file_path);
      deleteWatermark.run(row.file_path);
      removed++;
    }
  }

  // Index new or changed files
  for (const filePath of files) {
    const stat = fs.statSync(filePath);
    const mtimeMs = Math.floor(stat.mtimeMs);
    const content = fs.readFileSync(filePath, "utf-8");
    const hash = contentHash(content);

    const existing = getWatermark.get(filePath);
    if (existing && existing.content_hash === hash) {
      skipped++;
      continue;
    }

    // Parse and index
    const { title, tags, body } = parseFrontmatter(content);

    // Remove old entry if exists
    deleteFts.run(filePath);

    // Insert new entry
    insertFts.run(filePath, title, tags.join(", "), body);
    upsertWatermark.run(filePath, mtimeMs, hash);
    indexed++;
  }

  return { indexed, skipped, removed };
}

/**
 * Get index statistics.
 * @param {import('better-sqlite3').Database} db
 * @returns {{ totalArticles: number, totalWatermarks: number }}
 */
function getStats(db) {
  try {
    const ftsCount = db
      .prepare("SELECT count(*) as cnt FROM knowledge_fts")
      .get();
    const wmCount = db
      .prepare("SELECT count(*) as cnt FROM knowledge_watermark")
      .get();
    return {
      totalArticles: ftsCount?.cnt || 0,
      totalWatermarks: wmCount?.cnt || 0,
    };
  } catch {
    return { totalArticles: 0, totalWatermarks: 0 };
  }
}

// ─── CLI Entry Point ────────────────────────────────────────────────────────

async function main() {
  const args = process.argv.slice(2);
  const rebuild = args.includes("--rebuild");
  const statsOnly = args.includes("--stats");
  const baseDir = args.find((a) => !a.startsWith("--"));

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

  const { knowledgeDir, dbPath } = resolvePaths(baseDir);

  if (!fs.existsSync(knowledgeDir)) {
    console.error(`Error: Knowledge directory not found: ${knowledgeDir}`);
    process.exit(2);
  }

  console.log(`⚡ FTS5 Knowledge Indexer — PikaKit`);
  console.log(`   Database: ${dbPath}`);
  console.log(`   Knowledge: ${knowledgeDir}\n`);

  const db = new Database(dbPath);
  db.pragma("journal_mode = WAL");

  if (statsOnly) {
    initSchema(db);
    const stats = getStats(db);
    console.log(`   Articles indexed: ${stats.totalArticles}`);
    console.log(`   Watermarks tracked: ${stats.totalWatermarks}`);
    db.close();
    return;
  }

  if (rebuild) {
    console.log(`   Mode: Full Rebuild (drop + recreate)\n`);
    dropSchema(db);
  } else {
    console.log(`   Mode: Incremental Update\n`);
  }

  initSchema(db);

  // Run inside a transaction for atomicity
  const result = db.transaction(() => {
    return indexIncremental(db, knowledgeDir);
  })();

  const stats = getStats(db);
  db.close();

  console.log(`   Indexed: ${result.indexed} files`);
  console.log(`   Skipped: ${result.skipped} files (unchanged)`);
  console.log(`   Removed: ${result.removed} files (deleted)`);
  console.log(`   Total in index: ${stats.totalArticles} articles\n`);
  console.log(`   ✅ FTS5 index up to date`);
}

// Run CLI if executed directly
const isMain =
  process.argv[1] &&
  (process.argv[1] === fileURLToPath(import.meta.url) ||
    process.argv[1].endsWith("knowledge-indexer.js"));

if (isMain) {
  main().catch((err) => {
    console.error(`Error: ${err.message}`);
    process.exit(1);
  });
}

export { resolvePaths, parseFrontmatter, initSchema, dropSchema, indexIncremental, getStats, findMarkdownFiles };
