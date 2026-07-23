const fs = require('fs');
const glob = require('glob');
const files = glob.sync('d:/dating/**/*.{tsx,ts}', { ignore: 'd:/dating/node_modules/**' });
let changedCount = 0;
for (const file of files) {
  let content = fs.readFileSync(file, 'utf8');
  const newContent = content.replace(/new Date\(([^)]+)\)\.toLocaleString\(['"]vi-VN['"]\)/g, 'new Date($1).toLocaleString("vi-VN", { timeZone: "Asia/Ho_Chi_Minh" })');
  if (content !== newContent) {
    fs.writeFileSync(file, newContent, 'utf8');
    console.log('Updated', file);
    changedCount++;
  }
}
console.log('Total changed:', changedCount);
