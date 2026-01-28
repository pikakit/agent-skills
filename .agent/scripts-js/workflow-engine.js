#!/usr/bin/env node
/**
 * Workflow Engine
 * Parse and execute .agent/workflows/*.md files
 * 
 * Usage:
 *   npm run workflow:list                           # List all workflows
 *   npm run workflow:run build "Create todo app"   # Run workflow with args
 *   npm run workflow:run build "args" --turbo      # Auto-execute turbo steps
 *   npm run workflow:run build "args" --dry-run    # Show what would execute
 *   npm run workflow:run build "args" --phase 2    # Run specific phase
 */

import { readdir, readFile } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import { spawn } from 'child_process';
import { createInterface } from 'readline';
import matter from 'gray-matter';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const WORKFLOWS_DIR = join(__dirname, '..', 'workflows');

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m'
};

/**
 * Parse workflow markdown into structured format
 */
function parseWorkflow(content, args = '') {
  const { data: metadata, content: body } = matter(content);
  
  // Substitute $ARGUMENTS and normalize line endings (CRLF -> LF)
  const processedBody = body.replace(/\r\n/g, '\n').replace(/\$ARGUMENTS/g, args);
  
  // Extract phases
  const phases = [];
  const lines = processedBody.split('\n');
  
  let currentPhase = null;
  let currentContent = [];
  let inCodeBlock = false;
  let codeBlockLang = '';
  let codeBlockContent = [];
  let turboNext = false;
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Detect phase headers (## Phase N: or ## Step N: or ### subsections)
    const phaseMatch = line.match(/^##\s+(Phase|Step)\s+(\d+):?\s*(.*)$/i);
    const sectionMatch = !phaseMatch && line.match(/^##\s+(.+)$/);
    const subsectionMatch = !phaseMatch && !sectionMatch && line.match(/^###\s+(.+)$/);
    
    if (phaseMatch || sectionMatch || subsectionMatch) {
      // Save previous phase
      if (currentPhase) {
        currentPhase.content = currentContent.join('\n');
        phases.push(currentPhase);
      }
      
      // Extract title and determine phase number
      let title, number;
      
      if (phaseMatch) {
        // Direct ## Phase N: format
        title = phaseMatch[3] || `${phaseMatch[1]} ${phaseMatch[2]}`;
        number = parseInt(phaseMatch[2]);
      } else {
        // Section or subsection - check if title contains "Phase N:" pattern
        const rawTitle = sectionMatch ? sectionMatch[1] : subsectionMatch[1];
        const embeddedPhase = rawTitle.match(/^Phase\s+(\d+):?\s*(.*)$/i);
        
        if (embeddedPhase) {
          // Title like "Phase 1: Requirements Discovery"
          number = parseInt(embeddedPhase[1]);
          title = embeddedPhase[2] || `Phase ${embeddedPhase[1]}`;
        } else {
          // Regular section title
          number = phases.length + 1;
          title = rawTitle;
        }
      }
      
      currentPhase = {
        number,
        title: title.trim(),
        content: '',
        codeBlocks: [],
        turboAll: false
      };
      currentContent = [];
      continue;
    }
    
    // Detect // turbo annotations
    if (line.trim() === '// turbo') {
      turboNext = true;
      continue;
    }
    
    if (line.trim() === '// turbo-all' && currentPhase) {
      currentPhase.turboAll = true;
      continue;
    }
    
    // Detect code blocks
    if (line.startsWith('```')) {
      if (!inCodeBlock) {
        // Start code block
        inCodeBlock = true;
        codeBlockLang = line.slice(3).trim();
        codeBlockContent = [];
      } else {
        // End code block
        inCodeBlock = false;
        if (currentPhase && codeBlockLang === 'bash') {
          currentPhase.codeBlocks.push({
            lang: codeBlockLang,
            code: codeBlockContent.join('\n'),
            turbo: turboNext || currentPhase.turboAll,
            lineNumber: i - codeBlockContent.length
          });
        }
        turboNext = false;
        codeBlockLang = '';
        codeBlockContent = [];
      }
      continue;
    }
    
    if (inCodeBlock) {
      codeBlockContent.push(line);
    } else {
      currentContent.push(line);
    }
  }
  
  // Save last phase
  if (currentPhase) {
    currentPhase.content = currentContent.join('\n');
    phases.push(currentPhase);
  }
  
  return {
    metadata,
    command: '/' + basename(content.split('\n').find(l => l.startsWith('#'))?.match(/\/(\w+)/)?.[1] || ''),
    phases,
    originalContent: body,
    processedContent: processedBody
  };
}

/**
 * Execute a shell command
 */
function executeCommand(command, options = {}) {
  return new Promise((resolve, reject) => {
    const { dryRun = false, silent = false } = options;
    
    if (dryRun) {
      console.log(`${colors.dim}[DRY-RUN] Would execute: ${command}${colors.reset}`);
      resolve({ success: true, output: '', dryRun: true });
      return;
    }
    
    if (!silent) {
      console.log(`${colors.cyan}$ ${command}${colors.reset}`);
    }
    
    const isWindows = process.platform === 'win32';
    const shell = isWindows ? 'powershell.exe' : '/bin/bash';
    const shellArgs = isWindows ? ['-NoProfile', '-NonInteractive', '-Command', command] : ['-c', command];
    
    const proc = spawn(shell, shellArgs, {
      stdio: 'inherit',
      cwd: process.cwd()
    });
    
    proc.on('close', (code) => {
      if (code === 0) {
        resolve({ success: true, code });
      } else {
        resolve({ success: false, code });
      }
    });
    
    proc.on('error', (err) => {
      reject(err);
    });
  });
}

/**
 * Prompt user for confirmation
 */
async function confirm(message) {
  const rl = createInterface({
    input: process.stdin,
    output: process.stdout
  });
  
  return new Promise((resolve) => {
    rl.question(`${colors.yellow}${message} (y/n): ${colors.reset}`, (answer) => {
      rl.close();
      resolve(answer.toLowerCase() === 'y' || answer.toLowerCase() === 'yes');
    });
  });
}

/**
 * Execute a single phase
 */
async function executePhase(phase, options = {}) {
  const { turbo = false, dryRun = false, interactive = true } = options;
  
  console.log(`\n${colors.bold}${colors.magenta}## Phase ${phase.number}: ${phase.title}${colors.reset}\n`);
  
  // Show phase content (brief)
  const contentLines = phase.content.trim().split('\n').slice(0, 5);
  if (contentLines.length > 0) {
    console.log(colors.dim + contentLines.join('\n') + colors.reset);
    if (phase.content.split('\n').length > 5) {
      console.log(colors.dim + '...' + colors.reset);
    }
    console.log();
  }
  
  // Execute code blocks
  for (const block of phase.codeBlocks) {
    const shouldAutoRun = turbo && block.turbo;
    
    console.log(`${colors.blue}Command:${colors.reset}`);
    console.log(`${colors.cyan}  ${block.code.split('\n').join('\n  ')}${colors.reset}\n`);
    
    if (shouldAutoRun) {
      console.log(`${colors.green}[TURBO] Auto-executing...${colors.reset}\n`);
      await executeCommand(block.code, { dryRun });
    } else if (interactive && !dryRun) {
      const shouldExecute = await confirm('Execute this command?');
      if (shouldExecute) {
        await executeCommand(block.code, { dryRun });
      } else {
        console.log(`${colors.yellow}Skipped${colors.reset}`);
      }
    } else if (dryRun) {
      await executeCommand(block.code, { dryRun: true });
    }
    
    console.log();
  }
  
  return true;
}

/**
 * Execute entire workflow
 */
async function executeWorkflow(workflowName, args, options = {}) {
  const { turbo = false, dryRun = false, phase: targetPhase = null } = options;
  
  // Load workflow
  const filepath = join(WORKFLOWS_DIR, workflowName.replace(/^\//, '') + '.md');
  let content;
  
  try {
    content = await readFile(filepath, 'utf-8');
  } catch (err) {
    console.error(`${colors.red}Error: Workflow "${workflowName}" not found${colors.reset}`);
    console.error(`${colors.dim}Looked for: ${filepath}${colors.reset}`);
    return false;
  }
  
  // Parse workflow
  const workflow = parseWorkflow(content, args);
  
  console.log(`\n${colors.bold}${colors.cyan}============================================${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan} >> Workflow: /${workflowName}${colors.reset}`);
  console.log(`${colors.bold}${colors.cyan}============================================${colors.reset}`);
  console.log(`${colors.dim}${workflow.metadata.description}${colors.reset}`);
  console.log(`${colors.dim}Arguments: ${args || '(none)'}${colors.reset}`);
  console.log(`${colors.dim}Phases: ${workflow.phases.length}${colors.reset}`);
  
  if (dryRun) {
    console.log(`${colors.yellow}[DRY-RUN MODE] No commands will be executed${colors.reset}`);
  }
  if (turbo) {
    console.log(`${colors.green}[TURBO MODE] Turbo-marked commands will auto-execute${colors.reset}`);
  }
  
  // Execute phases
  const phasesToRun = targetPhase !== null
    ? workflow.phases.filter(p => p.number === targetPhase)
    : workflow.phases;
  
  if (phasesToRun.length === 0 && targetPhase !== null) {
    console.error(`${colors.red}Error: Phase ${targetPhase} not found${colors.reset}`);
    return false;
  }
  
  if (phasesToRun.length === 0) {
    console.log(`${colors.yellow}No executable phases found in this workflow.${colors.reset}`);
    console.log(`${colors.dim}This workflow may contain reference documentation only.${colors.reset}`);
    return true;
  }
  
  for (const phase of phasesToRun) {
    await executePhase(phase, { turbo, dryRun, interactive: !dryRun });
  }
  
  console.log(`\n${colors.bold}${colors.green}============================================${colors.reset}`);
  console.log(`${colors.bold}${colors.green} [OK] Workflow Complete${colors.reset}`);
  console.log(`${colors.bold}${colors.green}============================================${colors.reset}\n`);
  
  return true;
}

/**
 * List all workflows
 */
async function listWorkflows() {
  const files = await readdir(WORKFLOWS_DIR);
  const workflows = [];
  
  for (const file of files) {
    if (!file.endsWith('.md') || file === 'README.md') continue;
    
    const content = await readFile(join(WORKFLOWS_DIR, file), 'utf-8');
    const { data } = matter(content);
    
    workflows.push({
      command: '/' + basename(file, '.md'),
      description: data.description || '(no description)',
      file
    });
  }
  
  console.log(`\n${colors.bold}${colors.cyan}Available Workflows${colors.reset}\n`);
  
  for (const w of workflows.sort((a, b) => a.command.localeCompare(b.command))) {
    console.log(`  ${colors.green}${w.command.padEnd(15)}${colors.reset} ${colors.dim}${w.description}${colors.reset}`);
  }
  
  console.log(`\n${colors.dim}Total: ${workflows.length} workflows${colors.reset}`);
  console.log(`${colors.dim}Usage: npm run workflow:run <name> "<arguments>" [--turbo] [--dry-run]${colors.reset}\n`);
}

/**
 * Show workflow details
 */
async function showWorkflow(workflowName) {
  const filepath = join(WORKFLOWS_DIR, workflowName.replace(/^\//, '') + '.md');
  let content;
  
  try {
    content = await readFile(filepath, 'utf-8');
  } catch {
    console.error(`${colors.red}Error: Workflow "${workflowName}" not found${colors.reset}`);
    return;
  }
  
  const workflow = parseWorkflow(content);
  
  console.log(`\n${colors.bold}${colors.cyan}Workflow: /${workflowName}${colors.reset}`);
  console.log(`${colors.dim}${workflow.metadata.description}${colors.reset}\n`);
  
  console.log(`${colors.bold}Phases:${colors.reset}`);
  for (const phase of workflow.phases) {
    const turboCount = phase.codeBlocks.filter(b => b.turbo).length;
    const cmdCount = phase.codeBlocks.length;
    console.log(`  ${colors.green}${phase.number}. ${phase.title}${colors.reset} ${colors.dim}(${cmdCount} commands${turboCount > 0 ? `, ${turboCount} turbo` : ''})${colors.reset}`);
  }
  
  console.log();
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);
  
  // Parse options
  const turbo = args.includes('--turbo');
  const dryRun = args.includes('--dry-run');
  const list = args.includes('--list') || args[0] === 'list';
  const show = args.includes('--show');
  const phaseIndex = args.indexOf('--phase');
  const targetPhase = phaseIndex !== -1 ? parseInt(args[phaseIndex + 1]) : null;
  
  // Remove option flags from args
  const cleanArgs = args.filter(a => 
    !a.startsWith('--') && 
    (phaseIndex === -1 || args.indexOf(a) !== phaseIndex + 1)
  );
  
  // Commands
  if (list || cleanArgs.length === 0) {
    await listWorkflows();
    return;
  }
  
  const workflowName = cleanArgs[0];
  const userArgs = cleanArgs.slice(1).join(' ');
  
  if (show) {
    await showWorkflow(workflowName);
    return;
  }
  
  // Execute workflow
  await executeWorkflow(workflowName, userArgs, { turbo, dryRun, phase: targetPhase });
}

// Run
main().catch(err => {
  console.error(`${colors.red}Error: ${err.message}${colors.reset}`);
  process.exit(1);
});
