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

// Import v6.0 modules (with fallback for missing modules)
let getDashboardData, getSummary, getMetricHistory;
let getFullDashboardData, getKeyTrends, generateAlerts, getGaugeWidgets, getCounterWidgets;
let getReinforcementStats, getABTestStats, getActiveTests;
let getSkillStats, loadAutoSkills, loadCausalPatterns;

try {
    ({ getDashboardData, getSummary, getMetricHistory } = await import('../lib/metrics-collector.js'));
} catch { getDashboardData = () => ({}); getSummary = () => ({}); getMetricHistory = () => []; }

try {
    ({ getFullDashboardData, getKeyTrends, generateAlerts, getGaugeWidgets, getCounterWidgets } = await import('../lib/dashboard-data.js'));
} catch { getFullDashboardData = () => ({}); getKeyTrends = () => ({}); generateAlerts = () => []; getGaugeWidgets = () => []; getCounterWidgets = () => []; }

try {
    ({ getReinforcementStats } = await import('../lib/reinforcement.js'));
} catch { getReinforcementStats = () => ({}); }

try {
    ({ getABTestStats, getActiveTests } = await import('../lib/ab-testing.js'));
} catch { getABTestStats = () => ({}); getActiveTests = () => []; }

try {
    ({ getSkillStats, loadAutoSkills } = await import('../lib/precision-skill-generator.js'));
} catch { getSkillStats = () => ({}); loadAutoSkills = () => []; }

try {
    ({ loadCausalPatterns } = await import('../lib/causality-engine.js'));
} catch { loadCausalPatterns = () => []; }

// Import Autopilot Metrics Collector (CommonJS)
import { createRequire } from 'module';
const require = createRequire(import.meta.url);
const { MetricsCollector } = require('../lib/metrics-collector.cjs');
const autopilotMetrics = new MetricsCollector();

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
    },

    // =========================================================================
    // AUTOPILOT METRICS (new)
    // =========================================================================

    // List all autopilot runs
    '/api/autopilot/runs': () => {
        try {
            const runs = autopilotMetrics.listRuns();
            return {
                total: runs.length,
                runs: runs.slice(0, 20) // Latest 20
            };
        } catch (e) {
            return { total: 0, runs: [], error: e.message };
        }
    },

    // Get specific run by ID (query param: ?id=xxx)
    '/api/autopilot/run': (query) => {
        try {
            const runId = query.get('id');
            if (!runId) {
                return { error: 'Missing id parameter' };
            }
            const run = autopilotMetrics.loadRun(runId);
            if (!run) {
                return { error: 'Run not found' };
            }
            return run;
        } catch (e) {
            return { error: e.message };
        }
    },

    // Get latest run metrics
    '/api/autopilot/latest': () => {
        try {
            const runs = autopilotMetrics.listRuns();
            if (runs.length === 0) {
                return { error: 'No runs yet' };
            }
            return autopilotMetrics.loadRun(runs[0].id);
        } catch (e) {
            return { error: e.message };
        }
    },

    // Get autopilot summary stats
    '/api/autopilot/summary': () => {
        try {
            const runs = autopilotMetrics.listRuns();
            if (runs.length === 0) {
                return {
                    total_runs: 0,
                    avg_duration: 0,
                    avg_interventions: 0,
                    autonomy_rate: 0
                };
            }

            // Calculate averages
            let totalDuration = 0;
            let totalInterventions = 0;
            let totalAutonomyRate = 0;
            let validRuns = 0;

            for (const runInfo of runs.slice(0, 10)) { // Last 10 runs
                const run = autopilotMetrics.loadRun(runInfo.id);
                if (run && run.metrics) {
                    totalDuration += run.metrics.speed?.time_to_completion || 0;
                    totalInterventions += run.metrics.intervention?.human_interventions || 0;
                    totalAutonomyRate += run.metrics.autonomy?.autonomous_completion_rate || 0;
                    validRuns++;
                }
            }

            return {
                total_runs: runs.length,
                avg_duration: validRuns > 0 ? Math.round(totalDuration / validRuns) : 0,
                avg_interventions: validRuns > 0 ? (totalInterventions / validRuns).toFixed(1) : 0,
                autonomy_rate: validRuns > 0 ? Math.round(totalAutonomyRate / validRuns) : 0,
                latest_run: runs[0]?.id || null
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
        console.log(`  GET /api/patterns       - Causal patterns`);
        console.log(`${c.gray}Autopilot Metrics:${c.reset}`);
        console.log(`  GET /api/autopilot/runs    - All runs`);
        console.log(`  GET /api/autopilot/latest  - Latest run`);
        console.log(`  GET /api/autopilot/summary - Summary stats\n`);
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
