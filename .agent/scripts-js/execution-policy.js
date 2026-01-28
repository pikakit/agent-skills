#!/usr/bin/env node
/**
 * Execution Policy Loader
 * Loads and validates .agent/config/execution-policy.json
 * 
 * Features:
 * - Policy caching
 * - Allow/deny list evaluation
 * - Annotation requirement checking
 * - Policy drift warnings
 */

import { readFile } from 'fs/promises';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';

// ESM __dirname equivalent
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Policy file path
const POLICY_PATH = join(__dirname, '..', 'config', 'execution-policy.json');

// Cached policy
let cachedPolicy = null;

// Colors for logging
const colors = {
  reset: '\x1b[0m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  dim: '\x1b[2m'
};

/**
 * Default restrictive policy (used when config is missing)
 */
const DEFAULT_POLICY = {
  autoAccept: {
    enabled: false,
    defaultMode: 'prompt',
    requireAnnotation: true,
    requiredAnnotations: ['auto', 'safe'],
    allow: [],
    deny: []
  },
  phaseGate: {
    requirePlanApproval: true,
    allowedModes: ['dry-run']
  },
  annotations: {
    recognized: ['auto', 'safe', 'confirm', 'ci', 'readonly', 'interactive'],
    warnOnUnknown: true
  },
  logging: {
    logAutoAccept: true,
    logBlocked: true,
    logPolicyDrift: true
  }
};

/**
 * Load execution policy from config file
 * @returns {Promise<Object>} Policy object
 */
export async function loadPolicy() {
  if (cachedPolicy) return cachedPolicy;
  
  try {
    const content = await readFile(POLICY_PATH, 'utf-8');
    cachedPolicy = JSON.parse(content);
    return cachedPolicy;
  } catch (err) {
    // Return default restrictive policy
    console.warn(`${colors.yellow}[POLICY] Config not found, using restrictive defaults${colors.reset}`);
    cachedPolicy = DEFAULT_POLICY;
    return cachedPolicy;
  }
}

/**
 * Clear cached policy (for testing or reload)
 */
export function clearPolicyCache() {
  cachedPolicy = null;
}

/**
 * Match a command against a pattern object
 * 
 * @param {string} cmd - Normalized command string
 * @param {Object|string} pattern - Pattern object or legacy string
 * @returns {Object} { matched: boolean, pattern: string, type: string }
 */
function matchPattern(cmd, pattern) {
  // Legacy string format (backward compatibility)
  if (typeof pattern === 'string') {
    const matched = cmd.includes(pattern.toLowerCase());
    return { matched, pattern, type: 'contains' };
  }
  
  const patternStr = pattern.pattern;
  const type = pattern.type || 'contains';
  
  try {
    switch (type) {
      case 'regex':
        // Add timeout protection for ReDoS
        const regex = new RegExp(patternStr, 'i');
        const matched = regex.test(cmd);
        return { matched, pattern: patternStr, type };
        
      case 'prefix':
        return { 
          matched: cmd.startsWith(patternStr.toLowerCase()), 
          pattern: patternStr, 
          type 
        };
        
      case 'exact':
        return { 
          matched: cmd === patternStr.toLowerCase(), 
          pattern: patternStr, 
          type 
        };
        
      case 'contains':
      default:
        return { 
          matched: cmd.includes(patternStr.toLowerCase()), 
          pattern: patternStr, 
          type 
        };
    }
  } catch (err) {
    // Invalid regex - treat as not matched
    console.warn(`${colors.yellow}[POLICY] Invalid pattern: ${patternStr}${colors.reset}`);
    return { matched: false, pattern: patternStr, type, error: err.message };
  }
}

/**
 * Check if a command should be auto-accepted
 * 
 * @param {string} command - Command to evaluate
 * @param {string[]} annotations - Annotations from workflow (e.g., ['auto', 'safe'])
 * @param {Object} policy - Loaded policy object
 * @param {Object} options - Additional options
 * @returns {Object} { allowed: boolean, reason: string, driftWarnings: string[], severity?: string }
 */
export function shouldAutoAccept(command, annotations = [], policy = null, options = {}) {
  const driftWarnings = [];
  
  // No policy - default to prompt
  if (!policy) {
    return { 
      allowed: false, 
      reason: 'No policy loaded',
      driftWarnings 
    };
  }
  
  // Auto-accept disabled globally
  if (!policy.autoAccept?.enabled) {
    return { 
      allowed: false, 
      reason: 'Auto-accept disabled in policy',
      driftWarnings 
    };
  }
  
  // Check required annotations
  if (policy.autoAccept.requireAnnotation) {
    const required = policy.autoAccept.requiredAnnotations || ['auto'];
    const missing = required.filter(a => !annotations.includes(a));
    
    if (missing.length > 0) {
      // Log policy drift warning
      if (policy.logging?.logPolicyDrift) {
        driftWarnings.push(`Missing required annotations: ${missing.join(', ')}`);
      }
      return { 
        allowed: false, 
        reason: `Missing annotations: ${missing.join(', ')}`,
        driftWarnings 
      };
    }
  }
  
  // Check @confirm override (always prompt)
  if (annotations.includes('confirm') || annotations.includes('interactive')) {
    return { 
      allowed: false, 
      reason: '@confirm/@interactive annotation requires user confirmation',
      driftWarnings 
    };
  }
  
  // Check @ci annotation (only in CI environment)
  if (annotations.includes('ci') && process.env.CI !== 'true') {
    return { 
      allowed: false, 
      reason: '@ci annotation only auto-accepts in CI environment',
      driftWarnings 
    };
  }
  
  // Normalize command for matching
  const normalizedCmd = command.toLowerCase().trim();
  
  // Check deny patterns first (SAFETY FIRST)
  // Priority: denyPatterns (new) > deny (legacy)
  const denyPatterns = policy.autoAccept.denyPatterns || [];
  const denyLegacy = policy.autoAccept.deny || [];
  
  for (const pattern of denyPatterns) {
    const result = matchPattern(normalizedCmd, pattern);
    if (result.matched) {
      return { 
        allowed: false, 
        reason: `Command matches deny pattern [${result.type}]: "${result.pattern}"`,
        driftWarnings,
        blocked: true,
        severity: pattern.severity || 'high'
      };
    }
  }
  
  // Legacy deny list
  for (const pattern of denyLegacy) {
    const result = matchPattern(normalizedCmd, pattern);
    if (result.matched) {
      return { 
        allowed: false, 
        reason: `Command matches deny pattern: "${result.pattern}"`,
        driftWarnings,
        blocked: true
      };
    }
  }
  
  // Check allow patterns
  // Priority: allowPatterns (new) > allow (legacy)
  const allowPatterns = policy.autoAccept.allowPatterns || [];
  const allowLegacy = policy.autoAccept.allow || [];
  
  for (const pattern of allowPatterns) {
    const result = matchPattern(normalizedCmd, pattern);
    if (result.matched) {
      return { 
        allowed: true, 
        reason: `Matches allow pattern [${result.type}]: "${result.pattern}"`,
        driftWarnings 
      };
    }
  }
  
  // Legacy allow list
  for (const pattern of allowLegacy) {
    if (normalizedCmd.startsWith(pattern.toLowerCase())) {
      return { 
        allowed: true, 
        reason: `Matches allow pattern: "${pattern}"`,
        driftWarnings 
      };
    }
  }
  
  // Default mode
  const defaultMode = policy.autoAccept.defaultMode || 'prompt';
  return { 
    allowed: defaultMode === 'auto',
    reason: `Default mode: ${defaultMode}`,
    driftWarnings 
  };
}

/**
 * Validate annotations against recognized list
 * 
 * @param {string[]} annotations - Annotations to validate
 * @param {Object} policy - Loaded policy object
 * @returns {Object} { valid: boolean, unknown: string[] }
 * @throws {Error} If strictMode enabled and unknown annotations found
 */
export function validateAnnotations(annotations, policy) {
  const recognized = policy?.annotations?.recognized || ['auto', 'safe', 'confirm', 'ci'];
  const unknown = annotations.filter(a => !recognized.includes(a));
  
  if (unknown.length > 0) {
    // Strict mode: throw error
    if (policy?.annotations?.strictMode) {
      throw new Error(`[STRICT MODE] Unknown annotations not allowed: ${unknown.join(', ')}`);
    }
    
    // Warn mode: log warning
    if (policy?.annotations?.warnOnUnknown) {
      console.warn(`${colors.yellow}[POLICY] Unknown annotations: ${unknown.join(', ')}${colors.reset}`);
    }
  }
  
  return {
    valid: unknown.length === 0,
    unknown
  };
}

/**
 * Log auto-accept decision
 * 
 * @param {string} command - Command evaluated
 * @param {Object} result - Result from shouldAutoAccept
 * @param {Object} policy - Loaded policy
 */
export function logDecision(command, result, policy) {
  if (!policy?.logging) return;
  
  const shortCmd = command.length > 50 ? command.substring(0, 50) + '...' : command;
  
  if (result.allowed && policy.logging.logAutoAccept) {
    console.log(`${colors.green}[AUTO-ACCEPT]${colors.reset} ${shortCmd}`);
    console.log(`${colors.dim}  Reason: ${result.reason}${colors.reset}`);
  }
  
  if (!result.allowed && result.blocked && policy.logging.logBlocked) {
    console.log(`${colors.red}[BLOCKED]${colors.reset} ${shortCmd}`);
    console.log(`${colors.dim}  Reason: ${result.reason}${colors.reset}`);
  }
  
  if (result.driftWarnings?.length > 0 && policy.logging.logPolicyDrift) {
    for (const warning of result.driftWarnings) {
      console.warn(`${colors.yellow}[POLICY DRIFT]${colors.reset} ${warning}`);
    }
  }
}

// Export for testing
export { DEFAULT_POLICY, POLICY_PATH };
