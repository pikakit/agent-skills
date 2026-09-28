#!/usr/bin/env node
/** Development preview lifecycle with atomic state and readiness verification. */

import { execFile, spawn, type ChildProcess } from 'node:child_process';
import { existsSync } from 'node:fs';
import { mkdir, open, readFile, rename, unlink, writeFile } from 'node:fs/promises';
import { connect } from 'node:net';
import { dirname, join, resolve } from 'node:path';
import { parseArgs } from 'node:util';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import {
    deletePidFile,
    isRunning,
    killProcessTree,
    loadPid,
} from './utils/process-manager.ts';

interface PackageJson {
    scripts?: Record<string, string>;
}

export interface PreviewState {
    version: 1;
    pid: number;
    port: number;
    url: string;
    cwd: string;
    command: string[];
    startedAt: string;
    processIdentity: string;
}

export type PreviewStatus =
    | { status: 'stopped' | 'stale'; state: PreviewState | null }
    | { status: 'running' | 'unhealthy'; state: PreviewState };

interface PreviewPaths {
    cacheDir: string;
    stateFile: string;
    logFile: string;
    legacyPidFile: string;
}

function pathsFor(root: string): PreviewPaths {
    const cacheDir = join(root, '.pikakit-cache');
    return {
        cacheDir,
        stateFile: join(cacheDir, 'preview.json'),
        logFile: join(cacheDir, 'preview.log'),
        legacyPidFile: join(root, '.agent', 'preview.pid'),
    };
}

function errorMessage(error: unknown): string {
    return error instanceof Error ? error.message : String(error);
}

function isPreviewState(value: unknown): value is PreviewState {
    if (!value || typeof value !== 'object') return false;
    const state = value as Partial<PreviewState>;
    return state.version === 1
        && Number.isSafeInteger(state.pid)
        && (state.pid ?? 0) > 0
        && Number.isSafeInteger(state.port)
        && (state.port ?? 0) >= 1
        && (state.port ?? 0) <= 65_535
        && typeof state.url === 'string'
        && typeof state.cwd === 'string'
        && Array.isArray(state.command)
        && state.command.every(item => typeof item === 'string')
        && typeof state.startedAt === 'string'
        && typeof state.processIdentity === 'string'
        && state.processIdentity.length > 0;
}

const execFileAsync = promisify(execFile);

async function getProcessIdentity(pid: number): Promise<string | null> {
    if (!isRunning(pid)) return null;
    try {
        if (process.platform === 'win32') {
            const command = `(Get-Process -Id ${pid} -ErrorAction Stop).StartTime.ToUniversalTime().Ticks`;
            const { stdout } = await execFileAsync('powershell.exe', [
                '-NoProfile', '-NonInteractive', '-Command', command,
            ], { windowsHide: true });
            const ticks = stdout.trim();
            return ticks ? `win:${ticks}` : null;
        }
        if (process.platform === 'linux') {
            const stat = await readFile(`/proc/${pid}/stat`, 'utf8');
            const closingParen = stat.lastIndexOf(')');
            const fieldsAfterCommand = stat.slice(closingParen + 2).trim().split(/\s+/);
            const startTicks = fieldsAfterCommand[19];
            return startTicks ? `proc:${startTicks}` : null;
        }
        const { stdout } = await execFileAsync('ps', ['-p', String(pid), '-o', 'lstart='], { windowsHide: true });
        const startedAt = stdout.trim();
        return startedAt ? `ps:${startedAt}` : null;
    } catch {
        return null;
    }
}

async function ownsSavedProcess(state: PreviewState): Promise<boolean> {
    return state.processIdentity === await getProcessIdentity(state.pid);
}

export function validatePort(value: number): number {
    if (!Number.isSafeInteger(value) || value < 1 || value > 65_535) {
        throw new RangeError(`Port must be an integer between 1 and 65535: ${value}`);
    }
    return value;
}

export async function getStartCommand(root: string): Promise<string[] | null> {
    const pkgFile = join(root, 'package.json');
    const data = JSON.parse(await readFile(pkgFile, 'utf-8')) as PackageJson;
    const scripts = data.scripts ?? {};
    let npmCommand = ['npm'];
    if (process.platform === 'win32') {
        const configured = process.env.npm_execpath;
        const bundled = join(dirname(process.execPath), 'node_modules', 'npm', 'bin', 'npm-cli.js');
        const npmCli = configured && configured.endsWith('.js') && existsSync(configured)
            ? configured
            : bundled;
        if (!existsSync(npmCli)) throw new Error('Unable to locate npm-cli.js');
        npmCommand = [process.execPath, npmCli];
    }
    if (scripts.dev) return [...npmCommand, 'run', 'dev'];
    if (scripts.start) return [...npmCommand, 'start'];
    return null;
}

async function writeState(root: string, state: PreviewState): Promise<void> {
    const paths = pathsFor(root);
    await mkdir(paths.cacheDir, { recursive: true });
    const temporary = `${paths.stateFile}.${process.pid}.tmp`;
    await writeFile(temporary, `${JSON.stringify(state, null, 2)}\n`, 'utf-8');
    await rename(temporary, paths.stateFile);
}

async function deleteState(root: string): Promise<void> {
    try {
        await unlink(pathsFor(root).stateFile);
    } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code !== 'ENOENT') throw error;
    }
}

export async function readState(root: string): Promise<PreviewState | null> {
    try {
        const parsed: unknown = JSON.parse(await readFile(pathsFor(root).stateFile, 'utf-8'));
        if (!isPreviewState(parsed)) throw new Error('Preview state has an invalid shape');
        return parsed;
    } catch (error: unknown) {
        if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
        throw error;
    }
}

export async function isPortOpen(port: number, timeoutMs = 400): Promise<boolean> {
    validatePort(port);
    return new Promise<boolean>(resolvePromise => {
        const socket = connect({ host: '127.0.0.1', port });
        let settled = false;
        const finish = (open: boolean): void => {
            if (settled) return;
            settled = true;
            socket.destroy();
            resolvePromise(open);
        };
        socket.setTimeout(timeoutMs);
        socket.once('connect', () => finish(true));
        socket.once('timeout', () => finish(false));
        socket.once('error', () => finish(false));
    });
}

async function waitForReadiness(
    port: number,
    child: ChildProcess,
    timeoutMs: number,
): Promise<void> {
    let childFailure: Error | null = null;
    const onError = (error: Error): void => { childFailure = error; };
    const onExit = (code: number | null, signal: NodeJS.Signals | null): void => {
        childFailure = new Error(`Preview exited before readiness (code=${code}, signal=${signal ?? 'none'})`);
    };
    child.once('error', onError);
    child.once('exit', onExit);

    try {
        const deadline = Date.now() + timeoutMs;
        while (Date.now() < deadline) {
            if (childFailure) throw childFailure;
            if (await isPortOpen(port)) return;
            await new Promise<void>(resolvePromise => setTimeout(resolvePromise, 200));
        }
        throw new Error(`Preview did not become ready on port ${port} within ${timeoutMs}ms`);
    } finally {
        child.off('error', onError);
        child.off('exit', onExit);
    }
}

async function migrateLegacyState(root: string, port: number): Promise<PreviewState | null> {
    const legacyPidFile = pathsFor(root).legacyPidFile;
    const pid = await loadPid(legacyPidFile);
    if (!pid) {
        await deletePidFile(legacyPidFile);
        return null;
    }
    if (!isRunning(pid)) {
        await deletePidFile(legacyPidFile);
        return null;
    }
    if (!(await isPortOpen(port))) {
        throw new Error(`Legacy preview PID ${pid} is running but port ${port} is not reachable`);
    }
    const processIdentity = await getProcessIdentity(pid);
    if (!processIdentity) throw new Error(`Unable to identify legacy preview PID ${pid}`);

    const state: PreviewState = {
        version: 1,
        pid,
        port,
        url: `http://localhost:${port}`,
        cwd: root,
        command: ['legacy-preview'],
        startedAt: new Date().toISOString(),
        processIdentity,
    };
    await writeState(root, state);
    await deletePidFile(legacyPidFile);
    return state;
}

async function existingState(root: string, migrationPort: number): Promise<PreviewState | null> {
    return (await readState(root)) ?? migrateLegacyState(root, migrationPort);
}

export async function startServer(
    root = process.cwd(),
    port = 3_000,
    readinessTimeoutMs = 30_000,
): Promise<PreviewState> {
    root = resolve(root);
    validatePort(port);
    const current = await existingState(root, port);
    if (current) {
        if (!isRunning(current.pid)) {
            await deleteState(root);
        } else if (!(await ownsSavedProcess(current))) {
            await deleteState(root);
        } else if (await isPortOpen(current.port)) {
            return current;
        } else {
            throw new Error(`Preview PID ${current.pid} is alive but port ${current.port} is unhealthy; stop it before restarting`);
        }
    }
    if (await isPortOpen(port)) {
        throw new Error(`Port ${port} is already in use by another process`);
    }

    let command: string[] | null;
    try {
        command = await getStartCommand(root);
    } catch (error: unknown) {
        throw new Error(`Cannot read package.json: ${errorMessage(error)}`);
    }
    if (!command) throw new Error("No 'dev' or 'start' script found in package.json");

    const paths = pathsFor(root);
    await mkdir(paths.cacheDir, { recursive: true });
    const logHandle = await open(paths.logFile, 'w');
    let child: ChildProcess;
    try {
        child = spawn(command[0], command.slice(1), {
            detached: true,
            stdio: ['ignore', logHandle.fd, logHandle.fd],
            env: { ...process.env, PORT: port.toString() },
            cwd: root,
            shell: false,
            windowsHide: true,
        });
    } catch (error: unknown) {
        await logHandle.close();
        throw error;
    }

    try {
        await waitForReadiness(port, child, readinessTimeoutMs);
        const childPid = child.pid;
        if (!childPid) throw new Error('Preview process did not provide a PID');
        const processIdentity = await getProcessIdentity(childPid);
        if (!processIdentity) throw new Error(`Unable to identify preview PID ${childPid}`);
        const state: PreviewState = {
            version: 1,
            pid: childPid,
            port,
            url: `http://localhost:${port}`,
            cwd: root,
            command,
            startedAt: new Date().toISOString(),
            processIdentity,
        };
        await writeState(root, state);
        child.unref();
        await logHandle.close();
        return state;
    } catch (error: unknown) {
        await logHandle.close();
        if (child.pid && isRunning(child.pid)) await killProcessTree(child.pid);
        await deleteState(root);
        throw error;
    }
}

export async function getStatus(root = process.cwd()): Promise<PreviewStatus> {
    root = resolve(root);
    const state = await existingState(root, 3_000);
    if (!state) return { status: 'stopped', state: null };
    if (!isRunning(state.pid)) {
        await deleteState(root);
        return { status: 'stale', state };
    }
    if (!(await ownsSavedProcess(state))) {
        await deleteState(root);
        return { status: 'stale', state };
    }
    return {
        status: await isPortOpen(state.port) ? 'running' : 'unhealthy',
        state,
    };
}

export async function stopServer(root = process.cwd()): Promise<PreviewStatus> {
    root = resolve(root);
    const state = await existingState(root, 3_000);
    if (!state) return { status: 'stopped', state: null };
    if (!isRunning(state.pid)) {
        await deleteState(root);
        return { status: 'stale', state };
    }
    if (!(await ownsSavedProcess(state))) {
        await deleteState(root);
        return { status: 'stale', state };
    }
    if (!(await isPortOpen(state.port))) {
        throw new Error(`Refusing to kill unverified PID ${state.pid}: port ${state.port} is not reachable`);
    }

    await killProcessTree(state.pid);
    if (isRunning(state.pid)) throw new Error(`Preview PID ${state.pid} is still running`);
    await deleteState(root);
    return { status: 'stopped', state };
}

async function main(argv = process.argv.slice(2)): Promise<number> {
    const { positionals } = parseArgs({ args: argv, allowPositionals: true, options: {} });
    const action = positionals[0];
    if (action === 'start') {
        const rawPort = positionals[1] ?? '3000';
        if (!/^\d+$/.test(rawPort)) throw new RangeError(`Invalid port: ${rawPort}`);
        const state = await startServer(process.cwd(), validatePort(Number(rawPort)));
        console.log(`Preview running (PID: ${state.pid})`);
        console.log(`Logs: ${pathsFor(process.cwd()).logFile}`);
        console.log(`URL: ${state.url}`);
        return 0;
    }
    if (action === 'stop') {
        const result = await stopServer();
        console.log(result.status === 'stopped' && result.state
            ? `Preview stopped (PID: ${result.state.pid})`
            : 'No running preview found.');
        return 0;
    }
    if (action === 'status') {
        const result = await getStatus();
        console.log(`Status: ${result.status}`);
        if (result.state) {
            console.log(`PID: ${result.state.pid}`);
            console.log(`URL: ${result.state.url}`);
            console.log(`Logs: ${pathsFor(process.cwd()).logFile}`);
        }
        return result.status === 'unhealthy' ? 1 : 0;
    }
    console.error('Usage: npx tsx auto_preview.ts [start|stop|status] [port]');
    return 1;
}

const isMain = process.argv[1]
    && resolve(process.argv[1]) === resolve(fileURLToPath(import.meta.url));
if (isMain) {
    main().then(
        code => { process.exitCode = code; },
        (error: unknown) => {
            console.error(`Error: ${errorMessage(error)}`);
            process.exitCode = 1;
        },
    );
}
