#!/usr/bin/env node
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const VERSION = '1.0.1';

function detectLanguage(targetPath) {
  if (fs.existsSync(path.join(targetPath, 'tsconfig.json'))) return 'typescript';
  if (fs.existsSync(path.join(targetPath, 'jsconfig.json'))) return 'javascript';
  if (fs.existsSync(path.join(targetPath, 'pyproject.toml')) || fs.existsSync(path.join(targetPath, 'setup.py'))) return 'python';
  if (fs.existsSync(path.join(targetPath, 'package.json'))) return 'javascript';
  return 'unknown';
}

function runTypeScript(targetPath) {
  const tsconfigPath = path.join(targetPath, 'tsconfig.json');
  const cmd = fs.existsSync(tsconfigPath)
    ? `npx tsc --noEmit --project "${tsconfigPath}"`
    : `npx tsc --noEmit --allowJs --checkJs --rootDir "${targetPath}"`;

  try {
    execSync(cmd, { cwd: targetPath, encoding: 'utf8', stdio: 'pipe' });
    return { errors: [], errorCount: 0 };
  } catch (e) {
    const output = (e.stdout || '') + (e.stderr || '');
    const lines = output.split('\n').filter(l => l.trim());
    const errors = [];
    for (const line of lines) {
      const match = line.match(/^(.+)\((\d+),(\d+)\):\s+error\s+(TS\d+):\s+(.+)$/);
      if (match) {
        errors.push({ file: match[1], line: parseInt(match[2]), col: parseInt(match[3]), code: match[4], message: match[5] });
      }
    }
    return { errors, errorCount: errors.length || 1 };
  }
}

function runPython(targetPath) {
  let cmd = `mypy "${targetPath}" --no-color-output`;
  try {
    execSync(cmd, { cwd: targetPath, encoding: 'utf8', stdio: 'pipe' });
    return { errors: [], errorCount: 0 };
  } catch (e) {
    const output = (e.stdout || '') + (e.stderr || '');
    const lines = output.split('\n').filter(l => l.trim());
    const errors = [];
    for (const line of lines) {
      const match = line.match(/^(.+):(\d+):\s+error:\s+(.+)\s+\[(.+)\]$/);
      if (match) {
        errors.push({ file: match[1], line: parseInt(match[2]), code: match[4], message: match[3] });
      }
    }
    return { errors, errorCount: errors.length || 1 };
  }
}

function main() {
  const args = process.argv.slice(2);
  let targetPath = process.cwd();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) targetPath = path.resolve(args[i + 1]);
  }

  if (!fs.existsSync(targetPath)) {
    console.log(JSON.stringify({
      status: 'error', data: null,
      error: { code: 'ERR_TARGET_NOT_FOUND', message: `Target not found: ${targetPath}` }
    }, null, 2));
    process.exit(1);
  }

  const language = detectLanguage(targetPath);
  if (language === 'unknown') {
    console.log(JSON.stringify({
      status: 'success',
      data: { version: VERSION, language: 'unknown', message: 'No tsconfig.json or pyproject.toml found. Skipping type check.' },
      error: null
    }, null, 2));
    process.exit(0);
  }

  let result;
  if (language === 'typescript' || language === 'javascript') {
    result = runTypeScript(targetPath);
  } else {
    result = runPython(targetPath);
  }

  const data = {
    version: VERSION,
    language,
    scannedPath: targetPath,
    timestamp: new Date().toISOString(),
    typeErrors: result.errors,
    summary: { totalErrors: result.errorCount }
  };

  if (result.errorCount > 0) {
    console.log(JSON.stringify({
      status: 'error', data,
      error: { code: 'ERR_TYPE_FAILURE', message: `Found ${result.errorCount} type errors.` }
    }, null, 2));
    process.exit(1);
  } else {
    console.log(JSON.stringify({ status: 'success', data, error: null }, null, 2));
    process.exit(0);
  }
}

try { main(); } catch (e) {
  console.log(JSON.stringify({
    status: 'error', data: null,
    error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
  }, null, 2));
  process.exit(1);
}
