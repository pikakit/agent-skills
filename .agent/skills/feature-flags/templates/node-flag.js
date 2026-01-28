/**
 * Feature Flags Node.js Utility
 * 
 * Usage:
 *   import { isEnabled, getVariant, loadFlags } from './flags';
 *   
 *   if (isEnabled('new-feature', { userId: 'abc123' })) {
 *     // Show new feature
 *   }
 */

import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

const FLAGS_FILE = '.featureflags.json';

let flagsConfig = null;
let configPath = null;

/**
 * Load flags from file
 */
export function loadFlags(customPath) {
    if (flagsConfig && !customPath) return flagsConfig;
    
    const searchPath = customPath || path.join(process.cwd(), FLAGS_FILE);
    
    if (!fs.existsSync(searchPath)) {
        console.warn(`Feature flags file not found: ${searchPath}`);
        return { flags: {} };
    }
    
    try {
        const content = fs.readFileSync(searchPath, 'utf8');
        flagsConfig = JSON.parse(content);
        configPath = searchPath;
        return flagsConfig;
    } catch (error) {
        console.error('Error loading flags:', error.message);
        return { flags: {} };
    }
}

/**
 * Hash user ID for consistent percentage targeting
 */
function hashUserId(userId) {
    const hash = crypto.createHash('md5').update(userId).digest('hex');
    return parseInt(hash.substring(0, 8), 16) % 100;
}

/**
 * Check if user is in target group
 */
function isInGroup(groups, userGroups) {
    if (!groups || groups.length === 0) return true;
    if (!userGroups || userGroups.length === 0) return false;
    return groups.some(g => userGroups.includes(g));
}

/**
 * Check if current environment is allowed
 */
function isEnvironmentAllowed(environments) {
    if (!environments || environments.length === 0) return true;
    const currentEnv = process.env.NODE_ENV || 'development';
    return environments.includes(currentEnv);
}

/**
 * Check if flag is enabled for context
 */
export function isEnabled(flagName, context = {}) {
    const config = loadFlags();
    const flag = config.flags?.[flagName];
    
    if (!flag || !flag.enabled) return false;
    
    // Check environment
    if (!isEnvironmentAllowed(flag.environments)) return false;
    
    // Check groups
    if (!isInGroup(flag.groups, context.groups)) return false;
    
    // Check percentage
    const percentage = flag.percentage ?? 100;
    if (percentage === 100) return true;
    if (percentage === 0) return false;
    
    if (context.userId) {
        return hashUserId(context.userId) < percentage;
    }
    
    return Math.random() * 100 < percentage;
}

/**
 * Get variant for A/B test
 */
export function getVariant(experimentName, userId, defaultVariant = 'control') {
    const config = loadFlags();
    const flag = config.flags?.[experimentName];
    
    if (!flag?.enabled || !flag.variants) return defaultVariant;
    
    const variants = flag.variants;
    const totalWeight = variants.reduce((sum, v) => sum + (v.weight ?? 1), 0);
    
    // Consistent hash for user
    let targetWeight;
    if (userId) {
        targetWeight = (hashUserId(userId) / 100) * totalWeight;
    } else {
        targetWeight = Math.random() * totalWeight;
    }
    
    let cumulative = 0;
    for (const variant of variants) {
        cumulative += variant.weight ?? 1;
        if (targetWeight < cumulative) {
            return variant.name;
        }
    }
    
    return defaultVariant;
}

/**
 * Get flag value (for non-boolean flags)
 */
export function getValue(flagName, defaultValue) {
    const config = loadFlags();
    const flag = config.flags?.[flagName];
    
    if (!flag || !flag.enabled) return defaultValue;
    return flag.value ?? defaultValue;
}

/**
 * Middleware for Express.js
 */
export function featureFlagsMiddleware(req, res, next) {
    req.featureFlags = {
        isEnabled: (name) => isEnabled(name, {
            userId: req.user?.id,
            groups: req.user?.groups
        }),
        getVariant: (name, defaultVariant) => getVariant(name, req.user?.id, defaultVariant)
    };
    next();
}

export default {
    loadFlags,
    isEnabled,
    getVariant,
    getValue,
    featureFlagsMiddleware
};
