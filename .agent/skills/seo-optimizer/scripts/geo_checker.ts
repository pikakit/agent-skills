// @ts-nocheck
/**
 * Geo-Spatial Checker
 * Validates geolocation features and geo-related SEO elements.
 *
 * Usage:
 *   npx tsx geo_checker.ts <directory>
 */

import * as fs from 'node:fs';
import * as path from 'node:path';

interface GeoCheckResult {
  file: string;
  check: string;
  status: 'pass' | 'warn' | 'fail';
  message: string;
}

function scanHtmlFile(filePath: string): GeoCheckResult[] {
  const results: GeoCheckResult[] = [];
  const content = fs.readFileSync(filePath, 'utf-8');

  // Check for geo meta tags
  if (/<meta\s+name=["']geo\.(position|region|placename)["']/i.test(content)) {
    results.push({ file: filePath, check: 'GEO_META', status: 'pass', message: 'Geo meta tags found' });
  } else {
    results.push({ file: filePath, check: 'GEO_META', status: 'warn', message: 'No geo meta tags — add if location-specific content' });
  }

  // Check for hreflang tags
  if (/<link\s+.*hreflang/i.test(content)) {
    results.push({ file: filePath, check: 'HREFLANG', status: 'pass', message: 'Hreflang link tags found' });
  } else {
    results.push({ file: filePath, check: 'HREFLANG', status: 'warn', message: 'No hreflang tags — add for multi-language/region support' });
  }

  // Check for structured data with geo info
  if (/schema\.org.*GeoCoordinates/i.test(content) || /"latitude":/i.test(content)) {
    results.push({ file: filePath, check: 'STRUCTURED_GEO', status: 'pass', message: 'Structured geo data (Schema.org) found' });
  }

  // Check for Google Maps API usage
  if (/maps\.googleapis\.com/i.test(content)) {
    // Verify API key isn't hardcoded
    if (/key=AIza[A-Za-z0-9_-]{35}/i.test(content)) {
      results.push({ file: filePath, check: 'API_KEY_EXPOSURE', status: 'fail', message: 'Hardcoded Google Maps API key detected — use environment variable' });
    } else {
      results.push({ file: filePath, check: 'MAPS_API', status: 'pass', message: 'Google Maps API usage detected' });
    }
  }

  return results;
}

function scanDirectory(dirPath: string): GeoCheckResult[] {
  const results: GeoCheckResult[] = [];
  const htmlExtensions = ['.html', '.htm', '.tsx', '.jsx', '.vue', '.svelte'];

  function walk(dir: string): void {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        if (!['node_modules', '.git', 'dist', '.next'].includes(entry.name)) {
          walk(fullPath);
        }
      } else if (htmlExtensions.some(ext => entry.name.endsWith(ext))) {
        results.push(...scanHtmlFile(fullPath));
      }
    }
  }

  walk(dirPath);
  return results;
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

  const results = scanDirectory(targetDir);
  const fails = results.filter(r => r.status === 'fail');
  const warns = results.filter(r => r.status === 'warn');
  const passes = results.filter(r => r.status === 'pass');

  console.log(JSON.stringify({
    status: fails.length > 0 ? 'error' : 'success',
    data: {
      directory: targetDir,
      totalChecks: results.length,
      passed: passes.length,
      warnings: warns.length,
      failures: fails.length,
      results: results.slice(0, 50),
    }
  }));

  process.exit(fails.length > 0 ? 1 : 0);
}

main();
