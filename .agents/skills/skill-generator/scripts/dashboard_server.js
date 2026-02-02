#!/usr/bin/env node
/**
 * Dashboard Server v6.0 - AutoLearn Precision Learning Engine
 * 
 * Serves real-time metrics from the new v6.0 modules:
 * - metrics-collector.js (18 KPIs)
 * - dashboard-data.js (aggregation)
 * - causality-engine.js (patterns)
 * - reinforcement.js (loop stats)
 * - ab-testing.js (experiment stats)
 * - precision-skill-generator.js (skills)
 * 
 * Usage:
 *   node dashboard_server.js --start
 *   node dashboard_server.js --port 3030
 */

import fs from 'fs';
import path from 'path';
import http from 'http';
import { fileURLToPath } from 'url';

// Import v6.0 modules
import { getDashboardData, getSummary, getMetricHistory } from '../lib/metrics-collector.js';
import { getFullDashboardData, getKeyTrends, generateAlerts, getGaugeWidgets, getCounterWidgets } from '../lib/dashboard-data.js';
import { getReinforcementStats } from '../lib/reinforcement.js';
import { getABTestStats, getActiveTests } from '../lib/ab-testing.js';
import { getSkillStats, loadAutoSkills } from '../lib/precision-skill-generator.js';
import { loadCausalPatterns } from '../lib/causality-engine.js';

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
const dashboardPath = path.join(__dirname, '..', 'dashboard');

// ============================================================================
// API v6.0 HANDLERS
// ============================================================================

const api = {
    // Full dashboard data (all metrics aggregated)
    '/api/dashboard': () => {
        try {
            return getFullDashboardData();
        } catch (e) {
            return { error: e.message, version: '6.0.0' };
        }
    },

    // KPIs only
    '/api/kpis': () => {
        try {
            return getDashboardData();
        } catch (e) {
            return { error: e.message };
        }
    },

    // Summary stats
    '/api/summary': () => {
        try {
            return getSummary();
        } catch (e) {
            return { error: e.message };
        }
    },

    // Trends over time
    '/api/trends': () => {
        try {
            return getKeyTrends();
        } catch (e) {
            return { error: e.message };
        }
    },

    // Active alerts
    '/api/alerts': () => {
        try {
            return { alerts: generateAlerts() };
        } catch (e) {
            return { alerts: [], error: e.message };
        }
    },

    // Gauge widget data
    '/api/gauges': () => {
        try {
            return { gauges: getGaugeWidgets() };
        } catch (e) {
            return { gauges: [], error: e.message };
        }
    },

    // Counter widget data
    '/api/counters': () => {
        try {
            return { counters: getCounterWidgets() };
        } catch (e) {
            return { counters: [], error: e.message };
        }
    },

    // Reinforcement loop stats
    '/api/reinforcement': () => {
        try {
            return getReinforcementStats();
        } catch (e) {
            return { error: e.message };
        }
    },

    // A/B testing stats
    '/api/ab-testing': () => {
        try {
            return {
                stats: getABTestStats(),
                active: getActiveTests()
            };
        } catch (e) {
            return { error: e.message };
        }
    },

    // Auto-generated skills
    '/api/skills': () => {
        try {
            return {
                stats: getSkillStats(),
                skills: loadAutoSkills()
            };
        } catch (e) {
            return { error: e.message };
        }
    },

    // Causal patterns
    '/api/patterns': () => {
        try {
            const patterns = loadCausalPatterns();
            return {
                total: patterns.length,
                patterns: patterns.slice(0, 20) // Limit to 20 most recent
            };
        } catch (e) {
            return { total: 0, patterns: [], error: e.message };
        }
    },

    // Metric history (query param: ?metric=task_success_rate&limit=168)
    '/api/history': (query) => {
        try {
            const metric = query.get('metric') || 'task_success_rate';
            const limit = parseInt(query.get('limit') || '168', 10);
            return {
                metric,
                history: getMetricHistory(metric, limit)
            };
        } catch (e) {
            return { error: e.message };
        }
    }
};

// ============================================================================
// LEGACY API COMPATIBILITY (v4.0 endpoints that still work)
// ============================================================================

const legacyApi = {
    '/api/errors': () => ({
        deprecation: 'Use /api/patterns instead',
        redirect: '/api/patterns'
    }),
    '/api/corrections': () => ({
        deprecation: 'Use /api/patterns instead',
        redirect: '/api/patterns'
    }),
    '/api/lessons': () => {
        const filePath = path.join(projectRoot, '.agent', 'knowledge', 'lessons-learned.json');
        try {
            if (fs.existsSync(filePath)) {
                return JSON.parse(fs.readFileSync(filePath, 'utf8'));
            }
        } catch { }
        return { lessons: [] };
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
        const urlParts = req.url.split('?');
        const url = urlParts[0];
        const query = new URLSearchParams(urlParts[1] || '');

        // CORS headers for local development
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        // Handle API requests
        if (url.startsWith('/api/')) {
            const handler = api[url] || legacyApi[url];
            if (handler) {
                res.setHeader('Content-Type', 'application/json');
                res.writeHead(200);
                res.end(JSON.stringify(handler(query)));
            } else {
                res.writeHead(404);
                res.end(JSON.stringify({ error: 'Not found', availableEndpoints: Object.keys(api) }));
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
        console.log(`${c.cyan}╔════════════════════════════════════════════════════╗${c.reset}`);
        console.log(`${c.cyan}║${c.reset}  🧠 AutoLearn v6.0 Dashboard Server                 ${c.cyan}║${c.reset}`);
        console.log(`${c.cyan}║${c.reset}  ${c.green}Precision Learning Engine${c.reset}                        ${c.cyan}║${c.reset}`);
        console.log(`${c.cyan}╚════════════════════════════════════════════════════╝${c.reset}\n`);
        console.log(`${c.green}✓ Server running at:${c.reset}`);
        console.log(`  ${c.bold}http://localhost:${port}${c.reset}\n`);
        console.log(`${c.gray}API Endpoints (v6.0):${c.reset}`);
        console.log(`  GET /api/dashboard      - Full dashboard data`);
        console.log(`  GET /api/kpis           - 18 KPIs`);
        console.log(`  GET /api/summary        - Summary stats`);
        console.log(`  GET /api/trends         - Key trends`);
        console.log(`  GET /api/alerts         - Active alerts`);
        console.log(`  GET /api/reinforcement  - Reinforcement loop`);
        console.log(`  GET /api/ab-testing     - A/B experiments`);
        console.log(`  GET /api/skills         - Auto-generated skills`);
        console.log(`  GET /api/patterns       - Causal patterns\n`);
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
    console.log(`${c.cyan}AutoLearn v6.0 Dashboard Server${c.reset}

${c.bold}Usage:${c.reset}
  node dashboard_server.js                  Start server (default port 3030)
  node dashboard_server.js --port 8080      Start on custom port
  node dashboard_server.js --help           Show this help

${c.bold}API Endpoints (v6.0):${c.reset}
  GET /api/dashboard      - Full dashboard aggregation
  GET /api/kpis           - 18 KPIs for Dashboard
  GET /api/summary        - Summary statistics
  GET /api/trends         - Week-over-week trends
  GET /api/alerts         - Active alerts
  GET /api/gauges         - Gauge widget data
  GET /api/counters       - Counter widget data
  GET /api/reinforcement  - Reinforcement loop stats
  GET /api/ab-testing     - A/B testing experiments
  GET /api/skills         - Auto-generated skills
  GET /api/patterns       - Causal patterns
  GET /api/history?metric=X - Metric history

${c.bold}Example:${c.reset}
  node dashboard_server.js --port 3030
  # Open http://localhost:3030 in browser
`);
}

export { createServer, startServer };
