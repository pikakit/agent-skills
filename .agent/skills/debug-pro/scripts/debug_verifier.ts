#!/usr/bin/env node
// @ts-nocheck
import * as fs from 'node:fs';

const VERSION = '1.0.0';

/**
 * Validates a debugging report JSON to ensure it meets the 4-Phase standard.
 * Expected JSON format:
 * {
 *   "bug": "Brief description",
 *   "reproduce_command": "npm run test:fail",
 *   "five_whys": ["Why 1", "Why 2", "Why 3"],
 *   "regression_test_file": "path/to/test.js"
 * }
 */
function validateDebugReport(dataStr) {
  let data;
  try {
    data = JSON.parse(dataStr);
  } catch (e) {
    return {
      valid: false,
      issues: [{ rule: 'JSON_PARSE_ERROR', message: 'Input is not a valid JSON string.' }]
    };
  }

  const issues = [];

  if (!data.bug || typeof data.bug !== 'string' || data.bug.length < 10) {
    issues.push({
      rule: 'MISSING_BUG_DESC',
      message: 'Bug description is missing or too short.'
    });
  }

  if (!data.reproduce_command || typeof data.reproduce_command !== 'string') {
    issues.push({
      rule: 'MISSING_REPRODUCE',
      message: 'Phase 1: Missing reproduction command or steps.'
    });
  }

  if (!data.five_whys || !Array.isArray(data.five_whys) || data.five_whys.length < 3) {
    issues.push({
      rule: 'INCOMPLETE_FIVE_WHYS',
      message: 'Phase 3: Understand phase requires at least 3 levels of "Why" (5 recommended) to reach the root cause.'
    });
  }

  if (!data.regression_test_file || typeof data.regression_test_file !== 'string') {
    issues.push({
      rule: 'MISSING_REGRESSION_TEST',
      message: 'Phase 4: Missing regression_test_file. A fix must include a test to prevent recurrence.'
    });
  }

  return { valid: issues.length === 0, issues };
}

function processInput(inputStr) {
  if (!inputStr || inputStr.trim() === '') {
    console.log(JSON.stringify({
      status: 'error', data: null,
      error: { code: 'ERR_EMPTY_DRAFT', message: 'Input debug report is empty.' }
    }, null, 2));
    process.exit(1);
  }

  const result = validateDebugReport(inputStr);

  const data = {
    version: VERSION,
    timestamp: new Date().toISOString()
  };

  if (!result.valid) {
    console.log(JSON.stringify({
      status: 'error',
      data,
      error: {
        code: 'ERR_DEBUG_VERIFICATION_FAILED',
        message: 'Debug report failed validation. Fix Phase requirements.',
        details: result.issues
      }
    }, null, 2));
    process.exit(1);
  } else {
    data.verified = true;
    console.log(JSON.stringify({
      status: 'success',
      data,
      error: null,
      message: 'Debug report meets all 4-phase requirements. Ready for fix execution.'
    }, null, 2));
    process.exit(0);
  }
}

function main() {
  const args = process.argv.slice(2);
  let targetFile = null;

  for (let i = 0; i < args.length; i++) {
    if (args[i] === '--file' && args[i + 1]) targetFile = args[i + 1];
  }

  if (targetFile) {
    if (!fs.existsSync(targetFile)) {
      console.log(JSON.stringify({
        status: 'error', data: null,
        error: { code: 'ERR_REFERENCE_NOT_FOUND', message: `File not found: ${targetFile}` }
      }, null, 2));
      process.exit(1);
    }
    const content = fs.readFileSync(targetFile, 'utf8');
    processInput(content);
  } else {
    // Read from stdin
    let inputStr = '';
    process.stdin.setEncoding('utf8');
    process.stdin.on('readable', () => {
      let chunk;
      while ((chunk = process.stdin.read()) !== null) {
        inputStr += chunk;
      }
    });

    process.stdin.on('end', () => {
      processInput(inputStr);
    });

    setTimeout(() => {
      if (inputStr === '' && process.stdin.isTTY) {
        console.error("Usage: node debug_verifier.js --file <report.json> OR pipe JSON: cat report.json | node debug_verifier.js");
        process.exit(1);
      }
    }, 100);
  }
}

try { main(); } catch (e) {
  console.log(JSON.stringify({
    status: 'error', data: null,
    error: { code: 'ERR_FATAL', phase: 'execution', message: e.message }
  }, null, 2));
  process.exit(1);
}
