const fs = require('fs');
const path = require('path');

function walkDir(dir, callback) {
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walkDir(dirPath, callback) : callback(path.join(dir, f));
  });
}

const dir = 'c:\\Users\\sofma\\Desktop\\agent-skill-kit\\.agent\\skills';
let count = 0;

walkDir(dir, function(filePath) {
  if (!filePath.endsWith('.md')) return;
  
  let content = fs.readFileSync(filePath, 'utf8');
  let original = content;
  
  // Replace standalone block with dashes
  content = content.replace(/\n+---\n+⚡ PikaKit v3\.9\.105\n+---/g, '\n\n---');
  
  // Replace blocks at end of file
  content = content.replace(/\n+---\n+⚡ PikaKit v3\.9\.105\s*$/g, '');
  
  // Remove all other remaining raw strings
  content = content.replace(/⚡ PikaKit v3\.9\.105/g, '');
  
  // Add single footer at the end
  content = content.trimEnd();
  content += '\n\n---\n\n⚡ PikaKit v3.9.105\n';
  
  if (original !== content) {
    fs.writeFileSync(filePath, content, 'utf8');
    count++;
    console.log("Updated: " + filePath);
  }
});

console.log(`Updated ${count} files.`);
