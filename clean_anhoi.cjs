const fs = require('fs');
const path = require('path');

const templates = ['wedding-2', 'wedding-3', 'wedding-4', 'wedding-5', 'wedding-6'];

templates.forEach(t => {
  let file = path.join(__dirname, 'components/templates', t, 'Experience.tsx');
  if (!fs.existsSync(file)) return;
  
  let c = fs.readFileSync(file, 'utf8');
  
  // Remove isEngagement variable
  c = c.replace(/const isEngagement = day === parsedEDate\.getDate\(\) && [^\n]*?;\n/g, '');
  
  // Remove isEngagement rendering logic (motion.div for engagement)
  c = c.replace(/\{isEngagement && \(\s*<motion\.div[^>]*?>\s*<\/motion\.div>\s*\)\}/g, '');
  // also handle ternary like `{isWedding || isEngagement ? ... : ...}`
  c = c.replace(/isWedding \|\| isEngagement/g, 'isWedding');
  
  // specific to wedding-6 (which had {isEngagement && ( ... )} inside)
  c = c.replace(/\{isEngagement && \([\s\S]*?\}\s*\)\}/g, '');
  
  // Remove Ăn Hỏi legend
  // It usually looks like:
  // <div className="flex items-center gap-2 ...">
  //   <div className="w-3 h-3 ..."></div> Ăn Hỏi
  // </div>
  c = c.replace(/<div[^>]*?>\s*<div[^>]*?>\s*<\/div>\s*Ăn Hỏi\s*<\/div>/g, '');
  
  fs.writeFileSync(file, c, 'utf8');
  console.log('Cleaned ' + t);
});
