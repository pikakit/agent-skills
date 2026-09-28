#!/usr/bin/env node
/** Runs the repository-local TypeScript compiler without invoking a shell or networked package runner. */

import { spawn } from 'node:child_process';
import { createRequire } from 'node:module';
import { dirname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const require = createRequire(import.meta.url);
const root = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const child = spawn(process.execPath, [require.resolve('typescript/bin/tsc'), '--noEmit', '--project', 'tsconfig.json'], {
    cwd: root,
    env: { ...process.env, NO_COLOR: '1' },
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
});

child.once('error', error => {
    console.error(`Unable to start TypeScript compiler: ${error.message}`);
    process.exitCode = 2;
});

child.once('close', (code, signal) => {
    if (signal) {
        console.error(`TypeScript compiler terminated by ${signal}`);
        process.exitCode = 2;
    } else {
        process.exitCode = code ?? 2;
    }
});
