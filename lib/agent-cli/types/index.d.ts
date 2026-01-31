/**
 * Auto-Learn System TypeScript Definitions
 * 
 * Provides type safety for consumers of Auto-Learn scripts.
 * These types match the JSON structures used in .agent/knowledge/
 */

// ==================== CORE TYPES ====================

/**
 * Severity levels for rules and lessons
 */
export type Severity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Risk level for intent detection
 */
export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

/**
 * Health status for trend analysis
 */
export type HealthStatus = 'IMPROVING' | 'STABLE' | 'NEUTRAL' | 'DECLINING';

// ==================== LESSONS ====================

/**
 * A learned lesson from errors or corrections
 */
export interface Lesson {
    id: string;
    pattern: string;
    message: string;
    severity: Severity;
    hitCount?: number;
    successCount?: number;
    lastHit?: string;
    promoted?: boolean;
    promotedAt?: string;
    demoted?: boolean;
    demotedAt?: string;
    previousSeverity?: Severity;
    confidence?: number;
    adjustedAt?: string;
    importedAt?: string;
    source?: 'auto' | 'manual' | 'imported';
}

/**
 * Collection of lessons
 */
export interface LessonsData {
    lessons: Lesson[];
    lastUpdated?: string;
}

// ==================== ERRORS ====================

/**
 * A detected error
 */
export interface DetectedError {
    id: string;
    type: string;
    source: 'test' | 'build' | 'lint' | 'runtime' | 'code';
    message: string;
    file?: string;
    line?: number;
    severity: Severity;
    timestamp: string;
    context?: ErrorContext;
}

/**
 * Error context information
 */
export interface ErrorContext {
    project?: ProjectContext;
    file?: FileContext;
}

/**
 * Collection of errors
 */
export interface ErrorsData {
    errors: DetectedError[];
    lastUpdated?: string;
}

// ==================== SUCCESSES ====================

/**
 * A detected success pattern
 */
export interface SuccessPattern {
    id: string;
    pattern: string;
    type: 'pattern' | 'practice' | 'test' | 'build' | 'lint';
    file?: string;
    detectedAt: string;
    context?: SuccessContext;
}

/**
 * Success context information
 */
export interface SuccessContext {
    project?: ProjectContext;
    file?: FileContext;
}

/**
 * Collection of successes
 */
export interface SuccessesData {
    successes: SuccessPattern[];
    lastUpdated?: string;
}

// ==================== CONTEXT ====================

/**
 * Project context information
 */
export interface ProjectContext {
    projectType: 'unknown' | 'nextjs' | 'react' | 'react-native' | 'backend' | 'nodejs';
    framework?: string;
    language: 'javascript' | 'typescript';
    hasTypeScript?: boolean;
    hasTesting?: boolean;
}

/**
 * File context information
 */
export interface FileContext {
    fileType: string;
    isTypeScript: boolean;
    isTest: boolean;
    isComponent: boolean;
    directory: string;
    fullPath: string;
    area?: 'source' | 'library' | 'test' | 'config' | 'other';
}

// ==================== RULES ====================

/**
 * A matched rule from pre-execution check
 */
export interface RuleMatch {
    id: string;
    name?: string;
    pattern?: string;
    prevention: string;
    severity: Severity;
    source: 'builtin' | 'lesson' | 'auto-rule' | 'active-rule' | 'intent-detection';
}

/**
 * An auto-generated rule
 */
export interface AutoRule {
    id: string;
    pattern: string;
    prevention: string;
    severity: Severity;
    status: 'proposed' | 'approved' | 'rejected';
    hitCount?: number;
    successRate?: number;
}

// ==================== INTENT DETECTION ====================

/**
 * A detected intent from user input
 */
export interface DetectedIntent {
    action: string;
    target: string;
    risk: RiskLevel;
}

/**
 * Result of intent check
 */
export interface IntentCheckResult {
    violations: RuleMatch[];
    warnings: RuleMatch[];
    recommendations: RuleMatch[];
    detectedIntents: DetectedIntent[];
}

// ==================== PATTERNS ====================

/**
 * Error patterns analysis
 */
export interface ErrorPatterns {
    byType: Record<string, number>;
    bySeverity: Record<Severity, number>;
    byFile: Record<string, number>;
    byTime: Record<string, number>;
    total: number;
}

/**
 * Correction patterns analysis
 */
export interface CorrectionPatterns {
    byCategory: Record<string, number>;
    byFile: Record<string, number>;
    total: number;
}

/**
 * High-frequency pattern candidate for auto-rule
 */
export interface HighFrequencyPattern {
    pattern: string;
    count: number;
    type: 'error' | 'correction' | 'category';
    suggestedRule?: AutoRule;
}

// ==================== TRENDS ====================

/**
 * Weekly comparison data
 */
export interface TrendData {
    period: {
        from: string;
        to: string;
    };
    thisWeek: {
        errors: number;
        successes: number;
    };
    lastWeek: {
        errors: number;
        successes: number;
    };
    trends: {
        errorChange: number;
        successChange: number;
    };
    healthStatus: HealthStatus;
    analysis: {
        errorDirection: 'decreasing' | 'stable' | 'increasing';
        successDirection: 'decreasing' | 'stable' | 'increasing';
    };
}

/**
 * Daily breakdown for charts
 */
export interface DailyBreakdown {
    date: string;
    errors: number;
    successes: number;
    ratio: number;
}

// ==================== SUCCESS/FAILURE RATIO ====================

/**
 * Success/failure ratio analysis
 */
export interface BalanceRatio {
    ratio: number;
    status: 'EXCELLENT' | 'GOOD' | 'LEARNING' | 'NEEDS_ATTENTION' | 'NO_DATA';
    message: string;
    failures: number;
    successes: number;
    breakdown: {
        errors: number;
        corrections: number;
        successPatterns: number;
    };
}

// ==================== ADAPTIVE ENGINE ====================

/**
 * Severity adjustment record
 */
export interface SeverityAdjustment {
    id: string;
    from: Severity;
    to: Severity;
    reason: string;
}

/**
 * Promotion/demotion record
 */
export interface RulePromotion {
    id: string;
    pattern: string;
    accuracy: number;
    status: 'PROMOTED_TO_CORE' | 'DEMOTED_TO_LOW';
}

// ==================== SKILL INJECTION ====================

/**
 * Skill candidate for generation
 */
export interface SkillCandidate {
    category: string;
    count: number;
    config: {
        name: string;
        description: string;
    };
}

/**
 * Generated skill result
 */
export interface GeneratedSkill {
    category: string;
    name: string;
    path: string;
    lessonCount: number;
}

// ==================== RULE SHARING ====================

/**
 * Exported rules in YAML format
 */
export interface ExportedRules {
    metadata: {
        project: string;
        exportedAt: string;
        totalRules: number;
    };
    lessons: Lesson[];
    autoRules: AutoRule[];
    highFrequency: HighFrequencyPattern[];
}
