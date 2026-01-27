// Demo file - contains violations
import { something } from './nonexistent.js';  // IMPROVE-004 will catch this!
import { another } from '../fake-module.js';   // This too!

function testMenu() {
    // Some code
    testMenu();  // Recursive call - MISTAKE-006 might catch
}

const data = customSelect();  // MISTAKE-005 will catch this!

console.log("Testing violations");
