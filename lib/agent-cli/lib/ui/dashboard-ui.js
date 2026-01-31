/**
 * Dashboard UI v7.0 - Launch PikaKit Dashboard in browser
 * 
 * @version 7.0.0
 * @author PikaKit
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
    const portChecks = [];
    for (let port = 3030; port <= 3040; port++) {
        portChecks.push(checkPortInUse(port).then(inUse => inUse ? port : null));
    }
    const results = await Promise.all(portChecks);
    return results.find(port => port !== null) || null;
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
    const moduleDir = path.dirname(new URL(import.meta.url).pathname.replace(/^\/([A-Z]:)/i, '$1'));
    const cliRoot = path.resolve(moduleDir, '..', '..');
    const homeDir = process.env.USERPROFILE || process.env.HOME || '';

    const possiblePaths = [
        // PRIORITY 1: New v7.0 script bundled with CLI package
        path.join(cliRoot, "scripts", "dashboard-server.js"),
        // PRIORITY 2: Dashboard folder (legacy)
        path.join(cliRoot, "dashboard", "dashboard-server.js"),
        // PRIORITY 3: Current project paths
        path.join(process.cwd(), ".agent", "skills", "auto-learner", "scripts", "dashboard-server.js"),
        // PRIORITY 4: Fallback - agent-skill-kit
        path.join(homeDir, "Desktop", "agent-skill-kit", ".agent", "skills", "auto-learner", "scripts", "dashboard-server.js"),
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
            p.log.warn(`Could not open browser. Visit: ${url}`);
        }
    });
}

/**
 * Run Dashboard UI
 */
export async function runDashboardUI() {
    const spinner = p.spinner();

    // Check for existing server
    spinner.start("Checking for existing dashboard server...");
    const existingPort = await findExistingServer();

    if (existingPort) {
        spinner.stop(`Found existing server on port ${existingPort}`);
        const url = `http://localhost:${existingPort}`;

        p.log.success(`Dashboard running at: ${url}`);
        openBrowser(url);

        p.note(`Server running on port ${existingPort}\nUsing existing server`, "🧠 PikaKit Dashboard v7.0");

        const action = await p.select({
            message: "Dashboard is running. What would you like to do?",
            options: [
                { value: "keep", label: "🏠 Back to menu", hint: "Keep server running" },
                { value: "stop", label: "🛑 Stop server", hint: "Shutdown dashboard" }
            ]
        });

        if (action === "stop") {
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
        p.log.info("Looking for: dashboard-server.js in scripts folder");
        return;
    }

    // Find available port
    spinner.start("Finding available port...");
    const port = await findAvailablePort(3030);
    runningPort = port;
    spinner.stop(`Using port ${port}`);

    // Start dashboard server
    spinner.start("Starting PikaKit Dashboard v7.0...");

    const child = spawn("node", [scriptPath, "--port", String(port)], {
        stdio: ["ignore", "pipe", "pipe"],
        detached: false
    });

    runningServer = child;

    // Wait for server to start
    await new Promise((resolve) => setTimeout(resolve, 1500));

    spinner.stop("Dashboard server started!");

    const url = `http://localhost:${port}`;

    p.log.success(`Dashboard running at: ${url}`);
    openBrowser(url);

    p.note(`Server: http://localhost:${port}\nPress Ctrl+C to stop`, "🧠 PikaKit Dashboard v7.0");

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
