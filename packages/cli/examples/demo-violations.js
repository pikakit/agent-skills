/**
 * Demo Violations File - PikaKit CLI Testing
 * 
 * Purpose: This file intentionally contains code violations to test
 * the CLI's violation detection system (self-evolution signals).
 * 
 * Expected Violations:
 * - IMPROVE-004: Missing import resolution
 * - MISTAKE-005: Undefined function usage
 * - MISTAKE-006: Recursive call pattern
 */

// IMPROVE-004: Import from non-existent file
import { something } from './nonexistent.js';
import { another } from '../fake-module.js';

// MISTAKE-006: Recursive call without base case
function testMenu() {
    console.log("Testing recursive pattern");
    testMenu(); // This will be detected
}

// MISTAKE-005: Undefined function call
const data = customSelect();

console.log("CLI Violation Detection Test");
console.log("This file is used by: npm run example:violations");
