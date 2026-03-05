const fs = require('fs');
const path = require('path');

const files = [
    "decision-trees.md", "mobile-backend.md", "mobile-color-system.md",
    "mobile-debugging.md", "mobile-design-thinking.md", "mobile-navigation.md",
    "mobile-performance.md", "mobile-testing.md", "mobile-typography.md",
    "platform-android.md", "platform-ios.md", "touch-psychology.md"
];

const dir = "c:\\Users\\sofma\\Desktop\\agent-skill-kit\\.agent\\skills\\mobile-design";
const footer = "\n---\n\n⚡ PikaKit v3.9.74\n";

files.forEach(f => {
    const p = path.join(dir, f);
    if (fs.existsSync(p)) {
        let content = fs.readFileSync(p, 'utf8');
        // Remove any previous failed footer attempts (lines containing PikaKit)
        const lines = content.split('\n');
        while (lines.length > 0 && (lines[lines.length - 1].includes('PikaKit') || lines[lines.length - 1].trim() === '---' || lines[lines.length - 1].trim() === '')) {
            lines.pop();
        }
        content = lines.join('\n');
        fs.writeFileSync(p, content + footer, 'utf8');
        console.log(`Updated ${f}`);
    }
});
