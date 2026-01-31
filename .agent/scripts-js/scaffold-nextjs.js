#!/usr/bin/env node
/**
 * scaffold-nextjs.js - Next.js Project Scaffolder
 * 
 * Purpose: Bundle multiple npx/npm commands into single script
 * to minimize Accept prompts in autopilot mode.
 * 
 * Usage:
 *   node .agent/scripts-js/scaffold-nextjs.js <project-name> [options]
 * 
 * Options:
 *   --port <number>   Dev server port (default: 3000)
 *   --deps <packages> Extra npm packages (comma-separated)
 *   --no-install      Skip npm install
 *   --start           Start dev server after creation
 * 
 * Example:
 *   node .agent/scripts-js/scaffold-nextjs.js weather-app --port 3001 --deps zustand,framer-motion --start
 */

const { execSync, spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Parse arguments
const args = process.argv.slice(2);
const projectName = args[0];

if (!projectName) {
  console.error('❌ Error: Project name required');
  console.log('Usage: node scaffold-nextjs.js <project-name> [options]');
  process.exit(1);
}

// Parse options
const options = {
  port: 3000,
  deps: [],
  install: true,
  start: false
};

for (let i = 1; i < args.length; i++) {
  if (args[i] === '--port' && args[i + 1]) {
    options.port = parseInt(args[i + 1]);
    i++;
  } else if (args[i] === '--deps' && args[i + 1]) {
    options.deps = args[i + 1].split(',').map(d => d.trim());
    i++;
  } else if (args[i] === '--no-install') {
    options.install = false;
  } else if (args[i] === '--start') {
    options.start = true;
  }
}

// Get target directory
const targetDir = path.resolve(process.cwd(), projectName);

console.log('');
console.log('🚀 Next.js Scaffolder - PikaKit');
console.log('========================================');
console.log(`📁 Project: ${projectName}`);
console.log(`📍 Path: ${targetDir}`);
console.log(`🔌 Port: ${options.port}`);
console.log(`📦 Extra deps: ${options.deps.length > 0 ? options.deps.join(', ') : 'none'}`);
console.log('');

// Check if directory exists
if (fs.existsSync(targetDir)) {
  console.error(`❌ Error: Directory "${projectName}" already exists`);
  process.exit(1);
}

// Metrics tracking
const startTime = Date.now();
const metrics = {
  createProject: 0,
  installDeps: 0,
  total: 0
};

try {
  // Step 1: Create Next.js project
  console.log('📦 Step 1/3: Creating Next.js project...');
  const createStart = Date.now();
  
  execSync(
    `npx -y create-next-app@latest ${projectName} --typescript --tailwind --eslint --app --no-src-dir --import-alias="@/*" --use-npm`,
    { 
      stdio: 'inherit',
      cwd: process.cwd()
    }
  );
  
  metrics.createProject = Date.now() - createStart;
  console.log(`✅ Project created in ${(metrics.createProject / 1000).toFixed(1)}s`);
  console.log('');

  // Step 2: Install extra dependencies
  if (options.install && options.deps.length > 0) {
    console.log(`📦 Step 2/3: Installing extra dependencies: ${options.deps.join(', ')}...`);
    const installStart = Date.now();
    
    execSync(
      `npm install ${options.deps.join(' ')}`,
      { 
        stdio: 'inherit',
        cwd: targetDir
      }
    );
    
    metrics.installDeps = Date.now() - installStart;
    console.log(`✅ Dependencies installed in ${(metrics.installDeps / 1000).toFixed(1)}s`);
    console.log('');
  } else {
    console.log('⏭️ Step 2/3: Skipping extra dependencies');
    console.log('');
  }

  // Step 3: Create common directories
  console.log('📁 Step 3/3: Creating project structure...');
  
  const dirsToCreate = [
    path.join(targetDir, 'components'),
    path.join(targetDir, 'lib'),
    path.join(targetDir, 'hooks'),
    path.join(targetDir, 'types')
  ];
  
  dirsToCreate.forEach(dir => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  });
  
  // Create placeholder files
  fs.writeFileSync(
    path.join(targetDir, 'lib', 'utils.ts'),
    `// Utility functions\n\nexport function cn(...classes: string[]) {\n  return classes.filter(Boolean).join(' ');\n}\n`
  );
  
  fs.writeFileSync(
    path.join(targetDir, 'types', 'index.ts'),
    `// Type definitions\n\nexport interface AppConfig {\n  name: string;\n  version: string;\n}\n`
  );
  
  console.log('✅ Project structure created');
  console.log('');

  // Calculate total time
  metrics.total = Date.now() - startTime;

  // Print summary
  console.log('========================================');
  console.log('✅ SCAFFOLD COMPLETE');
  console.log('========================================');
  console.log('');
  console.log('📊 Metrics:');
  console.log(`   Create project: ${(metrics.createProject / 1000).toFixed(1)}s`);
  if (metrics.installDeps > 0) {
    console.log(`   Install deps:   ${(metrics.installDeps / 1000).toFixed(1)}s`);
  }
  console.log(`   Total time:     ${(metrics.total / 1000).toFixed(1)}s`);
  console.log('');
  console.log('📁 Created directories:');
  console.log('   - components/');
  console.log('   - lib/');
  console.log('   - hooks/');
  console.log('   - types/');
  console.log('');
  console.log('🚀 Next steps:');
  console.log(`   cd ${projectName}`);
  console.log(`   npm run dev -- -p ${options.port}`);
  console.log('');

  // Start dev server if requested
  if (options.start) {
    console.log(`🌐 Starting dev server on port ${options.port}...`);
    console.log('');
    
    const devServer = spawn('npm', ['run', 'dev', '--', '-p', options.port.toString()], {
      cwd: targetDir,
      stdio: 'inherit',
      shell: true
    });
    
    devServer.on('error', (err) => {
      console.error('❌ Failed to start dev server:', err);
    });
  }

} catch (error) {
  console.error('');
  console.error('❌ Scaffold failed:', error.message);
  process.exit(1);
}
