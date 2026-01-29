#!/usr/bin/env node
/**
 * Batch Skill Frontmatter Updater
 * Adds trigger phrases, categories, and metrics to skills missing them
 */

const fs = require('fs');
const path = require('path');

const skillsDir = path.join(__dirname, '..', 'skills');

// Skills to update with their metadata
const skillUpdates = {
  'agent-modes': {
    description: 'AI operational modes (brainstorm, implement, debug, review, teach, ship, orchestrate). Use to adapt behavior based on task context.',
    triggers: 'mode, brainstorm, implement, debug, review, teach, ship',
    category: 'core',
    metrics: 'correct mode selected, behavior adapted',
    coordinates: 'smart-router, context-optimizer'
  },
  'debug-pro': {
    description: 'Advanced debugging techniques and root cause analysis.',
    triggers: 'debug, bug, error, crash, exception, root cause',
    category: 'core',
    metrics: 'bug fixed, root cause identified',
    coordinates: 'debug-toolkit, test-architect'
  },
  'diagram-kit': {
    description: 'Create diagrams and visualizations using Mermaid, PlantUML, and other tools.',
    triggers: 'diagram, mermaid, flowchart, sequence diagram, architecture diagram',
    category: 'specialized',
    metrics: 'diagram generated, syntax valid',
    coordinates: 'doc-processor, system-design'
  },
  'doc-templates': {
    description: 'Documentation templates for README, API docs, and project documentation.',
    triggers: 'template, README, documentation, API docs',
    category: 'specialized',
    metrics: 'template applied, documentation complete',
    coordinates: 'doc-processor, project-planner'
  },
  'game-engine': {
    description: 'Game development patterns for web and mobile games.',
    triggers: 'game, Unity, Godot, Phaser, game engine, 2D, 3D',
    category: 'framework',
    metrics: 'game runs, no crashes',
    coordinates: 'perf-optimizer, mobile-first'
  },
  'geo-spatial': {
    description: 'Geographic and spatial data processing, mapping, and location services.',
    triggers: 'map, GPS, geolocation, spatial, coordinates, GeoJSON',
    category: 'specialized',
    metrics: 'location accurate, map renders',
    coordinates: 'data-modeler, api-architect'
  },
  'globalization-kit': {
    description: 'Internationalization (i18n) and localization (l10n) implementation.',
    triggers: 'i18n, l10n, translation, localization, internationalization, language',
    category: 'specialized',
    metrics: 'translations complete, RTL handled',
    coordinates: 'web-core, mobile-first'
  },
  'mcp-server': {
    description: 'Model Context Protocol server integration and development.',
    triggers: 'MCP, Model Context Protocol, server, integration',
    category: 'framework',
    metrics: 'MCP server running, tools connected',
    coordinates: 'api-architect, context-optimizer'
  },
  'mobile-first': {
    description: 'Mobile-first design and development patterns for responsive UI.',
    triggers: 'mobile, responsive, touch, React Native, Flutter',
    category: 'framework',
    metrics: 'mobile audit passed, responsive design',
    coordinates: 'design-system, perf-optimizer'
  },
  'nextjs-pro': {
    description: 'Advanced Next.js patterns including App Router, RSC, and server actions.',
    triggers: 'Next.js, App Router, RSC, server actions, SSR, SSG',
    category: 'framework',
    metrics: 'build passes, pages render',
    coordinates: 'web-core, react-architect'
  },
  'nodejs-pro': {
    description: 'Node.js best practices, patterns, and performance optimization.',
    triggers: 'Node.js, Express, backend, server, API',
    category: 'framework',
    metrics: 'server runs, no memory leaks',
    coordinates: 'api-architect, data-modeler'
  },
  'offensive-sec': {
    description: 'Penetration testing and offensive security techniques.',
    triggers: 'pentest, red team, exploit, vulnerability, hacking',
    category: 'devops',
    metrics: 'vulnerabilities found, report complete',
    coordinates: 'security-scanner, code-review'
  },
  'python-pro': {
    description: 'Python best practices, patterns, and tooling.',
    triggers: 'Python, pip, FastAPI, Django, Flask',
    category: 'framework',
    metrics: 'tests pass, type hints complete',
    coordinates: 'test-architect, api-architect'
  },
  'react-architect': {
    description: 'React architecture patterns, component design, and state management.',
    triggers: 'React, component, hooks, state management, Redux, Zustand',
    category: 'architecture',
    metrics: 'components render, no prop drilling',
    coordinates: 'web-core, design-system'
  },
  'seo-optimizer': {
    description: 'SEO optimization for web applications.',
    triggers: 'SEO, meta tags, sitemap, search ranking, OpenGraph',
    category: 'specialized',
    metrics: 'SEO score improved, meta tags complete',
    coordinates: 'web-core, perf-optimizer'
  },
  'server-ops': {
    description: 'Server operations, deployment, and infrastructure management.',
    triggers: 'server, DevOps, infrastructure, deployment, hosting',
    category: 'devops',
    metrics: 'server running, uptime maintained',
    coordinates: 'cicd-pipeline, security-scanner'
  },
  'shell-script': {
    description: 'Shell scripting patterns for automation and DevOps.',
    triggers: 'shell, bash, script, automation, CLI',
    category: 'framework',
    metrics: 'script runs, no errors',
    coordinates: 'cicd-pipeline, server-ops'
  },
  'system-design': {
    description: 'System architecture and design patterns for scalable applications.',
    triggers: 'architecture, system design, scalability, microservices',
    category: 'architecture',
    metrics: 'architecture documented, scalability validated',
    coordinates: 'api-architect, data-modeler'
  },
  'tailwind-kit': {
    description: 'Tailwind CSS patterns, utilities, and component styling.',
    triggers: 'Tailwind, CSS, styling, utility classes',
    category: 'architecture',
    metrics: 'styles applied, design consistent',
    coordinates: 'design-system, web-core'
  },
  'test-driven-dev': {
    description: 'Test-driven development methodology and practices.',
    triggers: 'TDD, test first, red-green-refactor',
    category: 'testing',
    metrics: 'tests written before code, coverage high',
    coordinates: 'test-architect, code-craft'
  },
  'visual-excellence': {
    description: 'Visual design excellence and aesthetic quality standards.',
    triggers: 'visual, aesthetic, design quality, polish',
    category: 'architecture',
    metrics: 'design polished, visual consistency',
    coordinates: 'design-system, tailwind-kit'
  }
};

function updateSkill(skillName, updates) {
  const skillPath = path.join(skillsDir, skillName, 'SKILL.md');
  
  if (!fs.existsSync(skillPath)) {
    console.log(`Skip: ${skillName} (no SKILL.md)`);
    return false;
  }

  let content = fs.readFileSync(skillPath, 'utf-8');
  
  // Check if already has triggers
  if (content.includes('Triggers on:')) {
    console.log(`Skip: ${skillName} (already has triggers)`);
    return false;
  }

  // Find and update the frontmatter
  const frontmatterMatch = content.match(/^---\n([\s\S]*?)\n---/);
  if (!frontmatterMatch) {
    console.log(`Error: ${skillName} (no frontmatter)`);
    return false;
  }

  const frontmatter = frontmatterMatch[1];
  const descMatch = frontmatter.match(/description:\s*(.+)/);
  
  if (!descMatch) {
    console.log(`Error: ${skillName} (no description)`);
    return false;
  }

  // Build new description
  const newDesc = `description: >-
  ${updates.description}
  Triggers on: ${updates.triggers}.
  Coordinates with: ${updates.coordinates}.`;

  // Build new metadata
  const newMetadata = `metadata:
  category: "${updates.category}"
  success_metrics: "${updates.metrics}"
  coordinates_with: "${updates.coordinates}"`;

  // Replace description line
  let newContent = content.replace(
    /description:\s*.+(\n|$)/,
    newDesc + '\n'
  );

  // Add or update metadata
  if (newContent.includes('metadata:')) {
    // Has existing metadata - replace
    newContent = newContent.replace(
      /metadata:\n(  .+\n)*/,
      newMetadata + '\n'
    );
  } else {
    // No metadata - add before ---
    newContent = newContent.replace(
      /\n---\n/,
      '\n' + newMetadata + '\n---\n'
    );
  }

  fs.writeFileSync(skillPath, newContent);
  console.log(`Updated: ${skillName}`);
  return true;
}

// Main execution
console.log('Batch Skill Update Script');
console.log('='.repeat(40));

let updated = 0;
let skipped = 0;

for (const [skillName, updates] of Object.entries(skillUpdates)) {
  if (updateSkill(skillName, updates)) {
    updated++;
  } else {
    skipped++;
  }
}

console.log('='.repeat(40));
console.log(`Updated: ${updated}, Skipped: ${skipped}`);
