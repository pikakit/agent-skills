#!/usr/bin/env node
/**
 * Markdown Novel Viewer Server
 * 
 * Usage:
 *   node server.cjs --file ./README.md --open
 *   node server.cjs --dir ./docs --open
 *   node server.cjs --stop
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execSync } = require('child_process');

// Check for required dependencies
let marked, matter;
try {
    marked = require('marked');
    matter = require('gray-matter');
} catch (e) {
    console.error('Dependencies not installed. Run: npm install marked gray-matter');
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
    const tmpDir = require('os').tmpdir();
    const pidFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith('md-novel-viewer-') && f.endsWith('.pid'));

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

if (!config.file && !config.dir) {
    console.error('Error: --file or --dir is required');
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

pre code {
  background: none;
  padding: 0;
}

blockquote {
  border-left: 4px solid var(--accent);
  padding-left: 1.5rem;
  color: var(--text-secondary);
  font-style: italic;
  margin: 1.5rem 0;
}

ul, ol {
  margin-bottom: 1.5rem;
  padding-left: 2rem;
}

li { margin-bottom: 0.5rem; }

table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 1.5rem;
}

th, td {
  border: 1px solid var(--border);
  padding: 0.75rem;
  text-align: left;
}

th {
  background: var(--bg-secondary);
  color: var(--accent);
}

img {
  max-width: 100%;
  height: auto;
  border-radius: 8px;
  margin: 1rem 0;
}

.mermaid {
  background: var(--bg-secondary);
  padding: 1rem;
  border-radius: 8px;
  margin: 1.5rem 0;
  text-align: center;
}

.theme-toggle {
  position: fixed;
  top: 1rem;
  right: 1rem;
  background: var(--bg-secondary);
  border: 1px solid var(--border);
  padding: 0.5rem 1rem;
  border-radius: 8px;
  cursor: pointer;
  color: var(--text-primary);
  font-size: 0.9rem;
}

.theme-toggle:hover {
  background: var(--accent);
  color: white;
}

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

/* Directory browser */
.directory {
  list-style: none;
  padding: 0;
}

.directory li {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}

.directory a {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.directory .icon {
  font-size: 1.2rem;
}
`;

// Render markdown to HTML
function renderMarkdown(content) {
    // Parse frontmatter
    const { data: meta, content: mdContent } = matter(content);

    // Convert Mermaid blocks
    let html = mdContent.replace(/```mermaid\n([\s\S]*?)```/g, (match, code) => {
        return `<div class="mermaid">${code.trim()}</div>`;
    });

    // Render markdown
    html = marked.parse(html);

    return { html, meta };
}

// Generate viewer HTML
function renderViewer(content, filePath) {
    const { html, meta } = renderMarkdown(content);
    const title = meta.title || path.basename(filePath, '.md');

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
  <button class="theme-toggle" onclick="toggleTheme()">🌓 Theme</button>
  <div class="container">
    ${meta.title ? `<div class="meta">${meta.date || ''}</div>` : ''}
    ${html}
    <div class="footer">⚡ PikaKit v3.2.0 | Markdown Novel Viewer</div>
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
      
      // Re-render Mermaid with new theme
      mermaid.initialize({ theme: next === 'dark' ? 'dark' : 'default' });
      document.querySelectorAll('.mermaid').forEach(el => {
        el.removeAttribute('data-processed');
      });
      mermaid.init();
    }
    
    // Load saved theme
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
      document.documentElement.setAttribute('data-theme', savedTheme);
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.key === 't' || e.key === 'T') toggleTheme();
    });
  </script>
</body>
</html>`;
}

// Generate directory browser HTML
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

    // Parent directory link
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
  <button class="theme-toggle" onclick="toggleTheme()">🌓 Theme</button>
  <div class="container">
    <h1>📂 ${path.basename(dirPath)}</h1>
    <ul class="directory">
      ${parentLink}
      ${items}
    </ul>
    <div class="footer">⚡ PikaKit v3.2.0 | Markdown Novel Viewer</div>
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
  </script>
</body>
</html>`;
}

// Create HTTP server
const server = http.createServer((req, res) => {
    const parsedUrl = url.parse(req.url, true);
    const pathname = parsedUrl.pathname;
    const query = parsedUrl.query;

    try {
        // View markdown file
        if (pathname === '/view' || pathname === '/') {
            const filePath = query.file || config.file;
            if (!filePath || !fs.existsSync(filePath)) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('File not found');
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
            const dirPath = query.dir || config.dir;
            if (!dirPath || !fs.existsSync(dirPath)) {
                res.writeHead(404, { 'Content-Type': 'text/plain' });
                res.end('Directory not found');
                return;
            }

            const html = renderDirectory(dirPath);
            res.writeHead(200, { 'Content-Type': 'text/html' });
            res.end(html);
            return;
        }

        // 404
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');

    } catch (error) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Error: ${error.message}`);
    }
});

// Find available port
function findPort(startPort, callback) {
    const testServer = http.createServer();
    testServer.listen(startPort, config.host, () => {
        testServer.close(() => callback(startPort));
    });
    testServer.on('error', () => {
        if (startPort < 3500) {
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
        const target = config.file
            ? `/view?file=${encodeURIComponent(path.resolve(config.file))}`
            : `/browse?dir=${encodeURIComponent(path.resolve(config.dir))}`;

        const localUrl = `http://localhost:${port}${target}`;
        const networkUrl = config.host === '0.0.0.0'
            ? `http://${getNetworkIP()}:${port}${target}`
            : localUrl;

        // Save PID
        const tmpDir = require('os').tmpdir();
        fs.writeFileSync(path.join(tmpDir, `md-novel-viewer-${port}.pid`), process.pid.toString());

        console.log(JSON.stringify({
            success: true,
            url: localUrl,
            networkUrl: networkUrl,
            port: port,
        }));

        // Open browser
        if (config.open) {
            const opener = process.platform === 'darwin' ? 'open'
                : process.platform === 'win32' ? 'start' : 'xdg-open';
            require('child_process').exec(`${opener} "${localUrl}"`);
        }
    });
});
