#!/usr/bin/env node
/**
 * Mermaid Live Editor Server
 * 
 * Usage:
 *   node editor-server.cjs --open
 *   node editor-server.cjs --file diagram.mmd --open
 *   node editor-server.cjs --stop
 */

const http = require('http');
const fs = require('fs');
const path = require('path');
const url = require('url');
const { execSync } = require('child_process');

// Parse command line arguments
const args = process.argv.slice(2);
const config = {
  file: null,
  port: 3457,
  host: 'localhost',
  open: false,
  stop: false,
};

for (let i = 0; i < args.length; i++) {
  switch (args[i]) {
    case '--file': config.file = args[++i]; break;
    case '--port': config.port = parseInt(args[++i], 10); break;
    case '--host': config.host = args[++i]; break;
    case '--open': config.open = true; break;
    case '--stop': config.stop = true; break;
  }
}

// Stop all servers
if (config.stop) {
  const tmpDir = require('os').tmpdir();
  const pidFiles = fs.readdirSync(tmpDir).filter(f => f.startsWith('mermaid-editor-') && f.endsWith('.pid'));

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

// Default diagram template
const defaultDiagram = `flowchart LR
    A[Start] --> B{Decision}
    B -->|Yes| C[Process]
    B -->|No| D[End]
    C --> D`;

// Diagram templates
const templates = {
  flowchart: `flowchart TD
    A[Start] --> B{Is it working?}
    B -->|Yes| C[Great!]
    B -->|No| D[Debug]
    D --> B`,
  sequence: `sequenceDiagram
    participant User
    participant Server
    participant Database
    User->>Server: Request
    Server->>Database: Query
    Database-->>Server: Result
    Server-->>User: Response`,
  class: `classDiagram
    class Animal {
        +String name
        +int age
        +makeSound()
    }
    class Dog {
        +String breed
        +bark()
    }
    Animal <|-- Dog`,
  state: `stateDiagram-v2
    [*] --> Idle
    Idle --> Processing : submit
    Processing --> Success : complete
    Processing --> Error : fail
    Success --> [*]
    Error --> Idle : retry`,
  er: `erDiagram
    USER ||--o{ ORDER : places
    ORDER ||--|{ LINE_ITEM : contains
    PRODUCT ||--o{ LINE_ITEM : "ordered in"
    USER {
        int id PK
        string name
        string email
    }`,
  gantt: `gantt
    title Project Schedule
    dateFormat YYYY-MM-DD
    section Planning
    Requirements :a1, 2024-01-01, 7d
    Design       :a2, after a1, 14d
    section Development
    Coding       :a3, after a2, 30d
    Testing      :a4, after a3, 14d`,
  pie: `pie showData
    title Browser Market Share
    "Chrome" : 65
    "Safari" : 19
    "Firefox" : 7
    "Edge" : 5
    "Other" : 4`,
  mindmap: `mindmap
  root((PikaKit))
    Skills
      Frontend
      Backend
      DevOps
    Workflows
      Build
      Deploy
      Test
    Agents
      Lead
      Specialist`,
  timeline: `timeline
    title Project Milestones
    section Q1
        Jan : Kickoff meeting
            : Requirements gathering
        Feb : Design phase
        Mar : Development starts
    section Q2
        Apr : Alpha release
        May : Beta testing
        Jun : Production launch`
};

// Editor CSS
const editorCSS = `
:root {
  --bg-dark: #1e1e1e;
  --bg-light: #ffffff;
  --text-dark: #d4d4d4;
  --text-light: #333333;
  --accent: #007acc;
  --border: #3c3c3c;
  --editor-bg: #1e1e1e;
  --preview-bg: #252526;
}

[data-theme="light"] {
  --bg-dark: #f3f3f3;
  --bg-light: #ffffff;
  --text-dark: #333333;
  --text-light: #333333;
  --border: #e0e0e0;
  --editor-bg: #ffffff;
  --preview-bg: #fafafa;
}

* { box-sizing: border-box; margin: 0; padding: 0; }

body {
  font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
  background: var(--bg-dark);
  color: var(--text-dark);
  height: 100vh;
  overflow: hidden;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.5rem 1rem;
  background: var(--preview-bg);
  border-bottom: 1px solid var(--border);
  height: 50px;
}

.header h1 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--accent);
}

.header-actions {
  display: flex;
  gap: 0.5rem;
}

.btn {
  padding: 0.4rem 0.8rem;
  border: 1px solid var(--border);
  border-radius: 4px;
  background: var(--bg-dark);
  color: var(--text-dark);
  cursor: pointer;
  font-size: 0.85rem;
  transition: all 0.2s;
}

.btn:hover {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.btn-primary {
  background: var(--accent);
  color: white;
  border-color: var(--accent);
}

.container {
  display: flex;
  height: calc(100vh - 50px);
}

.panel {
  flex: 1;
  display: flex;
  flex-direction: column;
}

.panel-header {
  padding: 0.5rem 1rem;
  background: var(--preview-bg);
  border-bottom: 1px solid var(--border);
  font-size: 0.75rem;
  text-transform: uppercase;
  letter-spacing: 1px;
  color: var(--text-dark);
  opacity: 0.7;
}

.editor-panel {
  border-right: 1px solid var(--border);
}

#editor {
  flex: 1;
  width: 100%;
  padding: 1rem;
  background: var(--editor-bg);
  color: var(--text-dark);
  border: none;
  resize: none;
  font-family: 'JetBrains Mono', 'Fira Code', 'Consolas', monospace;
  font-size: 14px;
  line-height: 1.6;
  outline: none;
}

#preview {
  flex: 1;
  padding: 1rem;
  overflow: auto;
  background: var(--preview-bg);
  display: flex;
  align-items: center;
  justify-content: center;
}

#preview svg {
  max-width: 100%;
  max-height: 100%;
}

.templates {
  position: fixed;
  top: 60px;
  right: 10px;
  background: var(--bg-dark);
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 0.5rem;
  display: none;
  z-index: 100;
  box-shadow: 0 4px 12px rgba(0,0,0,0.3);
}

.templates.show {
  display: block;
}

.templates button {
  display: block;
  width: 100%;
  padding: 0.5rem 1rem;
  text-align: left;
  background: none;
  border: none;
  color: var(--text-dark);
  cursor: pointer;
  border-radius: 4px;
}

.templates button:hover {
  background: var(--accent);
  color: white;
}

.error {
  color: #f44336;
  padding: 1rem;
  text-align: center;
}

.status {
  position: fixed;
  bottom: 10px;
  left: 10px;
  font-size: 0.75rem;
  color: var(--text-dark);
  opacity: 0.5;
}
`;

// Editor HTML
function renderEditor(initialCode) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mermaid Editor | PikaKit</title>
  <link href="https://fonts.googleapis.com/css2?family=JetBrains+Mono&display=swap" rel="stylesheet">
  <style>${editorCSS}</style>
  <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
</head>
<body>
  <div class="header">
    <h1>🧜 Mermaid Editor</h1>
    <div class="header-actions">
      <button class="btn" onclick="toggleTemplates()">📋 Templates</button>
      <button class="btn" onclick="exportSVG()">⬇️ SVG</button>
      <button class="btn" onclick="exportPNG()">🖼️ PNG</button>
      <button class="btn" onclick="toggleTheme()">🌓 Theme</button>
    </div>
  </div>
  
  <div class="templates" id="templates">
    <button onclick="loadTemplate('flowchart')">Flowchart</button>
    <button onclick="loadTemplate('sequence')">Sequence</button>
    <button onclick="loadTemplate('class')">Class</button>
    <button onclick="loadTemplate('state')">State</button>
    <button onclick="loadTemplate('er')">ER Diagram</button>
    <button onclick="loadTemplate('gantt')">Gantt</button>
    <button onclick="loadTemplate('pie')">Pie Chart</button>
    <button onclick="loadTemplate('mindmap')">Mindmap</button>
    <button onclick="loadTemplate('timeline')">Timeline</button>
  </div>
  
  <div class="container">
    <div class="panel editor-panel">
      <div class="panel-header">Code</div>
      <textarea id="editor" spellcheck="false">${initialCode}</textarea>
    </div>
    <div class="panel">
      <div class="panel-header">Preview</div>
      <div id="preview"></div>
    </div>
  </div>
  
  <div class="status">⚡ PikaKit v3.2.0 | Mermaid Editor</div>
  
  <script>
    const templates = ${JSON.stringify(templates)};
    let debounceTimer;
    let currentTheme = localStorage.getItem('mermaid-theme') || 'dark';
    
    // Initialize Mermaid
    mermaid.initialize({
      startOnLoad: false,
      theme: currentTheme,
      securityLevel: 'loose'
    });
    
    // Apply saved theme
    if (currentTheme === 'light') {
      document.documentElement.setAttribute('data-theme', 'light');
    }
    
    // Render diagram
    async function render() {
      const code = document.getElementById('editor').value;
      const preview = document.getElementById('preview');
      
      try {
        // Clear previous
        preview.innerHTML = '';
        
        // Render new
        const { svg } = await mermaid.render('diagram', code);
        preview.innerHTML = svg;
      } catch (e) {
        preview.innerHTML = '<div class="error">⚠️ ' + e.message + '</div>';
      }
    }
    
    // Debounced render
    function debouncedRender() {
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(render, 300);
    }
    
    // Event listeners
    document.getElementById('editor').addEventListener('input', debouncedRender);
    
    // Initial render
    render();
    
    // Load template
    function loadTemplate(name) {
      document.getElementById('editor').value = templates[name];
      document.getElementById('templates').classList.remove('show');
      render();
    }
    
    // Toggle templates
    function toggleTemplates() {
      document.getElementById('templates').classList.toggle('show');
    }
    
    // Close templates on click outside
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.templates') && !e.target.closest('[onclick*="toggleTemplates"]')) {
        document.getElementById('templates').classList.remove('show');
      }
    });
    
    // Toggle theme
    function toggleTheme() {
      currentTheme = currentTheme === 'dark' ? 'light' : 'dark';
      localStorage.setItem('mermaid-theme', currentTheme);
      
      if (currentTheme === 'light') {
        document.documentElement.setAttribute('data-theme', 'light');
      } else {
        document.documentElement.removeAttribute('data-theme');
      }
      
      mermaid.initialize({ theme: currentTheme === 'dark' ? 'dark' : 'default' });
      render();
    }
    
    // Export SVG
    function exportSVG() {
      const svg = document.querySelector('#preview svg');
      if (!svg) return alert('No diagram to export');
      
      const blob = new Blob([svg.outerHTML], { type: 'image/svg+xml' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'diagram.svg';
      a.click();
      URL.revokeObjectURL(url);
    }
    
    // Export PNG
    function exportPNG() {
      const svg = document.querySelector('#preview svg');
      if (!svg) return alert('No diagram to export');
      
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(svgBlob);
      
      img.onload = () => {
        canvas.width = img.width * 2;
        canvas.height = img.height * 2;
        ctx.scale(2, 2);
        ctx.fillStyle = currentTheme === 'dark' ? '#1e1e1e' : '#ffffff';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.drawImage(img, 0, 0);
        
        const a = document.createElement('a');
        a.href = canvas.toDataURL('image/png');
        a.download = 'diagram.png';
        a.click();
        URL.revokeObjectURL(url);
      };
      
      img.src = url;
    }
    
    // Keyboard shortcuts
    document.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey) {
        if (e.key === 's') {
          e.preventDefault();
          exportSVG();
        }
      }
      if (e.key === 't' && !e.target.matches('textarea')) {
        toggleTheme();
      }
    });
  </script>
</body>
</html>`;
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

// Create HTTP server
const server = http.createServer((req, res) => {
  const parsedUrl = url.parse(req.url, true);
  const pathname = parsedUrl.pathname;

  try {
    if (pathname === '/' || pathname === '/editor') {
      // Load file content if specified
      let code = defaultDiagram;
      if (config.file && fs.existsSync(config.file)) {
        code = fs.readFileSync(config.file, 'utf8');
      }

      const html = renderEditor(code);
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
    const localUrl = `http://localhost:${port}`;
    const networkUrl = config.host === '0.0.0.0'
      ? `http://${getNetworkIP()}:${port}`
      : localUrl;

    // Save PID
    const tmpDir = require('os').tmpdir();
    fs.writeFileSync(path.join(tmpDir, `mermaid-editor-${port}.pid`), process.pid.toString());

    // User-friendly output
    console.log('');
    console.log('🧜 Mermaid Editor is running!');
    console.log('');
    console.log(`   Local:   ${localUrl}`);
    if (config.host === '0.0.0.0') {
      console.log(`   Network: ${networkUrl}`);
    }
    console.log('');
    if (config.open) {
      console.log('   → Attempting to open browser...');
      console.log('   → If browser doesn\'t open, copy the link above manually.');
    } else {
      console.log('   → Open the link above in your browser.');
    }
    console.log('');
    console.log('   Press Ctrl+C to stop the server.');
    console.log('');

    // JSON output for programmatic use
    console.log(JSON.stringify({
      success: true,
      url: localUrl,
      networkUrl: networkUrl,
      port: port,
    }));

    // Open browser
    if (config.open) {
      const { exec } = require('child_process');
      if (process.platform === 'win32') {
        exec(`cmd /c start "" "${localUrl}"`);
      } else if (process.platform === 'darwin') {
        exec(`open "${localUrl}"`);
      } else {
        exec(`xdg-open "${localUrl}"`);
      }
    }
  });
});
