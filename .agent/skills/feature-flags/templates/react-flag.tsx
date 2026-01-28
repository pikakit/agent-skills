/**
 * Feature Flags React Hook
 * 
 * Usage:
 *   import { useFeatureFlag, useABTest } from '@/flags';
 *   
 *   const isEnabled = useFeatureFlag('new-feature');
 *   const variant = useABTest('experiment', ['a', 'b']);
 */

import { useState, useEffect, useMemo } from 'react';

interface FlagConfig {
  enabled: boolean;
  percentage?: number;
  groups?: string[];
  variants?: { name: string; weight?: number }[];
}

interface FlagsConfig {
  flags: Record<string, FlagConfig>;
}

// Load flags from window or fetch
let flagsConfig: FlagsConfig | null = null;

async function loadFlags(): Promise<FlagsConfig> {
  if (flagsConfig) return flagsConfig;
  
  // Try window first (SSR hydration)
  if (typeof window !== 'undefined' && (window as any).__FEATURE_FLAGS__) {
    flagsConfig = (window as any).__FEATURE_FLAGS__;
    return flagsConfig!;
  }
  
  // Fetch from API
  try {
    const res = await fetch('/api/feature-flags');
    flagsConfig = await res.json();
    return flagsConfig!;
  } catch {
    return { flags: {} };
  }
}

/**
 * Hash user ID for consistent percentage-based targeting
 */
function hashUserId(userId: string): number {
  let hash = 0;
  for (let i = 0; i < userId.length; i++) {
    hash = ((hash << 5) - hash) + userId.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash % 100);
}

/**
 * Check if flag is enabled for user
 */
function isEnabled(flag: FlagConfig, userId?: string): boolean {
  if (!flag.enabled) return false;
  
  const percentage = flag.percentage ?? 100;
  if (percentage === 100) return true;
  if (percentage === 0) return false;
  
  if (userId) {
    return hashUserId(userId) < percentage;
  }
  
  return Math.random() * 100 < percentage;
}

/**
 * React hook for feature flags
 */
export function useFeatureFlag(
  flagName: string,
  userId?: string
): boolean {
  const [enabled, setEnabled] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFlags().then((config) => {
      const flag = config.flags[flagName];
      setEnabled(flag ? isEnabled(flag, userId) : false);
      setLoading(false);
    });
  }, [flagName, userId]);

  return enabled;
}

/**
 * React hook for A/B testing
 */
export function useABTest<T extends string>(
  experimentName: string,
  variants: T[],
  userId?: string
): T {
  const [variant, setVariant] = useState<T>(variants[0]);

  useEffect(() => {
    loadFlags().then((config) => {
      const flag = config.flags[experimentName];
      
      if (!flag?.enabled || !flag.variants) {
        setVariant(variants[0]);
        return;
      }
      
      // Use consistent hashing for user
      if (userId) {
        const hash = hashUserId(userId);
        let cumulative = 0;
        for (const v of flag.variants) {
          cumulative += v.weight ?? (100 / flag.variants.length);
          if (hash < cumulative) {
            setVariant(v.name as T);
            return;
          }
        }
      }
      
      // Random assignment
      const randomIndex = Math.floor(Math.random() * variants.length);
      setVariant(variants[randomIndex]);
    });
  }, [experimentName, variants, userId]);

  return variant;
}

export default { useFeatureFlag, useABTest };
