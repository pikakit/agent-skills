/**
 * Dashboard UI - Launch Auto-Learn Dashboard in browser
 */
import * as p from "@clack/prompts";
import { spawn, exec } from "child_process";
import path from "path";
import fs from "fs";
import http from "http";

// Track running server globally
let runningServer = null;
let runningPort = null;

/**
 * Check if a port is already in use by our dashboard
 * Uses /api/summary to verify it's actually our dashboard server
 */
async function checkPortInUse(port) {
    return new Promise((resolve) => {
        const req = http.get(`http://localhost:${port}/api/summary`, (res) => {
            // If we get 200 response from /api/summary, it's our dashboard
            if (res.statusCode === 200) {
                resolve(true);
            } else {
                resolve(false);
            }
            req.destroy();
        });
        req.on('error', () => {
            resolve(false);
        });
        // Faster timeout - 500ms is enough for localhost
        req.setTimeout(500, () => {
            req.destroy();
            resolve(false);
        });
    });
}

/**
 * Find existing dashboard server on ports 3030-3040
 */
async function findExistingServer() {
    // Check ports in parallel for faster detection
    const portChecks = [];
    for (let port = 3030; port <= 3040; port++) {
        portChecks.push(checkPortInUse(port).then(inUse => inUse ? port : null));
    }

    const results = await Promise.all(portChecks);
    const existingPort = results.find(port => port !== null);
    return existingPort || null;
}

/**
 * Find an available port
 */
async function findAvailablePort(startPort = 3030) {
    return new Promise((resolve) => {
        const server = http.createServer();
        server.listen(startPort, () => {
            server.close(() => resolve(startPort));
        });
        server.on("error", () => {
            resolve(findAvailablePort(startPort + 1));
        });
    });
}

/**
 * Find dashboard server script
 */
function findDashboardScript() {
    // Get the directory where this module is located
    const moduleDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1'));
    const cliRoot = path.resolve(moduleDir, '..', '..');

    // User home directory
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';

    const possiblePaths = [
        // PRIORITY 1: Bundled with CLI package (always available)
        path.join(cliRoot, "dashboard", "dashboard_server.js"),
        // PRIORITY 2: Current project paths (skill-generator)
        path.join(process.cwd(), ".agent", "skills", "skill-generator", "scripts", "dashboard_server.js"),
        path.join(process.cwd(), ".agent", "agentskillskit", ".agent", "skills", "skill-generator", "scripts", "dashboard_server.js"),
        // PRIORITY 3: Fallback user paths (Windows Desktop)
        path.join(homeDir, "Desktop", "agent-skill-kit", ".agent", "skills", "skill-generator", "scripts", "dashboard_server.js"),
        // LEGACY: auto-learner paths (backward compatibility)
        path.join(process.cwd(), ".agent", "skills", "auto-learner", "scripts", "dashboard_server.js"),
    ];

    for (const searchPath of possiblePaths) {
        if (fs.existsSync(searchPath)) {
            return searchPath;
        }
    }
    return null;
}

/**
 * Open URL in default browser
 */
function openBrowser(url) {
    const platform = process.platform;
    let command;

    if (platform === "win32") {
        command = `start "" "${url}"`;
    } else if (platform === "darwin") {
        command = `open "${url}"`;
    } else {
        command = `xdg-open "${url}"`;
    }

    exec(command, (err) => {
        if (err) {
            p.log.warn(`Could not open browser automatically. Visit: ${url}`);
        }
    });
}

/**
 * Run Dashboard UI
 */
export async function runDashboardUI() {
    const spinner = p.spinner();

    // Check if there's already a server running
    spinner.start("Checking for existing dashboard server...");
    const existingPort = await findExistingServer();

    if (existingPort) {
        spinner.stop(`Found existing server on port ${existingPort}`);
        const url = `http://localhost:${existingPort}`;

        p.log.success(`Dashboard already running at: ${url}`);
        openBrowser(url);

        p.note(`Server running on port ${existingPort}\nUsing existing server`, "📊 Auto-Learn Dashboard");

        const action = await p.select({
            message: "Dashboard is running. What would you like to do?",
            options: [
                { value: "keep", label: "🏠 Back to menu", hint: "Keep server running" },
                { value: "stop", label: "🛑 Stop server", hint: "Shutdown dashboard" }
            ]
        });

        if (action === "stop") {
            // Kill all node processes on that port
            p.log.info("Stopping existing server...");
            if (process.platform === "win32") {
                exec(`for /f "tokens=5" %a in ('netstat -aon ^| findstr :${existingPort}') do taskkill /F /PID %a`, () => { });
            } else {
                exec(`lsof -ti:${existingPort} | xargs kill -9`, () => { });
            }
            await new Promise(r => setTimeout(r, 1000));
            p.log.success("Dashboard server stopped");
        }
        return;
    }

    spinner.stop("No existing server found");

    // Find dashboard script
    const scriptPath = findDashboardScript();

    if (!scriptPath) {
        p.log.error("Dashboard script not found!");
        p.log.info("Install skill-generator skill first or check .agent/skills/skill-generator/scripts/");
        return;
    }

    // Find available port
    spinner.start("Finding available port...");
    const port = await findAvailablePort(3030);
    runningPort = port;
    spinner.stop(`Using port ${port}`);

    // Start dashboard server
    spinner.start("Starting dashboard server...");

    const child = spawn("node", [scriptPath, "--port", String(port)], {
        stdio: ["ignore", "pipe", "pipe"],
        detached: false
    });

    runningServer = child;

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1500));

    spinner.stop("Dashboard server started!");

    const url = `http://localhost:${port}`;

    // Open browser
    p.log.success(`Dashboard running at: ${url}`);
    openBrowser(url);

    p.log.info("Dashboard opened in browser");
    p.note(`Server running on port ${port}\nPress Ctrl+C in terminal to stop`, "📊 Auto-Learn Dashboard");

    // Keep server running and wait for user
    const action = await p.select({
        message: "Dashboard is running. What would you like to do?",
        options: [
            { value: "keep", label: "🏠 Back to menu", hint: "Keep server running" },
            { value: "stop", label: "🛑 Stop server", hint: "Shutdown dashboard" }
        ]
    });

    if (action === "stop" || p.isCancel(action)) {
        child.kill();
        runningServer = null;
        runningPort = null;
        p.log.info("Dashboard server stopped");
    } else {
        p.log.info(`Dashboard still running at ${url}`);
    }
}

export default runDashboardUI;
