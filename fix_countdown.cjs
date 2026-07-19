const fs = require('fs');
const path = require('path');

// Fix InteractiveTemplatePreview.tsx
let p = path.join(__dirname, 'components/templates/InteractiveTemplatePreview.tsx');
let c = fs.readFileSync(p, 'utf8');
c = c.replace(/2025-12-14/g, '2026-12-14');
fs.writeFileSync(p, c, 'utf8');

// Fix Experience.tsx for all templates
for (let i = 1; i <= 6; i++) {
  let expPath = path.join(__dirname, `components/templates/wedding-${i}/Experience.tsx`);
  if (!fs.existsSync(expPath)) continue;
  let expContent = fs.readFileSync(expPath, 'utf8');
  
  // Update year to 2026
  expContent = expContent.replace(/2025-12-14/g, '2026-12-14');
  expContent = expContent.replace(/2025-12-12/g, '2026-12-12'); // engagementDate
  
  // Fix countdown targetDate
  expContent = expContent.replace(
    /const targetDate = new Date\(weddingDate\)\.getTime\(\);/g,
    'const targetDate = new Date(customData?.weddingDate || weddingDate).getTime();'
  );
  
  // Fix order of customData override
  // Often it's parsedDDate = new Date(weddingDate || '2026-12-14')
  expContent = expContent.replace(
    /const parsedDDate = new Date\(weddingDate \|\|/g,
    'const parsedDDate = new Date(customData?.weddingDate || weddingDate ||'
  );
  
  expContent = expContent.replace(
    /const parsedEDate = new Date\(engagementDate \|\|/g,
    'const parsedEDate = new Date(customData?.engagementDate || engagementDate ||'
  );

  fs.writeFileSync(expPath, expContent, 'utf8');
}
console.log("Done fixing countdown and 2026 dates!");
