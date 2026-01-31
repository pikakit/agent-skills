#!/usr/bin/env node
/**
 * Dashboard Server v7.0 - PikaKit Precision Learning Engine
 * 
 * Modern ES Modules server with REST API endpoints.
 * Serves real-time metrics from PikaKit learning system.
 * 
 * @version 7.0.0
 * @author PikaKit
 */

import http from 'http';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Colors for terminal
const c = {
    reset: '\x1b[0m',
    bold: '\x1b[1m',
    cyan: '\x1b[36m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    gray: '\x1b[90m'
};

// Find project root
function findProjectRoot() {
    let dir = process.cwd();
    while (dir !== path.dirname(dir)) {
        if (fs.existsSync(path.join(dir, '.agent'))) return dir;
        if (fs.existsSync(path.join(dir, 'package.json'))) return dir;
        dir = path.dirname(dir);
    }
    return process.cwd();
}

const projectRoot = findProjectRoot();
const dashboardPath = path.join(__dirname, '..', 'dashboard');
const knowledgeDir = path.join(projectRoot, '.agent', 'knowledge');

// Read lessons count - prioritize v6 format
function getLessonsCount() {
    // Priority 1: v6 unified format
    const knowledgePath = path.join(knowledgeDir, 'knowledge.yaml');
    console.log(`[Dashboard] Looking for knowledge at: ${knowledgePath}`);
    console.log(`[Dashboard] File exists: ${fs.existsSync(knowledgePath)}`);
    if (fs.existsSync(knowledgePath)) {
        try {
            const content = fs.readFileSync(knowledgePath, 'utf-8');
            const data = yaml.load(content);
            const count = data.lessons?.length || 0;
            console.log(`[Dashboard] Found ${count} lessons`);
            return count;
        } catch (e) {
            // Fall through to legacy
        }
    }

    // Priority 2: Legacy files
    let count = 0;
    const files = ['lessons-learned.yaml', 'mistakes.yaml', 'improvements.yaml'];

    for (const file of files) {
        const filePath = path.join(knowledgeDir, file);
        if (fs.existsSync(filePath)) {
            try {
                const content = fs.readFileSync(filePath, 'utf-8');
                const matches = content.match(/^\s*-\s+id:/gm);
                if (matches) count += matches.length;
            } catch (e) {
                // Ignore read errors
            }
        }
    }
    return count;
}

// ============================================================================
// DATA PROVIDERS
// ============================================================================

// Safe import helper
async function safeImport(modulePath) {
    try {
        return await import(modulePath);
    } catch (e) {
        return null;
    }
}

// Load data modules dynamically
let metricsCollector = null;
let causalityEngine = null;
let skillGenerator = null;
let abTesting = null;
let reinforcement = null;

async function loadModules() {
    const libPath = path.join(__dirname, '..', 'lib');
    metricsCollector = await safeImport(path.join(libPath, 'metrics-collector.js'));
    causalityEngine = await safeImport(path.join(libPath, 'causality-engine.js'));
    skillGenerator = await safeImport(path.join(libPath, 'skill-generator.js'));
    abTesting = await safeImport(path.join(libPath, 'ab-testing.js'));
    reinforcement = await safeImport(path.join(libPath, 'reinforcement-loop.js'));
}

// ============================================================================
// API HANDLERS
// ============================================================================

const api = {
    // Full dashboard data
    '/api/dashboard': () => {
        try {
            // Use getSummary from metrics-collector for real data
            const summary = metricsCollector?.getSummary?.() || {};
            const dashboardData = metricsCollector?.getDashboardData?.() || { kpis: {} };

            // Also get lessons count from YAML files as fallback/supplement
            const lessonsFromFiles = getLessonsCount();

            const totalTasks = summary.totalTasks || 0;
            const patternsLearned = lessonsFromFiles || summary.patternsLearned || 0;
            const skillsGenerated = summary.skillsGenerated || 0;

            // Determine if this is a new user (no lessons yet)
            const isNewUser = patternsLearned === 0;

            // Build KPIs response
            const kpis = dashboardData.kpis || {};

            const responseSummary = {
                totalTasks,
                patternsLearned,
                skillsGenerated,
                version: '7.0.0',
                isNewUser,
                lastUpdated: summary.lastUpdated || new Date().toISOString()
            };
            return { kpis: { kpis }, summary: responseSummary, version: '7.0.0', isNewUser };
        } catch (e) {
            return { kpis: { kpis: {} }, summary: { isNewUser: true }, error: e.message, version: '7.0.0', isNewUser: true };
        }
    },

    // KPIs only
    '/api/kpis': () => {
        try {
            return metricsCollector?.getDashboardData?.() || { kpis: {} };
        } catch (e) {
            return { kpis: {}, error: e.message };
        }
    },

    // Alerts
    '/api/alerts': () => {
        try {
            const kpis = metricsCollector?.getKPIs?.()?.kpis || {};
            const alerts = [];

            // Generate alerts based on KPI thresholds
            if (kpis.task_success_rate && parseFloat(kpis.task_success_rate.value) < 80) {
                alerts.push({ id: 'low_success', severity: 'warning', message: 'Task success rate below 80%' });
            }
            if (kpis.error_repeat_rate && parseFloat(kpis.error_repeat_rate.value) > 10) {
                alerts.push({ id: 'high_error', severity: 'warning', message: 'Error repeat rate above 10%' });
            }

            return { alerts, count: alerts.length };
        } catch (e) {
            return { alerts: [], error: e.message };
        }
    },

    // Skills
    '/api/skills': () => {
        try {
            const skills = skillGenerator?.getAllSkills?.() || [];
            return {
                skills,
                stats: { total: skills.length }
            };
        } catch (e) {
            return { skills: [], stats: { total: 0 }, error: e.message };
        }
    },

    // A/B Testing
    '/api/ab-testing': () => {
        try {
            const active = abTesting?.getActiveTests?.() || [];
            const completed = abTesting?.getCompletedTests?.() || [];
            return {
                active,
                completed,
                stats: { running: active.length, completed: completed.length }
            };
        } catch (e) {
            return { active: [], completed: [], stats: { running: 0, completed: 0 }, error: e.message };
        }
    },

    // Reinforcement Loop
    '/api/reinforcement': () => {
        try {
            const stats = reinforcement?.getStats?.() || {};
            return {
                totalRewards: stats.rewards || 0,
                totalPenalties: stats.penalties || 0,
                averageConfidence: stats.avgConfidence || null
            };
        } catch (e) {
            return { totalRewards: 0, totalPenalties: 0, averageConfidence: null };
        }
    },

    // Patterns
    '/api/patterns': () => {
        try {
            const patterns = causalityEngine?.loadCausalPatterns?.() || [];
            return { total: patterns.length, patterns: patterns.slice(0, 20) };
        } catch (e) {
            return { total: 0, patterns: [], error: e.message };
        }
    },

    // Summary (legacy support)
    '/api/summary': () => {
        return { status: 'ok', version: '7.0.0', server: 'PikaKit Dashboard Server' };
    }
};

// ============================================================================
// MIME TYPES
// ============================================================================

const mimeTypes = {
    '.html': 'text/html',
    '.css': 'text/css',
    '.js': 'application/javascript',
    '.json': 'application/json',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.svg': 'image/svg+xml'
};

// ============================================================================
// SERVER
// ============================================================================

function createServer(port) {
    const server = http.createServer(async (req, res) => {
        // CORS headers
        res.setHeader('Access-Control-Allow-Origin', '*');
        res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
        res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

        if (req.method === 'OPTIONS') {
            res.writeHead(204);
            res.end();
            return;
        }

        const url = new URL(req.url, `http://localhost:${port}`);
        const pathname = url.pathname;

        // API routes
        if (api[pathname]) {
            const data = api[pathname](url.searchParams);
            res.writeHead(200, { 'Content-Type': 'application/json' });
            res.end(JSON.stringify(data, null, 2));
            return;
        }

        // Static files
        let filePath = pathname === '/' ? 'index.html' : pathname.slice(1);
        filePath = path.join(dashboardPath, filePath);

        if (fs.existsSync(filePath)) {
            const ext = path.extname(filePath);
            const contentType = mimeTypes[ext] || 'application/octet-stream';
            const content = fs.readFileSync(filePath);
            res.writeHead(200, { 'Content-Type': contentType });
            res.end(content);
            return;
        }

        // 404
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not found', path: pathname }));
    });

    return server;
}

async function startServer(port = 3030) {
    await loadModules();

    const server = createServer(port);

    server.listen(port, () => {
        console.log(`
${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
  🧠 ${c.bold}PikaKit Dashboard Server v7.0${c.reset}
${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}

  ${c.green}→${c.reset} Dashboard: ${c.yellow}http://localhost:${port}${c.reset}
  ${c.green}→${c.reset} API:       ${c.yellow}http://localhost:${port}/api/dashboard${c.reset}

  ${c.gray}Press Ctrl+C to stop${c.reset}

${c.cyan}━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━${c.reset}
`);
    });

    server.on('error', (e) => {
        if (e.code === 'EADDRINUSE') {
            console.log(`${c.yellow}Port ${port} in use, trying ${port + 1}...${c.reset}`);
            startServer(port + 1);
        } else {
            console.error(`${c.red}Server error:${c.reset}`, e.message);
        }
    });

    return server;
}

// CLI handling
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
${c.bold}PikaKit Dashboard Server v7.0${c.reset}

${c.bold}Usage:${c.reset}
  node dashboard-server.js [options]

${c.bold}Options:${c.reset}
  --port, -p <number>   Port to run on (default: 3030)
  --help, -h            Show this help

${c.bold}API Endpoints:${c.reset}
  GET /api/dashboard      Full dashboard data
  GET /api/kpis           KPI metrics only
  GET /api/alerts         Active alerts
  GET /api/skills         Auto-generated skills
  GET /api/ab-testing     A/B test experiments
  GET /api/reinforcement  Reinforcement loop stats
  GET /api/patterns       Causal patterns
  GET /api/summary        Server status

${c.bold}Example:${c.reset}
  node dashboard-server.js --port 3030
`);
} else {
    let port = 3030;
    const portIdx = args.findIndex(a => a === '--port' || a === '-p');
    if (portIdx !== -1 && args[portIdx + 1]) {
        port = parseInt(args[portIdx + 1], 10) || 3030;
    }
    startServer(port);
}

export { createServer, startServer };
