#!/usr/bin/env node

/**
 * Auto Preview - Agent Skill Kit
 * ===============================
 * Development server manager (start/stop/status)
 * JavaScript port of auto_preview.py
 * 
 * Usage:
 *   node auto_preview.js start [port]
 *   node auto_preview.js stop
 *   node auto_preview.js status
 */

import { readFile, writeFile, access } from 'fs/promises';
import { join, resolve } from 'path';
import { spawn } from 'child_process';
import { parseArgs } from 'node:util';
import { savePid, loadPid, deletePidFile, isRunning, killProcessTree } from './utils/process-manager.js';

const AGENT_DIR = resolve(process.cwd(), '.agent');
const PID_FILE = join(AGENT_DIR, 'preview.pid');
const LOG_FILE = join(AGENT_DIR, 'preview.log');

/**
 * Get start command from package.json
 */
async function getStartCommand(root) {
    const pkgFile = join(root, 'package.json');

    try {
        const data = JSON.parse(await readFile(pkgFile, 'utf-8'));
        const scripts = data.scripts || {};

        if (scripts.dev) {
            return ['npm', 'run', 'dev'];
        } else if (scripts.start) {
            return ['npm', 'start'];
        }
        return null;
    } catch {
        return null;
    }
}

/**
 * Start development server
 */
async function startServer(port = 3000) {
    // Check if already running
    const existingPid = await loadPid(PID_FILE);
    if (existingPid && isRunning(existingPid)) {
        console.log(`⚠️  Preview already running (PID: ${existingPid})`);
        return;
    }

    const root = process.cwd();
    const cmd = await getStartCommand(root);

    if (!cmd) {
        console.log('❌ No \'dev\' or \'start\' script found in package.json');
        process.exit(1);
    }

    console.log(`🚀 Starting preview on port ${port}...`);

    // Prepare log file
    const { createWriteStream } = await import('fs');
    const logStream = createWriteStream(LOG_FILE, { flags: 'w' });

    // Spawn detached process
    const child = spawn(cmd[0], cmd.slice(1), {
        detached: true,
        stdio: ['ignore', logStream, logStream],
        env: { ...process.env, PORT: port.toString() },
        cwd: root,
        shell: true
    });

    // Allow parent to exit
    child.unref();

    await savePid(PID_FILE, child.pid);

    console.log(`✅ Preview started! (PID: ${child.pid})`);
    console.log(`   Logs: ${LOG_FILE}`);
    console.log(`   URL: http://localhost:${port}`);
}

/**
 * Stop development server
 */
async function stopServer() {
    const pid = await loadPid(PID_FILE);

    if (!pid) {
        console.log('ℹ️  No preview server found.');
        return;
    }

    if (!isRunning(pid)) {
        console.log('ℹ️  Process was not running.');
        await deletePidFile(PID_FILE);
        return;
    }

    try {
        await killProcessTree(pid);
        console.log(`🛑 Preview stopped (PID: ${pid})`);
    } catch (err) {
        console.log(`❌ Error stopping server: ${err.message}`);
    } finally {
        await deletePidFile(PID_FILE);
    }
}

/**
 * Show server status
 */
async function statusServer() {
    const pid = await loadPid(PID_FILE);
    const running = pid && isRunning(pid);

    console.log('\n=== Preview Status ===');

    if (running) {
        console.log('✅ Status: Running');
        console.log(`🔢 PID: ${pid}`);
        console.log('🌐 URL: http://localhost:3000 (Likely)');
        console.log(`📝 Logs: ${LOG_FILE}`);
    } else {
        console.log('⚪ Status: Stopped');
    }

    console.log('===================\n');
}

/**
 * Main entry point
 */
async function main() {
    const { values, positionals } = parseArgs({
        args: process.argv.slice(2),
        allowPositionals: true,
        options: {}
    });

    const action = positionals[0];
    const port = positionals[1] || '3000';

    if (action === 'start') {
        await startServer(parseInt(port, 10));
    } else if (action === 'stop') {
        await stopServer();
    } else if (action === 'status') {
        await statusServer();
    } else {
        console.error('Usage: node auto_preview.js [start|stop|status] [port]');
        process.exit(1);
    }
}

main().catch(err => {
    console.error('Error:', err.message);
    process.exit(1);
});
