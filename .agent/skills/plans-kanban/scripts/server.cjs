#!/usr/bin/env node
/**
 * Plans Kanban Dashboard Server
 *
 * Background HTTP server for visual plan tracking with
 * glassmorphism UI, phase-level progress, and JSON API.
 *
 * @version 2.0.0
 * @contract plans-kanban v2.0.0
 * @see references/engineering-spec.md
 *
 * Features:
 *  - Plan directory parsing with gray-matter frontmatter
 *  - Phase-level progress tracking (completed/in-progress/pending)
 *  - Glassmorphism dashboard with responsive grid
 *  - JSON API: /api/plans, /api/plans/:id
 *  - Port 3500-3550 auto-increment
 *  - PID file management for background mode
 *  - CORS headers for cross-origin API access
 *
 * Visual dashboard for plan directories with progress tracking.
 *
 * Usage:
 *   node server.cjs --dir ./plans --open
 *   node server.cjs --dir ./plans --host 0.0.0.0 --port 3500
 *   node server.cjs --dir ./plans --background
 *   node server.cjs --stop
 *   node server.cjs --help
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const os = require('os');
const { spawn, exec } = require('child_process');

const VERSION = '2.0.0';
const PIKAKIT_VERSION = '3.9.74';

// --- CLI Argument Parsing ---
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
  console.log(`
Plans Kanban Dashboard v${VERSION}

Usage:
  node server.cjs --dir <path>               Start dashboard for plans directory
  node server.cjs --dir <path> --open        Start and open browser
  node server.cjs --dir <path> --background  Start in background (detached)
  node server.cjs --dir <path> --host 0.0.0.0  Share on network
  node server.cjs --stop                     Stop all running servers

Options:
  --dir <path>      Plans directory (required)
  --port <number>   Server port (default: 3500, auto-increments to 3550)
  --host <addr>     Bind address (default: localhost)
  --open            Open browser after start
  --background      Run as detached background process
  --stop            Stop all plans-kanban servers
  --help, -h        Show this help

API Endpoints:
  GET /             Dashboard UI
  GET /kanban       Dashboard UI (alias)
  GET /api/plans    JSON API (all plans)
  GET /api/plans/:id  JSON API (single plan)

Plan Structure:
  plans/
  ├── feature-auth/
  │   ├── plan.md              (required, with YAML frontmatter)
  │   ├── phase-01-design.md
  │   └── phase-02-impl.md

Requires: npm install gray-matter (in skill directory)
`);
  process.exit(0);
}

const config = {
  dir: null,
  port: 3500,
  host: 'localhost',
  open: false,
  background: false,
  stop: false,
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--dir': config.dir = args[++i]; break;
    case '--port': config.port = parseInt(args[++i], 10); break;
    case '--host': config.host = args[++i]; break;
    case '--open': config.open = true; break;
    case '--background': config.background = true; break;
    case '--stop': config.stop = true; break;
  }
}

// --- Stop All Servers ---
if (config.stop) {
  const tmpDir = os.tmpdir();
  const pidFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith('plans-kanban-') && f.endsWith('.pid'));

  if (pidFiles.length === 0) {
    console.log(JSON.stringify({ success: true, message: 'No running servers found' }));
    process.exit(0);
  }

  pidFiles.forEach(pidFile => {
    const pid = fs.readFileSync(path.join(tmpDir, pidFile), 'utf8').trim();
    try {
      process.kill(parseInt(pid, 10));
      fs.unlinkSync(path.join(tmpDir, pidFile));
      console.log(`Stopped server with PID ${pid}`);
    } catch (e) {
      fs.unlinkSync(path.join(tmpDir, pidFile));
    }
  });

  console.log(JSON.stringify({ success: true, message: `Stopped ${pidFiles.length} server(s)` }));
  process.exit(0);
}

if (!config.dir) {
  console.error('Error: --dir is required. Use --help for usage.');
  process.exit(1);
}

// --- Background Mode ---
if (config.background) {
  const child = spawn(process.execPath, [__filename, '--dir', config.dir, '--port', String(config.port), '--host', config.host, ...(config.open ? ['--open'] : [])], {
    detached: true,
    stdio: 'ignore',
  });
  child.unref();
  console.log(JSON.stringify({ success: true, message: `Server started in background (PID: ${child.pid})`, pid: child.pid }));
  process.exit(0);
}

// --- Load gray-matter ---
let matter;
try {
  matter = require('gray-matter');
} catch (e) {
  console.error(JSON.stringify({
    error: 'ERR_DEPENDENCY_MISSING',
    message: 'gray-matter not installed. Run: cd .agent/skills/plans-kanban && npm install gray-matter',
  }));
  process.exit(1);
}

// --- Utilities ---
function getNetworkIP() {
  const interfaces = os.networkInterfaces();
  for (const name of Object.keys(interfaces)) {
    for (const iface of interfaces[name]) {
      if (iface.family === 'IPv4' && !iface.internal) {
        return iface.address;
      }
    }
  }
  return 'localhost';
}

// --- Plan Scanner ---
function scanPlans(dir) {
  const plans = [];

  if (!fs.existsSync(dir)) {
    return plans;
  }

  const entries = fs.readdirSync(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      const planPath = path.join(dir, entry.name, 'plan.md');
      if (fs.existsSync(planPath)) {
        try {
          const plan = parsePlan(planPath, entry.name);
          plans.push(plan);
        } catch (e) {
          console.error(`Warning: Failed to parse ${planPath}: ${e.message}`);
        }
      }
    }
  }

  return plans.sort((a, b) => new Date(b.modified) - new Date(a.modified));
}

function parsePlan(planPath, dirName) {
  const content = fs.readFileSync(planPath, 'utf8');
  const stat = fs.statSync(planPath);

  // Parse frontmatter with gray-matter
  const { data: frontmatter } = matter(content);

  // Count phases from phase files
  const dirPath = path.dirname(planPath);
  const phaseFiles = fs.readdirSync(dirPath).filter(f => f.match(/^phase-\d+/i));

  let completed = 0;
  let inProgress = 0;
  let pending = 0;

  phaseFiles.forEach(file => {
    const phaseContent = fs.readFileSync(path.join(dirPath, file), 'utf8');
    if (phaseContent.includes('[completed]') || phaseContent.includes('[done]')) {
      completed++;
    } else if (phaseContent.includes('[in-progress]') || phaseContent.includes('[wip]')) {
      inProgress++;
    } else {
      pending++;
    }
  });

  // Also check headers in plan.md
  const headerMatches = content.matchAll(/^##\s+.*?\[(completed|in-progress|pending|done|wip)\]/gim);
  for (const match of headerMatches) {
    const status = match[1].toLowerCase();
    if (status === 'completed' || status === 'done') completed++;
    else if (status === 'in-progress' || status === 'wip') inProgress++;
    else pending++;
  }

  const total = completed + inProgress + pending;
  const progress = total > 0 ? Math.round((completed / total) * 100) : 0;

  return {
    id: dirName,
    title: frontmatter.title || dirName,
    status: frontmatter.status || 'pending',
    priority: frontmatter.priority || 'medium',
    issue: frontmatter.issue || null,
    branch: frontmatter.branch || null,
    created: frontmatter.created || null,
    modified: stat.mtime.toISOString(),
    phases: { completed, inProgress, pending, total },
    progress,
    path: dirPath,
  };
}

// --- Dashboard HTML ---
function renderDashboard(plans, dir) {
  const statusColors = {
    completed: '#22c55e',
    'in-progress': '#f59e0b',
    pending: '#64748b',
  };

  const priorityColors = {
    high: '#ef4444',
    medium: '#f59e0b',
    low: '#64748b',
  };

  const planCards = plans.map(plan => `
    <div class="plan-card" data-id="${plan.id}">
      <div class="plan-header">
        <h3>${plan.title}</h3>
        <span class="priority" style="background: ${priorityColors[plan.priority] || '#64748b'}">${plan.priority}</span>
      </div>
      <div class="plan-status" style="color: ${statusColors[plan.status] || '#64748b'}">
        ${plan.status}
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${plan.progress}%"></div>
      </div>
      <div class="progress-text">${plan.progress}% complete (${plan.phases.completed}/${plan.phases.total} phases)</div>
      <div class="phases">
        <span class="phase completed">✓ ${plan.phases.completed}</span>
        <span class="phase in-progress">◐ ${plan.phases.inProgress}</span>
        <span class="phase pending">○ ${plan.phases.pending}</span>
      </div>
      <div class="meta">
        ${plan.issue ? `<a href="${plan.issue}" target="_blank" rel="noopener">Issue ↗</a>` : ''}
        ${plan.branch ? `<span class="branch">⎇ ${plan.branch}</span>` : ''}
      </div>
      <div class="modified">Updated: ${new Date(plan.modified).toLocaleString()}</div>
    </div>
  `).join('\n');

  const summary = {
    total: plans.length,
    completed: plans.filter(p => p.status === 'completed').length,
    inProgress: plans.filter(p => p.status === 'in-progress').length,
    pending: plans.filter(p => !['completed', 'in-progress'].includes(p.status)).length,
  };

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plans Kanban — ${path.basename(dir)}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%);
      min-height: 100vh;
      color: #e2e8f0;
      padding: 2rem;
    }
    .header {
      text-align: center;
      margin-bottom: 2rem;
    }
    h1 {
      color: #f59e0b;
      font-size: 1.8rem;
      margin-bottom: 0.5rem;
    }
    .summary {
      display: flex;
      justify-content: center;
      gap: 2rem;
      margin-bottom: 2rem;
      flex-wrap: wrap;
    }
    .summary-item {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      text-align: center;
      min-width: 120px;
    }
    .summary-item .count {
      font-size: 2rem;
      font-weight: bold;
    }
    .summary-item .label {
      font-size: 0.8rem;
      color: #94a3b8;
      text-transform: uppercase;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
      gap: 1.5rem;
      max-width: 1400px;
      margin: 0 auto;
    }
    .plan-card {
      background: rgba(255, 255, 255, 0.05);
      backdrop-filter: blur(10px);
      border: 1px solid rgba(255, 255, 255, 0.1);
      border-radius: 16px;
      padding: 1.5rem;
      transition: transform 0.2s, box-shadow 0.2s;
    }
    .plan-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 20px 40px rgba(0, 0, 0, 0.3);
    }
    .plan-header {
      display: flex;
      justify-content: space-between;
      align-items: flex-start;
      margin-bottom: 0.5rem;
    }
    .plan-header h3 { font-size: 1.1rem; color: #fff; }
    .priority {
      font-size: 0.7rem;
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      color: #fff;
      text-transform: uppercase;
      font-weight: 600;
    }
    .plan-status {
      font-size: 0.85rem;
      text-transform: capitalize;
      margin-bottom: 1rem;
      font-weight: 500;
    }
    .progress-bar {
      height: 8px;
      background: rgba(255, 255, 255, 0.1);
      border-radius: 4px;
      overflow: hidden;
      margin-bottom: 0.5rem;
    }
    .progress-fill {
      height: 100%;
      background: linear-gradient(90deg, #f59e0b, #f97316);
      border-radius: 4px;
      transition: width 0.5s ease;
    }
    .progress-text {
      font-size: 0.8rem;
      color: #94a3b8;
      margin-bottom: 1rem;
    }
    .phases {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
    }
    .phase { font-size: 0.85rem; }
    .phase.completed { color: #22c55e; }
    .phase.in-progress { color: #f59e0b; }
    .phase.pending { color: #64748b; }
    .meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
      flex-wrap: wrap;
    }
    .meta a {
      color: #60a5fa;
      text-decoration: none;
      font-size: 0.8rem;
    }
    .meta a:hover { text-decoration: underline; }
    .branch {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
      font-family: monospace;
    }
    .modified {
      font-size: 0.75rem;
      color: #64748b;
    }
    .empty {
      text-align: center;
      padding: 4rem;
      color: #64748b;
      grid-column: 1 / -1;
    }
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #475569;
      font-size: 0.75rem;
    }
    @media (max-width: 768px) {
      body { padding: 1rem; }
      .dashboard { grid-template-columns: 1fr; }
      .summary { gap: 0.5rem; }
    }
  </style>
</head>
<body>
  <div class="header">
    <h1>📋 Plans Dashboard</h1>
    <p style="color: #64748b; font-size: 0.9rem;">${path.basename(path.resolve(dir))}</p>
  </div>
  <div class="summary">
    <div class="summary-item"><div class="count">${summary.total}</div><div class="label">Total</div></div>
    <div class="summary-item"><div class="count" style="color:#22c55e">${summary.completed}</div><div class="label">Completed</div></div>
    <div class="summary-item"><div class="count" style="color:#f59e0b">${summary.inProgress}</div><div class="label">In Progress</div></div>
    <div class="summary-item"><div class="count" style="color:#64748b">${summary.pending}</div><div class="label">Pending</div></div>
  </div>
  <div class="dashboard">
    ${plans.length > 0 ? planCards : '<div class="empty">No plans found. Create a plan.md file in a subdirectory to get started.</div>'}
  </div>
  <div class="footer">⚡ PikaKit v${PIKAKIT_VERSION} | Plans Kanban v${VERSION}</div>
</body>
</html>`;
}

// --- CORS headers ---
function setCorsHeaders(res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
}

// --- HTTP Server ---
const server = http.createServer((req, res) => {
  const reqUrl = new URL(req.url, `http://${req.headers.host}`);
  const pathname = reqUrl.pathname;
  const dir = reqUrl.searchParams.get('dir') || config.dir;

  // CORS preflight
  if (req.method === 'OPTIONS') {
    setCorsHeaders(res);
    res.writeHead(204);
    res.end();
    return;
  }

  // API: all plans
  if (pathname === '/api/plans') {
    const plans = scanPlans(dir);
    setCorsHeaders(res);
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ plans, directory: path.resolve(dir), version: VERSION }));
    return;
  }

  // API: single plan
  const planMatch = pathname.match(/^\/api\/plans\/([^/]+)$/);
  if (planMatch) {
    const plans = scanPlans(dir);
    const plan = plans.find(p => p.id === planMatch[1]);
    setCorsHeaders(res);
    if (plan) {
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(plan));
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Plan not found' }));
    }
    return;
  }

  // Dashboard
  if (pathname === '/' || pathname === '/kanban') {
    const plans = scanPlans(dir);
    const html = renderDashboard(plans, dir);
    res.writeHead(200, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(html);
    return;
  }

  // 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ error: 'Not Found' }));
});

// --- Port Finder ---
function findPort(startPort, callback) {
  const testServer = http.createServer();
  testServer.listen(startPort, config.host, () => {
    testServer.close(() => callback(startPort));
  });
  testServer.on('error', () => {
    if (startPort < 3550) {
      findPort(startPort + 1, callback);
    } else {
      console.error(JSON.stringify({ error: 'ERR_NO_AVAILABLE_PORT', message: 'All ports 3500-3550 occupied' }));
      process.exit(1);
    }
  });
}

// --- Graceful Shutdown ---
function shutdown() {
  const tmpDir = os.tmpdir();
  const pidFile = path.join(tmpDir, `plans-kanban-${server.address()?.port || config.port}.pid`);
  try { fs.unlinkSync(pidFile); } catch (e) { /* ignore */ }
  server.close(() => process.exit(0));
  setTimeout(() => process.exit(1), 3000); // Force after 3s
}

process.on('SIGTERM', shutdown);
process.on('SIGINT', shutdown);

// --- Start ---
findPort(config.port, (port) => {
  server.listen(port, config.host, () => {
    const resolvedDir = path.resolve(config.dir);
    const localUrl = `http://localhost:${port}/kanban?dir=${encodeURIComponent(resolvedDir)}`;
    const networkUrl = config.host === '0.0.0.0'
      ? `http://${getNetworkIP()}:${port}/kanban?dir=${encodeURIComponent(resolvedDir)}`
      : null;

    // Save PID file
    const pidFile = path.join(os.tmpdir(), `plans-kanban-${port}.pid`);
    fs.writeFileSync(pidFile, process.pid.toString());

    console.log(JSON.stringify({
      success: true,
      url: localUrl,
      ...(networkUrl && { networkUrl }),
      port,
      pid: process.pid,
      directory: resolvedDir,
      version: VERSION,
    }));

    // Open browser
    if (config.open) {
      const opener = process.platform === 'darwin' ? 'open'
        : process.platform === 'win32' ? 'start' : 'xdg-open';
      exec(`${opener} "${localUrl}"`);
    }
  });
});
