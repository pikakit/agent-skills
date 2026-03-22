#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

const VERSION = '1.0.0';
const SKIP_DIRS = new Set(['node_modules', '.git', 'dist', 'build', '.next', 'coverage', '.turbo']);
const CODE_EXTS = new Set(['.js', '.ts', '.jsx', '.tsx', '.mjs', '.cjs']);

const THRESHOLDS = {
  maxFunctionLines: 20,
  maxArgs: 3,
  maxNestingDepth: 2
};

function scanDirectory(dir, results) {
  let entries;
  try { entries = fs.readdirSync(dir, { withFileTypes: true }); } catch { return; }

  for (const entry of entries) {
    if (SKIP_DIRS.has(entry.name)) continue;
    const fullPath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      scanDirectory(fullPath, results);
    } else if (CODE_EXTS.has(path.extname(entry.name))) {
      analyzeFile(fullPath, results);
    }
  }
}

function analyzeFile(filePath, results) {
  let content;
  try { content = fs.readFileSync(filePath, 'utf8'); } catch { return; }
  const lines = content.split('\n');
  const fileIssues = [];

  // --- Rule 1: Function length > 20 lines ---
  const funcPattern = /(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?(?:function|\(|[a-zA-Z_$]\w*\s*=>)|\w+\s*\(.*\)\s*\{)/;
  let funcStart = -1;
  let funcName = '';
  let braceDepth = 0;
  let inFunc = false;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (!inFunc) {
      const match = line.match(funcPattern);
      if (match) {
        funcStart = i;
        funcName = (line.match(/function\s+(\w+)/) || line.match(/(?:const|let|var)\s+(\w+)/) || ['', 'anonymous'])[1];
        braceDepth = 0;
        inFunc = true;
      }
    }
    if (inFunc) {
      for (const ch of line) {
        if (ch === '{') braceDepth++;
        if (ch === '}') braceDepth--;
      }
      if (braceDepth <= 0 && funcStart >= 0) {
        const funcLen = i - funcStart + 1;
        if (funcLen > THRESHOLDS.maxFunctionLines) {
          fileIssues.push({
            rule: 'FUNC_TOO_LONG',
            severity: 'warning',
            line: funcStart + 1,
            message: `Function '${funcName}' is ${funcLen} lines (max ${THRESHOLDS.maxFunctionLines}).`
          });
        }
        inFunc = false;
        funcStart = -1;
      }
    }
  }

  // --- Rule 2: Too many arguments ---
  const argPattern = /(?:function\s+\w+|(?:const|let|var)\s+\w+\s*=\s*(?:async\s+)?function)\s*\(([^)]*)\)/g;
  let argMatch;
  while ((argMatch = argPattern.exec(content)) !== null) {
    const args = argMatch[1].split(',').filter(a => a.trim().length > 0);
    if (args.length > THRESHOLDS.maxArgs) {
      const lineNum = content.substring(0, argMatch.index).split('\n').length;
      const fName = (argMatch[0].match(/function\s+(\w+)/) || argMatch[0].match(/(?:const|let|var)\s+(\w+)/) || ['', 'anonymous'])[1];
      fileIssues.push({
        rule: 'TOO_MANY_ARGS',
        severity: 'warning',
        line: lineNum,
        message: `Function '${fName}' has ${args.length} args (max ${THRESHOLDS.maxArgs}).`
      });
    }
  }

  // --- Rule 3: Nesting depth > 2 ---
  let currentDepth = 0;
  let maxDepthFound = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i].trim();
    if (/^\/\//.test(line) || /^\/\*/.test(line) || /^\*/.test(line)) continue;
    for (const ch of line) {
      if (ch === '{') { currentDepth++; if (currentDepth > maxDepthFound) maxDepthFound = currentDepth; }
      if (ch === '}') currentDepth--;
    }
    if (currentDepth > THRESHOLDS.maxNestingDepth + 1) {
      fileIssues.push({
        rule: 'DEEP_NESTING',
        severity: 'warning',
        line: i + 1,
        message: `Nesting depth ${currentDepth} exceeds max ${THRESHOLDS.maxNestingDepth} levels.`
      });
    }
  }

  // --- Rule 4: Magic numbers ---
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    if (/^\s*\/\//.test(line) || /^\s*\*/.test(line)) continue;
    if (/^\s*(const|let|var|import|export|return)\s/.test(line)) continue;
    const magicMatch = line.match(/[^a-zA-Z_$\d.]\b(\d{2,})\b(?!\s*[;:})\]]?\s*\/\/)/g);
    if (magicMatch) {
      for (const m of magicMatch) {
        const num = m.match(/\d+/)?.[0];
        if (num && !['10', '16', '100'].includes(num) && !/['"`]/.test(line)) {
          fileIssues.push({
            rule: 'MAGIC_NUMBER',
            severity: 'info',
            line: i + 1,
            message: `Possible magic number '${num}'. Consider using a named constant.`
          });
        }
      }
    }
  }

  if (fileIssues.length > 0) {
    results.push({ file: path.relative(process.cwd(), filePath), issues: fileIssues });
  }
}

function main() {
  const args = process.argv.slice(2);
  let targetPath = process.cwd();
  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--target' && args[i + 1]) {
      targetPath = path.resolve(args[i + 1]);
    }
  }

  if (!fs.existsSync(targetPath)) {
    console.log(JSON.stringify({
      status: 'error', data: null,
      error: { code: 'ERR_TARGET_NOT_FOUND', message: `Target path not found: ${targetPath}` }
    }, null, 2));
    process.exit(1);
  }

  const results = [];
  const stat = fs.statSync(targetPath);
  if (stat.isDirectory()) {
    scanDirectory(targetPath, results);
  } else {
    analyzeFile(targetPath, results);
  }

  const totalIssues = results.reduce((sum, r) => sum + r.issues.length, 0);
  const data = {
    version: VERSION,
    scannedPath: targetPath,
    timestamp: new Date().toISOString(),
    thresholds: THRESHOLDS,
    findings: results,
    summary: { totalFilesWithIssues: results.length, totalIssues }
  };

  if (totalIssues > 0) {
    console.log(JSON.stringify({
      status: 'error', data,
      error: { code: 'ERR_QUALITY_VIOLATION', message: `Found ${totalIssues} code quality violations.` }
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
