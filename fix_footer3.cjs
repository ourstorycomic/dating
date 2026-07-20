const fs = require('fs');
const path = require('path');

const templatesDir = path.join(__dirname, 'components', 'templates');

const footerCode = `
      {/* Footer */}
      <div className="w-full py-8 bg-[#1a1a1a] flex flex-col items-center justify-center text-center px-4 relative z-50">
        <p className="text-[#d6cfc5] text-[10px] uppercase tracking-widest font-sans font-semibold mb-2">Designed by</p>
        <a href="https://www.lovora.click/wedding" target="_blank" rel="noopener noreferrer" className="text-white text-lg font-bold tracking-wider hover:text-[#C5A880] transition-colors" style={{ fontFamily: 'var(--font-dancing)' }}>Lovora Wedding</a>
      </div>
    </div>
  );
}`;

function processTemplates() {
  const folders = fs.readdirSync(templatesDir).filter(f => f.startsWith('wedding-') && f !== 'wedding-1');
  folders.forEach(folder => {
    const filePath = path.join(templatesDir, folder, 'Experience.tsx');
    if (fs.existsSync(filePath)) {
      let content = fs.readFileSync(filePath, 'utf8');

      if (!content.includes('Lovora Wedding')) {
        // Find the last </div> \n  );\n}
        const regex = /    <\/div>\s*  \);\s*\}\s*$/;
        content = content.replace(regex, footerCode);
        fs.writeFileSync(filePath, content, 'utf8');
        console.log('Patched footer for ' + folder);
      }
    }
  });
}

processTemplates();
