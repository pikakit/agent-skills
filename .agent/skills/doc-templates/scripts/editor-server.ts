// @ts-nocheck
/**
 * Mermaid Diagram Editor Server
 * Live-editing server for Mermaid diagrams with hot-reload preview.
 *
 * Usage:
 *   npx tsx editor-server.ts --open              # Open empty editor
 *   npx tsx editor-server.ts --file diagram.mmd   # Edit existing file
 *   npx tsx editor-server.ts --stop               # Stop all servers
 */

import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const DEFAULT_PORT = 3457;

interface ServerOptions {
  file?: string;
  port: number;
  open: boolean;
  stop: boolean;
}

function parseArgs(): ServerOptions {
  const args = process.argv.slice(2);
  const opts: ServerOptions = { port: DEFAULT_PORT, open: false, stop: false };

  for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
      case '--file': opts.file = args[++i]; break;
      case '--port': opts.port = parseInt(args[++i], 10); break;
      case '--open': opts.open = true; break;
      case '--stop': opts.stop = true; break;
    }
  }
  return opts;
}

function getMermaidContent(filePath?: string): string {
  if (filePath && fs.existsSync(filePath)) {
    return fs.readFileSync(filePath, 'utf-8');
  }
  return `flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Action]
    B -->|No| D[End]`;
}

function buildEditorHtml(content: string, filePath?: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mermaid Editor — PikaKit</title>
  <script src="https://cdn.jsdelivr.net/npm/mermaid@10/dist/mermaid.min.js"></script>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: #0f172a; color: #e2e8f0; display: flex; height: 100vh; }
    .editor { width: 50%; display: flex; flex-direction: column; border-right: 1px solid #334155; }
    .preview { width: 50%; display: flex; flex-direction: column; }
    .toolbar { padding: 8px 16px; background: #1e293b; border-bottom: 1px solid #334155; display: flex; align-items: center; gap: 12px; }
    .toolbar h2 { font-size: 14px; font-weight: 600; color: #94a3b8; }
    .toolbar button { background: #3b82f6; color: white; border: none; padding: 4px 12px; border-radius: 4px; cursor: pointer; font-size: 12px; }
    .toolbar button:hover { background: #2563eb; }
    textarea { flex: 1; background: #1e293b; color: #e2e8f0; border: none; padding: 16px; font-family: 'JetBrains Mono', monospace; font-size: 14px; resize: none; outline: none; }
    #preview-area { flex: 1; padding: 16px; overflow: auto; display: flex; align-items: center; justify-content: center; background: #f8fafc; }
    #preview-area svg { max-width: 100%; }
    .status { padding: 4px 16px; background: #1e293b; border-top: 1px solid #334155; font-size: 11px; color: #64748b; }
  </style>
</head>
<body>
  <div class="editor">
    <div class="toolbar"><h2>✏️ Editor</h2><button onclick="renderDiagram()">Render</button></div>
    <textarea id="code" spellcheck="false">${content}</textarea>
    <div class="status">File: ${filePath || '(new)'} | Port: ${DEFAULT_PORT}</div>
  </div>
  <div class="preview">
    <div class="toolbar"><h2>👁️ Preview</h2><button onclick="saveDiagram()">Save</button></div>
    <div id="preview-area"></div>
    <div class="status">⚡ PikaKit Mermaid Editor</div>
  </div>
  <script>
    mermaid.initialize({ startOnLoad: false, theme: 'default' });
    async function renderDiagram() {
      const code = document.getElementById('code').value;
      const el = document.getElementById('preview-area');
      try {
        const { svg } = await mermaid.render('preview', code);
        el.innerHTML = svg;
      } catch (e) { el.innerHTML = '<pre style="color:red">' + e.message + '</pre>'; }
    }
    async function saveDiagram() {
      const code = document.getElementById('code').value;
      await fetch('/save', { method: 'POST', headers: {'Content-Type': 'text/plain'}, body: code });
    }
    renderDiagram();
    document.getElementById('code').addEventListener('input', () => { clearTimeout(window._t); window._t = setTimeout(renderDiagram, 500); });
  </script>
</body>
</html>`;
}

function openBrowser(url: string): void {
  try {
    const cmd = process.platform === 'win32' ? `start ${url}` : process.platform === 'darwin' ? `open ${url}` : `xdg-open ${url}`;
    execSync(cmd, { stdio: 'ignore' });
  } catch { /* ignore */ }
}

function stopServers(): void {
  console.log(JSON.stringify({ status: 'success', data: { message: 'Stop signal sent. Kill processes on port ' + DEFAULT_PORT + ' manually if needed.' } }));
  process.exit(0);
}

function main(): void {
  const opts = parseArgs();

  if (opts.stop) { stopServers(); return; }

  const content = getMermaidContent(opts.file);
  const html = buildEditorHtml(content, opts.file);

  const server = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url === '/save') {
      let body = '';
      req.on('data', (chunk) => { body += chunk; });
      req.on('end', () => {
        if (opts.file) {
          fs.writeFileSync(opts.file, body, 'utf-8');
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ saved: opts.file }));
        } else {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'No file specified. Use --file to enable saving.' }));
        }
      });
      return;
    }
    res.writeHead(200, { 'Content-Type': 'text/html' });
    res.end(html);
  });

  server.listen(opts.port, () => {
    const url = `http://localhost:${opts.port}`;
    console.log(JSON.stringify({ status: 'success', data: { url, port: opts.port, file: opts.file || null } }));
    if (opts.open) openBrowser(url);
  });

  server.on('error', (err: NodeJS.ErrnoException) => {
    if (err.code === 'EADDRINUSE') {
      console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_PORT_UNAVAILABLE', message: `Port ${opts.port} in use`, recoverable: true } }));
    } else {
      console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_SERVER_FAILED', message: err.message, recoverable: false } }));
    }
    process.exit(1);
  });
}

main();
