#!/usr/bin/env node
/**
 * Plans Kanban Dashboard Server
 * 
 * Usage:
 *   node server.cjs --dir ./plans --open
 *   node server.cjs --dir ./plans --host 0.0.0.0 --port 3500
 *   node server.cjs --stop
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { spawn, execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
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

// Stop all servers
if (config.stop) {
    const tmpDir = require('os').tmpdir();
    const pidFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith('plans-kanban-') && f.endsWith('.pid'));

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

    console.log(JSON.stringify({ success: true, message: 'All servers stopped' }));
    process.exit(0);
}

if (!config.dir) {
    console.error('Error: --dir is required');
    process.exit(1);
}

// Get local network IP
function getNetworkIP() {
    const interfaces = require('os').networkInterfaces();
    for (const name of Object.keys(interfaces)) {
        for (const iface of interfaces[name]) {
            if (iface.family === 'IPv4' && !iface.internal) {
                return iface.address;
            }
        }
    }
    return 'localhost';
}

// Scan for plan directories
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
                const plan = parsePlan(planPath, entry.name);
                plans.push(plan);
            }
        }
    }

    return plans.sort((a, b) => new Date(b.modified) - new Date(a.modified));
}

// Parse plan.md file
function parsePlan(planPath, dirName) {
    const content = fs.readFileSync(planPath, 'utf8');
    const stat = fs.statSync(planPath);

    // Parse frontmatter
    const frontmatter = {};
    const fmMatch = content.match(/^---\n([\s\S]*?)\n---/);
    if (fmMatch) {
        fmMatch[1].split('\n').forEach(line => {
            const [key, ...valueParts] = line.split(':');
            if (key && valueParts.length) {
                frontmatter[key.trim()] = valueParts.join(':').trim();
            }
        });
    }

    // Count phases
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

// Generate dashboard HTML
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
    <div class="plan-card">
      <div class="plan-header">
        <h3>${plan.title}</h3>
        <span class="priority" style="background: ${priorityColors[plan.priority]}">${plan.priority}</span>
      </div>
      <div class="plan-status" style="color: ${statusColors[plan.status]}">
        ${plan.status}
      </div>
      <div class="progress-bar">
        <div class="progress-fill" style="width: ${plan.progress}%"></div>
      </div>
      <div class="progress-text">${plan.progress}% complete</div>
      <div class="phases">
        <span class="phase completed">✓ ${plan.phases.completed}</span>
        <span class="phase in-progress">◐ ${plan.phases.inProgress}</span>
        <span class="phase pending">○ ${plan.phases.pending}</span>
      </div>
      <div class="meta">
        ${plan.issue ? `<a href="${plan.issue}" target="_blank">Issue</a>` : ''}
        ${plan.branch ? `<span class="branch">${plan.branch}</span>` : ''}
      </div>
      <div class="modified">Updated: ${new Date(plan.modified).toLocaleString()}</div>
    </div>
  `).join('\n');

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Plans Kanban - ${dir}</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif;
      background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%);
      min-height: 100vh;
      color: #e2e8f0;
      padding: 2rem;
    }
    h1 {
      text-align: center;
      margin-bottom: 2rem;
      color: #f59e0b;
    }
    .dashboard {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
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
    }
    .plan-status {
      font-size: 0.85rem;
      text-transform: capitalize;
      margin-bottom: 1rem;
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
      transition: width 0.3s;
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
    .phase {
      font-size: 0.85rem;
    }
    .phase.completed { color: #22c55e; }
    .phase.in-progress { color: #f59e0b; }
    .phase.pending { color: #64748b; }
    .meta {
      display: flex;
      gap: 0.5rem;
      margin-bottom: 0.5rem;
    }
    .meta a {
      color: #60a5fa;
      text-decoration: none;
      font-size: 0.8rem;
    }
    .branch {
      font-size: 0.75rem;
      background: rgba(255, 255, 255, 0.1);
      padding: 0.2rem 0.5rem;
      border-radius: 4px;
    }
    .modified {
      font-size: 0.75rem;
      color: #64748b;
    }
    .empty {
      text-align: center;
      padding: 4rem;
      color: #64748b;
    }
    .footer {
      text-align: center;
      margin-top: 2rem;
      color: #64748b;
      font-size: 0.8rem;
    }
  </style>
</head>
<body>
  <h1>📋 Plans Dashboard</h1>
  <div class="dashboard">
    ${plans.length > 0 ? planCards : '<div class="empty">No plans found. Create a plan.md file to get started.</div>'}
  </div>
  <div class="footer">⚡ PikaKit v3.2.0 | Plans Kanban Dashboard</div>
</body>
</html>`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    const dir = query.dir || config.dir;

    // API endpoint
    if (pathname === '/api/plans') {
        const plans = scanPlans(dir);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ plans, directory: dir }));
        return;
    }

    // Dashboard
    if (pathname === '/' || pathname === '/kanban') {
        const plans = scanPlans(dir);
        const html = renderDashboard(plans, dir);
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(html);
        return;
    }

    // 404
    res.writeHead(404, { 'Content-Type': 'text/plain' });
    res.end('Not Found');
});

// Find available port
function findPort(startPort, callback) {
    const testServer = http.createServer();
    testServer.listen(startPort, config.host, () => {
        testServer.close(() => callback(startPort));
    });
    testServer.on('error', () => {
        if (startPort < 3550) {
            findPort(startPort + 1, callback);
        } else {
            console.error('No available ports');
            process.exit(1);
        }
    });
}

// Start server
findPort(config.port, (port) => {
    server.listen(port, config.host, () => {
        const localUrl = `http://localhost:${port}/kanban?dir=${encodeURIComponent(path.resolve(config.dir))}`;
        const networkUrl = config.host === '0.0.0.0'
            ? `http://${getNetworkIP()}:${port}/kanban?dir=${encodeURIComponent(path.resolve(config.dir))}`
            : localUrl;

        // Save PID
        const tmpDir = require('os').tmpdir();
        fs.writeFileSync(path.join(tmpDir, `plans-kanban-${port}.pid`), process.pid.toString());

        console.log(JSON.stringify({
            success: true,
            url: localUrl,
            networkUrl: networkUrl,
            port: port,
            directory: path.resolve(config.dir),
        }));

        // Open browser
        if (config.open) {
            const opener = process.platform === 'darwin' ? 'open'
                : process.platform === 'win32' ? 'start' : 'xdg-open';
            require('child_process').exec(`${opener} "${localUrl}"`);
        }
    });
});
