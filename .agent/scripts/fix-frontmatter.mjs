/**
 * fix-frontmatter.mjs
 * 
 * Moves non-standard top-level YAML fields (category, triggers, coordinates_with, 
 * success_metrics) into the `metadata:` block to comply with the Claude Skill Guide.
 * 
 * Valid top-level fields: name, description, license, compatibility, allowed-tools, metadata
 * Everything else → metadata.{field}
 * 
 * Usage: node .agent/scripts/fix-frontmatter.mjs [--dry-run]
 */

import fs from 'fs';
import path from 'path';

const SKILLS_DIR = path.resolve('.agent/skills');
const DRY_RUN = process.argv.includes('--dry-run');

// Fields that are allowed at top-level per Claude Skill Guide
const VALID_TOP_LEVEL = new Set([
  'name', 'description', 'license', 'compatibility', 'allowed-tools', 'metadata'
]);

// Fields we expect to move into metadata
const FIELDS_TO_MOVE = ['category', 'triggers', 'coordinates_with', 'success_metrics'];

function findSkillFiles(dir) {
  const results = [];
  try {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      if (entry.isDirectory()) {
        results.push(...findSkillFiles(fullPath));
      } else if (entry.name === 'SKILL.md') {
        results.push(fullPath);
      }
    }
  } catch (e) { /* skip inaccessible dirs */ }
  return results;
}

function processSkillFile(filePath) {
  const content = fs.readFileSync(filePath, 'utf-8');
  
  // Must start with ---
  if (!content.startsWith('---')) return null;
  
  // Find closing ---
  const secondDash = content.indexOf('---', 3);
  if (secondDash === -1) return null;
  
  const frontmatter = content.substring(3, secondDash).trim();
  const body = content.substring(secondDash + 3);
  
  const lines = frontmatter.split('\n');
  
  // Parse: identify top-level fields vs indented (metadata children)
  const topLevelFields = {};   // field -> raw line(s)
  const metadataChildren = []; // already inside metadata:
  let currentField = null;
  let hasMetadata = false;
  let inMetadata = false;
  let fieldsToMove = {};
  let needsFix = false;
  
  for (const line of lines) {
    const isIndented = line.startsWith('  ') || line.startsWith('\t');
    
    if (!isIndented && line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const fieldName = line.substring(0, colonIdx).trim();
      currentField = fieldName;
      inMetadata = (fieldName === 'metadata');
      
      if (fieldName === 'metadata') {
        hasMetadata = true;
      } else if (FIELDS_TO_MOVE.includes(fieldName)) {
        fieldsToMove[fieldName] = line;
        needsFix = true;
      }
    } else if (isIndented && inMetadata) {
      metadataChildren.push(line);
    } else if (isIndented && FIELDS_TO_MOVE.includes(currentField)) {
      // Multi-line value for a field to move (e.g., description continuation)
      fieldsToMove[currentField] += '\n' + line;
    }
  }
  
  if (!needsFix) return null;
  
  // Rebuild frontmatter
  const newLines = [];
  let metadataWritten = false;
  inMetadata = false;
  currentField = null;
  
  for (const line of lines) {
    const isIndented = line.startsWith('  ') || line.startsWith('\t');
    
    if (!isIndented && line.includes(':')) {
      const colonIdx = line.indexOf(':');
      const fieldName = line.substring(0, colonIdx).trim();
      currentField = fieldName;
      
      // Skip fields that will be moved
      if (FIELDS_TO_MOVE.includes(fieldName)) {
        continue;
      }
      
      if (fieldName === 'metadata') {
        inMetadata = true;
        newLines.push(line);
        // Add existing metadata children
        for (const child of metadataChildren) {
          newLines.push(child);
        }
        // Add moved fields
        for (const [field, rawLine] of Object.entries(fieldsToMove)) {
          const colonPos = rawLine.indexOf(':');
          const value = rawLine.substring(colonPos + 1).trim();
          if (value) {
            newLines.push(`  ${field}: ${value}`);
          } else {
            newLines.push(`  ${field}:`);
          }
        }
        metadataWritten = true;
        continue;
      }
      
      inMetadata = false;
      newLines.push(line);
    } else if (isIndented) {
      // Skip indented lines that belong to moved fields
      if (FIELDS_TO_MOVE.includes(currentField)) {
        continue;
      }
      // Skip metadata children (already written above)
      if (inMetadata && metadataWritten) {
        continue;
      }
      newLines.push(line);
    } else {
      newLines.push(line);
    }
  }
  
  // If no metadata block existed, create one
  if (!metadataWritten) {
    newLines.push('metadata:');
    for (const [field, rawLine] of Object.entries(fieldsToMove)) {
      const colonPos = rawLine.indexOf(':');
      const value = rawLine.substring(colonPos + 1).trim();
      if (value) {
        newLines.push(`  ${field}: ${value}`);
      } else {
        newLines.push(`  ${field}:`);
      }
    }
  }
  
  const newContent = '---\n' + newLines.join('\n') + '\n---' + body;
  return newContent;
}

// Main
console.log(`🔍 Scanning ${SKILLS_DIR} for SKILL.md files...`);
console.log(DRY_RUN ? '📋 DRY RUN MODE (no files modified)\n' : '✏️  WRITE MODE\n');

const skillFiles = findSkillFiles(SKILLS_DIR);
console.log(`Found ${skillFiles.length} SKILL.md files\n`);

let fixed = 0;
let skipped = 0;
let errors = 0;

for (const filePath of skillFiles) {
  const relPath = path.relative(SKILLS_DIR, filePath);
  try {
    const result = processSkillFile(filePath);
    if (result === null) {
      skipped++;
      continue;
    }
    
    if (DRY_RUN) {
      console.log(`  ✅ [WOULD FIX] ${relPath}`);
    } else {
      fs.writeFileSync(filePath, result, 'utf-8');
      console.log(`  ✅ [FIXED] ${relPath}`);
    }
    fixed++;
  } catch (e) {
    console.log(`  ❌ [ERROR] ${relPath}: ${e.message}`);
    errors++;
  }
}

console.log(`\n${'─'.repeat(50)}`);
console.log(`📊 Results: ${fixed} fixed, ${skipped} already compliant, ${errors} errors`);
console.log(`   Total:   ${skillFiles.length} files scanned`);
