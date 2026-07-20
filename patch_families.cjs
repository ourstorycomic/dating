const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'components', 'templates');
const folders = ['wedding-2', 'wedding-3', 'wedding-4', 'wedding-5', 'wedding-6'];

folders.forEach(folder => {
  const filePath = path.join(templatesDir, folder, 'Experience.tsx');
  if (fs.existsSync(filePath)) {
    let content = fs.readFileSync(filePath, 'utf8');
    let changed = false;

    const processTag = (regex, type) => {
      const match = content.match(regex);
      if (match) {
        let tag = match[0];
        tag = tag.replace(/\s*uppercase\s*/g, ' ');
        tag = tag.replace(/\s*font-bold\s*/g, ' ');
        tag = tag.replace(/\s*text-sm\s*/g, ' ');
        tag = tag.replace('className="', 'className="text-2xl sm:text-3xl whitespace-pre-line leading-relaxed font-normal ');
        
        if (tag.includes('style={{')) {
           tag = tag.replace('style={{', "style={{ fontFamily: 'var(--font-dancing)', ");
        } else {
           tag = tag.replace('>', " style={{ fontFamily: 'var(--font-dancing)' }}>");
        }

        if (type === 'groom') {
          tag = tag.replace(/\{groomFamily[^}]*\}/, '{groomFamily || "Ông Phạm Văn Long\\nBà Lê Thị Mai"}');
        } else {
          tag = tag.replace(/\{brideFamily[^}]*\}/, '{brideFamily || "Ông Nguyễn Văn Hùng\\nBà Trần Thị Hoa"}');
        }

        content = content.replace(match[0], tag);
        changed = true;
      }
    };

    processTag(/<p[^>]*>\s*\{groomFamily\s*\|\|[^}]*\}\s*<\/p>/, 'groom');
    processTag(/<p[^>]*>\s*\{brideFamily\s*\|\|[^}]*\}\s*<\/p>/, 'bride');

    if (changed) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log('Patched families in ' + folder);
    }
  }
});
