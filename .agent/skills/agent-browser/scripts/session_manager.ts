// @ts-nocheck
import { chromium } from 'playwright';
import * as fs from 'node:fs';
import * as path from 'node:path';
import * as os from 'node:os';
import * as crypto from 'node:crypto';

const SESSION_FILE = path.join(os.tmpdir(), 'agent-browser-session.json');

export class SessionManager {
  static getSessionData() {
    if (fs.existsSync(SESSION_FILE)) {
      try {
        return JSON.parse(fs.readFileSync(SESSION_FILE, 'utf8'));
      } catch (e) { return null; }
    }
    return null;
  }

  static saveSessionData(data: Record<string, unknown>): void {
    fs.writeFileSync(SESSION_FILE, JSON.stringify(data), 'utf8');
  }

  static clearSession() {
    if (fs.existsSync(SESSION_FILE)) {
      fs.unlinkSync(SESSION_FILE);
    }
  }

  static async getBrowser() {
    let session = this.getSessionData();
    if (session && session.wsEndpoint) {
      try {
        return await chromium.connect(session.wsEndpoint);
      } catch (e) {
        this.clearSession(); // Stale or dead process
      }
    }
    return null;
  }

  static async open(url: string) {
    let browser = await this.getBrowser();
    let wsEndpoint;
    
    // Auto-launch if no active session
    if (!browser) {
      // Launch a server browser process
      const server = await chromium.launchServer({ headless: true });
      wsEndpoint = server.wsEndpoint();
      this.saveSessionData({ wsEndpoint, sessionId: crypto.randomUUID(), refs: {} });
      browser = await chromium.connect(wsEndpoint);
    } else {
      wsEndpoint = this.getSessionData().wsEndpoint;
    }

    const context = browser.contexts()[0] || await browser.newContext();
    const page = context.pages()[0] || await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'load', timeout: 30000 });
      return { status: 'success', data: { url: page.url(), title: await page.title() } };
    } catch (err: unknown) {
      return { status: 'error', error: { code: 'ERR_TIMEOUT', message: err instanceof Error ? err.message : String(err), phase: 'navigate', recoverable: true } };
    } finally {
      await browser.disconnect();
    }
  }

  static async snapshot(interactive: boolean = true) {
    let browser = await this.getBrowser();
    if (!browser) return { status: 'error', error: { code: 'ERR_SESSION_CLOSED', message: 'No active session', phase: 'snapshot', recoverable: false } };

    const context = browser.contexts()[0];
    const page = context.pages()[0];
    
    // Evaluate in browser to extract interactable elements and generate virtual IDs
    // eslint-disable-next-line @typescript-eslint/no-explicit-any -- browser context
    const refsData = await page.evaluate((isInteractive: boolean) => {
       const elements = Array.from(document.querySelectorAll('a, button, input, select, textarea, [role="button"]')) as HTMLElement[];
       const refs: Record<string, string> = {};
       const refsList: { id: string; tag: string; label: string }[] = [];
       
       elements.forEach((el, index) => {
         const style = window.getComputedStyle(el);
         if (style.display === 'none' || style.visibility === 'hidden') return;
         if ((el as HTMLButtonElement).disabled) return;
         if (isInteractive && (el as HTMLButtonElement).disabled) return;
         
         const refId = `@e${index + 1}`;
         const tag = el.tagName.toLowerCase();
         const label = (el as HTMLElement).innerText?.trim().slice(0,20) || el.getAttribute('placeholder') || el.getAttribute('aria-label') || tag;
         
         const uniqueId = `agent-id-${Math.random().toString(36).substr(2, 9)}`;
         el.setAttribute('data-agent-ref', uniqueId);
         
         refs[refId] = uniqueId;
         refsList.push({ id: refId, tag, label });
       });
       return { refs, refsList };
    }, interactive);

    // Save refs mapping into session data
    let session = this.getSessionData();
    session.refs = refsData.refs;
    this.saveSessionData(session);

    await browser.disconnect();
    return { status: 'success', data: { refs: refsData.refsList, count: refsData.refsList.length } };
  }

  static async interact(command: string, refId: string, text: string | null = null) {
    let browser = await this.getBrowser();
    if (!browser) return { status: 'error', error: { code: 'ERR_SESSION_CLOSED', message: 'No active session', phase: 'interact', recoverable: false } };

    const session = this.getSessionData();
    if (!session.refs || !session.refs[refId]) {
      return { status: 'error', error: { code: 'ERR_REF_STALE', message: 'Unknown or stale ref. Re-snapshot.', phase: 'interact', recoverable: true } };
    }

    const domId = session.refs[refId];
    const context = browser.contexts()[0];
    const page = context.pages()[0];
    
    const locator = page.locator(`[data-agent-ref="${domId}"]`);
    try {
      if (await locator.count() === 0) {
        return { status: 'error', error: { code: 'ERR_REF_NOT_FOUND', message: 'DOM element no longer exists', phase: 'interact', recoverable: true } };
      }
      
      if (command === 'click') {
        await locator.click({ timeout: 5000 });
      } else if (command === 'fill') {
        await locator.fill(text || '', { timeout: 5000 });
      }
      
      // Complete interactions invalidate previous refs
      session.refs = {};
      this.saveSessionData(session);
      return { status: 'success', data: { action: command, target: refId } };
    } catch (err: unknown) {
      return { status: 'error', error: { code: 'ERR_NOT_INTERACTABLE', message: err instanceof Error ? err.message : String(err), phase: 'interact', recoverable: true } };
    } finally {
      await browser.disconnect();
    }
  }

  static async close() {
    let session = this.getSessionData();
    if (!session || !session.wsEndpoint) return { status: 'error', error: { code: 'ERR_SESSION_CLOSED', message: 'Already closed', phase: 'close', recoverable: false } };
    
    try {
      const browser = await chromium.connect(session.wsEndpoint);
      const contexts = browser.contexts();
      for (const ctx of contexts) await ctx.close();
      await browser.close();
      this.clearSession();
      return { status: 'success', data: { message: 'Session closed' } };
    } catch (e) {
      this.clearSession();
      return { status: 'success', data: { message: 'Session forcibly cleared' } };
    }
  }
}

// ESM export (class already exported above)
