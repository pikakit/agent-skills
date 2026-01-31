/**
 * ML Pattern Matching Utility
 * 
 * Provides intelligent pattern matching using similarity algorithms:
 * - Levenshtein distance
 * - Jaccard similarity
 * - Fuzzy matching with confidence scores
 * 
 * Usage:
 *   import { findSimilar, matchWithConfidence } from './ml_patterns.js';
 *   
 *   const matches = findSimilar('missing-await', patterns, 0.7);
 *   const result = matchWithConfidence(intent, rules);
 */

// ==================== LEVENSHTEIN DISTANCE ====================

/**
 * Calculate Levenshtein distance between two strings
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Edit distance
 */
function levenshtein(a, b) {
    const matrix = [];

    for (let i = 0; i <= b.length; i++) {
        matrix[i] = [i];
    }

    for (let j = 0; j <= a.length; j++) {
        matrix[0][j] = j;
    }

    for (let i = 1; i <= b.length; i++) {
        for (let j = 1; j <= a.length; j++) {
            if (b.charAt(i - 1) === a.charAt(j - 1)) {
                matrix[i][j] = matrix[i - 1][j - 1];
            } else {
                matrix[i][j] = Math.min(
                    matrix[i - 1][j - 1] + 1, // substitution
                    matrix[i][j - 1] + 1,     // insertion
                    matrix[i - 1][j] + 1      // deletion
                );
            }
        }
    }

    return matrix[b.length][a.length];
}

/**
 * Calculate similarity ratio (0-1) using Levenshtein
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity ratio (1 = identical)
 */
function levenshteinSimilarity(a, b) {
    const distance = levenshtein(a.toLowerCase(), b.toLowerCase());
    const maxLen = Math.max(a.length, b.length);
    return maxLen === 0 ? 1 : 1 - distance / maxLen;
}

// ==================== JACCARD SIMILARITY ====================

/**
 * Tokenize string into words/n-grams
 * @param {string} str - Input string
 * @param {number} n - N-gram size (default: 2)
 */
function tokenize(str, n = 2) {
    const normalized = str.toLowerCase().replace(/[^a-z0-9]/g, ' ').trim();
    const words = normalized.split(/\s+/).filter(w => w.length > 0);

    if (n === 1) return new Set(words);

    const ngrams = new Set();
    for (const word of words) {
        for (let i = 0; i <= word.length - n; i++) {
            ngrams.add(word.slice(i, i + n));
        }
    }
    return ngrams;
}

/**
 * Calculate Jaccard similarity (0-1)
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Similarity ratio
 */
function jaccardSimilarity(a, b) {
    const setA = tokenize(a);
    const setB = tokenize(b);

    const intersection = new Set([...setA].filter(x => setB.has(x)));
    const union = new Set([...setA, ...setB]);

    return union.size === 0 ? 0 : intersection.size / union.size;
}

// ==================== COMBINED SIMILARITY ====================

/**
 * Calculate weighted combined similarity
 * @param {string} a - First string
 * @param {string} b - Second string
 * @returns {number} Combined similarity (0-1)
 */
function combinedSimilarity(a, b) {
    const lev = levenshteinSimilarity(a, b);
    const jac = jaccardSimilarity(a, b);

    // Weighted average: Levenshtein more weight for short strings
    const lenFactor = Math.min(a.length, b.length) / 10;
    const levWeight = Math.max(0.3, 0.7 - lenFactor * 0.1);
    const jacWeight = 1 - levWeight;

    return lev * levWeight + jac * jacWeight;
}

// ==================== FUZZY MATCHING ====================

/**
 * Find similar patterns from a list
 * @param {string} query - Query string
 * @param {string[]} patterns - List of patterns to search
 * @param {number} threshold - Minimum similarity (default: 0.6)
 * @returns {Array<{pattern: string, similarity: number}>}
 */
function findSimilar(query, patterns, threshold = 0.6) {
    const matches = [];

    for (const pattern of patterns) {
        const similarity = combinedSimilarity(query, pattern);
        if (similarity >= threshold) {
            matches.push({ pattern, similarity: Math.round(similarity * 100) / 100 });
        }
    }

    return matches.sort((a, b) => b.similarity - a.similarity);
}

/**
 * Check if two strings are fuzzy equal
 * @param {string} a - First string
 * @param {string} b - Second string
 * @param {number} threshold - Minimum similarity
 */
function fuzzyEquals(a, b, threshold = 0.8) {
    return combinedSimilarity(a, b) >= threshold;
}

// ==================== RULE MATCHING ====================

/**
 * Match intent against rules with confidence scores
 * @param {string} intent - User intent
 * @param {Array<{id: string, pattern: string, severity: string}>} rules
 * @param {number} threshold - Minimum confidence
 * @returns {Array<{rule: object, confidence: number, matchType: string}>}
 */
function matchWithConfidence(intent, rules, threshold = 0.5) {
    const matches = [];
    const intentLower = intent.toLowerCase();

    for (const rule of rules) {
        const patternLower = rule.pattern.toLowerCase();

        // Exact match
        if (intentLower.includes(patternLower)) {
            matches.push({
                rule,
                confidence: 1.0,
                matchType: 'EXACT'
            });
            continue;
        }

        // Word boundary match
        const words = intentLower.split(/\s+/);
        const patternWords = patternLower.split(/[-_\s]+/);
        const wordMatch = patternWords.some(pw =>
            words.some(w => w.includes(pw) || pw.includes(w))
        );

        if (wordMatch) {
            const similarity = combinedSimilarity(intent, rule.pattern);
            if (similarity >= threshold) {
                matches.push({
                    rule,
                    confidence: Math.round(similarity * 100) / 100,
                    matchType: 'PARTIAL'
                });
            }
            continue;
        }

        // Fuzzy match
        const similarity = combinedSimilarity(intent, rule.pattern);
        if (similarity >= threshold) {
            matches.push({
                rule,
                confidence: Math.round(similarity * 100) / 100,
                matchType: 'FUZZY'
            });
        }
    }

    return matches.sort((a, b) => b.confidence - a.confidence);
}

// ==================== PATTERN CLUSTERING ====================

/**
 * Cluster similar patterns together
 * @param {string[]} patterns - List of patterns
 * @param {number} threshold - Similarity threshold for clustering
 * @returns {Array<{representative: string, members: string[]}>}
 */
function clusterPatterns(patterns, threshold = 0.7) {
    const clusters = [];
    const assigned = new Set();

    for (const pattern of patterns) {
        if (assigned.has(pattern)) continue;

        const cluster = {
            representative: pattern,
            members: [pattern]
        };

        for (const other of patterns) {
            if (other === pattern || assigned.has(other)) continue;

            if (combinedSimilarity(pattern, other) >= threshold) {
                cluster.members.push(other);
                assigned.add(other);
            }
        }

        assigned.add(pattern);
        clusters.push(cluster);
    }

    return clusters;
}

/**
 * Find representative pattern for a group
 * @param {string[]} patterns - Group of similar patterns
 */
function findRepresentative(patterns) {
    if (patterns.length === 0) return null;
    if (patterns.length === 1) return patterns[0];

    // Find pattern closest to all others
    let bestPattern = patterns[0];
    let bestScore = 0;

    for (const candidate of patterns) {
        let score = 0;
        for (const other of patterns) {
            score += combinedSimilarity(candidate, other);
        }
        if (score > bestScore) {
            bestScore = score;
            bestPattern = candidate;
        }
    }

    return bestPattern;
}

// ==================== EXPORTS ====================

export {
    levenshtein,
    levenshteinSimilarity,
    jaccardSimilarity,
    combinedSimilarity,
    tokenize,
    findSimilar,
    fuzzyEquals,
    matchWithConfidence,
    clusterPatterns,
    findRepresentative
};

export default {
    levenshtein,
    levenshteinSimilarity,
    jaccardSimilarity,
    combinedSimilarity,
    findSimilar,
    fuzzyEquals,
    matchWithConfidence,
    clusterPatterns,
    findRepresentative
};
