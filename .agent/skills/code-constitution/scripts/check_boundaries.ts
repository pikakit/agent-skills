// @ts-nocheck
/**
 * Code Constitution — Boundary Checker
 * Validates system boundaries and ownership rules.
 *
 * Usage:
 *   npx tsx check_boundaries.ts <directory>
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface BoundaryViolation {
  file: string;
  line: number;
  rule: string;
  severity: 'error' | 'warning';
  message: string;
}

interface BoundaryRule {
  pattern: RegExp;
  rule: string;
  message: string;
  severity: 'error' | 'warning';
}

const BOUNDARY_RULES: BoundaryRule[] = [
  {
    pattern: /import\s+.*from\s+['"]\.\.\//,
    rule: 'NO_PARENT_IMPORT',
    message: 'Importing from parent directory may violate ownership boundaries',
    severity: 'warning',
  },
  {
    pattern: /require\s*\(\s*['"]\.\.\//,
    rule: 'NO_PARENT_REQUIRE',
    message: 'Requiring from parent directory may violate ownership boundaries',
    severity: 'warning',
  },
  {
    pattern: /process\.env\.\w+/,
    rule: 'ENV_ACCESS',
    message: 'Direct environment variable access — ensure ownership is correct',
    severity: 'warning',
  },
  {
    pattern: /fs\.(writeFile|unlink|rmdir|rm)\s*\(/,
    rule: 'DESTRUCTIVE_FS',
    message: 'Destructive filesystem operation — verify boundary ownership',
    severity: 'error',
  },
  {
    pattern: /child_process|exec\s*\(|execSync|spawn/,
    rule: 'PROCESS_EXECUTION',
    message: 'Process execution detected — verify this is within skill boundaries',
    severity: 'warning',
  },
];

function scanFile(filePath: string): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');
  const lines = content.split('\n');

  lines.forEach((line, index) => {
    for (const rule of BOUNDARY_RULES) {
      if (rule.pattern.test(line)) {
        violations.push({
          file: filePath,
          line: index + 1,
          rule: rule.rule,
          severity: rule.severity,
          message: rule.message,
        });
      }
    }
  });

  return violations;
}

function scanDirectory(dirPath: string): BoundaryViolation[] {
  const violations: BoundaryViolation[] = [];
  const extensions = ['.ts', '.js', '.tsx', '.jsx'];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', '.agent'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (extensions.some(ext => entry.name.endsWith(ext))) {
        violations.push(...scanFile(fullPath));
      }
    }
  }

  walk(dirPath);
  return violations;
}

function main(): void {
  const targetDir = process.argv[2] || '.';

  if (!fs.existsSync(targetDir)) {
    console.error(JSON.stringify({
      status: 'error',
      error: { code: 'ERR_DIR_NOT_FOUND', message: `Directory not found: ${targetDir}`, recoverable: false }
    }));
    process.exit(1);
  }

  const violations = scanDirectory(targetDir);
  const errors = violations.filter(v => v.severity === 'error');
  const warnings = violations.filter(v => v.severity === 'warning');

  console.log(JSON.stringify({
    status: errors.length > 0 ? 'error' : 'success',
    data: {
      directory: targetDir,
      totalViolations: violations.length,
      errors: errors.length,
      warnings: warnings.length,
      violations: violations.slice(0, 50), // Cap at 50
    }
  }));

  process.exit(errors.length > 0 ? 1 : 0);
}

main();
