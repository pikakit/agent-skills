const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dir = path.join(__dirname, '.agent', 'skills');
let count = 0;

walkDir(dir, function (filePath) {
  if (!filePath.endsWith('.md')) return;

  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;

  // Remove all instances of the footer text
  content = content.replace(/⚡ PikaKit v\d+\.\d+\.\d+/g, '');

  // Strip all trailing dashes and whitespaces at the end of the file
  content = content.replace(/(?:\s*---)*\s*$/g, '');

  // Re-append exactly one footer block
  content += '\n\n---\n\n⚡ PikaKit v3.9.108\n';

  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log("Updated: " + filePath);
  }
});

console.log(`Updated ${count} files.`);
