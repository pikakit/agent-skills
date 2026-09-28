import assert from 'node:assert/strict';
import { execFile } from 'node:child_process';
import { mkdtemp, mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { createServer } from 'node:net';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { promisify } from 'node:util';
import { fileURLToPath } from 'node:url';
import { describe, test } from 'node:test';
import {
    runProblemChecker,
    tryFix,
    type Diagnostic,
    type TypeCheckResult,
} from '../skills/problem-checker/scripts/check_problems.ts';
import {
    runSecretScannerCli,
    scanForSecrets,
    scanPath,
} from '../skills/knowledge-compiler/scripts/secret-scanner.ts';
import {
    getStatus,
    readState,
    startServer,
    stopServer,
    validatePort,
} from '../scripts/auto_preview.ts';
import { isRunning, killProcessTree } from '../scripts/utils/process-manager.ts';

const execFileAsync = promisify(execFile);
const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..', '..');

async function temporaryDirectory(t: { after: (callback: () => Promise<void>) => void }): Promise<string> {
    const directory = await mkdtemp(path.join(tmpdir(), 'pikakit-safety-'));
    t.after(() => rm(directory, { recursive: true, force: true }));
    return directory;
}

function diagnostic(file: string, message: string, code = 'TS2304'): Diagnostic {
    return { file, line: 1, column: 1, severity: 'error', code, message };
}

function typeCheck(errors: Diagnostic[]): TypeCheckResult {
    return { errors, warnings: [], skipped: false };
}

describe('transactional problem checker', () => {
    test('commits a fix only after diagnostics improve', async t => {
        const root = await temporaryDirectory(t);
        const file = path.join(root, 'component.tsx');
        await writeFile(file, 'const state = useState(0);\n', 'utf-8');
        let calls = 0;
        const execution = await runProblemChecker({
            directory: root,
            fix: true,
            typeCheck: async () => calls++ === 0
                ? typeCheck([diagnostic(file, "Cannot find name 'useState'.")])
                : typeCheck([]),
        });

        assert.equal(execution.exitCode, 0);
        assert.equal(execution.result.status, 'CLEAN');
        assert.equal(execution.result.totalFixed, 1);
        assert.deepEqual(execution.result.changedFiles, ['component.tsx']);
        assert.match(await readFile(file, 'utf-8'), /^import \{ useState \} from 'react';/);
    });

    test('restores exact bytes when a fix introduces a new diagnostic', async t => {
        const root = await temporaryDirectory(t);
        const file = path.join(root, 'component.tsx');
        const original = '\uFEFFconst state = useState(0);\r\n';
        await writeFile(file, original, 'utf-8');
        let calls = 0;
        const execution = await runProblemChecker({
            directory: root,
            fix: true,
            typeCheck: async () => calls++ === 0
                ? typeCheck([diagnostic(file, "Cannot find name 'useState'.")])
                : typeCheck([diagnostic(file, 'A new regression.', 'TS9999')]),
        });

        assert.equal(execution.exitCode, 1);
        assert.equal(execution.result.rolledBack, true);
        assert.equal(execution.result.rollbackReason, 'new-diagnostics');
        assert.equal(await readFile(file, 'utf-8'), original);
    });

    test('refuses to modify a diagnostic path outside the project root', async t => {
        const root = await temporaryDirectory(t);
        const outsideRoot = await temporaryDirectory(t);
        const outsideFile = path.join(outsideRoot, 'outside.tsx');
        const original = 'const state = useState(0);\n';
        await writeFile(outsideFile, original, 'utf-8');
        const execution = await runProblemChecker({
            directory: root,
            fix: true,
            typeCheck: async () => typeCheck([diagnostic(outsideFile, "Cannot find name 'useState'.")]),
        });

        assert.equal(execution.exitCode, 1);
        assert.equal(execution.result.totalFixed, 0);
        assert.equal(await readFile(outsideFile, 'utf-8'), original);
    });

    test('returns exit code 2 for an operational typecheck failure', async t => {
        const root = await temporaryDirectory(t);
        const execution = await runProblemChecker({
            directory: root,
            typeCheck: async () => { throw new Error('compiler unavailable'); },
        });
        assert.equal(execution.exitCode, 2);
        assert.equal(execution.result.status, 'ERROR');
        assert.match(execution.result.error ?? '', /compiler unavailable/);
    });

    test('keeps @charset before moved CSS imports', () => {
        const problem = diagnostic('style.css', '@import must precede all other rules');
        const fixed = tryFix('@charset "UTF-8";\nbody {}\n@import "theme.css";\n', problem, 'style.css');
        assert.equal(fixed?.content, '@charset "UTF-8";\n@import "theme.css";\nbody {}\n');
    });
});

describe('repository secret scanner', () => {
    test('scans hidden source directories, finds every match, and ignores dependencies', async t => {
        const root = await temporaryDirectory(t);
        const sourceDir = path.join(root, '.agent', 'scripts');
        const ignoredDir = path.join(root, 'node_modules', 'dependency');
        await mkdir(sourceDir, { recursive: true });
        await mkdir(ignoredDir, { recursive: true });
        const openAi = ['sk', 'proj', 'A'.repeat(28)].join('-');
        const github = `ghp_${'B'.repeat(24)}`;
        await writeFile(path.join(sourceDir, 'config.ts'), `const keys = '${openAi} ${github}'`, 'utf-8');
        await writeFile(path.join(ignoredDir, 'ignored.js'), `const key = '${openAi}'`, 'utf-8');

        const result = scanPath(root);
        assert.equal(result.errors.length, 0);
        assert.equal(result.filesChecked, 1);
        assert.equal(result.violations.length, 2);
        assert.ok(result.violations.every(item => !item.snippet.includes(openAi) && !item.snippet.includes(github)));
    });

    test('strips zero-width characters without exempting code spans', () => {
        const token = ['sk', 'ant', `api03${'C'.repeat(24)}`].join('-');
        const obfuscated = `${token.slice(0, 5)}\u200B${token.slice(5)}`;
        const result = scanForSecrets(`key = \`${obfuscated}\``);
        assert.equal(result.found, true);
        assert.equal(result.violations.length, 1);
    });

    test('does not allow comments to suppress a real secret', () => {
        const token = `ghp_${'E'.repeat(24)}`;
        const result = scanForSecrets(`const token = '${token}'; // secret-scan: allow`, 'source.ts');
        assert.equal(result.found, true);
        assert.equal(result.violations.length, 1);
        assert.doesNotMatch(result.violations[0].snippet, new RegExp(token));
    });

    test('reports a missing path as a scanner error', async t => {
        const root = await temporaryDirectory(t);
        const result = scanPath(path.join(root, 'missing'));
        assert.equal(result.filesChecked, 0);
        assert.equal(result.errors.length, 1);
    });

    test('emits one parseable JSON document in JSON mode', async t => {
        const root = await temporaryDirectory(t);
        await writeFile(path.join(root, 'clean.ts'), 'export const clean = true;\n', 'utf-8');
        const script = path.join(repoRoot, '.agent', 'skills', 'knowledge-compiler', 'scripts', 'secret-scanner.ts');
        const tsxCli = path.join(repoRoot, 'node_modules', 'tsx', 'dist', 'cli.mjs');
        const { stdout } = await execFileAsync(process.execPath, [tsxCli, script, root, '--json']);
        const parsed = JSON.parse(stdout) as { status: string; filesChecked: number };
        assert.equal(parsed.status, 'CLEAN');
        assert.equal(parsed.filesChecked, 1);
    });

    test('CLI contract maps findings and scanner errors to exit codes 1 and 2', async t => {
        const root = await temporaryDirectory(t);
        const token = ['ghp', 'D'.repeat(24)].join('_');
        await writeFile(path.join(root, 'secret.ts'), `const token = '${token}'`, 'utf-8');
        assert.equal(runSecretScannerCli([root, '--json']), 1);
        assert.equal(runSecretScannerCli([path.join(root, 'missing'), '--json']), 2);
    });
});

async function freePort(): Promise<number> {
    return new Promise<number>((resolvePromise, reject) => {
        const server = createServer();
        server.once('error', reject);
        server.listen(0, '127.0.0.1', () => {
            const address = server.address();
            if (!address || typeof address === 'string') {
                server.close();
                reject(new Error('Could not allocate a port'));
                return;
            }
            server.close(error => error ? reject(error) : resolvePromise(address.port));
        });
    });
}

describe('preview lifecycle and process safety', () => {
    test('validates the full TCP port range', () => {
        assert.equal(validatePort(1), 1);
        assert.equal(validatePort(65_535), 65_535);
        assert.throws(() => validatePort(0), RangeError);
        assert.throws(() => validatePort(Number.NaN), RangeError);
    });

    test('starts only after readiness, persists the selected port, and verifies stop', async t => {
        const root = await temporaryDirectory(t);
        const port = await freePort();
        await writeFile(path.join(root, 'package.json'), JSON.stringify({
            scripts: { dev: 'node server.mjs' },
        }), 'utf-8');
        await writeFile(path.join(root, 'server.mjs'), [
            "import { createServer } from 'node:http';",
            "const server = createServer((_request, response) => response.end('ok'));",
            "server.listen(Number(process.env.PORT), '127.0.0.1');",
        ].join('\n'), 'utf-8');

        const state = await startServer(root, port, 10_000);
        t.after(async () => {
            if (isRunning(state.pid)) await killProcessTree(state.pid);
        });
        assert.equal(state.port, port);
        assert.equal((await getStatus(root)).status, 'running');
        const stopped = await stopServer(root);
        assert.equal(stopped.status, 'stopped');
        assert.equal(isRunning(state.pid), false);
        assert.equal((await getStatus(root)).status, 'stopped');
    });

    test('reports an early child exit and leaves no active state', async t => {
        const root = await temporaryDirectory(t);
        const port = await freePort();
        await writeFile(path.join(root, 'package.json'), JSON.stringify({
            scripts: { dev: 'node -e "process.exit(7)"' },
        }), 'utf-8');

        await assert.rejects(
            () => startServer(root, port, 3_000),
            /exited before readiness/,
        );
        assert.equal((await getStatus(root)).status, 'stopped');
    });

    test('cleans dead stale state without killing another process', async t => {
        const root = await temporaryDirectory(t);
        const cache = path.join(root, '.pikakit-cache');
        await mkdir(cache, { recursive: true });
        await writeFile(path.join(cache, 'preview.json'), JSON.stringify({
            version: 1,
            pid: 2_000_000_000,
            port: 3_000,
            url: 'http://localhost:3000',
            cwd: root,
            command: ['npm', 'run', 'dev'],
            startedAt: new Date().toISOString(),
            processIdentity: 'stale-test-process',
        }), 'utf-8');
        assert.equal((await getStatus(root)).status, 'stale');
        assert.equal((await getStatus(root)).status, 'stopped');
    });

    test('refuses readiness when another process already owns the port', async t => {
        const root = await temporaryDirectory(t);
        const blocker = createServer((_socket) => undefined);
        await new Promise<void>((resolvePromise, reject) => {
            blocker.once('error', reject);
            blocker.listen(0, '127.0.0.1', resolvePromise);
        });
        t.after(() => blocker.close());
        const address = blocker.address();
        assert.ok(address && typeof address !== 'string');
        await writeFile(path.join(root, 'package.json'), JSON.stringify({
            scripts: { dev: 'node -e "setInterval(() => {}, 1000)"' },
        }), 'utf-8');

        await assert.rejects(
            () => startServer(root, address.port, 1_000),
            /already in use/,
        );
        assert.equal(await readState(root), null);
    });

    test('does not kill a reused PID when the saved process identity differs', async t => {
        const root = await temporaryDirectory(t);
        const cache = path.join(root, '.pikakit-cache');
        await mkdir(cache, { recursive: true });
        await writeFile(path.join(cache, 'preview.json'), JSON.stringify({
            version: 1,
            pid: process.pid,
            port: 3_000,
            url: 'http://localhost:3000',
            cwd: root,
            command: ['npm', 'run', 'dev'],
            startedAt: new Date().toISOString(),
            processIdentity: 'not-the-current-process',
        }), 'utf-8');

        const result = await stopServer(root);
        assert.equal(result.status, 'stale');
        assert.equal(isRunning(process.pid), true);
        assert.equal(await readState(root), null);
    });

    test('rejects unsafe process identifiers', async () => {
        assert.throws(() => isRunning(0), RangeError);
        await assert.rejects(() => killProcessTree(-1), RangeError);
    });
});
