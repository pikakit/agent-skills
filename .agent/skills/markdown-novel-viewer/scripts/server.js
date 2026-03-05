#!/usr/bin/env node
/**
 * Markdown Novel Viewer — Background Preview Server
 *
 * Renders markdown files with a book-like reading experience.
 * Novel theme (light/dark), Mermaid diagrams, directory browsing.
 *
 * @version 2.0.0
 * @contract markdown-novel-viewer v2.0.0
 * @see references/engineering-spec.md
 *
 * Features:
 *  - Novel theme: Libre Baskerville + Inter + JetBrains Mono
 *  - Port auto-allocation: 3456-3500
 *  - Mermaid rendering: flowchart, sequence, pie, gantt, mindmap
 *  - Directory browsing with parent navigation
 *  - Keyboard shortcuts: T (theme), S (sidebar), ←→ (navigate), Esc (close)
 *  - Path traversal prevention
 *
 * Read-only: reads files, never modifies them.
 */

import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import os from 'node:os';
import { exec } from 'node:child_process';
import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

// Check for required dependencies
let marked, matter;
try {
    marked = require('marked');
    matter = require('gray-matter');
} catch {
    console.error(JSON.stringify({
        success: false,
        error: { code: 'ERR_DEPS_MISSING', message: 'Run: npm install marked gray-matter' }
    }));
    process.exit(1);
}

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
    file: null,
    dir: null,
    port: 3456,
    host: 'localhost',
    open: false,
    background: false,
    stop: false,
};

for (let i = 0; i < args.length; i++) {
    switch (args[i]) {
        case '--file': config.file = args[++i]; break;
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
    const tmpDir = os.tmpdir();
    const pidFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith('md-novel-viewer-') && f.endsWith('.pid'));

    pidFiles.forEach(pidFile => {
        const pid = fs.readFileSync(path.join(tmpDir, pidFile), 'utf8').trim();
        try {
            process.kill(parseInt(pid, 10));
            fs.unlinkSync(path.join(tmpDir, pidFile));
            console.log(`Stopped server with PID ${pid}`);
        } catch {
            fs.unlinkSync(path.join(tmpDir, pidFile));
        }
    });

    console.log(JSON.stringify({ success: true, message: 'All servers stopped' }));
    process.exit(0);
}

if (!config.file && !config.dir) {
    console.error(JSON.stringify({
        success: false,
        error: { code: 'ERR_MISSING_ARG', message: '--file or --dir is required' }
    }));
    process.exit(1);
}

// Resolve project root for path traversal prevention
const projectRoot = path.resolve(config.file ? path.dirname(config.file) : config.dir);

/**
 * Validate file path against traversal attacks.
 * Rejects paths containing .. that escape the target directory.
 */
function isPathSafe(requestedPath) {
    const resolved = path.resolve(requestedPath);
    return resolved.startsWith(projectRoot);
}

/** Get local network IP for remote access display. */
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

// Novel theme CSS
const novelThemeCSS = `
:root {
  --bg-primary: #faf8f3;
  --bg-secondary: #f5f3ee;
  --text-primary: #2d2d2d;
  --text-secondary: #5a5a5a;
  --accent: #8b4513;
  --code-bg: #f0ede6;
  --border: #e0ddd5;
  --content-width: 720px;
}

@media (prefers-color-scheme: dark) {
  :root {
    --bg-primary: #1a1a1a;
    --bg-secondary: #242424;
    --text-primary: #e8e8e8;
    --text-secondary: #a0a0a0;
    --accent: #d4a574;
    --code-bg: #2d2d2d;
    --border: #3a3a3a;
  }
}

[data-theme="dark"] {
  --bg-primary: #1a1a1a;
  --bg-secondary: #242424;
  --text-primary: #e8e8e8;
  --text-secondary: #a0a0a0;
  --accent: #d4a574;
  --code-bg: #2d2d2d;
  --border: #3a3a3a;
}

[data-theme="light"] {
  --bg-primary: #faf8f3;
  --bg-secondary: #f5f3ee;
  --text-primary: #2d2d2d;
  --text-secondary: #5a5a5a;
  --accent: #8b4513;
  --code-bg: #f0ede6;
  --border: #e0ddd5;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  background: var(--bg-primary);
  color: var(--text-primary);
  line-height: 1.8;
  min-height: 100vh;
}

.layout { display: flex; min-height: 100vh; }

.sidebar {
  width: 260px;
  background: var(--bg-secondary);
  border-right: 1px solid var(--border);
  padding: 2rem 1rem;
  position: fixed;
  top: 0;
  left: -260px;
  height: 100vh;
  overflow-y: auto;
  transition: left 0.3s ease;
  z-index: 100;
}

.sidebar.open { left: 0; }

.sidebar h3 {
  font-family: 'Libre Baskerville', Georgia, serif;
  color: var(--accent);
  font-size: 1rem;
  margin-bottom: 1rem;
}

.sidebar ul { list-style: none; padding: 0; }

.sidebar li {
  margin-bottom: 0.25rem;
}

.sidebar a {
  display: block;
  padding: 0.4rem 0.75rem;
  color: var(--text-secondary);
  text-decoration: none;
  border-radius: 6px;
  font-size: 0.85rem;
}

.sidebar a:hover, .sidebar a.active {
  background: var(--bg-primary);
  color: var(--accent);
}

.container {
  max-width: var(--content-width);
  margin: 0 auto;
  padding: 4rem 2rem;
}

h1, h2, h3, h4, h5, h6 {
  font-family: 'Libre Baskerville', Georgia, serif;
  color: var(--accent);
  margin-top: 2rem;
  margin-bottom: 1rem;
  line-height: 1.3;
}

h1 { font-size: 2.5rem; border-bottom: 2px solid var(--border); padding-bottom: 0.5rem; }
h2 { font-size: 1.8rem; }
h3 { font-size: 1.4rem; }

p { margin-bottom: 1.5rem; }

a { color: var(--accent); text-decoration: none; }
a:hover { text-decoration: underline; }

code {
  font-family: 'JetBrains Mono', 'Fira Code', monospace;
  background: var(--code-bg);
  padding: 0.2rem 0.4rem;
  border-radius: 4px;
  font-size: 0.9em;
}

pre {
  background: var(--code-bg);
  padding: 1.5rem;
  border-radius: 8px;
  overflow-x: auto;
  margin-bottom: 1.5rem;
  border: 1px solid var(--border);
}

pre code { background: none; padding: 0; }

blockquote {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 1.5rem 0;
}

ul, ol { margin-bottom: 1.5rem; padding-left: 2rem; }
li { margin-bottom: 0.5rem; }

table { width: 100%; border-collapse: collapse; margin-bottom: 1.5rem; }

th, td {
  border: 1px solid var(--border);
  padding: 0.75rem;
  text-align: left;
}

th { background: var(--bg-secondary); color: var(--accent); }

img { max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0; }

.mermaid {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  text-align: center;
}

.toolbar {
  position: fixed;
  top: 1rem;
  right: 1rem;
  display: flex;
  gap: 0.5rem;
  z-index: 200;
}

.toolbar button {
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: 0.5rem 0.75rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.85rem;
}

.toolbar button:hover { background: var(--accent); color: white; }

.meta {
  color: var(--text-secondary);
  font-size: 0.9rem;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.footer {
  text-align: center;
  color: var(--text-secondary);
  font-size: 0.8rem;
  margin-top: 4rem;
  padding-top: 2rem;
  border-top: 1px solid var(--border);
}

.kbd {
  display: inline-block;
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
  font-family: 'JetBrains Mono', monospace;
  background: var(--code-bg);
  border: 1px solid var(--border);
  border-radius: 4px;
  margin-left: 0.5rem;
}

/* Directory browser */
.directory { list-style: none; padding: 0; }
.directory li { padding: 0.75rem; border-bottom: 1px solid var(--border); }
.directory a { display: flex; align-items: center; gap: 0.5rem; }
.directory .icon { font-size: 1.2rem; }
`;

/** Extract headings from markdown for sidebar navigation. */
function extractHeadings(mdContent) {
    const headings = [];
    const regex = /^(#{2,3})\s+(.+)$/gm;
    let match;
    while ((match = regex.exec(mdContent)) !== null) {
        const level = match[1].length;
        const text = match[2].replace(/[*_`]/g, '');
        const id = text.toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
        headings.push({ level, text, id });
    }
    return headings;
}

/** Render markdown to HTML with frontmatter extraction. */
function renderMarkdown(content) {
    const { data: meta, content: mdContent } = matter(content);

    // Convert Mermaid blocks before markdown rendering
    let processedMd = mdContent.replace(/```mermaid\n([\s\S]*?)```/g, (_match, code) => {
        return `<div class="mermaid">${code.trim()}</div>`;
    });

    // Add IDs to headings for sidebar navigation
    processedMd = processedMd.replace(/^(#{2,3})\s+(.+)$/gm, (_match, hashes, text) => {
        const id = text.replace(/[*_`]/g, '').toLowerCase().replace(/[^\w]+/g, '-').replace(/^-+|-+$/g, '');
        return `${hashes} <a id="${id}"></a>${text}`;
    });

    const html = marked.parse(processedMd);
    const headings = extractHeadings(mdContent);

    return { html, meta, headings };
}

/** Generate sidebar HTML from headings. */
function renderSidebar(headings) {
    if (headings.length === 0) return '';
    const items = headings.map(h => {
        const indent = h.level === 3 ? 'style="padding-left: 1.5rem; font-size: 0.8rem;"' : '';
        return `<li><a href="#${h.id}" ${indent}>${h.text}</a></li>`;
    }).join('\n');
    return `
    <nav class="sidebar" id="sidebar">
      <h3>📑 Contents</h3>
      <ul>${items}</ul>
    </nav>`;
}

/** Generate full viewer HTML page. */
function renderViewer(content, filePath) {
    const { html, meta, headings } = renderMarkdown(content);
    const title = meta.title || path.basename(filePath, '.md');
    const sidebar = renderSidebar(headings);
    const hasSidebar = headings.length > 0;

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&family=Libre+Baskerville:wght@400;700&family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>${novelThemeCSS}</style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
  <div class="toolbar">
    ${hasSidebar ? '<button onclick="toggleSidebar()" title="Toggle sidebar (S)">☰ Nav</button>' : ''}
    <button onclick="toggleTheme()" title="Toggle theme (T)">🌓 Theme</button>
  </div>
  ${sidebar}
  <div class="layout">
    <div class="container">
      ${meta.title ? `<div class="meta">${meta.date || ''}</div>` : ''}
      ${html}
      <div class="footer">
        ⚡ PikaKit v3.9.74 | Markdown Novel Viewer
        <br><span style="font-size:0.7rem">
          <kbd class="kbd">T</kbd> Theme
          ${hasSidebar ? '<kbd class="kbd">S</kbd> Sidebar' : ''}
          <kbd class="kbd">←→</kbd> Scroll
          <kbd class="kbd">Esc</kbd> Close sidebar
        </span>
      </div>
    </div>
  </div>
  <script>
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: true,
      theme: document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'default'
    });

    // Theme toggle
    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
      mermaid.initialize({ theme: next === 'dark' ? 'dark' : 'default' });
      document.querySelectorAll('.mermaid').forEach(el => {
        el.removeAttribute('data-processed');
      });
      mermaid.init();
    }

    // Sidebar toggle
    function toggleSidebar() {
      const sidebar = document.getElementById('sidebar');
      if (sidebar) sidebar.classList.toggle('open');
    }

    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);

    // Keyboard shortcuts (4 keys per engineering-spec Section 8)
    document.addEventListener('keydown', (e) => {
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'TEXTAREA') return;
      switch (e.key) {
        case 't': case 'T': toggleTheme(); break;
        case 's': case 'S': toggleSidebar(); break;
        case 'ArrowLeft': window.scrollBy(0, -window.innerHeight * 0.8); break;
        case 'ArrowRight': window.scrollBy(0, window.innerHeight * 0.8); break;
        case 'Escape': {
          const sidebar = document.getElementById('sidebar');
          if (sidebar) sidebar.classList.remove('open');
          break;
        }
      }
    });
  </script>
</body>
</html>`;
}

/** Generate directory browser HTML page. */
function renderDirectory(dirPath) {
    const entries = fs.readdirSync(dirPath, { withFileTypes: true });

    const items = entries
        .filter(e => !e.name.startsWith('.'))
        .sort((a, b) => {
            if (a.isDirectory() && !b.isDirectory()) return -1;
            if (!a.isDirectory() && b.isDirectory()) return 1;
            return a.name.localeCompare(b.name);
        })
        .map(entry => {
            const icon = entry.isDirectory() ? '📁' : '📄';
            const href = entry.isDirectory()
                ? `/browse?dir=${encodeURIComponent(path.join(dirPath, entry.name))}`
                : `/view?file=${encodeURIComponent(path.join(dirPath, entry.name))}`;
            return `<li><a href="${href}"><span class="icon">${icon}</span> ${entry.name}</a></li>`;
        })
        .join('\n');

    const parentDir = path.dirname(dirPath);
    const parentLink = parentDir !== dirPath
        ? `<li><a href="/browse?dir=${encodeURIComponent(parentDir)}"><span class="icon">📁</span> ..</a></li>`
        : '';

    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Browse: ${path.basename(dirPath)}</title>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap" rel="stylesheet">
  <style>${novelThemeCSS}</style>
</head>
<body>
  <div class="toolbar">
    <button onclick="toggleTheme()" title="Toggle theme (T)">🌓 Theme</button>
  </div>
  <div class="container">
    <h1>📂 ${path.basename(dirPath)}</h1>
    <ul class="directory">
      ${parentLink}
      ${items}
    </ul>
    <div class="footer">⚡ PikaKit v3.9.74 | Markdown Novel Viewer</div>
  </div>
  <script>
    function toggleTheme() {
      const html = document.documentElement;
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('theme', next);
    }
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) document.documentElement.setAttribute('data-theme', savedTheme);
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') toggleTheme();
    });
  </script>
</body>
</html>`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const reqUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const pathname = reqUrl.pathname;

    try {
        // View markdown file
        if (pathname === '/view' || pathname === '/') {
            const filePath = reqUrl.searchParams.get('file') || config.file;
            if (!filePath || !fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 'ERR_FILE_NOT_FOUND', message: 'File not found' } }));
                return;
            }

            // Path traversal prevention
            if (!isPathSafe(filePath)) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 'ERR_PATH_TRAVERSAL', message: 'Path traversal rejected' } }));
                return;
            }

            const content = fs.readFileSync(filePath, 'utf8');
            const html = renderViewer(content, filePath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        // Browse directory
        if (pathname === '/browse') {
            const dirPath = reqUrl.searchParams.get('dir') || config.dir;
            if (!dirPath || !fs.existsSync(dirPath)) {
                res.writeHead(404, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 'ERR_DIR_NOT_FOUND', message: 'Directory not found' } }));
                return;
            }

            // Path traversal prevention
            if (!isPathSafe(dirPath)) {
                res.writeHead(403, { 'Content-Type': 'application/json' });
                res.end(JSON.stringify({ error: { code: 'ERR_PATH_TRAVERSAL', message: 'Path traversal rejected' } }));
                return;
            }

            const html = renderDirectory(dirPath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { code: 'ERR_NOT_FOUND', message: 'Route not found' } }));

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: { code: 'ERR_INTERNAL', message: error.message } }));
    }
});

/** Find available port within 3456-3500 range. */
function findPort(startPort) {
    return new Promise((resolve, reject) => {
        const testServer = http.createServer();
        testServer.listen(startPort, config.host, () => {
            testServer.close(() => resolve(startPort));
        });
        testServer.on('error', () => {
            if (startPort < 3500) {
                findPort(startPort + 1).then(resolve).catch(reject);
            } else {
                reject(new Error('ERR_PORT_EXHAUSTED: All ports 3456-3500 in use'));
            }
        });
    });
}

// Start server
try {
    const port = await findPort(config.port);
    server.listen(port, config.host, () => {
        const target = config.file
            ? `/view?file=${encodeURIComponent(path.resolve(config.file))}`
            : `/browse?dir=${encodeURIComponent(path.resolve(config.dir))}`;

        const localUrl = `http://localhost:${port}${target}`;
        const networkUrl = config.host === '0.0.0.0'
            ? `http://${getNetworkIP()}:${port}${target}`
            : localUrl;

        // Save PID for --stop
        const tmpDir = os.tmpdir();
        fs.writeFileSync(path.join(tmpDir, `md-novel-viewer-${port}.pid`), process.pid.toString());

        console.log(JSON.stringify({
            success: true,
            version: '2.0.0',
            url: localUrl,
            networkUrl,
            port,
        }));

        // Open browser
        if (config.open) {
            const opener = process.platform === 'darwin' ? 'open'
                : process.platform === 'win32' ? 'start' : 'xdg-open';
            exec(`${opener} "${localUrl}"`);
        }
    });
} catch (error) {
    console.error(JSON.stringify({
        success: false,
        error: { code: 'ERR_PORT_EXHAUSTED', message: error.message }
    }));
    process.exit(1);
}
