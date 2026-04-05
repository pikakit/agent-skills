// @ts-nocheck
/**
 * Plans Kanban Dashboard Server
 * Visual dashboard for plan directories with progress tracking.
 *
 * Usage:
 *   npx tsx kanban-server.ts --dir ./docs/plans --open
 *   npx tsx kanban-server.ts --stop
 */

import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const DEFAULT_PORT = 3458;

interface PlanCard {
  file: string;
  title: string;
  phase: string;
  progress: number;
}

interface ServerOptions {
  dir: string;
  port: number;
  open: boolean;
  stop: boolean;
}

function parseArgs(): ServerOptions {
  const args = process.argv.slice(2);
  const opts: ServerOptions = { dir: '.', port: DEFAULT_PORT, open: false, stop: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--dir': opts.dir = args[++i]; break;
      case '--port': opts.port = parseInt(args[++i], 10); break;
      case '--open': opts.open = true; break;
      case '--stop': opts.stop = true; break;
    }
  }
  return opts;
}

function parsePlanFile(filePath: string): PlanCard {
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  // Extract title from first H1
  const titleLine = lines.find(l => l.startsWith('# '));
  const title = titleLine ? titleLine.replace(/^#+\s*/, '').trim() : path.basename(filePath, '.md');

  // Count task progress
  const done = (content.match(/- \[x\]/gi) || []).length;
  const inProgress = (content.match(/- \[\/\]/g) || []).length;
  const todo = (content.match(/- \[ \]/g) || []).length;
  const total = done + inProgress + todo;
  const progress = total > 0 ? Math.round((done / total) * 100) : 0;

  // Determine phase
  let phase = 'backlog';
  if (progress === 100) phase = 'done';
  else if (inProgress > 0 || progress > 0) phase = 'in-progress';
  else if (todo > 0) phase = 'todo';

  return { file: path.basename(filePath), title, phase, progress };
}

function buildDashboardHtml(plans: PlanCard[], dirPath: string): string {
  const columns = {
    'backlog':     plans.filter(p => p.phase === 'backlog'),
    'todo':        plans.filter(p => p.phase === 'todo'),
    'in-progress': plans.filter(p => p.phase === 'in-progress'),
    'done':        plans.filter(p => p.phase === 'done'),
  };

  const renderCard = (p: PlanCard) => `
    <div class="card">
      <div class="card-title">${p.title}</div>
      <div class="card-file">${p.file}</div>
      <div class="progress-bar"><div class="progress-fill" style="width:${p.progress}%"></div></div>
      <div class="card-progress">${p.progress}%</div>
    </div>`;

  const renderColumn = (name: string, emoji: string, cards: PlanCard[]) => `
    <div class="column">
      <div class="column-header">${emoji} ${name} <span class="count">${cards.length}</span></div>
      ${cards.map(renderCard).join('')}
    </div>`;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"><title>Plans Dashboard — PikaKit</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui; background: #0f172a; color: #e2e8f0; min-height: 100vh; }
    .header { padding: 16px 24px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; justify-content: space-between; align-items: center; }
    .header h1 { font-size: 18px; font-weight: 600; }
    .header span { font-size: 12px; color: #64748b; }
    .board { display: flex; gap: 16px; padding: 24px; overflow-x: auto; min-height: calc(100vh - 60px); }
    .column { background: #1e293b; border-radius: 8px; min-width: 280px; flex: 1; padding: 12px; }
    .column-header { font-size: 13px; font-weight: 600; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.05em; padding: 8px 4px; border-bottom: 1px solid #334155; margin-bottom: 12px; }
    .count { background: #334155; padding: 2px 8px; border-radius: 10px; font-size: 11px; margin-left: 6px; }
    .card { background: #0f172a; border: 1px solid #334155; border-radius: 6px; padding: 12px; margin-bottom: 8px; }
    .card:hover { border-color: #3b82f6; }
    .card-title { font-size: 14px; font-weight: 500; margin-bottom: 4px; }
    .card-file { font-size: 11px; color: #64748b; margin-bottom: 8px; }
    .progress-bar { background: #334155; height: 4px; border-radius: 2px; overflow: hidden; }
    .progress-fill { background: #3b82f6; height: 100%; transition: width 0.3s; }
    .card-progress { font-size: 11px; color: #64748b; margin-top: 4px; text-align: right; }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Plans Dashboard</h1>
    <span>📂 ${dirPath} | ⚡ PikaKit</span>
  </div>
  <div class="board">
    ${renderColumn('Backlog', '📥', columns['backlog'])}
    ${renderColumn('Todo', '📋', columns['todo'])}
    ${renderColumn('In Progress', '🔧', columns['in-progress'])}
    ${renderColumn('Done', '✅', columns['done'])}
  </div>
</body>
</html>`;
}

function openBrowser(url: string): void {
  try {
    const cmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    execSync(cmd, { stdio: 'ignore' });
  } catch { /* ignore */ }
}

function main(): void {
  const opts = parseArgs();

  if (opts.stop) {
    console.log(JSON.stringify({ status: 'success', data: { message: 'Stop signal sent.' } }));
    process.exit(0);
  }

  if (!fs.existsSync(opts.dir)) {
    console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_DIR_NOT_FOUND', message: `Directory not found: ${opts.dir}`, recoverable: false } }));
    process.exit(1);
  }

  const server = http.createServer((_req, res) => {
    const mdFiles = fs.readdirSync(opts.dir).filter(f => f.endsWith('.md'));
    const plans = mdFiles.map(f => parsePlanFile(path.join(opts.dir, f)));
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(buildDashboardHtml(plans, opts.dir));
  });

  server.listen(opts.port, () => {
    const url = `http://localhost:${opts.port}`;
    console.log(JSON.stringify({ status: 'success', data: { url, port: opts.port, dir: opts.dir } }));
    if (opts.open) openBrowser(url);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_PORT_UNAVAILABLE', message: err.message, recoverable: true } }));
    process.exit(1);
  });
}

main();
