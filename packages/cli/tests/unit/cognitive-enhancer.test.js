// Unit Tests for CognitiveEnhancer
import { CognitiveEnhancer } from '../../src/core/learning/cognitive-enhancer.js';

console.log('🧪 Testing CognitiveEnhancer\n');

// Test 1: inferIntent()
console.log('Test 1: inferIntent()');
const tags = ['code-quality', 'imports'];
const intent = CognitiveEnhancer.inferIntent(tags);

console.assert(intent.goal, 'Should have goal');
console.assert(intent.category, 'Should have category');
console.assert(intent.strength >= 0 && intent.strength <= 1, 'Strength should be 0-1');
console.log(`✅ Intent: ${intent.goal} (${intent.category})\n`);

// Test 2: calculateMaturity()
console.log('Test 2: calculateMaturity()');
const improvements = [{ hitCount: 100, appliedCount: 100 }];
const mistakes = [];
const maturity = CognitiveEnhancer.calculateMaturity(mistakes, improvements, intent);

console.assert(maturity.state, 'Should have state');
console.assert(maturity.confidence >= 0 && maturity.confidence <= 1, 'Confidence should be 0-1');
console.assert(maturity.recommendation, 'Should have recommendation');
console.log(`✅ Maturity: ${maturity.state} (${(maturity.confidence * 100).toFixed(0)}%)\n`);

// Test 3: analyzeEvolution()
console.log('Test 3: analyzeEvolution()');
const evolution = CognitiveEnhancer.analyzeEvolution(mistakes, improvements, intent);

console.assert(Array.isArray(evolution.signals), 'Should have signals array');
console.assert(Array.isArray(evolution.missingAreas), 'Should have missingAreas array');
console.assert(evolution.nextAction, 'Should have nextAction');
console.log(`✅ Evolution: ${evolution.nextAction}\n`);

// Test 4: Edge cases
console.log('Test 4: Edge Cases');

// Empty tags
const emptyIntent = CognitiveEnhancer.inferIntent([]);
console.assert(emptyIntent.category === 'general', 'Empty tags should default to general');
console.log(`✅ Empty tags handled\n`);

// High mistake count
const highMistakes = Array(50).fill({ hitCount: 10 });
const highMaturity = CognitiveEnhancer.calculateMaturity(highMistakes, [], intent);
console.assert(highMaturity.state === 'RAW', 'Many mistakes should be RAW');
console.log(`✅ High mistakes = RAW state\n`);

// Perfect state
const perfectImprovements = [{ hitCount: 1000, appliedCount: 1000 }];
const perfectMaturity = CognitiveEnhancer.calculateMaturity([], perfectImprovements, intent);
console.assert(perfectMaturity.state === 'IDEAL', 'Only improvements should be IDEAL');
console.log(`✅ Only improvements = IDEAL state\n`);

console.log('🎉 All CognitiveEnhancer tests passed!');
