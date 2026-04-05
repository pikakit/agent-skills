// @ts-nocheck
/**
 * Markdown Preview Server
 * Renders markdown files with a reading-optimized theme.
 *
 * Usage:
 *   npx tsx server.ts --file ./README.md --open
 *   npx tsx server.ts --dir ./docs --open
 *   npx tsx server.ts --stop
 */

import * as http from 'node:http';
import * as fs from 'node:fs';
import * as path from 'node:path';
import { execSync } from 'node:child_process';

const DEFAULT_PORT = 3456;

interface ServerOptions {
  file?: string;
  dir?: string;
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
      case '--dir': opts.dir = args[++i]; break;
      case '--port': opts.port = parseInt(args[++i], 10); break;
      case '--open': opts.open = true; break;
      case '--stop': opts.stop = true; break;
    }
  }
  return opts;
}

function escapeHtml(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function simpleMarkdownToHtml(md: string): string {
  let html = escapeHtml(md);
  // Headers
  html = html.replace(/^### (.+)$/gm, '<h3>$1</h3>');
  html = html.replace(/^## (.+)$/gm, '<h2>$1</h2>');
  html = html.replace(/^# (.+)$/gm, '<h1>$1</h1>');
  // Bold/italic
  html = html.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  html = html.replace(/\*(.+?)\*/g, '<em>$1</em>');
  // Code blocks
  html = html.replace(/```(\w*)\n([\s\S]*?)```/g, '<pre><code class="$1">$2</code></pre>');
  html = html.replace(/`([^`]+)`/g, '<code>$1</code>');
  // Lists
  html = html.replace(/^- (.+)$/gm, '<li>$1</li>');
  html = html.replace(/(<li>.*<\/li>\n?)+/g, '<ul>$&</ul>');
  // Links
  html = html.replace(/\[([^\]]+)\]\(([^)]+)\)/g, '<a href="$2">$1</a>');
  // Paragraphs
  html = html.replace(/\n\n/g, '</p><p>');
  html = '<p>' + html + '</p>';
  // Horizontal rules
  html = html.replace(/<p>---<\/p>/g, '<hr>');
  return html;
}

function buildViewerHtml(content: string, title: string): string {
  const rendered = simpleMarkdownToHtml(content);
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title} — PikaKit Viewer</title>
  <style>
    @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,400;0,700;1,400&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@400;500&display=swap');
    :root { --bg: #fafaf9; --text: #1c1917; --muted: #78716c; --accent: #2563eb; --border: #e7e5e4; }
    .dark { --bg: #0f172a; --text: #e2e8f0; --muted: #94a3b8; --accent: #60a5fa; --border: #334155; }
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body { font-family: 'Inter', system-ui, sans-serif; background: var(--bg); color: var(--text); line-height: 1.7; }
    .toolbar { position: fixed; top: 0; width: 100%; background: var(--bg); border-bottom: 1px solid var(--border); padding: 8px 24px; display: flex; justify-content: space-between; z-index: 10; }
    .toolbar button { background: none; border: 1px solid var(--border); color: var(--text); padding: 4px 12px; border-radius: 4px; cursor: pointer; }
    article { max-width: 720px; margin: 64px auto 80px; padding: 0 24px; }
    h1, h2, h3 { font-family: 'Libre Baskerville', serif; margin: 1.5em 0 0.5em; }
    h1 { font-size: 2em; border-bottom: 2px solid var(--border); padding-bottom: 0.3em; }
    h2 { font-size: 1.5em; }
    h3 { font-size: 1.2em; }
    code { font-family: 'JetBrains Mono', monospace; background: var(--border); padding: 2px 6px; border-radius: 3px; font-size: 0.9em; }
    pre { background: var(--border); padding: 16px; border-radius: 6px; overflow-x: auto; margin: 1em 0; }
    pre code { background: none; padding: 0; }
    a { color: var(--accent); text-decoration: none; }
    a:hover { text-decoration: underline; }
    hr { border: none; border-top: 1px solid var(--border); margin: 2em 0; }
    ul { padding-left: 1.5em; }
    li { margin: 0.3em 0; }
    .footer { text-align: center; color: var(--muted); font-size: 12px; padding: 16px; }
  </style>
</head>
<body>
  <div class="toolbar">
    <span style="font-size:13px;color:var(--muted)">📖 ${title}</span>
    <button onclick="document.body.classList.toggle('dark')">🌓 Theme</button>
  </div>
  <article>${rendered}</article>
  <div class="footer">⚡ PikaKit Markdown Viewer</div>
</body>
</html>`;
}

function buildDirectoryHtml(dirPath: string): string {
  const files = fs.readdirSync(dirPath).filter(f => f.endsWith('.md')).sort();
  const items = files.map(f => `<li><a href="/${encodeURIComponent(f)}">${f}</a></li>`).join('\n');
  return `<!DOCTYPE html>
<html><head><title>Docs — PikaKit</title>
<style>body{font-family:Inter,system-ui;max-width:600px;margin:40px auto;padding:0 20px}a{color:#2563eb}li{margin:8px 0}</style>
</head><body><h1>📂 Documents</h1><ul>${items}</ul><p style="color:#999;font-size:12px">⚡ PikaKit</p></body></html>`;
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

  const server = http.createServer((req, res) => {
    const urlPath = decodeURIComponent(req.url || '/');

    if (opts.file) {
      const content = fs.readFileSync(opts.file, 'utf-8');
      const title = path.basename(opts.file);
      res.writeHead(200, { 'Content-Type': 'text/html' });
      res.end(buildViewerHtml(content, title));
      return;
    }

    if (opts.dir) {
      if (urlPath === '/') {
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(buildDirectoryHtml(opts.dir));
        return;
      }
      const filePath = path.join(opts.dir, urlPath.slice(1));
      if (fs.existsSync(filePath) && filePath.endsWith('.md')) {
        const content = fs.readFileSync(filePath, 'utf-8');
        res.writeHead(200, { 'Content-Type': 'text/html' });
        res.end(buildViewerHtml(content, path.basename(filePath)));
        return;
      }
    }

    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'error', error: { code: 'ERR_FILE_NOT_FOUND', message: 'Not found' } }));
  });

  server.listen(opts.port, () => {
    const url = `http://localhost:${opts.port}`;
    console.log(JSON.stringify({ status: 'success', data: { url, port: opts.port, file: opts.file || null, dir: opts.dir || null } }));
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
