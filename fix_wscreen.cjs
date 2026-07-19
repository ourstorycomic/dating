const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const dirs = [
  'components/templates',
  'components/gift',
];

let totalFixes = 0;

for (const dir of dirs) {
  const fullDir = path.join(__dirname, dir);
  if (!fs.existsSync(fullDir)) continue;

  // Recursively find all tsx/ts files
  const files = execSync(`dir /s /b "${fullDir}\\*.tsx"`, { encoding: 'utf8' })
    .split('\r\n').filter(Boolean);

  for (const file of files) {
    let content = fs.readFileSync(file, 'utf8');
    const original = content;

    // Replace w-screen with w-full
    content = content.replace(/\bw-screen\b/g, 'w-full');
    // Replace min-w-screen with min-w-full
    content = content.replace(/\bmin-w-screen\b/g, 'min-w-full');
    // Replace 100vw in style props
    content = content.replace(/width:\s*["']?100vw["']?/g, "width: '100%'");
    content = content.replace(/width:\s*`100vw`/g, "width: '100%'");
    // Replace Tailwind arbitrary [100vw]
    content = content.replace(/w-\[100vw\]/g, 'w-full');
    content = content.replace(/max-w-\[100vw\]/g, 'max-w-full');

    if (content !== original) {
      fs.writeFileSync(file, content, 'utf8');
      const rel = path.relative(__dirname, file);
      console.log('Fixed:', rel);
      totalFixes++;
    }
  }
}

console.log(`\nDone. Fixed ${totalFixes} file(s).`);
