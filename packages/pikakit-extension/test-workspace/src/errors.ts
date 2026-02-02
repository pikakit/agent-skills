/**
 * Test file with intentional TypeScript errors for E2E testing
 * 
 * This file contains various error patterns that PikaKit should detect
 */

// Error 1: Cannot find name (import missing)
const state = useState(0);  // useState not imported

// Error 2: Type mismatch
const num: number = "hello";  // string assigned to number

// Error 3: Property does not exist
const obj = { name: "test" };
console.log(obj.nonexistent);  // nonexistent property

// Error 4: Strict null check
function getValue(): string | undefined {
    return undefined;
}
const value = getValue();
console.log(value.length);  // possibly undefined

// Error 5: Module not found
import { something } from 'nonexistent-module';

// Error 6: Unused variable
const unusedVar = 42;

// Error 7: Missing return type (if strict mode)
function noReturn() {
    return 42;
}

export { };
