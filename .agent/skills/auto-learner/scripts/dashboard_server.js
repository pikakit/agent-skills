#!/usr/bin/env node
/**
 * Dashboard Server - Local web server for Auto-Learn Dashboard
 * 
 * Part of FAANG-Grade Auto-Learn System Phase 4
 * 
 * Serves:
 * - Static dashboard HTML
 * - API endpoints for data
 * 
 * Usage:
 *   node dashboard_server.js --start
 *   node dashboard_server.js --port 3030
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors
const c = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    cyan: '\x1b[36m',
    gray: '\x1b[90m',
    bold: '\x1b[1m'
};

// Find project root
function findProjectRoot() {
    let current = process.cwd();
    while (current !== path.dirname(current)) {
        if (fs.existsSync(path.join(current, '.agent'))) {
            return current;
        }
        current = path.dirname(current);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const knowledgePath = path.join(projectRoot, '.agent', 'knowledge');
const dashboardPath = path.join(__dirname, '..', 'dashboard');

// Load JSON files
function loadJson(filename) {
    const filePath = path.join(knowledgePath, filename);
    try {
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch { }
    return null;
}

// API handlers
const api = {
    '/api/errors': () => {
        const data = loadJson('detected-errors.json');
        return data || { errors: [], totalErrors: 0 };
    },

    '/api/corrections': () => {
        const data = loadJson('user-corrections.json');
        return data || { corrections: [], totalCorrections: 0 };
    },

    '/api/lessons': () => {
        const data = loadJson('lessons-learned.json');
        return data || { lessons: [] };
    },

    '/api/patterns': () => {
        const data = loadJson('patterns.json');
        return data || { errors: {}, corrections: {}, highFrequency: [] };
    },

    '/api/summary': () => {
        const errors = loadJson('detected-errors.json');
        const corrections = loadJson('user-corrections.json');
        const lessons = loadJson('lessons-learned.json');
        const patterns = loadJson('patterns.json');

        return {
            errors: {
                total: errors?.errors?.length || 0,
                byType: patterns?.errors?.byType || {},
                bySeverity: patterns?.errors?.bySeverity || {}
            },
            corrections: {
                total: corrections?.corrections?.length || 0,
                byCategory: patterns?.corrections?.byCategory || {}
            },
            lessons: lessons?.lessons?.length || 0,
            highFrequency: patterns?.highFrequency || [],
            lastUpdated: patterns?.analyzedAt || null
        };
    }
};

// MIME types
const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

// Create server
function createServer(port) {
    const server = http.createServer((req, res) => {
        const url = req.url.split('?')[0];

        // CORS headers for local development
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle API requests
        if (url.startsWith('/api/')) {
            const handler = api[url];
            if (handler) {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(handler()));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found' }));
            }
            return;
        }

        // Serve static files
        let filePath = url === '/' ? '/index.html' : url;
        filePath = path.join(dashboardPath, filePath);

        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const mimeType = mimeTypes[ext] || 'text/plain';

            res.setHeader('Content-Type', mimeType);
            res.writeHead(200);
            res.end(fs.readFileSync(filePath));
        } else {
            res.writeHead(404);
            res.end('Not found');
        }
    });

    return server;
}

function startServer(port = 3030) {
    const server = createServer(port);

    server.listen(port, () => {
        console.log(`${c.cyan}╔════════════════════════════════════════╗${c.reset}`);
        console.log(`${c.cyan}║${c.reset}  🧠 Auto-Learn Dashboard Server         ${c.cyan}║${c.reset}`);
        console.log(`${c.cyan}╚════════════════════════════════════════╝${c.reset}\n`);
        console.log(`${c.green}✓ Server running at:${c.reset}`);
        console.log(`  ${c.bold}http://localhost:${port}${c.reset}\n`);
        console.log(`${c.gray}API Endpoints:${c.reset}`);
        console.log(`  GET /api/errors       - Detected errors`);
        console.log(`  GET /api/corrections  - User corrections`);
        console.log(`  GET /api/lessons      - Lessons learned`);
        console.log(`  GET /api/patterns     - Pattern analysis`);
        console.log(`  GET /api/summary      - Dashboard summary\n`);
        console.log(`${c.yellow}Press Ctrl+C to stop${c.reset}`);
    });

    server.on('error', (err) => {
        if (err.code === 'EADDRINUSE') {
            console.log(`${c.red}Error: Port ${port} is already in use${c.reset}`);
            console.log(`${c.gray}Try: node dashboard_server.js --port ${port + 1}${c.reset}`);
        } else {
            console.error(`${c.red}Server error:${c.reset}`, err);
        }
        process.exit(1);
    });

    return server;
}

// Parse CLI args
const args = process.argv.slice(2);

if (args.includes('--start') || args.includes('-s') || args.length === 0 || args.includes('--port') || args.includes('-p')) {
    let port = 3030;
    const portIdx = args.findIndex(a => a === '--port' || a === '-p');
    if (portIdx >= 0 && args[portIdx + 1]) {
        port = parseInt(args[portIdx + 1], 10);
    }
    startServer(port);
} else if (args.includes('--help') || args.includes('-h')) {
    console.log(`${c.cyan}dashboard_server - Auto-Learn Dashboard Web Server${c.reset}

${c.bold}Usage:${c.reset}
  node dashboard_server.js                  Start server (default port 3030)
  node dashboard_server.js --port 8080      Start on custom port
  node dashboard_server.js --help           Show this help

${c.bold}API Endpoints:${c.reset}
  GET /api/errors       - All detected errors
  GET /api/corrections  - All user corrections
  GET /api/lessons      - All lessons learned
  GET /api/patterns     - Pattern analysis results
  GET /api/summary      - Dashboard summary data

${c.bold}Example:${c.reset}
  node dashboard_server.js --port 3030
  # Open http://localhost:3030 in browser
`);
}

export { createServer, startServer };
