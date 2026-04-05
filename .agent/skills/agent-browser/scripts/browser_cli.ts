#!/usr/bin/env node
import { SessionManager } from './session_manager.ts';

async function main() {
  const [, , command, arg1, arg2] = process.argv;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let result: any;
  switch (command) {
    case 'open':
      if (!arg1) {
        result = { status: 'error', error: { code: 'ERR_INVALID_COMMAND', message: 'Missing URL', phase: 'navigate', recoverable: false } };
        break;
      }
      result = await SessionManager.open(arg1);
      break;
    case 'snapshot':
      result = await SessionManager.snapshot(arg1 !== '-all');
      if (result.status === 'success') {
        const out = result.data?.refs?.map((r: { id: string; tag: string; label: string }) => `${r.id}=${r.tag}[${r.label}]`).join(' ');
        console.log(`Snapshot output:\n${out || 'No interactive elements found'}`);
      }
      break;
    case 'click':
      if (!arg1) {
        result = { status: 'error', error: { code: 'ERR_INVALID_COMMAND', message: 'Missing @ref', phase: 'interact', recoverable: false } };
        break;
      }
      result = await SessionManager.interact('click', arg1);
      break;
    case 'fill':
      if (!arg1 || !arg2) {
        result = { status: 'error', error: { code: 'ERR_INVALID_COMMAND', message: 'Missing @ref or text', phase: 'interact', recoverable: false } };
        break;
      }
      result = await SessionManager.interact('fill', arg1, arg2);
      break;
    case 'close':
      result = await SessionManager.close();
      break;
    default:
      result = { status: 'error', error: { code: 'ERR_INVALID_COMMAND', message: `Unknown command: ${command}`, phase: 'any', recoverable: false } };
  }

  console.log(JSON.stringify(result, null, 2));
  process.exit(result.status === 'success' ? 0 : 1);
}

main().catch((e: unknown) => {
  console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_UNKNOWN', message: e instanceof Error ? e.message : String(e), phase: 'any', recoverable: false } }));
  process.exit(1);
});
