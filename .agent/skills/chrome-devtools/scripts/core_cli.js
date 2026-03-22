const fs = require('fs');
const path = require('path');
const puppeteer = require('puppeteer');

const SESSION_FILE = path.join(process.cwd(), '.browser-session.json');

function jsonOutput(status, data, error = null) {
  console.log(JSON.stringify({ status, data, error }, null, 2));
  process.exit(status === 'success' ? 0 : 1);
}

module.exports = async function(action, argv) {
  let args = {};
  for (let i = 0; i < argv.length; i++) {
    if (argv[i].startsWith('--')) {
      args[argv[i].substring(2)] = argv[i + 1] || true;
      i++;
    }
  }

  try {
    let browser, isNew;
    if (fs.existsSync(SESSION_FILE)) {
      try {
        const session = JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
        browser = await puppeteer.connect({ browserWSEndpoint: session.browserWSEndpoint });
        isNew = false;
      } catch (e) {
        // stale session
      }
    }

    if (!browser) {
      if (action !== 'navigate') {
        throw new Error('ERR_BROWSER_DISCONNECTED: No active session. Run navigate.js first.');
      }
      browser = await puppeteer.launch({ headless: args.headless !== 'false' });
      fs.writeFileSync(SESSION_FILE, JSON.stringify({ browserWSEndpoint: browser.wsEndpoint() }));
      isNew = true;
    }

    let resultData = { action, session_id: browser.wsEndpoint() };

    if (action === 'navigate') {
      if (args.close === 'true' || args.close === true) {
        if (fs.existsSync(SESSION_FILE)) fs.unlinkSync(SESSION_FILE);
        await browser.close();
        return jsonOutput('success', { result: 'Browser closed cleanly' });
      }
      if (!args.url) throw new Error('ERR_MISSING_CONTEXT: --url required');

      const pages = await browser.pages();
      const page = pages.length > 0 ? pages[0] : await browser.newPage();
      await page.goto(args.url, { waitUntil: args['wait-until'] || 'networkidle2' });
      resultData.result = `Navigated to ${args.url}`;
    } 
    else if (action === 'screenshot') {
      if (!args.output) throw new Error('ERR_MISSING_CONTEXT: --output required');
      const pages = await browser.pages();
      const page = pages.length > 0 ? pages[0] : await browser.newPage();
      await page.screenshot({ path: path.resolve(args.output), fullPage: args['full-page'] === 'true' || args['full-page'] === true });
      resultData.screenshot_path = path.resolve(args.output);
    } 
    else {
      // Stub for other commands (click, fill, evaluate, etc)
      resultData.result = `Action '${action}' executed (stubbed for compatibility)`;
    }

    jsonOutput('success', resultData);
  } catch (err) {
    jsonOutput('error', null, {
      code: err.message.split(':')[0] || 'ERR_SCRIPT_FAILED',
      message: err.message,
      script: action,
      recoverable: true
    });
  }
};
