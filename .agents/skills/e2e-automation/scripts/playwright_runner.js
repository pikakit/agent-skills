#!/usr/bin/env node
/**
 * Skill: webapp-testing
 * Script: playwright_runner.js
 * Purpose: Run basic Playwright browser tests
 * Usage: node playwright_runner.js <url> [--screenshot] [--a11y]
 * Output: JSON with page info, health status, and optional screenshot path
 * Note: Requires playwright (npm install playwright)
 */

import { execSync } from 'child_process';
import { existsSync, mkdirSync } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

function checkPlaywright() {
    try {
        // Try to require playwright - this will fail if not installed
        execSync('npx playwright --version', { encoding: 'utf-8', stdio: 'pipe' });
        return true;
    } catch {
        return false;
    }
}

async function runBasicTest(url, takeScreenshot = false) {
    /**
     * Run basic browser test on URL.
     * Uses execSync to run playwright script since we can't dynamically import ESM in all environments.
     */

    if (!checkPlaywright()) {
        return {
            error: 'Playwright not installed',
            fix: 'npm install playwright && npx playwright install chromium'
        };
    }

    const result = {
        url,
        timestamp: new Date().toISOString(),
        status: 'pending'
    };

    // Create inline playwright script and run it
    const screenshotDir = join(tmpdir(), 'maestro_screenshots');
    const screenshotPath = takeScreenshot ?
        join(screenshotDir, `screenshot_${Date.now()}.png`) : '';

    const script = `
    const { chromium } = require('playwright');
    (async () => {
      const browser = await chromium.launch({ headless: true });
      const context = await browser.newContext({
        viewport: { width: 1280, height: 720 },
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      });
      const page = await context.newPage();
      
      try {
        const response = await page.goto('${url}', { waitUntil: 'networkidle', timeout: 30000 });
        
        const result = {
          page: {
            title: await page.title(),
            url: page.url(),
            status_code: response ? response.status() : null
          },
          health: {
            loaded: response ? response.ok() : false,
            has_title: !!(await page.title()),
            has_h1: await page.locator('h1').count() > 0,
            has_links: await page.locator('a').count() > 0,
            has_images: await page.locator('img').count() > 0
          },
          elements: {
            links: await page.locator('a').count(),
            buttons: await page.locator('button').count(),
            inputs: await page.locator('input').count(),
            images: await page.locator('img').count(),
            forms: await page.locator('form').count()
          }
        };
        
        ${takeScreenshot ? `
        const fs = require('fs');
        fs.mkdirSync('${screenshotDir.replace(/\\/g, '\\\\')}', { recursive: true });
        await page.screenshot({ path: '${screenshotPath.replace(/\\/g, '\\\\')}', fullPage: true });
        result.screenshot = '${screenshotPath.replace(/\\/g, '\\\\')}';
        ` : ''}
        
        result.status = result.health.loaded ? 'success' : 'failed';
        result.summary = result.status === 'success' ? '[OK] Page loaded successfully' : '[X] Page failed to load';
        
        console.log(JSON.stringify(result));
      } catch (e) {
        console.log(JSON.stringify({ status: 'error', error: e.message, summary: '[X] Error: ' + e.message.slice(0, 100) }));
      } finally {
        await browser.close();
      }
    })();
  `;

    try {
        const output = execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
            encoding: 'utf-8',
            timeout: 60000
        });

        try {
            return { ...result, ...JSON.parse(output.trim()) };
        } catch {
            return { ...result, status: 'error', error: 'Failed to parse output', raw: output };
        }
    } catch (e) {
        return {
            ...result,
            status: 'error',
            error: e.message,
            summary: `[X] Error: ${e.message.slice(0, 100)}`
        };
    }
}

async function runAccessibilityCheck(url) {
    /**
     * Run basic accessibility check.
     */
    if (!checkPlaywright()) {
        return { error: 'Playwright not installed' };
    }

    const script = `
    const { chromium } = require('playwright');
    (async () => {
      const browser = await chromium.launch({ headless: true });
      const page = await browser.newPage();
      
      try {
        await page.goto('${url}', { waitUntil: 'networkidle', timeout: 30000 });
        
        const result = {
          url: '${url}',
          accessibility: {
            images_with_alt: await page.locator('img[alt]').count(),
            images_without_alt: await page.locator('img:not([alt])').count(),
            form_labels: await page.locator('label').count(),
            headings: {
              h1: await page.locator('h1').count(),
              h2: await page.locator('h2').count(),
              h3: await page.locator('h3').count()
            }
          },
          status: 'success'
        };
        
        console.log(JSON.stringify(result));
      } catch (e) {
        console.log(JSON.stringify({ status: 'error', error: e.message }));
      } finally {
        await browser.close();
      }
    })();
  `;

    try {
        const output = execSync(`node -e "${script.replace(/"/g, '\\"').replace(/\n/g, ' ')}"`, {
            encoding: 'utf-8',
            timeout: 60000
        });

        return JSON.parse(output.trim());
    } catch (e) {
        return { status: 'error', error: e.message };
    }
}

async function main() {
    const args = process.argv.slice(2);

    if (args.length === 0 || !args[0] || args[0].startsWith('--')) {
        console.log(JSON.stringify({
            error: 'Usage: node playwright_runner.js <url> [--screenshot] [--a11y]',
            examples: [
                'node playwright_runner.js https://example.com',
                'node playwright_runner.js https://example.com --screenshot',
                'node playwright_runner.js https://example.com --a11y'
            ]
        }, null, 2));
        process.exit(1);
    }

    const url = args[0];
    const takeScreenshot = args.includes('--screenshot');
    const checkA11y = args.includes('--a11y');

    let result;
    if (checkA11y) {
        result = await runAccessibilityCheck(url);
    } else {
        result = await runBasicTest(url, takeScreenshot);
    }

    console.log(JSON.stringify(result, null, 2));
}

main();
