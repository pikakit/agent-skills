#!/usr/bin/env node

import { spawn } from 'node:child_process';
import { readdir } from 'node:fs/promises';
import { createRequire } from 'node:module';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const TEST_ROOT = join(ROOT, '.agent', 'tests');

async function findTests(directory: string): Promise<string[]> {
  const tests: string[] = [];
  for (const entry of await readdir(directory, { withFileTypes: true })) {
    const entryPath = join(directory, entry.name);
    if (entry.isDirectory()) {
      tests.push(...await findTests(entryPath));
    } else if (entry.isFile() && entry.name.endsWith('.test.ts')) {
      tests.push(entryPath);
    }
  }
  return tests.sort();
}

async function main(): Promise<void> {
  let testFiles: string[];
  try {
    testFiles = await findTests(TEST_ROOT);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    console.error(`Unable to discover tests: ${message}`);
    process.exitCode = 2;
    return;
  }

  if (testFiles.length === 0) {
    console.error(`No test files found below ${TEST_ROOT}`);
    process.exitCode = 2;
    return;
  }

  const require = createRequire(import.meta.url);
  const tsxCli = require.resolve('tsx/cli');
  const child = spawn(process.execPath, [tsxCli, '--test', ...testFiles], {
    cwd: ROOT,
    env: { ...process.env, NO_COLOR: '1' },
    shell: false,
    stdio: 'inherit',
    windowsHide: true,
  });

  child.once('error', (error) => {
    console.error(`Unable to start test runner: ${error.message}`);
    process.exitCode = 2;
  });
  child.once('close', (code, signal) => {
    if (signal) {
      console.error(`Test runner terminated by ${signal}`);
      process.exitCode = 2;
    } else {
      process.exitCode = code ?? 2;
    }
  });
}

void main();
