// @ts-nocheck
/**
 * Lifecycle Orchestrator — State Manager
 * Checkpoint save/restore/list for task lifecycle management.
 *
 * Usage:
 *   npx tsx state_manager.ts save --files "file1.tsx,file2.tsx"
 *   npx tsx state_manager.ts restore --latest
 *   npx tsx state_manager.ts list
 */

import * as fs from 'node:fs';
import * as path from 'node:path';
import * as crypto from 'node:crypto';

const STATE_DIR = '.agent/state';

interface Checkpoint {
  id: string;
  timestamp: string;
  files: { path: string; content: string; hash: string }[];
  taskId?: string;
}

interface CheckpointMeta {
  id: string;
  timestamp: string;
  fileCount: number;
  files: string[];
}

function ensureStateDir(taskId?: string): string {
  const dir = taskId ? path.join(STATE_DIR, taskId) : STATE_DIR;
  fs.mkdirSync(dir, { recursive: true });
  return dir;
}

function generateId(): string {
  return `ckpt_${Date.now()}_${crypto.randomBytes(4).toString('hex')}`;
}

function save(files: string[], taskId?: string): void {
  const dir = ensureStateDir(taskId);
  const checkpoint: Checkpoint = {
    id: generateId(),
    timestamp: new Date().toISOString(),
    taskId,
    files: [],
  };

  for (const filePath of files) {
    if (!fs.existsSync(filePath)) {
      console.error(JSON.stringify({
        status: 'error',
        error: { code: 'ERR_FILE_NOT_FOUND', message: `File not found: ${filePath}`, recoverable: true }
      }));
      continue;
    }
    const content = fs.readFileSync(filePath, 'utf-8');
    const hash = crypto.createHash('sha256').update(content).digest('hex').slice(0, 12);
    checkpoint.files.push({ path: filePath, content, hash });
  }

  if (checkpoint.files.length === 0) {
    console.error(JSON.stringify({
      status: 'error',
      error: { code: 'ERR_CHECKPOINT_FAILED', message: 'No valid files to checkpoint', recoverable: true }
    }));
    process.exit(1);
  }

  const checkpointFile = path.join(dir, `${checkpoint.id}.json`);
  fs.writeFileSync(checkpointFile, JSON.stringify(checkpoint, null, 2), 'utf-8');

  console.log(JSON.stringify({
    status: 'success',
    data: {
      checkpointId: checkpoint.id,
      fileCount: checkpoint.files.length,
      files: checkpoint.files.map(f => f.path),
      savedTo: checkpointFile,
    }
  }));
}

function restore(checkpointId?: string, latest?: boolean, taskId?: string): void {
  const dir = ensureStateDir(taskId);
  const checkpointFiles = fs.readdirSync(dir).filter(f => f.startsWith('ckpt_') && f.endsWith('.json')).sort();

  if (checkpointFiles.length === 0) {
    console.error(JSON.stringify({
      status: 'error',
      error: { code: 'ERR_RESTORE_FAILED', message: 'No checkpoints found', recoverable: false }
    }));
    process.exit(1);
  }

  const targetFile = latest
    ? checkpointFiles[checkpointFiles.length - 1]
    : checkpointFiles.find(f => f.includes(checkpointId!));

  if (!targetFile) {
    console.error(JSON.stringify({
      status: 'error',
      error: { code: 'ERR_RESTORE_FAILED', message: `Checkpoint not found: ${checkpointId}`, recoverable: false }
    }));
    process.exit(1);
  }

  const checkpoint: Checkpoint = JSON.parse(fs.readFileSync(path.join(dir, targetFile), 'utf-8'));
  const restored: string[] = [];

  for (const file of checkpoint.files) {
    const fileDir = path.dirname(file.path);
    if (fileDir !== '.') fs.mkdirSync(fileDir, { recursive: true });
    fs.writeFileSync(file.path, file.content, 'utf-8');
    restored.push(file.path);
  }

  console.log(JSON.stringify({
    status: 'success',
    data: {
      restoredFrom: checkpoint.id,
      timestamp: checkpoint.timestamp,
      filesRestored: restored.length,
      files: restored,
    }
  }));
}

function list(taskId?: string): void {
  const dir = ensureStateDir(taskId);
  const checkpointFiles = fs.readdirSync(dir).filter(f => f.startsWith('ckpt_') && f.endsWith('.json')).sort();

  const checkpoints: CheckpointMeta[] = checkpointFiles.map(f => {
    const data: Checkpoint = JSON.parse(fs.readFileSync(path.join(dir, f), 'utf-8'));
    return {
      id: data.id,
      timestamp: data.timestamp,
      fileCount: data.files.length,
      files: data.files.map(fl => fl.path),
    };
  });

  console.log(JSON.stringify({
    status: 'success',
    data: { checkpoints, count: checkpoints.length }
  }));
}

function main(): void {
  const args = process.argv.slice(2);
  const command = args[0];

  let files: string[] = [];
  let taskId: string | undefined;
  let checkpointId: string | undefined;
  let latest = false;

  for (let i = 1; i < args.length; i++) {
    switch (args[i]) {
      case '--files': files = args[++i].split(',').map(f => f.trim()); break;
      case '--task-id': taskId = args[++i]; break;
      case '--checkpoint': checkpointId = args[++i]; break;
      case '--latest': latest = true; break;
    }
  }

  switch (command) {
    case 'save':
      if (files.length === 0) {
        console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_INVALID_TASK', message: 'No files specified. Use --files "f1,f2"', recoverable: true } }));
        process.exit(1);
      }
      save(files, taskId);
      break;
    case 'restore':
      restore(checkpointId, latest, taskId);
      break;
    case 'list':
      list(taskId);
      break;
    default:
      console.error(JSON.stringify({ status: 'error', error: { code: 'ERR_INVALID_TASK', message: `Unknown command: ${command}. Use save|restore|list`, recoverable: false } }));
      process.exit(1);
  }
}

main();
