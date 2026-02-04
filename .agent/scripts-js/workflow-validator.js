#!/usr/bin/env node
/**
 * Workflow Validator
 * Validates .agent/workflows/*.md files for proper structure
 * 
 * Usage:
 *   npm run workflow:validate           # Validate all workflows
 *   npm run workflow:validate build.md  # Validate specific workflow
 *   npm run workflow:validate --json    # Output as JSON
 *   npm run workflow:validate --verbose # Show detailed output
 */

import { readdir, readFile, access } from 'fs/promises';
import { join, basename, dirname } from 'path';
import { fileURLToPath } from 'url';
import matter from 'gray-matter';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Paths
const WORKFLOWS_DIR = join(__dirname, '..', 'workflows');
const AGENTS_DIR = join(__dirname, '..', 'agents');
const MAPPING_FILE = join(__dirname, '..', 'agent-workflow-mapping.json');

// Validation rules with severity
const SEVERITY = {
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info'
};

// Colors for terminal output
const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  green: '\x1b[32m',
  cyan: '\x1b[36m',
  dim: '\x1b[2m'
};

/**
 * Validate YAML frontmatter exists and is valid
 */
function validateFrontmatter(content, filename) {
  const issues = [];

  try {
    const { data, content: body } = matter(content);

    // Check if frontmatter exists
    if (!content.startsWith('---')) {
      issues.push({
        rule: 'YAML_FRONTMATTER',
        severity: SEVERITY.ERROR,
        message: 'Missing YAML frontmatter (should start with ---)'
      });
      return { issues, data: null, body: content };
    }

    // Check description field
    if (!data.description) {
      issues.push({
        rule: 'DESCRIPTION',
        severity: SEVERITY.ERROR,
        message: 'Missing "description" field in frontmatter'
      });
    } else if (data.description.length < 10) {
      issues.push({
        rule: 'DESCRIPTION',
        severity: SEVERITY.WARNING,
        message: 'Description is too short (should be at least 10 characters)'
      });
    }

    return { issues, data, body };
  } catch (err) {
    issues.push({
      rule: 'YAML_FRONTMATTER',
      severity: SEVERITY.ERROR,
      message: `Invalid YAML frontmatter: ${err.message}`
    });
    return { issues, data: null, body: content };
  }
}

/**
 * Validate title format: # /command - Title
 */
function validateTitle(body, filename) {
  const issues = [];
  const expectedCommand = '/' + basename(filename, '.md');

  // Find first h1
  const h1Match = body.match(/^#\s+(.+)$/m);

  if (!h1Match) {
    issues.push({
      rule: 'TITLE_FORMAT',
      severity: SEVERITY.WARNING,
      message: 'Missing main title (# heading)'
    });
    return issues;
  }

  const title = h1Match[1];

  // Check if title starts with /command
  if (!title.startsWith(expectedCommand)) {
    issues.push({
      rule: 'TITLE_FORMAT',
      severity: SEVERITY.WARNING,
      message: `Title should start with "${expectedCommand}" (found: "${title.substring(0, 20)}...")`
    });
  }

  // Check title format: /command - Description
  if (!title.includes(' - ')) {
    issues.push({
      rule: 'TITLE_FORMAT',
      severity: SEVERITY.INFO,
      message: 'Consider using format: /command - Description'
    });
  }

  return issues;
}

/**
 * Validate phases exist
 */
function validatePhases(body) {
  const issues = [];
  const info = [];

  // Count ## Phase or ## Step sections
  const phaseMatches = body.match(/^##\s+(Phase|Step)\s+\d+/gm) || [];
  const sectionMatches = body.match(/^##\s+[^#]/gm) || [];

  if (phaseMatches.length === 0 && sectionMatches.length < 2) {
    issues.push({
      rule: 'PHASES',
      severity: SEVERITY.WARNING,
      message: 'No phases found (expected ## Phase N: or multiple ## sections)'
    });
  } else {
    info.push({
      rule: 'PHASES',
      severity: SEVERITY.INFO,
      message: `Found ${phaseMatches.length || sectionMatches.length} phases/sections`
    });
  }

  return { issues, info };
}

/**
 * Validate // turbo annotations
 */
function validateTurboAnnotations(body) {
  const issues = [];
  const info = [];

  // Find all // turbo occurrences
  const turboLines = [];
  const lines = body.split('\n');

  lines.forEach((line, index) => {
    if (line.trim() === '// turbo' || line.trim() === '// turbo-all') {
      turboLines.push({ line: index + 1, type: line.trim() });
    }
  });

  if (turboLines.length > 0) {
    info.push({
      rule: 'TURBO',
      severity: SEVERITY.INFO,
      message: `Found ${turboLines.length} turbo annotation(s)`
    });

    // Check if turbo is followed by code block
    turboLines.forEach(({ line, type }) => {
      const nextNonEmptyLine = lines.slice(line).find(l => l.trim() !== '');
      if (nextNonEmptyLine && !nextNonEmptyLine.startsWith('```')) {
        issues.push({
          rule: 'TURBO_VALID',
          severity: SEVERITY.WARNING,
          message: `Line ${line}: ${type} should be followed by a code block`
        });
      }
    });
  }

  return { issues, info };
}

/**
 * Validate $ARGUMENTS placeholder
 */
function validateArguments(body) {
  const issues = [];
  const info = [];

  if (body.includes('$ARGUMENTS')) {
    info.push({
      rule: 'ARGUMENTS',
      severity: SEVERITY.INFO,
      message: 'Contains $ARGUMENTS placeholder'
    });
  } else {
    issues.push({
      rule: 'ARGUMENTS',
      severity: SEVERITY.INFO,
      message: 'Missing $ARGUMENTS placeholder (optional but recommended)'
    });
  }

  return { issues, info };
}

/**
 * Validate internal links
 */
async function validateLinks(body, workflowDir) {
  const issues = [];

  // Find markdown links
  const linkMatches = body.matchAll(/\[([^\]]+)\]\(([^)]+)\)/g);

  for (const match of linkMatches) {
    const [, text, href] = match;

    // Skip external links
    if (href.startsWith('http://') || href.startsWith('https://')) {
      continue;
    }

    // Check if file exists
    const linkPath = join(workflowDir, href);
    try {
      await access(linkPath);
    } catch {
      issues.push({
        rule: 'LINKS_VALID',
        severity: SEVERITY.WARNING,
        message: `Broken link: ${href} (referenced as "${text}")`
      });
    }
  }

  return issues;
}

/**
 * Validate agent references in workflow
 * Checks if referenced agents exist in agents directory or mapping
 */
async function validateAgentReferences(body, agentsDir, mappingFile) {
  const issues = [];
  const info = [];

  // Load mapping file if exists
  let mapping = null;
  try {
    const mappingContent = await readFile(mappingFile, 'utf-8');
    mapping = JSON.parse(mappingContent);
  } catch {
    // Mapping file doesn't exist, use fallback
  }

  // Agent name patterns commonly used in workflows
  const agentPatterns = [
    /`([a-z]+-(?:specialist|architect|engineer|developer|auditor|optimizer|planner|agent|writer|tester))`/g,
    /`(project-planner|explorer-agent|documentation-writer|debugger|orchestrator|assessor|recovery|critic|learner)`/g
  ];

  const foundAgents = new Set();
  const validAgents = new Set();
  const invalidAgents = new Set();

  // Get list of actual agent files
  let actualAgentFiles = [];
  try {
    const files = await readdir(agentsDir);
    actualAgentFiles = files.filter(f => f.endsWith('.md')).map(f => f.replace('.md', ''));
  } catch {
    issues.push({
      rule: 'AGENT_DIR',
      severity: SEVERITY.WARNING,
      message: 'Could not read agents directory'
    });
    return { issues, info };
  }

  // Extract agent references from body
  for (const pattern of agentPatterns) {
    const matches = body.matchAll(pattern);
    for (const match of matches) {
      foundAgents.add(match[1]);
    }
  }

  // Validate each found agent
  for (const agentName of foundAgents) {
    let isValid = false;

    // Check 1: Direct match in agent files
    if (actualAgentFiles.includes(agentName)) {
      isValid = true;
    }

    // Check 2: Check mapping file
    if (!isValid && mapping) {
      if (mapping.workflow_to_agent && mapping.workflow_to_agent[agentName]) {
        isValid = true;
      }
      if (mapping.meta_agents && mapping.meta_agents[agentName]) {
        isValid = true;
      }
    }

    // Check 3: Try short name (remove suffix)
    if (!isValid) {
      const shortName = agentName
        .replace(/-specialist$/, '')
        .replace(/-architect$/, '')
        .replace(/-engineer$/, '')
        .replace(/-developer$/, '')
        .replace(/-auditor$/, '')
        .replace(/-optimizer$/, '')
        .replace(/-planner$/, '')
        .replace(/-agent$/, '')
        .replace(/-writer$/, '')
        .replace(/-tester$/, '');

      if (actualAgentFiles.includes(shortName)) {
        isValid = true;
      }
    }

    if (isValid) {
      validAgents.add(agentName);
    } else {
      invalidAgents.add(agentName);
    }
  }

  // Report results
  if (foundAgents.size > 0) {
    info.push({
      rule: 'AGENT_REFS',
      severity: SEVERITY.INFO,
      message: `Found ${foundAgents.size} agent reference(s): ${validAgents.size} valid, ${invalidAgents.size} invalid`
    });
  }

  // Report invalid agents
  for (const agent of invalidAgents) {
    issues.push({
      rule: 'AGENT_INVALID',
      severity: SEVERITY.WARNING,
      message: `Agent reference "${agent}" not found in agents directory or mapping`
    });
  }

  return { issues, info };
}

/**
 * Validate a single workflow file
 */
async function validateWorkflow(filepath) {
  const filename = basename(filepath);
  const content = await readFile(filepath, 'utf-8');

  const allErrors = [];
  const allWarnings = [];
  const allInfo = [];

  // 1. Validate frontmatter
  const { issues: frontmatterIssues, data, body } = validateFrontmatter(content, filename);
  frontmatterIssues.forEach(issue => {
    if (issue.severity === SEVERITY.ERROR) allErrors.push(issue);
    else if (issue.severity === SEVERITY.WARNING) allWarnings.push(issue);
    else allInfo.push(issue);
  });

  // 2. Validate title
  const titleIssues = validateTitle(body, filename);
  titleIssues.forEach(issue => {
    if (issue.severity === SEVERITY.ERROR) allErrors.push(issue);
    else if (issue.severity === SEVERITY.WARNING) allWarnings.push(issue);
    else allInfo.push(issue);
  });

  // 3. Validate phases
  const { issues: phaseIssues, info: phaseInfo } = validatePhases(body);
  phaseIssues.forEach(issue => {
    if (issue.severity === SEVERITY.WARNING) allWarnings.push(issue);
  });
  allInfo.push(...phaseInfo);

  // 4. Validate turbo annotations
  const { issues: turboIssues, info: turboInfo } = validateTurboAnnotations(body);
  turboIssues.forEach(issue => allWarnings.push(issue));
  allInfo.push(...turboInfo);

  // 5. Validate arguments
  const { issues: argIssues, info: argInfo } = validateArguments(body);
  allInfo.push(...argIssues, ...argInfo);

  // 6. Validate links
  const linkIssues = await validateLinks(body, dirname(filepath));
  linkIssues.forEach(issue => allWarnings.push(issue));

  // 7. Validate agent references
  const { issues: agentIssues, info: agentInfo } = await validateAgentReferences(body, AGENTS_DIR, MAPPING_FILE);
  agentIssues.forEach(issue => allWarnings.push(issue));
  allInfo.push(...agentInfo);

  return {
    file: filename,
    valid: allErrors.length === 0,
    errors: allErrors,
    warnings: allWarnings,
    info: allInfo,
    metadata: data
  };
}

/**
 * Get all workflow files
 */
async function getWorkflowFiles() {
  const files = await readdir(WORKFLOWS_DIR);
  return files
    .filter(f => f.endsWith('.md') && f !== 'README.md')
    .map(f => join(WORKFLOWS_DIR, f));
}

/**
 * Format output for terminal
 */
function formatOutput(results, verbose = false) {
  let output = '';
  let totalErrors = 0;
  let totalWarnings = 0;

  for (const result of results) {
    const icon = result.valid ? colors.green + '✓' : colors.red + '✗';
    output += `${icon} ${result.file}${colors.reset}\n`;

    totalErrors += result.errors.length;
    totalWarnings += result.warnings.length;

    // Show errors
    for (const error of result.errors) {
      output += `  ${colors.red}ERROR${colors.reset} [${error.rule}]: ${error.message}\n`;
    }

    // Show warnings
    for (const warning of result.warnings) {
      output += `  ${colors.yellow}WARN${colors.reset}  [${warning.rule}]: ${warning.message}\n`;
    }

    // Show info (only in verbose mode)
    if (verbose) {
      for (const info of result.info) {
        output += `  ${colors.dim}INFO  [${info.rule}]: ${info.message}${colors.reset}\n`;
      }
    }
  }

  // Summary
  output += '\n' + colors.cyan + '─'.repeat(50) + colors.reset + '\n';
  output += `Total: ${results.length} workflows | `;
  output += `${colors.green}${results.filter(r => r.valid).length} valid${colors.reset} | `;
  output += `${colors.red}${totalErrors} errors${colors.reset} | `;
  output += `${colors.yellow}${totalWarnings} warnings${colors.reset}\n`;

  return output;
}

/**
 * Main function
 */
async function main() {
  const args = process.argv.slice(2);

  // Parse options
  const jsonOutput = args.includes('--json');
  const verbose = args.includes('--verbose');
  const specificFile = args.find(a => a.endsWith('.md'));

  // Get files to validate
  let files;
  if (specificFile) {
    files = [join(WORKFLOWS_DIR, specificFile)];
  } else {
    files = await getWorkflowFiles();
  }

  // Validate all files
  const results = [];
  for (const file of files) {
    try {
      const result = await validateWorkflow(file);
      results.push(result);
    } catch (err) {
      results.push({
        file: basename(file),
        valid: false,
        errors: [{ rule: 'FILE_READ', severity: SEVERITY.ERROR, message: err.message }],
        warnings: [],
        info: []
      });
    }
  }

  // Output results
  if (jsonOutput) {
    console.log(JSON.stringify(results, null, 2));
  } else {
    console.log('\n' + colors.cyan + '🔍 Workflow Validation Report' + colors.reset + '\n');
    console.log(formatOutput(results, verbose));
  }

  // Exit with error code if any errors found
  const hasErrors = results.some(r => r.errors.length > 0);
  process.exit(hasErrors ? 1 : 0);
}

// Run
main().catch(err => {
  console.error('Error:', err.message);
  process.exit(1);
});
