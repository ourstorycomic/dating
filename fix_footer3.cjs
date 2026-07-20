const fs = require('fs');
const path = require('path');

const baseDir = 'components/templates';
for (let i = 2; i <= 6; i++) {
  const p = path.join(__dirname, baseDir, `wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(p)) continue;
  
  let c = fs.readFileSync(p, 'utf8');

  // Check if WeddingFooter is imported
  if (!c.includes('import { WeddingFooter }')) {
    c = c.replace('import React', 'import { WeddingFooter } from "../WeddingFooter";\nimport React');
  }

  // Check if WeddingFooter is rendered
  if (!c.includes('<WeddingFooter />')) {
    // Find the last </div>
    const lastDivIndex = c.lastIndexOf('</div>');
    if (lastDivIndex !== -1) {
      c = c.substring(0, lastDivIndex) + '      <WeddingFooter />\n    ' + c.substring(lastDivIndex);
    }
  }

  // Fix map hover color explicitly
  c = c.replace(/hover:bg-\[\#7A1F1F\] hover:text-white/g, 'hover:bg-[#7a1f1f] hover:text-white');
  c = c.replace(/hover:bg-\[\#7A1F1F\] hover:text-\[\#FFFFFF\]/g, 'hover:bg-[#7a1f1f] hover:text-white');
  c = c.replace(/hover:text-white/g, 'hover:text-[#ffffff]'); // ensure it forces white
  
  fs.writeFileSync(p, c, 'utf8');
  console.log('patched footer ' + i);
}
